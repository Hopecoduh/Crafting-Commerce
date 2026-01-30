import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../db/client.js";
import { requireUser } from "../middleware/requireUser.js";

const router = express.Router();

function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
}

router.post("/register", async (req, res) => {
  const { email, password, display_name } = req.body;

  if (!email || !password || !display_name) {
    return res
      .status(400)
      .json({ error: "email, password, display_name required" });
  }

  try {
    const hash = await bcrypt.hash(password, 10);

    const userResult = await db.query(
      `INSERT INTO users (email, password_hash, display_name)
       VALUES ($1, $2, $3)
       RETURNING id, email, display_name`,
      [email.toLowerCase(), hash, display_name],
    );

    const user = userResult.rows[0];

    const playerResult = await db.query(
      `INSERT INTO players (user_id, coins)
       VALUES ($1, 0)
       RETURNING id, user_id, coins`,
      [user.id],
    );

    const player = playerResult.rows[0];

    const token = signToken({ userId: user.id });

    res.status(201).json({ user, player, token });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ error: "email already in use" });
    }
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "email and password required" });
  }

  const userResult = await db.query(
    `SELECT id, email, password_hash, display_name
     FROM users
     WHERE email = $1`,
    [email.toLowerCase()],
  );

  const userRow = userResult.rows[0];
  if (!userRow) return res.status(401).json({ error: "invalid credentials" });

  const ok = await bcrypt.compare(password, userRow.password_hash);
  if (!ok) return res.status(401).json({ error: "invalid credentials" });

  const playerResult = await db.query(
    `SELECT id, user_id, coins
     FROM players
     WHERE user_id = $1`,
    [userRow.id],
  );

  const token = signToken({ userId: userRow.id });

  res.json({
    user: {
      id: userRow.id,
      email: userRow.email,
      display_name: userRow.display_name,
    },
    player: playerResult.rows[0],
    token,
  });
});

router.get("/me", requireUser, async (req, res) => {
  const userResult = await db.query(
    `SELECT id, email, display_name FROM users WHERE id = $1`,
    [req.user.userId],
  );

  const playerResult = await db.query(
    `SELECT id, user_id, coins FROM players WHERE user_id = $1`,
    [req.user.userId],
  );

  res.json({ user: userResult.rows[0], player: playerResult.rows[0] });
});

export default router;
