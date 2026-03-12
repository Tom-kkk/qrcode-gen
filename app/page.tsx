import { HeroSection }      from "@/app/components/landing/HeroSection";
import { FeaturesSection }   from "@/app/components/landing/FeaturesSection";
import { HowItWorksSection } from "@/app/components/landing/HowItWorksSection";
import { DemoSection }       from "@/app/components/landing/DemoSection";

export default function Home() {
  return (
    <div style={{ background: "var(--background)" }}>
      <div className="h-20" aria-hidden />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <DemoSection />
      </main>
    </div>
  );
}
