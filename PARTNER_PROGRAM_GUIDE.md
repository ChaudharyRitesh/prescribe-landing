# Medical Representative (MR) Portal Guide

## 1. Overview
The **Medical Representative (MR) Portal** introduces a dedicated flow for sales partners and medical representatives whose primary role is pitching the KaeroPrescribe SaaS application to hospitals, clinics, and pharmacies. 

By registering as an MR, partners gain access to a customized, premium dashboard where they can track their leads, monitor sales performance, and manage commission earnings.

## 2. User Journey & Flow
1. **Landing Page Entry:** MRs visit the main landing page and click the prominent **"For MRs"** button located in the primary navigation header.
2. **Registration (`/partner/register`):** Users are presented with a premium, split-screen registration page featuring immersive Kaero branding. The form captures Name, Email, Phone, Agency, and Target Territory.
3. **Dashboard Access (`/partner/dashboard`):** Upon successful registration (or simulated login), MRs are redirected to their private portal. 

## 3. Architecture & Tech Stack
The Partner Program is built to be modular, scalable, and visually distinct from the consumer-facing landing page, while still maintaining the brand's premium identity.
- **Framework:** Next.js App Router (`app/partner/...`)
- **Styling (Public Pages):** Tailwind CSS + Lucide Icons for the high-end, immersive registration page.
- **Styling (Dashboard):** Material UI (MUI `@mui/material`) for highly interactive, standardized, and data-dense interior dashboard pages.
- **State/Form Handling:** Currently utilizes standard React state, prepared for integration with `react-hook-form` + `zod`.

## 4. Directory Structure
The following core files and directories were created to support the MR flow:

```text
app/
 └── mr/
      ├── register/
      │    └── page.tsx           # The MR Registration Form UI
      └── dashboard/
           ├── layout.tsx         # Shared Dashboard Layout (Sidebar + Topbar config)
           ├── page.tsx           # Dashboard Overview (KPIs, Pipeline Activity)
           ├── hospitals/
           │    └── page.tsx      # "My Hospitals" - Data table of hospital leads
           ├── performance/
           │    └── page.tsx      # "Performance" - Metrics scorecards and charts
           ├── earnings/
           │    └── page.tsx      # "Earnings" - Commission wallet & recent transactions
           └── settings/
                └── page.tsx      # "Settings" - Personal info, bank details, notifications

components/
 └── mr/
      └── dashboard/
           ├── Sidebar.tsx        # Left navigation drawer
           └── TopBar.tsx         # Top app bar with profile & notifications
```

## 5. UI/UX Philosophy
- **Responsive by Default:** Using MUI's `Grid` (v2 sizing) and CSS Flexbox, the dashboard gracefully scales from mobile devices to ultra-wide desktop monitors without constraints.
- **Premium Aesthetics:** Uses the brand's signature deep blue/black (`#051114`) and teal/cyan (`#00DACC`) color palette. Cards feature subtle hover state elevations, and Data Tables maintain a clean, borderless spacing.
- **DRY Layouts:** The heavy dashboard logic (Sidebar, TopBar, ThemeProvider) is centralized in `layout.tsx`, meaning sub-pages only need to focus on rendering content.

## 6. Pending/Future Integrations (Next Steps)
Since this initial rollout focused purely on the UI/UX frontend layer, the following needs to be integrated in future development phases:
1. **Authentication:** Implement NextAuth or Supabase Auth to secure the dashboard routes and handle the actual Registration POST requests.
2. **Database Hookup:** Replace static `recentLeads` arrays with dynamic API calls (e.g., Prisma, Supabase) using React Query.
3. **Data Visualization:** Integrate a charting library (like Recharts, which is already in `package.json`) to render dynamic win-rate line graphs on the Performance page.
