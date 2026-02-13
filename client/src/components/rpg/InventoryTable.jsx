import React, { useMemo } from "react";
import { Coins } from "lucide-react";
import { filterInventory } from "../../data/inventoryCategories";

export default function InventoryTable({
  materials = [],
  items = [],
  category = "ALL",
}) {
  // Combine materials + items into one list
  const combined = useMemo(() => {
    const map = new Map();

    function addEntry(row, prefix) {
      const key = row.name;

      if (!map.has(key)) {
        map.set(key, {
          id: `${prefix}-${row.id}`,
          name: row.name,
          quantity: row.quantity ?? 0,
          base_price: row.base_price ?? 0,
        });
      } else {
        const existing = map.get(key);
        existing.quantity += row.quantity ?? 0;

        existing.base_price = Math.max(
          existing.base_price,
          row.base_price ?? 0,
        );
      }
    }

    materials.forEach((m) => addEntry(m, "m"));
    items.forEach((i) => addEntry(i, "i"));

    return Array.from(map.values());
  }, [materials, items]);

  const filtered = useMemo(() => {
    return filterInventory(combined, category);
  }, [combined, category]);

  const totalValue = filtered.reduce(
    (sum, item) => sum + item.base_price * item.quantity,
    0,
  );

  const totalItems = filtered.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div>
      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
          <p className="text-xs uppercase tracking-wider text-slate-500">
            Total Items
          </p>
          <p className="text-lg font-bold text-slate-100">{totalItems}</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
          <p className="text-xs uppercase tracking-wider text-slate-500">
            Unique Items
          </p>
          <p className="text-lg font-bold text-blue-400">{filtered.length}</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
          <p className="text-xs uppercase tracking-wider text-slate-500">
            Total Value
          </p>
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-amber-500" />
            <p className="text-lg font-bold text-amber-400">
              {totalValue.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-slate-500 text-sm">
            No items in this category.
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center p-4 rounded-xl border border-slate-800 bg-slate-900/40"
            >
              <div>
                <div className="text-slate-100 font-semibold">{item.name}</div>
                <div className="text-xs text-slate-500">
                  Base value: {item.base_price}
                </div>
              </div>

              <div className="text-right">
                <div className="text-slate-300 font-medium">
                  ×{item.quantity}
                </div>
                <div className="flex items-center gap-1 text-amber-400 text-sm font-bold">
                  <Coins className="w-3 h-3" />
                  {(item.base_price * item.quantity).toLocaleString()}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
