import { valueProps } from "@/lib/data/home";

export function ValueSection() {
  return (
    <section id="concierge" className="bg-[#faf7f8] px-6 py-28 text-[#181818]">
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-[0.9fr_1.1fr] md:items-center">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-[#b3132b]">
            White-Glove Commerce
          </p>
          <h2 className="mt-4 text-4xl font-light tracking-[-0.03em] md:text-6xl">
            Built for high-value digital retail.
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {valueProps.map((item) => (
            <div
              key={item}
              className="rounded-3xl border border-[#e9d8dc] bg-white p-6 shadow-[0_18px_50px_rgba(179,19,43,0.05)]"
            >
              <h3 className="text-xl font-light">{item}</h3>
              <p className="mt-4 text-sm leading-6 text-[#6b6b6b]">
                Premium experience aligned with a scalable headless commerce foundation.
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
