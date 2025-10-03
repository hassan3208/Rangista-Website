import type { CartItem } from "@/context/CartContext";

export function cartKeyForUser(userId: string) {
  return `rangista_cart_${userId}`;
}

export function readUserCart(userId: string): CartItem[] {
  try {
    const raw = localStorage.getItem(cartKeyForUser(userId));
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function writeUserCart(userId: string, items: CartItem[]) {
  localStorage.setItem(cartKeyForUser(userId), JSON.stringify(items));
  try {
    window.dispatchEvent(new CustomEvent("cart:change", { detail: { userId } }));
  } catch {}
}

export function removeItemFromUserCart(userId: string, id: string, size?: string) {
  const items = readUserCart(userId).filter((i) => {
    if (i.id !== id) return true;
    if (size === undefined) return false;
    return i.size !== size;
  });
  writeUserCart(userId, items);
  return items;
}
