import Link from "next/link";

type SuccessPageProps = {
  searchParams: Promise<{
    orderId?: string;
  }>;
};

export const metadata = {
  title: "Order Created | LuxeCommerce",
  description: "Your LuxeCommerce order has been created.",
};

export default async function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const { orderId } = await searchParams;

  return (
    <main className="min-h-screen bg-[#0d0b08] px-6 py-28 text-[#f8f2e8]">
      <section className="mx-auto max-w-3xl rounded-[2.5rem] border border-white/10 bg-white/[0.03] p-8 md:p-12">
        <p className="text-sm uppercase tracking-[0.35em] text-[#d6b46a]">Order Created</p>

        <h1 className="mt-5 text-5xl font-light leading-tight tracking-[-0.04em] text-white md:text-7xl">
          Your private order is ready.
        </h1>

        <p className="mt-6 text-lg leading-8 text-white/60">
          The order has passed server-side price and stock validation. Stripe payment collection
          will be connected in the next phase.
        </p>

        {orderId ? (
          <div className="mt-8 rounded-2xl border border-[#d6b46a]/30 bg-[#d6b46a]/10 p-5">
            <p className="text-xs uppercase tracking-[0.25em] text-[#d6b46a]">Order ID</p>
            <p className="mt-2 break-all text-white">{orderId}</p>
          </div>
        ) : null}

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
      </section>
    </main>
  );
}
