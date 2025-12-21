export interface SanityImage {
  imageUpload?: any
  imageUrl?: string
}

export interface HeroSection {
  _id: string
  title: string
  subtitle?: string
  description?: string
  ctaText?: string
  ctaLink?: string
  backgroundImage?: SanityImage
  isActive: boolean
}

export interface Feature {
  _id: string
  title: string
  description?: string
  icon?: SanityImage
  link?: string
  order?: number
  isActive: boolean
}

export interface Service {
  _id: string
  title: string
  shortDescription?: string
  fullDescription?: any[]
  serviceImage?: SanityImage
  features?: string[]
  price?: string
  ctaText?: string
  ctaLink?: string
  order?: number
  isActive: boolean
}

export interface PricingPlan {
  _id: string
  planType?: 'module' | 'plan'
  planName: string
  price: string
  currency?: string
  billingPeriod?: 'month' | 'year'
  description?: string
  features?: string[]
  addons?: string[]
  planImage?: SanityImage
  isPopular?: boolean
  ctaText?: string
  ctaLink?: string
  order?: number
  isActive: boolean
  iconColor?: string
}

export interface Testimonial {
  _id: string
  name: string
  position?: string
  company?: string
  testimonial: string
  rating?: number
  avatar?: SanityImage
  order?: number
  isActive: boolean
}

export interface AboutSection {
  _id: string
  title: string
  subtitle?: string
  content?: any[]
  image?: SanityImage
  stats?: Array<{number: string; label: string}>
  ctaText?: string
  ctaLink?: string
  isActive: boolean
}

export interface ContactSection {
  _id: string
  title: string
  subtitle?: string
  email?: string
  phone?: string
  address?: string
  workingHours?: string
  socialLinks?: Array<{platform: string; url: string; icon?: SanityImage}>
  mapImage?: SanityImage
  isActive: boolean
}

export interface FAQ {
  _id: string
  question: string
  answer: string
  order?: number
  isActive: boolean
}

export interface SiteSettings {
  _id: string
  siteName: string
  siteDescription?: string
  logo?: SanityImage
  favicon?: SanityImage
  primaryColor?: string
  secondaryColor?: string
  footerText?: string
  copyrightText?: string
  seoKeywords?: string[]
  googleAnalyticsId?: string
}
