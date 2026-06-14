"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, Lock, Server, Eye } from "lucide-react";
import { GsapReveal, StatCounter } from "./gsap-reveal";
import { GsapTextReveal, TiltCard } from "./animation-primitives";

interface TrustItem {
  title: string;
  description: string;
}

interface TrustSectionProps {
  items: TrustItem[];
}

const complianceBadges = [
  {
    acronym: "HIPAA",
    label: "Compliant",
    icon: ShieldCheck,
    detail: "US healthcare data privacy standard",
  },
  {
    acronym: "DPDP",
    label: "Compliant",
    icon: Lock,
    detail: "India's Digital Personal Data Protection Act",
  },
  {
    acronym: "ISO 27001",
    label: "Aligned",
    icon: Server,
    detail: "Information security management",
  },
  {
    acronym: "GDPR",
    label: "Ready",
    icon: Eye,
    detail: "EU data protection regulation",
  },
];

const slaMetrics = [
  { val: "99.9%", label: "Uptime SLA" },
  { val: "256-bit", label: "Encryption" },
  { val: "<1hr", label: "Recovery Time" },
  { val: "24/7", label: "Monitoring" },
];

export function TrustSection({ items }: TrustSectionProps) {
  return (
    <section className="relative overflow-hidden bg-ink-deep py-16 md:py-24">
      <div className="lp-section-divider" />
      <div className="lp-grid-pattern pointer-events-none absolute inset-0 opacity-50" />
      <div className="pointer-events-none absolute -left-32 top-1/4 h-80 w-80 rounded-full bg-teal-500/10 blur-[120px]" />
      <div className="lp-container relative">
        <GsapReveal className="mx-auto max-w-2xl text-center">
          <span className="lp-eyebrow-dark">Compliance &amp; Certifications</span>
          <GsapTextReveal
            as="h2"
            className="font-heading mt-5 text-3xl font-bold tracking-tight text-white md:text-[2.6rem]"
            segments="Trust Built In"
          />
          <p className="mt-4 text-base leading-relaxed text-slate-400 md:text-lg">
            Healthcare data demands the highest standards. We don&apos;t
            compromise on security or compliance.
          </p>
        </GsapReveal>

        {/* Compliance badges */}
        <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {complianceBadges.map(({ acronym, label, icon: Icon, detail }, i) => (
            <GsapReveal key={acronym} delay={0.07 * i} className="h-full">
              <TiltCard max={10} className="h-full">
                <div className="group h-full rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-center backdrop-blur transition-all duration-300 hover:border-teal-400/40 hover:bg-white/[0.07]">
                  <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-teal-400/10 text-teal-300 transition-colors duration-300 group-hover:bg-teal-400/20">
                    <Icon size={22} />
                  </span>
                  <p className="font-heading mt-3.5 text-base font-bold text-white">
                    {acronym}
                  </p>
                  <p className="text-xs font-semibold uppercase tracking-wider text-teal-400">
                    {label}
                  </p>
                  <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
                    {detail}
                  </p>
                </div>
              </TiltCard>
            </GsapReveal>
          ))}
        </div>

        {/* SLA metric strip */}
        <GsapReveal delay={0.2}>
          <div className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-y-8 rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-8 sm:grid-cols-4">
            {slaMetrics.map((m) => (
              <div key={m.label} className="text-center">
                <StatCounter
                  value={m.val}
                  className="font-heading block text-2xl font-bold text-white md:text-[1.7rem]"
                />
                <span className="mt-1 block text-xs font-medium text-slate-500">
                  {m.label}
                </span>
              </div>
            ))}
          </div>
        </GsapReveal>

        <GsapReveal delay={0.3}>
          <div className="mt-10 text-center">
            <Link
              href="/compliance"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-teal-300 transition-colors duration-200 hover:text-teal-200"
            >
              View Full Compliance Documentation
              <ArrowRight
                size={16}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </GsapReveal>
      </div>
    </section>
  );
}
