"use client";

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { CartItem as CartItemType } from "@/types";

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
  disabled?: boolean;
  compact?: boolean;
}

export function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
  disabled,
  compact,
}: CartItemProps) {
  const imgSize = compact ? "h-16 w-16" : "h-20 w-20";

  return (
    <div className="flex gap-4">
      <div
        className={`relative ${imgSize} shrink-0 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800`}
      >
        {item.thumbnail ? (
          <Image
            src={item.thumbnail}
            alt={item.title}
            fill
            sizes={compact ? "64px" : "80px"}
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-zinc-400">
            No img
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col">
        <h4 className="text-sm font-medium text-zinc-900 dark:text-white">
          {item.title}
        </h4>
        {item.variantTitle && (
          <span className="text-xs text-zinc-500">{item.variantTitle}</span>
        )}
        <span className="mt-1 text-sm font-semibold text-zinc-900 dark:text-white">
          {formatPrice(item.totalPrice)}
        </span>

        <div className="mt-2 flex items-center gap-2">
          <button
            onClick={() =>
              onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))
            }
            disabled={disabled}
            className="rounded border border-zinc-300 p-1 text-zinc-600 hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            <Minus className="h-3 w-3" />
          </button>
          <span className="min-w-[20px] text-center text-sm">
            {item.quantity}
          </span>
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            disabled={disabled}
            className="rounded border border-zinc-300 p-1 text-zinc-600 hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            <Plus className="h-3 w-3" />
          </button>
          <button
            onClick={() => onRemove(item.id)}
            disabled={disabled}
            className="ml-auto rounded p-1 text-zinc-400 hover:text-red-500"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
