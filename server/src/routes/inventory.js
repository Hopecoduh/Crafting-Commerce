import express from "express";
import { db } from "../db/client.js";
import { requireUser } from "../middleware/requireUser.js";

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

// POST /api/inventory/gather
router.post("/gather", requireUser, async (req, res) => {
  const { material_id } = req.body;

  if (!material_id) {
    return res.status(400).json({ error: "material_id required" });
  }

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

  res.json(result.rows[0]);
});

export default router;
