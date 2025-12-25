import { getFeatures } from '@/lib/sanity.queries';
import { FeaturesSection } from './features-section';

export async function FeaturesSectionWrapper() {
  const features = await getFeatures();
  
  return <FeaturesSection features={features} />;
}
