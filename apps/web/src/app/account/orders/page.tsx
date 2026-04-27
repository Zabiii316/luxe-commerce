import Link from "next/link";
import { prisma } from "@luxe/database";
import { auth } from "@/auth";
import { AccountShell } from "@/components/account/account-shell";
import { formatPrice } from "@/lib/utils/money";

export const metadata = {
  title: "My Orders | LuxeCommerce",
  description: "View your LuxeCommerce orders.",
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

export default async function AccountOrdersPage() {
  const session = await auth();
  const email = session?.user?.email ?? "";

  const orders = await prisma.order.findMany({
    where: {
      customer: {
        email,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      items: true,
    },
  });

  return (
    <AccountShell
      eyebrow="Customer Orders"
      title="Your order history."
      description="Review every order connected to your account email."
    >
      <div className="overflow-x-auto rounded-[2rem] border border-[#e9d8dc] bg-white p-6 shadow-[0_14px_36px_rgba(179,19,43,0.05)]">
        <table className="w-full min-w-[1080px] border-collapse text-left">
          <thead>
            <tr className="border-b border-[#e9d8dc] text-xs uppercase tracking-[0.2em] text-[#6b6b6b]">
              <th className="py-4 pr-4 font-normal">Order</th>
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
                  <td className="py-4 pr-4 text-[#181818]">{order.id}</td>
                  <td className="py-4 pr-4">{order.status.replaceAll("_", " ")}</td>
                  <td className="py-4 pr-4">{order.items.length}</td>
                  <td className="py-4 pr-4">{formatPrice(subtotal, order.currency as "USD")}</td>
                  <td className="py-4 pr-4">
                    {order.discountCode
                      ? `-${formatPrice(discountAmount, order.currency as "USD")} (${order.discountCode})`
                      : "—"}
                  </td>
                  <td className="py-4 pr-4">{formatPrice(displayTotal, order.currency as "USD")}</td>
                  <td className="py-4 pr-4">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 pr-4">
                    <Link
                      href={`/account/orders/${order.id}`}
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
    </AccountShell>
  );
}
