BEGIN;

-- =========================================
-- GRINDY BALANCE PASS
-- - increases ingredient quantities
-- - makes ores/ingots meaningfully valuable
-- - makes early progress slower
-- =========================================

-- Helper: update a single ingredient quantity for an item
-- (we just inline the subqueries for simplicity)

-- ---------- Plant chain ----------
-- Plant Matter: 2 Berry -> 4 Berry
UPDATE recipe_ingredients
SET quantity = 4
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Plant Matter')
  AND material_id = (SELECT id FROM materials WHERE name='Berry');

-- Fiber: 3 Plant Matter -> 6 Plant Matter
UPDATE recipe_ingredients
SET quantity = 6
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Fiber')
  AND material_id = (SELECT id FROM materials WHERE name='Plant Matter');

-- ---------- Basic processed ----------
-- Stick Bundle: 1 Wood Log -> 2 Wood Log
UPDATE recipe_ingredients
SET quantity = 2
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Stick Bundle')
  AND material_id = (SELECT id FROM materials WHERE name='Wood Log');

-- Plank Board: 1 Wood Log -> 3 Wood Log
UPDATE recipe_ingredients
SET quantity = 3
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Plank Board')
  AND material_id = (SELECT id FROM materials WHERE name='Wood Log');

-- Stone Brick: 3 Stone -> 6 Stone
UPDATE recipe_ingredients
SET quantity = 6
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Stone Brick')
  AND material_id = (SELECT id FROM materials WHERE name='Stone');

-- Glass Bottle: 3 Sand -> 8 Sand
UPDATE recipe_ingredients
SET quantity = 8
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Glass Bottle')
  AND material_id = (SELECT id FROM materials WHERE name='Sand');

-- Rope: 3 Fiber + 1 Stick -> 8 Fiber + 2 Stick
UPDATE recipe_ingredients
SET quantity = 8
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Rope')
  AND material_id = (SELECT id FROM materials WHERE name='Fiber');

UPDATE recipe_ingredients
SET quantity = 2
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Rope')
  AND material_id = (SELECT id FROM materials WHERE name='Stick');

-- Cloth: 4 Fiber + 1 Wool -> 10 Fiber + 3 Wool
UPDATE recipe_ingredients
SET quantity = 10
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Cloth')
  AND material_id = (SELECT id FROM materials WHERE name='Fiber');

UPDATE recipe_ingredients
SET quantity = 3
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Cloth')
  AND material_id = (SELECT id FROM materials WHERE name='Wool');

-- Leather: 2 Hide -> 5 Hide
UPDATE recipe_ingredients
SET quantity = 5
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Leather')
  AND material_id = (SELECT id FROM materials WHERE name='Hide');

-- Leather Strips: 1 Leather -> 2 Leather
UPDATE recipe_ingredients
SET quantity = 2
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Leather Strips')
  AND material_id = (SELECT id FROM materials WHERE name='Leather');

-- Flour: 1 Wheat -> 4 Wheat
UPDATE recipe_ingredients
SET quantity = 4
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Flour')
  AND material_id = (SELECT id FROM materials WHERE name='Wheat');

-- Sugar: 1 Sugarcane -> 4 Sugarcane
UPDATE recipe_ingredients
SET quantity = 4
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Sugar')
  AND material_id = (SELECT id FROM materials WHERE name='Sugarcane');

-- ---------- Ingots ----------
-- Copper Ingot: 2 Copper Ore -> 6 Copper Ore
UPDATE recipe_ingredients
SET quantity = 6
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Copper Ingot')
  AND material_id = (SELECT id FROM materials WHERE name='Copper Ore');

-- Tin Ingot: 2 Tin Ore -> 6 Tin Ore
UPDATE recipe_ingredients
SET quantity = 6
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Tin Ingot')
  AND material_id = (SELECT id FROM materials WHERE name='Tin Ore');

-- Bronze Ingot: 1 Copper Ingot + 1 Tin Ingot -> 3 + 3
UPDATE recipe_ingredients
SET quantity = 3
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Bronze Ingot')
  AND material_id = (SELECT id FROM materials WHERE name='Copper Ingot');

UPDATE recipe_ingredients
SET quantity = 3
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Bronze Ingot')
  AND material_id = (SELECT id FROM materials WHERE name='Tin Ingot');

-- Iron Ingot: 2 Iron Ore -> 8 Iron Ore
UPDATE recipe_ingredients
SET quantity = 8
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Iron Ingot')
  AND material_id = (SELECT id FROM materials WHERE name='Iron Ore');

