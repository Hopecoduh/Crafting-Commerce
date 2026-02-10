// client/src/components/crafting/craftConfig.js

export const CRAFT_SECONDS_BY_RECIPE_ID = {};

export const RECIPE_CATEGORY_BY_RECIPE_ID = {
  1: "ProcessedGoods",
  2: "Ingots",
  3: "Weapons",
  4: "Consumables",
  5: "TradeGoods",
};

export function withCraftSeconds(recipes) {
  return (recipes || []).map((r) => ({
    ...r,
    seconds: CRAFT_SECONDS_BY_RECIPE_ID[r.recipe_id] ?? r.seconds ?? 60,
  }));
}

export function byCategory(recipes, categoryName) {
  return (recipes || []).filter((r) => {
    const cat =
      r.category ??
      RECIPE_CATEGORY_BY_RECIPE_ID[r.recipe_id] ??
      "ProcessedGoods";
    return cat === categoryName;
  });
}
