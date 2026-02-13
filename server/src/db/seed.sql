BEGIN;

-- Order matters
TRUNCATE TABLE
  recipe_ingredients,
  recipes,
  player_items,
  player_materials,
  shop_listings,
  items,
  materials
RESTART IDENTITY CASCADE;

-- =========================================================
-- MATERIALS (gathered + processed ingredients)
-- =========================================================

INSERT INTO materials (name, base_value) VALUES
  -- Raw / gathered
  ('Wood Log', 1),
  ('Stone', 1),
  ('Flint', 1),
  ('Clay', 1),
  ('Sand', 1),
  ('Water', 1),

  -- Ores / fuel
  ('Copper Ore', 1),
  ('Tin Ore', 1),
  ('Iron Ore', 1),
  ('Silver Ore', 1),
  ('Gold Ore', 1),
  ('Coal', 1),

  -- Plants / farming
  ('Wheat', 1),
  ('Corn', 1),
  ('Carrot', 1),
  ('Potato', 1),
  ('Berry', 1),
  ('Herbs', 1),
  ('Cotton', 1),
  ('Sugarcane', 1),

  -- Animal / hunting
  ('Raw Meat', 1),
  ('Raw Fish', 1),
  ('Hide', 1),
  ('Bone', 1),
  ('Feather', 1),
  ('Wool', 1),
  ('Milk', 1),
  ('Egg', 1),

  -- Plant processing chain
  ('Plant Matter', 1),
  ('Fiber', 1),

  -- Processed materials (crafted ingredients)
  ('Stick', 1),
  ('Plank', 1),
  ('Charcoal', 1),
  ('Brick', 1),
  ('Glass Bottle', 1),
  ('Rope', 1),
  ('Cloth', 1),
  ('Leather', 1),
  ('Leather Strips', 1),
  ('Flour', 1),
  ('Sugar', 1),
  ('Water Bottle', 1),
  ('Milk Bottle', 1),

  -- Smelted metals (crafted ingredients)
  ('Copper Ingot', 1),
  ('Tin Ingot', 1),
  ('Bronze Ingot', 1),
  ('Iron Ingot', 1),
  ('Steel Ingot', 1),
  ('Silver Ingot', 1),
  ('Gold Ingot', 1);

-- =========================================================
-- ITEMS (things you craft & sell)
-- =========================================================
INSERT INTO items (name, base_price) VALUES
  -- Processed goods / intermediates you may want to sell
  ('Plant Matter', 1),
  ('Fiber', 2),
  ('Stick Bundle', 3),
  ('Plank Board', 6),
  ('Stone Brick', 7),
  ('Glass Bottle', 5),
  ('Rope', 9),
  ('Cloth', 14),
  ('Leather', 16),
  ('Leather Strips', 8),
  ('Flour', 4),
  ('Sugar', 4),

  -- Metal outputs (sellable)
  ('Copper Ingot', 18),
  ('Tin Ingot', 16),
  ('Bronze Ingot', 28),
  ('Iron Ingot', 22),
  ('Steel Ingot', 35),
  ('Silver Ingot', 45),
  ('Gold Ingot', 60),

  -- Weapons / gear
  ('Bronze Axe', 65),
  ('Iron Axe', 95),
  ('Steel Axe', 125),
  ('Bronze Sword', 110),
  ('Iron Sword', 150),
  ('Steel Sword', 190),
  ('Bow', 85),
  ('Arrow Bundle', 25),
  ('Wooden Shield', 80),
  ('Bronze Shield', 140),
  ('Iron Shield', 170),
  ('Steel Shield', 210),

  -- Food & consumables
  ('Cooked Meat', 12),
  ('Cooked Fish', 12),
  ('Berry Jam', 14),
  ('Bread', 16),
  ('Vegetable Soup', 18),
  ('Meat Stew', 22),
  ('Meat Pie', 30),
  ('Milk Bottle', 10),
  ('Water Bottle', 10),
  ('Juice', 12),
  ('Ale', 20),

  -- Trade goods
  ('Simple Jewelry', 75),
  ('Fine Jewelry', 160),
  ('Gold Coin', 100),
  ('Silver Coin', 60);

-- =========================================================
-- RECIPES (1 recipe per item)
-- =========================================================

