CREATE TABLE materials (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  base_value INTEGER NOT NULL
);

CREATE TABLE player_materials (
  id SERIAL PRIMARY KEY,
  player_id INTEGER NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  material_id INTEGER NOT NULL REFERENCES materials(id),
  quantity INTEGER NOT NULL DEFAULT 0,
  UNIQUE(player_id, material_id)
);
