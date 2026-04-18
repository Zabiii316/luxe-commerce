import Link from "next/link";
import { prisma } from "@luxe/database";
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

export default async function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const { orderId } = await searchParams;

  if (!orderId) {
    return (
      <main className="min-h-screen bg-[#0d0b08] px-6 py-28 text-[#f8f2e8]">
        <section className="mx-auto max-w-3xl rounded-[2.5rem] border border-white/10 bg-white/[0.03] p-8 md:p-12">
          <p className="text-sm uppercase tracking-[0.35em] text-[#d6b46a]">Order Missing</p>

          <h1 className="mt-5 text-5xl font-light leading-tight tracking-[-0.04em] text-white md:text-7xl">
            No order found.
          </h1>

          <p className="mt-6 text-lg leading-8 text-white/60">
            We could not find an order ID in this confirmation link.
          </p>

          <Link
            href="/products"
            className="mt-10 inline-flex justify-center rounded-full bg-[#d6b46a] px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-black transition hover:bg-[#f0cf82]"
          >
            Continue Shopping
          </Link>
        </section>
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
      <main className="min-h-screen bg-[#0d0b08] px-6 py-28 text-[#f8f2e8]">
        <section className="mx-auto max-w-3xl rounded-[2.5rem] border border-white/10 bg-white/[0.03] p-8 md:p-12">
          <p className="text-sm uppercase tracking-[0.35em] text-[#d6b46a]">Order Not Found</p>

          <h1 className="mt-5 text-5xl font-light leading-tight tracking-[-0.04em] text-white md:text-7xl">
            We could not locate this order.
          </h1>

          <p className="mt-6 text-lg leading-8 text-white/60">
            The order may not exist, or the confirmation link may be incorrect.
          </p>

          <Link
            href="/products"
            className="mt-10 inline-flex justify-center rounded-full bg-[#d6b46a] px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-black transition hover:bg-[#f0cf82]"
          >
            Continue Shopping
          </Link>
        </section>
      </main>
    );
  }

  const address = order.address as {
    address?: string;
    city?: string;
    country?: string;
    postalCode?: string;
  };

  return (
    <main className="min-h-screen bg-[#0d0b08] px-6 py-28 text-[#f8f2e8]">
      <section className="mx-auto max-w-5xl">
        <div className="rounded-[2.5rem] border border-white/10 bg-white/[0.03] p-8 md:p-12">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-[#d6b46a]">
                Order Confirmation
              </p>

              <h1 className="mt-5 text-5xl font-light leading-tight tracking-[-0.04em] text-white md:text-7xl">
                Your private order is ready.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/60">
                {getStatusDescription(order.status)}
              </p>
            </div>

            <div className="rounded-2xl border border-[#d6b46a]/30 bg-[#d6b46a]/10 px-5 py-4">
              <p className="text-xs uppercase tracking-[0.25em] text-[#d6b46a]">Status</p>
              <p className="mt-2 text-white">{getStatusLabel(order.status)}</p>
            </div>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <p className="text-xs uppercase tracking-[0.25em] text-white/35">Order ID</p>
              <p className="mt-2 break-all text-sm text-white">{order.id}</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <p className="text-xs uppercase tracking-[0.25em] text-white/35">Customer</p>
              <p className="mt-2 text-sm text-white">
                {order.customer.firstName} {order.customer.lastName}
              </p>
              <p className="mt-1 text-sm text-white/50">{order.customer.email}</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <p className="text-xs uppercase tracking-[0.25em] text-white/35">Total</p>
              <p className="mt-2 text-2xl font-light text-white">
                {formatPrice(Number(order.subtotal), order.currency as "USD")}
              </p>
            </div>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_340px]">
            <div>
              <h2 className="text-2xl font-light text-white">Order Items</h2>

              <div className="mt-5 space-y-4">
                {order.items.map((item) => (
                  <article
                    key={item.id}
                    className="flex flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-black/20 p-5 md:flex-row md:items-center"
                  >
                    <div>
                      <p className="text-white">{item.name}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.2em] text-white/35">
                        SKU {item.productSku} · Qty {item.quantity}
                      </p>
                    </div>

                    <div className="text-left md:text-right">
                      <p className="text-sm text-white/45">
                        Unit {formatPrice(Number(item.unitPrice), order.currency as "USD")}
                      </p>
                      <p className="mt-1 text-lg text-white">
                        {formatPrice(Number(item.lineTotal), order.currency as "USD")}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <aside className="h-fit rounded-2xl border border-white/10 bg-black/20 p-5">
              <h2 className="text-2xl font-light text-white">Delivery Details</h2>

              <div className="mt-5 space-y-3 text-sm leading-6 text-white/55">
                <p>{address.address}</p>
                <p>
                  {address.city}, {address.postalCode}
                </p>
                <p>{address.country}</p>
              </div>

              <div className="mt-6 border-t border-white/10 pt-5">
                <p className="text-xs uppercase tracking-[0.25em] text-white/35">
                  Payment Reference
                </p>
                <p className="mt-2 break-all text-sm text-white/60">
                  {order.paymentRef || "Pending"}
                </p>
              </div>
            </aside>
          </div>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/products"
              className="inline-flex justify-center rounded-full bg-[#d6b46a] px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-black transition hover:bg-[#f0cf82]"
            >
              Continue Shopping
            </Link>

            <Link
              href="/"
              className="inline-flex justify-center rounded-full border border-white/20 px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:border-[#d6b46a] hover:text-[#d6b46a]"
            >
              Back Home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
