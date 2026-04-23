import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@luxe/database";
import { AdminShell } from "@/app/admin/_components/admin-shell";
import { AdminTaxonomyForm } from "@/components/admin/admin-taxonomy-form";

type EditBrandPageProps = {
  searchParams: Promise<{
    id?: string;
  }>;
};

export const metadata = {
  title: "Edit Brand | LuxeCommerce Admin",
  description: "Edit a brand.",
};

export default async function EditBrandPage({ searchParams }: EditBrandPageProps) {
  const { id } = await searchParams;

  if (!id) {
    notFound();
  }

  const brand = await prisma.brand.findUnique({
    where: {
      id,
    },
  });

  if (!brand) {
    notFound();
  }

  return (
    <AdminShell
      eyebrow="Brand Management"
      title="Edit brand."
      description="Update the brand identity used across the product catalogue."
    >
      <div className="mb-8">
        <Link
          href="/admin/brands"
          className="text-sm uppercase tracking-[0.25em] text-[#6b6b6b] transition hover:text-[#b3132b]"
        >
          ← Back to brands
        </Link>
      </div>

      <AdminTaxonomyForm
        type="brand"
        mode="edit"
        initialValues={{
          id: brand.id,
          name: brand.name,
          slug: brand.slug,
        }}
      />
    </AdminShell>
  );
}