-- Steel Ingot: 2 Iron Ingot + 1 Coal -> 4 Iron Ingot + 2 Coal
UPDATE recipe_ingredients
SET quantity = 4
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Steel Ingot')
  AND material_id = (SELECT id FROM materials WHERE name='Iron Ingot');

UPDATE recipe_ingredients
SET quantity = 2
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Steel Ingot')
  AND material_id = (SELECT id FROM materials WHERE name='Coal');

-- Silver Ingot: 2 Silver Ore -> 10 Silver Ore
UPDATE recipe_ingredients
SET quantity = 10
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Silver Ingot')
  AND material_id = (SELECT id FROM materials WHERE name='Silver Ore');

-- Gold Ingot: 2 Gold Ore -> 12 Gold Ore
UPDATE recipe_ingredients
SET quantity = 12
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Gold Ingot')
  AND material_id = (SELECT id FROM materials WHERE name='Gold Ore');

-- ---------- Weapons / gear ----------
-- Axes: 2 ingots -> 6 ingots; + handle costs
UPDATE recipe_ingredients
SET quantity = 6
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Bronze Axe')
  AND material_id = (SELECT id FROM materials WHERE name='Bronze Ingot');

UPDATE recipe_ingredients
SET quantity = 3
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Bronze Axe')
  AND material_id = (SELECT id FROM materials WHERE name='Stick');

UPDATE recipe_ingredients
SET quantity = 2
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Bronze Axe')
  AND material_id = (SELECT id FROM materials WHERE name='Rope');

UPDATE recipe_ingredients
SET quantity = 6
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Iron Axe')
  AND material_id = (SELECT id FROM materials WHERE name='Iron Ingot');

UPDATE recipe_ingredients
SET quantity = 3
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Iron Axe')
  AND material_id = (SELECT id FROM materials WHERE name='Stick');

UPDATE recipe_ingredients
SET quantity = 2
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Iron Axe')
  AND material_id = (SELECT id FROM materials WHERE name='Rope');

UPDATE recipe_ingredients
SET quantity = 6
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Steel Axe')
  AND material_id = (SELECT id FROM materials WHERE name='Steel Ingot');

UPDATE recipe_ingredients
SET quantity = 3
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Steel Axe')
  AND material_id = (SELECT id FROM materials WHERE name='Stick');

UPDATE recipe_ingredients
SET quantity = 2
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Steel Axe')
  AND material_id = (SELECT id FROM materials WHERE name='Rope');

-- Swords: 3 ingots -> 9 ingots; + straps cost
UPDATE recipe_ingredients
SET quantity = 9
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Bronze Sword')
  AND material_id = (SELECT id FROM materials WHERE name='Bronze Ingot');

UPDATE recipe_ingredients
SET quantity = 6
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Bronze Sword')
  AND material_id = (SELECT id FROM materials WHERE name='Leather Strips');

UPDATE recipe_ingredients
SET quantity = 9
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Iron Sword')
  AND material_id = (SELECT id FROM materials WHERE name='Iron Ingot');

UPDATE recipe_ingredients
SET quantity = 6
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Iron Sword')
  AND material_id = (SELECT id FROM materials WHERE name='Leather Strips');

UPDATE recipe_ingredients
SET quantity = 9
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Steel Sword')
  AND material_id = (SELECT id FROM materials WHERE name='Steel Ingot');

UPDATE recipe_ingredients
SET quantity = 6
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Steel Sword')
  AND material_id = (SELECT id FROM materials WHERE name='Leather Strips');

-- Bow: 2 Stick + 1 Rope -> 6 Stick + 3 Rope
UPDATE recipe_ingredients
SET quantity = 6
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Bow')
  AND material_id = (SELECT id FROM materials WHERE name='Stick');

UPDATE recipe_ingredients
SET quantity = 3
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Bow')
  AND material_id = (SELECT id FROM materials WHERE name='Rope');

-- Arrows: 2 stick/2 feather/1 flint -> 6/6/3
UPDATE recipe_ingredients
SET quantity = 6
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Arrow Bundle')
  AND material_id = (SELECT id FROM materials WHERE name='Stick');

UPDATE recipe_ingredients
SET quantity = 6
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Arrow Bundle')
  AND material_id = (SELECT id FROM materials WHERE name='Feather');

UPDATE recipe_ingredients
SET quantity = 3
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Arrow Bundle')
  AND material_id = (SELECT id FROM materials WHERE name='Flint');

-- Shields: more planks + more ingots
UPDATE recipe_ingredients
SET quantity = 12
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Wooden Shield')
  AND material_id = (SELECT id FROM materials WHERE name='Plank');

