import Link from "next/link";
import { prisma } from "@luxe/database";
import { AdminShell } from "@/app/admin/_components/admin-shell";

export const metadata = {
  title: "Admin Discounts | LuxeCommerce",
  description: "Manage LuxeCommerce discount codes.",
};

export default async function AdminDiscountsPage() {
  const discounts = await prisma.discountCode.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <AdminShell
      eyebrow="Discount Management"
      title="Discount codes."
      description="Manage promotional codes, dates, limits, and pricing rules."
    >
      <div className="mb-6 flex justify-end">
        <Link
          href="/admin/discounts/new"
          className="rounded-full bg-[#b3132b] px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#8e1023]"
        >
          New Discount
        </Link>
      </div>

      <div className="overflow-x-auto rounded-[2rem] border border-[#e9d8dc] bg-white p-6 shadow-[0_14px_36px_rgba(179,19,43,0.05)]">
        <table className="w-full min-w-[980px] border-collapse text-left">
          <thead>
            <tr className="border-b border-[#e9d8dc] text-xs uppercase tracking-[0.2em] text-[#6b6b6b]">
              <th className="py-4 pr-4 font-normal">Code</th>
              <th className="py-4 pr-4 font-normal">Type</th>
              <th className="py-4 pr-4 font-normal">Value</th>
              <th className="py-4 pr-4 font-normal">Active</th>
              <th className="py-4 pr-4 font-normal">Used</th>
              <th className="py-4 pr-4 font-normal">Limit</th>
              <th className="py-4 pr-4 font-normal">Actions</th>
            </tr>
          </thead>

          <tbody>
            {discounts.map((discount) => (
              <tr key={discount.id} className="border-b border-[#f3e5e8] text-sm text-[#6b6b6b]">
                <td className="py-4 pr-4 text-[#181818]">{discount.code}</td>
                <td className="py-4 pr-4">{discount.type}</td>
                <td className="py-4 pr-4">{Number(discount.value)}</td>
                <td className="py-4 pr-4">{discount.isActive ? "Yes" : "No"}</td>
                <td className="py-4 pr-4">{discount.usedCount}</td>
                <td className="py-4 pr-4">{discount.usageLimit ?? "—"}</td>
                <td className="py-4 pr-4">
                  <Link
                    href={`/admin/discounts/edit?id=${discount.id}`}
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
