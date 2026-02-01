"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/products/ProductCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { useRecommendations } from "@/hooks/use-recommendations";

interface RecommendationCarouselProps {
  userId?: string;
  productId?: string;
  title?: string;
}

export function RecommendationCarousel({
  userId,
  productId,
  title,
}: RecommendationCarouselProps) {
  const { data, isLoading } = useRecommendations({ userId, productId });
  const scrollRef = useRef<HTMLDivElement>(null);

  const groups = data?.data ?? [];

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 300;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  if (isLoading) {
    return (
      <section className="space-y-4">
        {title && <Skeleton className="h-7 w-48" />}
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="w-60 shrink-0">
              <Skeleton className="aspect-square w-full rounded-xl" />
              <Skeleton className="mt-2 h-4 w-3/4" />
              <Skeleton className="mt-1 h-5 w-1/3" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (groups.length === 0) return null;

  return (
    <div className="space-y-8">
      {groups.map((group, gi) => (
        <section key={gi}>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
              {title ?? group.title}
            </h3>
            <div className="flex gap-1">
              <button
                onClick={() => scroll("left")}
                className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => scroll("right")}
                className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div
            ref={scrollRef}
            className="scrollbar-hide flex gap-4 overflow-x-auto"
          >
            {group.products.map((product) => (
              <div key={product.id} className="w-60 shrink-0">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
