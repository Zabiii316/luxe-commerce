"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/lib/types/product";

type WishlistState = {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (sku: string) => void;
  toggleItem: (product: Product) => void;
  hasItem: (sku: string) => boolean;
  clearWishlist: () => void;
};

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        const exists = get().items.some((item) => item.sku === product.sku);

        if (exists) {
          return;
        }

        set((state) => ({
          items: [...state.items, product],
        }));
      },
      removeItem: (sku) => {
        set((state) => ({
          items: state.items.filter((item) => item.sku !== sku),
        }));
      },
      toggleItem: (product) => {
        const exists = get().items.some((item) => item.sku === product.sku);

        if (exists) {
          get().removeItem(product.sku);
          return;
        }

        get().addItem(product);
      },
      hasItem: (sku) => {
        return get().items.some((item) => item.sku === sku);
      },
      clearWishlist: () => {
        set({ items: [] });
      },
    }),
    {
      name: "luxe-wishlist",
    },
  ),
);
