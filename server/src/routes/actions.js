import express from "express";
import { db } from "../db/client.js";
import { requireUser } from "../middleware/requireUser.js";

const router = express.Router();

async function getPlayerId(userId) {
  const result = await db.query(`SELECT id FROM players WHERE user_id = $1`, [
    userId,
  ]);
  return result.rows[0]?.id ?? null;
}

router.post("/start", requireUser, async (req, res, next) => {
  try {
    const playerId = await getPlayerId(req.user.userId);
    if (!playerId) {
      return res.status(400).json({ ok: false, error: "Player not found" });
    }

    const { type, seconds, recipe_id = null } = req.body;

    if (!type || !seconds) {
      return res.status(400).json({ ok: false, error: "Invalid action data" });
    }

    const endsAt = new Date(Date.now() + seconds * 1000);

    const result = await db.query(
      `
      INSERT INTO player_actions (player_id, type, recipe_id, ends_at)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [playerId, type, recipe_id, endsAt],
    );

    res.json({
      ok: true,
      action: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
});

export default router;
