"use client";

import Link from "next/link";
import {
  Handshake,
  TrendingUp,
  Globe2,
  PieChart,
  Users,
  CheckCircle2,
  ArrowRight,
  LogIn,
} from "lucide-react";
import { GsapReveal, StatCounter } from "./gsap-reveal";

const benefits = [
  {
    title: "High Commission Structure",
    description:
      "Earn industry-leading commissions on every successful hospital conversion and follow-on subscription.",
    icon: TrendingUp,
  },
  {
    title: "Territory Exclusivity",
    description:
      "Lock in your region and manage operations with zero competition from other partners.",
    icon: Globe2,
  },
  {
    title: "Advanced CRM Tools",
    description:
      "Access a dedicated partner dashboard to track pitches, monitor performance, and manage hospital leads.",
    icon: PieChart,
  },
  {
    title: "Full Training & Support",
    description:
      "Comprehensive product training and a dedicated support team to help you close larger hospital deals.",
    icon: Users,
  },
];

const features = [
  "Bespoke landing page for partners",
  "Automated commission payouts",
  "Whitelabel pitch materials",
  "Dedicated support representative",
  "Real-time analytics & reporting",
];

const partnerStats = [
  { value: "500+", label: "Hospitals Empowered" },
  { value: "₹50 Cr+", label: "Partner Commissions" },
  { value: "₹0", label: "Joining Fee" },
];

export function PartnerProgramSection() {
  return (
    <section
      id="partner-program"
      className="lp-section relative overflow-hidden bg-ink-deep"
    >
      <div className="lp-section-divider" />
      <div className="lp-grid-pattern pointer-events-none absolute inset-0 opacity-40" />
      <div className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-teal-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute -left-24 bottom-10 h-80 w-80 rounded-full bg-sky-600/10 blur-[110px]" />
      <div className="lp-container relative">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Copy column */}
          <GsapReveal>
            <span className="lp-eyebrow">
              <Handshake size={14} />
              Partner with Kaero
            </span>

            <h2 className="lp-h2 mt-5">
              Join the{" "}
              <span className="bg-gradient-to-r from-teal-300 via-sky-300 to-sky-400 bg-clip-text text-transparent">
                Kaero Partner Program
              </span>{" "}
              &amp; Scale Your Success
            </h2>

            <p className="lp-sub mt-4 max-w-lg">
              Become a strategic partner in the healthcare revolution. We
              provide the tools, technology, and support you need to empower
              hospitals and grow your business.
            </p>

            <ul className="mt-7 space-y-3">
              {features.map((f) => (
                <li key={f} className="flex items-center gap-3">
                  <CheckCircle2 size={19} className="shrink-0 text-teal-300" />
                  <span className="text-sm font-medium text-slate-300 md:text-[15px]">
                    {f}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-3.5 sm:flex-row">
              <Link href="/partner/register" className="lp-btn-primary">
                Become a Partner
                <ArrowRight size={18} />
              </Link>
              <Link href="/partner/login" className="lp-btn-secondary">
                <LogIn size={18} />
                Partner Login
              </Link>
            </div>
          </GsapReveal>

          {/* Benefits + stats column */}
          <div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {benefits.map(({ icon: Icon, title, description }, i) => (
                <GsapReveal key={title} delay={0.07 * i} className="h-full">
                  <div className="lp-card h-full p-5 transition-all duration-300 hover:-translate-y-1 hover:border-teal-400/30 hover:shadow-[0_0_36px_-10px_rgba(45,212,191,0.35)]">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-400/10 text-teal-300">
                      <Icon size={20} />
                    </span>
                    <h3 className="font-heading mt-3.5 text-[15px] font-semibold text-white">
                      {title}
                    </h3>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-slate-400">
                      {description}
                    </p>
                  </div>
                </GsapReveal>
              ))}
            </div>

            {/* Stats band */}
            <GsapReveal delay={0.3}>
              <div className="relative mt-4 overflow-hidden rounded-2xl border border-teal-400/20 bg-gradient-to-br from-teal-500/[0.08] via-white/[0.04] to-sky-600/[0.08] p-6 backdrop-blur md:p-8">
                <div className="lp-grid-pattern pointer-events-none absolute inset-0 opacity-60" />
                <div className="relative grid grid-cols-3 gap-4 text-center">
                  {partnerStats.map((stat) => (
                    <div key={stat.label}>
                      <StatCounter
                        value={stat.value}
                        className="font-heading block text-xl font-bold text-teal-300 sm:text-2xl md:text-[1.7rem]"
                      />
                      <span className="mt-1 block text-[11px] font-medium leading-snug text-slate-400 md:text-xs">
                        {stat.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </GsapReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
