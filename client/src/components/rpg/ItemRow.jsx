import React, { useState } from "react";
import { Coins, ShoppingCart, ArrowLeftRight } from "lucide-react";
import QuantityInput from "./QuantityInput";

export default function ItemRow({ item, mode, onBuy, onSell }) {
  const [quantity, setQuantity] = useState(1);

  const buyPrice = Number(item.buyPrice ?? item.buy_price ?? 0);

  // IMPORTANT: preserve null if shop doesn't buy
  const rawSell = item.sellPrice ?? item.sell_price;
  const sellPrice = rawSell == null ? null : Number(rawSell);

  const stock = Number(item.stock ?? item.quantity ?? 0);

  const price = mode === "buy" ? buyPrice : (sellPrice ?? 0);
  const totalPrice = price * quantity;

  const isOutOfStock = stock <= 0;

  // Proper "shop doesn't buy" detection
  const shopDoesNotBuy = mode === "sell" && sellPrice == null;

  const isDisabled = isOutOfStock || shopDoesNotBuy;

  function handleClick() {
    if (isDisabled) return;

    if (mode === "buy" && onBuy) {
      onBuy(item.item_id ?? item.id, quantity);
    }

    if (mode === "sell" && onSell) {
      onSell(item.item_id ?? item.id, quantity);
    }
  }

  return (
    <div className="group flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl border border-slate-800/40 bg-slate-900/30 hover:bg-slate-800/30 hover:border-slate-700/50 transition-all duration-300">
      {/* Item Name */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-slate-100 truncate">
          {item.item_name || item.name}
        </h4>
      </div>

      {/* Price */}
      <div className="flex items-center gap-1.5 sm:w-28 sm:justify-end">
        <Coins className="w-3.5 h-3.5 text-amber-500" />
        <span className="text-sm font-bold text-amber-300 tabular-nums">
          {price}
        </span>
        <span className="text-[10px] text-slate-600">ea</span>
      </div>

      {/* Quantity */}
      <div className="sm:w-32 flex sm:justify-center">
        <QuantityInput
          value={quantity}
          onChange={setQuantity}
          max={stock || 1}
        />
      </div>

      {/* Total + Button */}
      <div className="flex items-center gap-3 sm:w-48 sm:justify-end">
        <div className="flex items-center gap-1.5">
          <Coins className="w-3 h-3 text-amber-600" />
          <span className="text-sm font-bold text-slate-200 tabular-nums">
            {totalPrice.toLocaleString()}
          </span>
        </div>

        <button
          onClick={handleClick}
          disabled={isDisabled}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold tracking-wider uppercase transition-all duration-300 ${
            isDisabled
              ? "bg-slate-700 text-slate-500 cursor-not-allowed"
              : mode === "buy"
                ? "bg-amber-600 hover:bg-amber-500 text-amber-50 shadow-lg shadow-amber-900/30 hover:shadow-amber-800/40"
                : "bg-emerald-600 hover:bg-emerald-500 text-emerald-50 shadow-lg shadow-emerald-900/30 hover:shadow-emerald-800/40"
          }`}
        >
          {mode === "buy" ? (
            <>
              <ShoppingCart className="w-3.5 h-3.5" /> Buy
            </>
          ) : (
            <>
              <ArrowLeftRight className="w-3.5 h-3.5" /> Sell
            </>
          )}
        </button>
      </div>
    </div>
  );
}
