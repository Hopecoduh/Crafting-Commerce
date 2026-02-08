CREATE TABLE IF NOT EXISTS shop_listings (
  id SERIAL PRIMARY KEY,
  player_id INTEGER NOT NULL REFERENCES players(user_id) ON DELETE CASCADE,
  item_id INTEGER NOT NULL REFERENCES items(id),
  price INTEGER NOT NULL CHECK (price > 0),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS shop_listings_player_item_unique
ON shop_listings (player_id, item_id);

-- one listing per item per player (required for UPSERT)
ALTER TABLE shop_listings
ADD CONSTRAINT shop_listings_player_item_unique UNIQUE (player_id, item_id);


-- TRANSACTIONS
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,

  -- Same rule: player_id is the USER id
  player_id INTEGER NOT NULL REFERENCES players(user_id) ON DELETE CASCADE,

  item_id INTEGER NOT NULL REFERENCES items(id),
  price INTEGER NOT NULL CHECK (price > 0),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  created_at TIMESTAMP DEFAULT NOW()
);

