import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { adjustStock, getStock } from "@/data/stock";

export type CartItem = {
  id: string;
  name: string;
  price: number; // price in PKR
  image: string;
  size?: string;
  collection?: string;
  qty: number;
};

interface CartContextValue {
  items: CartItem[];
  count: number;
  subtotal: number;
  addItem: (item: Omit<CartItem, "qty">, qty?: number) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);
import { useAuth } from "@/context/AuthContext";
const LS_CART_PREFIX = "rangista_cart_";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);

  const storageKey = user ? `${LS_CART_PREFIX}${user.id}` : `${LS_CART_PREFIX}guest`;

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setItems(JSON.parse(raw));
      else setItems([]);
    } catch {
      setItems([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items, storageKey]);

  const addItem = (item: Omit<CartItem, "qty">, qty = 1) => {
    if (!user) {
      alert("Please login to add to cart.");
      return;
    }
    const available = getStock(item.id);
    if (available <= 0) return;
    const addQty = Math.min(qty, available);
    if (addQty <= 0) return;
    adjustStock(item.id, -addQty);
    setItems((prev) => {
      const existing = prev.find((p) => p.id === item.id && p.size === item.size);
      if (existing) {
        return prev.map((p) => (p === existing ? { ...p, qty: Math.max(1, p.qty + addQty) } : p));
      }
      return [...prev, { ...item, qty: addQty }];
    });
  };

  const removeItem = (id: string) => {
    if (!user) return;
    const removedQty = items.filter((p) => p.id === id).reduce((s, p) => s + p.qty, 0);
    if (removedQty > 0) adjustStock(id, removedQty);
    setItems((prev) => prev.filter((p) => p.id !== id));
  };

  const updateQty = (id: string, qty: number) => {
    if (!user) return;
    const curTotal = items.filter((p) => p.id === id).reduce((s, p) => s + p.qty, 0);
    const target = Math.max(1, Math.floor(qty));
    const stock = getStock(id);
    const desiredTotal = Math.min(target, curTotal + stock);
    const delta = desiredTotal - curTotal;

    if (delta !== 0) adjustStock(id, -delta);

    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, qty: Math.max(1, p.qty + delta) } : p)));
  };

  const clear = () =>
    setItems((prev) => {
      if (!user) return prev;
      for (const p of prev) adjustStock(p.id, p.qty);
      return [];
    });

  const subtotal = useMemo(() => items.reduce((s, i) => s + i.price * i.qty, 0), [items]);
  const count = useMemo(() => items.reduce((s, i) => s + i.qty, 0), [items]);

  const value = useMemo(
    () => ({ items, count, subtotal, addItem, removeItem, updateQty, clear }),
    [items, count, subtotal]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    if (typeof window !== "undefined") {
      console.warn("useCart used outside CartProvider; falling back to no-op context");
    }
    const fallback: CartContextValue = {
      items: [],
      count: 0,
      subtotal: 0,
      addItem: () => {},
      removeItem: () => {},
      updateQty: () => {},
      clear: () => {},
    };
    return fallback;
  }
  return ctx;
}
