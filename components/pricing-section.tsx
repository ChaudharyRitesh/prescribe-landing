"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import Chip from "@mui/material/Chip";
import ScrollReveal from "./scroll-reveal";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckIcon from "@mui/icons-material/Check";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import SparklesIcon from "@mui/icons-material/AutoAwesome"; // MUI equivalent for Sparkles
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

  // Resolve packages and modules dynamically from catalog or use fallback
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
    <Box
      component="section"
      id="pricing"
      sx={{
        py: { xs: 8, md: 12 },
        px: 2,
        background: "linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)",
        scrollMarginTop: "72px",
      }}
    >
      <Box sx={{ maxWidth: 1280, mx: "auto" }}>

        {/* Section Heading */}
        <ScrollReveal>
          <Box sx={{ textAlign: "center", mb: { xs: 6, md: 8 } }}>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-100 mb-4">
              <SparklesIcon sx={{ fontSize: 13 }} />
              <span>Simple, Transparent Pricing</span>
            </div>

            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: "2rem", md: "2.75rem" },
                fontWeight: 850,
                letterSpacing: "-0.03em",
                mb: 2.5,
                color: "slate.900"
              }}
            >
              Plans Designed to Scale with You
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: 620, mx: "auto", fontSize: "1.125rem", lineHeight: 1.6 }}
            >
              Choose a standard package styled for your facility type, or design a custom workflow. Select a plan below to fast-track your setup.
            </Typography>

            {/* Monthly / Yearly Toggle */}
            <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
              <div className="bg-slate-100/80 backdrop-blur-md p-1 rounded-xl inline-flex items-center border border-slate-200/50 shadow-inner">
                <button
                  onClick={() => setBillingCycle("monthly")}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${billingCycle === "monthly"
                    ? "bg-white text-slate-900 shadow-sm border border-slate-200/40"
                    : "text-slate-500 hover:text-slate-800"
                    }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle("yearly")}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 flex items-center gap-1.5 ${billingCycle === "yearly"
                    ? "bg-white text-slate-900 shadow-sm border border-slate-200/40"
                    : "text-slate-500 hover:text-slate-800"
                    }`}
                >
                  <span>Yearly</span>
                  <span className="bg-emerald-500 text-white font-bold text-[10px] px-1.5 py-0.5 rounded-md animate-pulse">
                    -20%
                  </span>
                </button>
              </div>
            </Box>
          </Box>
        </ScrollReveal>

        {/* Pricing Cards Grid */}
        <Box sx={{ mb: { xs: 8, md: 12 } }}>
          {isLoading ? (
            <Box display="flex" justifyContent="center" py={8}>
              <CircularProgress size={40} />
            </Box>
          ) : (
            <Grid container spacing={3.5} justifyContent="center" alignItems="stretch">
              {packages.map((pkg) => {
                const isPro = pkg.slug === "clinic-pro";
                const monthlyPrice = pkg.pricing.monthly;
                const yearlyMonthlyEquivalent = Math.round(pkg.pricing.yearly / 12);

                return (
                  <Grid key={pkg._id} size={{ xs: 12, sm: 6, lg: 3 }} display="flex">
                    <Card
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                        borderRadius: "24px",
                        position: "relative",
                        border: isPro ? "2px solid #2563EB" : "1px solid #E2E8F0",
                        boxShadow: isPro
                          ? "0 20px 25px -5px rgba(37, 99, 235, 0.08), 0 10px 10px -5px rgba(37, 99, 235, 0.04)"
                          : "0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.01)",
                        transform: isPro ? { md: "scale(1.03)" } : "none",
                        transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                        "&:hover": {
                          transform: isPro ? { md: "scale(1.05)" } : "translateY(-6px)",
                          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.06), 0 10px 10px -5px rgba(0, 0, 0, 0.02)",
                        },
                      }}
                    >
                      {/* Popular / Best Value Badge */}
                      {pkg.badge && (
                        <span className="absolute top-4 right-4 bg-blue-600 text-white text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-full shadow-sm">
                          {pkg.badge}
                        </span>
                      )}

                      <CardContent sx={{ p: 4, display: "flex", flexDirection: "column", height: "100%" }}>
                        {/* Title & Tagline */}
                        <Typography variant="h3" sx={{ fontSize: "1.25rem", fontWeight: 800, color: "slate.900", mb: 1 }}>
                          {pkg.label}
                        </Typography>

                        <Typography variant="body2" color="text.secondary" sx={{ minHeight: 40, mb: 3.5, lineHeight: 1.5 }}>
                          {pkg.tagline}
                        </Typography>

                        {/* Price */}
                        <Box sx={{ display: "flex", alignItems: "baseline", mb: 0.5 }}>
                          <span className="text-4xl font-extrabold text-slate-900 tracking-tight">
                            ₹{billingCycle === "monthly" ? monthlyPrice : yearlyMonthlyEquivalent}
                          </span>
                          <span className="text-sm font-semibold text-slate-400 ml-1">
                            /month
                          </span>
                        </Box>

                        {/* Yearly cost display */}
                        {billingCycle === "yearly" ? (
                          <div className="text-xs text-slate-500 font-medium mb-3">
                            Billed annually at ₹{pkg.pricing.yearly}
                          </div>
                        ) : (
                          <div className="mb-7" />
                        )}

                        {/* Savings Badge */}
                        {pkg.savings && billingCycle === "yearly" && (
                          <div className="inline-flex self-start bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-md mb-4 shadow-sm">
                            {pkg.savings}
                          </div>
                        )}

                        {/* Divider */}
                        <hr className="border-slate-100 my-4" />

                        {/* Modules Included */}
                        <Box sx={{ flexGrow: 1, mb: 4 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, letterSpacing: "0.05em", fontSize: "0.75rem" }}>
                            Included Modules:
                          </Typography>

                          <Stack spacing={1.5}>
                            {pkg.modules.map((mSlug) => {
                              const mod = modules.find((m) => m.slug === mSlug);
                              return (
                                <div key={mSlug} className="flex items-start gap-2.5">
                                  <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 text-blue-600 mt-0.5">
                                    <CheckIcon sx={{ fontSize: 13, fontWeight: "bold" }} />
                                  </div>
                                  <span className="text-sm text-slate-600 font-medium">
                                    {mod?.label || mSlug}
                                  </span>
                                </div>
                              );
                            })}
                          </Stack>
                        </Box>

                        {/* CTA button */}
                        <Button
                          href={`/onboarding?package=${pkg.slug}`}
                          variant={isPro ? "contained" : "outlined"}
                          fullWidth
                          size="large"
                          endIcon={<ArrowForwardIcon />}
                          sx={{
                            borderRadius: "14px",
                            textTransform: "none",
                            fontWeight: 700,
                            py: 1.5,
                            boxShadow: isPro ? "0 4px 14px 0 rgba(37, 99, 235, 0.3)" : "none",
                          }}
                        >
                          Get Started
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}

              {/* Dynamic Custom Suite Card */}
              <Grid size={{ xs: 12, sm: 6, lg: 3 }} display="flex">
                <Card
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    borderRadius: "24px",
                    border: "1px dashed #CBD5E1",
                    background: "rgba(255, 255, 255, 0.4)",
                    backdropBlur: "12px",
                    boxShadow: "none",
                    transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                    "&:hover": {
                      borderColor: "primary.main",
                      background: "#FFFFFF",
                      transform: "translateY(-6px)",
                      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.04), 0 10px 10px -5px rgba(0, 0, 0, 0.01)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 4, display: "flex", flexDirection: "column", height: "100%" }}>
                    <Typography variant="h3" sx={{ fontSize: "1.25rem", fontWeight: 800, color: "slate.900", mb: 1 }}>
                      Enterprise Suite
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ minHeight: 40, mb: 3.5, lineHeight: 1.5 }}>
                      SaaS environment customized for large hospital chains and networks.
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "baseline", mb: 6.5 }}>
                      <span className="text-4xl font-extrabold text-slate-800 tracking-tight">
                        Custom
                      </span>
                    </Box>

                    <hr className="border-slate-100 my-4" />

                    <Box sx={{ flexGrow: 1, mb: 4 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "slate.700", mb: 2, textTransform: "uppercase", letterSpacing: "0.05em", fontSize: "0.75rem" }}>
                        Ultimate Capacity:
                      </Typography>

                      <Stack spacing={1.5}>
                        <div className="flex items-start gap-2.5">
                          <div className="w-5 h-5 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center flex-shrink-0 text-slate-500 mt-0.5">
                            <CheckIcon sx={{ fontSize: 13 }} />
                          </div>
                          <span className="text-sm text-slate-600 font-medium">Unlimited doctors & staff</span>
                        </div>
                        <div className="flex items-start gap-2.5">
                          <div className="w-5 h-5 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center flex-shrink-0 text-slate-500 mt-0.5">
                            <CheckIcon sx={{ fontSize: 13 }} />
                          </div>
                          <span className="text-sm text-slate-600 font-medium">Dedicated account manager</span>
                        </div>
                        <div className="flex items-start gap-2.5">
                          <div className="w-5 h-5 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center flex-shrink-0 text-slate-500 mt-0.5">
                            <CheckIcon sx={{ fontSize: 13 }} />
                          </div>
                          <span className="text-sm text-slate-600 font-medium">Custom integrations & SLAs</span>
                        </div>
                      </Stack>
                    </Box>

                    <Button
                      onClick={scrollToCustomQuote}
                      variant="outlined"
                      color="secondary"
                      fullWidth
                      size="large"
                      sx={{
                        borderRadius: "14px",
                        textTransform: "none",
                        fontWeight: 700,
                        py: 1.5,
                        borderColor: "slate.300",
                        color: "slate.700",
                        "&:hover": {
                          borderColor: "slate.800",
                          background: "slate.50",
                        },
                      }}
                    >
                      Contact Sales
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </Box>

        {/* Custom Quote Inquiry Form */}
        <div ref={customQuoteRef}>
          <ScrollReveal delay={100}>
            <Grid
              container
              spacing={{ xs: 4, lg: 8 }}
              sx={{ maxWidth: 1000, mx: "auto", borderTop: "1px solid #F1F5F9", pt: { xs: 6, md: 8 } }}
              alignItems="flex-start"
            >
              {/* Left column — highlights */}
              <Grid size={{ xs: 12, lg: 5 }}>
                <Box sx={{ mb: { xs: 2, lg: 0 } }}>
                  <Typography variant="h3" sx={{ mb: 2, fontWeight: 800, fontSize: "1.75rem", letterSpacing: "-0.02em" }}>
                    Why Custom Pricing?
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 4, lineHeight: 1.7, fontSize: "0.95rem" }}
                  >
                    Rather than locking you into rigid tiers, we work with you to
                    scope only what you need — so you never overpay for capacity
                    you won&apos;t use.
                  </Typography>

                  <Stack spacing={2.5}>
                    {highlights.map((item) => (
                      <Stack
                        key={item}
                        direction="row"
                        alignItems="flex-start"
                        spacing={2}
                      >
                        <CheckCircleOutlineIcon
                          sx={{
                            color: "primary.main",
                            fontSize: 20,
                            mt: 0.25,
                            flexShrink: 0,
                          }}
                        />
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.9rem" }}>
                          {item}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                </Box>
              </Grid>

              {/* Right column — form card */}
              <Grid size={{ xs: 12, lg: 7 }}>
                <Card sx={{ p: 1, borderRadius: "24px", boxShadow: "0 10px 30px -10px rgba(0,0,0,0.04)" }}>
                  <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                    {submitSuccess ? (
                      <Box sx={{ textAlign: "center", py: 5 }}>
                        <Box
                          sx={{
                            width: 60,
                            height: 60,
                            borderRadius: "50%",
                            background: "#10B981",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mx: "auto",
                            mb: 3,
                            boxShadow: "0 4px 14px 0 rgba(16, 185, 129, 0.3)",
                          }}
                        >
                          <CheckIcon sx={{ color: "#fff", fontSize: 32 }} />
                        </Box>
                        <Typography variant="h3" sx={{ mb: 1.5, fontWeight: 800 }}>
                          Request Received
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 4, maxWidth: 360, mx: "auto", lineHeight: 1.6 }}
                        >
                          Our team will review your details and reach out within 24
                          hours with a tailored proposal.
                        </Typography>
                        <Button
                          variant="outlined"
                          onClick={() => setSubmitSuccess(false)}
                          sx={{ fontSize: "0.875rem", borderRadius: "10px", textTransform: "none", fontWeight: 600 }}
                        >
                          Submit another request
                        </Button>
                      </Box>
                    ) : (
                      <Box component="form" onSubmit={handleSubmit} noValidate>
                        <Typography variant="h3" sx={{ mb: 1, fontWeight: 800, fontSize: "1.5rem" }}>
                          Request a Custom Quote
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 4 }}
                        >
                          For facilities with specialized volume, customized module bundles, or multi-location configurations.
                        </Typography>

                        <Stack spacing={2.5}>
                          <TextField
                            label="Phone Number"
                            type="tel"
                            autoComplete="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            onBlur={() => markTouched("phone")}
                            error={!!err("phone")}
                            helperText={err("phone")}
                            InputProps={{ sx: { borderRadius: "12px" } }}
                          />
                          <TextField
                            label="Work Email"
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onBlur={() => markTouched("email")}
                            error={!!err("email")}
                            helperText={err("email")}
                            InputProps={{ sx: { borderRadius: "12px" } }}
                          />
                          <TextField
                            label="Organization / Facility"
                            autoComplete="organization"
                            value={orgName}
                            onChange={(e) => setOrgName(e.target.value)}
                            onBlur={() => markTouched("orgName")}
                            error={!!err("orgName")}
                            helperText={err("orgName")}
                            InputProps={{ sx: { borderRadius: "12px" } }}
                          />
                          <TextField
                            label="Additional details (optional)"
                            multiline
                            rows={3}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Tell us about your facility size, doctor count, or custom integrations required..."
                            InputProps={{ sx: { borderRadius: "12px" } }}
                          />
                        </Stack>

                        {submitError && (
                          <Typography
                            variant="body2"
                            color="error"
                            sx={{ mt: 2, fontSize: "0.875rem", fontWeight: 500 }}
                          >
                            {submitError}
                          </Typography>
                        )}

                        <Button
                          type="submit"
                          variant="contained"
                          fullWidth
                          size="large"
                          disabled={submitting}
                          endIcon={
                            submitting ? (
                              <CircularProgress size={18} color="inherit" />
                            ) : (
                              <ArrowForwardIcon />
                            )
                          }
                          sx={{ mt: 4, py: 1.75, borderRadius: "14px", fontWeight: 700, textTransform: "none" }}
                        >
                          {submitting ? "Sending Inquiry…" : "Submit Quote Request"}
                        </Button>

                        <Typography
                          variant="body2"
                          align="center"
                          sx={{
                            mt: 2.5,
                            color: "text.disabled",
                            fontSize: "0.75rem",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 0.5,
                            fontWeight: 500,
                          }}
                        >
                          <LockOutlinedIcon sx={{ fontSize: 12 }} />
                          Your data is fully secure. We respond within 24 business hours.
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </ScrollReveal>
        </div>
      </Box>
    </Box>
  );
}
