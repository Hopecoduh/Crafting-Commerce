import express from "express";
import { db } from "../db/client.js";
import { requireUser } from "../middleware/requireUser.js";

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
    JOIN players p ON s.player_id = p.id
    JOIN users u ON p.user_id = u.id
    ORDER BY s.created_at DESC
  `);

  res.json(result.rows);
});

/**
 * POST /api/shop/list
 * Auth: list an item for sale
 */
router.post("/list", requireUser, async (req, res) => {
  const { item_id, price, quantity } = req.body;

  if (!item_id || !price || !quantity) {
    return res.status(400).json({
      error: "item_id, price, quantity required",
    });
  }

  if (price <= 0 || quantity <= 0) {
    return res.status(400).json({
      error: "price and quantity must be positive",
    });
  }

  try {
    await db.query("BEGIN");

    // safely reduce inventory
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
      return res.status(400).json({ error: "not enough items to sell" });
    }

    // create listing
    const listing = await db.query(
      `
      INSERT INTO shop_listings (player_id, item_id, price, quantity)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [req.user.userId, item_id, price, quantity],
    );

    await db.query("COMMIT");

    res.status(201).json(listing.rows[0]);
  } catch (err) {
    await db.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ error: "could not create listing" });
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
    const listing = await db.query(
      `
      SELECT * FROM shop_listings
      WHERE id = $1
      FOR UPDATE
      `,
      [listingId],
    );

    if (!listing.rows[0]) {
      await db.query("ROLLBACK");
      return res.status(404).json({ error: "listing not found" });
    }

    const l = listing.rows[0];

    // pay seller
    await db.query(`UPDATE players SET coins = coins + $1 WHERE id = $2`, [
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

    res.json({ success: true });
  } catch (err) {
    await db.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ error: "purchase failed" });
  }
});

export default router;
