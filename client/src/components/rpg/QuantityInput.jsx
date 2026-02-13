import React from 'react';
import { Minus, Plus } from 'lucide-react';

export default function QuantityInput({ value, onChange, max = 99, min = 1 }) {
  const decrement = () => {
    if (value > min) onChange(value - 1);
  };

  const increment = () => {
    if (value < max) onChange(value + 1);
  };

  const handleChange = (e) => {
    const val = parseInt(e.target.value) || min;
    onChange(Math.max(min, Math.min(max, val)));
  };

  return (
    <div className="inline-flex items-center rounded-lg border border-slate-700/60 bg-slate-900/60 overflow-hidden">
      <button
        onClick={decrement}
        disabled={value <= min}
        className="p-2 text-slate-400 hover:text-amber-400 hover:bg-white/5 transition-colors disabled:opacity-30 disabled:hover:text-slate-400 disabled:hover:bg-transparent"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>
      <input
        type="number"
        value={value}
        onChange={handleChange}
        className="w-10 text-center text-sm font-semibold text-slate-200 bg-transparent border-x border-slate-700/40 py-1.5 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:outline-none"
      />
      <button
        onClick={increment}
        disabled={value >= max}
        className="p-2 text-slate-400 hover:text-amber-400 hover:bg-white/5 transition-colors disabled:opacity-30 disabled:hover:text-slate-400 disabled:hover:bg-transparent"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}