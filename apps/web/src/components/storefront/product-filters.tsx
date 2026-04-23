type FilterOption = {
  id: string;
  name: string;
  slug: string;
};

type ProductFiltersProps = {
  brands: FilterOption[];
  categories: FilterOption[];
  current: {
    q: string;
    brand: string;
    category: string;
    minPrice: string;
    maxPrice: string;
    sort: string;
  };
};

export function ProductFilters({ brands, categories, current }: ProductFiltersProps) {
  return (
    <form
      action="/products"
      className="mb-10 rounded-[2rem] border border-[#e9d8dc] bg-[#faf7f8] p-6 shadow-[0_12px_32px_rgba(179,19,43,0.05)]"
    >
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-6">
        <Field label="Search" className="xl:col-span-2">
          <input
            name="q"
            defaultValue={current.q}
            className="field-input"
            placeholder="Search products, brands, categories"
          />
        </Field>

        <Field label="Brand">
          <select name="brand" defaultValue={current.brand} className="field-input">
            <option value="">All brands</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.slug}>
                {brand.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Category">
          <select name="category" defaultValue={current.category} className="field-input">
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Min price">
          <input
            name="minPrice"
            type="number"
            min="0"
            step="1"
            defaultValue={current.minPrice}
            className="field-input"
            placeholder="0"
          />
        </Field>

        <Field label="Max price">
          <input
            name="maxPrice"
            type="number"
            min="0"
            step="1"
            defaultValue={current.maxPrice}
            className="field-input"
            placeholder="5000"
          />
        </Field>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-[1fr_auto_auto] md:items-end">
        <Field label="Sort by">
          <select name="sort" defaultValue={current.sort} className="field-input">
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </Field>

        <button
          type="submit"
          className="rounded-full bg-[#b3132b] px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#8e1023]"
        >
          Apply Filters
        </button>

        <a
          href="/products"
          className="inline-flex items-center justify-center rounded-full border border-[#e9d8dc] bg-white px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#181818] transition hover:border-[#b3132b] hover:text-[#b3132b]"
        >
          Reset
        </a>
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
      <span className="text-xs uppercase tracking-[0.22em] text-[#6b6b6b]">{label}</span>
      <div className="mt-3">{children}</div>
    </label>
  );
}
