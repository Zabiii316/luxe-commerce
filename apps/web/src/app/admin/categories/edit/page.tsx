import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@luxe/database";
import { AdminShell } from "@/app/admin/_components/admin-shell";
import { AdminTaxonomyForm } from "@/components/admin/admin-taxonomy-form";

type EditCategoryPageProps = {
  searchParams: Promise<{
    id?: string;
  }>;
};

export const metadata = {
  title: "Edit Category | LuxeCommerce Admin",
  description: "Edit a category.",
};

export default async function EditCategoryPage({ searchParams }: EditCategoryPageProps) {
  const { id } = await searchParams;

  if (!id) {
    notFound();
  }

  const category = await prisma.category.findUnique({
    where: {
      id,
    },
  });

  if (!category) {
    notFound();
  }

  return (
    <AdminShell
      eyebrow="Category Management"
      title="Edit category."
      description="Update the category structure used across the storefront."
    >
      <div className="mb-8">
        <Link
          href="/admin/categories"
          className="text-sm uppercase tracking-[0.25em] text-[#6b6b6b] transition hover:text-[#b3132b]"
        >
          ← Back to categories
        </Link>
      </div>

      <AdminTaxonomyForm
        type="category"
        mode="edit"
        initialValues={{
          id: category.id,
          name: category.name,
          slug: category.slug,
        }}
      />
    </AdminShell>
  );
}
