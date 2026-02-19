import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api";
import NavBar from "../components/rpg/NavBar";
import TabSwitcher from "../components/rpg/TabSwitcher";
import ItemRow from "../components/rpg/ItemRow";
import { ArrowLeft, MapPin, Star, Package } from "lucide-react";

export default function ShopDetail({ me }) {
  const { id } = useParams();
  const shopId = Number(id);

  const [shop, setShop] = useState(null);
  const [shopItems, setShopItems] = useState([]);
  const [playerItems, setPlayerItems] = useState([]);
  const [activeTab, setActiveTab] = useState("buy");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadShop() {
    try {
      setLoading(true);
      setError("");

      const shops = await api.npcShops();
      const stockResponse = await api.npcShopStock(shopId);
      const playerInventory = await api.items();

      const foundShop = Array.isArray(shops)
        ? shops.find((s) => Number(s.id) === shopId)
        : null;

      setShop(stockResponse?.shop || foundShop || null);

      // SHOP STOCK (buy tab)
      const normalizedStock = Array.isArray(stockResponse?.stock)
        ? stockResponse.stock.map((row) => ({
            item_id: row.item_id,
            item_name: row.item_name,
            buy_price: Number(row.buy_price) || 0,
            sell_price: Number(row.sell_price) || 0,
            quantity: Number(row.quantity) || 0,
          }))
        : [];

      setShopItems(normalizedStock);

      // PLAYER ITEMS (sell tab)
      const normalizedPlayer = Array.isArray(playerInventory)
        ? playerInventory
            .filter((i) => Number(i.quantity) > 0)
            .map((i) => {
              // check if shop buys this item
              const shopMatch = normalizedStock.find((s) => s.item_id === i.id);

              return {
                item_id: i.id,
                item_name: i.name,
                quantity: Number(i.quantity),
                sell_price: shopMatch?.sell_price ?? null, // null means shop won't buy it
              };
            })
        : [];

      setPlayerItems(normalizedPlayer);
    } catch (e) {
      setError(e.message || "Failed to load shop");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (Number.isFinite(shopId) && me) {
      loadShop();
    }
  }, [shopId, me]);

  // BUY
  async function handleBuy(itemId, qty) {
    try {
      await api.npcBuy(shopId, itemId, qty);
      await loadShop();
    } catch (e) {
      alert(e.message);
    }
  }

  // SELL
  async function handleSell(itemId, qty) {
    try {
      await api.npcSell(shopId, itemId, qty);
      await loadShop();
    } catch (e) {
      alert(e.message);
    }
  }

  const currentItems = activeTab === "buy" ? shopItems : playerItems;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a14] flex items-center justify-center text-slate-400">
        Loading shop...
      </div>
    );
  }

  if (error || !shop) {
    return (
      <div className="min-h-screen bg-[#0a0a14]">
        <NavBar currentPage="" />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center text-red-400">
          {error || "Shop not found"}
          <div className="mt-6">
            <Link to="/npc-shops" className="text-amber-400 hover:underline">
              Return to shops
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a14]">
      <NavBar currentPage="" />

      {/* Header */}
      <div className="relative">
        <div className="h-48 sm:h-64 overflow-hidden bg-slate-900" />
        <div className="absolute inset-x-0 bottom-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-6">
            <Link
              to="/npc-shops"
              className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-amber-400 mb-4"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to shops
            </Link>

            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white">
                  {shop.name}
                </h1>
                <p className="text-sm text-slate-400 max-w-lg">
                  {shop.description}
                </p>
              </div>

              <div className="flex items-center gap-5 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  {shop.location || "Kingdom"}
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span className="text-amber-400 font-semibold">
                    {shop.rating || 5}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <TabSwitcher activeTab={activeTab} onTabChange={setActiveTab} />
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Package className="w-3.5 h-3.5" />
            {currentItems.length} items available
          </div>
        </div>

        <div className="space-y-2">
          {currentItems.map((item, index) => (
            <ItemRow
              key={`${item.item_id}-${index}`}
              item={item}
              mode={activeTab}
              onBuy={handleBuy}
              onSell={handleSell}
            />
          ))}
        </div>

        {currentItems.length === 0 && (
          <div className="text-center py-16 text-slate-500 text-sm">
            No items available.
          </div>
        )}
      </div>
    </div>
  );
}
