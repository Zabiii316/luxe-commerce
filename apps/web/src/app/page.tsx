import { CollectionsSection } from "@/components/home/collections-section";
import { FeaturedProductsSection } from "@/components/home/featured-products-section";
import { HeroSection } from "@/components/home/hero-section";
import { ValueSection } from "@/components/home/value-section";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0d0b08] text-[#f8f2e8]">
      <Navbar />
      <HeroSection />
      <CollectionsSection />
      <FeaturedProductsSection />
      <ValueSection />
      <Footer />
    </main>
  );
}
