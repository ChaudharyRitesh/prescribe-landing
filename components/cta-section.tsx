"use client";

import Link from "next/link";
import { ArrowRight, PlayCircle, ShieldCheck, Clock4, Headset } from "lucide-react";
import { GsapReveal } from "./gsap-reveal";

interface CTAData {
  title?: string;
  description?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  footerText?: string;
}

interface CTASectionProps {
  data: CTAData | null;
}

const assurances = [
  { icon: ShieldCheck, label: "HIPAA & DPDP compliant" },
  { icon: Clock4, label: "Go live in days, not months" },
  { icon: Headset, label: "Dedicated onboarding team" },
];

export function CTASection({ data }: CTASectionProps) {
  const title =
    data?.title || "Ready to Transform Your Healthcare Operations?";
  const description =
    data?.description ||
    "Join forward-thinking healthcare organizations already using KaeroPrescribe to reduce costs, improve patient care, and scale with confidence.";

  return (
    <section className="relative overflow-hidden bg-ink-deep py-20 md:py-28">
      <div className="lp-section-divider" />
      <div className="lp-grid-pattern pointer-events-none absolute inset-0 opacity-60" />
      <div className="pointer-events-none absolute -top-24 right-[15%] h-96 w-96 rounded-full bg-teal-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-32 left-[10%] h-80 w-80 rounded-full bg-sky-600/10 blur-[110px]" />

      <div className="lp-container relative">
        <GsapReveal className="mx-auto max-w-3xl text-center">
          <span className="lp-eyebrow-dark">Get Started</span>

          <h2 className="font-heading mt-6 text-3xl font-bold tracking-tight text-white md:text-[2.75rem] md:leading-[1.12]">
            {title}
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-300 md:text-lg">
            {description}
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
            <Link href="/onboarding" className="lp-btn-primary">
              {data?.primaryButtonText || "Get Started Free"}
              <ArrowRight size={18} />
            </Link>
            <a href="#features" className="lp-btn-ghost-dark">
              <PlayCircle size={18} />
              {data?.secondaryButtonText || "Watch Demo"}
            </a>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-t border-white/10 pt-8">
            {assurances.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-2 text-[13px] font-medium text-slate-400"
              >
                <Icon size={15} className="text-teal-400" />
                {label}
              </span>
            ))}
          </div>
        </GsapReveal>
      </div>
    </section>
  );
}
