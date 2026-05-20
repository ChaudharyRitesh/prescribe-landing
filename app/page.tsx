import Header from "@/components/header";
import ScrollProgress from "@/components/scroll-progress";
import { HeroSectionWrapper } from "@/components/hero-section-wrapper";
import { ModulesShowcaseWrapper } from "@/components/modules-showcase-wrapper";
import { FeaturesSectionWrapper } from "@/components/features-section-wrapper";
import { ComparisonSectionWrapper } from "@/components/comparison-section-wrapper";
import { PricingSectionWrapper } from "@/components/pricing-section-wrapper";
import { CTASectionWrapper } from "@/components/cta-section-wrapper";
import { TrustSectionWrapper } from "@/components/trust-section-wrapper";
import { Footer } from "@/components/footer";
import { PartnerProgramSection } from "@/components/partner-program-section";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Header />
      <main style={{ overflowX: "hidden" }}>
        <HeroSectionWrapper />
        <ModulesShowcaseWrapper />
        <FeaturesSectionWrapper />
        <ComparisonSectionWrapper />
        <PricingSectionWrapper />
        <PartnerProgramSection />
        <CTASectionWrapper />
        <TrustSectionWrapper />
      </main>
      <Footer />
    </>
  );
}
