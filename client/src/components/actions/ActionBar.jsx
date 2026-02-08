// client/src/components/actions/ActionBar.jsx
import Hunting from "./Hunting";
import Mining from "./Mining";
import GatherWood from "./GatherWood";
import GatherPlants from "./GatherPlants";

export default function ActionBar({ onLoot }) {
  return (
    <div
      style={{
        display: "grid",
        gap: 12,
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      }}
    >
      <Hunting onLoot={onLoot} />
      <Mining onLoot={onLoot} />
      <GatherWood onLoot={onLoot} />
      <GatherPlants onLoot={onLoot} />
    </div>
  );
}
