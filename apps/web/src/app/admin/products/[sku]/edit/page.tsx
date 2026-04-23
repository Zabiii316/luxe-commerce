import Link from "next/link";
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
      description="Update pricing, stock, taxonomy, product status, and premium storefront content."
    >
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <Link
          href="/admin/products"
          className="text-sm uppercase tracking-[0.25em] text-[#6b6b6b] transition hover:text-[#b3132b]"
        >
          ← Back to products
        </Link>

        <Link
          href={`/products/${product.slug}`}
          className="text-sm uppercase tracking-[0.25em] text-[#b3132b] transition hover:text-[#8e1023]"
        >
          View storefront page
        </Link>
      </div>

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
