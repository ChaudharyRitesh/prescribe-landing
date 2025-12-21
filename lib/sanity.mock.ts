import type { HeroSection, Feature, Service, PricingPlan, Testimonial, AboutSection, ContactSection, FAQ, SiteSettings } from './sanity.types'

export const mockHeroSection: HeroSection = {
  _id: 'mock-hero',
  title: 'Transform Your Healthcare Practice',
  subtitle: 'Modern prescription management made simple',
  description: 'Streamline your workflow with our intelligent prescription system designed for modern healthcare professionals.',
  ctaText: 'Get Started',
  ctaLink: '#contact',
  isActive: true
}

export const mockFeatures: Feature[] = [
  {
    _id: 'feature-1',
    title: 'Smart Prescriptions',
    description: 'AI-powered prescription suggestions based on patient history and best practices.',
    order: 1,
    isActive: true
  },
  {
    _id: 'feature-2',
    title: 'Digital Records',
    description: 'Secure cloud storage for all patient records with instant access anywhere.',
    order: 2,
    isActive: true
  },
  {
    _id: 'feature-3',
    title: 'Real-time Sync',
    description: 'Seamless synchronization across all your devices in real-time.',
    order: 3,
    isActive: true
  },
  {
    _id: 'feature-4',
    title: 'Analytics Dashboard',
    description: 'Comprehensive insights into your practice with detailed analytics.',
    order: 4,
    isActive: true
  }
]

export const mockServices: Service[] = [
  {
    _id: 'service-1',
    title: 'Prescription Management',
    shortDescription: 'Complete digital prescription system with e-signature support',
    features: ['Digital prescriptions', 'E-signature', 'Drug interaction alerts', 'Prescription history'],
    price: '$99/month',
    ctaText: 'Learn More',
    ctaLink: '#pricing',
    order: 1,
    isActive: true
  },
  {
    _id: 'service-2',
    title: 'Patient Portal',
    shortDescription: 'Give patients access to their health records and prescriptions',
    features: ['Patient dashboard', 'Appointment booking', 'Prescription refills', 'Secure messaging'],
    price: '$149/month',
    ctaText: 'Learn More',
    ctaLink: '#pricing',
    order: 2,
    isActive: true
  },
  {
    _id: 'service-3',
    title: 'Practice Analytics',
    shortDescription: 'Data-driven insights to optimize your practice',
    features: ['Performance metrics', 'Revenue tracking', 'Patient insights', 'Custom reports'],
    price: '$199/month',
    ctaText: 'Learn More',
    ctaLink: '#pricing',
    order: 3,
    isActive: true
  }
]

export const mockPricingPlans: PricingPlan[] = [
  {
    _id: 'plan-1',
    planName: 'Starter',
    price: '99',
    currency: 'USD',
    billingPeriod: 'month',
    description: 'Perfect for small practices',
    features: ['Up to 100 patients', 'Basic prescriptions', 'Email support', '5GB storage'],
    ctaText: 'Get Started',
    ctaLink: '#contact',
    order: 1,
    isActive: true
  },
  {
    _id: 'plan-2',
    planName: 'Professional',
    price: '199',
    currency: 'USD',
    billingPeriod: 'month',
    description: 'For growing practices',
    features: ['Up to 500 patients', 'Advanced prescriptions', 'Priority support', '50GB storage', 'Analytics dashboard'],
    isPopular: true,
    ctaText: 'Get Started',
    ctaLink: '#contact',
    order: 2,
    isActive: true
  },
  {
    _id: 'plan-3',
    planName: 'Enterprise',
    price: '399',
    currency: 'USD',
    billingPeriod: 'month',
    description: 'For large healthcare facilities',
    features: ['Unlimited patients', 'Full feature access', '24/7 support', 'Unlimited storage', 'Custom integrations', 'Dedicated account manager'],
    ctaText: 'Contact Sales',
    ctaLink: '#contact',
    order: 3,
    isActive: true
  }
]

