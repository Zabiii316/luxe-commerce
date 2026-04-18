import Link from "next/link";
import { CartLink } from "@/components/cart/cart-link";

export function Navbar() {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-[#0d0b08]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link href="/" className="text-xl font-semibold tracking-[0.35em] text-[#d6b46a]">
          LUXE
        </Link>

        <nav className="hidden items-center gap-8 text-sm uppercase tracking-[0.22em] text-white/70 md:flex">
          <Link href="/#edit" className="transition hover:text-[#d6b46a]">
            The Edit
          </Link>
          <Link href="/products" className="transition hover:text-[#d6b46a]">
            Products
          </Link>
          <Link href="/products" className="transition hover:text-[#d6b46a]">
            Electronics
          </Link>
          <Link href="/#concierge" className="transition hover:text-[#d6b46a]">
            Concierge
          </Link>
        </nav>

        <div className="flex items-center gap-4 text-sm uppercase tracking-[0.2em] text-white/70">
          <Link href="/products" className="hidden transition hover:text-[#d6b46a] sm:block">
            Search
          </Link>
          <CartLink />
        </div>
      </div>
    </header>
  );
}
