import { CustomerLoginForm } from "@/components/account/customer-login-form";

export const metadata = {
  title: "Customer Login | LuxeCommerce",
  description: "Sign in to your LuxeCommerce customer account.",
};

export default function CustomerLoginPage() {
  return (
    <main className="min-h-screen bg-[#faf7f8] px-6 py-28 text-[#181818]">
      <section className="mx-auto max-w-xl rounded-[2.5rem] border border-[#e9d8dc] bg-white p-8 shadow-[0_18px_50px_rgba(179,19,43,0.06)] md:p-12">
        <p className="text-sm uppercase tracking-[0.35em] text-[#b3132b]">Customer Access</p>
        <h1 className="mt-5 text-5xl font-light leading-tight tracking-[-0.04em] text-[#181818] md:text-6xl">
          Sign in to your account.
        </h1>
        <p className="mt-6 text-lg leading-8 text-[#6b6b6b]">
          View orders, review purchases, and access your customer dashboard.
        </p>

        <CustomerLoginForm />
      </section>
    </main>
  );
}
