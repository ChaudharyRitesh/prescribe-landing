"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  Mail,
  MapPin,
  Linkedin,
  Twitter,
  Youtube,
  ArrowRight,
  Heart,
  Loader2,
} from "lucide-react";
import { BrandLogo } from "./brand-logo";

const footerGroups = [
  {
    title: "Modules",
    links: [
      { label: "OPD Management", href: "#modules" },
      { label: "IPD Management", href: "#modules" },
      { label: "Lab Management", href: "#modules" },
      { label: "Pharmacy", href: "#modules" },
      { label: "Patient Portal", href: "#modules" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "For Clinics", href: "#" },
      { label: "For Hospitals", href: "#" },
      { label: "For Diagnostic Labs", href: "#" },
      { label: "For Pharmacy Chains", href: "#" },
      { label: "Enterprise Solutions", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "#" },
      { label: "API Reference", href: "#" },
      { label: "Case Studies", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Help Center", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "#" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "#" },
      { label: "Partners Program", href: "/partner/register" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "HIPAA Compliance", href: "/compliance" },
      { label: "Security", href: "/compliance#security-controls" },
    ],
  },
];

const socials = [
  { icon: Linkedin, label: "LinkedIn", href: "#" },
  { icon: Twitter, label: "Twitter", href: "#" },
  { icon: Youtube, label: "YouTube", href: "#" },
];

export function Footer() {
  const pathname = usePathname();
  const isCareers = pathname.startsWith("/careers");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubmitting, setNewsletterSubmitting] = useState(false);
  const [newsletterStatus, setNewsletterStatus] = useState<
    { type: "success" | "error"; message: string } | undefined
  >(undefined);

  async function onNewsletterSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setNewsletterStatus(undefined);

    const email = newsletterEmail.trim();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setNewsletterStatus({ type: "error", message: "Enter a valid email." });
      return;
    }

    setNewsletterSubmitting(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setNewsletterStatus({
          type: "error",
          message: data?.message || "Could not subscribe. Try again.",
        });
        return;
      }

      setNewsletterStatus({ type: "success", message: "Subscribed." });
      setNewsletterEmail("");
    } catch {
      setNewsletterStatus({ type: "error", message: "Network error." });
    } finally {
      setNewsletterSubmitting(false);
    }
  }

  return (
    <footer className="bg-ink-deep">
      {/* Newsletter band */}
      <div className="border-b border-white/[0.08]">
        <div className="lp-container flex flex-col gap-6 py-10 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="font-heading text-lg font-bold text-white md:text-xl">
              Stay Updated with KaeroPrescribe
            </h3>
            <p className="mt-1 text-sm text-slate-400">
              Get the latest updates on healthcare technology and product
              features.
            </p>
          </div>
          <div className="w-full max-w-md">
            <form
              onSubmit={onNewsletterSubmit}
              className="flex flex-col gap-3 sm:flex-row"
            >
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                placeholder="Enter your email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className={`h-12 w-full flex-1 border border-white/10 bg-white/[0.06] px-4 text-sm text-white placeholder:text-slate-500 transition-colors duration-200 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400/20 ${
                  isCareers ? "rounded-md" : "rounded-xl"
                }`}
              />
              <button
                type="submit"
                disabled={newsletterSubmitting}
                className={`inline-flex h-12 cursor-pointer items-center justify-center gap-2 whitespace-nowrap px-6 text-sm font-semibold text-white transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${
                  isCareers
                    ? "rounded-md bg-teal-600 hover:bg-teal-500"
                    : "rounded-xl bg-sky-700 hover:bg-sky-800"
                }`}
              >
                Subscribe
                {newsletterSubmitting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : !isCareers ? (
                  <ArrowRight size={16} />
                ) : null}
              </button>
            </form>
            {newsletterStatus && (
              <p
                className={`mt-2 text-xs font-medium ${
                  newsletterStatus.type === "success"
                    ? "text-emerald-400"
                    : "text-rose-400"
                }`}
              >
                {newsletterStatus.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="lp-container py-12 md:py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,20rem)_1fr] lg:gap-16">
          {/* Brand column */}
          <div>
            <BrandLogo mark={44} />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
              The unified healthcare management platform for modern operations.
            </p>

            <div className="mt-6 space-y-2.5">
              <a
                href="mailto:support@kaerogroup.com"
                className="text-[13px] text-slate-400 transition-colors duration-200 hover:text-teal-300"
              >
                {!isCareers && <Mail size={15} className="mr-2.5 inline text-teal-400" />}
                support@kaerogroup.com
              </a>
              <p className="text-[13px] text-slate-400">
                {!isCareers && <MapPin size={15} className="mr-2.5 inline text-teal-400" />}
                Kolkata, West Bengal
              </p>
            </div>

            <div className={`mt-6 flex ${isCareers ? "gap-5" : "gap-2.5"}`}>
              {socials.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className={
                    isCareers
                      ? "text-xs font-semibold text-slate-400 transition-colors hover:text-teal-300"
                      : "flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-slate-400 transition-all duration-200 hover:border-teal-400/40 hover:bg-teal-400/10 hover:text-teal-300"
                  }
                >
                  {isCareers ? label : <Icon size={17} />}
                </a>
              ))}
            </div>
          </div>

          {/* Link groups */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
            {footerGroups.map((group) => (
              <div key={group.title}>
                <h4 className="font-heading text-sm font-semibold text-white">
                  {group.title}
                </h4>
                <ul className="mt-4 space-y-2.5">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-[13px] text-slate-400 transition-colors duration-200 hover:text-teal-300"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/[0.08]">
        <div className="lp-container flex flex-col items-center justify-between gap-3 py-6 md:flex-row">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} KaeroPrescribe by Kaero Group.
            All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-2 text-[11px] text-slate-500">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              All Systems Operational
            </span>
            <span className="h-3 w-px bg-white/10" />
            <span className="text-[11px] text-slate-500">
              {isCareers ? (
                "Built in India"
              ) : (
                <span className="flex items-center gap-1.5">
                  Made with
                  <Heart size={11} className="fill-rose-500 text-rose-500" />
                  in India
                </span>
              )}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
