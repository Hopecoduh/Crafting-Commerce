// client/src/App.jsx
import { useEffect, useState } from "react";
import { api, setToken, clearToken, getToken } from "./api";

import ActionBar from "./components/actions/ActionBar";
import CraftingBar from "./components/crafting/CraftingBar";

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

  // Player shop
  const [myListings, setMyListings] = useState([]);
  const [stockInputs, setStockInputs] = useState({});
  const [listingEdits, setListingEdits] = useState({});
  const [busy, setBusy] = useState({});

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
    } catch {
      setMe(null);
    }
  }

  async function refreshInventoryOnly() {
    try {
      setMaterials(await api.materials());
      setItems(await api.items());
    } catch (e) {
      setError(e.message || "Failed to refresh inventory");
    }
  }

  useEffect(() => {
    setLoading(false);
    if (getToken()) loadAll();
  }, []);

  async function handleAuth(e) {
    e.preventDefault();
    setError("");

    try {
      const res =
        authMode === "login"
          ? await api.login({ email, password })
          : await api.register({
              email,
              password,
              display_name: displayName,
            });

      setToken(res.token);
      await loadAll();
    } catch (e) {
      setError(e.message);
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

  // ---------------- UI ----------------

  if (loading) {
    return <div style={{ padding: 20 }}>Loading…</div>;
  }

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
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {authMode === "register" && (
            <input
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
      <ActionBar onLoot={refreshInventoryOnly} />

      <hr />

      {/* CRAFTING */}
      <h3>Crafting</h3>
      <CraftingBar
        recipes={recipes}
        materials={materials}
        onCraft={async (recipeId) => {
          try {
            await api.craft(recipeId);
            setMaterials(await api.materials());
            setItems(await api.items());
          } catch (e) {
            setError(e.message || "Craft failed");
            throw e;
          }
        }}
      />

      <hr />

      {/* MATERIALS */}
      <h3>Materials</h3>
      {materials.map((m) => (
        <div key={m.id}>
          {m.name} — {m.quantity ?? 0}
        </div>
      ))}

      {/* ITEMS */}
      <h3 style={{ marginTop: 24 }}>Items</h3>
      {items.map((it) => (
        <div key={it.id} style={{ marginBottom: 10 }}>
          <b>{it.name}</b> — Qty: {it.quantity ?? 0}
          <div>
            <input
              type="number"
              placeholder="price"
              value={stockInputs[it.id]?.price || ""}
              onChange={(e) =>
                setStockInputs((p) => ({
                  ...p,
                  [it.id]: { ...p[it.id], price: Number(e.target.value) },
                }))
              }
            />
            <button onClick={() => stockStore(it)}>List</button>
          </div>
        </div>
      ))}

      {/* MY STORE */}
      <h3 style={{ marginTop: 24 }}>My Store</h3>
      {myListings.length === 0 && <div>Store empty</div>}

      {myListings.map((l) => (
        <div key={l.id}>
          {l.item_name} — {l.quantity} @ {l.price}
        </div>
      ))}
    </div>
  );
}
