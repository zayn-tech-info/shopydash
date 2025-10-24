import { Features } from "../components/Features";
import { Hero } from "../components/Hero";
import { Howitworks } from "../components/Howitworks";
import { Waitlist } from "../components/Waitlist";

export function Home() {
  return (
    <div>
      <Hero />
      <Features />
      <Howitworks />
      <Waitlist />
    </div>
  );
}
