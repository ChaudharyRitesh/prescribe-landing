import { getComparisons } from '@/lib/sanity.queries';
import { ComparisonSection } from './comparison-section';

export async function ComparisonSectionWrapper() {
  const comparisons = await getComparisons();
  
  return <ComparisonSection comparisons={comparisons} />;
}
