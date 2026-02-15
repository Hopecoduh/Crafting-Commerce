// client/src/components/actions/actionApi.js
import { getToken } from "../../api.js";

const BASE_URL = import.meta.env.VITE_API_URL || "";

export async function postAction(url, body) {
  const token = getToken();

  const res = await fetch(`${BASE_URL}${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  const text = await res.text().catch(() => "");
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    throw new Error(
      data?.error || data?.message || `Request failed (${res.status})`,
    );
  }

  return data; // gather returns { ok:true, drops }
}

router.post("/complete/:id", requireUser, async (req, res, next) => {
  try {
    const actionId = req.params.id;

    const playerIdRes = await db.query(
      `SELECT id FROM players WHERE user_id = $1`,
      [req.user.userId],
    );

    const playerId = playerIdRes.rows[0]?.id;
    if (!playerId) {
      return res.status(400).json({ ok: false, error: "Player not found" });
    }

    const actionRes = await db.query(
      `SELECT * FROM player_actions WHERE id = $1 AND player_id = $2`,
      [actionId, playerId],
    );

    const action = actionRes.rows[0];

    if (!action) {
      return res.status(404).json({ ok: false, error: "Action not found" });
    }

    if (action.completed) {
      return res.status(400).json({ ok: false, error: "Already completed" });
    }

    if (new Date(action.ends_at) > new Date()) {
      return res
        .status(400)
        .json({ ok: false, error: "Action not finished yet" });
    }

    let rewardMessage = "No reward logic yet";

    if (action.type === "gather_wood") {
      await db.query(
        `
        INSERT INTO player_materials (player_id, material_id, quantity)
        VALUES ($1, (SELECT id FROM materials WHERE name = 'Wood Log'), 3)
        ON CONFLICT (player_id, material_id)
        DO UPDATE SET quantity = player_materials.quantity + 3
        `,
        [playerId],
      );

      rewardMessage = "Received Wood Logs";
    }

    /* -------------------------------- */

    await db.query(`UPDATE player_actions SET completed = true WHERE id = $1`, [
      actionId,
    ]);

    res.json({
      ok: true,
      message: rewardMessage,
    });
  } catch (err) {
    next(err);
  }
});