UPDATE recipe_ingredients
SET quantity = 4
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Wooden Shield')
  AND material_id = (SELECT id FROM materials WHERE name='Leather');

UPDATE recipe_ingredients
SET quantity = 12
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Bronze Shield')
  AND material_id = (SELECT id FROM materials WHERE name='Plank');

UPDATE recipe_ingredients
SET quantity = 6
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Bronze Shield')
  AND material_id = (SELECT id FROM materials WHERE name='Leather');

UPDATE recipe_ingredients
SET quantity = 8
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Bronze Shield')
  AND material_id = (SELECT id FROM materials WHERE name='Bronze Ingot');

UPDATE recipe_ingredients
SET quantity = 12
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Iron Shield')
  AND material_id = (SELECT id FROM materials WHERE name='Plank');

UPDATE recipe_ingredients
SET quantity = 6
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Iron Shield')
  AND material_id = (SELECT id FROM materials WHERE name='Leather');

UPDATE recipe_ingredients
SET quantity = 8
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Iron Shield')
  AND material_id = (SELECT id FROM materials WHERE name='Iron Ingot');

UPDATE recipe_ingredients
SET quantity = 12
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Steel Shield')
  AND material_id = (SELECT id FROM materials WHERE name='Plank');

UPDATE recipe_ingredients
SET quantity = 6
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Steel Shield')
  AND material_id = (SELECT id FROM materials WHERE name='Leather');

UPDATE recipe_ingredients
SET quantity = 8
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Steel Shield')
  AND material_id = (SELECT id FROM materials WHERE name='Steel Ingot');

-- ---------- Food ----------
-- Bottling: make bottles "costly" in terms of glass
UPDATE recipe_ingredients
SET quantity = 2
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Water Bottle')
  AND material_id = (SELECT id FROM materials WHERE name='Glass Bottle');

UPDATE recipe_ingredients
SET quantity = 2
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Milk Bottle')
  AND material_id = (SELECT id FROM materials WHERE name='Glass Bottle');

-- Cooking: bump inputs
UPDATE recipe_ingredients
SET quantity = 2
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Cooked Meat')
  AND material_id = (SELECT id FROM materials WHERE name='Raw Meat');

UPDATE recipe_ingredients
SET quantity = 2
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Cooked Meat')
  AND material_id = (SELECT id FROM materials WHERE name='Herbs');

UPDATE recipe_ingredients
SET quantity = 2
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Cooked Fish')
  AND material_id = (SELECT id FROM materials WHERE name='Raw Fish');

UPDATE recipe_ingredients
SET quantity = 2
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Cooked Fish')
  AND material_id = (SELECT id FROM materials WHERE name='Herbs');

-- Berry Jam: 2 berry + 1 sugar -> 6 berry + 3 sugar
UPDATE recipe_ingredients
SET quantity = 6
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Berry Jam')
  AND material_id = (SELECT id FROM materials WHERE name='Berry');

UPDATE recipe_ingredients
SET quantity = 3
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Berry Jam')
  AND material_id = (SELECT id FROM materials WHERE name='Sugar');

-- Bread: 3 flour + 1 water bottle -> 8 flour + 2 water bottle
UPDATE recipe_ingredients
SET quantity = 8
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Bread')
  AND material_id = (SELECT id FROM materials WHERE name='Flour');

UPDATE recipe_ingredients
SET quantity = 2
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Bread')
  AND material_id = (SELECT id FROM materials WHERE name='Water Bottle');

-- Soups/stews/pies -> heavier
UPDATE recipe_ingredients
SET quantity = 3
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Vegetable Soup')
  AND material_id = (SELECT id FROM materials WHERE name='Carrot');

UPDATE recipe_ingredients
SET quantity = 3
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Vegetable Soup')
  AND material_id = (SELECT id FROM materials WHERE name='Potato');

UPDATE recipe_ingredients
SET quantity = 2
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Vegetable Soup')
  AND material_id = (SELECT id FROM materials WHERE name='Water Bottle');

UPDATE recipe_ingredients
SET quantity = 3
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Vegetable Soup')
  AND material_id = (SELECT id FROM materials WHERE name='Herbs');

UPDATE recipe_ingredients
SET quantity = 4
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Meat Stew')
  AND material_id = (SELECT id FROM materials WHERE name='Raw Meat');

UPDATE recipe_ingredients
SET quantity = 4
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Meat Stew')
  AND material_id = (SELECT id FROM materials WHERE name='Potato');

