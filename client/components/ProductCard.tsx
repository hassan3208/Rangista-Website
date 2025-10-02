import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useCart } from "@/context/CartContext";
import { formatPKR } from "@/lib/currency";
import { useState } from "react";
import { Star } from "lucide-react";

export default function ProductCard({
  id,
  name,
  price,
  image,
  sizes,
  rating,
  reviews,
  collection,
}: {
  id: string;
  name: string;
  price: number;
  image: string;
  sizes: string[];
  rating: number;
  reviews: number;
  collection: string;
}) {
  const { addItem } = useCart();
  const [size, setSize] = useState<string>(sizes[0]);
  const [wish, setWish] = useState(false);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <div className="relative">
          <img src={image} alt={name} className="h-56 w-full object-cover" />
          <button
            aria-label="wishlist"
            onClick={() => setWish((w) => !w)}
            className={`absolute right-3 top-3 rounded-full px-2 py-1 text-xs font-medium ${wish ? "bg-accent text-accent-foreground" : "bg-background/80"}`}
          >
            ♥
          </button>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="font-medium">{name}</div>
            <div className="text-xs text-muted-foreground">{collection}</div>
          </div>
          <div className="text-right font-semibold">{formatPKR(price)}</div>
        </div>
        <div className="mt-2 flex items-center gap-1 text-yellow-500 text-sm">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={14} className={i + 1 <= Math.round(rating) ? "fill-yellow-500" : "opacity-30"} />
          ))}
          <span className="ml-1 text-xs text-muted-foreground">({reviews})</span>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {sizes.map((s) => (
            <button
              key={s}
              onClick={() => setSize(s)}
              className={`rounded-full border px-3 py-1 text-xs ${size === s ? "border-accent bg-accent text-accent-foreground" : "bg-background"}`}
            >
              {s}
            </button>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={() => addItem({ id, name, price, image, size, collection })}>
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
