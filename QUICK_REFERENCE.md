# KaeroPrescribe Landing Page - Quick Reference

## 🎨 Color Palette (Clean & Professional)

```
Primary:    #2563eb (Blue-600)
White:      #ffffff
Gray-900:   #111827 (Dark backgrounds)
Gray-700:   #374151 (Body text)
Gray-600:   #4b5563 (Secondary text)
Gray-200:   #e5e7eb (Borders)
Gray-50:    #f9fafb (Light backgrounds)
Green-600:  #16a34a (Success/Checkmarks)
```

## 📱 Components

### 1. MacbookShowcase

**File**: `components/macbook-showcase.tsx`

- Auto-rotating carousel (5s interval)
- Manual navigation (prev/next)
- Dot indicators
- Responsive design

**Usage**:

```tsx
<MacbookShowcase
  slides={[{ title: "...", description: "...", image: "url" }]}
/>
```

### 2. HeroSection

**File**: `components/hero-section.tsx`

- Headline: "Real Healthcare Control. Real Time."
- MacBook carousel with 4 slides
- Left-aligned content
- Trust metrics
- Responsive layout

### 3. ModulesShowcase

**File**: `components/modules-showcase.tsx`

- 2x2 grid of modules
- Image + Icon + Title + Features
- Hover zoom effects
- Scroll animations

**Modules**:

- Pharmacy Admin
- Hospital Admin
- Reception & Ops
- Lab Dashboard

### 4. FeaturesSection

**File**: `components/features-section.tsx`

- 3-column grid (responsive)
- 6 features with images
- Icon + Title + Description
- Hover effects

**Features**:

- Smart Prescriptions
- Demand Forecasting
- Queue Intelligence
- Automated Alerts
- Secure Access
- Compliance Ready

### 5. ComparisonSection

**File**: `components/comparison-section.tsx`

- KaeroPrescribe vs Traditional table
- 8 feature comparisons
- Check/X icons
- Hover highlighting

### 6. PricingSection

**File**: `components/pricing-section.tsx`

- 3 pricing tiers
- Starter, Pro (highlighted), Enterprise
- Feature lists
- Responsive cards

### 7. CTASection

**File**: `components/cta-section.tsx`

- Dark background
- MacBook carousel (3 slides)
- Bold headline
- Dual CTAs
- Responsive

### 8. Trust Section

**File**: `app/page.tsx` (inline)

- 4 security features
- Icon + Title + Description
- Clean cards

## 🎯 Key Features

✓ **MacBook Carousel**: Professional device frame with auto-play
✓ **Clean Colors**: Only blue, white, and gray
✓ **Responsive**: Mobile, tablet, desktop
✓ **Smooth Animations**: Scroll reveals, hover effects
✓ **Professional Typography**: Clear hierarchy
✓ **Accessibility**: Proper contrast ratios
✓ **Performance**: Optimized components

## 📐 Spacing

- Section padding: 20px vertical (py-20)
- Max width: 7xl (max-w-7xl)
- Gap between items: 8-12 units
- Card padding: 8 units (p-8)

## 🔤 Typography

- **H1**: 48px-84px, bold
- **H2**: 36px-48px, bold
- **H3**: 24px-28px, bold
- **Body**: 16px, gray-700
- **Small**: 14px, gray-600

## 🎬 Animations

- **Scroll Reveal**: Fade in + slide up
- **Hover**: Scale, shadow, color transitions
- **Carousel**: 5s auto-play, smooth transitions
- **Transitions**: 300ms ease-in-out

## 📱 Responsive Breakpoints

- **Mobile**: Full width, stacked
- **Tablet (md)**: 2-column grids
- **Desktop (lg)**: 3-4 column grids

## 🚀 Getting Started

1. All components are in `components/` folder
2. Main page is `app/page.tsx`
3. Styles use Tailwind CSS
4. Images use Unsplash (replace with real dashboards)
5. TypeScript support included

## 🔧 Customization

### Change Colors

Update Tailwind classes:

- `bg-blue-600` → your color
- `text-gray-900` → your color
- `border-gray-200` → your color

### Update Images

Replace image URLs in each component:

```tsx
image: "https://images.unsplash.com/...";
```

### Modify Content

Update text in each component:

- Titles
- Descriptions
- Feature lists
- Pricing

### Adjust Spacing

Modify Tailwind classes:

- `gap-8` → `gap-12`
- `p-8` → `p-12`
- `py-20` → `py-32`

## ✅ Quality Checklist

- [x] TypeScript compilation passes
- [x] Clean color palette (blue/white/gray only)
- [x] Responsive design
- [x] Accessibility compliant
- [x] Professional design
- [x] MacBook carousel working
- [x] Smooth animations
- [x] All components modular
- [x] No console errors
- [x] Performance optimized

## 📚 Documentation

- `COLOR_PALETTE.md` - Detailed color system
- `LANDING_PAGE_GUIDE.md` - Component guide
- `CLEAN_DESIGN_SUMMARY.md` - Design overview

## 🎓 Best Practices

1. Keep color palette consistent
2. Use semantic HTML
3. Optimize images for web
4. Test on real devices
5. Monitor performance
6. Update content regularly
7. Maintain accessibility
8. Use proper alt text
