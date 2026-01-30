CREATE TABLE items (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  base_price INTEGER NOT NULL
);

CREATE TABLE recipes (
  id SERIAL PRIMARY KEY,
  item_id INTEGER NOT NULL REFERENCES items(id),
  craft_time INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE recipe_ingredients (
  id SERIAL PRIMARY KEY,
  recipe_id INTEGER NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  material_id INTEGER NOT NULL REFERENCES materials(id),
  quantity INTEGER NOT NULL
);

CREATE TABLE player_items (
  id SERIAL PRIMARY KEY,
  player_id INTEGER NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  item_id INTEGER NOT NULL REFERENCES items(id),
  quantity INTEGER NOT NULL DEFAULT 0,
  UNIQUE(player_id, item_id)
);
