import Link from "next/link";
import { prisma } from "@luxe/database";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { formatPrice } from "@/lib/utils/money";

type SuccessPageProps = {
  searchParams: Promise<{
    orderId?: string;
  }>;
};

export const metadata = {
  title: "Order Confirmation | LuxeCommerce",
  description: "Your LuxeCommerce order confirmation.",
};

function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    PAYMENT_PENDING: "Payment Pending",
    PAID: "Paid",
    FULFILLING: "Fulfilling",
    SHIPPED: "Shipped",
    CANCELLED: "Cancelled",
    REFUNDED: "Refunded",
  };

  return labels[status] ?? status;
}

function getStatusDescription(status: string) {
  if (status === "PAID") {
    return "Your payment has been confirmed and the order is ready for fulfillment.";
  }

  if (status === "PAYMENT_PENDING") {
    return "Your order has been created. Payment confirmation is still pending.";
  }

  if (status === "CANCELLED") {
    return "This order has been cancelled or the payment failed.";
  }

  return "Your order is being processed by LuxeCommerce.";
}

function getDisplayTotal(order: {
  subtotal: number;
  discountAmount: number;
  total: number;
}) {
  if (order.discountAmount > 0) {
    return order.total;
  }

  return order.total > 0 ? order.total : order.subtotal;
}

