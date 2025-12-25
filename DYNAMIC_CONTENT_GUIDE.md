# Dynamic Content Implementation Guide

## Overview
All sections now support dynamic content from Sanity CMS while maintaining fallback to default content if Sanity data is unavailable.

## New Sanity Schemas Created

### 1. **ctaSection.ts**
- Fields: title, description, primaryButtonText, secondaryButtonText, footerText
- Used for: CTA section content

### 2. **trustSection.ts**
- Fields: title, description, order
- Used for: Trust/security features section
- Multiple items can be created

### 3. **comparisonSection.ts**
- Fields: feature, kaero (boolean), traditional (boolean), order
- Used for: Feature comparison table
- Multiple items can be created

### 4. **moduleSection.ts**
- Fields: title, description, icon, image, features (array), order
- Used for: Module showcase section
- Multiple items can be created
- Icon field accepts Lucide icon names: Zap, Users, Clock, BarChart3

## Updated Components

### Components with Dynamic Data Support:
1. **hero-section.tsx** - Uses heroSection schema
2. **features-section.tsx** - Uses feature schema
3. **modules-showcase.tsx** - Uses moduleSection schema
4. **comparison-section.tsx** - Uses comparisonSection schema
5. **cta-section.tsx** - Uses ctaSection schema
6. **trust-section.tsx** - Uses trustSection schema
7. **pricing-section.tsx** - Already using pricingPlan schema

### Wrapper Components Created:
- `hero-section-wrapper.tsx`
- `features-section-wrapper.tsx`
- `modules-showcase-wrapper.tsx`
- `comparison-section-wrapper.tsx`
- `cta-section-wrapper.tsx`
- `trust-section-wrapper.tsx`

## How It Works

1. **Wrapper components** (server components) fetch data from Sanity
2. **Display components** (client components) receive data as props
3. **Fallback content** is used if Sanity returns no data
4. **UI layout** remains unchanged - only content is dynamic

## Adding Content in Sanity Studio

### To add/edit content:
1. Run Sanity Studio (if not already running)
2. Navigate to the respective section in Sanity Studio
3. Create/edit content
4. Set `isActive` to true
5. For ordered lists (features, modules, etc.), set the `order` field

### Example: Adding a Module
1. Go to "Module Section" in Sanity
2. Click "Create new"
3. Fill in:
   - Title: "Pharmacy Admin"
   - Description: "Inventory & Orders"
   - Icon: "Zap" (or Users, Clock, BarChart3)
   - Upload image or provide URL
   - Add features as array items
   - Set order: 1
   - Set Active: true
4. Publish

## Image Handling

Images can be provided in two ways:
1. **Upload to Sanity** - Use imageUpload field
2. **External URL** - Use imageUrl field

Priority: imageUpload > imageUrl > fallback default

## Query Functions Added

In `lib/sanity.queries.ts`:
- `getModules()` - Fetch module sections
- `getComparisons()` - Fetch comparison items
- `getTrustItems()` - Fetch trust section items
- `getCTASection()` - Fetch CTA section data

## Benefits

✅ Content can be updated without code changes
✅ Non-technical team members can manage content
✅ All sections maintain their original design
✅ Fallback content ensures site never breaks
✅ Images can be managed through Sanity or external URLs
✅ Order of items can be controlled via Sanity

## Next Steps

1. Add content to Sanity Studio for each section
2. Test the dynamic content by editing in Sanity
3. Verify fallback content works when Sanity is empty
4. Deploy and enjoy dynamic content management!
