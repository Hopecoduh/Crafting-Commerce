import React from 'react';
import { ShoppingCart, ArrowLeftRight } from 'lucide-react';

export default function TabSwitcher({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'buy', label: 'Buy', icon: ShoppingCart },
    { id: 'sell', label: 'Sell', icon: ArrowLeftRight },
  ];

  return (
    <div className="inline-flex items-center p-1 rounded-xl bg-slate-900/80 border border-slate-800/60">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`relative flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold tracking-wider uppercase transition-all duration-300 ${
              isActive
                ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-amber-50 shadow-lg shadow-amber-900/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}