// server/src/routes/gather.js
import express from "express";
import { db } from "../db/client.js";
import { requireUser } from "../middleware/requireUser.js";
import { rollChance, pickWeighted, addDrop, randInt } from "../utils/loot.js";

const router = express.Router();

async function getPlayerId(userId) {
  const result = await db.query(`SELECT id FROM players WHERE user_id = $1`, [
    userId,
  ]);
  return result.rows[0]?.id ?? null;
}

async function getMaterialIdByName(name) {
  const result = await db.query(`SELECT id FROM materials WHERE name = $1`, [
    name,
  ]);
  return result.rows[0]?.id ?? null;
}

async function applyDropsToPlayer(playerId, drops) {
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
router.post("/hunt", requireUser, async (req, res, next) => {
  try {
    const playerId = await getPlayerId(req.user.userId);
    if (!playerId) {
      return res.status(400).json({ ok: false, error: "Player not found" });
    }

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

    await applyDropsToPlayer(playerId, drops);

    res.json({ ok: true, drops });
  } catch (err) {
    next(err);
  }
});

// POST /api/gather/wood
router.post("/wood", requireUser, async (req, res, next) => {
  try {
    const playerId = await getPlayerId(req.user.userId);
    if (!playerId) {
      return res.status(400).json({ ok: false, error: "Player not found" });
    }

    const drops = [];

    addDrop(drops, "Wood Log", randInt(2, 6));
    if (rollChance(35)) addDrop(drops, "Stick", randInt(1, 3));
    if (rollChance(10)) addDrop(drops, "Plant Matter", 1);

    await applyDropsToPlayer(playerId, drops);

    res.json({ ok: true, drops });
  } catch (err) {
    next(err);
  }
});

// POST /api/gather/mine
router.post("/mine", requireUser, async (req, res, next) => {
  try {
    const playerId = await getPlayerId(req.user.userId);
    if (!playerId) {
      return res.status(400).json({ ok: false, error: "Player not found" });
    }

    const drops = [];

    addDrop(drops, "Stone", randInt(2, 7));

    const ore = pickWeighted([
      { name: "Copper Ore", weight: 35, min: 1, max: 3 },
      { name: "Tin Ore", weight: 25, min: 1, max: 2 },
      { name: "Iron Ore", weight: 20, min: 1, max: 2 },
      { name: "Coal", weight: 12, min: 1, max: 2 },
      { name: "Silver Ore", weight: 6, min: 1, max: 1 },
      { name: "Gold Ore", weight: 2, min: 1, max: 1 },
    ]);

    addDrop(drops, ore.name, ore.qty);

    if (rollChance(18)) addDrop(drops, "Flint", 1);

    await applyDropsToPlayer(playerId, drops);

    res.json({ ok: true, drops });
  } catch (err) {
    next(err);
  }
});

// POST /api/gather/plants
router.post("/plants", requireUser, async (req, res, next) => {
  try {
    const playerId = await getPlayerId(req.user.userId);
    if (!playerId) {
      return res.status(400).json({ ok: false, error: "Player not found" });
    }

    const drops = [];

    addDrop(drops, "Plant Matter", randInt(1, 4));

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

    await applyDropsToPlayer(playerId, drops);

    res.json({ ok: true, drops });
  } catch (err) {
    next(err);
  }
});

export default router;
