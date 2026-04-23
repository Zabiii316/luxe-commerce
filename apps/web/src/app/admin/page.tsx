import Link from "next/link";
import { prisma } from "@luxe/database";
import { AdminShell } from "@/app/admin/_components/admin-shell";
import { MetricCard, StatusBadge, formatAdminDate } from "@/app/admin/_components/admin-ui";
import { formatPrice } from "@/lib/utils/money";

export const metadata = {
  title: "Admin Overview | LuxeCommerce",
  description: "LuxeCommerce admin dashboard overview.",
};

export default async function AdminPage() {
  const [productCount, orderCount, customerCount, recentOrders, revenueAggregate] =
    await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.customer.count(),
      prisma.order.findMany({
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
        include: {
          customer: true,
          items: true,
        },
      }),
      prisma.order.aggregate({
        where: {
          status: "PAID",
        },
        _sum: {
          subtotal: true,
        },
      }),
    ]);

  const paidRevenue = Number(revenueAggregate._sum.subtotal ?? 0);

  return (
    <AdminShell
      eyebrow="Admin Dashboard"
      title="Commerce control center."
      description="Monitor products, customers, orders, payment state, and operational commerce activity from one place."
    >
      <div className="grid gap-5 md:grid-cols-4">
        <MetricCard label="Products" value={productCount} helper="Active and managed catalogue records." />
        <MetricCard label="Orders" value={orderCount} helper="Total orders created in PostgreSQL." />
        <MetricCard label="Customers" value={customerCount} helper="Unique customer records." />
        <MetricCard label="Paid Revenue" value={formatPrice(paidRevenue)} helper="Revenue from PAID orders only." />
      </div>

      <div className="mt-10 rounded-[2rem] border border-[#e9d8dc] bg-white p-6 shadow-[0_14px_36px_rgba(179,19,43,0.05)]">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[#b3132b]">Recent Orders</p>
            <h2 className="mt-2 text-3xl font-light text-[#181818]">Latest activity</h2>
          </div>

          <Link
            href="/admin/orders"
            className="text-xs uppercase tracking-[0.22em] text-[#6b6b6b] transition hover:text-[#b3132b]"
          >
            View all
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[#e9d8dc] text-xs uppercase tracking-[0.2em] text-[#6b6b6b]">
                <th className="py-4 pr-4 font-normal">Order</th>
                <th className="py-4 pr-4 font-normal">Customer</th>
                <th className="py-4 pr-4 font-normal">Status</th>
                <th className="py-4 pr-4 font-normal">Total</th>
                <th className="py-4 pr-4 font-normal">Created</th>
              </tr>
            </thead>

            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-[#f3e5e8] text-sm text-[#6b6b6b]">
                  <td className="py-4 pr-4">
                    <Link href={`/admin/orders/${order.id}`} className="text-[#181818] transition hover:text-[#b3132b]">
                      {order.id}
                    </Link>
                  </td>
                  <td className="py-4 pr-4">{order.customer.email}</td>
                  <td className="py-4 pr-4"><StatusBadge status={order.status} /></td>
                  <td className="py-4 pr-4">{formatPrice(Number(order.subtotal), order.currency as "USD")}</td>
                  <td className="py-4 pr-4">{formatAdminDate(order.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
