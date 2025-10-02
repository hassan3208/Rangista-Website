import { useEffect, useMemo, useState } from "react";
import { PRODUCTS } from "@/data/products";
import { getAllStocks, setStock, resetStocksRandom } from "@/data/stock";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";

export default function Admin() {
  const { user } = useAuth();
  const [stocks, setStocks] = useState<Record<string, number>>({});

  useEffect(() => {
    setStocks(getAllStocks());
  }, []);

  const setOne = (id: string, qty: number) => {
    setStock(id, qty);
    setStocks((s) => ({ ...s, [id]: Math.max(0, Math.floor(qty)) }));
  };

  const resetAll = () => {
    resetStocksRandom();
    setStocks(getAllStocks());
  };

  if (!user) return <div className="container py-10">Please login to access admin.</div>;

  return (
    <main className="container py-10">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl">Admin Panel</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={resetAll}>Reset Random Stock</Button>
        </div>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">Logged in as: {user.email}</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PRODUCTS.map((p) => (
          <div key={p.id} className="border rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-3">
              <img src={p.image} alt={p.name} className="h-16 w-16 rounded object-cover" />
              <div>
                <div className="font-medium">{p.name}</div>
                <div className="text-xs text-muted-foreground">{p.collection}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Input type="number" value={stocks[p.id] ?? 0} onChange={(e) => setOne(p.id, Number(e.target.value) || 0)} className="w-24" />
              <span className="text-sm">in stock</span>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
