import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getProduct } from "@/data/catalog";
import { formatPKR } from "@/lib/currency";
import { getStock } from "@/data/stock";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCart } from "@/context/CartContext";
import { listReviewsByProduct, type Review } from "@/data/reviews";
import { Star } from "lucide-react";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const product = useMemo(() => (id ? getProduct(id) : undefined), [id]);
  const [size, setSize] = useState<string | undefined>(product?.sizes[0]);
  const [stock, setStock] = useState<number>(() => (id ? getStock(id) : 0));
  const [reviews, setReviews] = useState<Review[]>([]);
  const { addItem } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const onChange = () => setStock(id ? getStock(id) : 0);
    window.addEventListener("stock:change", onChange);
    return () => window.removeEventListener("stock:change", onChange);
  }, [id]);

  useEffect(() => {
    if (!product) return;
    const update = () => setReviews(listReviewsByProduct(product.id));
    update();
    if (typeof window !== "undefined") {
      window.addEventListener("reviews:change", update);
      return () => window.removeEventListener("reviews:change", update);
    }
  }, [product?.id]);

  if (!product) return <div className="container py-10">Product not found. <Link to="/" className="underline">Go back</Link></div>;

  const canAdd = stock > 0 && !!size;

  const onAdd = () => {
    if (!canAdd) return;
    const savedUser = localStorage.getItem("rangista_user");
    if (!savedUser) {
      navigate("/login");
      return;
    }
    const price = size ? product.priceBySize[size] ?? 0 : 0;
    addItem({ id: product.id, name: product.name, price, image: product.image, size, collection: product.collection }, 1);
  };

  return (
    <main className="container py-10 grid gap-8 md:grid-cols-2">
      <div>
        <img src={product.image} alt={product.name} className="w-full rounded-xl object-cover" />
      </div>
      <div>
        <h1 className="font-serif text-3xl">{product.name}</h1>
        <p className="mt-2 text-muted-foreground">{product.collection}</p>
        <p className="mt-4 text-2xl font-semibold">{formatPKR(size ? (product.priceBySize[size] ?? 0) : 0)}</p>
        <p className="mt-2 text-sm">
          In stock: <span className={stock > 0 ? "text-green-600" : "text-destructive"}>{stock}</span>
        </p>

        <div className="mt-6">
          <label className="text-xs text-muted-foreground">Size</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`rounded-full border px-3 py-1 text-sm ${size === s ? "border-accent bg-accent text-accent-foreground" : "bg-background"}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <Button disabled={!canAdd} onClick={onAdd} className="flex-1">
            {canAdd ? "Add to Cart" : "Out of stock"}
          </Button>
          <Link to="/" className="inline-flex items-center rounded-md border px-4">
            Back
          </Link>
        </div>

        <Card className="mt-8 p-4 space-y-4">
          <div>
            <h2 className="font-serif text-xl">Details</h2>
            <p className="text-sm text-muted-foreground">{product.description}</p>
          </div>
          <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1">
            <li>Available sizes: {product.sizes.join(", ")}</li>
            <li>Collection: {product.collection}</li>
          </ul>
          <div className="space-y-3 border-t pt-4">
            <h3 className="font-medium">Customer Reviews</h3>
            {reviews.length === 0 ? (
              <p className="text-sm text-muted-foreground">No reviews yet. Submit one from your orders after purchase.</p>
            ) : (
              <ul className="space-y-3">
                {reviews.map((review) => (
                  <li key={review.id} className="rounded-lg border p-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 text-yellow-500">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Star
                            key={index}
                            size={14}
                            className={index < review.rating ? "text-yellow-500" : "text-muted-foreground"}
                            fill={index < review.rating ? "currentColor" : "none"}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {review.size ? (
                      <div className="mt-2 text-xs uppercase tracking-wide text-muted-foreground">
                        Size: {review.size}
                      </div>
                    ) : null}
                    {review.comment ? (
                      <p className="mt-2 text-sm text-muted-foreground">{review.comment}</p>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Card>
      </div>
    </main>
  );
}
