import { getCTASection } from '@/lib/sanity.queries';
import { CTASection } from './cta-section';

export async function CTASectionWrapper() {
  const ctaData = await getCTASection();
  
  return <CTASection data={ctaData} />;
}
