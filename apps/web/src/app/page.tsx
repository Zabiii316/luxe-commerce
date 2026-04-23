import { CollectionsSection } from "@/components/home/collections-section";
import { FeaturedProductsSection } from "@/components/home/featured-products-section";
import { HeroSection } from "@/components/home/hero-section";
import { ValueSection } from "@/components/home/value-section";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-[#181818]">
      <Navbar />
      <HeroSection />
      <CollectionsSection />
      <FeaturedProductsSection />
      <ValueSection />
      <Footer />
    </main>
  );
}
