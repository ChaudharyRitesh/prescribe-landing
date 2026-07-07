"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import Link from "next/link";
import {
  Check,
  ArrowRight,
  Lock,
  Sparkles,
  Loader2,
  CheckCircle2,
  Phone,
  Mail,
  Building2,
  MessageSquare,
  Stethoscope,
  ConciergeBell,
  Pill,
  FlaskConical,
  BedDouble,
  Boxes,
  Plus,
} from "lucide-react";
import { GsapReveal } from "./gsap-reveal";
import { GsapTextReveal } from "./animation-primitives";
import { useCatalogQuery } from "@/hooks/queries/useOnboarding";
import { PackageItem, ModuleItem } from "@/lib/api/types/onboarding.types";

/* ------------------------------------------------------------------ */
/*  Validation helpers                                                 */
/* ------------------------------------------------------------------ */

function validatePhone(value: string): string | null {
  const digits = value.replace(/[\s\-().+]/g, "");
  if (!digits) return "Phone number is required";
  if (!/^\d+$/.test(digits)) return "Only digits are allowed";
  if (digits.length < 10) return "Must be at least 10 digits";
  if (digits.length > 15) return "Too many digits";
  return null;
}

function validateEmail(value: string): string | null {
  if (!value.trim()) return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()))
    return "Enter a valid email address";
  return null;
}

function validateOrgName(value: string): string | null {
  if (!value.trim()) return "Organization name is required";
  if (value.trim().length < 2) return "Must be at least 2 characters";
  if (value.trim().length > 120) return "Must be 120 characters or fewer";
  return null;
}

/* ------------------------------------------------------------------ */
/*  Formatting + icons                                                 */
/* ------------------------------------------------------------------ */

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

/** Map a module slug to a representative icon. */
function moduleIcon(slug: string) {
  const key = slug.toLowerCase();
  if (key.includes("doctor")) return Stethoscope;
  if (key.includes("recept") || key.includes("queue")) return ConciergeBell;
  if (key.includes("pharm")) return Pill;
  if (key.includes("path") || key.includes("lab") || key.includes("diag"))
    return FlaskConical;
  if (key.includes("ipd") || key.includes("bed")) return BedDouble;
  return Boxes;
}

/* ------------------------------------------------------------------ */
/*  Fallbacks in case backend catalog query is loading/offline         */
/* ------------------------------------------------------------------ */

const fallbackPackages: PackageItem[] = [
  {
    _id: "starter-plan",
    slug: "starter-plan",
    label: "Starter Plan",
    tagline: "Everything a growing clinic needs to run day one",
    modules: ["reception-module", "pharmacy-module", "doctor-module", "pathlab-module"],
    pricing: { monthly: 8096, yearly: 92294 },
    badge: "Cheapest",
    isActive: true,
    order: 1,
  },
  {
    _id: "enterprise-plan",
    slug: "enterprise-plan",
    label: "Enterprise Plan",
    tagline: "Scaled capacity for busy multi-department facilities",
    modules: ["reception-module", "pharmacy-module", "doctor-module", "pathlab-module"],
    pricing: { monthly: 15296, yearly: 183557 },
    badge: "Most Popular",
    isActive: true,
    order: 2,
  },
  {
    _id: "healthcare-premium",
    slug: "healthcare-premium",
    label: "Healthcare Premium",
    tagline: "Full-suite premium tier for hospitals",
    modules: ["reception-module", "pharmacy-module", "pathlab-module", "doctor-module"],
    pricing: { monthly: 27599, yearly: 298069 },
    badge: "Premium",
    isActive: true,
    order: 3,
  },
  {
    _id: "kaero-nexus",
    slug: "kaero-nexus",
    label: "Kaero Nexus",
    tagline: "For established hospitals & poly-clinics, single or multi-branch",
    modules: ["pharmacy-module", "doctor-module", "reception-module"],
    pricing: { monthly: 0, yearly: 0 },
    features: ["All plans included in plus and enterprise", "upto 10K patients record"],
    savings: "Save ₹2999/month",
    isCustom: true,
    isActive: true,
    order: 4,
  },
];

