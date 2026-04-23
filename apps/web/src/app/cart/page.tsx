"use client";

import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
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
    <main className="min-h-screen bg-white text-[#181818]">
      <Navbar />

      <section className="px-6 py-28 pt-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-[#b3132b]">Private Cart</p>
              <h1 className="mt-5 text-5xl font-light tracking-[-0.04em] text-[#181818] md:text-7xl">
                Your selection.
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
              <h2 className="text-3xl font-light text-[#181818]">Your cart is empty.</h2>

              <p className="mt-4 max-w-xl text-sm leading-7 text-[#6b6b6b]">
                Explore the LuxeCommerce catalogue and add premium fashion, accessories, and
                high-end electronics to your private selection.
              </p>

              <Link
                href="/products"
                className="mt-8 inline-flex rounded-full bg-[#b3132b] px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#8e1023]"
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
                    className="grid gap-6 rounded-[2rem] border border-[#e9d8dc] bg-white p-5 shadow-[0_16px_40px_rgba(179,19,43,0.06)] md:grid-cols-[160px_1fr]"
                  >
                    <Link
                      href={`/products/${item.slug}`}
                      className="flex aspect-square items-end rounded-[1.5rem] bg-[linear-gradient(145deg,_#ffffff,_#fcebed_60%,_#fff7f8)] p-4"
                    >
                      <span className="rounded-full border border-[#e9d8dc] bg-white px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-[#b3132b]">
                        Luxe
                      </span>
                    </Link>

                    <div className="flex flex-col justify-between gap-6">
                      <div className="flex flex-col justify-between gap-4 md:flex-row">
                        <div>
                          <p className="text-xs uppercase tracking-[0.25em] text-[#b3132b]">
                            {item.brand}
                          </p>

                          <Link href={`/products/${item.slug}`}>
                            <h2 className="mt-2 text-2xl font-light text-[#181818] transition hover:text-[#b3132b]">
                              {item.name}
                            </h2>
                          </Link>

                          <p className="mt-2 text-sm text-[#6b6b6b]">{item.category}</p>
                        </div>

                        <p className="text-xl font-light text-[#181818]">
                          {formatPrice(item.price * item.quantity, item.currency)}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center rounded-full border border-[#e9d8dc] bg-[#faf7f8]">
                          <button
                            onClick={() => decreaseQuantity(item.sku)}
                            className="px-5 py-3 text-[#6b6b6b] transition hover:text-[#b3132b]"
                            aria-label={`Decrease ${item.name} quantity`}
                          >
                            −
                          </button>

                          <span className="min-w-10 text-center text-sm text-[#181818]">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() => increaseQuantity(item.sku)}
                            className="px-5 py-3 text-[#6b6b6b] transition hover:text-[#b3132b]"
                            aria-label={`Increase ${item.name} quantity`}
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.sku)}
                          className="text-sm uppercase tracking-[0.2em] text-[#6b6b6b] transition hover:text-[#b3132b]"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <aside className="h-fit rounded-[2rem] border border-[#e9d8dc] bg-[#faf7f8] p-6 lg:sticky lg:top-28">
                <p className="text-sm uppercase tracking-[0.3em] text-[#b3132b]">Order Summary</p>

                <div className="mt-8 space-y-4 border-b border-[#e9d8dc] pb-6">
                  <div className="flex justify-between text-sm text-[#6b6b6b]">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>

                  <div className="flex justify-between text-sm text-[#6b6b6b]">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>

                  <div className="flex justify-between text-sm text-[#6b6b6b]">
                    <span>Taxes</span>
                    <span>Calculated at checkout</span>
                  </div>
                </div>

                <div className="mt-6 flex justify-between text-xl text-[#181818]">
                  <span>Total</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>

                <Link
                  href="/checkout"
                  className="mt-8 flex w-full justify-center rounded-full bg-[#b3132b] px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#8e1023]"
                >
                  Proceed to Checkout
                </Link>

                <button
                  onClick={clearCart}
                  className="mt-4 w-full text-center text-xs uppercase tracking-[0.22em] text-[#6b6b6b] transition hover:text-[#b3132b]"
                >
                  Clear cart
                </button>
              </aside>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
