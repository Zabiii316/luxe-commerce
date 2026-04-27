import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@luxe/database";
import { AdminShell } from "@/app/admin/_components/admin-shell";
import { AdminDiscountForm } from "@/components/admin/admin-discount-form";

type EditDiscountPageProps = {
  searchParams: Promise<{
    id?: string;
  }>;
};

export const metadata = {
  title: "Edit Discount | LuxeCommerce Admin",
  description: "Edit a discount code.",
};

export default async function EditDiscountPage({ searchParams }: EditDiscountPageProps) {
  const { id } = await searchParams;

  if (!id) notFound();

  const discount = await prisma.discountCode.findUnique({
    where: { id },
  });

  if (!discount) notFound();

  return (
    <AdminShell
      eyebrow="Discount Management"
      title="Edit discount."
      description="Update usage rules, active state, and promotional value."
    >
      <div className="mb-8">
        <Link
          href="/admin/discounts"
          className="text-sm uppercase tracking-[0.25em] text-[#6b6b6b] transition hover:text-[#b3132b]"
        >
          ← Back to discounts
        </Link>
      </div>

      <AdminDiscountForm
        mode="edit"
        initialValues={{
          id: discount.id,
          code: discount.code,
          type: discount.type,
          value: Number(discount.value),
          minOrderAmount: discount.minOrderAmount != null ? Number(discount.minOrderAmount) : null,
          usageLimit: discount.usageLimit ?? null,
          startsAt: discount.startsAt ? discount.startsAt.toISOString() : null,
          endsAt: discount.endsAt ? discount.endsAt.toISOString() : null,
          isActive: discount.isActive,
        }}
      />
    </AdminShell>
  );
}
