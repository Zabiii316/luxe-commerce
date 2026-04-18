import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@luxe/database";
import { AdminShell } from "@/app/admin/_components/admin-shell";
import { StatusBadge, formatAdminDate } from "@/app/admin/_components/admin-ui";
import { formatPrice } from "@/lib/utils/money";

type OrderDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({ params }: OrderDetailsPageProps) {
  const { id } = await params;

  return {
    title: `Order ${id} | LuxeCommerce Admin`,
  };
}

export default async function AdminOrderDetailsPage({ params }: OrderDetailsPageProps) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: {
      id,
    },
    include: {
      customer: true,
      items: true,
    },
  });

  if (!order) {
    notFound();
  }

  const address = order.address as {
    address?: string;
    city?: string;
    country?: string;
    postalCode?: string;
  };

  return (
    <AdminShell
      eyebrow="Order Details"
      title="Order record."
      description="Detailed order record loaded directly from PostgreSQL."
    >
      <div className="mb-8">
        <Link
          href="/admin/orders"
          className="text-sm uppercase tracking-[0.25em] text-white/45 transition hover:text-[#d6b46a]"
        >
          ← Back to orders
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-white/35">Order ID</p>
                <p className="mt-2 break-all text-white">{order.id}</p>
              </div>

              <StatusBadge status={order.status} />
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <InfoCard label="Created" value={formatAdminDate(order.createdAt)} />
              <InfoCard label="Total" value={formatPrice(Number(order.subtotal), order.currency as "USD")} />
              <InfoCard label="Currency" value={order.currency} />
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-2xl font-light text-white">Items</h2>

            <div className="mt-5 space-y-4">
              {order.items.map((item) => (
                <article
                  key={item.id}
                  className="flex flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-black/20 p-5 md:flex-row md:items-center"
                >
                  <div>
                    <p className="text-white">{item.name}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-white/35">
                      SKU {item.productSku} · Quantity {item.quantity}
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
        </div>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-2xl font-light text-white">Customer</h2>

            <div className="mt-5 space-y-2 text-sm leading-6 text-white/60">
              <p>{order.customer.firstName} {order.customer.lastName}</p>
              <p>{order.customer.email}</p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-2xl font-light text-white">Delivery</h2>

            <div className="mt-5 space-y-2 text-sm leading-6 text-white/60">
              <p>{address.address}</p>
              <p>{address.city}, {address.postalCode}</p>
              <p>{address.country}</p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-2xl font-light text-white">Payment</h2>

            <p className="mt-5 break-all text-sm leading-6 text-white/60">
              {order.paymentRef || "Payment reference pending"}
            </p>
          </div>
        </aside>
      </div>
    </AdminShell>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
      <p className="text-xs uppercase tracking-[0.25em] text-white/35">{label}</p>
      <p className="mt-2 text-sm text-white">{value}</p>
    </div>
  );
}