export default async function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const { orderId } = await searchParams;

  if (!orderId) {
    return (
      <main className="min-h-screen bg-white text-[#181818]">
        <Navbar />
        <section className="px-6 py-28 pt-32">
          <div className="mx-auto max-w-3xl rounded-[2.5rem] border border-[#e9d8dc] bg-white p-8 shadow-[0_18px_50px_rgba(179,19,43,0.06)] md:p-12">
            <p className="text-sm uppercase tracking-[0.35em] text-[#b3132b]">Order Missing</p>

            <h1 className="mt-5 text-5xl font-light leading-tight tracking-[-0.04em] text-[#181818] md:text-7xl">
              No order found.
            </h1>

            <p className="mt-6 text-lg leading-8 text-[#6b6b6b]">
              We could not find an order ID in this confirmation link.
            </p>

            <Link
              href="/products"
              className="mt-10 inline-flex justify-center rounded-full bg-[#b3132b] px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#8e1023]"
            >
              Continue Shopping
            </Link>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
    include: {
      customer: true,
      items: true,
    },
  });

  if (!order) {
    return (
      <main className="min-h-screen bg-white text-[#181818]">
        <Navbar />
        <section className="px-6 py-28 pt-32">
          <div className="mx-auto max-w-3xl rounded-[2.5rem] border border-[#e9d8dc] bg-white p-8 shadow-[0_18px_50px_rgba(179,19,43,0.06)] md:p-12">
            <p className="text-sm uppercase tracking-[0.35em] text-[#b3132b]">Order Not Found</p>

            <h1 className="mt-5 text-5xl font-light leading-tight tracking-[-0.04em] text-[#181818] md:text-7xl">
              We could not locate this order.
            </h1>

            <p className="mt-6 text-lg leading-8 text-[#6b6b6b]">
              The order may not exist, or the confirmation link may be incorrect.
            </p>

            <Link
              href="/products"
              className="mt-10 inline-flex justify-center rounded-full bg-[#b3132b] px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#8e1023]"
            >
              Continue Shopping
            </Link>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  const address = order.address as {
    address?: string;
    city?: string;
    country?: string;
    postalCode?: string;
  };

  const subtotal = Number(order.subtotal);
  const discountAmount = Number(order.discountAmount);
  const total = Number(order.total);
  const displayTotal = getDisplayTotal({ subtotal, discountAmount, total });

  return (
    <main className="min-h-screen bg-white text-[#181818]">
      <Navbar />

      <section className="px-6 py-28 pt-32">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-[2.5rem] border border-[#e9d8dc] bg-white p-8 shadow-[0_18px_50px_rgba(179,19,43,0.06)] md:p-12">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-[#b3132b]">
                  Order Confirmation
                </p>

                <h1 className="mt-5 text-5xl font-light leading-tight tracking-[-0.04em] text-[#181818] md:text-7xl">
                  Your private order is ready.
                </h1>

                <p className="mt-6 max-w-2xl text-lg leading-8 text-[#6b6b6b]">
                  {getStatusDescription(order.status)}
                </p>
              </div>

              <div className="rounded-2xl border border-[#e9d8dc] bg-[#fcebed] px-5 py-4">
                <p className="text-xs uppercase tracking-[0.25em] text-[#b3132b]">Status</p>
                <p className="mt-2 text-[#181818]">{getStatusLabel(order.status)}</p>
              </div>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              <div className="rounded-2xl border border-[#e9d8dc] bg-[#faf7f8] p-5">
                <p className="text-xs uppercase tracking-[0.25em] text-[#6b6b6b]">Order ID</p>
                <p className="mt-2 break-all text-sm text-[#181818]">{order.id}</p>
              </div>

              <div className="rounded-2xl border border-[#e9d8dc] bg-[#faf7f8] p-5">
                <p className="text-xs uppercase tracking-[0.25em] text-[#6b6b6b]">Customer</p>
                <p className="mt-2 text-sm text-[#181818]">
                  {order.customer.firstName} {order.customer.lastName}
                </p>
                <p className="mt-1 text-sm text-[#6b6b6b]">{order.customer.email}</p>
              </div>

              <div className="rounded-2xl border border-[#e9d8dc] bg-[#faf7f8] p-5">
                <p className="text-xs uppercase tracking-[0.25em] text-[#6b6b6b]">Total</p>
                <p className="mt-2 text-2xl font-light text-[#181818]">
                  {formatPrice(displayTotal, order.currency as "USD")}
                </p>
              </div>
            </div>

            <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_340px]">
              <div>
                <h2 className="text-2xl font-light text-[#181818]">Order Items</h2>

                <div className="mt-5 space-y-4">
                  {order.items.map((item) => (
                    <article
                      key={item.id}
                      className="flex flex-col justify-between gap-4 rounded-2xl border border-[#e9d8dc] bg-[#faf7f8] p-5 md:flex-row md:items-center"
                    >
                      <div>
                        <p className="text-[#181818]">{item.name}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[#6b6b6b]">
                          SKU {item.productSku} · Qty {item.quantity}
                        </p>
                      </div>

                      <div className="text-left md:text-right">
                        <p className="text-sm text-[#6b6b6b]">
                          Unit {formatPrice(Number(item.unitPrice), order.currency as "USD")}
                        </p>
                        <p className="mt-1 text-lg text-[#181818]">
                          {formatPrice(Number(item.lineTotal), order.currency as "USD")}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              <aside className="h-fit rounded-2xl border border-[#e9d8dc] bg-[#faf7f8] p-5">
                <h2 className="text-2xl font-light text-[#181818]">Pricing</h2>

                <div className="mt-5 space-y-3 text-sm text-[#6b6b6b]">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal, order.currency as "USD")}</span>
                  </div>

                  {order.discountCode ? (
                    <div className="flex justify-between">
                      <span>Discount ({order.discountCode})</span>
                      <span>-{formatPrice(discountAmount, order.currency as "USD")}</span>
                    </div>
                  ) : null}

                  <div className="flex justify-between border-t border-[#e9d8dc] pt-3 text-base text-[#181818]">
                    <span>Total</span>
                    <span>{formatPrice(displayTotal, order.currency as "USD")}</span>
                  </div>
                </div>

                <div className="mt-6 border-t border-[#e9d8dc] pt-5">
                  <h3 className="text-lg font-light text-[#181818]">Delivery Details</h3>

                  <div className="mt-4 space-y-3 text-sm leading-6 text-[#6b6b6b]">
                    <p>{address.address}</p>
                    <p>
                      {address.city}, {address.postalCode}
                    </p>
                    <p>{address.country}</p>
                  </div>
                </div>

                <div className="mt-6 border-t border-[#e9d8dc] pt-5">
                  <p className="text-xs uppercase tracking-[0.25em] text-[#6b6b6b]">
                    Payment Reference
                  </p>
                  <p className="mt-2 break-all text-sm text-[#181818]">
                    {order.paymentRef || "Pending"}
                  </p>
                </div>
              </aside>
            </div>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/products"
                className="inline-flex justify-center rounded-full bg-[#b3132b] px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#8e1023]"
              >
                Continue Shopping
              </Link>

              <Link
                href="/"
                className="inline-flex justify-center rounded-full border border-[#e9d8dc] bg-white px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#181818] transition hover:border-[#b3132b] hover:text-[#b3132b]"
              >
                Back Home
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
