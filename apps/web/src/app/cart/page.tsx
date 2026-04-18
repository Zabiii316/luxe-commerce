"use client";

import Link from "next/link";
import { formatPrice } from "@/lib/utils/money";
import { useCartStore } from "@/lib/store/cart-store";

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const subtotal = useCartStore((state) => state.getSubtotal());

  return (
    <main className="min-h-screen bg-[#0d0b08] px-6 py-28 text-[#f8f2e8]">
      <section className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-[#d6b46a]">
              Private Cart
            </p>
            <h1 className="mt-5 text-5xl font-light tracking-[-0.04em] text-white md:text-7xl">
              Your selection.
            </h1>
          </div>

          <Link
            href="/products"
            className="text-sm uppercase tracking-[0.25em] text-white/45 transition hover:text-[#d6b46a]"
          >
            Continue shopping
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-10">
            <h2 className="text-3xl font-light text-white">Your cart is empty.</h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-white/55">
              Explore the LuxeCommerce catalogue and add premium fashion, accessories, and
              high-end electronics to your private selection.
            </p>

            <Link
              href="/products"
              className="mt-8 inline-flex rounded-full bg-[#d6b46a] px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-black transition hover:bg-[#f0cf82]"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
            <div className="space-y-5">
              {items.map((item) => (
                <article
                  key={item.sku}
                  className="grid gap-6 rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 md:grid-cols-[160px_1fr]"
                >
                  <Link
                    href={`/products/${item.slug}`}
                    className="flex aspect-square items-end rounded-[1.5rem] bg-gradient-to-br from-[#2d271f] via-[#16120e] to-black p-4"
                  >
                    <span className="rounded-full border border-white/15 bg-black/30 px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-[#d6b46a]">
                      Luxe
                    </span>
                  </Link>

                  <div className="flex flex-col justify-between gap-6">
                    <div className="flex flex-col justify-between gap-4 md:flex-row">
                      <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-[#d6b46a]">
                          {item.brand}
                        </p>

                        <Link href={`/products/${item.slug}`}>
                          <h2 className="mt-2 text-2xl font-light text-white transition hover:text-[#d6b46a]">
                            {item.name}
                          </h2>
                        </Link>

                        <p className="mt-2 text-sm text-white/45">{item.category}</p>
                      </div>

                      <p className="text-xl font-light text-white">
                        {formatPrice(item.price * item.quantity, item.currency)}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center rounded-full border border-white/10">
                        <button
                          onClick={() => decreaseQuantity(item.sku)}
                          className="px-5 py-3 text-white/60 transition hover:text-[#d6b46a]"
                          aria-label={`Decrease ${item.name} quantity`}
                        >
                          −
                        </button>

                        <span className="min-w-10 text-center text-sm text-white/70">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => increaseQuantity(item.sku)}
                          className="px-5 py-3 text-white/60 transition hover:text-[#d6b46a]"
                          aria-label={`Increase ${item.name} quantity`}
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.sku)}
                        className="text-sm uppercase tracking-[0.2em] text-white/35 transition hover:text-red-300"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <aside className="h-fit rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 lg:sticky lg:top-28">
              <p className="text-sm uppercase tracking-[0.3em] text-[#d6b46a]">
                Order Summary
              </p>

              <div className="mt-8 space-y-4 border-b border-white/10 pb-6">
                <div className="flex justify-between text-sm text-white/55">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>

                <div className="flex justify-between text-sm text-white/55">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>

                <div className="flex justify-between text-sm text-white/55">
                  <span>Taxes</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>

              <div className="mt-6 flex justify-between text-xl text-white">
                <span>Total</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              <Link
                href="/checkout"
                className="mt-8 flex w-full justify-center rounded-full bg-[#d6b46a] px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-black transition hover:bg-[#f0cf82]"
              >
                Proceed to Checkout
              </Link>

              <button
                onClick={clearCart}
                className="mt-4 w-full text-center text-xs uppercase tracking-[0.22em] text-white/35 transition hover:text-white"
              >
                Clear cart
              </button>

              <p className="mt-6 text-xs leading-6 text-white/40">
                Secure checkout, server-side price validation, and payment processing will be added
                in the next commerce phase.
              </p>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}
