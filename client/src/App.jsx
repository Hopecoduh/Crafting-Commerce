// client/src/App.jsx
import { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { api, setToken, clearToken, getToken } from "./api";
import ShopGrid from "./pages/ShopGrid";
import ShopDetail from "./pages/ShopDetail";
import Inventory from "./pages/Inventory";

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
    <Routes>
      <Route
        path="/"
        element={
          <Inventory
            me={me}
            materials={materials}
            items={items}
            recipes={recipes}
            onLoot={refreshInventoryOnly}
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
        }
      />
      <Route path="/npc-shops" element={<ShopGrid me={me} />} />
      <Route path="/npc-shops/:id" element={<ShopDetail />} />
      <Route path="*" element={<div>Route not found</div>} />
    </Routes>
  );
}
