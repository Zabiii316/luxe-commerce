import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { getProductBySlug, getProducts } from "@/lib/data/products";
import { formatPrice } from "@/lib/utils/money";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const products = await getProducts();

  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found | LuxeCommerce",
    };
  }

  return {
    title: `${product.name} | LuxeCommerce`,
    description: product.shortDescription,
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#0d0b08] px-6 py-28 text-[#f8f2e8]">
      <section className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-5">
          <Link
            href="/products"
            className="inline-flex text-sm uppercase tracking-[0.25em] text-white/45 transition hover:text-[#d6b46a]"
          >
            ← Back to catalogue
          </Link>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="flex aspect-[4/5] items-end rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-[#2d271f] via-[#16120e] to-black p-8">
              <span className="rounded-full border border-white/15 bg-black/30 px-4 py-2 text-xs uppercase tracking-[0.25em] text-[#d6b46a]">
                Primary
              </span>
            </div>

            <div className="flex aspect-[4/5] items-end rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-[#342b20] via-[#19140f] to-black p-8">
              <span className="rounded-full border border-white/15 bg-black/30 px-4 py-2 text-xs uppercase tracking-[0.25em] text-[#d6b46a]">
                Detail
              </span>
            </div>
          </div>

          {product.has360Viewer ? (
            <div className="rounded-[2rem] border border-[#d6b46a]/30 bg-[#d6b46a]/10 p-6">
              <p className="text-sm uppercase tracking-[0.25em] text-[#d6b46a]">
                360° experience ready
              </p>
              <p className="mt-3 text-sm leading-6 text-white/55">
                In the advanced phase, this area will load the 360° viewer dynamically so the heavy
                3D bundle never affects the initial page load.
              </p>
            </div>
          ) : null}
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <p className="text-sm uppercase tracking-[0.35em] text-[#d6b46a]">{product.brand}</p>

          <h1 className="mt-5 text-5xl font-light leading-tight tracking-[-0.04em] text-white md:text-7xl">
            {product.name}
          </h1>

          <p className="mt-5 text-lg leading-8 text-white/60">{product.shortDescription}</p>

          <div className="mt-8 flex items-end gap-4">
            <p className="text-3xl font-light text-white">
              {formatPrice(product.price, product.currency)}
            </p>

            {product.comparePrice ? (
              <p className="text-lg text-white/35 line-through">
                {formatPrice(product.comparePrice, product.currency)}
              </p>
            ) : null}
          </div>

          <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
            <p className="text-sm uppercase tracking-[0.25em] text-white/40">Availability</p>
            <p className="mt-2 text-white/70">
              {product.stock > 0 ? `${product.stock} pieces available` : "Sold out"}
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <AddToCartButton product={product} />

            <button className="rounded-full border border-white/20 px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:border-[#d6b46a] hover:text-[#d6b46a]">
              Add to Wishlist
            </button>
          </div>

          <div className="mt-10 border-t border-white/10 pt-8">
            <h2 className="text-xl font-light text-white">Description</h2>
            <p className="mt-4 text-sm leading-7 text-white/55">{product.description}</p>
          </div>

          <div className="mt-8 grid gap-6 border-t border-white/10 pt-8 md:grid-cols-2">
            <div>
              <h3 className="text-sm uppercase tracking-[0.25em] text-[#d6b46a]">Materials</h3>
              <ul className="mt-4 space-y-2 text-sm text-white/55">
                {product.materials.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm uppercase tracking-[0.25em] text-[#d6b46a]">Features</h3>
              <ul className="mt-4 space-y-2 text-sm text-white/55">
                {product.features.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
