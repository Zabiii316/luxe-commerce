import Link from "next/link";
import { CartLink } from "@/components/cart/cart-link";

export function Navbar() {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-[#e9d8dc] bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link href="/" className="text-xl font-semibold tracking-[0.35em] text-[#b3132b]">
          LUXE
        </Link>

        <nav className="hidden items-center gap-8 text-sm uppercase tracking-[0.22em] text-[#6b6b6b] md:flex">
          <Link href="/#edit" className="transition hover:text-[#b3132b]">
            The Edit
          </Link>
          <Link href="/products" className="transition hover:text-[#b3132b]">
            Products
          </Link>
          <Link href="/products" className="transition hover:text-[#b3132b]">
            Electronics
          </Link>
          <Link href="/#concierge" className="transition hover:text-[#b3132b]">
            Concierge
          </Link>
        </nav>

        <div className="flex items-center gap-4 text-sm uppercase tracking-[0.2em] text-[#6b6b6b]">
          <Link href="/products" className="hidden transition hover:text-[#b3132b] sm:block">
            Search
          </Link>
          <CartLink />
        </div>
      </div>
    </header>
  );
}
