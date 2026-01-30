import express from "express";
import cors from "cors";
import "dotenv/config";
import { db } from "./db/client.js";
import authRouter from "./routes/auth.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);

app.get("/health", (req, res) => {
  res.json({ ok: true, message: "server running" });
});

app.get("/db-test", async (req, res) => {
  const { rows } = await db.query("SELECT NOW() as now");
  res.json({ ok: true, now: rows[0].now });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API listening on ${PORT}`));