INSERT INTO recipes (item_id) VALUES
  -- Intermediates
  ((SELECT id FROM items WHERE name = 'Plant Matter')),
  ((SELECT id FROM items WHERE name = 'Fiber')),
  ((SELECT id FROM items WHERE name = 'Stick Bundle')),
  ((SELECT id FROM items WHERE name = 'Plank Board')),
  ((SELECT id FROM items WHERE name = 'Stone Brick')),
  ((SELECT id FROM items WHERE name = 'Glass Bottle')),
  ((SELECT id FROM items WHERE name = 'Rope')),
  ((SELECT id FROM items WHERE name = 'Cloth')),
  ((SELECT id FROM items WHERE name = 'Leather')),
  ((SELECT id FROM items WHERE name = 'Leather Strips')),
  ((SELECT id FROM items WHERE name = 'Flour')),
  ((SELECT id FROM items WHERE name = 'Sugar')),

  -- Ingots
  ((SELECT id FROM items WHERE name = 'Copper Ingot')),
  ((SELECT id FROM items WHERE name = 'Tin Ingot')),
  ((SELECT id FROM items WHERE name = 'Bronze Ingot')),
  ((SELECT id FROM items WHERE name = 'Iron Ingot')),
  ((SELECT id FROM items WHERE name = 'Steel Ingot')),
  ((SELECT id FROM items WHERE name = 'Silver Ingot')),
  ((SELECT id FROM items WHERE name = 'Gold Ingot')),

  -- Weapons / gear
  ((SELECT id FROM items WHERE name = 'Bronze Axe')),
  ((SELECT id FROM items WHERE name = 'Iron Axe')),
  ((SELECT id FROM items WHERE name = 'Steel Axe')),
  ((SELECT id FROM items WHERE name = 'Bronze Sword')),
  ((SELECT id FROM items WHERE name = 'Iron Sword')),
  ((SELECT id FROM items WHERE name = 'Steel Sword')),
  ((SELECT id FROM items WHERE name = 'Bow')),
  ((SELECT id FROM items WHERE name = 'Arrow Bundle')),
  ((SELECT id FROM items WHERE name = 'Wooden Shield')),
  ((SELECT id FROM items WHERE name = 'Bronze Shield')),
  ((SELECT id FROM items WHERE name = 'Iron Shield')),
  ((SELECT id FROM items WHERE name = 'Steel Shield')),

  -- Food
  ((SELECT id FROM items WHERE name = 'Cooked Meat')),
  ((SELECT id FROM items WHERE name = 'Cooked Fish')),
  ((SELECT id FROM items WHERE name = 'Berry Jam')),
  ((SELECT id FROM items WHERE name = 'Bread')),
  ((SELECT id FROM items WHERE name = 'Vegetable Soup')),
  ((SELECT id FROM items WHERE name = 'Meat Stew')),
  ((SELECT id FROM items WHERE name = 'Meat Pie')),
  ((SELECT id FROM items WHERE name = 'Milk Bottle')),
  ((SELECT id FROM items WHERE name = 'Water Bottle')),
  ((SELECT id FROM items WHERE name = 'Juice')),
  ((SELECT id FROM items WHERE name = 'Ale')),

  -- Trade goods
  ((SELECT id FROM items WHERE name = 'Simple Jewelry')),
  ((SELECT id FROM items WHERE name = 'Fine Jewelry')),
  ((SELECT id FROM items WHERE name = 'Gold Coin')),
  ((SELECT id FROM items WHERE name = 'Silver Coin'));

-- =========================================================
-- RECIPE INGREDIENTS
-- (recipe_ingredients references MATERIALS ONLY)
-- =========================================================

-- ---------- Plant chain ----------

INSERT INTO recipe_ingredients (recipe_id, material_id, quantity)
VALUES
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Plant Matter'),
  (SELECT id FROM materials WHERE name='Berry'),
  2
);

INSERT INTO recipe_ingredients (recipe_id, material_id, quantity)
VALUES
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Fiber'),
  (SELECT id FROM materials WHERE name='Plant Matter'),
  3
);

-- ---------- Basic processed ----------

INSERT INTO recipe_ingredients (recipe_id, material_id, quantity)
VALUES
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Stick Bundle'),
  (SELECT id FROM materials WHERE name='Wood Log'),
  1
);

INSERT INTO recipe_ingredients (recipe_id, material_id, quantity)
VALUES
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Plank Board'),
  (SELECT id FROM materials WHERE name='Wood Log'),
  1
);

