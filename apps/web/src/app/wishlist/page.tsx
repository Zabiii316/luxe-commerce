"use client";

import Link from "next/link";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { formatPrice } from "@/lib/utils/money";
import { useWishlistStore } from "@/lib/store/wishlist-store";

export default function WishlistPage() {
  const items = useWishlistStore((state) => state.items);
  const removeItem = useWishlistStore((state) => state.removeItem);
  const clearWishlist = useWishlistStore((state) => state.clearWishlist);

  return (
    <main className="min-h-screen bg-white text-[#181818]">
      <Navbar />

      <section className="px-6 py-28 pt-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-[#b3132b]">Wishlist</p>
              <h1 className="mt-5 text-5xl font-light tracking-[-0.04em] text-[#181818] md:text-7xl">
                Saved products.
              </h1>
            </div>

            <Link
              href="/products"
              className="text-sm uppercase tracking-[0.25em] text-[#6b6b6b] transition hover:text-[#b3132b]"
            >
              Continue shopping
            </Link>
          </div>

          {items.length === 0 ? (
            <div className="rounded-[2rem] border border-[#e9d8dc] bg-[#faf7f8] p-10">
              <h2 className="text-3xl font-light text-[#181818]">Your wishlist is empty.</h2>

              <p className="mt-4 max-w-xl text-sm leading-7 text-[#6b6b6b]">
                Save products you want to revisit later and build your own curated LuxeCommerce
                selection.
              </p>

              <Link
                href="/products"
                className="mt-8 inline-flex rounded-full bg-[#b3132b] px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#8e1023]"
              >
                Explore Products
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-8 flex justify-end">
                <button
                  onClick={clearWishlist}
                  className="text-xs uppercase tracking-[0.22em] text-[#6b6b6b] transition hover:text-[#b3132b]"
                >
                  Clear wishlist
                </button>
              </div>

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {items.map((item) => (
                  <article
                    key={item.sku}
                    className="overflow-hidden rounded-[2rem] border border-[#e9d8dc] bg-white shadow-[0_16px_40px_rgba(179,19,43,0.06)]"
                  >
                    <Link href={`/products/${item.slug}`} className="block">
                      <div className="aspect-[4/5] bg-[linear-gradient(145deg,_#ffffff,_#fcebed_60%,_#fff7f8)]">
                        {item.images[0] ? (
                          <img
                            src={item.images[0]}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        ) : null}
                      </div>
                    </Link>

                    <div className="p-6">
                      <p className="text-xs uppercase tracking-[0.25em] text-[#b3132b]">
                        {item.brand}
                      </p>

                      <Link href={`/products/${item.slug}`}>
                        <h2 className="mt-3 text-2xl font-light text-[#181818] transition hover:text-[#b3132b]">
                          {item.name}
                        </h2>
                      </Link>

                      <p className="mt-3 text-sm leading-6 text-[#6b6b6b]">
                        {item.shortDescription}
                      </p>

                      <div className="mt-6 flex items-center justify-between">
                        <p className="text-lg text-[#181818]">
                          {formatPrice(item.price, item.currency)}
                        </p>

                        <button
                          onClick={() => removeItem(item.sku)}
                          className="text-xs uppercase tracking-[0.2em] text-[#6b6b6b] transition hover:text-[#b3132b]"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
