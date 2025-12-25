import { getHeroSection } from '@/lib/sanity.queries';
import { HeroSection } from './hero-section';

export async function HeroSectionWrapper() {
  const heroData = await getHeroSection();
  
  return <HeroSection data={heroData} />;
}
