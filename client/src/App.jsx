// client/src/App.jsx
import { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { api, setToken, clearToken, getToken } from "./api";
import ShopGrid from "./pages/ShopGrid";
import ShopDetail from "./pages/ShopDetail";
import Inventory from "./pages/Inventory";
import AuthPage from "./pages/AuthPage";
import Character from "./pages/Character";

import ActionBar from "./components/actions/ActionBar";
import CraftingBar from "./components/crafting/CraftingBar";

export default function App() {
  const [loading, setLoading] = useState(true);
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
    return <AuthPage onAuthSuccess={loadAll} />;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Inventory
            me={me}
            logout={logout}
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
      <Route path="/character" element={<Character me={me} />} />
      <Route path="/npc-shops" element={<ShopGrid me={me} logout={logout} />} />
      <Route path="/npc-shops/:id" element={<ShopDetail />} />
      <Route path="*" element={<div>Route not found</div>} />
    </Routes>
  );
}
