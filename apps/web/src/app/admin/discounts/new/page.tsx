import Link from "next/link";
import { AdminShell } from "@/app/admin/_components/admin-shell";
import { AdminDiscountForm } from "@/components/admin/admin-discount-form";

export const metadata = {
  title: "New Discount | LuxeCommerce Admin",
  description: "Create a discount code.",
};

export default function NewDiscountPage() {
  return (
    <AdminShell
      eyebrow="Discount Management"
      title="Create discount."
      description="Add a new promotional rule for checkout."
    >
      <div className="mb-8">
        <Link
          href="/admin/discounts"
          className="text-sm uppercase tracking-[0.25em] text-[#6b6b6b] transition hover:text-[#b3132b]"
        >
          ← Back to discounts
        </Link>
      </div>

      <AdminDiscountForm mode="create" />
    </AdminShell>
  );
}
