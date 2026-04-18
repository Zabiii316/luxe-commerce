import Link from "next/link";
import { formatPrice } from "@/lib/utils/money";
import type { Product } from "@/lib/types/product";

type ProductCardProps = {
  product: Product;
  index: number;
};

export function ProductCard({ product, index }: ProductCardProps) {
  return (
    <article className="group overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] transition duration-300 hover:border-[#d6b46a]/50 hover:bg-white/[0.06]">
      <Link href={`/products/${product.slug}`} aria-label={`View ${product.name}`}>
        <div className="relative flex aspect-[4/5] items-end overflow-hidden bg-gradient-to-br from-[#2d271f] via-[#16120e] to-black p-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(214,180,106,0.22),_transparent_42%)] opacity-70 transition group-hover:scale-105" />

          <span className="relative rounded-full border border-white/15 bg-black/30 px-4 py-2 text-xs uppercase tracking-[0.25em] text-[#d6b46a]">
            0{index + 1}
          </span>
        </div>

        <div className="p-6">
          <p className="text-xs uppercase tracking-[0.25em] text-[#d6b46a]">
            {product.category}
          </p>

          <h3 className="mt-3 text-2xl font-light text-white">{product.name}</h3>

          <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/50">
            {product.shortDescription}
          </p>

          <div className="mt-6 flex items-center justify-between">
            <p className="text-lg text-white/75">{formatPrice(product.price, product.currency)}</p>

            <span className="text-sm uppercase tracking-[0.2em] text-white/45 transition group-hover:text-[#d6b46a]">
              View
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
