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

      <div className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[#d6b46a]">Recent Orders</p>
            <h2 className="mt-2 text-3xl font-light text-white">Latest activity</h2>
          </div>

          <Link
            href="/admin/orders"
            className="text-xs uppercase tracking-[0.22em] text-white/45 transition hover:text-[#d6b46a]"
          >
            View all
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-[0.2em] text-white/35">
                <th className="py-4 pr-4 font-normal">Order</th>
                <th className="py-4 pr-4 font-normal">Customer</th>
                <th className="py-4 pr-4 font-normal">Status</th>
                <th className="py-4 pr-4 font-normal">Total</th>
                <th className="py-4 pr-4 font-normal">Created</th>
              </tr>
            </thead>

            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-white/10 text-sm text-white/65">
                  <td className="py-4 pr-4">
                    <Link href={`/admin/orders/${order.id}`} className="text-white transition hover:text-[#d6b46a]">
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
