import { CheckoutForm } from "@/components/checkout/checkout-form";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";

export const metadata = {
  title: "Checkout | LuxeCommerce",
  description: "Secure checkout for your LuxeCommerce private selection.",
};

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-white text-[#181818]">
      <Navbar />

      <section className="px-6 py-28 pt-32">
        <div className="mx-auto max-w-7xl">
          <CheckoutForm />
        </div>
      </section>

      <Footer />
    </main>
  );
}
