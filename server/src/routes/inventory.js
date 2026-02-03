import express from "express";
import { db } from "../db/client.js";
import { requireUser } from "../middleware/requireUser.js";
import { gatherSchema } from "../validation/inventory.js";

const router = express.Router();

// GET /api/inventory/materials
router.get("/materials", requireUser, async (req, res) => {
  const result = await db.query(
    `
    SELECT m.id, m.name, pm.quantity
    FROM materials m
    LEFT JOIN player_materials pm
      ON pm.material_id = m.id
     AND pm.player_id = $1
    ORDER BY m.id
    `,
    [req.user.userId],
  );

  res.json(result.rows);
});

// GET /api/inventory/items
router.get("/items", requireUser, async (req, res) => {
  const result = await db.query(
    `
    SELECT i.id, i.name, pi.quantity
    FROM items i
    LEFT JOIN player_items pi
      ON pi.item_id = i.id
     AND pi.player_id = $1
    ORDER BY i.id
    `,
    [req.user.userId],
  );

  res.json({ ok: true, data: result.rows });
});

// POST /api/inventory/gather
router.post("/gather", requireUser, async (req, res) => {
  const parsed = gatherSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      ok: false,
      error: "invalid input",
      details: parsed.error.format(),
    });
  }

  const { material_id } = parsed.data;

  const result = await db.query(
    `
    INSERT INTO player_materials (player_id, material_id, quantity)
    VALUES ($1, $2, 1)
    ON CONFLICT (player_id, material_id)
    DO UPDATE SET quantity = player_materials.quantity + 1
    RETURNING *
    `,
    [req.user.userId, material_id],
  );

  res.json({
    ok: true,
    data: result.rows[0],
  });
});

export default router;
