import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { adjustStock, getAllStocks, getStock, setStock } from "@/data/stock";

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
const LS_CART = "rangista_cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_CART);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem(LS_CART, JSON.stringify(items));
  }, [items]);

  const addItem = (item: Omit<CartItem, "qty">, qty = 1) => {
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
    const removedQty = items.filter((p) => p.id === id).reduce((s, p) => s + p.qty, 0);
    if (removedQty > 0) adjustStock(id, removedQty);
    setItems((prev) => prev.filter((p) => p.id !== id));
  };

  const updateQty = (id: string, qty: number) => {
    const curTotal = items.filter((p) => p.id === id).reduce((s, p) => s + p.qty, 0);
    const target = Math.max(1, Math.floor(qty));
    const stock = getStock(id);
    const desiredTotal = Math.min(target, curTotal + stock); // can't exceed available
    const delta = desiredTotal - curTotal;

    if (delta !== 0) adjustStock(id, -delta);

    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, qty: Math.max(1, p.qty + delta) } : p)));
  };

  const clear = () =>
    setItems((prev) => {
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
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
