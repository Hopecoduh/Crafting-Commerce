import React, { useState, useEffect } from "react";
import NavBar from "../components/rpg/NavBar";
import InventoryTable from "../components/rpg/InventoryTable";
import CraftingBar from "../components/crafting/CraftingBar";
import ActionBar from "../components/actions/ActionBar";

import { CATEGORY } from "../data/inventoryCategories";
import { RECIPE_CATEGORIES } from "../data/recipeCategories";

export default function Inventory({
  me,
  materials = [],
  items = [],
  recipes = [],
  onLoot,
  onCraft,
}) {
  const [activeTab, setActiveTab] = useState("inventory");
  const [activeCategory, setActiveCategory] = useState("ALL");

  const inventoryKeys = [
    "ALL",
    ...Object.keys(CATEGORY).filter((k) => k !== "ALL"),
  ];
  const recipeKeys = Object.keys(RECIPE_CATEGORIES);

  // Reset category when switching tabs
  useEffect(() => {
    if (activeTab === "inventory") {
      setActiveCategory("ALL");
    } else {
      setActiveCategory(recipeKeys[0]);
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-[#0a0a14]">
      <NavBar
        currentPage="Inventory"
        gold={me?.player?.coins ?? 0}
        name={me?.user?.display_name ?? "Player"}
      />

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab("inventory")}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider ${
              activeTab === "inventory"
                ? "bg-amber-600/20 text-amber-400 border border-amber-600/30"
                : "text-slate-500"
            }`}
          >
            Inventory
          </button>

          <button
            onClick={() => setActiveTab("crafting")}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider ${
              activeTab === "crafting"
                ? "bg-amber-600/20 text-amber-400 border border-amber-600/30"
                : "text-slate-500"
            }`}
          >
            Crafting
          </button>
        </div>

        {/* Category Buttons */}
        <div className="flex flex-wrap gap-3 mb-8">
          {(activeTab === "inventory" ? inventoryKeys : recipeKeys).map(
            (key) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg ${
                  activeCategory === key
                    ? "bg-amber-600/20 text-amber-400 border border-amber-600/30"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {key.replace("_", " ")}
              </button>
            ),
          )}
        </div>

        {activeTab === "inventory" ? (
          <>
            {/* Action Bar */}
            <div className="mb-8">
              {onLoot && <ActionBar onLoot={onLoot} />}
            </div>

            {/* Inventory Table */}
            <InventoryTable
              materials={materials}
              items={items}
              category={activeCategory}
            />
          </>
        ) : (
          <CraftingBar
            recipes={recipes}
            materials={materials}
            onCraft={onCraft}
            category={activeCategory}
          />
        )}
      </div>
    </div>
  );
}
