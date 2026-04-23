import Link from "next/link";
import type { ReactNode } from "react";
import { auth, signOut } from "@/auth";

type AdminShellProps = {
  title: string;
  eyebrow: string;
  description?: string;
  children: ReactNode;
};

export async function AdminShell({ title, eyebrow, description, children }: AdminShellProps) {
  const session = await auth();

  return (
    <main className="min-h-screen bg-[#faf7f8] px-6 py-28 text-[#181818]">
      <section className="mx-auto max-w-7xl">
        <div className="mb-10 rounded-[2rem] border border-[#e9d8dc] bg-white p-6 shadow-[0_18px_50px_rgba(179,19,43,0.06)] md:p-8">
          <div className="flex flex-col justify-between gap-6 border-b border-[#e9d8dc] pb-8 md:flex-row md:items-end">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-[#b3132b]">{eyebrow}</p>

              <h1 className="mt-5 text-5xl font-light tracking-[-0.04em] text-[#181818] md:text-7xl">
                {title}
              </h1>

              {description ? (
                <p className="mt-5 max-w-3xl text-lg leading-8 text-[#6b6b6b]">{description}</p>
              ) : null}
            </div>

            <div className="flex flex-col items-start gap-4 md:items-end">
              <nav className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.22em] text-[#6b6b6b]">
                <AdminNavLink href="/admin">Overview</AdminNavLink>
                <AdminNavLink href="/admin/products">Products</AdminNavLink>
                <AdminNavLink href="/admin/orders">Orders</AdminNavLink>
                <AdminNavLink href="/admin/brands">Brands</AdminNavLink>
                <AdminNavLink href="/admin/categories">Categories</AdminNavLink>
              </nav>

              <div className="flex items-center gap-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[#6b6b6b]">
                  {session?.user?.email}
                </p>

                <form
                  action={async () => {
                    "use server";
                    await signOut({ redirectTo: "/login" });
                  }}
                >
                  <button
                    type="submit"
                    className="rounded-full border border-[#e9d8dc] bg-white px-4 py-2 text-xs uppercase tracking-[0.2em] text-[#6b6b6b] transition hover:border-[#b3132b] hover:text-[#b3132b]"
                  >
                    Sign Out
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="pt-8">{children}</div>
        </div>
      </section>
    </main>
  );
}

function AdminNavLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-full border border-[#e9d8dc] bg-white px-5 py-3 transition hover:border-[#b3132b] hover:text-[#b3132b]"
    >
      {children}
    </Link>
  );
}
