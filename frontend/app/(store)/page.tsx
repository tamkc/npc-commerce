"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ProductGrid } from "@/components/products/ProductGrid";
import { RecommendationCarousel } from "@/components/ai/RecommendationCarousel";
import { useProducts } from "@/hooks/use-products";

export default function HomePage() {
  const { data, isLoading } = useProducts({ limit: 8, sortBy: "newest" });
  const products = data?.data ?? [];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-zinc-50 dark:bg-zinc-900">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl dark:text-white">
              Discover products tailored for you
            </h1>
            <p className="mt-6 text-lg text-zinc-600 dark:text-zinc-400">
              AI-powered recommendations, intelligent search, and a shopping
              experience built around your preferences.
            </p>
            <div className="mt-8 flex gap-4">
              <Button size="lg">
                <Link href="/products" className="flex items-center gap-2">
                  Shop Now <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg">
                <Link href="/search">Search Products</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
            New Arrivals
          </h2>
          <Link
            href="/products"
            className="flex items-center gap-1 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <ProductGrid products={products} isLoading={isLoading} />
      </section>

      {/* AI Recommendations */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <RecommendationCarousel title="Recommended for You" />
      </section>
    </div>
  );
}
