import React from "react";
import { Link } from "react-router-dom";
import { Coins, Shield, Swords, Package } from "lucide-react";

export default function NavBar({ currentPage, gold = 0, name = "Player" }) {
  return (
    <nav className="sticky top-0 z-50 border-b border-amber-900/30 bg-[#0d0d1a]/95 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/npc-shops" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-900/30 group-hover:shadow-amber-700/40 transition-shadow">
              <Swords className="w-5 h-5 text-amber-100" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-sm font-bold tracking-widest uppercase text-amber-100/90">
                Merchant's Quarter
              </h1>
              <p className="text-[10px] tracking-wider uppercase text-amber-700/60">
                Royal Trading Guild
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              to="/npc-shops"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all ${
                currentPage === "ShopGrid"
                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  : "text-slate-400 hover:text-amber-300 hover:bg-white/5"
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              Shops
            </Link>

            <Link
              to="/"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all ${
                currentPage === "Inventory"
                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  : "text-slate-400 hover:text-amber-300 hover:bg-white/5"
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              Inventory
            </Link>
          </div>

          {/* Gold + Player */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-950/50 to-amber-900/30 border border-amber-700/30">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center shadow-md shadow-amber-700/50">
                <Coins className="w-3.5 h-3.5 text-amber-100" />
              </div>
              <span className="text-amber-300 font-bold text-sm tabular-nums">
                {gold.toLocaleString()}
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs font-semibold text-slate-200">{name}</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 border-2 border-amber-700/40 flex items-center justify-center">
                <span className="text-amber-400 text-xs font-bold">A</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