export const mockTestimonials: Testimonial[] = [
  {
    _id: 'testimonial-1',
    name: 'Dr. Sarah Johnson',
    position: 'General Practitioner',
    company: 'City Medical Center',
    testimonial: 'This system has revolutionized how I manage prescriptions. The AI suggestions are incredibly accurate and save me so much time.',
    rating: 5,
    order: 1,
    isActive: true
  },
  {
    _id: 'testimonial-2',
    name: 'Dr. Michael Chen',
    position: 'Cardiologist',
    company: 'Heart Care Clinic',
    testimonial: 'The drug interaction alerts have prevented several potential issues. An essential tool for any modern practice.',
    rating: 5,
    order: 2,
    isActive: true
  },
  {
    _id: 'testimonial-3',
    name: 'Dr. Emily Rodriguez',
    position: 'Pediatrician',
    company: 'Kids Health Group',
    testimonial: 'My patients love the portal access. It has significantly reduced phone calls and improved patient satisfaction.',
    rating: 5,
    order: 3,
    isActive: true
  }
]

export const mockAboutSection: AboutSection = {
  _id: 'mock-about',
  title: 'About Prescribe',
  subtitle: 'Leading the future of digital healthcare',
  stats: [
    { number: '10K+', label: 'Active Doctors' },
    { number: '500K+', label: 'Prescriptions' },
    { number: '99.9%', label: 'Uptime' },
    { number: '24/7', label: 'Support' }
  ],
  ctaText: 'Learn More',
  ctaLink: '#contact',
  isActive: true
}

export const mockContactSection: ContactSection = {
  _id: 'mock-contact',
  title: 'Get in Touch',
  subtitle: 'Have questions? We\'d love to hear from you.',
  email: 'contact@prescribe.com',
  phone: '+1 (555) 123-4567',
  address: '123 Healthcare Ave, Medical District, CA 90210',
  workingHours: 'Mon-Fri: 9AM-6PM PST',
  socialLinks: [
    { platform: 'Twitter', url: 'https://twitter.com' },
    { platform: 'LinkedIn', url: 'https://linkedin.com' },
    { platform: 'Facebook', url: 'https://facebook.com' }
  ],
  isActive: true
}

export const mockFAQs: FAQ[] = [
  {
    _id: 'faq-1',
    question: 'How secure is the prescription data?',
    answer: 'We use bank-level encryption and are fully HIPAA compliant. All data is encrypted at rest and in transit, with regular security audits.',
    order: 1,
    isActive: true
  },
  {
    _id: 'faq-2',
    question: 'Can I integrate with my existing EMR system?',
    answer: 'Yes, we offer integrations with most major EMR systems. Our API allows seamless data exchange while maintaining security standards.',
    order: 2,
    isActive: true
  },
  {
    _id: 'faq-3',
    question: 'What happens if I need to cancel?',
    answer: 'You can cancel anytime with no penalties. Your data remains accessible for 90 days after cancellation, and you can export it at any time.',
    order: 3,
    isActive: true
  },
  {
    _id: 'faq-4',
    question: 'Do you offer training for my staff?',
    answer: 'Yes, all plans include comprehensive onboarding and training. Professional and Enterprise plans include personalized training sessions.',
    order: 4,
    isActive: true
  },
  {
    _id: 'faq-5',
    question: 'Is there a mobile app available?',
    answer: 'Yes, we have native iOS and Android apps that sync seamlessly with the web platform, allowing you to manage prescriptions on the go.',
    order: 5,
    isActive: true
  }
]

export const mockSiteSettings: SiteSettings = {
  _id: 'mock-settings',
  siteName: 'Prescribe',
  siteDescription: 'Modern prescription management system for healthcare professionals',
  primaryColor: '#3B82F6',
  secondaryColor: '#10B981',
  footerText: 'Empowering healthcare professionals with modern digital tools.',
  copyrightText: '© 2024 Prescribe. All rights reserved.',
  seoKeywords: ['prescription management', 'healthcare software', 'digital prescriptions', 'EMR system']
}
