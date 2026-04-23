import Link from "next/link";
import { formatPrice } from "@/lib/utils/money";
import type { Product } from "@/lib/types/product";

type ProductCardProps = {
  product: Product;
  index: number;
};

export function ProductCard({ product, index }: ProductCardProps) {
  return (
    <article className="group overflow-hidden rounded-[2rem] border border-[#e9d8dc] bg-white transition duration-300 hover:border-[#b3132b] hover:shadow-[0_22px_60px_rgba(179,19,43,0.10)]">
      <Link href={`/products/${product.slug}`} aria-label={`View ${product.name}`}>
        <div className="relative flex aspect-[4/5] items-end overflow-hidden bg-[linear-gradient(145deg,_#ffffff,_#fcebed_60%,_#fff7f8)] p-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(179,19,43,0.10),_transparent_42%)] opacity-80 transition group-hover:scale-105" />

          <span className="relative rounded-full border border-[#e9d8dc] bg-white px-4 py-2 text-xs uppercase tracking-[0.25em] text-[#b3132b]">
            0{index + 1}
          </span>
        </div>

        <div className="p-6">
          <p className="text-xs uppercase tracking-[0.25em] text-[#b3132b]">{product.category}</p>

          <h3 className="mt-3 text-2xl font-light text-[#181818]">{product.name}</h3>

          <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#6b6b6b]">
            {product.shortDescription}
          </p>

          <div className="mt-6 flex items-center justify-between">
            <p className="text-lg text-[#181818]">{formatPrice(product.price, product.currency)}</p>

            <span className="text-sm uppercase tracking-[0.2em] text-[#6b6b6b] transition group-hover:text-[#b3132b]">
              View
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
