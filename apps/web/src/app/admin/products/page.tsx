import Link from "next/link";
import { prisma } from "@luxe/database";
import { AdminShell } from "@/app/admin/_components/admin-shell";
import { formatPrice } from "@/lib/utils/money";

export const metadata = {
  title: "Admin Products | LuxeCommerce",
  description: "Manage LuxeCommerce products.",
};

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      brand: true,
      category: true,
    },
  });

  return (
    <AdminShell
      eyebrow="Product Operations"
      title="Product catalogue."
      description="View, create, and edit catalogue records, pricing, stock, product status, brand, and category information."
    >
      <div className="mb-6 flex justify-end">
        <Link
          href="/admin/products/new"
          className="rounded-full bg-[#b3132b] px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#8e1023]"
        >
          New Product
        </Link>
      </div>

      <div className="overflow-x-auto rounded-[2rem] border border-[#e9d8dc] bg-white p-6 shadow-[0_14px_36px_rgba(179,19,43,0.05)]">
        <table className="w-full min-w-[980px] border-collapse text-left">
          <thead>
            <tr className="border-b border-[#e9d8dc] text-xs uppercase tracking-[0.2em] text-[#6b6b6b]">
              <th className="py-4 pr-4 font-normal">Product</th>
              <th className="py-4 pr-4 font-normal">Brand</th>
              <th className="py-4 pr-4 font-normal">Category</th>
              <th className="py-4 pr-4 font-normal">Price</th>
              <th className="py-4 pr-4 font-normal">Stock</th>
              <th className="py-4 pr-4 font-normal">Status</th>
              <th className="py-4 pr-4 font-normal">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr key={product.sku} className="border-b border-[#f3e5e8] text-sm text-[#6b6b6b]">
                <td className="py-4 pr-4">
                  <p className="text-[#181818]">{product.name}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[#6b6b6b]">
                    {product.sku}
                  </p>
                </td>
                <td className="py-4 pr-4">{product.brand.name}</td>
                <td className="py-4 pr-4">{product.category.name}</td>
                <td className="py-4 pr-4">
                  {formatPrice(Number(product.basePrice), product.currency as "USD")}
                </td>
                <td className="py-4 pr-4">{product.stock}</td>
                <td className="py-4 pr-4">{product.status}</td>
                <td className="py-4 pr-4">
                  <div className="flex gap-4">
                    <Link
                      href={`/products/${product.slug}`}
                      className="text-xs uppercase tracking-[0.2em] text-[#6b6b6b] transition hover:text-[#b3132b]"
                    >
                      View
                    </Link>

                    <Link
                      href={`/admin/products/${product.sku}/edit`}
                      className="text-xs uppercase tracking-[0.2em] text-[#b3132b] transition hover:text-[#8e1023]"
                    >
                      Edit
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
