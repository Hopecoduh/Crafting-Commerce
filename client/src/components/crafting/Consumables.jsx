// client/src/components/crafting/Consumables.jsx
import RecipeList from "./RecipeList";
import { filterRecipesByCategory } from "../../data/recipeCategories";

export default function Consumables({ recipes, onCraft }) {
  const list = filterRecipesByCategory(recipes, "CONSUMABLES");
  return <RecipeList title="Consumables" recipes={list} onCraft={onCraft} />;
}
