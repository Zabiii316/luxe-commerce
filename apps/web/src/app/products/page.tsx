import { ProductCard } from "@/components/product/product-card";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { getProducts } from "@/lib/data/products";

export const metadata = {
  title: "Products | LuxeCommerce",
  description: "Explore luxury fashion, premium accessories, and high-end electronics.",
};

export default async function ProductsPage() {
  const products = await getProducts();

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
              Browse a premium product catalogue powered by PostgreSQL and redesigned in a clean
              red-and-white storefront system.
            </p>
          </div>

          <div className="mb-10 flex flex-wrap gap-3">
            {["All", "Luxury Fashion", "High-End Electronics", "Luxury Accessories"].map((item) => (
              <button
                key={item}
                className="rounded-full border border-[#e9d8dc] bg-white px-5 py-3 text-xs uppercase tracking-[0.22em] text-[#6b6b6b] transition hover:border-[#b3132b] hover:text-[#b3132b]"
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
        </div>
      </section>

      <Footer />
    </main>
  );
}
