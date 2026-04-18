import Link from "next/link";
import type { ReactNode } from "react";

type AdminShellProps = {
  title: string;
  eyebrow: string;
  description?: string;
  children: ReactNode;
};

export function AdminShell({ title, eyebrow, description, children }: AdminShellProps) {
  return (
    <main className="min-h-screen bg-[#0d0b08] px-6 py-28 text-[#f8f2e8]">
      <section className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col justify-between gap-6 border-b border-white/10 pb-8 md:flex-row md:items-end">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-[#d6b46a]">{eyebrow}</p>

            <h1 className="mt-5 text-5xl font-light tracking-[-0.04em] text-white md:text-7xl">
              {title}
            </h1>

            {description ? (
              <p className="mt-5 max-w-3xl text-lg leading-8 text-white/60">{description}</p>
            ) : null}
          </div>

          <nav className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.22em] text-white/60">
            <AdminNavLink href="/admin">Overview</AdminNavLink>
            <AdminNavLink href="/admin/products">Products</AdminNavLink>
            <AdminNavLink href="/admin/orders">Orders</AdminNavLink>
          </nav>
        </div>

        {children}
      </section>
    </main>
  );
}

function AdminNavLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-full border border-white/10 px-5 py-3 transition hover:border-[#d6b46a] hover:text-[#d6b46a]"
    >
      {children}
    </Link>
  );
}
