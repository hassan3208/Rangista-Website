import { PRODUCTS } from "@/data/products";

export type PriceBySize = Record<string, number>;
export type CatalogProduct = {
  id: string;
  name: string;
  description: string;
  image: string;
  sizes: string[];
  collection: string;
  priceBySize: PriceBySize; // S/M/L/Kids
  rating: number;
  reviews: number;
};

const LS_CATALOG = "rangista_catalog";
const LS_COLLECTIONS = "rangista_collections";

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

function seedPriceBySize(base: number, sizes: string[]): PriceBySize {
  const map: PriceBySize = {};
  for (const s of sizes) {
    if (s.toLowerCase() === "kids") map[s] = Math.max(0, base - 500);
    else if (s === "M") map[s] = base + 300;
    else if (s === "L") map[s] = base + 600;
    else map[s] = base;
  }
  return map;
}

function ensureCatalogInitialized() {
  const existing = readJSON<CatalogProduct[]>(LS_CATALOG, []);
  if (existing.length > 0) return;
  const seeded: CatalogProduct[] = PRODUCTS.map((p) => ({
    id: p.id,
    name: p.name,
    description: "Hand-painted artistry with durable fabric.",
    image: p.image,
    sizes: p.sizes,
    collection: p.collection,
    priceBySize: seedPriceBySize(p.price, p.sizes),
    rating: p.rating,
    reviews: p.reviews,
  }));
  writeJSON(LS_CATALOG, seeded);
  const collections = Array.from(
    new Set(seeded.map((p) => p.collection))
  );
  writeJSON(LS_COLLECTIONS, collections);
}

export function getProducts(): CatalogProduct[] {
  ensureCatalogInitialized();
  return readJSON<CatalogProduct[]>(LS_CATALOG, []);
}

export function getProduct(id: string): CatalogProduct | undefined {
  return getProducts().find((p) => p.id === id);
}

export function upsertProduct(prod: CatalogProduct) {
  const list = getProducts();
  const idx = list.findIndex((p) => p.id === prod.id);
  if (idx >= 0) list[idx] = prod; else list.push(prod);
  writeJSON(LS_CATALOG, list);
}

export function deleteProduct(id: string) {
  const list = getProducts().filter((p) => p.id !== id);
  writeJSON(LS_CATALOG, list);
}

export function getCollections(): string[] {
  ensureCatalogInitialized();
  return readJSON<string[]>(LS_COLLECTIONS, []);
}

export function addCollection(name: string) {
  const cols = Array.from(new Set([...
    getCollections(), name
  ].filter(Boolean)));
  writeJSON(LS_COLLECTIONS, cols);
}
