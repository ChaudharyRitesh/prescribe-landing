import { getPricingPlans, getPricingModules } from '@/lib/sanity.queries'
import { PricingSection } from './pricing-section'

export async function PricingSectionWrapper() {
  const [plans, modules] = await Promise.all([
    getPricingPlans(),
    getPricingModules()
  ])
  return <PricingSection plans={plans} modules={modules} />
}
