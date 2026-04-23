import Link from "next/link";
import { prisma } from "@luxe/database";
import { AdminShell } from "@/app/admin/_components/admin-shell";

export const metadata = {
  title: "Admin Categories | LuxeCommerce",
  description: "Manage LuxeCommerce categories.",
};

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      _count: {
        select: {
          products: true,
        },
      },
    },
  });

  return (
    <AdminShell
      eyebrow="Category Management"
      title="Categories."
      description="Manage the category taxonomy used to structure the storefront."
    >
      <div className="mb-6 flex justify-end">
        <Link
          href="/admin/categories/new"
          className="rounded-full bg-[#b3132b] px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#8e1023]"
        >
          New Category
        </Link>
      </div>

      <div className="overflow-x-auto rounded-[2rem] border border-[#e9d8dc] bg-white p-6 shadow-[0_14px_36px_rgba(179,19,43,0.05)]">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <thead>
            <tr className="border-b border-[#e9d8dc] text-xs uppercase tracking-[0.2em] text-[#6b6b6b]">
              <th className="py-4 pr-4 font-normal">Name</th>
              <th className="py-4 pr-4 font-normal">Slug</th>
              <th className="py-4 pr-4 font-normal">Products</th>
              <th className="py-4 pr-4 font-normal">Actions</th>
            </tr>
          </thead>

          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="border-b border-[#f3e5e8] text-sm text-[#6b6b6b]">
                <td className="py-4 pr-4 text-[#181818]">{category.name}</td>
                <td className="py-4 pr-4">{category.slug}</td>
                <td className="py-4 pr-4">{category._count.products}</td>
                <td className="py-4 pr-4">
                  <Link
                    href={`/admin/categories/edit?id=${category.id}`}
                    className="text-xs uppercase tracking-[0.2em] text-[#b3132b] transition hover:text-[#8e1023]"
                  >
                    Edit
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
