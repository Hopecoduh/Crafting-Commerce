// client/src/components/crafting/CraftingBar.jsx
import ProcessedGoods from "./ProcessedGoods";
import Ingots from "./Ingots";
import Weapons from "./Weapons";
import Consumables from "./Consumables";
import TradeGoods from "./TradeGoods";
import { withCraftSeconds } from "./craftConfig";

export default function CraftingBar({ recipes, materials, onCraft }) {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <ProcessedGoods
        recipes={recipes}
        materials={materials}
        onCraft={onCraft}
      />
      <Ingots recipes={recipes} materials={materials} onCraft={onCraft} />
      <Weapons recipes={recipes} materials={materials} onCraft={onCraft} />
      <Consumables recipes={recipes} materials={materials} onCraft={onCraft} />
      <TradeGoods recipes={recipes} materials={materials} onCraft={onCraft} />
    </div>
  );
}
