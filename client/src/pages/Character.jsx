import { useEffect, useState } from "react";
import { api } from "../api";

export default function Character({ me }) {
  const [materials, setMaterials] = useState([]);
  const [items, setItems] = useState([]);

  useEffect(() => {
    async function load() {
      setMaterials(await api.materials());
      setItems(await api.items());
    }
    load();
  }, []);

  const totalMaterials = materials.reduce(
    (sum, m) => sum + (m.quantity || 0),
    0,
  );

  const totalItems = items.reduce((sum, i) => sum + (i.quantity || 0), 0);

  return (
    <div style={{ padding: 20 }}>
      <h2>Character</h2>

      <div style={card}>
        <h3>{me?.user?.display_name}</h3>
        <p>
          <strong>Coins:</strong> {me?.player?.coins}
        </p>
        <p>
          <strong>Total Materials:</strong> {totalMaterials}
        </p>
        <p>
          <strong>Total Items:</strong> {totalItems}
        </p>
      </div>

      <div style={card}>
        <h4>Stats (Coming Soon)</h4>
        <p>Level: 1</p>
        <p>Experience: 0 / 100</p>
        <p>Crafted Items: TBD</p>
        <p>Gathered Resources: TBD</p>
      </div>
    </div>
  );
}

const card = {
  background: "#1c1c1c",
  padding: 20,
  borderRadius: 10,
  marginBottom: 20,
  border: "1px solid #333",
};
