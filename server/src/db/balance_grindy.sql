BEGIN;

-- ---------- Plant chain ----------

UPDATE recipe_ingredients
SET quantity = 4
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Plant Matter')
  AND material_id = (SELECT id FROM materials WHERE name='Berry');

UPDATE recipe_ingredients
SET quantity = 6
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Fiber')
  AND material_id = (SELECT id FROM materials WHERE name='Plant Matter');

-- ---------- Basic processed ----------

UPDATE recipe_ingredients
SET quantity = 2
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Stick Bundle')
  AND material_id = (SELECT id FROM materials WHERE name='Wood Log');

UPDATE recipe_ingredients
SET quantity = 3
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Plank Board')
  AND material_id = (SELECT id FROM materials WHERE name='Wood Log');

UPDATE recipe_ingredients
SET quantity = 6
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Stone Brick')
  AND material_id = (SELECT id FROM materials WHERE name='Stone');

UPDATE recipe_ingredients
SET quantity = 8
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Glass Bottle')
  AND material_id = (SELECT id FROM materials WHERE name='Sand');

UPDATE recipe_ingredients
SET quantity = 8
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Rope')
  AND material_id = (SELECT id FROM materials WHERE name='Fiber');

UPDATE recipe_ingredients
SET quantity = 2
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Rope')
  AND material_id = (SELECT id FROM materials WHERE name='Stick');

UPDATE recipe_ingredients
SET quantity = 10
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Cloth')
  AND material_id = (SELECT id FROM materials WHERE name='Fiber');

UPDATE recipe_ingredients
SET quantity = 3
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Cloth')
  AND material_id = (SELECT id FROM materials WHERE name='Wool');

UPDATE recipe_ingredients
SET quantity = 5
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Leather')
  AND material_id = (SELECT id FROM materials WHERE name='Hide');

UPDATE recipe_ingredients
SET quantity = 2
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Leather Strips')
  AND material_id = (SELECT id FROM materials WHERE name='Leather');

UPDATE recipe_ingredients
SET quantity = 4
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Flour')
  AND material_id = (SELECT id FROM materials WHERE name='Wheat');

UPDATE recipe_ingredients
SET quantity = 4
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Sugar')
  AND material_id = (SELECT id FROM materials WHERE name='Sugarcane');

-- ---------- Ingots ----------

UPDATE recipe_ingredients
SET quantity = 6
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Copper Ingot')
  AND material_id = (SELECT id FROM materials WHERE name='Copper Ore');

UPDATE recipe_ingredients
SET quantity = 6
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Tin Ingot')
  AND material_id = (SELECT id FROM materials WHERE name='Tin Ore');

UPDATE recipe_ingredients
SET quantity = 3
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Bronze Ingot')
  AND material_id = (SELECT id FROM materials WHERE name='Copper Ingot');

UPDATE recipe_ingredients
SET quantity = 3
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Bronze Ingot')
  AND material_id = (SELECT id FROM materials WHERE name='Tin Ingot');

UPDATE recipe_ingredients
SET quantity = 8
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Iron Ingot')
  AND material_id = (SELECT id FROM materials WHERE name='Iron Ore');

UPDATE recipe_ingredients
SET quantity = 4
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Steel Ingot')
  AND material_id = (SELECT id FROM materials WHERE name='Iron Ingot');

UPDATE recipe_ingredients
SET quantity = 2
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Steel Ingot')
  AND material_id = (SELECT id FROM materials WHERE name='Coal');

UPDATE recipe_ingredients
SET quantity = 10
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Silver Ingot')
  AND material_id = (SELECT id FROM materials WHERE name='Silver Ore');

UPDATE recipe_ingredients
SET quantity = 12
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Gold Ingot')
  AND material_id = (SELECT id FROM materials WHERE name='Gold Ore');

-- ---------- Weapons / gear ----------
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

UPDATE recipe_ingredients
SET quantity = 6
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Bow')
  AND material_id = (SELECT id FROM materials WHERE name='Stick');

UPDATE recipe_ingredients
SET quantity = 3
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Bow')
  AND material_id = (SELECT id FROM materials WHERE name='Rope');

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

UPDATE recipe_ingredients
SET quantity = 2
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Water Bottle')
  AND material_id = (SELECT id FROM materials WHERE name='Glass Bottle');

UPDATE recipe_ingredients
SET quantity = 2
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Milk Bottle')
  AND material_id = (SELECT id FROM materials WHERE name='Glass Bottle');

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

UPDATE recipe_ingredients
SET quantity = 6
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Berry Jam')
  AND material_id = (SELECT id FROM materials WHERE name='Berry');

UPDATE recipe_ingredients
SET quantity = 3
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Berry Jam')
  AND material_id = (SELECT id FROM materials WHERE name='Sugar');

UPDATE recipe_ingredients
SET quantity = 8
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Bread')
  AND material_id = (SELECT id FROM materials WHERE name='Flour');

UPDATE recipe_ingredients
SET quantity = 2
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Bread')
  AND material_id = (SELECT id FROM materials WHERE name='Water Bottle');

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

UPDATE recipe_ingredients
SET quantity = 6
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Juice')
  AND material_id = (SELECT id FROM materials WHERE name='Berry');

UPDATE recipe_ingredients
SET quantity = 2
WHERE recipe_id = (SELECT r.id FROM recipes r JOIN items i ON i.id=r.item_id WHERE i.name='Juice')
  AND material_id = (SELECT id FROM materials WHERE name='Water Bottle');

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