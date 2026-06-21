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
  _id: string;
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

import { apiClient } from "./api/axios";

export async function getJobs(): Promise<Job[]> {
  try {
    const res = await apiClient.get('/jobs');
    const json = res as any;
    if (!json.success) return [];
    
    return json.data.map((job: any) => ({
      _id: job._id,
      slug: job.slug,
      title: job.title,
      department: job.department,
      location: job.location,
      mode: job.mode,
      type: job.type,
      level: job.level,
      salary: job.salary,
      postedDaysAgo: Math.floor((Date.now() - new Date(job.createdAt || Date.now()).getTime()) / (1000 * 60 * 60 * 24)),
      summary: job.summary,
      about: job.jobDescription?.about || "",
      responsibilities: job.jobDescription?.responsibilities || [],
      requirements: job.jobDescription?.requirements || [],
      niceToHave: job.jobDescription?.niceToHave || [],
    }));
  } catch (err) {
    console.error("Failed to fetch jobs:", err);
    return [];
  }
}

export async function getJob(slug: string): Promise<Job | null> {
  const jobs = await getJobs();
  return jobs.find((j) => j.slug === slug) || null;
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
