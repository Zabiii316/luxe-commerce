import { valueProps } from "@/lib/data/home";

export function ValueSection() {
  return (
    <section id="concierge" className="bg-[#f8f2e8] px-6 py-28 text-[#0d0b08]">
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-[0.9fr_1.1fr] md:items-center">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-[#8b6b2f]">
            White-Glove Commerce
          </p>
          <h2 className="mt-4 text-4xl font-light tracking-[-0.03em] md:text-6xl">
            Built for high-value digital retail.
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {valueProps.map((item) => (
            <div key={item} className="rounded-3xl border border-black/10 bg-white p-6">
              <h3 className="text-xl font-light">{item}</h3>
              <p className="mt-4 text-sm leading-6 text-black/55">
                Premium experience aligned with a scalable headless commerce foundation.
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
