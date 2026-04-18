import { ProductCard } from "@/components/product/product-card";
import { getFeaturedProducts } from "@/lib/data/products";

export async function FeaturedProductsSection() {
  const featuredProducts = await getFeaturedProducts(3);

  return (
    <section id="products" className="px-6 py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-[#d6b46a]">Just Arrived</p>
            <h2 className="mt-4 text-4xl font-light tracking-[-0.03em] text-white md:text-6xl">
              Objects of desire.
            </h2>
          </div>

          <p className="max-w-md text-sm leading-7 text-white/55">
            A refined selection of fashion, accessories, and premium technology loaded from the
            PostgreSQL product catalogue.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {featuredProducts.map((product, index) => (
            <ProductCard key={product.sku} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
