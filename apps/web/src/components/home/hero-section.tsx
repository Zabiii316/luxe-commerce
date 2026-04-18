export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden px-6 pt-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(214,180,106,0.22),_transparent_35%),linear-gradient(135deg,_rgba(255,255,255,0.08),_transparent_35%)]" />
      <div className="absolute right-0 top-24 hidden h-[620px] w-[52vw] rounded-l-[5rem] border border-white/10 bg-gradient-to-br from-[#2a241c] via-[#15110d] to-[#050403] shadow-2xl shadow-black/60 md:block" />

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-14 md:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="mb-6 text-sm uppercase tracking-[0.35em] text-[#d6b46a]">
            Luxury Fashion & High-End Electronics
          </p>

          <h1 className="max-w-4xl text-5xl font-light leading-[1.04] tracking-[-0.04em] text-white md:text-7xl lg:text-8xl">
            Curated elegance for the modern collector.
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-8 text-white/65">
            Discover a refined commerce experience designed for premium products, editorial
            storytelling, intelligent discovery, and white-glove digital service.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a
              href="#products"
              className="inline-flex items-center justify-center rounded-full bg-[#d6b46a] px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-black transition hover:bg-[#f0cf82]"
            >
              Explore Collection
            </a>

            <a
              href="#edit"
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:border-[#d6b46a] hover:text-[#d6b46a]"
            >
              View The Edit
            </a>
          </div>
        </div>

        <div className="relative hidden md:block">
          <div className="aspect-[4/5] rounded-[3rem] border border-white/10 bg-gradient-to-br from-[#f4e8d0]/20 via-[#d6b46a]/10 to-transparent p-4 shadow-2xl">
            <div className="flex h-full items-end rounded-[2.4rem] bg-[linear-gradient(145deg,_#30291f,_#0d0b08_60%,_#000)] p-8">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-[#d6b46a]">
                  Private Selection
                </p>
                <h2 className="mt-4 text-3xl font-light text-white">
                  The 2026 Signature Edit
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
