import type { CartItem } from "@/context/CartContext";

export type Review = {
  id: string;
  userId: string;
  orderId: string;
  productId: string;
  productName: string;
  rating: number;
  comment?: string;
  createdAt: number;
  size?: CartItem["size"];
};

const LS_REVIEWS = "rangista_reviews";

type ReviewKeyInput = {
  userId: string;
  orderId: string;
  productId: string;
  size?: CartItem["size"];
};

type CreateReviewInput = ReviewKeyInput & {
  productName: string;
  rating: number;
  comment?: string;
};

function read(): Review[] {
  try {
    const raw = localStorage.getItem(LS_REVIEWS);
    return raw ? (JSON.parse(raw) as Review[]) : [];
  } catch {
    return [];
  }
}

function write(list: Review[]) {
  localStorage.setItem(LS_REVIEWS, JSON.stringify(list));
  try {
    window.dispatchEvent(new CustomEvent("reviews:change"));
  } catch {}
}

function matchesKey(review: Review, key: ReviewKeyInput) {
  return (
    review.userId === key.userId &&
    review.orderId === key.orderId &&
    review.productId === key.productId &&
    (review.size ?? "") === (key.size ?? "")
  );
}

export function listReviews(): Review[] {
  return read();
}

export function listReviewsByProduct(productId: string): Review[] {
  return read()
    .filter((r) => r.productId === productId)
    .sort((a, b) => b.createdAt - a.createdAt);
}

export function listReviewsByUser(userId: string): Review[] {
  return read()
    .filter((r) => r.userId === userId)
    .sort((a, b) => b.createdAt - a.createdAt);
}

export function findReviewForOrderItem(key: ReviewKeyInput): Review | undefined {
  return read().find((review) => matchesKey(review, key));
}

export function hasReviewForOrderItem(key: ReviewKeyInput): boolean {
  return findReviewForOrderItem(key) !== undefined;
}

export function createReview(input: CreateReviewInput): Review {
  const list = read();
  const existing = list.find((review) => matchesKey(review, input));
  if (existing) {
    return existing;
  }

  const normalizedRating = Math.min(5, Math.max(1, Math.round(input.rating)));
  const review: Review = {
    id: crypto.randomUUID(),
    userId: input.userId,
    orderId: input.orderId,
    productId: input.productId,
    productName: input.productName,
    rating: normalizedRating,
    comment: input.comment?.trim() ? input.comment.trim() : undefined,
    createdAt: Date.now(),
    size: input.size,
  };

  list.push(review);
  write(list);
  return review;
}
