// server/src/utils/loot.js
export function rollChance(pct) {
  return Math.random() * 100 < pct;
}

export function randInt(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

export function pickWeighted(options) {
  // options: [{ name, weight, min, max }]
  const total = options.reduce((sum, o) => sum + o.weight, 0);
  let r = Math.random() * total;

  for (const o of options) {
    r -= o.weight;
    if (r <= 0) {
      return { name: o.name, qty: randInt(o.min, o.max) };
    }
  }

  const fallback = options[options.length - 1];
  return { name: fallback.name, qty: fallback.min };
}

export function addDrop(drops, name, qty) {
  const found = drops.find((d) => d.name === name);
  if (found) found.qty += qty;
  else drops.push({ name, qty });
}
