import Link from "next/link";
import { AdminShell } from "@/app/admin/_components/admin-shell";
import { AdminTaxonomyForm } from "@/components/admin/admin-taxonomy-form";

export const metadata = {
  title: "New Category | LuxeCommerce Admin",
  description: "Create a new category.",
};

export default function NewCategoryPage() {
  return (
    <AdminShell
      eyebrow="Category Management"
      title="Create category."
      description="Add a new category for structured storefront merchandising."
    >
      <div className="mb-8">
        <Link
          href="/admin/categories"
          className="text-sm uppercase tracking-[0.25em] text-[#6b6b6b] transition hover:text-[#b3132b]"
        >
          ← Back to categories
        </Link>
      </div>

      <AdminTaxonomyForm type="category" mode="create" />
    </AdminShell>
  );
}
