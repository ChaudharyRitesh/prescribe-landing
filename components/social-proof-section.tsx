"use client";

import {
  ShieldCheck,
  Lock,
  FileCheck2,
  Activity,
  Workflow,
  BadgeCheck,
  KeyRound,
  Gauge,
  HeartPulse,
} from "lucide-react";

const credentials = [
  { icon: ShieldCheck, label: "HIPAA Compliant" },
  { icon: Lock, label: "ISO 27001 Aligned" },
  { icon: FileCheck2, label: "DPDP Act 2023" },
  { icon: HeartPulse, label: "ABDM Ready" },
  { icon: Workflow, label: "HL7 FHIR Interop" },
  { icon: BadgeCheck, label: "NABH Aligned" },
  { icon: KeyRound, label: "256-bit Encryption" },
  { icon: Gauge, label: "99.9% Uptime SLA" },
  { icon: Activity, label: "SOC 2 Type II" },
];

export function SocialProofSection() {
  // Duplicate the track so the -50% marquee loop is seamless
  const track = [...credentials, ...credentials];

  return (
    <section className="relative border-y border-white/[0.06] bg-ink-deep py-12">
      <div className="lp-container">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Built to the standards regulated healthcare demands
        </p>
      </div>

      {/* Marquee */}
      <div className="group relative mt-8 overflow-hidden">
        {/* Edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-ink-deep to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-ink-deep to-transparent" />

        <div className="flex w-max animate-marquee gap-4 group-hover:[animation-play-state:paused]">
          {track.map(({ icon: Icon, label }, idx) => (
            <span
              key={`${label}-${idx}`}
              className="inline-flex shrink-0 items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-slate-300 backdrop-blur"
            >
              <Icon size={16} className="text-teal-400" />
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
