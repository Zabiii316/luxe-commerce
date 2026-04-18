import { notFound } from "next/navigation";
import { prisma } from "@luxe/database";
import { AdminShell } from "@/app/admin/_components/admin-shell";
import { AdminProductForm } from "@/components/admin/admin-product-form";

type EditProductPageProps = {
  params: Promise<{
    sku: string;
  }>;
};

export async function generateMetadata({ params }: EditProductPageProps) {
  const { sku } = await params;

  return {
    title: `Edit ${sku} | LuxeCommerce Admin`,
  };
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { sku } = await params;

  const [product, brands, categories] = await Promise.all([
    prisma.product.findUnique({
      where: {
        sku,
      },
    }),
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

  if (!product) {
    notFound();
  }

  return (
    <AdminShell
      eyebrow="Product Operations"
      title="Edit product."
      description="Update pricing, stock, status, and editorial product details."
    >
      <AdminProductForm
        mode="edit"
        brands={brands}
        categories={categories}
        initialValues={{
          sku: product.sku,
          name: product.name,
          slug: product.slug,
          brandId: product.brandId,
          categoryId: product.categoryId,
          basePrice: Number(product.basePrice),
          comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
          currency: product.currency as "USD",
          shortDescription: product.shortDescription,
          description: product.description,
          materials: product.materials,
          features: product.features,
          images: product.images,
          has360Viewer: product.has360Viewer,
          stock: product.stock,
          status: product.status,
        }}
      />
    </AdminShell>
  );
}
