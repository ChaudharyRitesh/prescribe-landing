# KaeroPrescribe SaaS Landing Page - Component Guide

## Overview

Professional SaaS landing page with MacBook device frames, carousel showcases, and modern visual depth.

## Components

### 1. **MacbookCarousel** (`components/macbook-carousel.tsx`)

- Realistic MacBook Pro frame with notch
- Auto-rotating carousel (5s interval)
- Manual navigation with prev/next buttons
- Dot indicators for slide selection
- Responsive design

**Usage:**

```tsx
<MacbookCarousel
  slides={[{ title: "...", description: "...", image: "url" }]}
  autoPlay={true}
/>
```

### 2. **HeroSection** (`components/hero-section.tsx`)

- Headline: "Real Healthcare Control. Real Time."
- MacBook carousel with 4 dashboard slides
- Left-aligned content with CTAs
- Trust metrics (4 modules, 99.9% uptime, 24/7 AI)
- Animated background elements

### 3. **ModulesShowcase** (`components/modules-showcase.tsx`)

- 2x2 grid of module cards
- Image previews with hover zoom effect
- Icon + title + description
- Feature bullets for each module
- Smooth scroll reveal animations

**Modules:**

- Pharmacy Admin (Inventory & Orders)
- Hospital Admin (Patient & Ward Management)
- Reception & Ops (Queue & Appointments)
- Lab Dashboard (Reports & Results)

### 4. **FeaturesSection** (`components/features-section.tsx`)

- 3-column grid of feature cards
- Image previews with hover effects
- Icons with color transitions
- 6 key features with descriptions
- Scroll reveal animations

**Features:**

- Smart Prescriptions
- Demand Forecasting
- Queue Intelligence
- Automated Alerts
- Secure Access
- Compliance Ready

### 5. **ComparisonSection** (`components/comparison-section.tsx`)

- KaeroPrescribe vs Traditional Systems table
- 8 feature comparisons
- Check marks for included features
- Hover effects on rows
- Responsive table layout

### 6. **PricingSection** (`components/pricing-section.tsx`)

- 3 pricing tiers: Starter, Pro (highlighted), Enterprise
- Feature lists with check marks
- Responsive card layout
- Pro plan scaled up with special styling
- CTA buttons with hover effects

### 7. **CTASection** (`components/cta-section.tsx`)

- MacBook carousel with 3 CTA slides
- Dark gradient background
- Bold headline with gradient text
- Dual CTAs: Book Demo + Free Trial
- Animated background elements

## Design System

### Colors

- Primary: Blue (`#2563eb`)
- Secondary: Teal (`#14b8a6`)
- Neutral: Gray scale
- Backgrounds: White, Neutral-50, Neutral-900

### Typography

- Headings: Bold, 5xl-7xl
- Subheadings: 2xl-3xl
- Body: lg text with neutral-600
- Gradient text: Blue to Teal

### Spacing

- Section padding: `section-padding` (20px vertical)
- Max width: `section-max-width` (max-w-7xl)
- Gap between elements: 8-12 units

### Animations

- Scroll reveal: Fade in + slide up
- Hover effects: Scale, shadow, color transitions
- Carousel: 5s auto-play with smooth transitions
- Background: Pulsing gradient blobs

## Image URLs

Using Unsplash healthcare images:

- Pharmacy: `photo-1576091160550-112173f7f869`
- Hospital: `photo-1576091160399-112ba8d25d1d`
- Reception: `photo-1576091160550-2173a9c5c9fe`

Replace with actual dashboard screenshots for production.

## Responsive Breakpoints

- Mobile: Full width, stacked layout
- Tablet (md): 2-column grids
- Desktop (lg): 3-4 column grids, side-by-side layouts

## SEO & Metadata

- Title: "KaeroPrescribe – AI Operating System for Modern Healthcare"
- Meta description: "Modular pharmacy and hospital management platform with AI-native intelligence."
- OG image: Healthcare dashboard screenshot
- Keywords: healthcare, hospital management, pharmacy, AI

## Performance Tips

1. Lazy load images in carousels
2. Use Next.js Image component for optimization
3. Implement intersection observer for scroll reveals
4. Minify CSS and JavaScript
5. Use CDN for image delivery

## Customization

- Update image URLs in each component
- Modify pricing in `PricingSection`
- Change feature descriptions
- Adjust colors in Tailwind config
- Update company info in footer

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Responsive design
