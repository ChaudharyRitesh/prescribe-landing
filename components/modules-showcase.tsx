"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Pill,
  Stethoscope,
  CalendarClock,
  Microscope,
  Check,
  ArrowRight,
} from "lucide-react";
import { GsapReveal } from "./gsap-reveal";
import { GsapTextReveal } from "./animation-primitives";
import Link from "next/link";

interface Module {
  title: string;
  description: string;
  icon?: string;
  image?: {
    imageUpload?: any;
    imageUrl?: string;
  };
  features?: string[];
}

interface ModulesShowcaseProps {
  modules: Module[];
}

const defaultModules = [
  {
    title: "Pharmacy Admin",
    short: "Inventory, billing & supply chain",
    description:
      "Complete inventory management, order processing, supplier integration, and sales analytics with integrated billing and secure payments.",
    icon: Pill,
    features: [
      "Inventory management",
      "Order processing",
      "Supplier integration",
      "Sales analytics",
      "Integrated billing",
      "Secure payments",
    ],
  },
  {
    title: "Doctor's Portal",
    short: "e-Prescribing & clinical decisions",
    description:
      "Unified patient management with e-prescriptions, appointment scheduling, telemedicine, clinical decision support, and medicine alerts.",
    icon: Stethoscope,
    features: [
      "Patient history",
      "E-prescriptions",
      "Appointment scheduling",
      "Telemedicine integration",
      "Clinical decision support",
      "Medicine suggestions & alerts",
    ],
  },
  {
    title: "Reception & Ops",
    short: "Queues, scheduling & staff",
    description:
      "Smart queue management, appointment scheduling, patient check-in/out, staff management, notifications, and operational reporting.",
    icon: CalendarClock,
    features: [
      "Appointment scheduling",
      "Patient check-in/out",
      "Queue management",
      "Notifications & reminders",
      "Staff management",
      "Reporting & analytics",
    ],
  },
  {
    title: "Lab Dashboard",
    short: "Diagnostics & digital reports",
    description:
      "Analyzer interfacing, quality control with abnormal result alerts, and secure digital report delivery to patients.",
    icon: Microscope,
    features: [
      "Analyzer interfacing",
      "Quality control & alerts",
      "Digital report delivery",
    ],
  },
];

export function ModulesShowcase({ modules }: ModulesShowcaseProps) {
  const [activeTab, setActiveTab] = useState(0);
  const prefersReduced = useReducedMotion();
  const active = defaultModules[activeTab];
  const ActiveIcon = active.icon;

  return (
    <section
      id="modules"
      className="lp-section relative overflow-hidden bg-ink-deep"
    >
      <div className="lp-section-divider" />
      <div className="lp-grid-pattern pointer-events-none absolute inset-0 opacity-40" />
      <div className="pointer-events-none absolute -right-40 top-10 h-[26rem] w-[26rem] rounded-full bg-teal-500/10 blur-[130px]" />

      <div className="lp-container relative">
        <GsapReveal className="mx-auto max-w-2xl text-center">
          <span className="lp-eyebrow">Platform Modules</span>
          <GsapTextReveal
            as="h2"
            className="lp-h2 mt-5 justify-center"
            segments="Four Modules. One Unified Clinical Core."
          />
          <p className="lp-sub mt-4">
            Each module runs as a complete standalone solution while staying
            deeply interconnected through a unified data architecture.
          </p>
        </GsapReveal>

        <GsapReveal
          delay={0.1}
          className="mt-12 grid grid-cols-1 gap-6 lg:mt-16 lg:grid-cols-[minmax(0,21rem)_1fr] lg:gap-10"
        >
          {/* Vertical module switcher */}
          <div
            className="flex gap-3 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0"
            role="tablist"
            aria-label="Platform modules"
          >
            {defaultModules.map((m, i) => {
              const Icon = m.icon;
              const selected = i === activeTab;
              return (
                <button
                  key={m.title}
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setActiveTab(i)}
                  className={`group flex min-w-[15rem] cursor-pointer items-center gap-4 rounded-2xl border p-4 text-left transition-all duration-200 lg:min-w-0 ${
                    selected
                      ? "border-teal-400/40 bg-white/[0.06] shadow-[0_0_32px_-8px_rgba(45,212,191,0.35)]"
                      : "border-white/[0.08] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]"
                  }`}
                >
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors duration-200 ${
                      selected
                        ? "bg-gradient-to-br from-teal-400 to-sky-500 text-slate-950 shadow-[0_8px_20px_-6px_rgba(45,212,191,0.5)]"
                        : "bg-white/[0.06] text-slate-400 group-hover:text-teal-300"
                    }`}
                  >
                    <Icon size={20} />
                  </span>
                  <span>
                    <span
                      className={`font-heading block text-[15px] font-semibold ${
                        selected ? "text-white" : "text-slate-300"
                      }`}
                    >
                      {m.title}
                    </span>
                    <span className="mt-0.5 block text-xs text-slate-500">
                      {m.short}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Detail panel */}
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_32px_64px_-28px_rgba(2,6,23,0.9)] backdrop-blur md:p-9">
            <div className="pointer-events-none absolute right-0 top-0 h-56 w-56 rounded-full bg-sky-600/15 blur-3xl" />
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: prefersReduced ? 0 : 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: prefersReduced ? 0 : -10 }}
                transition={{ duration: prefersReduced ? 0 : 0.28, ease: "easeOut" }}
                className="relative"
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 to-sky-500 text-slate-950 shadow-[0_10px_24px_-8px_rgba(45,212,191,0.55)]">
                    <ActiveIcon size={22} />
                  </span>
                  <h3 className="font-heading text-xl font-bold text-white md:text-2xl">
                    {active.title}
                  </h3>
                </div>

                <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-400">
                  {active.description}
                </p>

                <ul className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {active.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.04] px-4 py-3 transition-colors duration-200 hover:border-teal-400/30"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-400/15 text-teal-300">
                        <Check size={12} strokeWidth={3} />
                      </span>
                      <span className="text-sm font-medium text-slate-200">
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/onboarding"
                  className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-teal-300 transition-colors duration-200 hover:text-teal-200"
                >
                  Deploy this module
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        </GsapReveal>
      </div>
    </section>
  );
}
