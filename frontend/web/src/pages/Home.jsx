import { Features } from "../components/Features";
import Hero from "../components/Hero";
import { Howitworks } from "../components/Howitworks";
import { Pricing } from "../components/Pricing";
import { ProductPreview } from "../components/ProductPreview";
import { Testimonials } from "../components/Testimonials";
export function Home() {
  return (
    <div>
      <Hero />
      <Features />
      <ProductPreview />
      <Testimonials />
      <Howitworks />
      <Pricing />
    </div>
  );
}
