// server/src/routes/gather.js
import express from "express";
import { db } from "../db/client.js";
import { requireUser } from "../middleware/requireUser.js";
import { rollChance, pickWeighted, addDrop, randInt } from "../utils/loot.js";

const router = express.Router();

async function getMaterialIdByName(name) {
  const r = await db.query(`SELECT id FROM materials WHERE name = $1`, [name]);
  return r.rows[0]?.id ?? null;
}

async function applyDropsToPlayer(playerId, drops) {
  // drops: [{name, qty}]
  // write each into player_materials
  for (const d of drops) {
    const materialId = await getMaterialIdByName(d.name);
    if (!materialId) continue;

    await db.query(
      `
      INSERT INTO player_materials (player_id, material_id, quantity)
      VALUES ($1, $2, $3)
      ON CONFLICT (player_id, material_id)
      DO UPDATE SET quantity = player_materials.quantity + EXCLUDED.quantity
      `,
      [playerId, materialId, d.qty],
    );
  }
}

// POST /api/gather/hunt
router.post("/hunt", requireUser, async (req, res) => {
  const drops = [];

  const main = pickWeighted([
    { name: "Raw Meat", weight: 60, min: 1, max: 3 },
    { name: "Raw Fish", weight: 40, min: 1, max: 3 },
  ]);
  addDrop(drops, main.name, main.qty);

  if (rollChance(45)) addDrop(drops, "Bone", 1);
  if (rollChance(30)) addDrop(drops, "Hide", 1);
  if (rollChance(25)) addDrop(drops, "Feather", 1);
  if (rollChance(8)) addDrop(drops, "Wool", 1);
  if (rollChance(10)) addDrop(drops, "Egg", 1);

  await applyDropsToPlayer(req.user.userId, drops);
  res.json({ ok: true, data: { drops } });
});

// POST /api/gather/wood
router.post("/wood", requireUser, async (req, res) => {
  const drops = [];

  // always wood logs
  addDrop(drops, "Wood Log", randInt(2, 6));

  // occasional extras
  if (rollChance(35)) addDrop(drops, "Stick", randInt(1, 3));
  if (rollChance(10)) addDrop(drops, "Plant Matter", 1); // bark/leaves flavor

  await applyDropsToPlayer(req.user.userId, drops);
  res.json({ ok: true, data: { drops } });
});

// POST /api/gather/mine
router.post("/mine", requireUser, async (req, res) => {
  const drops = [];

  // always some stone
  addDrop(drops, "Stone", randInt(2, 7));

  // weighted ore roll
  const ore = pickWeighted([
    { name: "Copper Ore", weight: 35, min: 1, max: 3 },
    { name: "Tin Ore", weight: 25, min: 1, max: 2 },
    { name: "Iron Ore", weight: 20, min: 1, max: 2 },
    { name: "Coal", weight: 12, min: 1, max: 2 },
    { name: "Silver Ore", weight: 6, min: 1, max: 1 },
    { name: "Gold Ore", weight: 2, min: 1, max: 1 },
  ]);
  addDrop(drops, ore.name, ore.qty);

  // flint bonus
  if (rollChance(18)) addDrop(drops, "Flint", 1);

  await applyDropsToPlayer(req.user.userId, drops);
  res.json({ ok: true, data: { drops } });
});

// POST /api/gather/plants
router.post("/plants", requireUser, async (req, res) => {
  const drops = [];

  // always some plant matter
  addDrop(drops, "Plant Matter", randInt(1, 4));

  // roll actual plants
  const plant1 = pickWeighted([
    { name: "Berry", weight: 25, min: 1, max: 4 },
    { name: "Herbs", weight: 20, min: 1, max: 3 },
    { name: "Wheat", weight: 18, min: 1, max: 3 },
    { name: "Potato", weight: 12, min: 1, max: 2 },
    { name: "Carrot", weight: 12, min: 1, max: 2 },
    { name: "Corn", weight: 8, min: 1, max: 2 },
    { name: "Cotton", weight: 3, min: 1, max: 1 },
    { name: "Sugarcane", weight: 2, min: 1, max: 1 },
  ]);
  addDrop(drops, plant1.name, plant1.qty);

  // small chance for a second roll
  if (rollChance(20)) {
    const plant2 = pickWeighted([
      { name: "Berry", weight: 25, min: 1, max: 3 },
      { name: "Herbs", weight: 20, min: 1, max: 2 },
      { name: "Wheat", weight: 18, min: 1, max: 2 },
      { name: "Potato", weight: 12, min: 1, max: 1 },
      { name: "Carrot", weight: 12, min: 1, max: 1 },
      { name: "Corn", weight: 8, min: 1, max: 1 },
      { name: "Cotton", weight: 3, min: 1, max: 1 },
      { name: "Sugarcane", weight: 2, min: 1, max: 1 },
    ]);
    addDrop(drops, plant2.name, plant2.qty);
  }

  await applyDropsToPlayer(req.user.userId, drops);
  res.json({ ok: true, data: { drops } });
});

export default router;
