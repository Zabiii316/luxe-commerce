import Link from "next/link";
import { AdminShell } from "@/app/admin/_components/admin-shell";
import { AdminTaxonomyForm } from "@/components/admin/admin-taxonomy-form";

export const metadata = {
  title: "New Brand | LuxeCommerce Admin",
  description: "Create a new brand.",
};

export default function NewBrandPage() {
  return (
    <AdminShell
      eyebrow="Brand Management"
      title="Create brand."
      description="Add a new brand for structured product merchandising."
    >
      <div className="mb-8">
        <Link
          href="/admin/brands"
          className="text-sm uppercase tracking-[0.25em] text-[#6b6b6b] transition hover:text-[#b3132b]"
        >
          ← Back to brands
        </Link>
      </div>

      <AdminTaxonomyForm type="brand" mode="create" />
    </AdminShell>
  );
}
