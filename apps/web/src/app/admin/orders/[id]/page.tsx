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
          className="text-sm uppercase tracking-[0.25em] text-[#6b6b6b] transition hover:text-[#b3132b]"
        >
          ← Back to orders
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-[#e9d8dc] bg-white p-6 shadow-[0_14px_36px_rgba(179,19,43,0.05)]">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-[#6b6b6b]">Order ID</p>
                <p className="mt-2 break-all text-[#181818]">{order.id}</p>
              </div>

              <StatusBadge status={order.status} />
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <InfoCard label="Created" value={formatAdminDate(order.createdAt)} />
              <InfoCard label="Total" value={formatPrice(Number(order.subtotal), order.currency as "USD")} />
              <InfoCard label="Currency" value={order.currency} />
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#e9d8dc] bg-white p-6 shadow-[0_14px_36px_rgba(179,19,43,0.05)]">
            <h2 className="text-2xl font-light text-[#181818]">Items</h2>

            <div className="mt-5 space-y-4">
              {order.items.map((item) => (
                <article
                  key={item.id}
                  className="flex flex-col justify-between gap-4 rounded-2xl border border-[#e9d8dc] bg-[#faf7f8] p-5 md:flex-row md:items-center"
                >
                  <div>
                    <p className="text-[#181818]">{item.name}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[#6b6b6b]">
                      SKU {item.productSku} · Quantity {item.quantity}
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
        </div>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-[#e9d8dc] bg-white p-6 shadow-[0_14px_36px_rgba(179,19,43,0.05)]">
            <h2 className="text-2xl font-light text-[#181818]">Customer</h2>

            <div className="mt-5 space-y-2 text-sm leading-6 text-[#6b6b6b]">
              <p>{order.customer.firstName} {order.customer.lastName}</p>
              <p>{order.customer.email}</p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#e9d8dc] bg-white p-6 shadow-[0_14px_36px_rgba(179,19,43,0.05)]">
            <h2 className="text-2xl font-light text-[#181818]">Delivery</h2>

            <div className="mt-5 space-y-2 text-sm leading-6 text-[#6b6b6b]">
              <p>{address.address}</p>
              <p>{address.city}, {address.postalCode}</p>
              <p>{address.country}</p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#e9d8dc] bg-white p-6 shadow-[0_14px_36px_rgba(179,19,43,0.05)]">
            <h2 className="text-2xl font-light text-[#181818]">Payment</h2>

            <p className="mt-5 break-all text-sm leading-6 text-[#6b6b6b]">
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
    <div className="rounded-2xl border border-[#e9d8dc] bg-[#faf7f8] p-5">
      <p className="text-xs uppercase tracking-[0.25em] text-[#6b6b6b]">{label}</p>
      <p className="mt-2 text-sm text-[#181818]">{value}</p>
    </div>
  );
}