INSERT INTO recipe_ingredients (recipe_id, material_id, quantity)
VALUES
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Stone Brick'),
  (SELECT id FROM materials WHERE name='Stone'),
  3
);

INSERT INTO recipe_ingredients (recipe_id, material_id, quantity)
VALUES
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Glass Bottle'),
  (SELECT id FROM materials WHERE name='Sand'),
  3
);

INSERT INTO recipe_ingredients (recipe_id, material_id, quantity)
VALUES
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Rope'),
  (SELECT id FROM materials WHERE name='Fiber'),
  3
),
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Rope'),
  (SELECT id FROM materials WHERE name='Stick'),
  1
);

INSERT INTO recipe_ingredients (recipe_id, material_id, quantity)
VALUES
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Cloth'),
  (SELECT id FROM materials WHERE name='Fiber'),
  4
),
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Cloth'),
  (SELECT id FROM materials WHERE name='Wool'),
  1
);

INSERT INTO recipe_ingredients (recipe_id, material_id, quantity)
VALUES
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Leather'),
  (SELECT id FROM materials WHERE name='Hide'),
  2
);

INSERT INTO recipe_ingredients (recipe_id, material_id, quantity)
VALUES
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Leather Strips'),
  (SELECT id FROM materials WHERE name='Leather'),
  1
);

INSERT INTO recipe_ingredients (recipe_id, material_id, quantity)
VALUES
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Flour'),
  (SELECT id FROM materials WHERE name='Wheat'),
  1
);

INSERT INTO recipe_ingredients (recipe_id, material_id, quantity)
VALUES
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Sugar'),
  (SELECT id FROM materials WHERE name='Sugarcane'),
  1
);

-- ---------- Ingots (crafted, then used as ingredients) ----------

INSERT INTO recipe_ingredients (recipe_id, material_id, quantity)
VALUES
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Copper Ingot'),
  (SELECT id FROM materials WHERE name='Copper Ore'),
  2
);

INSERT INTO recipe_ingredients (recipe_id, material_id, quantity)
VALUES
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Tin Ingot'),
  (SELECT id FROM materials WHERE name='Tin Ore'),
  2
);

INSERT INTO recipe_ingredients (recipe_id, material_id, quantity)
VALUES
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Bronze Ingot'),
  (SELECT id FROM materials WHERE name='Copper Ingot'),
  1
),
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Bronze Ingot'),
  (SELECT id FROM materials WHERE name='Tin Ingot'),
  1
);

INSERT INTO recipe_ingredients (recipe_id, material_id, quantity)
VALUES
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Iron Ingot'),
  (SELECT id FROM materials WHERE name='Iron Ore'),
  2
);

INSERT INTO recipe_ingredients (recipe_id, material_id, quantity)
VALUES
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Steel Ingot'),
  (SELECT id FROM materials WHERE name='Iron Ingot'),
  2
),
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Steel Ingot'),
  (SELECT id FROM materials WHERE name='Coal'),
  1
);

INSERT INTO recipe_ingredients (recipe_id, material_id, quantity)
VALUES
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Silver Ingot'),
  (SELECT id FROM materials WHERE name='Silver Ore'),
  2
);

INSERT INTO recipe_ingredients (recipe_id, material_id, quantity)
VALUES
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Gold Ingot'),
  (SELECT id FROM materials WHERE name='Gold Ore'),
  2
);

-- ---------- Weapons / Gear ----------

INSERT INTO recipe_ingredients (recipe_id, material_id, quantity)
VALUES
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Bronze Axe'),
  (SELECT id FROM materials WHERE name='Bronze Ingot'),
  2
),
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Bronze Axe'),
  (SELECT id FROM materials WHERE name='Stick'),
  1
),
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Bronze Axe'),
  (SELECT id FROM materials WHERE name='Rope'),
  1
);

INSERT INTO recipe_ingredients (recipe_id, material_id, quantity)
VALUES
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Iron Axe'),
  (SELECT id FROM materials WHERE name='Iron Ingot'),
  2
),
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Iron Axe'),
  (SELECT id FROM materials WHERE name='Stick'),
  1
),
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Iron Axe'),
  (SELECT id FROM materials WHERE name='Rope'),
  1
);

INSERT INTO recipe_ingredients (recipe_id, material_id, quantity)
VALUES
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Steel Axe'),
  (SELECT id FROM materials WHERE name='Steel Ingot'),
  2
),
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Steel Axe'),
  (SELECT id FROM materials WHERE name='Stick'),
  1
),
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Steel Axe'),
  (SELECT id FROM materials WHERE name='Rope'),
  1
);

