"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  PlayCircle,
  ShieldCheck,
  Activity,
  FileCheck2,
  Stethoscope,
} from "lucide-react";
import { urlFor } from "@/lib/sanity";
import { StatCounter } from "./gsap-reveal";
import {
  GsapTextReveal,
  MagneticButton,
  TiltCard,
} from "./animation-primitives";
import type { HeroSection as HeroSectionType } from "@/lib/sanity.types";

const ThreeHeroBackground = dynamic(() => import("./three-hero-background"), {
  ssr: false,
});

interface HeroSectionProps {
  data: HeroSectionType | null;
}

const heroStats = [
  { value: "500+", label: "Facilities Empowered" },
  { value: "99.9%", label: "Uptime SLA" },
  { value: "24/7", label: "Monitoring & Support" },
];

const trustChips = [
  { icon: ShieldCheck, label: "HIPAA & DPDP Compliant" },
  { icon: FileCheck2, label: "ISO 27001 Aligned" },
  { icon: Activity, label: "AI-Native Intelligence" },
];

export function HeroSection({ data }: HeroSectionProps) {
  const prefersReduced = useReducedMotion();

  const title = data?.title || "The AI Operating System";
  const subtitle = data?.subtitle || "for Modern Healthcare";
  const description =
    "KaeroPrescribe unifies prescribing, pharmacy, diagnostics, and operations into one regulated-ready platform — so your teams treat patients, not software.";

  const heroImage =
    data?.slides && data.slides.length > 0 && data.slides[0]?.image
      ? urlFor(data.slides[0].image).width(1600).height(1000).url()
      : "/dashboard-monitor.png";

  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: prefersReduced ? 0 : 28 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: prefersReduced ? 0 : 0.7,
      delay: prefersReduced ? 0 : delay,
      ease: "easeOut" as const,
    },
  });

  return (
    <section className="relative overflow-hidden bg-ink-deep">
      {/* Layered backdrop: three.js wave + grid + radial glows */}
      <ThreeHeroBackground />
      <div className="lp-grid-pattern pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[34rem] w-[60rem] -translate-x-1/2 rounded-full bg-sky-600/15 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-0 right-[-10%] h-[26rem] w-[34rem] rounded-full bg-teal-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ink-deep" />

      <div className="lp-container relative z-10 pb-20 pt-16 md:pb-28 md:pt-24 lg:pt-28">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-12">
          {/* Copy column */}
          <div>
            <motion.div {...fadeUp(0)}>
              <span className="lp-eyebrow-dark">
                <Stethoscope size={14} />
                Built for Regulated Healthcare
              </span>
            </motion.div>

            <GsapTextReveal
              as="h1"
              immediate
              delay={0.12}
              stagger={0.05}
              className="font-heading mt-6 text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.4rem]"
              segments={[
                { text: title },
                {
                  text: subtitle,
                  className:
                    "bg-gradient-to-r from-teal-300 via-sky-300 to-sky-400 bg-clip-text text-transparent",
                },
              ]}
            />

            <motion.p
              {...fadeUp(0.16)}
              className="mt-6 max-w-xl text-base leading-relaxed text-slate-300 md:text-lg"
            >
              {description}
            </motion.p>

            {/* CTAs */}
            <motion.div
              {...fadeUp(0.24)}
              className="mt-9 flex flex-col gap-3.5 sm:flex-row"
            >
              <MagneticButton strength={0.5}>
                <Link href="/onboarding" className="lp-btn-primary">
                  Get Started Free
                  <ArrowRight size={18} />
                </Link>
              </MagneticButton>
              <a href="#features" className="lp-btn-ghost-dark">
                <PlayCircle size={18} />
                Watch Platform Demo
              </a>
            </motion.div>

            {/* Compliance trust chips */}
            <motion.div
              {...fadeUp(0.32)}
              className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3"
            >
              {trustChips.map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-2 text-[13px] font-medium text-slate-400"
                >
                  <Icon size={15} className="text-teal-400" />
                  {label}
                </span>
              ))}
            </motion.div>

            {/* Stat counters */}
            <motion.div
              {...fadeUp(0.4)}
              className="mt-10 grid max-w-lg grid-cols-3 gap-6 border-t border-white/10 pt-8"
            >
              {heroStats.map((stat) => (
                <div key={stat.label}>
                  <StatCounter
                    value={stat.value}
                    className="font-heading block text-2xl font-bold text-white md:text-3xl"
                  />
                  <span className="mt-1 block text-xs font-medium leading-snug text-slate-400 md:text-[13px]">
                    {stat.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Product column */}
          <motion.div
            initial={{ opacity: 0, y: prefersReduced ? 0 : 40, scale: prefersReduced ? 1 : 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: prefersReduced ? 0 : 0.9,
              delay: prefersReduced ? 0 : 0.3,
              ease: "easeOut",
            }}
            className="relative mx-auto w-full max-w-2xl"
          >
            {/* Glow halo behind frame */}
            <div className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-gradient-to-tr from-teal-500/20 via-sky-500/10 to-transparent blur-2xl" />

            {/* Browser-style frame — tilts toward cursor for depth */}
            <TiltCard max={6} className="relative">
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 shadow-[0_40px_80px_-24px_rgba(2,6,23,0.9)] backdrop-blur">
                <div className="flex items-center gap-2 border-b border-white/10 bg-slate-950/60 px-4 py-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                  <span className="ml-3 hidden flex-1 items-center justify-center sm:flex">
                    <span className="rounded-md bg-white/5 px-4 py-1 text-[11px] font-medium tracking-wide text-slate-400">
                      app.kaeroprescribe.com
                    </span>
                  </span>
                </div>
                <img
                  src={heroImage}
                  alt="KaeroPrescribe clinical dashboard"
                  className="block aspect-[16/10] w-full object-cover"
                />
              </div>
            </TiltCard>

            {/* Floating proof card: e-prescription */}
            <motion.div
              initial={{ opacity: 0, y: prefersReduced ? 0 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: prefersReduced ? 0 : 0.6, delay: prefersReduced ? 0 : 0.9 }}
              className="absolute -left-4 top-10 hidden md:block lg:-left-10"
            >
              <div className="animate-float rounded-xl border border-white/10 bg-slate-900/90 p-3.5 shadow-xl backdrop-blur">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-500/15 text-teal-300">
                    <FileCheck2 size={18} />
                  </span>
                  <div>
                    <p className="text-[13px] font-semibold text-white">
                      e-Prescription issued
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Signed &amp; dispatched in 14s
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Floating proof card: uptime */}
            <motion.div
              initial={{ opacity: 0, y: prefersReduced ? 0 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: prefersReduced ? 0 : 0.6, delay: prefersReduced ? 0 : 1.05 }}
              className="absolute -bottom-6 right-2 hidden md:block lg:-right-6"
            >
              <div
                className="animate-float rounded-xl border border-white/10 bg-slate-900/90 p-3.5 shadow-xl backdrop-blur"
                style={{ animationDelay: "-1.5s" }}
              >
                <div className="flex items-center gap-3">
                  <span className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-300">
                    <Activity size={18} />
                  </span>
                  <div>
                    <p className="text-[13px] font-semibold text-white">
                      All systems operational
                    </p>
                    <p className="text-[11px] text-slate-400">
                      99.9% uptime, monitored 24/7
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
