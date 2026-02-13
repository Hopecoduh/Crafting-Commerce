// server/routes/npcShops.js
import express from "express";
import { db } from "../db/client.js";
import { requireUser } from "../middleware/requireUser.js";

const router = express.Router();

async function restockShopIfNeeded(shopId) {
  const shopRes = await db.query(
    `
    SELECT id, restock_seconds, last_restock_at, next_restock_at
    FROM npc_shops
    WHERE id = $1
    `,
    [shopId],
  );

  const shop = shopRes.rows[0];
  if (!shop) throw new Error("shop not found");

  const now = new Date();
  const needsRestock =
    !shop.next_restock_at || now >= new Date(shop.next_restock_at);
  if (!needsRestock) return;

  const poolRes = await db.query(
    `
    SELECT id, item_id, weight, min_qty, max_qty, buy_price, sell_price
    FROM npc_shop_item_pool
    WHERE shop_id = $1
    `,
    [shopId],
  );

  const pool = poolRes.rows;

  // If no pool, just update timers and exit
  if (pool.length === 0) {
    await db.query(
      `
      UPDATE npc_shops
      SET last_restock_at = NOW(),
          next_restock_at = NOW() + (COALESCE(restock_seconds, 3600) * INTERVAL '1 second')
      WHERE id = $1
      `,
      [shopId],
    );
    return;
  }

  // optional stock_slots column (safe if it doesn't exist)
  let stockSlots = 8;
  try {
    const slotsRes = await db.query(
      `SELECT stock_slots FROM npc_shops WHERE id = $1`,
      [shopId],
    );
    if (slotsRes.rows[0]?.stock_slots)
      stockSlots = Number(slotsRes.rows[0].stock_slots);
  } catch {}

  function weightedPickOne(arr) {
    const total = arr.reduce(
      (sum, x) => sum + Math.max(1, Number(x.weight || 1)),
      0,
    );
    let r = Math.random() * total;
    for (const x of arr) {
      r -= Math.max(1, Number(x.weight || 1));
      if (r <= 0) return x;
    }
    return arr[arr.length - 1];
  }

  const chosen = [];
  const remaining = [...pool];
  const picks = Math.min(stockSlots, remaining.length);

  for (let i = 0; i < picks; i++) {
    const pick = weightedPickOne(remaining);
    chosen.push(pick);
    const idx = remaining.findIndex((x) => x.id === pick.id);
    if (idx !== -1) remaining.splice(idx, 1);
  }

  // replace stock
  await db.query(`DELETE FROM npc_shop_stock WHERE shop_id = $1`, [shopId]);

  for (const row of chosen) {
    const min = Number(row.min_qty ?? 1);
    const max = Number(row.max_qty ?? min);
    const qty = Math.floor(Math.random() * (max - min + 1)) + min;

    await db.query(
      `
      INSERT INTO npc_shop_stock (shop_id, item_id, quantity, buy_price, sell_price)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (shop_id, item_id)
      DO UPDATE SET quantity = EXCLUDED.quantity,
                    buy_price = EXCLUDED.buy_price,
                    sell_price = EXCLUDED.sell_price
      `,
      [shopId, row.item_id, qty, row.buy_price, row.sell_price],
    );
  }

  await db.query(
    `
    UPDATE npc_shops
    SET last_restock_at = NOW(),
        next_restock_at = NOW() + (COALESCE(restock_seconds, 3600) * INTERVAL '1 second')
    WHERE id = $1
    `,
    [shopId],
  );
}

// GET /api/npc-shops
router.get("/", requireUser, async (req, res) => {
  const result = await db.query(
    `
    SELECT id, name, restock_seconds, last_restock_at, next_restock_at
    FROM npc_shops
    ORDER BY id
    `,
  );
  res.json(result.rows);
});

// GET /api/npc-shops/:shopId/stock
router.get("/:shopId/stock", requireUser, async (req, res) => {
  const shopId = Number(req.params.shopId);
  if (!Number.isInteger(shopId))
    return res.status(400).json({ error: "bad shop id" });

  await restockShopIfNeeded(shopId);

  const stock = await db.query(
    `
    SELECT
      s.shop_id,
      s.item_id,
      i.name as item_name,
      s.quantity,
      s.buy_price,
      s.sell_price
    FROM npc_shop_stock s
    JOIN items i ON i.id = s.item_id
    WHERE s.shop_id = $1
    ORDER BY i.name
    `,
    [shopId],
  );

  const shop = await db.query(
    `
    SELECT id, name, restock_seconds, last_restock_at, next_restock_at
    FROM npc_shops
    WHERE id = $1
    `,
    [shopId],
  );

  res.json({ shop: shop.rows[0], stock: stock.rows });
});

