import { FormEvent, useMemo, useState } from "react";
import { listOrdersByUser } from "@/data/orders";
import { useAuth } from "@/context/AuthContext";
import { formatPKR } from "@/lib/currency";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { createReview, hasReviewForOrderItem } from "@/data/reviews";

interface ReviewTarget {
  orderId: string;
  productId: string;
  productName: string;
  size?: string;
}

export default function Orders() {
  const { user } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeTarget, setActiveTarget] = useState<ReviewTarget | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [refreshToken, setRefreshToken] = useState(0);

  if (!user) return <div className="container py-10">Please login to view your orders.</div>;

  const orders = useMemo(() => listOrdersByUser(user.id), [user.id, refreshToken]);

  const openReviewDialog = (target: ReviewTarget) => {
    setActiveTarget(target);
    setRating(5);
    setComment("");
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setActiveTarget(null);
    setComment("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!activeTarget || !user) return;

    createReview({
      userId: user.id,
      orderId: activeTarget.orderId,
      productId: activeTarget.productId,
      productName: activeTarget.productName,
      rating,
      comment,
      size: activeTarget.size,
    });

    setRefreshToken((prev) => prev + 1);
    closeDialog();
  };

  return (
    <main className="container py-10">
      <h1 className="font-serif text-3xl">My Orders</h1>
      {orders.length === 0 ? (
        <p className="mt-4 text-muted-foreground">No orders yet.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span>Order #{o.id.slice(0, 8)}</span>
                <span className="capitalize">Status: {o.status.replace("_", " ")}</span>
              </div>
              <ul className="space-y-2">
                {o.items.map((item) => {
                  const reviewed = hasReviewForOrderItem({
                    userId: user.id,
                    orderId: o.id,
                    productId: item.id,
                    size: item.size,
                  });

                  return (
                    <li key={item.id + (item.size ?? "")} className="flex flex-col gap-1 rounded-md border border-dashed p-3 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between md:gap-3">
                      <span>
                        {item.name} {item.size ? `(${item.size})` : ""} × {item.qty} — {formatPKR(item.price * item.qty)}
                      </span>
                      {reviewed ? (
                        <Button variant="secondary" size="sm" disabled>
                          Review submitted
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() =>
                            openReviewDialog({
                              orderId: o.id,
                              productId: item.id,
                              productName: item.name,
                              size: item.size,
                            })
                          }
                        >
                          Give Review
                        </Button>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      )}

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (open) {
            setDialogOpen(true);
          } else {
            closeDialog();
          }
        }}
      >
        <DialogContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <DialogHeader>
              <DialogTitle>Review {activeTarget?.productName}</DialogTitle>
              <DialogDescription>Share your experience to help others.</DialogDescription>
            </DialogHeader>

            <div className="space-y-2">
              <span className="text-sm font-medium">Rating</span>
              <div className="flex gap-2">
                {Array.from({ length: 5 }).map((_, index) => {
                  const value = index + 1;
                  const active = value <= rating;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setRating(value)}
                      className={cn(
                        "rounded-full border px-3 py-2 transition",
                        active
                          ? "border-accent bg-accent text-accent-foreground"
                          : "border-input bg-background text-muted-foreground hover:border-accent hover:text-foreground",
                      )}
                    >
                      <Star className={cn("h-4 w-4", active ? "fill-current" : "")} />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="review-comment" className="text-sm font-medium">
                Description (optional)
              </label>
              <Textarea
                id="review-comment"
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder="Share any thoughts you have about this product." 
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeDialog}>
                Cancel
              </Button>
              <Button type="submit">Submit Review</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  );
}
