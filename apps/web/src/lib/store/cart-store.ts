import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/lib/types/product";

export type CartItem = {
  sku: string;
  slug: string;
  name: string;
  brand: string;
  category: Product["category"];
  price: number;
  currency: Product["currency"];
  quantity: number;
};

type CartState = {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (sku: string) => void;
  increaseQuantity: (sku: string) => void;
  decreaseQuantity: (sku: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        const existingItem = get().items.find((item) => item.sku === product.sku);

        if (existingItem) {
          set({
            items: get().items.map((item) =>
              item.sku === product.sku
                ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
                : item,
            ),
          });
          return;
        }

        set({
          items: [
            ...get().items,
            {
              sku: product.sku,
              slug: product.slug,
              name: product.name,
              brand: product.brand,
              category: product.category,
              price: product.price,
              currency: product.currency,
              quantity: 1,
            },
          ],
        });
      },

      removeItem: (sku) => {
        set({
          items: get().items.filter((item) => item.sku !== sku),
        });
      },

      increaseQuantity: (sku) => {
        set({
          items: get().items.map((item) =>
            item.sku === sku ? { ...item, quantity: item.quantity + 1 } : item,
          ),
        });
      },

      decreaseQuantity: (sku) => {
        set({
          items: get()
            .items.map((item) =>
              item.sku === sku ? { ...item, quantity: item.quantity - 1 } : item,
            )
            .filter((item) => item.quantity > 0),
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
    }),
    {
      name: "luxe-commerce-cart",
    },
  ),
);
