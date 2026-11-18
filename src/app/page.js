import Image from "next/image";
import HeroBanner from "./components/HeroBanner";
import HowItWorks from "./components/HowItWorks";

export default function Home() {
  return (
    <div className="">
      <HeroBanner/>
      <HowItWorks/>
    </div>
  );
}
