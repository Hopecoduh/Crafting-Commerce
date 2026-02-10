export const RECIPE_CATEGORIES = {
  PROCESSED: new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]),
  INGOTS: new Set([13, 14, 15, 16, 17, 18, 19]),
  WEAPONS: new Set([20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]),
  CONSUMABLES: new Set([32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42]),
  TRADEGOODS: new Set([43, 44, 45, 46]),
};

export function filterRecipesByCategory(recipes, categoryKey) {
  const set = RECIPE_CATEGORIES[categoryKey];
  if (!set) return [];
  return (recipes || []).filter((r) => set.has(r.recipe_id));
}
