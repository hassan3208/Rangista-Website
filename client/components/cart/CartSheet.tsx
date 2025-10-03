import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";
import { formatPKR } from "@/lib/currency";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { createOrder } from "@/data/orders";

export function CartSheet() {
  const { items, subtotal, updateQty, removeItem, clear } = useCart();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [payment, setPayment] = useState<"jazzcash" | "bank">("jazzcash");

  const advance = Math.round(subtotal * 0.5);

  const onConfirm = () => {
    if (!user || items.length === 0) return;
    createOrder(user.id, items);
    clear();
    setOpen(false);
    alert("Order placed! We will verify your advance and update status.");
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="relative">
          Cart
          <span className="ml-2 rounded-full bg-accent text-accent-foreground px-2 text-xs">
            {items.reduce((s, i) => s + i.qty, 0)}
          </span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle className="font-serif text-2xl">Your Cart</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            {items.length === 0 ? (
              <p className="text-muted-foreground">Your cart is empty.</p>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex gap-3 border rounded-lg p-3">
                  <img src={item.image} alt={item.name} className="h-16 w-16 rounded object-cover" />
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.size ?? ""} {item.collection ? `· ${item.collection}` : ""}</p>
                      </div>
                      <button className="text-sm text-destructive" onClick={() => removeItem(item.id)}>Remove</button>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button className="bg-secondary text-secondary-foreground" onClick={() => updateQty(item.id, Math.max(1, item.qty - 1))}>-</Button>
                        <Input value={item.qty} onChange={(e) => updateQty(item.id, Number(e.target.value) || 1)} className="w-16 text-center" />
                        <Button className="bg-secondary text-secondary-foreground" onClick={() => updateQty(item.id, item.qty + 1)}>+</Button>
                      </div>
                      <p className="font-medium">{formatPKR(item.price * item.qty)}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="mt-6 border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span className="font-medium">{formatPKR(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Advance (50%)</span>
              <span className="font-medium">{formatPKR(advance)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Remaining on Delivery</span>
              <span className="font-medium">{formatPKR(Math.max(0, subtotal - advance))}</span>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button className="border border-input bg-background hover:bg-accent hover:text-accent-foreground" onClick={clear} disabled={items.length === 0}>Clear</Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="flex-1" disabled={!user || items.length === 0}>{user ? "Proceed to Checkout" : "Login to Checkout"}</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="font-serif">Confirm Advance Payment</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">Pay 50% advance to confirm your order. Select a method:</p>
                  <RadioGroup value={payment} onValueChange={(v) => setPayment(v as any)} className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 border rounded-lg p-3">
                      <RadioGroupItem value="jazzcash" id="jazz" />
                      <Label htmlFor="jazz">JazzCash</Label>
                    </div>
                    <div className="flex items-center gap-2 border rounded-lg p-3">
                      <RadioGroupItem value="bank" id="bank" />
                      <Label htmlFor="bank">Bank Transfer</Label>
                    </div>
                  </RadioGroup>
                  <div className="rounded-lg bg-secondary p-3 text-sm">
                    <p className="font-medium">Amount to pay now: {formatPKR(advance)}</p>
                    {payment === "jazzcash" ? (
                      <p className="mt-2">Send to JazzCash number 03328425042 and share screenshot on WhatsApp. We will verify and update your order status.</p>
                    ) : (
                      <p className="mt-2">Transfer to Bank Account (shared after order confirmation). Email proof to itsmywork1019@gmail.com.</p>
                    )}
                  </div>
                  <Button onClick={onConfirm} disabled={!user}>I have paid the advance</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
      </SheetContent>
    </Sheet>
  );
}
