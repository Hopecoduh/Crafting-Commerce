import express from "express";
import cors from "cors";
import "dotenv/config";
console.log(
  "DATABASE_URL:",
  process.env.DATABASE_URL?.includes("neon")
    ? "NEON"
    : process.env.DATABASE_URL,
);
import { db } from "./db/client.js";
import authRouter from "./routes/auth.js";
import inventoryRouter from "./routes/inventory.js";
import craftingRouter from "./routes/crafting.js";
import shopRouter from "./routes/shop.js";
import gatherRouter from "./routes/gather.js";
import { errorHandler } from "./middleware/errorHandler.js";
import npcShopsRouter from "./routes/npcShops.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

app.get("/boom", (req, res) => {
  throw new Error("test error handler");
});

app.use("/api/auth", authRouter);
app.use("/api/inventory", inventoryRouter);
app.use("/api/crafting", craftingRouter);
app.use("/api/shop", shopRouter);
app.use("/api/npc-shops", npcShopsRouter);

app.use("/api/gather", gatherRouter);

app.use(errorHandler);

app.get("/health", (req, res) => {
  res.json({ ok: true, message: "server running" });
});

app.get("/db-test", async (req, res) => {
  const { rows } = await db.query("SELECT NOW() as now");
  res.json({ ok: true, now: rows[0].now });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API listening on ${PORT}`));
