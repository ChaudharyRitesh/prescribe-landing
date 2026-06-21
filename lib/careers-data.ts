export type JobType = "Full-time" | "Contract" | "Internship";
export type WorkMode = "Remote" | "Hybrid" | "On-site";
export type Department =
  | "Engineering"
  | "Product"
  | "Design"
  | "Clinical"
  | "Sales"
  | "Operations"
  | "Marketing";

export interface Job {
  slug: string;
  title: string;
  department: Department;
  location: string;
  mode: WorkMode;
  type: JobType;
  level: "Intern" | "Junior" | "Mid" | "Senior" | "Lead";
  salary?: string;
  postedDaysAgo: number;
  summary: string;
  about: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave?: string[];
}

export const DEPARTMENTS: Department[] = [
  "Engineering",
  "Product",
  "Design",
  "Clinical",
  "Sales",
  "Operations",
  "Marketing",
];

export const LOCATIONS = ["Kolkata", "Bengaluru", "Remote (India)"];

export const JOB_TYPES: JobType[] = ["Full-time", "Contract", "Internship"];

export const jobs: Job[] = [
  {
    slug: "senior-fullstack-engineer",
    title: "Senior Full-Stack Engineer",
    department: "Engineering",
    location: "Bengaluru",
    mode: "Hybrid",
    type: "Full-time",
    level: "Senior",
    salary: "₹35–55 LPA",
    postedDaysAgo: 2,
    summary:
      "Own end-to-end features across our multi-tenant healthcare platform — from prescribing workflows to pharmacy and labs.",
    about:
      "You'll work on the core platform that hospitals and clinics run their daily operations on. Expect real ownership: shipping production features that touch patient care, billing, and compliance, with a small senior team that values craft over ceremony.",
    responsibilities: [
      "Design and ship features across our Next.js + Node/Express + MongoDB stack",
      "Build secure, multi-tenant systems handling regulated health data",
      "Collaborate with clinical and product teams to translate workflows into software",
      "Raise the engineering bar through reviews, testing, and mentorship",
    ],
    requirements: [
      "5+ years building production web applications",
      "Strong TypeScript across React/Next.js and Node.js",
      "Solid grasp of databases, API design, and system architecture",
      "Care for security, performance, and maintainability",
    ],
    niceToHave: [
      "Experience with healthcare or other regulated domains",
      "Exposure to HIPAA / DPDP, audit trails, or RBAC",
    ],
  },
  {
    slug: "frontend-engineer",
    title: "Frontend Engineer",
    department: "Engineering",
    location: "Remote (India)",
    mode: "Remote",
    type: "Full-time",
    level: "Mid",
    salary: "₹18–30 LPA",
    postedDaysAgo: 5,
    summary:
      "Craft fast, accessible, delightful interfaces for clinicians who live in our product all day.",
    about:
      "Clinicians don't have time to fight software. You'll build interfaces that feel instant and obvious — high-density data, complex forms, and real-time updates — without sacrificing accessibility or polish.",
    responsibilities: [
      "Build responsive, accessible UI with React, Next.js, and Tailwind",
      "Turn Figma designs into pixel-accurate, performant components",
      "Optimize for real-world clinical hardware and low-bandwidth networks",
      "Partner with design to refine interactions and micro-animations",
    ],
    requirements: [
      "3+ years of focused frontend work",
      "Expert React + TypeScript; strong CSS/Tailwind",
      "Eye for detail and accessibility (WCAG AA)",
      "Comfort with performance profiling and optimization",
    ],
    niceToHave: ["Framer Motion / GSAP", "Design systems experience"],
  },
  {
    slug: "product-manager-clinical",
    title: "Product Manager, Clinical",
    department: "Product",
    location: "Bengaluru",
    mode: "Hybrid",
    type: "Full-time",
    level: "Senior",
    salary: "₹30–45 LPA",
    postedDaysAgo: 8,
    summary:
      "Own the clinical product surface — prescribing, EMR, and decision support — alongside real doctors.",
    about:
      "You'll be the bridge between clinicians and engineering, shaping the roadmap for the modules that touch patient care most directly. Deep user empathy and a bias for shipping are essential.",
    responsibilities: [
      "Define and prioritize the clinical product roadmap",
      "Run discovery with doctors, nurses, and administrators",
      "Write crisp specs and partner with engineering to ship",
      "Measure outcomes and iterate against real usage",
    ],
    requirements: [
      "4+ years in product management, ideally B2B SaaS",
      "Strong written communication and prioritization",
      "Comfort with data and outcome-driven decisions",
    ],
    niceToHave: [
      "Healthcare / clinical background",
      "Experience with regulated or workflow-heavy products",
    ],
  },
  {
    slug: "product-designer",
    title: "Product Designer",
    department: "Design",
    location: "Remote (India)",
    mode: "Remote",
    type: "Full-time",
    level: "Mid",
    salary: "₹20–35 LPA",
    postedDaysAgo: 11,
    summary:
      "Design clarity into complexity — workflows for hospitals, clinics, labs, and pharmacies.",
    about:
      "Healthcare software is notoriously ugly and confusing. Your job is to prove it doesn't have to be. You'll own flows end-to-end, from research to polished, shippable design.",
    responsibilities: [
      "Own design for entire product areas, research to handoff",
      "Build and maintain our design system",
      "Prototype and validate with real clinical users",
      "Partner tightly with engineering on implementation",
    ],
    requirements: [
      "4+ years of product design experience",
      "Strong portfolio showing complex, data-dense interfaces",
      "Fluency in Figma and modern design systems",
    ],
    niceToHave: ["Motion / interaction design", "Front-end literacy"],
  },
  {
    slug: "clinical-implementation-specialist",
    title: "Clinical Implementation Specialist",
    department: "Clinical",
    location: "Kolkata",
    mode: "On-site",
    type: "Full-time",
    level: "Mid",
    postedDaysAgo: 14,
    summary:
      "Onboard hospitals and clinics — configure workflows, train staff, and ensure successful go-lives.",
    about:
      "You're the human face of KaeroPrescribe during a facility's most critical moment: switching systems. You'll combine clinical knowledge with project management to make migrations smooth.",
    responsibilities: [
      "Lead end-to-end onboarding for new healthcare facilities",
      "Configure modules to match each facility's workflows",
      "Train clinical and admin staff; drive adoption",
      "Be the voice of the customer back to product",
    ],
    requirements: [
      "Clinical background (nursing, pharmacy, lab, or hospital admin)",
      "Excellent communication and training skills",
      "Comfort with software configuration and data migration",
    ],
  },
  {
    slug: "enterprise-account-executive",
    title: "Enterprise Account Executive",
    department: "Sales",
    location: "Bengaluru",
    mode: "Hybrid",
    type: "Full-time",
    level: "Senior",
    postedDaysAgo: 6,
    summary:
      "Bring KaeroPrescribe to large hospital groups and chains across India.",
    about:
      "You'll own the full enterprise sales cycle for multi-facility healthcare organizations — from first conversation to signed contract — selling a platform that genuinely improves operations.",
    responsibilities: [
      "Own pipeline and quota for enterprise healthcare accounts",
      "Run consultative, multi-stakeholder sales cycles",
      "Partner with clinical and product teams on complex deals",
      "Forecast accurately and report on key metrics",
    ],
    requirements: [
      "5+ years in B2B SaaS sales, ideally enterprise",
      "Track record of closing complex, multi-stakeholder deals",
      "Healthcare or regulated-industry experience a plus",
    ],
  },
  {
    slug: "devops-platform-engineer",
    title: "DevOps / Platform Engineer",
    department: "Engineering",
    location: "Remote (India)",
    mode: "Remote",
    type: "Full-time",
    level: "Senior",
    salary: "₹30–50 LPA",
    postedDaysAgo: 3,
    summary:
      "Build the reliable, secure, compliant infrastructure that healthcare data demands.",
    about:
      "Uptime isn't a nice-to-have when clinics depend on you. You'll own infrastructure, CI/CD, observability, and the security posture that keeps regulated data safe.",
    responsibilities: [
      "Own cloud infrastructure, CI/CD, and deployments",
      "Build observability, alerting, and incident response",
      "Harden security and support compliance (ISO 27001, SOC 2)",
      "Drive reliability across a multi-tenant platform",
    ],
    requirements: [
      "4+ years in DevOps / platform / SRE roles",
      "Strong with containers, IaC, and a major cloud",
      "Security-first mindset",
    ],
    niceToHave: ["GCP / Cloud Run", "Experience with compliance audits"],
  },
  {
    slug: "growth-marketing-manager",
    title: "Growth Marketing Manager",
    department: "Marketing",
    location: "Remote (India)",
    mode: "Remote",
    type: "Full-time",
    level: "Mid",
    postedDaysAgo: 18,
    summary:
      "Drive demand among clinics, hospitals, and diagnostic chains through content and campaigns.",
    about:
      "You'll build the growth engine — from positioning and content to paid and lifecycle — for a category that's overdue for modern software.",
    responsibilities: [
      "Own demand-gen strategy and execution",
      "Build content that educates healthcare decision-makers",
      "Run and optimize multi-channel campaigns",
      "Partner with sales on pipeline and attribution",
    ],
    requirements: [
      "4+ years in B2B growth/demand-gen marketing",
      "Strong analytical and content instincts",
      "Experience owning pipeline metrics",
    ],
  },
  {
    slug: "qa-automation-engineer",
    title: "QA Automation Engineer",
    department: "Engineering",
    location: "Kolkata",
    mode: "Hybrid",
    type: "Full-time",
    level: "Mid",
    postedDaysAgo: 9,
    summary:
      "Safeguard quality across a platform where bugs can affect patient care.",
    about:
      "In healthcare, a regression isn't just annoying — it can be dangerous. You'll build the automated testing that lets us ship fast without breaking trust.",
    responsibilities: [
      "Design and maintain automated test suites (E2E, integration)",
      "Build testing into CI/CD pipelines",
      "Partner with engineers to improve testability",
      "Champion quality culture across the team",
    ],
    requirements: [
      "3+ years in QA automation",
      "Strong with a modern E2E framework (Playwright/Cypress)",
      "Solid scripting in JavaScript/TypeScript",
    ],
  },
  {
    slug: "design-intern",
    title: "Product Design Intern",
    department: "Design",
    location: "Remote (India)",
    mode: "Remote",
    type: "Internship",
    level: "Intern",
    postedDaysAgo: 1,
    summary:
      "Learn by shipping real design work on a product clinicians use every day.",
    about:
      "A 6-month internship with real ownership and mentorship. You'll contribute to live features, not throwaway projects, and graduate with a portfolio that stands out.",
    responsibilities: [
      "Support design across product areas",
      "Contribute to the design system",
      "Help with research and prototyping",
    ],
    requirements: [
      "Strong foundational design portfolio",
      "Fluency in Figma",
      "Hunger to learn and ship",
    ],
  },
];

