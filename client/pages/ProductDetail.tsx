import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { PRODUCTS } from "@/data/products";
import { formatPKR } from "@/lib/currency";
import { getStock, adjustStock } from "@/data/stock";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCart } from "@/context/CartContext";
import { Star } from "lucide-react";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const product = useMemo(() => PRODUCTS.find((p) => p.id === id), [id]);
  const [size, setSize] = useState(product?.sizes[0]);
  const [stock, setStock] = useState<number>(() => (id ? getStock(id) : 0));
  const { addItem } = useCart();

  useMemo(() => {
    const onChange = () => setStock(id ? getStock(id) : 0);
    window.addEventListener("stock:change", onChange);
    return () => window.removeEventListener("stock:change", onChange);
  }, [id]);

  if (!product) return <div className="container py-10">Product not found. <Link to="/" className="underline">Go back</Link></div>;

  const canAdd = stock > 0 && !!size;

  const onAdd = () => {
    if (!canAdd) return;
    addItem({ id: product.id, name: product.name, price: product.price, image: product.image, size, collection: product.collection }, 1);
    adjustStock(product.id, -1);
  };

  return (
    <main className="container py-10 grid gap-8 md:grid-cols-2">
      <div>
        <img src={product.image} alt={product.name} className="w-full rounded-xl object-cover" />
      </div>
      <div>
        <h1 className="font-serif text-3xl">{product.name}</h1>
        <p className="mt-2 text-muted-foreground">{product.collection}</p>
        <div className="mt-2 flex items-center gap-1 text-yellow-500">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={16} className={i + 1 <= Math.round(product.rating) ? "fill-yellow-500" : "opacity-30"} />
          ))}
          <span className="ml-1 text-xs text-muted-foreground">({product.reviews} reviews)</span>
        </div>
        <p className="mt-4 text-2xl font-semibold">{formatPKR(product.price)}</p>
        <p className="mt-2 text-sm">In stock: <span className={stock > 0 ? "text-green-600" : "text-destructive"}>{stock}</span></p>

        <div className="mt-6">
          <label className="text-xs text-muted-foreground">Size</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button key={s} onClick={() => setSize(s)} className={`rounded-full border px-3 py-1 text-sm ${size === s ? "border-accent bg-accent text-accent-foreground" : "bg-background"}`}>{s}</button>
            ))}
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <Button disabled={!canAdd} onClick={onAdd} className="flex-1">{canAdd ? "Add to Cart" : "Out of stock"}</Button>
          <Link to="/" className="inline-flex items-center rounded-md border px-4">Back</Link>
        </div>

        <Card className="mt-8 p-4 space-y-2">
          <h2 className="font-serif text-xl">Details</h2>
          <ul className="list-disc pl-6 text-sm text-muted-foreground">
            <li>Hand-painted artistry with durable fabric</li>
            <li>Available sizes: {product.sizes.join(", ")}</li>
            <li>Collection: {product.collection}</li>
            <li>Made in Pakistan</li>
          </ul>
        </Card>
      </div>
    </main>
  );
}
