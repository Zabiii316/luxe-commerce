import { LoginForm } from "@/components/auth/login-form";

export const metadata = {
  title: "Admin Login | LuxeCommerce",
  description: "Secure admin login for LuxeCommerce.",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#faf7f8] px-6 py-28 text-[#181818]">
      <section className="mx-auto max-w-xl rounded-[2.5rem] border border-[#e9d8dc] bg-white p-8 shadow-[0_18px_50px_rgba(179,19,43,0.06)] md:p-12">
        <p className="text-sm uppercase tracking-[0.35em] text-[#b3132b]">Admin Access</p>

        <h1 className="mt-5 text-5xl font-light leading-tight tracking-[-0.04em] text-[#181818] md:text-6xl">
          Sign in to the control center.
        </h1>

        <p className="mt-6 text-lg leading-8 text-[#6b6b6b]">
          This login protects product, order, and operational management routes.
        </p>

        <LoginForm />
      </section>
    </main>
  );
}
