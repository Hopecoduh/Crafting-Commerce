import express from "express";
import { db } from "../db/client.js";
import { requireUser } from "../middleware/requireUser.js";
import { listItemSchema } from "../validation/shop.js";

const router = express.Router();

/**
 * GET /api/shop/listings
 * Public: view all active listings
 */
router.get("/listings", async (req, res) => {
  const result = await db.query(`
    SELECT
      s.id,
      s.price,
      s.quantity,
      i.id AS item_id,
      i.name AS item_name,
      u.display_name AS seller
    FROM shop_listings s
    JOIN items i ON s.item_id = i.id
    JOIN players p ON s.player_id = p.user_id
    JOIN users u ON p.user_id = u.id
    ORDER BY s.created_at DESC
  `);

  res.json({ ok: true, data: result.rows });
});

/**
 * POST /api/shop/list
 * Auth: move items from inventory -> store listing
 *
 * Rule: one listing per (player_id, item_id).
 * - Quantity adds onto the existing listing.
 * - Price becomes whatever the user enters (latest price wins).
 */
router.post("/list", requireUser, async (req, res) => {
  const parsed = listItemSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      ok: false,
      error: "invalid input",
      details: parsed.error.format(),
    });
  }

  const { item_id, price, quantity } = parsed.data;

  try {
    await db.query("BEGIN");

    // 1) Reduce inventory first (must own enough)
    const inv = await db.query(
      `
      UPDATE player_items
      SET quantity = quantity - $1
      WHERE player_id = $2
        AND item_id = $3
        AND quantity >= $1
      RETURNING *
      `,
      [quantity, req.user.userId, item_id],
    );

    if (inv.rowCount === 0) {
      await db.query("ROLLBACK");
      return res.status(400).json({
        ok: false,
        error: "not enough items to stock",
        details: err.message,
      });
    }

    // 2) Upsert listing (one row per item per player)
    const listingRes = await db.query(
      `
      INSERT INTO shop_listings (player_id, item_id, price, quantity)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (player_id, item_id)
      DO UPDATE SET
        quantity = shop_listings.quantity + EXCLUDED.quantity,
        price = EXCLUDED.price
      RETURNING *
      `,
      [req.user.userId, item_id, price, quantity],
    );

    await db.query("COMMIT");

    res.status(201).json({
      ok: true,
      data: listingRes.rows[0],
    });
  } catch (err) {
    await db.query("ROLLBACK");
    console.error(err);
    res.status(500).json({
      ok: false,
      error: "could not create/update listing",
      details: null,
    });
  }
});

/**
 * PATCH /api/shop/my-listings/:listingId
 * Auth: update price for one of your listings
 */
router.patch("/my-listings/:listingId", requireUser, async (req, res) => {
  const { listingId } = req.params;
  const { price } = req.body;

  const p = Number(price);
  if (!p || p <= 0) {
    return res.status(400).json({
      ok: false,
      error: "valid price required",
      details: null,
    });
  }

  try {
    const result = await db.query(
      `
      UPDATE shop_listings
      SET price = $1
      WHERE id = $2
        AND player_id = $3
      RETURNING *
      `,
      [p, listingId, req.user.userId],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        ok: false,
        error: "listing not found",
        details: null,
      });
    }

    res.json({ ok: true, data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      ok: false,
      error: "could not update price",
      details: null,
    });
  }
});

// POST /api/shop/unlist/:listingId
// Auth: remove listing and return items to inventory
router.post("/unlist/:listingId", requireUser, async (req, res) => {
  const { listingId } = req.params;

  try {
    await db.query("BEGIN");

    // lock listing, ensure it belongs to this user
    const listingRes = await db.query(
      `
      SELECT *
      FROM shop_listings
      WHERE id = $1 AND player_id = $2
      FOR UPDATE
      `,
      [listingId, req.user.userId],
    );

    const l = listingRes.rows[0];
    if (!l) {
      await db.query("ROLLBACK");
      return res.status(404).json({ ok: false, error: "listing not found" });
    }

    // return items to inventory (upsert)
    await db.query(
      `
      INSERT INTO player_items (player_id, item_id, quantity)
      VALUES ($1, $2, $3)
      ON CONFLICT (player_id, item_id)
      DO UPDATE SET quantity = player_items.quantity + EXCLUDED.quantity
      `,
      [req.user.userId, l.item_id, l.quantity],
    );

    // delete listing
    await db.query(`DELETE FROM shop_listings WHERE id = $1`, [l.id]);

    await db.query("COMMIT");

    res.json({ ok: true, data: { unlisted: true } });
  } catch (err) {
    await db.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ ok: false, error: "could not unlist item" });
  }
});

/**
 * POST /api/shop/buy/:listingId
 * Public: simulate NPC buying listing
 */
router.post("/buy/:listingId", async (req, res) => {
  const { listingId } = req.params;

  try {
    await db.query("BEGIN");

    // lock listing row to prevent double-buy
    const listingRes = await db.query(
      `
      SELECT * FROM shop_listings
      WHERE id = $1
      FOR UPDATE
      `,
      [listingId],
    );

    const l = listingRes.rows[0];

    if (!l) {
      await db.query("ROLLBACK");
      return res.status(404).json({
        ok: false,
        error: "listing not found",
        details: null,
      });
    }

    // pay seller (players row is keyed by user_id in this project)
    await db.query(`UPDATE players SET coins = coins + $1 WHERE user_id = $2`, [
      l.price * l.quantity,
      l.player_id,
    ]);

    // log transaction
    await db.query(
      `
      INSERT INTO transactions (player_id, item_id, price, quantity)
      VALUES ($1, $2, $3, $4)
      `,
      [l.player_id, l.item_id, l.price, l.quantity],
    );

    // remove listing
    await db.query(`DELETE FROM shop_listings WHERE id = $1`, [listingId]);

    await db.query("COMMIT");

    res.json({
      ok: true,
      data: { purchased: true },
    });
  } catch (err) {
    await db.query("ROLLBACK");
    console.error(err);
    res.status(500).json({
      ok: false,
      error: "purchase failed",
      details: null,
    });
  }
});

/**
 * GET /api/shop/my-listings
 * Auth: view only your listings
 */
router.get("/my-listings", requireUser, async (req, res) => {
  const result = await db.query(
    `
    SELECT
      s.id,
      s.price,
      s.quantity,
      i.id AS item_id,
      i.name AS item_name
    FROM shop_listings s
    JOIN items i ON s.item_id = i.id
    WHERE s.player_id = $1
    ORDER BY s.created_at DESC
    `,
    [req.user.userId],
  );

  res.json({ ok: true, data: result.rows });
});

export default router;
