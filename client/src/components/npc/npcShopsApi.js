import { api } from "../../api";

export const listNpcShops = () => api.npcShops();

export const getNpcShop = async (shopId) => {
  const shops = await api.npcShops();
  return shops.find((s) => Number(s.id) === Number(shopId));
};

export const getShopInventory = (shopId) => api.npcShopStock(shopId);

export const getPlayerInventory = async () => {
  const items = await api.items();
  return items;
};

export const buyFromShop = (shopId, itemId, quantity) =>
  api.npcBuy(shopId, itemId, quantity);

export const sellToShop = (shopId, itemId, quantity) =>
  api.npcSell(shopId, itemId, quantity);
