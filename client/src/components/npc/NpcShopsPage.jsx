import React, { useEffect, useState } from "react";
import { listNpcShops } from "./npcShopsApi";
import { Link } from "react-router-dom";

export default function NpcShopsPage() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setErr("");
        setLoading(true);
        const data = await listNpcShops();
        if (!alive) return;
        setShops(Array.isArray(data) ? data : (data?.shops ?? []));
      } catch (e) {
        if (!alive) return;
        setErr(e?.message || "Failed to load shops");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.headerRow}>
        <h1 style={styles.h1}>NPC Shops</h1>
        <div style={styles.muted}>Buy & sell items with shopkeepers</div>
      </div>

      {loading && <div style={styles.card}>Loading shops…</div>}
      {err && <div style={{ ...styles.card, ...styles.error }}>❌ {err}</div>}

      {!loading && !err && (
        <div style={styles.grid}>
          {shops.map((s, index) => {
            const key = `shop-${s.id}-${index}`;
            return (
              <Link key={key} to={`/npc-shops/${s.id}`} style={styles.shopCard}>
                <div style={styles.shopName}>{s.name ?? `Shop #${s.id}`}</div>
                <div style={styles.shopMeta}>
                  {s.description ?? "Click to view inventory"}
                </div>
                <div style={styles.shopCTA}>Open →</div>
              </Link>
            );
          })}
          {shops.length === 0 && <div style={styles.card}>No shops found.</div>}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { padding: 20, maxWidth: 1100, margin: "0 auto" },
  headerRow: {
    display: "flex",
    alignItems: "baseline",
    gap: 12,
    marginBottom: 16,
  },
  h1: { margin: 0, fontSize: 28 },
  muted: { opacity: 0.75 },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 14,
  },
  card: {
    border: "1px solid #e5e5e5",
    borderRadius: 12,
    padding: 14,
    background: "#fff",
  },
  shopCard: {
    border: "1px solid #e5e5e5",
    borderRadius: 12,
    padding: 14,
    background: "#fff",
    textDecoration: "none",
    color: "inherit",
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  shopName: { fontWeight: 700, fontSize: 18 },
  shopMeta: { opacity: 0.75 },
  shopCTA: { marginTop: 6, fontWeight: 700, opacity: 0.85 },
  error: { borderColor: "#ffb4b4", background: "#fff5f5" },
};
