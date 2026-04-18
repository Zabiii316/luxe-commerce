import { Suspense } from "react";
import { PaymentClient } from "@/components/payment/payment-client";

export const metadata = {
  title: "Payment | LuxeCommerce",
  description: "Secure Stripe payment for your LuxeCommerce order.",
};

export default function PaymentPage() {
  return (
    <main className="min-h-screen bg-[#0d0b08] px-6 py-28 text-[#f8f2e8]">
      <Suspense
        fallback={
          <div className="mx-auto max-w-3xl rounded-[2.5rem] border border-white/10 bg-white/[0.03] p-8 text-white">
            Preparing payment...
          </div>
        }
      >
        <PaymentClient />
      </Suspense>
    </main>
  );
}
