// client/src/pages/Character.jsx
import React from "react";
import NavBar from "../components/rpg/NavBar";

export default function Character({ me, materials = [], items = [] }) {
  const totalMaterials = materials.reduce(
    (sum, m) => sum + (m.quantity || 0),
    0,
  );

  const totalItems = items.reduce((sum, i) => sum + (i.quantity || 0), 0);

  return (
    <div className="min-h-screen bg-[#0a0a14]">
      <NavBar
        currentPage="Character"
        gold={me?.player?.coins ?? 0}
        name={me?.user?.display_name ?? "Player"}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-100 mb-2">
            Player Profile
          </h1>
          <p className="text-sm text-slate-500"></p>
        </div>

        {/* Character Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Identity */}
          <div className="rounded-2xl border border-slate-800/60 bg-slate-900/50 p-6 shadow-lg">
            <h2 className="text-lg font-bold text-amber-400 mb-4 uppercase tracking-wider">
              Identity
            </h2>

            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500">Name</span>
                <span className="font-semibold">{me?.user?.display_name}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">Gold</span>
                <span className="font-semibold text-amber-300">
                  {me?.player?.coins?.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="rounded-2xl border border-slate-800/60 bg-slate-900/50 p-6 shadow-lg">
            <h2 className="text-lg font-bold text-amber-400 mb-4 uppercase tracking-wider">
              Inventory Stats
            </h2>

            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500">Total Materials</span>
                <span className="font-semibold">{totalMaterials}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">Total Crafted Items</span>
                <span className="font-semibold">{totalItems}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Future Expansion Section */}
        <div className="mt-10 rounded-2xl border border-amber-800/30 bg-gradient-to-br from-amber-900/10 to-transparent p-6">
          <h3 className="text-sm font-bold tracking-widest uppercase text-amber-500 mb-2">
            Coming Soon
          </h3>
          <p className="text-xs text-slate-500">
            Experience points, leveling system, achievements, and guild ranks.
          </p>
        </div>
      </div>
    </div>
  );
}
