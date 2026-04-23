"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type TaxonomyFormProps = {
  type: "brand" | "category";
  mode: "create" | "edit";
  initialValues?: {
    id?: string;
    name: string;
    slug: string;
  };
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function AdminTaxonomyForm({ type, mode, initialValues }: TaxonomyFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initialValues?.name ?? "");
  const [slug, setSlug] = useState(initialValues?.slug ?? "");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const title = type === "brand" ? "Brand" : "Category";
  const endpoint = type === "brand" ? "/api/admin/brands" : "/api/admin/categories";
  const backUrl = type === "brand" ? "/admin/brands" : "/admin/categories";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch(endpoint, {
        method: mode === "create" ? "POST" : "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: initialValues?.id,
          name,
          slug,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        setMessage(data.message || `Unable to save ${type}.`);
        return;
      }

      router.push(backUrl);
      router.refresh();
    } catch {
      setMessage(`Unable to save ${type}. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section className="rounded-[2rem] border border-[#e9d8dc] bg-white p-6 shadow-[0_14px_36px_rgba(179,19,43,0.05)] md:p-8">
        <p className="text-xs uppercase tracking-[0.25em] text-[#b3132b]">Taxonomy</p>
        <h2 className="mt-3 text-3xl font-light text-[#181818]">{title} details.</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[#6b6b6b]">
          Manage storefront taxonomy so products can be grouped and merchandised cleanly.
        </p>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <label>
            <span className="text-xs uppercase tracking-[0.22em] text-[#6b6b6b]">Name</span>
            <input
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                if (mode === "create" && !slug) {
                  setSlug(slugify(event.target.value));
                }
              }}
              className="field-input mt-3"
              placeholder={type === "brand" ? "Maison Velluto" : "Luxury Accessories"}
            />
          </label>

          <label>
            <span className="text-xs uppercase tracking-[0.22em] text-[#6b6b6b]">Slug</span>
            <input
              value={slug}
              onChange={(event) => setSlug(slugify(event.target.value))}
              className="field-input mt-3"
              placeholder={type === "brand" ? "maison-velluto" : "luxury-accessories"}
            />
          </label>
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
          {isSubmitting ? "Saving..." : mode === "create" ? `Create ${title}` : `Update ${title}`}
        </button>

        <button
          type="button"
          onClick={() => router.push(backUrl)}
          className="rounded-full border border-[#e9d8dc] bg-white px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#181818] transition hover:border-[#b3132b] hover:text-[#b3132b]"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
