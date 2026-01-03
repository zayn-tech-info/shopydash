import { Features } from "../components/Features";
import { Hero } from "../components/Hero";
import { Howitworks } from "../components/Howitworks";
import { Pricing } from "../components/Pricing";
export function Home() {
  return (
    <div>
      <Hero />
      <Features />
      <Howitworks />
      <Pricing />
    </div>
  );
}
