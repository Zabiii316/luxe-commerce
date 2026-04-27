import Link from "next/link";
import { prisma } from "@luxe/database";
import { AdminShell } from "@/app/admin/_components/admin-shell";
import { StatusBadge, formatAdminDate } from "@/app/admin/_components/admin-ui";
import { formatPrice } from "@/lib/utils/money";

export const metadata = {
  title: "Admin Orders | LuxeCommerce",
  description: "View LuxeCommerce orders.",
};

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
      description="Review customer orders, discounts, payment state, totals, item counts, and payment references."
    >
      <div className="overflow-x-auto rounded-[2rem] border border-[#e9d8dc] bg-white p-6 shadow-[0_14px_36px_rgba(179,19,43,0.05)]">
        <table className="w-full min-w-[1180px] border-collapse text-left">
          <thead>
            <tr className="border-b border-[#e9d8dc] text-xs uppercase tracking-[0.2em] text-[#6b6b6b]">
              <th className="py-4 pr-4 font-normal">Order</th>
              <th className="py-4 pr-4 font-normal">Customer</th>
              <th className="py-4 pr-4 font-normal">Status</th>
              <th className="py-4 pr-4 font-normal">Items</th>
              <th className="py-4 pr-4 font-normal">Subtotal</th>
              <th className="py-4 pr-4 font-normal">Discount</th>
              <th className="py-4 pr-4 font-normal">Total</th>
              <th className="py-4 pr-4 font-normal">Created</th>
              <th className="py-4 pr-4 font-normal">Details</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => {
              const subtotal = Number(order.subtotal);
              const discountAmount = Number(order.discountAmount);
              const total = Number(order.total);
              const displayTotal = getDisplayTotal({ subtotal, discountAmount, total });

              return (
                <tr key={order.id} className="border-b border-[#f3e5e8] text-sm text-[#6b6b6b]">
                  <td className="py-4 pr-4">
                    <p className="max-w-[220px] truncate text-[#181818]">{order.id}</p>
                    <p className="mt-1 max-w-[220px] truncate text-xs text-[#6b6b6b]">
                      {order.paymentRef || "No payment ref"}
                    </p>
                  </td>
                  <td className="py-4 pr-4">
                    <p>{order.customer.firstName} {order.customer.lastName}</p>
                    <p className="mt-1 text-xs text-[#6b6b6b]">{order.customer.email}</p>
                  </td>
                  <td className="py-4 pr-4"><StatusBadge status={order.status} /></td>
                  <td className="py-4 pr-4">{order.items.length}</td>
                  <td className="py-4 pr-4">{formatPrice(subtotal, order.currency as "USD")}</td>
                  <td className="py-4 pr-4">
                    {order.discountCode
                      ? `-${formatPrice(discountAmount, order.currency as "USD")} (${order.discountCode})`
                      : "—"}
                  </td>
                  <td className="py-4 pr-4">{formatPrice(displayTotal, order.currency as "USD")}</td>
                  <td className="py-4 pr-4">{formatAdminDate(order.createdAt)}</td>
                  <td className="py-4 pr-4">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-xs uppercase tracking-[0.2em] text-[#b3132b] transition hover:text-[#8e1023]"
                    >
                      Open
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
