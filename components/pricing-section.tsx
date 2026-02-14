"use client";

import { useState, useMemo, useCallback } from "react";
import ScrollReveal from "./scroll-reveal";
import { ArrowRight, Check, Loader2 } from "lucide-react";

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
/*  Highlights shown next to the form                                  */
/* ------------------------------------------------------------------ */

const highlights = [
  "Pricing tailored to your patient volume \u0026 workflow",
  "Choose only the modules you need",
  "Transparent — no hidden charges",
  "Dedicated onboarding \u0026 migration support",
  "Response within 24 business hours",
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function PricingSection() {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [orgName, setOrgName] = useState("");
  const [message, setMessage] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

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

  /* ---- Shared input class ---- */
  const inputBase =
    "w-full rounded-md border bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-colors focus:ring-1 focus:ring-gray-400 focus:border-gray-400";
  const inputErr = "border-red-300 focus:ring-red-400 focus:border-red-400";
  const inputOk = "border-gray-300";

  return (
    <section id="pricing" className="section-padding bg-white">
      <div className="section-max-width">
        {/* ---- Section heading ---- */}
        <ScrollReveal>
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Pricing That Fits Your Practice
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Every facility operates differently. Tell us about yours and
              we&apos;ll put together a plan that matches your scale, modules,
              and budget — no cookie-cutter packages.
            </p>
          </div>
        </ScrollReveal>

        {/* ---- Two-column layout: highlights + form ---- */}
        <ScrollReveal delay={100}>
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-start">
            {/* Left column — highlights */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Why custom pricing?
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Rather than locking you into rigid tiers, we work with you to
                  scope only what you need — so you never overpay for capacity
                  you won&apos;t use.
                </p>
              </div>

              <ul className="space-y-4">
                {highlights.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-gray-700 text-sm"
                  >
                    <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-gray-900 flex items-center justify-center">
                      <Check size={12} className="text-white" strokeWidth={3} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right column — form card */}
            <div className="lg:col-span-3">
              <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-8 md:p-10">
                {submitSuccess ? (
                  <div className="text-center py-6">
                    <div className="w-14 h-14 rounded-full bg-gray-900 flex items-center justify-center mx-auto mb-5">
                      <Check size={28} className="text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">
                      Request Received
                    </h4>
                    <p className="text-gray-600 text-sm mb-6 max-w-sm mx-auto">
                      Our team will review your details and reach out within 24
                      hours with a tailored proposal.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSubmitSuccess(false)}
                      className="button-secondary text-sm"
                    >
                      Submit another request
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={handleSubmit}
                    noValidate
                    className="space-y-5"
                  >
                    <h4 className="text-lg font-bold text-gray-900">
                      Request a Quote
                    </h4>

                    {/* Phone */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="pricing-phone"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Phone number{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="pricing-phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        onBlur={() => markTouched("phone")}
                        placeholder="+91 98765 43210"
                        className={`${inputBase} ${err("phone") ? inputErr : inputOk}`}
                      />
                      {err("phone") && (
                        <p className="text-xs text-red-600">{err("phone")}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="pricing-email"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Work email{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="pricing-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={() => markTouched("email")}
                        placeholder="you@hospital.com"
                        className={`${inputBase} ${err("email") ? inputErr : inputOk}`}
                      />
                      {err("email") && (
                        <p className="text-xs text-red-600">{err("email")}</p>
                      )}
                    </div>

                    {/* Organization */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="pricing-org"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Organization / Facility name{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="pricing-org"
                        type="text"
                        value={orgName}
                        onChange={(e) => setOrgName(e.target.value)}
                        onBlur={() => markTouched("orgName")}
                        placeholder="e.g. City General Hospital"
                        className={`${inputBase} ${err("orgName") ? inputErr : inputOk}`}
                      />
                      {err("orgName") && (
                        <p className="text-xs text-red-600">{err("orgName")}</p>
                      )}
                    </div>

                    {/* Message */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="pricing-message"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Additional details{" "}
                        <span className="text-gray-400 font-normal">
                          (optional)
                        </span>
                      </label>
                      <textarea
                        id="pricing-message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Number of departments, expected patient volume, modules of interest…"
                        rows={3}
                        className={`${inputBase} ${inputOk} resize-y`}
                      />
                    </div>

                    {submitError && (
                      <p className="text-sm text-red-600">{submitError}</p>
                    )}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="button-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Sending…
                        </>
                      ) : (
                        <>
                          Get a Quote
                          <ArrowRight
                            size={18}
                            className="transition-transform group-hover:translate-x-1"
                          />
                        </>
                      )}
                    </button>

                    <p className="text-xs text-gray-400 leading-relaxed">
                      By submitting you agree to be contacted by our team. We
                      never share your information with third parties.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
