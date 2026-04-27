"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export type AdminDiscountFormInitialValues = {
  id?: string;
  code: string;
  type: "PERCENT" | "FIXED";
  value: number;
  minOrderAmount?: number | null;
  usageLimit?: number | null;
  startsAt?: string | null;
  endsAt?: string | null;
  isActive: boolean;
};

type AdminDiscountFormProps = {
  mode: "create" | "edit";
  initialValues?: AdminDiscountFormInitialValues;
};

const emptyValues: AdminDiscountFormInitialValues = {
  code: "",
  type: "PERCENT",
  value: 10,
  minOrderAmount: null,
  usageLimit: null,
  startsAt: null,
  endsAt: null,
  isActive: true,
};

function toDateInput(value?: string | null) {
  if (!value) return "";
  return value.slice(0, 16);
}

export function AdminDiscountForm({ mode, initialValues }: AdminDiscountFormProps) {
  const router = useRouter();
  const values = initialValues ?? emptyValues;

  const [code, setCode] = useState(values.code);
  const [type, setType] = useState<"PERCENT" | "FIXED">(values.type);
  const [value, setValue] = useState(String(values.value));
  const [minOrderAmount, setMinOrderAmount] = useState(
    values.minOrderAmount != null ? String(values.minOrderAmount) : "",
  );
  const [usageLimit, setUsageLimit] = useState(
    values.usageLimit != null ? String(values.usageLimit) : "",
  );
  const [startsAt, setStartsAt] = useState(toDateInput(values.startsAt));
  const [endsAt, setEndsAt] = useState(toDateInput(values.endsAt));
  const [isActive, setIsActive] = useState(values.isActive);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/discounts", {
        method: mode === "create" ? "POST" : "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: values.id,
          code,
          type,
          value: Number(value),
          minOrderAmount: minOrderAmount ? Number(minOrderAmount) : null,
          usageLimit: usageLimit ? Number(usageLimit) : null,
          startsAt: startsAt || null,
          endsAt: endsAt || null,
          isActive,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        setMessage(data.message || "Unable to save discount.");
        return;
      }

      router.push("/admin/discounts");
      router.refresh();
    } catch {
      setMessage("Unable to save discount.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section className="rounded-[2rem] border border-[#e9d8dc] bg-white p-6 shadow-[0_14px_36px_rgba(179,19,43,0.05)] md:p-8">
        <p className="text-xs uppercase tracking-[0.25em] text-[#b3132b]">Discount Logic</p>
        <h2 className="mt-3 text-3xl font-light text-[#181818]">
          Pricing incentive controls.
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[#6b6b6b]">
          Create promotional codes for percentage or fixed discounts with optional limits and dates.
        </p>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <Field label="Code">
            <input
              value={code}
              onChange={(event) => setCode(event.target.value.toUpperCase())}
              className="field-input"
              placeholder="WELCOME10"
            />
          </Field>

          <Field label="Type">
            <select
              value={type}
              onChange={(event) => setType(event.target.value as "PERCENT" | "FIXED")}
              className="field-input"
            >
              <option value="PERCENT">Percent</option>
              <option value="FIXED">Fixed</option>
            </select>
          </Field>

          <Field label={type === "PERCENT" ? "Percent value" : "Fixed value"}>
            <input
              value={value}
              onChange={(event) => setValue(event.target.value)}
              className="field-input"
              type="number"
              min="0"
              step="0.01"
            />
          </Field>

          <Field label="Minimum order amount">
            <input
              value={minOrderAmount}
              onChange={(event) => setMinOrderAmount(event.target.value)}
              className="field-input"
              type="number"
              min="0"
              step="0.01"
            />
          </Field>

          <Field label="Usage limit">
            <input
              value={usageLimit}
              onChange={(event) => setUsageLimit(event.target.value)}
              className="field-input"
              type="number"
              min="1"
              step="1"
            />
          </Field>

          <label className="flex items-center gap-3 rounded-[1.5rem] border border-[#e9d8dc] bg-[#faf7f8] px-5 py-4">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(event) => setIsActive(event.target.checked)}
            />
            <span className="text-sm text-[#181818]">Discount is active</span>
          </label>

          <Field label="Starts at">
            <input
              value={startsAt}
              onChange={(event) => setStartsAt(event.target.value)}
              className="field-input"
              type="datetime-local"
            />
          </Field>

          <Field label="Ends at">
            <input
              value={endsAt}
              onChange={(event) => setEndsAt(event.target.value)}
              className="field-input"
              type="datetime-local"
            />
          </Field>
        </div>
      </section>

      {message ? (
        <div className="rounded-2xl border border-red-300/40 bg-red-50 p-5 text-sm text-[#8e1023]">
          {message}
        </div>
      ) : null}

      <div className="flex flex-col gap-4 sm:flex-row">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full bg-[#b3132b] px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#8e1023] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : mode === "create" ? "Create Discount" : "Update Discount"}
        </button>

        <button
          type="button"
          onClick={() => router.push("/admin/discounts")}
          className="rounded-full border border-[#e9d8dc] bg-white px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#181818] transition hover:border-[#b3132b] hover:text-[#b3132b]"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.22em] text-[#6b6b6b]">{label}</span>
      <div className="mt-3">{children}</div>
    </label>
  );
}
