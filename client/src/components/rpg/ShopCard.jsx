import React from "react";
import { Link } from "react-router-dom";
import { Star, ChevronRight, MapPin } from "lucide-react";

const ratingStars = (rating = 0) => {
  return Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      className={`w-3 h-3 ${
        i < Math.floor(rating)
          ? "text-amber-400 fill-amber-400"
          : "text-slate-700"
      }`}
    />
  ));
};

export default function ShopCard({ shop }) {
  return (
    <Link
      to={`/npc-shops/${shop.id}`}
      className="group relative flex flex-col rounded-2xl border border-slate-800/80 bg-gradient-to-b from-slate-900/80 to-[#0d0d1a] overflow-hidden hover:border-amber-800/40 transition-all duration-500 hover:shadow-2xl hover:shadow-amber-950/20"
    >
      {/* Image area */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={shop.image || "https://via.placeholder.com/600x400"}
          alt={shop.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d1a] via-transparent to-transparent" />

        {/* Tier badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-slate-700/40 text-slate-200 border border-slate-600/30">
            {shop.tier || "Merchant"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-base font-bold text-slate-100 group-hover:text-amber-300 transition-colors duration-300">
            {shop.name}
          </h3>
          <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-amber-500 group-hover:translate-x-1 transition-all duration-300 mt-1 flex-shrink-0" />
        </div>

        <p className="text-xs text-slate-500 leading-relaxed mb-4 line-clamp-2">
          {shop.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3 h-3 text-slate-600" />
            <span className="text-[11px] text-slate-500">
              {shop.location || "Kingdom"}
            </span>
          </div>
          <div className="flex items-center gap-0.5">
            {ratingStars(shop.rating)}
          </div>
        </div>
      </div>
    </Link>
  );
}