INSERT INTO recipe_ingredients (recipe_id, material_id, quantity)
VALUES
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Bronze Sword'),
  (SELECT id FROM materials WHERE name='Bronze Ingot'),
  3
),
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Bronze Sword'),
  (SELECT id FROM materials WHERE name='Leather Strips'),
  2
);

INSERT INTO recipe_ingredients (recipe_id, material_id, quantity)
VALUES
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Iron Sword'),
  (SELECT id FROM materials WHERE name='Iron Ingot'),
  3
),
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Iron Sword'),
  (SELECT id FROM materials WHERE name='Leather Strips'),
  2
);

INSERT INTO recipe_ingredients (recipe_id, material_id, quantity)
VALUES
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Steel Sword'),
  (SELECT id FROM materials WHERE name='Steel Ingot'),
  3
),
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Steel Sword'),
  (SELECT id FROM materials WHERE name='Leather Strips'),
  2
);

INSERT INTO recipe_ingredients (recipe_id, material_id, quantity)
VALUES
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Bow'),
  (SELECT id FROM materials WHERE name='Stick'),
  2
),
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Bow'),
  (SELECT id FROM materials WHERE name='Rope'),
  1
);

INSERT INTO recipe_ingredients (recipe_id, material_id, quantity)
VALUES
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Arrow Bundle'),
  (SELECT id FROM materials WHERE name='Stick'),
  2
),
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Arrow Bundle'),
  (SELECT id FROM materials WHERE name='Feather'),
  2
),
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Arrow Bundle'),
  (SELECT id FROM materials WHERE name='Flint'),
  1
);

INSERT INTO recipe_ingredients (recipe_id, material_id, quantity)
VALUES
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Wooden Shield'),
  (SELECT id FROM materials WHERE name='Plank'),
  5
),
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Wooden Shield'),
  (SELECT id FROM materials WHERE name='Leather'),
  1
);

INSERT INTO recipe_ingredients (recipe_id, material_id, quantity)
VALUES
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Bronze Shield'),
  (SELECT id FROM materials WHERE name='Plank'),
  5
),
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Bronze Shield'),
  (SELECT id FROM materials WHERE name='Leather'),
  2
),
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Bronze Shield'),
  (SELECT id FROM materials WHERE name='Bronze Ingot'),
  3
);

INSERT INTO recipe_ingredients (recipe_id, material_id, quantity)
VALUES
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Iron Shield'),
  (SELECT id FROM materials WHERE name='Plank'),
  5
),
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Iron Shield'),
  (SELECT id FROM materials WHERE name='Leather'),
  2
),
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Iron Shield'),
  (SELECT id FROM materials WHERE name='Iron Ingot'),
  3
);

INSERT INTO recipe_ingredients (recipe_id, material_id, quantity)
VALUES
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Steel Shield'),
  (SELECT id FROM materials WHERE name='Plank'),
  5
),
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Steel Shield'),
  (SELECT id FROM materials WHERE name='Leather'),
  2
),
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Steel Shield'),
  (SELECT id FROM materials WHERE name='Steel Ingot'),
  3
);

-- ---------- Food ----------

INSERT INTO recipe_ingredients (recipe_id, material_id, quantity)
VALUES
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Water Bottle'),
  (SELECT id FROM materials WHERE name='Glass Bottle'),
  1
),
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Water Bottle'),
  (SELECT id FROM materials WHERE name='Water'),
  1
);

INSERT INTO recipe_ingredients (recipe_id, material_id, quantity)
VALUES
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Milk Bottle'),
  (SELECT id FROM materials WHERE name='Glass Bottle'),
  1
),
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Milk Bottle'),
  (SELECT id FROM materials WHERE name='Milk'),
  1
);

INSERT INTO recipe_ingredients (recipe_id, material_id, quantity)
VALUES
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Cooked Meat'),
  (SELECT id FROM materials WHERE name='Raw Meat'),
  1
),
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Cooked Meat'),
  (SELECT id FROM materials WHERE name='Herbs'),
  1
);

INSERT INTO recipe_ingredients (recipe_id, material_id, quantity)
VALUES
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Cooked Fish'),
  (SELECT id FROM materials WHERE name='Raw Fish'),
  1
),
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Cooked Fish'),
  (SELECT id FROM materials WHERE name='Herbs'),
  1
);

