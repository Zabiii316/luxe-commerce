import { LoginForm } from "@/components/auth/login-form";

export const metadata = {
  title: "Admin Login | LuxeCommerce",
  description: "Secure admin login for LuxeCommerce.",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#0d0b08] px-6 py-28 text-[#f8f2e8]">
      <section className="mx-auto max-w-xl rounded-[2.5rem] border border-white/10 bg-white/[0.03] p-8 md:p-12">
        <p className="text-sm uppercase tracking-[0.35em] text-[#d6b46a]">Admin Access</p>

        <h1 className="mt-5 text-5xl font-light leading-tight tracking-[-0.04em] text-white md:text-6xl">
          Sign in to the control center.
        </h1>

        <p className="mt-6 text-lg leading-8 text-white/60">
          This login protects product, order, and operational management routes.
        </p>

        <LoginForm />
      </section>
    </main>
  );
}