UPDATE recipe_ingredients
SET quantity = 2
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Meat Stew')
  AND material_id = (SELECT id FROM materials WHERE name='Water Bottle');

UPDATE recipe_ingredients
SET quantity = 3
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Meat Stew')
  AND material_id = (SELECT id FROM materials WHERE name='Herbs');

-- Meat Pie: make it a "big craft"
UPDATE recipe_ingredients
SET quantity = 4
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Meat Pie')
  AND material_id = (SELECT id FROM materials WHERE name='Raw Meat');

UPDATE recipe_ingredients
SET quantity = 8
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Meat Pie')
  AND material_id = (SELECT id FROM materials WHERE name='Flour');

UPDATE recipe_ingredients
SET quantity = 2
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Meat Pie')
  AND material_id = (SELECT id FROM materials WHERE name='Milk Bottle');

UPDATE recipe_ingredients
SET quantity = 3
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Meat Pie')
  AND material_id = (SELECT id FROM materials WHERE name='Egg');

-- Juice: 2 berry + 1 water bottle -> 6 berry + 2 water bottle
UPDATE recipe_ingredients
SET quantity = 6
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Juice')
  AND material_id = (SELECT id FROM materials WHERE name='Berry');

UPDATE recipe_ingredients
SET quantity = 2
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Juice')
  AND material_id = (SELECT id FROM materials WHERE name='Water Bottle');

-- Ale: 3 wheat + 1 water bottle + 1 sugar -> 10 wheat + 2 bottle + 4 sugar
UPDATE recipe_ingredients
SET quantity = 10
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Ale')
  AND material_id = (SELECT id FROM materials WHERE name='Wheat');

UPDATE recipe_ingredients
SET quantity = 2
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Ale')
  AND material_id = (SELECT id FROM materials WHERE name='Water Bottle');

UPDATE recipe_ingredients
SET quantity = 4
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Ale')
  AND material_id = (SELECT id FROM materials WHERE name='Sugar');

-- ---------- Trade goods ----------
-- Jewelry should be expensive
UPDATE recipe_ingredients
SET quantity = 3
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Simple Jewelry')
  AND material_id = (SELECT id FROM materials WHERE name='Silver Ingot');

UPDATE recipe_ingredients
SET quantity = 2
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Simple Jewelry')
  AND material_id = (SELECT id FROM materials WHERE name='Cloth');

UPDATE recipe_ingredients
SET quantity = 4
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Fine Jewelry')
  AND material_id = (SELECT id FROM materials WHERE name='Gold Ingot');

UPDATE recipe_ingredients
SET quantity = 4
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Fine Jewelry')
  AND material_id = (SELECT id FROM materials WHERE name='Silver Ingot');

UPDATE recipe_ingredients
SET quantity = 3
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Fine Jewelry')
  AND material_id = (SELECT id FROM materials WHERE name='Cloth');

-- Coins should be very expensive
UPDATE recipe_ingredients
SET quantity = 3
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Gold Coin')
  AND material_id = (SELECT id FROM materials WHERE name='Gold Ingot');

UPDATE recipe_ingredients
SET quantity = 3
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Silver Coin')
  AND material_id = (SELECT id FROM materials WHERE name='Silver Ingot');

-- =========================================
-- Material values (so selling raws/ores feels meaningful)
-- =========================================
UPDATE materials SET base_value = 2 WHERE name IN ('Wood Log','Stone','Sand','Water','Clay');
UPDATE materials SET base_value = 3 WHERE name IN ('Flint','Herbs','Wheat','Corn','Carrot','Potato','Berry');
UPDATE materials SET base_value = 4 WHERE name IN ('Milk','Egg','Wool','Raw Fish','Raw Meat','Hide','Bone','Feather');

UPDATE materials SET base_value = 8 WHERE name IN ('Coal','Cotton','Sugarcane','Plant Matter','Fiber');
UPDATE materials SET base_value = 12 WHERE name LIKE '% Ore';

UPDATE materials SET base_value = 20 WHERE name IN ('Copper Ingot','Tin Ingot');
UPDATE materials SET base_value = 40 WHERE name IN ('Bronze Ingot','Iron Ingot');
UPDATE materials SET base_value = 70 WHERE name IN ('Steel Ingot','Silver Ingot');
UPDATE materials SET base_value = 110 WHERE name IN ('Gold Ingot');

UPDATE materials SET base_value = 15 WHERE name IN ('Glass Bottle','Water Bottle','Milk Bottle');
UPDATE materials SET base_value = 20 WHERE name IN ('Rope','Cloth','Leather','Leather Strips','Plank');

COMMIT;