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
/*  Fallbacks in case backend catalog query is loading/offline         */
/* ------------------------------------------------------------------ */

const fallbackPackages: PackageItem[] = [
  {
    _id: "starter",
    slug: "clinic-starter",
    label: "Clinic Starter",
    tagline: "Perfect for small clinics getting started",
    modules: ["doctors", "receptionist"],
    pricing: { monthly: 1199, yearly: 11990 },
    savings: "Save ₹299/mo vs individual",
    badge: "Most Popular",
    isActive: true,
    order: 1,
  },
  {
    _id: "pro",
    slug: "clinic-pro",
    label: "Clinic Pro",
    tagline: "Complete outpatient care including pharmacy",
    modules: ["doctors", "receptionist", "pharmacy"],
    pricing: { monthly: 1999, yearly: 19990 },
    savings: "Save ₹298/mo vs individual",
    badge: "Best Value",
    isActive: true,
    order: 2,
  },
  {
    _id: "lab",
    slug: "lab-focus",
    label: "Lab & Diagnostics",
    tagline: "Dedicated diagnostic center setup",
    modules: ["pathlab", "receptionist"],
    pricing: { monthly: 1199, yearly: 11990 },
    savings: "Save ₹199/mo vs individual",
    badge: "",
    isActive: true,
    order: 3,
  },
  {
    _id: "full",
    slug: "full-suite",
    label: "Full Suite",
    tagline: "Everything you need for a full hospital",
    modules: ["doctors", "receptionist", "pharmacy", "pathlab", "ipd"],
    pricing: { monthly: 3999, yearly: 39990 },
    savings: "Save ₹696/mo vs individual",
    badge: "",
    isActive: true,
    order: 4,
  },
];

const fallbackModules: ModuleItem[] = [
  { _id: "1", slug: "doctors", label: "Doctors & Consultation", pricing: { monthly: 999, yearly: 9990 }, isActive: true, order: 1 },
  { _id: "2", slug: "receptionist", label: "Reception & Queue", pricing: { monthly: 499, yearly: 4990 }, isActive: true, order: 2 },
  { _id: "3", slug: "pharmacy", label: "Pharmacy", pricing: { monthly: 799, yearly: 7990 }, isActive: true, order: 3 },
  { _id: "4", slug: "pathlab", label: "Pathlab / Diagnostics", pricing: { monthly: 899, yearly: 8990 }, isActive: true, order: 4 },
  { _id: "5", slug: "ipd", label: "IPD Management", pricing: { monthly: 1499, yearly: 14990 }, isActive: true, order: 5 },
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
    if (catalog?.packages && catalog.packages.length > 0) {
      return catalog.packages.filter((p) => p.isActive).sort((a, b) => a.order - b.order);
    }
    return fallbackPackages;
  }, [catalog]);

  const modules = useMemo(() => {
    if (catalog?.modules && catalog.modules.length > 0) {
      return catalog.modules;
    }
    return fallbackModules;
  }, [catalog]);

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
            Choose a standard package suited to your facility type, or design a
            custom workflow. Select a plan below to fast-track your setup.
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

        {/* Cards */}
        <div className="mt-12 lg:mt-16">
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 size={36} className="animate-spin text-teal-300" />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-5">
              {packages.map((pkg, i) => {
                const isPro = pkg.slug === "clinic-pro";
                const monthlyPrice = pkg.pricing.monthly;
                const yearlyMonthlyEquivalent = Math.round(pkg.pricing.yearly / 12);

                return (
                  <GsapReveal key={pkg._id} delay={0.06 * i} className="h-full">
                    <div
                      className={`relative flex h-full flex-col rounded-2xl border p-6 backdrop-blur transition-all duration-300 hover:-translate-y-1.5 ${
                        isPro
                          ? "border-teal-400/50 bg-white/[0.07] shadow-[0_0_48px_-12px_rgba(45,212,191,0.4)]"
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

                      <h3 className="font-heading text-lg font-bold text-white">
                        {pkg.label}
                      </h3>
                      <p className="mt-1.5 min-h-[2.5rem] text-[13px] leading-snug text-slate-400">
                        {pkg.tagline}
                      </p>

                      <div className="mt-5 flex items-baseline">
                        <span className="font-heading text-[2.1rem] font-extrabold tracking-tight text-white">
                          ₹{billingCycle === "monthly" ? monthlyPrice : yearlyMonthlyEquivalent}
                        </span>
                        <span className="ml-1 text-sm font-medium text-slate-500">
                          /month
                        </span>
                      </div>

                      {billingCycle === "yearly" ? (
                        <p className="mt-1 text-xs font-medium text-slate-500">
                          Billed annually at ₹{pkg.pricing.yearly}
                        </p>
                      ) : (
                        <div className="mt-1 h-4" />
                      )}

                      {pkg.savings && billingCycle === "yearly" && (
                        <span className="mt-3 inline-flex self-start rounded-md border border-teal-400/30 bg-teal-400/10 px-2 py-0.5 text-[10px] font-bold text-teal-300">
                          {pkg.savings}
                        </span>
                      )}

                      <hr className="my-5 border-white/[0.08]" />

                      <div className="flex-1">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                          Included modules
                        </p>
                        <ul className="mt-3 space-y-2.5">
                          {pkg.modules.map((mSlug) => {
                            const mod = modules.find((m) => m.slug === mSlug);
                            return (
                              <li key={mSlug} className="flex items-start gap-2.5">
                                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-400/15 text-teal-300">
                                  <Check size={12} strokeWidth={3} />
                                </span>
                                <span className="text-sm font-medium text-slate-300">
                                  {mod?.label || mSlug}
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>

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
                    </div>
                  </GsapReveal>
                );
              })}

              {/* Enterprise card */}
              <GsapReveal delay={0.24} className="h-full">
                <div className="flex h-full flex-col rounded-2xl border border-dashed border-white/20 bg-white/[0.02] p-6 backdrop-blur transition-all duration-300 hover:-translate-y-1.5 hover:border-teal-400/40 hover:bg-white/[0.05]">
                  <h3 className="font-heading text-lg font-bold text-white">
                    Enterprise Suite
                  </h3>
                  <p className="mt-1.5 min-h-[2.5rem] text-[13px] leading-snug text-slate-400">
                    SaaS environment customized for large hospital chains and networks.
                  </p>

                  <div className="mt-5 flex items-baseline">
                    <span className="font-heading text-[2.1rem] font-extrabold tracking-tight text-white">
                      Custom
                    </span>
                  </div>
                  <div className="mt-1 h-4" />

                  <hr className="my-5 border-white/[0.08]" />

                  <div className="flex-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Ultimate capacity
                    </p>
                    <ul className="mt-3 space-y-2.5">
                      {[
                        "Unlimited doctors & staff",
                        "Dedicated account manager",
                        "Custom integrations & SLAs",
                      ].map((f) => (
                        <li key={f} className="flex items-start gap-2.5">
                          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/[0.08] text-slate-400">
                            <Check size={12} strokeWidth={3} />
                          </span>
                          <span className="text-sm font-medium text-slate-300">
                            {f}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={scrollToCustomQuote}
                    className="mt-6 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/20 py-3 text-sm font-bold text-white transition-all duration-200 hover:bg-white hover:text-slate-950"
                  >
                    Contact Sales
                  </button>
                </div>
              </GsapReveal>
            </div>
          )}
        </div>

        {/* Custom quote */}
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
                    Why Custom Pricing?
                  </h3>
                  <p className="mt-3 leading-relaxed text-slate-400">
                    Rather than locking you into rigid tiers, we work with you
                    to scope only what you need — so you never overpay for
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
