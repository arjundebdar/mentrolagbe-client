
import HeroBanner from "./components/HeroBanner";
import HowItWorks from "./components/HowItWorks";
import PricingSection from "./components/PricingSection";
import { Suspense } from "react";

export default function Home() {
  return (
    <div className="">
      <HeroBanner />
      <HowItWorks />
      <PricingSection />
    </div>
  );
}
