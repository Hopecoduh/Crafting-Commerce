import { useEffect, useMemo, useState } from "react";

function hasEnoughMaterials(recipe, materials) {
  if (!materials?.length) return false;

  return recipe.ingredients.every((ing) => {
    const owned = materials.find((m) => m.id === ing.material_id);
    return owned && owned.quantity >= ing.quantity;
  });
}

export default function RecipeList({ title, recipes, materials, onCraft }) {
  const [timers, setTimers] = useState({});
  const [, forceTick] = useState(0);

  const anyRunning = useMemo(() => {
    const now = Date.now();
    return Object.values(timers).some((endsAt) => endsAt > now);
  }, [timers]);

  useEffect(() => {
    if (!anyRunning) return;
    const id = setInterval(() => forceTick((x) => x + 1), 250);
    return () => clearInterval(id);
  }, [anyRunning]);

  function startTimer(recipeId, seconds) {
    const endsAt = Date.now() + seconds * 1000;
    setTimers((p) => ({ ...p, [recipeId]: endsAt }));
  }

  function clearTimer(recipeId) {
    setTimers((p) => {
      const copy = { ...p };
      delete copy[recipeId];
      return copy;
    });
  }

  function remainingSec(recipeId) {
    const endsAt = timers[recipeId];
    if (!endsAt) return 0;
    return Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));
  }

  function isRunning(recipeId) {
    const endsAt = timers[recipeId];
    return !!endsAt && endsAt > Date.now();
  }

  if (!recipes?.length) {
    return (
      <div className="border border-slate-800 rounded-xl p-4 bg-slate-900/40">
        <div className="font-bold mb-2 text-slate-100">{title}</div>
        <div className="text-slate-500 text-sm">
          No recipes in this category yet.
        </div>
      </div>
    );
  }

  return (
    <div className="border border-slate-800 rounded-xl p-4 bg-slate-900/40">
      <div className="font-bold mb-4 text-slate-100">{title}</div>

      <div className="space-y-3">
        {recipes.map((r) => {
          const running = isRunning(r.recipe_id);
          const remain = remainingSec(r.recipe_id);
          const canCraft = hasEnoughMaterials(r, materials);

          return (
            <div
              key={r.recipe_id}
              className="border border-slate-700 rounded-lg p-4 bg-slate-800/30"
            >
              <div className="flex justify-between items-start gap-4">
                <div>
                  <div className="font-semibold text-slate-100">
                    {r.item_name}
                  </div>
                  <div className="text-xs text-slate-500">
                    Base price: {r.base_price}
                  </div>
                </div>

                <button
                  disabled={running || !canCraft}
                  onClick={async () => {
                    if (!canCraft) return;

                    const seconds = r.seconds ?? 60;
                    startTimer(r.recipe_id, seconds);

                    try {
                      await new Promise((x) => setTimeout(x, seconds * 1000));
                      await onCraft(r.recipe_id);
                    } finally {
                      clearTimer(r.recipe_id);
                    }
                  }}
                  className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition ${
                    running || !canCraft
                      ? "bg-slate-700 text-slate-500"
                      : "bg-amber-600 hover:bg-amber-500 text-white"
                  }`}
                >
                  {running ? `Crafting… ${remain}s` : "Craft"}
                </button>
              </div>

              <div className="mt-3 text-xs text-slate-400">
                Needs:{" "}
                {(r.ingredients || []).map((ing, idx) => (
                  <span key={ing.material_id}>
                    {ing.material_name} x{ing.quantity}
                    {idx < r.ingredients.length - 1 ? ", " : ""}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
