CREATE TABLE IF NOT EXISTS npc_shops (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  restock_seconds INTEGER NOT NULL DEFAULT 3600,
  last_restock_at TIMESTAMPTZ,
  next_restock_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS npc_shop_item_pool (
  id SERIAL PRIMARY KEY,
  shop_id INTEGER NOT NULL REFERENCES npc_shops(id) ON DELETE CASCADE,
  item_id INTEGER NOT NULL REFERENCES items(id),
  weight INTEGER NOT NULL DEFAULT 10,
  min_qty INTEGER NOT NULL DEFAULT 1,
  max_qty INTEGER NOT NULL DEFAULT 5,
  buy_price INTEGER NOT NULL,
  sell_price INTEGER NOT NULL,
  UNIQUE (shop_id, item_id)
);

CREATE TABLE IF NOT EXISTS npc_shop_stock (
  shop_id INTEGER NOT NULL REFERENCES npc_shops(id) ON DELETE CASCADE,
  item_id INTEGER NOT NULL REFERENCES items(id),
  quantity INTEGER NOT NULL DEFAULT 0,
  buy_price INTEGER NOT NULL,
  sell_price INTEGER NOT NULL,
  PRIMARY KEY (shop_id, item_id)
);