// client/src/components/crafting/ProcessedGoods.jsx
import RecipeList from "./RecipeList";
import { filterRecipesByCategory } from "../../data/recipeCategories";

export default function ProcessedGoods({ recipes, onCraft }) {
  const list = filterRecipesByCategory(recipes, "PROCESSED");
  return (
    <RecipeList title="Processed Goods" recipes={list} onCraft={onCraft} />
  );
}
