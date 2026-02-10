import express from "express";
import { db } from "../db/client.js";
import { requireUser } from "../middleware/requireUser.js";
import { craftSchema } from "../validation/crafting.js";

const router = express.Router();

// GET /api/crafting/recipes
router.get("/recipes", requireUser, async (req, res) => {
  const result = await db.query(`
    SELECT
      r.id as recipe_id,
      r.seconds as seconds,
      i.id as item_id,
      i.name as item_name,
      i.base_price,
      json_agg(
        json_build_object(
          'material_id', m.id,
          'material_name', m.name,
          'quantity', ri.quantity
        )
        ORDER BY m.id
      ) as ingredients
    FROM recipes r
    JOIN items i ON r.item_id = i.id
    JOIN recipe_ingredients ri ON ri.recipe_id = r.id
    JOIN materials m ON ri.material_id = m.id
    GROUP BY r.id, r.seconds, i.id
    ORDER BY r.id
  `);

  res.json(result.rows);
});

// POST /api/crafting/craft

router.post("/craft", requireUser, async (req, res) => {
  const parsed = craftSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      ok: false,
      error: "invalid input",
      details: parsed.error.format(),
    });
  }

  const { recipe_id } = parsed.data;

  const ingredients = await db.query(
    `
    SELECT material_id, quantity
    FROM recipe_ingredients
    WHERE recipe_id = $1
    `,
    [recipe_id],
  );

  for (const ing of ingredients.rows) {
    const inv = await db.query(
      `
      SELECT quantity FROM player_materials
      WHERE player_id = $1 AND material_id = $2
      `,
      [req.user.userId, ing.material_id],
    );

    if (!inv.rows[0] || inv.rows[0].quantity < ing.quantity) {
      return res.status(400).json({ error: "not enough materials" });
    }
  }

  // deduct materials
  for (const ing of ingredients.rows) {
    const result = await db.query(
      `
    UPDATE player_materials
    SET quantity = quantity - $1
    WHERE player_id = $2
      AND material_id = $3
      AND quantity >= $1
    RETURNING *
    `,
      [ing.quantity, req.user.userId, ing.material_id],
    );

    if (result.rowCount === 0) {
      return res.status(400).json({ error: "not enough materials" });
    }
  }

  // give item
  const item = await db.query(
    `
  SELECT r.item_id, i.name as item_name, r.seconds
  FROM recipes r
  JOIN items i ON i.id = r.item_id
  WHERE r.id = $1
  `,
    [recipe_id],
  );

  const result = await db.query(
    `
    INSERT INTO player_items (player_id, item_id, quantity)
    VALUES ($1, $2, 1)
    ON CONFLICT (player_id, item_id)
    DO UPDATE SET quantity = player_items.quantity + 1
    RETURNING *
    `,
    [req.user.userId, item.rows[0].item_id],
  );

  res.json({
    ok: true,
    data: result.rows[0],
  });
});

export default router;
