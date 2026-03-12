import { HeroSection }         from "@/components/landing/HeroSection";
import { FeaturesSection }     from "@/components/landing/FeaturesSection";
import { HowItWorksSection }   from "@/components/landing/HowItWorksSection";
import { DemoSection }         from "@/components/landing/DemoSection";
import { SocialProofSection }  from "@/components/landing/SocialProofSection";
import { CtaSection }          from "@/components/landing/CtaSection";
import { Footer }              from "@/components/layout/Footer";

export default function Home() {
  return (
    <div style={{ background: "var(--background)" }}>
      <div className="h-20" aria-hidden />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <DemoSection />
        <SocialProofSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