const fallbackModules: ModuleItem[] = [
  { _id: "reception-module", slug: "reception-module", label: "Reception Module", features: ["Booking & appointments", "Queue management", "Patient history"], pricing: { monthly: 1999, yearly: 23988 }, isActive: true, order: 1 },
  { _id: "doctor-module", slug: "doctor-module", label: "Doctor Module", features: ["Auto appointment", "Fees collection", "Prescribe assists"], pricing: { monthly: 2499, yearly: 29988 }, isActive: true, order: 2 },
  { _id: "pharmacy-module", slug: "pharmacy-module", label: "Pharmacy Module", features: ["Inventory & billing", "GST invoicing", "Stock alerts"], pricing: { monthly: 2499, yearly: 29988 }, isActive: true, order: 3 },
  { _id: "pathlab-module", slug: "pathlab-module", label: "Pathlab Module", features: ["Auto test query", "E-report generation", "Fees & billing"], pricing: { monthly: 1999, yearly: 23988 }, isActive: true, order: 4 },
];

const highlights = [
  "Pricing tailored to your patient volume & workflow",
  "Choose only the modules you need",
  "Transparent — no hidden charges",
  "Dedicated onboarding & migration support",
  "Response within 24 business hours",
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function PricingSection() {
  const { data: catalog, isLoading } = useCatalogQuery();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");
  const [activeTab, setActiveTab] = useState<"packages" | "modules">("packages");

  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [orgName, setOrgName] = useState("");
  const [message, setMessage] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const customQuoteRef = useRef<HTMLDivElement | null>(null);

  const packages = useMemo(() => {
    const list =
      catalog?.packages && catalog.packages.length > 0
        ? catalog.packages.filter((p) => p.isActive)
        : fallbackPackages;
    // Keep custom/enterprise packages (e.g. kaero-nexus) — rendered as a
    // "Custom" card that routes to the quote band, sorted after standard ones.
    return [...list].sort((a, b) => a.order - b.order);
  }, [catalog]);

  const isCustomPackage = useCallback(
    (p: PackageItem) => !!p.isCustom || p.slug === "kaero-nexus",
    []
  );

  const modules = useMemo(() => {
    if (catalog?.modules && catalog.modules.length > 0) {
      return catalog.modules;
    }
    return fallbackModules;
  }, [catalog]);

  // À-la-carte list: individual purchasable modules, cheapest first.
  const alacarteModules = useMemo(
    () =>
      [...modules]
        .filter((m) => m.isActive !== false && !m.isCustom)
        .sort((a, b) => a.pricing.monthly - b.pricing.monthly),
    [modules]
  );

  const errors = useMemo(
    () => ({
      phone: validatePhone(phone),
      email: validateEmail(email),
      orgName: validateOrgName(orgName),
    }),
    [phone, email, orgName]
  );

  const isValid = !errors.phone && !errors.email && !errors.orgName;

  const markTouched = useCallback(
    (field: string) => setTouched((p) => ({ ...p, [field]: true })),
    []
  );

  const scrollToCustomQuote = () => {
    if (customQuoteRef.current) {
      customQuoteRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ phone: true, email: true, orgName: true });
    if (!isValid) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/enterprise-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: orgName.trim(),
          email: email.trim(),
          company: orgName.trim(),
          phone: phone.trim(),
          organizationName: orgName.trim(),
          inquiryType: "Enterprise Pricing",
          message:
            message.trim() ||
            "Requesting a custom pricing quotation for our organization.",
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setSubmitError(
          data?.message || "Something went wrong. Please try again."
        );
        return;
      }

      setSubmitSuccess(true);
      setPhone("");
      setEmail("");
      setOrgName("");
      setMessage("");
      setTouched({});
    } catch {
      setSubmitError("Network error. Please check your connection and retry.");
    } finally {
      setSubmitting(false);
    }
  }

  const err = (field: keyof typeof errors) =>
    touched[field] ? errors[field] : null;

  return (
    <section
      id="pricing"
      className="lp-section relative overflow-hidden bg-ink-deep"
    >
      <div className="lp-section-divider" />
      <div className="lp-grid-pattern pointer-events-none absolute inset-0 opacity-40" />
      <div className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-sky-600/10 blur-[130px]" />
      <div className="pointer-events-none absolute -right-40 bottom-40 h-[26rem] w-[26rem] rounded-full bg-teal-500/10 blur-[140px]" />

      <div className="lp-container relative">
        {/* Heading */}
        <GsapReveal className="mx-auto max-w-2xl text-center">
          <span className="lp-eyebrow">
            <Sparkles size={13} />
            Simple, Transparent Pricing
          </span>
          <GsapTextReveal
            as="h2"
            className="lp-h2 mt-5 justify-center"
            segments="Plans Designed to Scale with You"
          />
          <p className="lp-sub mt-4">
            Start with a ready-made bundle for your facility, or pick individual
            modules à la carte. No setup fees, no lock-in — switch or scale
            anytime.
          </p>

          {/* Billing toggle */}
          <div className="mt-8 flex justify-center">
            <div
              className="inline-flex items-center rounded-xl border border-white/10 bg-white/[0.05] p-1 backdrop-blur"
              role="group"
              aria-label="Billing cycle"
            >
              <button
                onClick={() => setBillingCycle("monthly")}
                aria-pressed={billingCycle === "monthly"}
                className={`cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                  billingCycle === "monthly"
                    ? "bg-sky-600 text-white shadow-[0_6px_16px_-4px_rgba(2,132,199,0.5)]"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                aria-pressed={billingCycle === "yearly"}
                className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                  billingCycle === "yearly"
                    ? "bg-sky-600 text-white shadow-[0_6px_16px_-4px_rgba(2,132,199,0.5)]"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Yearly
                <span
                  className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                    billingCycle === "yearly"
                      ? "bg-teal-300 text-slate-900"
                      : "bg-teal-400/15 text-teal-300"
                  }`}
                >
                  −20%
                </span>
              </button>
            </div>
          </div>
        </GsapReveal>

        {/* Tab switcher */}
        <GsapReveal className="mt-9 flex justify-center">
          <div
            className="inline-flex items-center rounded-2xl border border-white/10 bg-white/[0.04] p-1 backdrop-blur"
            role="tablist"
            aria-label="Pricing view"
          >
            <button
              role="tab"
              aria-selected={activeTab === "packages"}
              onClick={() => setActiveTab("packages")}
              className={`flex cursor-pointer items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all duration-200 ${
                activeTab === "packages"
                  ? "bg-white/[0.09] text-white shadow-[0_4px_16px_-6px_rgba(2,6,23,0.9)]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Boxes size={16} />
              Packages
              <span className="hidden rounded-md bg-teal-400/15 px-1.5 py-0.5 text-[10px] font-bold text-teal-300 sm:inline">
                Save more
              </span>
            </button>
            <button
              role="tab"
              aria-selected={activeTab === "modules"}
              onClick={() => setActiveTab("modules")}
              className={`flex cursor-pointer items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all duration-200 ${
                activeTab === "modules"
                  ? "bg-white/[0.09] text-white shadow-[0_4px_16px_-6px_rgba(2,6,23,0.9)]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Plus size={16} />
              Individual Modules
            </button>
          </div>
        </GsapReveal>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 size={36} className="animate-spin text-teal-300" />
          </div>
        ) : activeTab === "packages" ? (
          /* ------------------------------------------------------ */
          /*  Packages tab                                          */
          /* ------------------------------------------------------ */
          <div className="mt-10 lg:mt-12">
            <div className="flex flex-wrap justify-center gap-5">
              {packages.map((pkg, i) => {
                const custom = isCustomPackage(pkg);
                const isPro =
                  !custom &&
                  (pkg.slug === "clinic-pro" ||
                    /best value/i.test(pkg.badge || ""));
                const yearlyMonthlyEquivalent = Math.round(
                  pkg.pricing.yearly / 12
                );
                const displayPrice =
                  billingCycle === "monthly"
                    ? pkg.pricing.monthly
                    : yearlyMonthlyEquivalent;

                return (
                  <GsapReveal
                    key={pkg._id}
                    delay={0.06 * i}
                    className="h-full w-full sm:w-[calc(50%-10px)] xl:w-[calc(25%-15px)]"
                  >
                    <div
                      className={`relative flex h-full flex-col rounded-2xl border p-6 backdrop-blur transition-all duration-300 hover:-translate-y-1.5 ${
                        isPro
                          ? "border-teal-400/50 bg-white/[0.07] shadow-[0_0_48px_-12px_rgba(45,212,191,0.4)]"
                          : custom
                          ? "border-dashed border-white/20 bg-white/[0.02] hover:border-teal-400/40 hover:bg-white/[0.05]"
                          : "border-white/10 bg-white/[0.04] hover:border-white/20 hover:shadow-[0_24px_48px_-20px_rgba(2,6,23,0.9)]"
                      }`}
                    >
                      {pkg.badge && (
                        <span
                          className={`absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider shadow-sm ${
                            isPro
                              ? "bg-gradient-to-r from-teal-400 to-sky-500 text-slate-950"
                              : "bg-white/10 text-slate-200 backdrop-blur"
                          }`}
                        >
                          {pkg.badge}
                        </span>
                      )}

                      <h4 className="font-heading text-lg font-bold text-white">
                        {pkg.label}
                      </h4>
                      <p className="mt-1.5 min-h-[2.5rem] text-[13px] leading-snug text-slate-400">
                        {pkg.tagline}
                      </p>

                      {custom ? (
                        <>
                          <div className="mt-5 flex items-baseline">
                            <span className="font-heading text-[2.1rem] font-extrabold tracking-tight text-white">
                              Custom
                            </span>
                          </div>
                          <p className="mt-1 text-xs font-medium text-slate-500">
                            Tailored quote for your scale
                          </p>
                        </>
                      ) : (
                        <>
                          <div className="mt-5 flex items-baseline">
                            <span className="font-heading text-[2.1rem] font-extrabold tracking-tight text-white">
                              {inr(displayPrice)}
                            </span>
                            <span className="ml-1 text-sm font-medium text-slate-500">
                              /month
                            </span>
                          </div>
                          {billingCycle === "yearly" ? (
                            <p className="mt-1 text-xs font-medium text-slate-500">
                              Billed annually at {inr(pkg.pricing.yearly)}
                            </p>
                          ) : (
                            <div className="mt-1 h-4" />
                          )}
                          {pkg.savings && billingCycle === "yearly" && (
                            <span className="mt-3 inline-flex self-start rounded-md border border-teal-400/30 bg-teal-400/10 px-2 py-0.5 text-[10px] font-bold text-teal-300">
                              {pkg.savings}
                            </span>
                          )}
                        </>
                      )}

                      <hr className="my-5 border-white/[0.08]" />

                      <div className="flex-1">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                          {custom
                            ? "Everything, unlimited"
                            : `${pkg.modules.length} modules included`}
                        </p>
                        <ul className="mt-3 space-y-2.5">
                          {(custom && pkg.modules.length === 0
                            ? [
                                "Unlimited doctors & staff",
                                "Dedicated account manager",
                                "Custom integrations & SLAs",
                              ]
                            : pkg.modules.map((mSlug) => {
                                const mod = modules.find(
                                  (m) => m.slug === mSlug
                                );
                                return mod?.label || mSlug;
                              })
                          ).map((label) => (
                            <li
                              key={label}
                              className="flex items-start gap-2.5"
                            >
                              <span
                                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                                  custom
                                    ? "bg-white/[0.08] text-slate-400"
                                    : "bg-teal-400/15 text-teal-300"
                                }`}
                              >
                                <Check size={12} strokeWidth={3} />
                              </span>
                              <span className="text-sm font-medium text-slate-300">
                                {label}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {custom ? (
                        <button
                          onClick={scrollToCustomQuote}
                          className="mt-6 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/20 py-3 text-sm font-bold text-white transition-all duration-200 hover:bg-white hover:text-slate-950"
                        >
                          Contact Sales
                        </button>
                      ) : (
                        <Link
                          href={`/onboarding?package=${pkg.slug}`}
                          className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all duration-200 ${
                            isPro
                              ? "bg-gradient-to-r from-teal-400 to-sky-500 text-slate-950 shadow-[0_10px_24px_-8px_rgba(45,212,191,0.6)] hover:shadow-[0_14px_32px_-8px_rgba(45,212,191,0.75)]"
                              : "border border-white/[0.15] text-slate-200 hover:border-teal-400/50 hover:text-teal-300"
                          }`}
                        >
                          Get Started
                          <ArrowRight size={16} />
                        </Link>
                      )}
                    </div>
                  </GsapReveal>
                );
              })}
            </div>
          </div>
        ) : (
          /* ------------------------------------------------------ */
          /*  Individual modules tab                                */
          /* ------------------------------------------------------ */
          <div className="mt-10 lg:mt-12">
            <GsapReveal className="mb-7 flex flex-wrap items-end justify-between gap-4">
              <p className="max-w-xl text-sm text-slate-400">
                Pick only the modules you need and pay per module. Prices shown
                are per {billingCycle === "monthly" ? "month" : "year"}. Bundle
                2+ into a package to save up to 20%.
              </p>
              <Link
                href="/onboarding"
                className="inline-flex items-center gap-2 rounded-xl border border-white/[0.15] px-5 py-2.5 text-sm font-bold text-slate-200 transition-all duration-200 hover:border-teal-400/50 hover:text-teal-300"
              >
                <Plus size={16} />
                Build a custom bundle
              </Link>
            </GsapReveal>

            <div className="flex flex-wrap justify-center gap-4">
              {alacarteModules.map((mod, i) => {
                const Icon = moduleIcon(mod.slug);
                const price =
                  billingCycle === "monthly"
                    ? mod.pricing.monthly
                    : mod.pricing.yearly;
                return (
                  <GsapReveal
                    key={mod._id || mod.slug}
                    delay={0.04 * i}
                    className="h-full w-full sm:w-[calc(50%-8px)] xl:w-[calc(33.333%-11px)]"
                  >
                    <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-teal-400/40 hover:bg-white/[0.06]">
                      <div className="flex items-start justify-between gap-3">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-teal-400/20 bg-teal-400/10 text-teal-300">
                          <Icon size={20} />
                        </span>
                        <div className="text-right">
                          <p className="font-heading text-xl font-extrabold text-white">
                            {inr(price)}
                          </p>
                          <p className="text-[11px] font-medium text-slate-500">
                            /{billingCycle === "monthly" ? "month" : "year"}
                          </p>
                        </div>
                      </div>
                      <h4 className="font-heading mt-4 text-base font-bold text-white">
                        {mod.label}
                      </h4>
                      {(() => {
                        const subtitle =
                          mod.description ||
                          (mod.features && mod.features.length
                            ? mod.features.join(" · ")
                            : "");
                        return subtitle ? (
                          <p className="mt-1 flex-1 text-[13px] leading-snug text-slate-400">
                            {subtitle}
                          </p>
                        ) : (
                          <div className="flex-1" />
                        );
                      })()}
                      <Link
                        href={`/onboarding?module=${mod.slug}`}
                        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.15] py-2.5 text-sm font-bold text-slate-200 transition-all duration-200 hover:border-teal-400/50 hover:text-teal-300"
                      >
                        Add module
                        <ArrowRight size={15} />
                      </Link>
                    </div>
                  </GsapReveal>
                );
              })}
            </div>

            <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-xs font-medium text-slate-500">
              <Sparkles size={13} className="text-teal-300" />
              GST applicable · billed via secure Razorpay · switch or cancel anytime
            </p>
          </div>
        )}

        {/* ------------------------------------------------------ */}
        {/*  Enterprise + custom quote                             */}
        {/* ------------------------------------------------------ */}
        <div ref={customQuoteRef} className="mt-16 md:mt-24">
          <GsapReveal>
            <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] shadow-[0_48px_96px_-40px_rgba(2,6,23,0.95)] backdrop-blur">
              <div className="pointer-events-none absolute -right-28 -top-28 h-80 w-80 rounded-full bg-sky-600/15 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-28 -left-28 h-80 w-80 rounded-full bg-teal-500/15 blur-3xl" />

              <div className="relative grid grid-cols-1 lg:grid-cols-[2fr_3fr]">
                {/* Info panel */}
                <div className="border-b border-white/10 bg-gradient-to-br from-teal-500/[0.12] via-transparent to-sky-600/[0.10] p-7 md:p-10 lg:border-b-0 lg:border-r">
                  <span className="lp-eyebrow">Enterprise &amp; Custom</span>
                  <h3 className="font-heading mt-5 text-2xl font-bold tracking-tight text-white md:text-[1.75rem]">
                    Running at hospital scale?
                  </h3>
                  <p className="mt-3 leading-relaxed text-slate-400">
                    For large hospital chains and multi-location networks, we
                    scope only what you need — unlimited staff, custom
                    integrations, and dedicated SLAs — so you never overpay for
                    capacity you won&apos;t use.
                  </p>
                  <ul className="mt-8 space-y-3.5">
                    {highlights.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 rounded-xl border border-white/[0.07] bg-white/[0.04] px-4 py-3"
                      >
                        <CheckCircle2
                          size={18}
                          className="mt-0.5 shrink-0 text-teal-300"
                        />
                        <span className="text-sm leading-relaxed text-slate-300">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Form panel */}
                <div className="p-7 md:p-10">
                  {submitSuccess ? (
                    <div className="flex h-full flex-col items-center justify-center py-10 text-center">
                      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-sky-500 shadow-[0_12px_32px_-8px_rgba(45,212,191,0.6)]">
                        <Check size={30} className="text-slate-950" strokeWidth={3} />
                      </span>
                      <h3 className="font-heading mt-5 text-xl font-bold text-white">
                        Request Received
                      </h3>
                      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-slate-400">
                        Our team will review your details and reach out within
                        24 hours with a tailored proposal.
                      </p>
                      <button
                        onClick={() => setSubmitSuccess(false)}
                        className="lp-btn-secondary mt-6 cursor-pointer text-sm"
                      >
                        Submit another request
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} noValidate>
                      <h3 className="font-heading text-xl font-bold text-white">
                        Request a Custom Quote
                      </h3>
                      <p className="mt-1.5 text-sm text-slate-400">
                        For facilities with specialized volume, customized
                        module bundles, or multi-location configurations.
                      </p>

                      <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label htmlFor="quote-phone" className="lp-label">
                            Phone Number
                          </label>
                          <div className="relative">
                            <Phone
                              size={15}
                              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                            />
                            <input
                              id="quote-phone"
                              type="tel"
                              autoComplete="tel"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              onBlur={() => markTouched("phone")}
                              aria-invalid={!!err("phone")}
                              className={`lp-input pl-10 ${
                                err("phone")
                                  ? "border-rose-400/60 focus:border-rose-400 focus:ring-rose-400/20"
                                  : ""
                              }`}
                            />
                          </div>
                          {err("phone") && (
                            <p className="mt-1.5 text-xs font-medium text-rose-400">
                              {err("phone")}
                            </p>
                          )}
                        </div>

                        <div>
                          <label htmlFor="quote-email" className="lp-label">
                            Work Email
                          </label>
                          <div className="relative">
                            <Mail
                              size={15}
                              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                            />
                            <input
                              id="quote-email"
                              type="email"
                              autoComplete="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              onBlur={() => markTouched("email")}
                              aria-invalid={!!err("email")}
                              className={`lp-input pl-10 ${
                                err("email")
                                  ? "border-rose-400/60 focus:border-rose-400 focus:ring-rose-400/20"
                                  : ""
                              }`}
                            />
                          </div>
                          {err("email") && (
                            <p className="mt-1.5 text-xs font-medium text-rose-400">
                              {err("email")}
                            </p>
                          )}
                        </div>

                        <div className="sm:col-span-2">
                          <label htmlFor="quote-org" className="lp-label">
                            Organization / Facility
                          </label>
                          <div className="relative">
                            <Building2
                              size={15}
                              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                            />
                            <input
                              id="quote-org"
                              autoComplete="organization"
                              value={orgName}
                              onChange={(e) => setOrgName(e.target.value)}
                              onBlur={() => markTouched("orgName")}
                              aria-invalid={!!err("orgName")}
                              className={`lp-input pl-10 ${
                                err("orgName")
                                  ? "border-rose-400/60 focus:border-rose-400 focus:ring-rose-400/20"
                                  : ""
                              }`}
                            />
                          </div>
                          {err("orgName") && (
                            <p className="mt-1.5 text-xs font-medium text-rose-400">
                              {err("orgName")}
                            </p>
                          )}
                        </div>

                        <div className="sm:col-span-2">
                          <label htmlFor="quote-message" className="lp-label">
                            Additional details{" "}
                            <span className="font-normal text-slate-500">
                              (optional)
                            </span>
                          </label>
                          <div className="relative">
                            <MessageSquare
                              size={15}
                              className="pointer-events-none absolute left-3.5 top-3.5 text-slate-500"
                            />
                            <textarea
                              id="quote-message"
                              rows={3}
                              value={message}
                              onChange={(e) => setMessage(e.target.value)}
                              placeholder="Tell us about your facility size, doctor count, or custom integrations required..."
                              className="lp-input resize-none pl-10"
                            />
                          </div>
                        </div>
                      </div>

                      {submitError && (
                        <p className="mt-4 text-sm font-medium text-rose-400">
                          {submitError}
                        </p>
                      )}

                      <button
                        type="submit"
                        disabled={submitting}
                        className="mt-6 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-400 to-sky-500 px-7 py-3.5 text-sm font-bold text-slate-950 shadow-[0_12px_28px_-8px_rgba(45,212,191,0.6)] transition-all duration-200 hover:shadow-[0_16px_36px_-8px_rgba(45,212,191,0.75)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60 md:text-base"
                      >
                        {submitting ? (
                          <>
                            Sending Inquiry…
                            <Loader2 size={18} className="animate-spin" />
                          </>
                        ) : (
                          <>
                            Submit Quote Request
                            <ArrowRight size={18} />
                          </>
                        )}
                      </button>

                      <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs font-medium text-slate-500">
                        <Lock size={12} />
                        Your data is fully secure. We respond within 24 business hours.
                      </p>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </GsapReveal>
        </div>
      </div>
    </section>
  );
}
