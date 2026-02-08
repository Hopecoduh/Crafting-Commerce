import { useEffect, useState } from "react";
import { api, setToken, clearToken, getToken } from "./api";
import ActionBar from "./components/actions/ActionBar";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [authMode, setAuthMode] = useState("login"); // login | register
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("password123");
  const [displayName, setDisplayName] = useState("Test");
  const [me, setMe] = useState(null);
  const [error, setError] = useState("");

  const [materials, setMaterials] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [items, setItems] = useState([]);

  // Store
  const [myListings, setMyListings] = useState([]);
  const [stockInputs, setStockInputs] = useState({}); // { [itemId]: { qty, price } }
  const [listingEdits, setListingEdits] = useState({}); // { [listingId]: price }
  const [busy, setBusy] = useState({}); // { [key]: true }

  // Timers
  const [crafting, setCrafting] = useState({}); // { [recipeId]: { endsAt, itemName } }
  const [now, setNow] = useState(Date.now());

  function setBusyKey(key, val) {
    setBusy((p) => ({ ...p, [key]: val }));
  }

  async function loadAll() {
    setError("");
    try {
      const meRes = await api.me();
      setMe(meRes);

      setMaterials(await api.materials());
      setRecipes(await api.recipes());
      setItems(await api.items());
      setMyListings(await api.myListings());
    } catch (e) {
      setMe(null);
    }
  }

  async function refreshInventoryOnly() {
    setError("");
    try {
      // (Optional) if actions might affect coins later, you can also refresh `me`
      setMaterials(await api.materials());
      setItems(await api.items());
    } catch (e) {
      // if token expired, api wrapper will throw
      setError(e.message || "Failed to refresh inventory");
    }
  }

  useEffect(() => {
    setLoading(false); // release UI immediately
    if (getToken()) loadAll(); // fetch in background if logged in
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // tick for countdown UI
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, []);

  async function handleAuth(e) {
    e.preventDefault();
    setError("");

    try {
      const res =
        authMode === "login"
          ? await api.login({ email, password })
          : await api.register({ email, password, display_name: displayName });

      setToken(res.token);
      await loadAll();
    } catch (e) {
      setError(e.message);
    }
  }

  // Use recipe_id timing so names never break timing
  const CRAFT_SECONDS_BY_RECIPE = {
    1: 60, // plank
    2: 80, // stone brick
    3: 300, // iron ingot
  };

  async function doCraft(recipeId) {
    setError("");

    // prevent double-click crafting
    if (crafting[recipeId]) return;

    const r = (recipes || []).find((x) => x.recipe_id === recipeId);
    const itemName = r?.item_name ?? "item";
    const seconds = CRAFT_SECONDS_BY_RECIPE[recipeId] ?? 60;

    const endsAt = Date.now() + seconds * 1000;

    setCrafting((p) => ({ ...p, [recipeId]: { endsAt, itemName } }));

    try {
      await new Promise((resolve) => setTimeout(resolve, seconds * 1000));

      await api.craft(recipeId);
      setMaterials(await api.materials());
      setItems(await api.items());

      alert(`✅ Craft complete! +1 ${itemName}`);
    } catch (e) {
      setError(e.message);
    } finally {
      setCrafting((p) => {
        const copy = { ...p };
        delete copy[recipeId];
        return copy;
      });
    }
  }

  async function stockStore(item) {
    setError("");

    const qty = stockInputs[item.id]?.qty ?? 1;
    const price = stockInputs[item.id]?.price ?? 10;

    try {
      await api.listItem({
        item_id: item.id,
        quantity: qty,
        price,
      });

      setItems(await api.items());
      setMyListings(await api.myListings());

      setStockInputs((prev) => {
        const copy = { ...prev };
        delete copy[item.id];
        return copy;
      });
    } catch (e) {
      setError(e.message);
    }
  }

  function logout() {
    clearToken();
    setMe(null);
    setMaterials([]);
    setRecipes([]);
    setItems([]);
    setMyListings([]);
  }

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;

  if (!me) {
    return (
      <div style={{ padding: 20, maxWidth: 420 }}>
        <h2>Crafting-Commerce</h2>

        <div style={{ marginBottom: 12 }}>
          <button
            onClick={() => setAuthMode("login")}
            disabled={authMode === "login"}
          >
            Login
          </button>{" "}
          <button
            onClick={() => setAuthMode("register")}
            disabled={authMode === "register"}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleAuth} style={{ display: "grid", gap: 10 }}>
          <input
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            placeholder="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {authMode === "register" && (
            <input
              placeholder="display name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          )}

          <button type="submit">
            {authMode === "login" ? "Login" : "Create Account"}
          </button>

          {error && <div style={{ color: "crimson" }}>{error}</div>}
        </form>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Welcome, {me.user?.display_name ?? "Player"}</h2>
        <button onClick={logout}>Logout</button>
      </div>

      <p>
        Coins: <b>{me.player?.coins ?? 0}</b>
      </p>

      {error && (
        <div style={{ color: "crimson", marginBottom: 12 }}>{error}</div>
      )}

      <hr />

      {/* ACTIONS */}
      <h3>Actions</h3>
      <ActionBar
        onLoot={async () => {
          // any time an action returns drops, refresh inventory
          await refreshInventoryOnly();
        }}
      />

      <hr style={{ margin: "20px 0" }} />

      {/* MATERIALS */}
      <h3>Materials</h3>
      <div style={{ display: "grid", gap: 8, maxWidth: 520 }}>
        {(materials || []).map((m) => (
          <div
            key={m.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              border: "1px solid #ddd",
              padding: 10,
              borderRadius: 8,
            }}
          >
            <div>
              <b>{m.name}</b> — Qty: {m.quantity ?? 0}
            </div>
          </div>
        ))}
      </div>

      {/* ITEMS */}
      <h3 style={{ marginTop: 24 }}>Items</h3>
      <div style={{ display: "grid", gap: 8, maxWidth: 520 }}>
        {(items || []).map((it) => (
          <div
            key={it.id}
            style={{
              border: "1px solid #ddd",
              padding: 10,
              borderRadius: 8,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <b>{it.name}</b> — Qty: {it.quantity ?? 0}
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              {/* Qty stepper */}
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <button
                  onClick={() =>
                    setStockInputs((prev) => ({
                      ...prev,
                      [it.id]: {
                        ...prev[it.id],
                        qty: Math.max(1, (prev[it.id]?.qty ?? 1) - 1),
                      },
                    }))
                  }
                >
                  −
                </button>

                <span style={{ minWidth: 20, textAlign: "center" }}>
                  {stockInputs[it.id]?.qty ?? 1}
                </span>

                <button
                  onClick={() =>
                    setStockInputs((prev) => ({
                      ...prev,
                      [it.id]: {
                        ...prev[it.id],
                        qty: Math.min(it.quantity, (prev[it.id]?.qty ?? 1) + 1),
                      },
                    }))
                  }
                >
                  +
                </button>
              </div>

              {/* Price per item */}
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <input
                  type="number"
                  min="1"
                  placeholder="Price"
                  value={stockInputs[it.id]?.price || ""}
                  onChange={(e) =>
                    setStockInputs((prev) => ({
                      ...prev,
                      [it.id]: {
                        ...prev[it.id],
                        price: Number(e.target.value),
                      },
                    }))
                  }
                  style={{ width: 90 }}
                />
                <span style={{ fontSize: 12, color: "#666" }}>coins each</span>
              </div>

              <button disabled={!it.quantity} onClick={() => stockStore(it)}>
                List for sale
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* RECIPES */}
      <h3 style={{ marginTop: 24 }}>Recipes</h3>
      <div style={{ display: "grid", gap: 10, maxWidth: 640 }}>
        {recipes.map((r) => (
          <div
            key={r.recipe_id}
            style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8 }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <b>{r.item_name}</b> (base price: {r.base_price})
              </div>

              <button
                disabled={!!crafting[r.recipe_id]}
                onClick={() => doCraft(r.recipe_id)}
              >
                {crafting[r.recipe_id]
                  ? `Crafting… ${Math.max(
                      0,
                      Math.ceil((crafting[r.recipe_id].endsAt - now) / 1000),
                    )}s`
                  : "Craft"}
              </button>
            </div>

            <div style={{ marginTop: 8, fontSize: 14 }}>
              Needs:{" "}
              {(r.ingredients || []).map((ing, idx) => (
                <span key={ing.material_id}>
                  {ing.material_name} x{ing.quantity}
                  {idx < r.ingredients.length - 1 ? ", " : ""}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* MY STORE */}
      <h3 style={{ marginTop: 24 }}>My Store</h3>

      {myListings.length === 0 && (
        <p style={{ color: "#666" }}>Your store is empty.</p>
      )}

      <div style={{ display: "grid", gap: 10, maxWidth: 520 }}>
        {myListings.map((l) => (
          <div
            key={l.id}
            style={{ border: "1px solid #ddd", padding: 10, borderRadius: 8 }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <b>{l.item_name}</b>
              <span>Qty: {l.quantity}</span>
            </div>

            <div style={{ marginTop: 6, fontSize: 13, color: "#666" }}>
              Total value: <b>{l.price * l.quantity}</b> coins
            </div>

            <div
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                marginTop: 8,
              }}
            >
              <span style={{ width: 50 }}>Price</span>

              <input
                type="number"
                min="1"
                value={listingEdits[l.id] ?? l.price}
                onChange={(e) =>
                  setListingEdits((p) => ({
                    ...p,
                    [l.id]: Number(e.target.value),
                  }))
                }
                style={{ width: 90 }}
              />

              <span>coins</span>

              <button
                disabled={
                  busy[`price-${l.id}`] ||
                  (listingEdits[l.id] ?? l.price) === l.price
                }
                onClick={async () => {
                  const key = `price-${l.id}`;
                  setError("");
                  setBusyKey(key, true);
                  try {
                    await api.updateListingPrice(
                      l.id,
                      listingEdits[l.id] ?? l.price,
                    );
                    setMyListings(await api.myListings());
                  } catch (err) {
                    setError(err.message);
                  } finally {
                    setBusyKey(key, false);
                  }
                }}
              >
                {busy[`price-${l.id}`] ? "Saving..." : "Save"}
              </button>
            </div>

            <button
              style={{ marginTop: 10 }}
              onClick={async () => {
                setError("");
                try {
                  await api.unlist(l.id);
                  setItems(await api.items());
                  setMyListings(await api.myListings());
                } catch (e) {
                  setError(e.message);
                }
              }}
            >
              Unlist (return to inventory)
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
