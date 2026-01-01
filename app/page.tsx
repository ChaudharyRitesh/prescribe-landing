import Header from "@/components/header";
import { HeroSectionWrapper } from "@/components/hero-section-wrapper";
import { ModulesShowcaseWrapper } from "@/components/modules-showcase-wrapper";
import { FeaturesSectionWrapper } from "@/components/features-section-wrapper";
import { ComparisonSectionWrapper } from "@/components/comparison-section-wrapper";
import { PricingSectionWrapper } from "@/components/pricing-section-wrapper";
import { CTASectionWrapper } from "@/components/cta-section-wrapper";
import { TrustSectionWrapper } from "@/components/trust-section-wrapper";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSectionWrapper />
      <ModulesShowcaseWrapper />
      <FeaturesSectionWrapper />
      <ComparisonSectionWrapper />
      <PricingSectionWrapper />
      <CTASectionWrapper />
      <TrustSectionWrapper />
      <Footer />
    </div>
  );
}
