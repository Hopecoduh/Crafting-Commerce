// client/src/components/actions/Hunting.jsx
import { useState } from "react";
import { postAction } from "./actionApi";
import { useActionTimer } from "./useActionTimer";

const SECONDS = 120;

export default function Hunting({ onLoot }) {
  const [loading, setLoading] = useState(false);
  const [lastDrops, setLastDrops] = useState([]);
  const [error, setError] = useState("");
  const { running, remainingSec, start, stop } = useActionTimer();

  async function handleHunt() {
    if (running || loading) return;

    setError("");
    setLastDrops([]);
    start(SECONDS);

    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, SECONDS * 1000));
      const data = await postAction("/api/gather/hunt");
      setLastDrops(data.drops || []);
      onLoot?.(data);
    } catch (e) {
      setError(e.message || "Hunt failed");
      stop();
    } finally {
      setLoading(false);
      stop();
    }
  }

  return (
    <div style={{ border: "1px solid #333", padding: 12, borderRadius: 10 }}>
      <button onClick={handleHunt} disabled={loading || running}>
        {running
          ? `Hunting… ${remainingSec}s`
          : loading
            ? "Hunting..."
            : "🏹 Hunt"}
      </button>

      {error ? (
        <div style={{ color: "tomato", marginTop: 8 }}>{error}</div>
      ) : null}

      {lastDrops.length ? (
        <div style={{ marginTop: 10 }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Loot:</div>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {lastDrops.map((d) => (
              <li key={d.name}>
                {d.name} x{d.qty}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
