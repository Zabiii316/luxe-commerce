import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@luxe/database";
import { auth } from "@/auth";
import { AccountShell } from "@/components/account/account-shell";
import { formatPrice } from "@/lib/utils/money";

type AccountOrderDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({ params }: AccountOrderDetailsPageProps) {
  const { id } = await params;

  return {
    title: `Order ${id} | My Account`,
  };
}

export default async function AccountOrderDetailsPage({
  params,
}: AccountOrderDetailsPageProps) {
  const { id } = await params;
  const session = await auth();
  const email = session?.user?.email ?? "";

  const order = await prisma.order.findFirst({
    where: {
      id,
      customer: {
        email,
      },
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
    <AccountShell
      eyebrow="Order Details"
      title="Your order."
      description="Full order record connected to your account."
    >
      <div className="mb-8">
        <Link
          href="/account/orders"
          className="text-sm uppercase tracking-[0.25em] text-[#6b6b6b] transition hover:text-[#b3132b]"
        >
          ← Back to orders
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-4">
          {order.items.map((item) => (
            <article
              key={item.id}
              className="rounded-[2rem] border border-[#e9d8dc] bg-white p-6 shadow-[0_14px_36px_rgba(179,19,43,0.05)]"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-lg text-[#181818]">{item.name}</p>
                  <p className="mt-1 text-sm text-[#6b6b6b]">
                    SKU {item.productSku} · Qty {item.quantity}
                  </p>
                </div>

                <p className="text-lg text-[#181818]">
                  {formatPrice(Number(item.lineTotal), order.currency as "USD")}
                </p>
              </div>
            </article>
          ))}
        </div>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-[#e9d8dc] bg-white p-6 shadow-[0_14px_36px_rgba(179,19,43,0.05)]">
            <p className="text-xs uppercase tracking-[0.25em] text-[#6b6b6b]">Order ID</p>
            <p className="mt-2 break-all text-sm text-[#181818]">{order.id}</p>

            <p className="mt-5 text-xs uppercase tracking-[0.25em] text-[#6b6b6b]">Status</p>
            <p className="mt-2 text-sm text-[#181818]">{order.status.replaceAll("_", " ")}</p>

            <p className="mt-5 text-xs uppercase tracking-[0.25em] text-[#6b6b6b]">Total</p>
            <p className="mt-2 text-xl text-[#181818]">
              {formatPrice(Number(order.subtotal), order.currency as "USD")}
            </p>
          </div>

          <div className="rounded-[2rem] border border-[#e9d8dc] bg-white p-6 shadow-[0_14px_36px_rgba(179,19,43,0.05)]">
            <p className="text-xs uppercase tracking-[0.25em] text-[#6b6b6b]">Delivery</p>
            <div className="mt-4 space-y-2 text-sm leading-6 text-[#6b6b6b]">
              <p>{address.address}</p>
              <p>{address.city}, {address.postalCode}</p>
              <p>{address.country}</p>
            </div>
          </div>
        </aside>
      </div>
    </AccountShell>
  );
}
