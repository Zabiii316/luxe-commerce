"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type ProductOption = {
  id: string;
  name: string;
};

export type AdminProductFormInitialValues = {
  sku: string;
  name: string;
  slug: string;
  brandId: string;
  categoryId: string;
  basePrice: number;
  comparePrice?: number | null;
  currency: "USD";
  shortDescription: string;
  description: string;
  materials: string[];
  features: string[];
  images: string[];
  has360Viewer: boolean;
  stock: number;
  status: "ACTIVE" | "DRAFT" | "ARCHIVED";
};

type AdminProductFormProps = {
  mode: "create" | "edit";
  brands: ProductOption[];
  categories: ProductOption[];
  initialValues?: AdminProductFormInitialValues;
};

const emptyValues: AdminProductFormInitialValues = {
  sku: "",
  name: "",
  slug: "",
  brandId: "",
  categoryId: "",
  basePrice: 0,
  comparePrice: null,
  currency: "USD",
  shortDescription: "",
  description: "",
  materials: [],
  features: [],
  images: [],
  has360Viewer: false,
  stock: 0,
  status: "ACTIVE",
};

function linesToArray(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function arrayToLines(value: string[]) {
  return value.join("\n");
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function AdminProductForm({
  mode,
  brands,
  categories,
  initialValues,
}: AdminProductFormProps) {
  const router = useRouter();
  const startingValues = initialValues ?? emptyValues;

  const [sku, setSku] = useState(startingValues.sku);
  const [name, setName] = useState(startingValues.name);
  const [slug, setSlug] = useState(startingValues.slug);
  const [brandId, setBrandId] = useState(startingValues.brandId);
  const [categoryId, setCategoryId] = useState(startingValues.categoryId);
  const [basePrice, setBasePrice] = useState(String(startingValues.basePrice || ""));
  const [comparePrice, setComparePrice] = useState(
    startingValues.comparePrice ? String(startingValues.comparePrice) : "",
  );
  const [shortDescription, setShortDescription] = useState(startingValues.shortDescription);
  const [description, setDescription] = useState(startingValues.description);
  const [materials, setMaterials] = useState(arrayToLines(startingValues.materials));
  const [features, setFeatures] = useState(arrayToLines(startingValues.features));
  const [images, setImages] = useState(arrayToLines(startingValues.images));
  const [has360Viewer, setHas360Viewer] = useState(startingValues.has360Viewer);
  const [stock, setStock] = useState(String(startingValues.stock));
  const [status, setStatus] = useState(startingValues.status);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleNameChange(value: string) {
    setName(value);

    if (mode === "create" && !slug) {
      setSlug(slugify(value));
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    const payload = {
      sku,
      name,
      slug,
      brandId,
      categoryId,
      basePrice: Number(basePrice),
      comparePrice: comparePrice ? Number(comparePrice) : null,
      currency: "USD",
      shortDescription,
      description,
      materials: linesToArray(materials),
      features: linesToArray(features),
      images: linesToArray(images),
      has360Viewer,
      stock: Number(stock),
      status,
    };

    try {
      const response = await fetch(
        mode === "create" ? "/api/admin/products" : `/api/admin/products/${encodeURIComponent(sku)}`,
        {
          method: mode === "create" ? "POST" : "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();

      if (!response.ok || !data.ok) {
        setMessage(data.message || "Unable to save product.");
        return;
      }

      router.push("/admin/products");
      router.refresh();
    } catch {
      setMessage("Unable to save product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 md:p-8"
    >
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="SKU">
          <input
            value={sku}
            onChange={(event) => setSku(event.target.value)}
            disabled={mode === "edit"}
            className="field-input disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="LUX-BAG-002"
          />
        </Field>

        <Field label="Product name">
          <input
            value={name}
            onChange={(event) => handleNameChange(event.target.value)}
            className="field-input"
            placeholder="Noir Leather Travel Bag"
          />
        </Field>

        <Field label="Slug">
          <input
            value={slug}
            onChange={(event) => setSlug(slugify(event.target.value))}
            className="field-input"
            placeholder="noir-leather-travel-bag"
          />
        </Field>

        <Field label="Status">
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as typeof status)}
            className="field-input"
          >
            <option value="ACTIVE">Active</option>
            <option value="DRAFT">Draft</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </Field>

        <Field label="Brand">
          <select
            value={brandId}
            onChange={(event) => setBrandId(event.target.value)}
            className="field-input"
          >
            <option value="">Select brand</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Category">
          <select
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
            className="field-input"
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Base price">
          <input
            value={basePrice}
            onChange={(event) => setBasePrice(event.target.value)}
            className="field-input"
            type="number"
            min="0"
            step="0.01"
          />
        </Field>

        <Field label="Compare price">
          <input
            value={comparePrice}
            onChange={(event) => setComparePrice(event.target.value)}
            className="field-input"
            type="number"
            min="0"
            step="0.01"
          />
        </Field>

        <Field label="Stock">
          <input
            value={stock}
            onChange={(event) => setStock(event.target.value)}
            className="field-input"
            type="number"
            min="0"
            step="1"
          />
        </Field>

        <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-5 py-4">
          <input
            type="checkbox"
            checked={has360Viewer}
            onChange={(event) => setHas360Viewer(event.target.checked)}
          />
          <span className="text-sm text-white/65">Enable 360° viewer placeholder</span>
        </label>

        <Field label="Short description" className="md:col-span-2">
          <textarea
            value={shortDescription}
            onChange={(event) => setShortDescription(event.target.value)}
            className="field-input min-h-28"
          />
        </Field>

        <Field label="Full description" className="md:col-span-2">
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="field-input min-h-36"
          />
        </Field>

        <Field label="Materials, one per line">
          <textarea
            value={materials}
            onChange={(event) => setMaterials(event.target.value)}
            className="field-input min-h-32"
          />
        </Field>

        <Field label="Features, one per line">
          <textarea
            value={features}
            onChange={(event) => setFeatures(event.target.value)}
            className="field-input min-h-32"
          />
        </Field>

        <Field label="Image paths, one per line" className="md:col-span-2">
          <textarea
            value={images}
            onChange={(event) => setImages(event.target.value)}
            className="field-input min-h-32"
            placeholder="/products/example-1.jpg"
          />
        </Field>
      </div>

      {message ? (
        <div className="mt-6 rounded-2xl border border-red-400/30 bg-red-400/10 p-5 text-sm text-red-200">
          {message}
        </div>
      ) : null}

      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full bg-[#d6b46a] px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-black transition hover:bg-[#f0cf82] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : mode === "create" ? "Create Product" : "Update Product"}
        </button>

        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="rounded-full border border-white/20 px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:border-[#d6b46a] hover:text-[#d6b46a]"
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
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={className}>
      <span className="text-xs uppercase tracking-[0.22em] text-white/45">{label}</span>
      <div className="mt-3">{children}</div>
    </label>
  );
}
