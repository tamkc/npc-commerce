"use client";

import { cn } from "@/lib/utils";
import type { ProductVariant } from "@/types";

interface VariantSelectorProps {
  variants: ProductVariant[];
  selectedVariantId: string;
  onSelect: (variantId: string) => void;
}

export function VariantSelector({
  variants,
  selectedVariantId,
  onSelect,
}: VariantSelectorProps) {
  if (variants.length <= 1) return null;

  const optionNames = Object.keys(variants[0]?.options ?? {});

  return (
    <div className="space-y-4">
      {optionNames.map((optionName) => {
        const values = [
          ...new Set(variants.map((v) => v.options[optionName])),
        ];
        const selectedVariant = variants.find(
          (v) => v.id === selectedVariantId,
        );
        const selectedValue = selectedVariant?.options[optionName];

        return (
          <div key={optionName}>
            <span className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              {optionName}: {selectedValue}
            </span>
            <div className="flex flex-wrap gap-2">
              {values.map((value) => {
                const isSelected = value === selectedValue;
                return (
                  <button
                    key={value}
                    onClick={() => {
                      const match = variants.find(
                        (v) => v.options[optionName] === value,
                      );
                      if (match) onSelect(match.id);
                    }}
                    className={cn(
                      "rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
                      isSelected
                        ? "border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-900"
                        : "border-zinc-300 text-zinc-700 hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-600",
                    )}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
