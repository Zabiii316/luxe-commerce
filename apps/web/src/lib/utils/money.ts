import type { Product } from "@/lib/types/product";

export function formatPrice(price: number, currency: Product["currency"] = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}
