import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getNpcShop,
  getShopInventory,
  getPlayerInventory,
  buyFromShop,
  sellToShop,
} from "./npcShopsApi";

export default function NpcShopDetailPage() {
  const { id } = useParams();
  const shopId = Number(id);

  const [shop, setShop] = useState(null);
  const [shopInv, setShopInv] = useState([]);
  const [playerInv, setPlayerInv] = useState([]);
  const [tab, setTab] = useState("buy");

  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  async function loadAll() {
    setErr("");
    setMsg("");
    setLoading(true);
    try {
      const [s, si, pi] = await Promise.all([
        getNpcShop(shopId),
        getShopInventory(shopId),
        getPlayerInventory(),
      ]);
      setShop(s);
      setShopInv(normalizeInv(si));
      setPlayerInv(normalizeInv(pi));
    } catch (e) {
      setErr(e?.message || "Failed to load shop");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!Number.isFinite(shopId)) return;
    loadAll();
  }, [shopId]);

  const viewItems = useMemo(() => {
    return tab === "buy" ? shopInv : playerInv;
  }, [tab, shopInv, playerInv]);

  async function onTrade(item, qty) {
    if (!qty || qty <= 0) return;

    setErr("");
    setMsg("");
    setBusy(true);

    try {
      const itemId = item.item_id ?? item.id;

      if (tab === "buy") {
        await buyFromShop(shopId, itemId, qty);
        setMsg(`Bought ${qty} × ${item.item_name ?? item.name}`);
      } else {
        await sellToShop(shopId, itemId, qty);
        setMsg(`Sold ${qty} × ${item.item_name ?? item.name}`);
      }

      await loadAll();
    } catch (e) {
      setErr(e?.message || "Trade failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={styles.page}>
      <Link to="/npc-shops" style={styles.backLink}>
        ← Back
      </Link>

      <h1 style={styles.h1}>{shop?.name ?? `Shop #${shopId}`}</h1>
      <div style={styles.sub}>{shop?.description ?? "Trade items here"}</div>

      <div style={styles.tabs}>
        <button
          onClick={() => setTab("buy")}
          style={{
            ...styles.tabBtn,
            ...(tab === "buy" ? styles.tabActive : {}),
          }}
        >
          Buy
        </button>
        <button
          onClick={() => setTab("sell")}
          style={{
            ...styles.tabBtn,
            ...(tab === "sell" ? styles.tabActive : {}),
          }}
        >
          Sell
        </button>
      </div>

      {loading && <div>Loading…</div>}
      {err && <div style={styles.error}>{err}</div>}
      {msg && <div style={styles.success}>{msg}</div>}

      {!loading && (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Trade</th>
            </tr>
          </thead>
          <tbody>
            {viewItems.map((item, index) => {
              const key = `${item.item_id ?? item.id}-${index}`;
              return (
                <ItemRow
                  key={key}
                  item={item}
                  busy={busy}
                  mode={tab}
                  onTrade={onTrade}
                />
              );
            })}

            {viewItems.length === 0 && (
              <tr>
                <td colSpan={4}>No items.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

function ItemRow({ item, busy, mode, onTrade }) {
  const [qty, setQty] = useState(1);

  const max = Number(item.quantity ?? 0);
  const name =
    item.item_name ?? item.name ?? `Item #${item.item_id ?? item.id}`;
  const price = item.price ?? item.base_price ?? "-";

  return (
    <tr>
      <td>{name}</td>
      <td>{max}</td>
      <td>{price}</td>
      <td>
        <input
          type="number"
          min={1}
          value={qty}
          onChange={(e) => setQty(Number(e.target.value))}
          disabled={busy}
          style={{ width: 60 }}
        />
        <button
          onClick={() => onTrade(item, qty)}
          disabled={busy}
          style={{ marginLeft: 6 }}
        >
          {mode === "buy" ? "Buy" : "Sell"}
        </button>
      </td>
    </tr>
  );
}

function normalizeInv(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.inventory)) return data.inventory;
  if (Array.isArray(data?.items)) return data.items;
  return [];
}

const styles = {
  page: { padding: 20 },
  backLink: { display: "inline-block", marginBottom: 12 },
  h1: { margin: 0 },
  sub: { opacity: 0.7, marginBottom: 16 },
  tabs: { display: "flex", gap: 10, marginBottom: 16 },
  tabBtn: { padding: "6px 12px", cursor: "pointer" },
  tabActive: { background: "#000", color: "#fff" },
  table: { width: "100%", borderCollapse: "collapse" },
  error: { color: "crimson" },
  success: { color: "green" },
};
