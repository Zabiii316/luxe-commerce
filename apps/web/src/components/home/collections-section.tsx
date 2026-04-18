import { collections } from "@/lib/data/home";

export function CollectionsSection() {
  return (
    <section id="edit" className="border-y border-white/10 bg-[#f8f2e8] px-6 py-8 text-[#0d0b08]">
      <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-4">
        {collections.map((item) => (
          <a
            key={item}
            href="#"
            className="rounded-3xl border border-black/10 px-6 py-8 transition hover:border-[#8b6b2f] hover:bg-white"
          >
            <p className="text-sm uppercase tracking-[0.25em] text-black/50">Collection</p>
            <h3 className="mt-3 text-2xl font-light">{item}</h3>
          </a>
        ))}
      </div>
    </section>
  );
}
