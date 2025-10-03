import type { CartItem } from "@/context/CartContext";

export type OrderStatus = "verify" | "in_process" | "delivered";
export type Order = {
  id: string;
  userId: string;
  items: CartItem[];
  status: OrderStatus;
  createdAt: number;
};

const LS_ORDERS = "rangista_orders";

function read(): Order[] {
  try {
    const raw = localStorage.getItem(LS_ORDERS);
    return raw ? (JSON.parse(raw) as Order[]) : [];
  } catch {
    return [];
  }
}

function write(list: Order[]) {
  localStorage.setItem(LS_ORDERS, JSON.stringify(list));
}

export function listOrders(): Order[] {
  return read();
}

export function listOrdersByUser(userId: string): Order[] {
  return read().filter((o) => o.userId === userId);
}

export function createOrder(userId: string, items: CartItem[]): Order {
  const order: Order = {
    id: crypto.randomUUID(),
    userId,
    items: items.map((i) => ({ ...i })),
    status: "verify",
    createdAt: Date.now(),
  };
  const list = read();
  list.push(order);
  write(list);
  return order;
}

export function updateOrderStatus(id: string, status: OrderStatus) {
  const list = read();
  const idx = list.findIndex((o) => o.id === id);
  if (idx >= 0) {
    list[idx].status = status;
    write(list);
  }
}

export function deleteOrder(id: string) {
  write(read().filter((o) => o.id !== id));
}
