import ProcessedGoods from "./ProcessedGoods";
import Ingots from "./Ingots";
import Weapons from "./Weapons";
import Consumables from "./Consumables";
import TradeGoods from "./TradeGoods";

export default function CraftingBar({ recipes, materials, onCraft, category }) {
  switch (category) {
    case "PROCESSED":
      return (
        <ProcessedGoods
          recipes={recipes}
          materials={materials}
          onCraft={onCraft}
        />
      );

    case "INGOTS":
      return (
        <Ingots recipes={recipes} materials={materials} onCraft={onCraft} />
      );

    case "WEAPONS":
      return (
        <Weapons recipes={recipes} materials={materials} onCraft={onCraft} />
      );

    case "CONSUMABLES":
      return (
        <Consumables
          recipes={recipes}
          materials={materials}
          onCraft={onCraft}
        />
      );

    case "TRADE_GOODS":
      return (
        <TradeGoods recipes={recipes} materials={materials} onCraft={onCraft} />
      );

    default:
      return null;
  }
}
