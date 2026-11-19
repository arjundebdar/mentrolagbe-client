import Image from "next/image";
import HeroBanner from "./components/HeroBanner";
import HowItWorks from "./components/HowItWorks";
import PricingSection from "./components/PricingSection";

export default function Home() {
  return (
    <div className="">
      <HeroBanner/>
      <HowItWorks/>
      <PricingSection/>
    </div>
  );
}
