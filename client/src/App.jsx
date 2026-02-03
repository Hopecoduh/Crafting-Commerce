import { useEffect, useState } from "react";
import { api, setToken, clearToken, getToken } from "./api";

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

  async function loadAll() {
    setError("");
    setLoading(true);
    try {
      const meRes = await api.me();
      setMe(meRes);

      const matsRes = await api.materials();
      setMaterials(matsRes);

      const recipesRes = await api.recipes();
      setRecipes(recipesRes);
    } catch (e) {
      setMe(null);
    } finally {
      setLoading(false);
    }
    const itemsRes = await api.items();
    setItems(itemsRes);
  }

  useEffect(() => {
    if (getToken()) loadAll();
    else setLoading(false);
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

  async function doGather(materialId) {
    setError("");
    try {
      await api.gather(materialId);
      const matsRes = await api.materials();
      setMaterials(matsRes);
    } catch (e) {
      setError(e.message);
    }
  }

  async function doCraft(recipeId) {
    setError("");
    try {
      await api.craft(recipeId);
      const matsRes = await api.materials();
      setMaterials(matsRes);
    } catch (e) {
      setError(e.message);
    }
    const itemsRes = await api.items();
    setItems(itemsRes);
  }

  function logout() {
    clearToken();
    setMe(null);
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
        <h2>Welcome, {me.user.display_name}</h2>
        <button onClick={logout}>Logout</button>
      </div>

      <p>
        Coins: <b>{me.player.coins}</b>
      </p>

      {error && (
        <div style={{ color: "crimson", marginBottom: 12 }}>{error}</div>
      )}

      <hr />

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
            <button onClick={() => doGather(m.id)}>Gather +1</button>
          </div>
        ))}
      </div>
      <h3 style={{ marginTop: 24 }}>Items</h3>
      <div style={{ display: "grid", gap: 8, maxWidth: 520 }}>
        {(items || []).map((it) => (
          <div
            key={it.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              border: "1px solid #ddd",
              padding: 10,
              borderRadius: 8,
            }}
          >
            <div>
              <b>{it.name}</b> — Qty: {it.quantity ?? 0}
            </div>
          </div>
        ))}
      </div>

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
              <button onClick={() => doCraft(r.recipe_id)}>Craft</button>
            </div>
            <div style={{ marginTop: 8, fontSize: 14 }}>
              Needs:{" "}
              {r.ingredients.map((ing, idx) => (
                <span key={ing.material_id}>
                  {ing.material_name} x{ing.quantity}
                  {idx < r.ingredients.length - 1 ? ", " : ""}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
