import express from "express";
import { db } from "../db/client.js";
import { requireUser } from "../middleware/requireUser.js";
import { gatherSchema } from "../validation/inventory.js";

const router = express.Router();

// helper to resolve playerId from logged-in user
async function getPlayerId(userId) {
  const result = await db.query(`SELECT id FROM players WHERE user_id = $1`, [
    userId,
  ]);

  return result.rows[0]?.id ?? null;
}

// GET /api/inventory/materials
router.get("/materials", requireUser, async (req, res, next) => {
  try {
    const playerId = await getPlayerId(req.user.userId);

    if (!playerId) {
      return res.status(404).json({ ok: false, error: "Player not found" });
    }

    const result = await db.query(
      `
      SELECT 
        m.id, 
        m.name, 
        COALESCE(pm.quantity, 0) AS quantity
      FROM materials m
      LEFT JOIN player_materials pm
        ON pm.material_id = m.id
       AND pm.player_id = $1
      ORDER BY m.id
      `,
      [playerId],
    );

    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// GET /api/inventory/items
router.get("/items", requireUser, async (req, res, next) => {
  try {
    const playerId = await getPlayerId(req.user.userId);

    if (!playerId) {
      return res.status(404).json({ ok: false, error: "Player not found" });
    }

    const result = await db.query(
      `
      SELECT 
        i.id,
        i.name,
        i.base_price, 
        COALESCE(pi.quantity, 0) AS quantity
      FROM items i
      LEFT JOIN player_items pi
        ON pi.item_id = i.id
       AND pi.player_id = $1
      ORDER BY i.id
      `,
      [playerId],
    );

    res.json({ ok: true, data: result.rows });
  } catch (err) {
    next(err);
  }
});

// POST /api/inventory/gather (legacy/simple gather route)
router.post("/gather", requireUser, async (req, res, next) => {
  try {
    const parsed = gatherSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        ok: false,
        error: "invalid input",
        details: parsed.error.format(),
      });
    }

    const playerId = await getPlayerId(req.user.userId);

    if (!playerId) {
      return res.status(404).json({ ok: false, error: "Player not found" });
    }

    const { material_id } = parsed.data;

    const gained = Math.floor(Math.random() * 20) + 1;

    const result = await db.query(
      `
      INSERT INTO player_materials (player_id, material_id, quantity)
      VALUES ($1, $2, $3)
      ON CONFLICT (player_id, material_id)
      DO UPDATE SET quantity = player_materials.quantity + EXCLUDED.quantity
      RETURNING *
      `,
      [playerId, material_id, gained],
    );

    res.json({
      ok: true,
      data: {
        gained,
        material_id,
        row: result.rows[0],
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
