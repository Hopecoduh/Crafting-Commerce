import React, { useState } from 'react';
import { Coins, ShoppingCart, ArrowLeftRight } from 'lucide-react';
import QuantityInput from './QuantityInput';

const rarityColors = {
  Common: 'text-slate-400 bg-slate-500/10 border-slate-600/30',
  Uncommon: 'text-green-400 bg-green-500/10 border-green-600/30',
  Rare: 'text-blue-400 bg-blue-500/10 border-blue-600/30',
  Epic: 'text-purple-400 bg-purple-500/10 border-purple-600/30',
  Legendary: 'text-amber-400 bg-amber-500/10 border-amber-600/30',
};

const rarityDots = {
  Common: 'bg-slate-500',
  Uncommon: 'bg-green-500',
  Rare: 'bg-blue-500',
  Epic: 'bg-purple-500',
  Legendary: 'bg-amber-500',
};

export default function ItemRow({ item, mode }) {
  const [quantity, setQuantity] = useState(1);
  const price = mode === 'buy' ? item.buyPrice : item.sellPrice;
  const totalPrice = price * quantity;

  return (
    <div className="group flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl border border-slate-800/40 bg-slate-900/30 hover:bg-slate-800/30 hover:border-slate-700/50 transition-all duration-300">
      {/* Item info */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg flex-shrink-0 border ${rarityColors[item.rarity]}`}>
          {item.icon}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-slate-100 truncate">{item.name}</h4>
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${rarityDots[item.rarity]}`} />
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className={`text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded border ${rarityColors[item.rarity]}`}>
              {item.rarity}
            </span>
            <span className="text-[11px] text-slate-500">{item.type}</span>
          </div>
        </div>
      </div>

      {/* Price per unit */}
      <div className="flex items-center gap-1.5 sm:w-28 sm:justify-end">
        <Coins className="w-3.5 h-3.5 text-amber-500" />
        <span className="text-sm font-bold text-amber-300 tabular-nums">{price}</span>
        <span className="text-[10px] text-slate-600">ea</span>
      </div>

      {/* Quantity */}
      <div className="sm:w-32 flex sm:justify-center">
        <QuantityInput value={quantity} onChange={setQuantity} max={item.stock || 99} />
      </div>

      {/* Total & Action */}
      <div className="flex items-center gap-3 sm:w-48 sm:justify-end">
        <div className="flex items-center gap-1.5">
          <Coins className="w-3 h-3 text-amber-600" />
          <span className="text-sm font-bold text-slate-200 tabular-nums">{totalPrice.toLocaleString()}</span>
        </div>
        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold tracking-wider uppercase transition-all duration-300 ${
            mode === 'buy'
              ? 'bg-amber-600 hover:bg-amber-500 text-amber-50 shadow-lg shadow-amber-900/30 hover:shadow-amber-800/40'
              : 'bg-emerald-600 hover:bg-emerald-500 text-emerald-50 shadow-lg shadow-emerald-900/30 hover:shadow-emerald-800/40'
          }`}
        >
          {mode === 'buy' ? (
            <><ShoppingCart className="w-3.5 h-3.5" /> Buy</>
          ) : (
            <><ArrowLeftRight className="w-3.5 h-3.5" /> Sell</>
          )}
        </button>
      </div>
    </div>
  );
}