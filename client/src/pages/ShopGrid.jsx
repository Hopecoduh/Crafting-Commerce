import React from "react";
import { api } from "../api";
import NavBar from "../components/rpg/NavBar";
import ShopCard from "../components/rpg/ShopCard";
import { Search, SlidersHorizontal } from "lucide-react";

export default function ShopGrid({ me }) {
  const [search, setSearch] = React.useState("");
  const [filterTier, setFilterTier] = React.useState("All");

  const tiers = ["All", "Common", "Rare", "Legendary"];

  // ✅ shops state must come BEFORE filteredShops
  const [shops, setShops] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    let alive = true;

    async function load() {
      try {
        const data = await api.npcShops();
        if (!alive) return;
        setShops(data || []);
      } catch (e) {
        if (!alive) return;
        setError(e.message || "Failed to load shops");
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, []);

  // ✅ filteredShops must come AFTER shops is declared
  const filteredShops = shops.filter((shop) => {
    const name = shop.name || "";
    const description = shop.description || "";
    const tier = shop.tier || "Common";

    const matchSearch =
      name.toLowerCase().includes(search.toLowerCase()) ||
      description.toLowerCase().includes(search.toLowerCase());

    const matchTier = filterTier === "All" || tier === filterTier;

    return matchSearch && matchTier;
  });

  return (
    <div className="min-h-screen bg-[#0a0a14]">
      <NavBar
        currentPage="ShopGrid"
        gold={me?.player?.coins ?? 0}
        name={me?.user?.display_name ?? "Player"}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Hero section */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-100 mb-2">
            Merchant's Quarter
          </h1>
          <p className="text-sm text-slate-500 max-w-lg">
            Browse the finest shops in the realm. Trade goods, acquire powerful
            equipment, and prepare for your next adventure.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search shops..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-amber-700/50 focus:ring-1 focus:ring-amber-700/20 transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-slate-500" />
            {tiers.map((tier) => (
              <button
                key={tier}
                onClick={() => setFilterTier(tier)}
                className={`px-3.5 py-2 rounded-lg text-[11px] font-bold tracking-wider uppercase transition-all duration-200 ${
                  filterTier === tier
                    ? "bg-amber-600/20 text-amber-400 border border-amber-600/30"
                    : "text-slate-500 hover:text-slate-300 border border-transparent hover:border-slate-700/40"
                }`}
              >
                {tier}
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="text-slate-400 text-sm py-10">Loading shops...</div>
        )}

        {error && <div className="text-red-400 text-sm py-10">{error}</div>}

        {/* Grid */}
        {filteredShops.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredShops.map((shop) => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-slate-500 text-sm">
              No shops match your search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
