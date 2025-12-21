# Sanity CMS Integration

## Setup Instructions

### 1. Create Sanity Project
```bash
npm install -g @sanity/cli
sanity init
```

Follow the prompts:
- Create new project
- Choose a project name
- Use default dataset configuration (production)
- Choose "Clean project with no predefined schemas"

### 2. Configure Sanity Studio

Copy the schemas from `sanity/schemas/` to your Sanity Studio project's schema folder.

In your Sanity Studio's `sanity.config.ts`:
```typescript
import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {schemaTypes} from './schemas'

export default defineConfig({
  name: 'default',
  title: 'Prescribe Landing',
  projectId: 'your-project-id',
  dataset: 'production',
  plugins: [deskTool()],
  schema: {
    types: schemaTypes,
  },
})
```

### 3. Environment Variables

Create `.env.local` in your Next.js project root:
```
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_SANITY_DATASET=production
```

Get your project ID from Sanity dashboard at https://sanity.io/manage

### 4. Deploy Sanity Studio

```bash
cd your-sanity-studio
sanity deploy
```

### 5. Add CORS Origins

In Sanity dashboard:
- Go to Settings → API
- Add your localhost and production URLs to CORS origins
- Example: `http://localhost:3000` and `https://yourdomain.com`

## Usage in Components

```typescript
import { getFAQs } from '@/lib/sanity.queries'
import FAQSection from '@/components/faq-section'

export default async function Page() {
  const faqs = await getFAQs()
  
  return <FAQSection faqs={faqs} />
}
```

## Available Queries

- `getHeroSection()` - Get hero section data
- `getFeatures()` - Get all active features
- `getServices()` - Get all active services
- `getPricingPlans()` - Get all active pricing plans
- `getTestimonials()` - Get all active testimonials
- `getAboutSection()` - Get about section data
- `getContactSection()` - Get contact section data
- `getFAQs()` - Get all active FAQs
- `getSiteSettings()` - Get site settings

## Image Handling

```typescript
import { urlFor } from '@/lib/sanity'

// In your component
const imageUrl = urlFor(data.image.imageUpload).width(800).url()
```
