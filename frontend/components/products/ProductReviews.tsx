"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { Skeleton } from "@/components/ui/Skeleton";
import { toast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";
import type { ApiResponse } from "@/types";

interface Review {
  id: string;
  authorName: string;
  rating: number;
  title: string;
  content: string;
  createdAt: string;
}

interface ProductReviewsProps {
  productId: string;
}

function StarRating({
  rating,
  interactive,
  onRate,
}: {
  rating: number;
  interactive?: boolean;
  onRate?: (value: number) => void;
}) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((value) => (
        <button
          key={value}
          type="button"
          disabled={!interactive}
          onClick={() => onRate?.(value)}
          className={cn(
            "transition-colors",
            interactive && "cursor-pointer hover:text-yellow-400",
          )}
        >
          <Star
            className={cn(
              "h-5 w-5",
              value <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-zinc-300 dark:text-zinc-600",
            )}
          />
        </button>
      ))}
    </div>
  );
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  const [showForm, setShowForm] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["reviews", productId],
    queryFn: () =>
      apiClient.get<ApiResponse<Review[]>>(
        `/store/products/${productId}/reviews`,
      ),
  });

  const reviews = data?.data ?? [];

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newRating === 0) {
      toast("Please select a rating", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      await apiClient.post(`/store/products/${productId}/reviews`, {
        rating: newRating,
        title: newTitle,
        content: newContent,
      });
      toast("Review submitted", "success");
      setShowForm(false);
      setNewRating(0);
      setNewTitle("");
      setNewContent("");
      refetch();
    } catch {
      toast("Failed to submit review", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  return (
    <section>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
            Reviews
          </h2>
          {reviews.length > 0 && (
            <div className="flex items-center gap-1">
              <StarRating rating={Math.round(averageRating)} />
              <span className="text-sm text-zinc-500">
                ({reviews.length})
              </span>
            </div>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowForm(!showForm)}
        >
          Write a Review
        </Button>
      </div>

      {/* Review Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-4 rounded-xl border border-zinc-200 p-6 dark:border-zinc-800"
        >
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Rating
            </label>
            <StarRating
              rating={newRating}
              interactive
              onRate={setNewRating}
            />
          </div>
          <div>
            <label
              htmlFor="review-title"
              className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Title
            </label>
            <input
              id="review-title"
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Summarize your review"
              className="flex h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
              required
            />
          </div>
          <Textarea
            id="review-content"
            label="Review"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="Share your experience with this product..."
            rows={4}
          />
          <div className="flex gap-3">
            <Button type="submit" isLoading={isSubmitting}>
              Submit Review
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      {reviews.length === 0 && !showForm ? (
        <p className="mt-6 text-zinc-500 dark:text-zinc-400">
          No reviews yet. Be the first to review this product.
        </p>
      ) : (
        <ul className="mt-6 divide-y divide-zinc-200 dark:divide-zinc-800">
          {reviews.map((review) => (
            <li key={review.id} className="py-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <StarRating rating={review.rating} />
                  <span className="text-sm font-medium text-zinc-900 dark:text-white">
                    {review.authorName}
                  </span>
                </div>
                <span className="text-xs text-zinc-400">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              {review.title && (
                <h4 className="mt-2 font-medium text-zinc-900 dark:text-white">
                  {review.title}
                </h4>
              )}
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                {review.content}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
