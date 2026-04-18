import { ProductCard } from "@/components/product/product-card";
import { getProducts } from "@/lib/data/products";

export const metadata = {
  title: "Products | LuxeCommerce",
  description: "Explore luxury fashion, premium accessories, and high-end electronics.",
};

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-[#0d0b08] px-6 py-28 text-[#f8f2e8]">
      <section className="mx-auto max-w-7xl">
        <div className="mb-14 max-w-3xl">
          <p className="text-sm uppercase tracking-[0.35em] text-[#d6b46a]">
            Curated Catalogue
          </p>

          <h1 className="mt-5 text-5xl font-light tracking-[-0.04em] text-white md:text-7xl">
            Luxury objects, selected with intention.
          </h1>

          <p className="mt-6 text-lg leading-8 text-white/60">
            Browse a premium product catalogue powered by PostgreSQL and prepared for scalable
            headless commerce.
          </p>
        </div>

        <div className="mb-10 flex flex-wrap gap-3">
          {["All", "Luxury Fashion", "High-End Electronics", "Luxury Accessories"].map((item) => (
            <button
              key={item}
              className="rounded-full border border-white/10 px-5 py-3 text-xs uppercase tracking-[0.22em] text-white/60 transition hover:border-[#d6b46a] hover:text-[#d6b46a]"
            >
              {item}
            </button>
          ))}
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {products.map((product, index) => (
            <ProductCard key={product.sku} product={product} index={index} />
          ))}
        </div>
      </section>
    </main>
  );
}
