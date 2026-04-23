import { Suspense } from "react";
import { PaymentClient } from "@/components/payment/payment-client";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";

export const metadata = {
  title: "Payment | LuxeCommerce",
  description: "Secure Stripe payment for your LuxeCommerce order.",
};

export default function PaymentPage() {
  return (
    <main className="min-h-screen bg-white text-[#181818]">
      <Navbar />

      <section className="px-6 py-28 pt-32">
        <Suspense
          fallback={
            <div className="mx-auto max-w-3xl rounded-[2.5rem] border border-[#e9d8dc] bg-white p-8 text-[#181818]">
              Preparing payment...
            </div>
          }
        >
          <PaymentClient />
        </Suspense>
      </section>

      <Footer />
    </main>
  );
}
