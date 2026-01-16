import { HomeHero } from "@/components/hero/HomeHero";
import { Stats } from "@/components/sections/Stats";
import { Services } from "@/components/sections/Services";
import { FeaturedProducts } from "@/components/sections/FeaturedProducts";
import { Testimonials } from "@/components/sections/Testimonials";
import { CTASection } from "@/components/sections/CTASection";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HomeHero />
      <Stats />
      <Services />
      <FeaturedProducts />
      <Testimonials />
      <CTASection />
    </div>
  );
}
