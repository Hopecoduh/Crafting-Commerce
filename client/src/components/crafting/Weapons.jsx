// client/src/components/crafting/Weapons.jsx
import RecipeList from "./RecipeList";
import { filterRecipesByCategory } from "../../data/recipeCategories";

export default function Weapons({ recipes, materials, onCraft }) {
  const list = filterRecipesByCategory(recipes, "WEAPONS");
  return (
    <RecipeList
      title="Weapons"
      recipes={list}
      materials={materials}
      onCraft={onCraft}
    />
  );
}