INSERT INTO recipe_ingredients (recipe_id, material_id, quantity)
VALUES
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Berry Jam'),
  (SELECT id FROM materials WHERE name='Berry'),
  2
),
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Berry Jam'),
  (SELECT id FROM materials WHERE name='Sugar'),
  1
);

INSERT INTO recipe_ingredients (recipe_id, material_id, quantity)
VALUES
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Bread'),
  (SELECT id FROM materials WHERE name='Flour'),
  3
),
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Bread'),
  (SELECT id FROM materials WHERE name='Water Bottle'),
  1
);

INSERT INTO recipe_ingredients (recipe_id, material_id, quantity)
VALUES
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Vegetable Soup'),
  (SELECT id FROM materials WHERE name='Carrot'),
  1
),
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Vegetable Soup'),
  (SELECT id FROM materials WHERE name='Potato'),
  1
),
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Vegetable Soup'),
  (SELECT id FROM materials WHERE name='Water Bottle'),
  1
),
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Vegetable Soup'),
  (SELECT id FROM materials WHERE name='Herbs'),
  1
);

INSERT INTO recipe_ingredients (recipe_id, material_id, quantity)
VALUES
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Meat Stew'),
  (SELECT id FROM materials WHERE name='Raw Meat'),
  1
),
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Meat Stew'),
  (SELECT id FROM materials WHERE name='Potato'),
  1
),
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Meat Stew'),
  (SELECT id FROM materials WHERE name='Water Bottle'),
  1
),
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Meat Stew'),
  (SELECT id FROM materials WHERE name='Herbs'),
  1
);

INSERT INTO recipe_ingredients (recipe_id, material_id, quantity)
VALUES
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Meat Pie'),
  (SELECT id FROM materials WHERE name='Raw Meat'),
  1
),
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Meat Pie'),
  (SELECT id FROM materials WHERE name='Flour'),
  2
),
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Meat Pie'),
  (SELECT id FROM materials WHERE name='Milk Bottle'),
  1
),
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Meat Pie'),
  (SELECT id FROM materials WHERE name='Egg'),
  1
);

INSERT INTO recipe_ingredients (recipe_id, material_id, quantity)
VALUES
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Milk Bottle'),
  (SELECT id FROM materials WHERE name='Glass Bottle'),
  1
),
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Milk Bottle'),
  (SELECT id FROM materials WHERE name='Milk'),
  1
);

INSERT INTO recipe_ingredients (recipe_id, material_id, quantity)
VALUES
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Juice'),
  (SELECT id FROM materials WHERE name='Berry'),
  2
),
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Juice'),
  (SELECT id FROM materials WHERE name='Water Bottle'),
  1
);

INSERT INTO recipe_ingredients (recipe_id, material_id, quantity)
VALUES
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Ale'),
  (SELECT id FROM materials WHERE name='Wheat'),
  3
),
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Ale'),
  (SELECT id FROM materials WHERE name='Water Bottle'),
  1
),
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Ale'),
  (SELECT id FROM materials WHERE name='Sugar'),
  1
);

-- ---------- Trade goods ----------

INSERT INTO recipe_ingredients (recipe_id, material_id, quantity)
VALUES
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Simple Jewelry'),
  (SELECT id FROM materials WHERE name='Silver Ingot'),
  10
),
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Simple Jewelry'),
  (SELECT id FROM materials WHERE name='Cloth'),
  20
);

INSERT INTO recipe_ingredients (recipe_id, material_id, quantity)
VALUES
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Fine Jewelry'),
  (SELECT id FROM materials WHERE name='Gold Ingot'),
  20
),
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Fine Jewelry'),
  (SELECT id FROM materials WHERE name='Silver Ingot'),
  10
),
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Fine Jewelry'),
  (SELECT id FROM materials WHERE name='Cloth'),
  40
);

INSERT INTO recipe_ingredients (recipe_id, material_id, quantity)
VALUES
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Gold Coin'),
  (SELECT id FROM materials WHERE name='Gold Ingot'),
  10
);

INSERT INTO recipe_ingredients (recipe_id, material_id, quantity)
VALUES
(
  (SELECT r.id FROM recipes r JOIN items i ON r.item_id=i.id WHERE i.name='Silver Coin'),
  (SELECT id FROM materials WHERE name='Silver Ingot'),
  10
);

COMMIT;