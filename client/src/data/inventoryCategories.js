// client/src/data/inventoryCategories.js
export const CATEGORY = {
  ALL: null,

  WOOD: ["Wood Log", "Stick", "Plank"],
  MINING: [
    "Stone",
    "Flint",
    "Coal",
    "Copper Ore",
    "Tin Ore",
    "Iron Ore",
    "Silver Ore",
    "Gold Ore",
  ],
  ANIMAL: [
    "Raw Meat",
    "Raw Fish",
    "Hide",
    "Bone",
    "Feather",
    "Wool",
    "Milk",
    "Egg",
  ],
  PLANTS: [
    "Wheat",
    "Corn",
    "Carrot",
    "Potato",
    "Berry",
    "Herbs",
    "Cotton",
    "Sugarcane",
    "Plant Matter",
    "Fiber",
  ],
  PROCESSED: [
    "Rope",
    "Cloth",
    "Leather",
    "Leather Strips",
    "Flour",
    "Sugar",
    "Brick",
    "Charcoal",
  ],
  BOTTLES: ["Glass Bottle", "Water Bottle", "Milk Bottle"],
  INGOTS: [
    "Copper Ingot",
    "Tin Ingot",
    "Bronze Ingot",
    "Iron Ingot",
    "Steel Ingot",
    "Silver Ingot",
    "Gold Ingot",
  ],
};

export function filterInventory(inv, tabKey) {
  if (!tabKey || tabKey === "ALL") return inv;
  const list = CATEGORY[tabKey];
  if (!list) return inv;
  const set = new Set(list);
  return inv.filter((row) => set.has(row.name));
}
