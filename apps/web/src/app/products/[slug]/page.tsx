import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { AddToWishlistButton } from "@/components/wishlist/add-to-wishlist-button";
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

  const primaryImage = product.images[0];
  const secondaryImage = product.images[1] || product.images[0];

  return (
    <main className="min-h-screen bg-white text-[#181818]">
      <Navbar />

      <section className="px-6 py-28 pt-32">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-5">
            <Link
              href="/products"
              className="inline-flex text-sm uppercase tracking-[0.25em] text-[#6b6b6b] transition hover:text-[#b3132b]"
            >
              ← Back to catalogue
            </Link>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="relative overflow-hidden rounded-[2.5rem] border border-[#e9d8dc] bg-[linear-gradient(145deg,_#ffffff,_#fcebed_55%,_#fff7f8)]">
                <div className="aspect-[4/5]">
                  {primaryImage ? (
                    <img
                      src={primaryImage}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-end p-8">
                      <span className="rounded-full border border-[#e9d8dc] bg-white px-4 py-2 text-xs uppercase tracking-[0.25em] text-[#b3132b]">
                        Primary
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="relative overflow-hidden rounded-[2.5rem] border border-[#e9d8dc] bg-[linear-gradient(145deg,_#ffffff,_#f8eef0_55%,_#fff7f8)]">
                <div className="aspect-[4/5]">
                  {secondaryImage ? (
                    <img
                      src={secondaryImage}
                      alt={`${product.name} alternate`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-end p-8">
                      <span className="rounded-full border border-[#e9d8dc] bg-white px-4 py-2 text-xs uppercase tracking-[0.25em] text-[#b3132b]">
                        Detail
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {product.has360Viewer ? (
              <div className="rounded-[2rem] border border-[#e9d8dc] bg-[#fcebed] p-6">
                <p className="text-sm uppercase tracking-[0.25em] text-[#b3132b]">
                  360° experience ready
                </p>
                <p className="mt-3 text-sm leading-6 text-[#6b6b6b]">
                  In the advanced phase, this area will load the 360° viewer dynamically so the
                  heavy 3D bundle never affects the initial page load.
                </p>
              </div>
            ) : null}
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <p className="text-sm uppercase tracking-[0.35em] text-[#b3132b]">{product.brand}</p>

            <h1 className="mt-5 text-5xl font-light leading-tight tracking-[-0.04em] text-[#181818] md:text-7xl">
              {product.name}
            </h1>

            <p className="mt-5 text-lg leading-8 text-[#6b6b6b]">{product.shortDescription}</p>

            <div className="mt-8 flex items-end gap-4">
              <p className="text-3xl font-light text-[#181818]">
                {formatPrice(product.price, product.currency)}
              </p>

              {product.comparePrice ? (
                <p className="text-lg text-[#6b6b6b] line-through">
                  {formatPrice(product.comparePrice, product.currency)}
                </p>
              ) : null}
            </div>

            <div className="mt-8 rounded-[2rem] border border-[#e9d8dc] bg-[#faf7f8] p-6">
              <p className="text-sm uppercase tracking-[0.25em] text-[#6b6b6b]">Availability</p>
              <p className="mt-2 text-[#181818]">
                {product.stock > 0 ? `${product.stock} pieces available` : "Sold out"}
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <AddToCartButton product={product} />
              <AddToWishlistButton product={product} />
            </div>

            <div className="mt-10 border-t border-[#e9d8dc] pt-8">
              <h2 className="text-xl font-light text-[#181818]">Description</h2>
              <p className="mt-4 text-sm leading-7 text-[#6b6b6b]">{product.description}</p>
            </div>

            <div className="mt-8 grid gap-6 border-t border-[#e9d8dc] pt-8 md:grid-cols-2">
              <div>
                <h3 className="text-sm uppercase tracking-[0.25em] text-[#b3132b]">Materials</h3>
                <ul className="mt-4 space-y-2 text-sm text-[#6b6b6b]">
                  {product.materials.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-sm uppercase tracking-[0.25em] text-[#b3132b]">Features</h3>
                <ul className="mt-4 space-y-2 text-sm text-[#6b6b6b]">
                  {product.features.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <Footer />
    </main>
  );
}
