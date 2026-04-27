import { CustomerRegisterForm } from "@/components/account/customer-register-form";

export const metadata = {
  title: "Create Account | LuxeCommerce",
  description: "Create your LuxeCommerce customer account.",
};

export default function CustomerRegisterPage() {
  return (
    <main className="min-h-screen bg-[#faf7f8] px-6 py-28 text-[#181818]">
      <section className="mx-auto max-w-xl rounded-[2.5rem] border border-[#e9d8dc] bg-white p-8 shadow-[0_18px_50px_rgba(179,19,43,0.06)] md:p-12">
        <p className="text-sm uppercase tracking-[0.35em] text-[#b3132b]">Customer Access</p>
        <h1 className="mt-5 text-5xl font-light leading-tight tracking-[-0.04em] text-[#181818] md:text-6xl">
          Create your account.
        </h1>
        <p className="mt-6 text-lg leading-8 text-[#6b6b6b]">
          Register with the same email you use at checkout to connect your orders automatically.
        </p>

        <CustomerRegisterForm />
      </section>
    </main>
  );
}
