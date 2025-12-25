import { client } from './sanity'
import type { HeroSection, Feature, Service, PricingPlan, Testimonial, AboutSection, ContactSection, FAQ, SiteSettings } from './sanity.types'
import { mockHeroSection, mockFeatures, mockServices, mockPricingPlans, mockTestimonials, mockAboutSection, mockContactSection, mockFAQs, mockSiteSettings } from './sanity.mock'

export async function getHeroSection(): Promise<HeroSection | null> {
  try {
    const data = await client.fetch(`*[_type == "heroSection" && isActive == true][0]`)
    return data || mockHeroSection
  } catch {
    return mockHeroSection
  }
}

export async function getFeatures(): Promise<Feature[]> {
  try {
    const data = await client.fetch(`*[_type == "feature" && isActive == true] | order(order asc)`)
    return data.length > 0 ? data : mockFeatures
  } catch {
    return mockFeatures
  }
}

export async function getServices(): Promise<Service[]> {
  try {
    const data = await client.fetch(`*[_type == "service" && isActive == true] | order(order asc)`)
    return data.length > 0 ? data : mockServices
  } catch {
    return mockServices
  }
}

export async function getPricingPlans(): Promise<PricingPlan[]> {
  try {
    const data = await client.fetch(`*[_type == "pricingPlan" && isActive == true && planType == "plan"] | order(order asc)`)
    console.log('Fetched plans from Sanity:', data)
    return data.length > 0 ? data : mockPricingPlans
  } catch (error) {
    console.error('Error fetching plans:', error)
    return mockPricingPlans
  }
}

export async function getPricingModules(): Promise<PricingPlan[]> {
  try {
    const data = await client.fetch(`*[_type == "pricingPlan" && isActive == true && planType == "module"] | order(order asc)`)
    return data
  } catch {
    return []
  }
}

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const data = await client.fetch(`*[_type == "testimonial" && isActive == true] | order(order asc)`)
    return data.length > 0 ? data : mockTestimonials
  } catch {
    return mockTestimonials
  }
}

export async function getAboutSection(): Promise<AboutSection | null> {
  try {
    const data = await client.fetch(`*[_type == "aboutSection" && isActive == true][0]`)
    return data || mockAboutSection
  } catch {
    return mockAboutSection
  }
}

export async function getContactSection(): Promise<ContactSection | null> {
  try {
    const data = await client.fetch(`*[_type == "contactSection" && isActive == true][0]`)
    return data || mockContactSection
  } catch {
    return mockContactSection
  }
}

export async function getFAQs(): Promise<FAQ[]> {
  try {
    const data = await client.fetch(`*[_type == "faq" && isActive == true] | order(order asc)`)
    return data.length > 0 ? data : mockFAQs
  } catch {
    return mockFAQs
  }
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    const data = await client.fetch(`*[_type == "siteSettings"][0]`)
    return data || mockSiteSettings
  } catch {
    return mockSiteSettings
  }
}

export async function getModules(): Promise<any[]> {
  try {
    const data = await client.fetch(`*[_type == "moduleSection" && isActive == true] | order(order asc)`)
    return data
  } catch {
    return []
  }
}

export async function getComparisons(): Promise<any[]> {
  try {
    const data = await client.fetch(`*[_type == "comparisonSection" && isActive == true] | order(order asc)`)
    return data
  } catch {
    return []
  }
}

export async function getTrustItems(): Promise<any[]> {
  try {
    const data = await client.fetch(`*[_type == "trustSection" && isActive == true] | order(order asc)`)
    return data
  } catch {
    return []
  }
}

export async function getCTASection(): Promise<any | null> {
  try {
    const data = await client.fetch(`*[_type == "ctaSection" && isActive == true][0]`)
    return data
  } catch {
    return null
  }
}
