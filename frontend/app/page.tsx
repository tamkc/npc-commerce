import Link from 'next/link';
import { API_BASE_URL } from '@/lib/constants';
import { ProductGrid } from '@/components/products/ProductGrid';
import { Button } from '@/components/ui/Button';
import type { Product, PaginatedResponse } from '@/types';

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/store/products?limit=8`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    const data = json.data ?? json;
    return Array.isArray(data) ? data : (data as PaginatedResponse<Product>).data ?? [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const products = await getFeaturedProducts();

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-600 to-brand-800 py-20 text-white">
        <div className="container-page text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Discover Amazing Products
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-brand-100">
            AI-powered shopping experience with personalized recommendations
            and smart search.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Button size="lg" className="bg-white text-brand-700 hover:bg-gray-100" asChild>
              <Link href="/products">Shop Now</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
              <Link href="/search">Search</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container-page py-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            Featured Products
          </h2>
          <Link
            href="/products"
            className="text-sm font-medium text-brand-600 hover:text-brand-700"
          >
            View All
          </Link>
        </div>
        <ProductGrid products={products} />
      </section>
    </div>
  );
}
