import Link from "next/link";
import { prisma } from "@luxe/database";
import { AdminShell } from "@/app/admin/_components/admin-shell";
import { StatusBadge, formatAdminDate } from "@/app/admin/_components/admin-ui";
import { formatPrice } from "@/lib/utils/money";

export const metadata = {
  title: "Admin Orders | LuxeCommerce",
  description: "View LuxeCommerce orders.",
};

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      customer: true,
      items: true,
    },
  });

  return (
    <AdminShell
      eyebrow="Order Operations"
      title="Orders."
      description="Review customer orders, payment status, order totals, item counts, and payment references."
    >
      <div className="overflow-x-auto rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
        <table className="w-full min-w-[980px] border-collapse text-left">
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase tracking-[0.2em] text-white/35">
              <th className="py-4 pr-4 font-normal">Order</th>
              <th className="py-4 pr-4 font-normal">Customer</th>
              <th className="py-4 pr-4 font-normal">Status</th>
              <th className="py-4 pr-4 font-normal">Items</th>
              <th className="py-4 pr-4 font-normal">Total</th>
              <th className="py-4 pr-4 font-normal">Created</th>
              <th className="py-4 pr-4 font-normal">Details</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-white/10 text-sm text-white/65">
                <td className="py-4 pr-4">
                  <p className="max-w-[240px] truncate text-white">{order.id}</p>
                  <p className="mt-1 max-w-[240px] truncate text-xs text-white/35">
                    {order.paymentRef || "No payment ref"}
                  </p>
                </td>
                <td className="py-4 pr-4">
                  <p>{order.customer.firstName} {order.customer.lastName}</p>
                  <p className="mt-1 text-xs text-white/35">{order.customer.email}</p>
                </td>
                <td className="py-4 pr-4"><StatusBadge status={order.status} /></td>
                <td className="py-4 pr-4">{order.items.length}</td>
                <td className="py-4 pr-4">{formatPrice(Number(order.subtotal), order.currency as "USD")}</td>
                <td className="py-4 pr-4">{formatAdminDate(order.createdAt)}</td>
                <td className="py-4 pr-4">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="text-xs uppercase tracking-[0.2em] text-[#d6b46a] transition hover:text-[#f0cf82]"
                  >
                    Open
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
