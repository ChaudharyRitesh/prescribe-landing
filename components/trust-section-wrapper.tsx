import { getTrustItems } from '@/lib/sanity.queries';
import { TrustSection } from './trust-section';

export async function TrustSectionWrapper() {
  const trustItems = await getTrustItems();
  
  return <TrustSection items={trustItems} />;
}
