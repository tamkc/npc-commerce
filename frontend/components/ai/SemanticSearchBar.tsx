"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSemanticSearch } from "@/hooks/use-search";
import { formatPrice } from "@/lib/utils";

interface SemanticSearchBarProps {
  className?: string;
  placeholder?: string;
}

export function SemanticSearchBar({
  className,
  placeholder = "Search with AI (e.g., 'red sneakers under $50')...",
}: SemanticSearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { data, isLoading } = useSemanticSearch(query);

  const products = data?.data?.products ?? [];
  const suggestions = data?.data?.suggestions ?? [];
  const showDropdown = isFocused && query.length >= 2;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsFocused(false);
    }
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder={placeholder}
            className="h-12 w-full rounded-xl border border-zinc-300 bg-white pl-11 pr-10 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-500"
          />
          {isLoading && (
            <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-zinc-400" />
          )}
        </div>
      </form>

      {/* Autocomplete Dropdown */}
      {showDropdown && (products.length > 0 || suggestions.length > 0) && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="border-b border-zinc-100 px-4 py-2 dark:border-zinc-800">
              <p className="mb-1 text-xs font-medium uppercase text-zinc-400">
                Suggestions
              </p>
              {suggestions.slice(0, 3).map((s, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setQuery(s.text);
                    setIsFocused(false);
                    router.push(
                      `/search?q=${encodeURIComponent(s.text)}`,
                    );
                  }}
                  className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  <Search className="h-3.5 w-3.5 text-zinc-400" />
                  {s.text}
                </button>
              ))}
            </div>
          )}

          {/* Product Results */}
          {products.length > 0 && (
            <div className="px-4 py-2">
              <p className="mb-1 text-xs font-medium uppercase text-zinc-400">
                Products
              </p>
              {products.slice(0, 4).map((product) => (
                <button
                  key={product.id}
                  onClick={() => {
                    setIsFocused(false);
                    router.push(`/products/${product.id}`);
                  }}
                  className="flex w-full items-center gap-3 rounded px-2 py-2 text-left hover:bg-zinc-50 dark:hover:bg-zinc-800"
                >
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
                    {product.thumbnail && (
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-zinc-900 dark:text-white">
                      {product.title}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {formatPrice(product.variants[0]?.price ?? 0)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
