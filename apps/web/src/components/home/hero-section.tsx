export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-6 pb-20 pt-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(179,19,43,0.10),_transparent_30%),linear-gradient(180deg,_rgba(252,235,237,0.7),_transparent_55%)]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 md:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="mb-6 text-sm uppercase tracking-[0.35em] text-[#b3132b]">
            Luxury Fashion & High-End Electronics
          </p>

          <h1 className="max-w-4xl text-5xl font-light leading-[1.02] tracking-[-0.05em] text-[#181818] md:text-7xl lg:text-8xl">
            Curated elegance in red, white, and precision.
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-8 text-[#6b6b6b]">
            Discover a refined commerce experience with editorial storytelling, premium product
            presentation, secure checkout, and intelligent digital retail.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a
              href="#products"
              className="inline-flex items-center justify-center rounded-full bg-[#b3132b] px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#8e1023]"
            >
              Explore Collection
            </a>

            <a
              href="#edit"
              className="inline-flex items-center justify-center rounded-full border border-[#e9d8dc] bg-white px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#181818] transition hover:border-[#b3132b] hover:text-[#b3132b]"
            >
              View The Edit
            </a>
          </div>
        </div>

        <div className="relative hidden md:block">
          <div className="aspect-[4/5] rounded-[3rem] border border-[#e9d8dc] bg-white p-4 shadow-[0_30px_80px_rgba(179,19,43,0.08)]">
            <div className="flex h-full items-end rounded-[2.4rem] bg-[linear-gradient(145deg,_#ffffff,_#fcebed_55%,_#fff3f5)] p-8">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-[#b3132b]">
                  Private Selection
                </p>
                <h2 className="mt-4 text-3xl font-light text-[#181818]">
                  The 2026 Signature Edit
                </h2>
                <p className="mt-4 max-w-sm text-sm leading-6 text-[#6b6b6b]">
                  A premium storefront theme reimagined with clean white surfaces and deep red
                  accents.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
