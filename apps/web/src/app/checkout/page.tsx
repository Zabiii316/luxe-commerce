import { CheckoutForm } from "@/components/checkout/checkout-form";

export const metadata = {
  title: "Checkout | LuxeCommerce",
  description: "Secure checkout for your LuxeCommerce private selection.",
};

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-[#0d0b08] px-6 py-28 text-[#f8f2e8]">
      <section className="mx-auto max-w-7xl">
        <CheckoutForm />
      </section>
    </main>
  );
}