// POST /api/npc-shops/:shopId/buy  body: { item_id, quantity }
router.post("/:shopId/buy", requireUser, async (req, res) => {
  const shopId = Number(req.params.shopId);
  const itemId = Number(req.body?.item_id);
  const qty = Number(req.body?.quantity ?? 1);

  if (
    !Number.isInteger(shopId) ||
    !Number.isInteger(itemId) ||
    !Number.isInteger(qty) ||
    qty <= 0
  ) {
    return res.status(400).json({ error: "invalid input" });
  }

  await db.query("BEGIN");
  try {
    const stockRes = await db.query(
      `
      SELECT quantity, buy_price
      FROM npc_shop_stock
      WHERE shop_id = $1 AND item_id = $2
      FOR UPDATE
      `,
      [shopId, itemId],
    );

    if (stockRes.rowCount === 0) {
      await db.query("ROLLBACK");
      return res.status(404).json({ error: "item not sold here" });
    }

    const stock = stockRes.rows[0];
    if (stock.quantity < qty) {
      await db.query("ROLLBACK");
      return res.status(400).json({ error: "not enough stock" });
    }

    const totalCost = stock.buy_price * qty;

    const playerRes = await db.query(
      `
      SELECT coins
      FROM players
      WHERE user_id = $1
      FOR UPDATE
      `,
      [req.user.userId],
    );

    if (playerRes.rowCount === 0) {
      await db.query("ROLLBACK");
      return res.status(400).json({ error: "player not found" });
    }

    const coins = playerRes.rows[0].coins;
    if (coins < totalCost) {
      await db.query("ROLLBACK");
      return res.status(400).json({ error: "not enough coins" });
    }

    await db.query(
      `
      UPDATE players
      SET coins = coins - $1
      WHERE user_id = $2
      `,
      [totalCost, req.user.userId],
    );

    await db.query(
      `
      UPDATE npc_shop_stock
      SET quantity = quantity - $1
      WHERE shop_id = $2 AND item_id = $3
      `,
      [qty, shopId, itemId],
    );

    await db.query(
      `
      INSERT INTO player_items (player_id, item_id, quantity)
      SELECT p.id, $2, $3
      FROM players p
      WHERE p.user_id = $1
      ON CONFLICT (player_id, item_id)
      DO UPDATE SET quantity = player_items.quantity + EXCLUDED.quantity
      `,
      [req.user.userId, itemId, qty],
    );

    await db.query("COMMIT");
    res.json({ ok: true, spent: totalCost });
  } catch (e) {
    await db.query("ROLLBACK");
    res.status(500).json({ error: e.message || "buy failed" });
  }
});

// POST /api/npc-shops/:shopId/sell  body: { item_id, quantity }
router.post("/:shopId/sell", requireUser, async (req, res) => {
  const shopId = Number(req.params.shopId);
  const itemId = Number(req.body?.item_id);
  const qty = Number(req.body?.quantity ?? 1);

  if (
    !Number.isInteger(shopId) ||
    !Number.isInteger(itemId) ||
    !Number.isInteger(qty) ||
    qty <= 0
  ) {
    return res.status(400).json({ error: "invalid input" });
  }

  await db.query("BEGIN");
  try {
    // find the sell_price this shop will pay
    // prefer stock row (current pricing), else pool row, else reject
    const priceRes = await db.query(
      `
      SELECT sell_price FROM npc_shop_stock
      WHERE shop_id = $1 AND item_id = $2
      `,
      [shopId, itemId],
    );

    let sellPrice = priceRes.rows[0]?.sell_price;

    if (sellPrice == null) {
      const poolRes = await db.query(
        `
        SELECT sell_price, buy_price
        FROM npc_shop_item_pool
        WHERE shop_id = $1 AND item_id = $2
        `,
        [shopId, itemId],
      );

      if (poolRes.rowCount === 0) {
        await db.query("ROLLBACK");
        return res.status(400).json({ error: "this shop won't buy that item" });
      }

      sellPrice = poolRes.rows[0].sell_price;
    }

    sellPrice = Number(sellPrice);
    if (!Number.isFinite(sellPrice) || sellPrice < 0) {
      await db.query("ROLLBACK");
      return res.status(500).json({ error: "invalid shop pricing" });
    }

    // get player_id
    const playerIdRes = await db.query(
      `SELECT id FROM players WHERE user_id = $1`,
      [req.user.userId],
    );
    if (playerIdRes.rowCount === 0) {
      await db.query("ROLLBACK");
      return res.status(400).json({ error: "player not found" });
    }
    const playerId = playerIdRes.rows[0].id;

    // lock player inventory row
    const invRes = await db.query(
      `
      SELECT quantity
      FROM player_items
      WHERE player_id = $1 AND item_id = $2
      FOR UPDATE
      `,
      [playerId, itemId],
    );

    if (invRes.rowCount === 0 || invRes.rows[0].quantity < qty) {
      await db.query("ROLLBACK");
      return res.status(400).json({ error: "not enough items to sell" });
    }

    const earned = sellPrice * qty;

    // add coins
    await db.query(
      `
      UPDATE players
      SET coins = coins + $1
      WHERE user_id = $2
      `,
      [earned, req.user.userId],
    );

    // remove items
    await db.query(
      `
      UPDATE player_items
      SET quantity = quantity - $1
      WHERE player_id = $2 AND item_id = $3
      `,
      [qty, playerId, itemId],
    );

    // clean up zero rows (optional)
    await db.query(
      `
      DELETE FROM player_items
      WHERE player_id = $1 AND item_id = $2 AND quantity <= 0
      `,
      [playerId, itemId],
    );

    // optionally add the item into shop stock so you could buy it back before next restock
    await db.query(
      `
      INSERT INTO npc_shop_stock (shop_id, item_id, quantity, buy_price, sell_price)
      SELECT $1, p.item_id, $3, p.buy_price, p.sell_price
      FROM npc_shop_item_pool p
      WHERE p.shop_id = $1 AND p.item_id = $2
      ON CONFLICT (shop_id, item_id)
      DO UPDATE SET quantity = npc_shop_stock.quantity + EXCLUDED.quantity
      `,
      [shopId, itemId, qty],
    );

    await db.query("COMMIT");
    res.json({ ok: true, earned });
  } catch (e) {
    await db.query("ROLLBACK");
    res.status(500).json({ error: e.message || "sell failed" });
  }
});

export default router;
