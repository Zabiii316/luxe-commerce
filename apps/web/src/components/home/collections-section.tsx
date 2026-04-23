import { collections } from "@/lib/data/home";

export function CollectionsSection() {
  return (
    <section id="edit" className="border-y border-[#e9d8dc] bg-[#faf7f8] px-6 py-8 text-[#181818]">
      <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-4">
        {collections.map((item) => (
          <a
            key={item}
            href="#"
            className="rounded-3xl border border-[#e9d8dc] bg-white px-6 py-8 transition hover:border-[#b3132b] hover:shadow-[0_18px_50px_rgba(179,19,43,0.08)]"
          >
            <p className="text-sm uppercase tracking-[0.25em] text-[#6b6b6b]">Collection</p>
            <h3 className="mt-3 text-2xl font-light">{item}</h3>
          </a>
        ))}
      </div>
    </section>
  );
}
