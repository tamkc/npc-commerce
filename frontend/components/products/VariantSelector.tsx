'use client';

import { cn } from '@/lib/utils';
import type { ProductVariant } from '@/types';

interface VariantSelectorProps {
  variants: ProductVariant[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function VariantSelector({
  variants,
  selectedId,
  onSelect,
}: VariantSelectorProps) {
  if (variants.length <= 1) return null;

  // Group by option name
  const optionGroups = new Map<string, { value: string; variantId: string }[]>();
  for (const variant of variants) {
    for (const ov of variant.optionValues ?? []) {
      const key = ov.option.name;
      if (!optionGroups.has(key)) optionGroups.set(key, []);
      const group = optionGroups.get(key)!;
      if (!group.some((g) => g.value === ov.value)) {
        group.push({ value: ov.value, variantId: variant.id });
      }
    }
  }

  // If no structured options, show variant titles
  if (optionGroups.size === 0) {
    return (
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">Variant</p>
        <div className="flex flex-wrap gap-2">
          {variants.map((v) => (
            <button
              key={v.id}
              onClick={() => onSelect(v.id)}
              className={cn(
                'rounded-md border px-3 py-1.5 text-sm transition-colors',
                v.id === selectedId
                  ? 'border-brand-600 bg-brand-50 text-brand-700'
                  : 'border-gray-300 text-gray-700 hover:border-gray-400',
              )}
            >
              {v.title}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {[...optionGroups.entries()].map(([name, values]) => (
        <div key={name} className="space-y-2">
          <p className="text-sm font-medium text-gray-700">{name}</p>
          <div className="flex flex-wrap gap-2">
            {values.map((v) => (
              <button
                key={v.value}
                onClick={() => onSelect(v.variantId)}
                className={cn(
                  'rounded-md border px-3 py-1.5 text-sm transition-colors',
                  v.variantId === selectedId
                    ? 'border-brand-600 bg-brand-50 text-brand-700'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400',
                )}
              >
                {v.value}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
