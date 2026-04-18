import { prisma } from "@luxe/database";
import { AdminShell } from "@/app/admin/_components/admin-shell";
import { AdminProductForm } from "@/components/admin/admin-product-form";

export const metadata = {
  title: "New Product | LuxeCommerce Admin",
  description: "Create a new LuxeCommerce product.",
};

export default async function NewProductPage() {
  const [brands, categories] = await Promise.all([
    prisma.brand.findMany({
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
      },
    }),
    prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
      },
    }),
  ]);

  return (
    <AdminShell
      eyebrow="Product Operations"
      title="Create product."
      description="Add a new luxury product to the PostgreSQL catalogue."
    >
      <AdminProductForm mode="create" brands={brands} categories={categories} />
    </AdminShell>
  );
}
