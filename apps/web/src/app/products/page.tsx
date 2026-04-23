import { ProductCard } from "@/components/product/product-card";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { ProductFilters } from "@/components/storefront/product-filters";
import { getProductFilterOptions, getProducts } from "@/lib/data/products";

type ProductsPageProps = {
  searchParams: Promise<{
    q?: string;
    brand?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
  }>;
};

export const metadata = {
  title: "Products | LuxeCommerce",
  description: "Explore luxury fashion, premium accessories, and high-end electronics.",
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;

  const q = params.q?.trim() ?? "";
  const brand = params.brand?.trim() ?? "";
  const category = params.category?.trim() ?? "";
  const minPrice = params.minPrice?.trim() ?? "";
  const maxPrice = params.maxPrice?.trim() ?? "";
  const sort = params.sort?.trim() || "newest";

  const [products, options] = await Promise.all([
    getProducts({
      q: q || undefined,
      brand: brand || undefined,
      category: category || undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      sort: sort === "price-asc" || sort === "price-desc" ? sort : "newest",
    }),
    getProductFilterOptions(),
  ]);

  return (
    <main className="min-h-screen bg-white text-[#181818]">
      <Navbar />

      <section className="px-6 py-28 pt-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 max-w-3xl">
            <p className="text-sm uppercase tracking-[0.35em] text-[#b3132b]">
              Curated Catalogue
            </p>

            <h1 className="mt-5 text-5xl font-light tracking-[-0.04em] text-[#181818] md:text-7xl">
              Luxury objects, selected with intention.
            </h1>

            <p className="mt-6 text-lg leading-8 text-[#6b6b6b]">
              Browse a premium product catalogue with search, taxonomy filters, and refined
              product discovery.
            </p>
          </div>

          <ProductFilters
            brands={options.brands}
            categories={options.categories}
            current={{
              q,
              brand,
              category,
              minPrice,
              maxPrice,
              sort,
            }}
          />

          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p className="text-sm uppercase tracking-[0.22em] text-[#6b6b6b]">
              {products.length} result{products.length === 1 ? "" : "s"} found
            </p>

            {(q || brand || category || minPrice || maxPrice || sort !== "newest") ? (
              <p className="text-sm text-[#6b6b6b]">
                Filters applied to the LuxeCommerce catalogue.
              </p>
            ) : null}
          </div>

          {products.length === 0 ? (
            <div className="rounded-[2rem] border border-[#e9d8dc] bg-[#faf7f8] p-10">
              <h2 className="text-3xl font-light text-[#181818]">No products matched your filters.</h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#6b6b6b]">
                Try changing the search term, clearing brand/category filters, or widening your
                price range.
              </p>

              <a
                href="/products"
                className="mt-8 inline-flex rounded-full bg-[#b3132b] px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#8e1023]"
              >
                Reset Catalogue
              </a>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {products.map((product, index) => (
                <ProductCard key={product.sku} product={product} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
