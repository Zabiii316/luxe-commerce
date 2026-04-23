"use client";

import { useMemo } from "react";
import type { Product } from "@/lib/types/product";
import { useWishlistStore } from "@/lib/store/wishlist-store";

type AddToWishlistButtonProps = {
  product: Product;
};

export function AddToWishlistButton({ product }: AddToWishlistButtonProps) {
  const items = useWishlistStore((state) => state.items);
  const toggleItem = useWishlistStore((state) => state.toggleItem);

  const isSaved = useMemo(
    () => items.some((item) => item.sku === product.sku),
    [items, product.sku],
  );

  return (
    <button
      onClick={() => toggleItem(product)}
      className={`rounded-full border px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] transition ${
        isSaved
          ? "border-[#b3132b] bg-[#fcebed] text-[#b3132b]"
          : "border-[#e9d8dc] bg-white text-[#181818] hover:border-[#b3132b] hover:text-[#b3132b]"
      }`}
    >
      {isSaved ? "Saved" : "Add to Wishlist"}
    </button>
  );
}
