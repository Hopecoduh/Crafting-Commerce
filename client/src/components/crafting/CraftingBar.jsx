// client/src/components/crafting/CraftingBar.jsx
import ProcessedGoods from "./ProcessedGoods";
import Ingots from "./Ingots";
import Weapons from "./Weapons";
import Consumables from "./Consumables";
import TradeGoods from "./TradeGoods";
import { withCraftSeconds } from "./craftConfig";

export default function CraftingBar({ recipes, onCraft }) {
  const enriched = withCraftSeconds(recipes);

  return (
    <div
      style={{
        display: "grid",
        gap: 12,
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
      }}
    >
      <ProcessedGoods recipes={enriched} onCraft={onCraft} />
      <Ingots recipes={enriched} onCraft={onCraft} />
      <Weapons recipes={enriched} onCraft={onCraft} />
      <Consumables recipes={enriched} onCraft={onCraft} />
      <TradeGoods recipes={enriched} onCraft={onCraft} />
    </div>
  );
}
