// client/src/components/actions/GatherWood.jsx
import { useState } from "react";
import { postAction } from "./actionApi";
import { useActionTimer } from "./useActionTimer";

const SECONDS = 60;

export default function GatherWood({ onLoot }) {
  const [loading, setLoading] = useState(false);
  const [lastDrops, setLastDrops] = useState([]);
  const [error, setError] = useState("");
  const { running, remainingSec, start, stop } = useActionTimer();

  async function handleChop() {
    if (running || loading) return;

    setError("");
    setLastDrops([]);
    start(SECONDS);

    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, SECONDS * 1000));
      const data = await postAction("/api/gather/wood");
      setLastDrops(data.drops || []);
      onLoot?.(data);
    } catch (e) {
      setError(e.message || "Chop wood failed");
      stop();
    } finally {
      setLoading(false);
      stop();
    }
  }

  return (
    <div className="p-4 rounded-xl border border-slate-800/50 bg-slate-900/40 text-slate-200">
      <button onClick={handleChop} disabled={loading || running}>
        {running
          ? `Chopping… ${remainingSec}s`
          : loading
            ? "Chopping..."
            : "🪓 Gather Wood"}
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
