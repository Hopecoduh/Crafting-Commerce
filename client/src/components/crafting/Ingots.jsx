// client/src/components/crafting/Ingots.jsx
import RecipeList from "./RecipeList";
import { filterRecipesByCategory } from "../../data/recipeCategories";

export default function Ingots({ recipes, materials, onCraft }) {
  const list = filterRecipesByCategory(recipes, "INGOTS");
  return (
    <RecipeList
      title="Ingots"
      recipes={list}
      materials={materials}
      onCraft={onCraft}
    />
  );
}
