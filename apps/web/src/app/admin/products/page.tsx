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
      description="View catalogue records, pricing, stock, product status, brand, and category information."
    >
      <div className="overflow-x-auto rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
        <table className="w-full min-w-[920px] border-collapse text-left">
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase tracking-[0.2em] text-white/35">
              <th className="py-4 pr-4 font-normal">Product</th>
              <th className="py-4 pr-4 font-normal">Brand</th>
              <th className="py-4 pr-4 font-normal">Category</th>
              <th className="py-4 pr-4 font-normal">Price</th>
              <th className="py-4 pr-4 font-normal">Stock</th>
              <th className="py-4 pr-4 font-normal">Status</th>
              <th className="py-4 pr-4 font-normal">Storefront</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr key={product.sku} className="border-b border-white/10 text-sm text-white/65">
                <td className="py-4 pr-4">
                  <p className="text-white">{product.name}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-white/35">{product.sku}</p>
                </td>
                <td className="py-4 pr-4">{product.brand.name}</td>
                <td className="py-4 pr-4">{product.category.name}</td>
                <td className="py-4 pr-4">{formatPrice(Number(product.basePrice), product.currency as "USD")}</td>
                <td className="py-4 pr-4">{product.stock}</td>
                <td className="py-4 pr-4">{product.status}</td>
                <td className="py-4 pr-4">
                  <Link
                    href={`/products/${product.slug}`}
                    className="text-xs uppercase tracking-[0.2em] text-[#d6b46a] transition hover:text-[#f0cf82]"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
