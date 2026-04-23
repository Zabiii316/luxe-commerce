"use client";

import Link from "next/link";
import { useWishlistStore } from "@/lib/store/wishlist-store";

export function WishlistLink() {
  const count = useWishlistStore((state) => state.items.length);

  return (
    <Link href="/wishlist" className="transition hover:text-[#b3132b]">
      Wishlist {count > 0 ? `(${count})` : ""}
    </Link>
  );
}