export interface Perk {
  title: string;
  description: string;
  icon: string; // lucide icon name
}

export const perks: Perk[] = [
  { title: "Meaningful Work", description: "Build software that directly improves patient care and clinician lives.", icon: "Target" },
  { title: "Remote-Friendly", description: "Work from where you do your best work, with hubs in Kolkata & Bengaluru.", icon: "Globe" },
  { title: "Health Coverage", description: "Comprehensive medical insurance for you and your family.", icon: "HeartPulse" },
  { title: "Learning Budget", description: "Annual budget for courses, books, and conferences.", icon: "GraduationCap" },
  { title: "Real Ownership", description: "Small senior team, big scope. Your work ships and matters.", icon: "Compass" },
  { title: "Flexible Time Off", description: "Generous, trust-based leave — rest is part of the job.", icon: "CalendarDays" },
  { title: "Latest Gear", description: "Top-tier hardware and tools so you're never slowed down.", icon: "Laptop" },
  { title: "Equity", description: "Share in the upside of what we're building together.", icon: "LineChart" },
];

export interface Value {
  title: string;
  description: string;
  icon: string;
}

export const values: Value[] = [
  { title: "Patients First", description: "Every decision traces back to better, safer care. The stakes are real, and we act like it.", icon: "Stethoscope" },
  { title: "Ship with Craft", description: "We move fast without cutting corners. Quality is a feature, not a phase.", icon: "Sparkles" },
  { title: "Earn Trust", description: "We handle sensitive data and life-critical workflows. Reliability and integrity are non-negotiable.", icon: "ShieldCheck" },
  { title: "Stay Curious", description: "Healthcare is complex. We listen deeply, learn constantly, and stay humble.", icon: "Lightbulb" },
];
