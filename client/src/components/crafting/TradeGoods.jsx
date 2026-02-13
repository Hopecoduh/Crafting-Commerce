// client/src/components/crafting/TradeGoods.jsx
import RecipeList from "./RecipeList";
import { filterRecipesByCategory } from "../../data/recipeCategories";

export default function TradeGoods({ recipes, materials, onCraft }) {
  const list = filterRecipesByCategory(recipes, "TRADE_GOODS");
  return (
    <RecipeList
      title="Trade Goods"
      recipes={list}
      materials={materials}
      onCraft={onCraft}
    />
  );
}
