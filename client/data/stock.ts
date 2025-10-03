import { PRODUCTS } from "@/data/products";

const LS_STOCK = "rangista_stock";

type StockMap = Record<string, number>;

function readStock(): StockMap {
  try {
    const raw = localStorage.getItem(LS_STOCK);
    if (!raw) return {};
    return JSON.parse(raw) as StockMap;
  } catch {
    return {};
  }
}

function writeStock(map: StockMap) {
  localStorage.setItem(LS_STOCK, JSON.stringify(map));
  try { window.dispatchEvent(new CustomEvent("stock:change")); } catch {}
}

function seedFromString(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
  }
  return h >>> 0;
}

function seededRand(min: number, max: number, seed: number): number {
  // simple LCG using seed
  let x = seed || 123456789;
  x = (1664525 * x + 1013904223) % 0xffffffff;
  const r = x / 0xffffffff;
  return Math.floor(min + r * (max - min + 1));
}

function ensureInitialized(): StockMap {
  const map = readStock();
  let changed = false;
  for (const p of PRODUCTS) {
    if (map[p.id] == null) {
      const seed = seedFromString(p.id);
      map[p.id] = Math.max(0, seededRand(3, 20, seed));
      changed = true;
    }
  }
  if (changed) writeStock(map);
  return map;
}

export function getAllStocks(): StockMap {
  return ensureInitialized();
}

export function getStock(id: string): number {
  const map = ensureInitialized();
  return map[id] ?? 0;
}

export function setStock(id: string, qty: number) {
  const map = ensureInitialized();
  map[id] = Math.max(0, Math.floor(qty));
  writeStock(map);
}

export function adjustStock(id: string, delta: number) {
  const map = ensureInitialized();
  map[id] = Math.max(0, (map[id] ?? 0) + delta);
  writeStock(map);
}

export function resetStocksRandom() {
  const map: StockMap = {};
  for (const p of PRODUCTS) {
    const seed = seedFromString(p.id + Date.now().toString());
    map[p.id] = Math.max(0, seededRand(3, 20, seed));
  }
  writeStock(map);
}
