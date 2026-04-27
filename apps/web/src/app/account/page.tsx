import Link from "next/link";
import { prisma } from "@luxe/database";
import { auth } from "@/auth";
import { AccountShell } from "@/components/account/account-shell";
import { formatPrice } from "@/lib/utils/money";

export const metadata = {
  title: "My Account | LuxeCommerce",
  description: "Your LuxeCommerce customer account dashboard.",
};

export default async function AccountPage() {
  const session = await auth();
  const email = session?.user?.email ?? "";

  const [customer, orders, paidAggregate] = await Promise.all([
    prisma.customer.findUnique({
      where: { email },
      select: {
        firstName: true,
        lastName: true,
        email: true,
      },
    }),
    prisma.order.findMany({
      where: {
        customer: {
          email,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
      include: {
        items: true,
      },
    }),
    prisma.order.aggregate({
      where: {
        customer: {
          email,
        },
        status: "PAID",
      },
      _sum: {
        subtotal: true,
      },
    }),
  ]);

  return (
    <AccountShell
      eyebrow="Customer Account"
      title="Your private dashboard."
      description="Track orders, review purchases, and manage your LuxeCommerce account."
    >
      <div className="grid gap-5 md:grid-cols-3">
        <MetricCard
          label="Customer"
          value={customer ? `${customer.firstName} ${customer.lastName}` : "—"}
          helper={customer?.email || ""}
        />
        <MetricCard
          label="Orders"
          value={String(orders.length)}
          helper="Recent orders loaded from your account."
        />
        <MetricCard
          label="Paid Total"
          value={formatPrice(Number(paidAggregate._sum.subtotal ?? 0))}
          helper="Value of PAID orders."
        />
      </div>

      <div className="mt-10 rounded-[2rem] border border-[#e9d8dc] bg-white p-6 shadow-[0_14px_36px_rgba(179,19,43,0.05)]">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[#b3132b]">Recent Orders</p>
            <h2 className="mt-2 text-3xl font-light text-[#181818]">Latest activity</h2>
          </div>

          <Link
            href="/account/orders"
            className="text-xs uppercase tracking-[0.22em] text-[#6b6b6b] transition hover:text-[#b3132b]"
          >
            View all
          </Link>
        </div>

        {orders.length === 0 ? (
          <p className="text-sm leading-7 text-[#6b6b6b]">
            No orders are attached to this account yet. Use the same email at checkout to connect
            future purchases automatically.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[#e9d8dc] text-xs uppercase tracking-[0.2em] text-[#6b6b6b]">
                  <th className="py-4 pr-4 font-normal">Order</th>
                  <th className="py-4 pr-4 font-normal">Items</th>
                  <th className="py-4 pr-4 font-normal">Status</th>
                  <th className="py-4 pr-4 font-normal">Total</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-[#f3e5e8] text-sm text-[#6b6b6b]">
                    <td className="py-4 pr-4">
                      <Link
                        href={`/account/orders/${order.id}`}
                        className="text-[#181818] transition hover:text-[#b3132b]"
                      >
                        {order.id}
                      </Link>
                    </td>
                    <td className="py-4 pr-4">{order.items.length}</td>
                    <td className="py-4 pr-4">{order.status.replaceAll("_", " ")}</td>
                    <td className="py-4 pr-4">
                      {formatPrice(Number(order.subtotal), order.currency as "USD")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AccountShell>
  );
}

function MetricCard({
  label,
  value,
  helper,
}: {
  label: string;
  value: string;
  helper?: string;
}) {
  return (
    <div className="rounded-[2rem] border border-[#e9d8dc] bg-white p-6 shadow-[0_14px_36px_rgba(179,19,43,0.05)]">
      <p className="text-xs uppercase tracking-[0.25em] text-[#6b6b6b]">{label}</p>
      <p className="mt-4 text-3xl font-light text-[#181818]">{value}</p>
      {helper ? <p className="mt-3 text-sm leading-6 text-[#6b6b6b]">{helper}</p> : null}
    </div>
  );
}
