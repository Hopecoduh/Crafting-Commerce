// client/src/components/crafting/RecipeList.jsx
import { useEffect, useMemo, useState } from "react";

function hasEnoughMaterials(recipe, materials) {
  if (!materials?.length) return false;

  return recipe.ingredients.every((ing) => {
    const owned = materials.find((m) => m.id === ing.material_id);
    return owned && owned.quantity >= ing.quantity;
  });
}

export default function RecipeList({ title, recipes, materials, onCraft }) {
  const [timers, setTimers] = useState({}); // { [recipeId]: endsAtMs }
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
      <div style={{ border: "1px solid #ddd", padding: 12, borderRadius: 10 }}>
        <div style={{ fontWeight: 800, marginBottom: 6 }}>{title}</div>
        <div style={{ color: "#666" }}>No recipes in this category yet.</div>
      </div>
    );
  }

  return (
    <div style={{ border: "1px solid #ddd", padding: 12, borderRadius: 10 }}>
      <div style={{ fontWeight: 800, marginBottom: 10 }}>{title}</div>

      <div style={{ display: "grid", gap: 10 }}>
        {recipes.map((r) => {
          const running = isRunning(r.recipe_id);
          const remain = remainingSec(r.recipe_id);
          const canCraft = hasEnoughMaterials(r, materials);

          return (
            <div
              key={r.recipe_id}
              style={{
                border: "1px solid #eee",
                padding: 10,
                borderRadius: 10,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 10,
                }}
              >
                <div>
                  <div style={{ fontWeight: 700 }}>{r.item_name}</div>
                  <div style={{ fontSize: 12, color: "#666" }}>
                    base price: {r.base_price}
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
                  style={{
                    opacity: running || !canCraft ? 0.5 : 1,
                  }}
                >
                  {running ? `Crafting… ${remain}s` : "Craft"}
                </button>
              </div>

              <div style={{ marginTop: 8, fontSize: 13 }}>
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
