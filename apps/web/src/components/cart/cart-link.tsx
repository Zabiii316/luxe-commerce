"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCartStore } from "@/lib/store/cart-store";

export function CartLink() {
  const [mounted, setMounted] = useState(false);
  const totalItems = useCartStore((state) => state.getTotalItems());

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Link href="/cart" className="transition hover:text-[#d6b46a]">
      Cart {mounted && totalItems > 0 ? `(${totalItems})` : ""}
    </Link>
  );
}
