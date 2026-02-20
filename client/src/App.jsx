// client/src/App.jsx
import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { api, setToken, clearToken, getToken } from "./api";

import ShopGrid from "./pages/ShopGrid";
import ShopDetail from "./pages/ShopDetail";
import Inventory from "./pages/Inventory";
import AuthPage from "./pages/AuthPage";
import Character from "./pages/Character";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState(null);
  const [error, setError] = useState("");

  const [materials, setMaterials] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [items, setItems] = useState([]);

  // ---------------- LOAD ALL ----------------

  async function loadAll() {
    setError("");
    try {
      const meRes = await api.me();
      setMe(meRes);

      const [materialsRes, recipesRes, itemsRes] = await Promise.all([
        api.materials(),
        api.recipes(),
        api.items(),
      ]);

      setMaterials(materialsRes);
      setRecipes(recipesRes);
      setItems(itemsRes);
    } catch (e) {
      console.error(e);
      setError(e.message || "Failed to load data");
      clearToken();
      setMe(null);
    }
  }

  // ---------------- INITIAL LOAD ----------------

  useEffect(() => {
    async function init() {
      if (getToken()) {
        await loadAll();
      }
      setLoading(false);
    }

    init();
  }, []);

  // ---------------- INVENTORY REFRESH ----------------

  async function refreshInventoryOnly() {
    try {
      const [materialsRes, itemsRes] = await Promise.all([
        api.materials(),
        api.items(),
      ]);

      setMaterials(materialsRes);
      setItems(itemsRes);
    } catch (e) {
      setError(e.message || "Failed to refresh inventory");
    }
  }

  // ---------------- LOGOUT ----------------

  function logout() {
    clearToken();
    setMe(null);
    setMaterials([]);
    setRecipes([]);
    setItems([]);
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
                await refreshInventoryOnly();
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
