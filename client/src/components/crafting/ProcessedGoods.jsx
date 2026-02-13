// client/src/components/crafting/ProcessedGoods.jsx
import RecipeList from "./RecipeList";
import { filterRecipesByCategory } from "../../data/recipeCategories";

export default function ProcessedGoods({ recipes, materials, onCraft }) {
  const list = filterRecipesByCategory(recipes, "PROCESSED");
  return (
    <RecipeList
      title="Processed Goods"
      recipes={list}
      materials={materials}
      onCraft={onCraft}
    />
  );
}
