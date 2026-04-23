"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/store/cart-store";
import type { Product } from "@/lib/types/product";

type AddToCartButtonProps = {
  product: Product;
};

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [added, setAdded] = useState(false);

  function handleAddToCart() {
    addItem(product);
    setAdded(true);

    window.setTimeout(() => {
      setAdded(false);
    }, 1400);
  }

  return (
    <button
      onClick={handleAddToCart}
      disabled={product.stock <= 0}
      className="rounded-full bg-[#b3132b] px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#8e1023] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {product.stock <= 0 ? "Sold Out" : added ? "Added" : "Add to Cart"}
    </button>
  );
}
