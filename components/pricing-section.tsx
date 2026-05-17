"use client";

import { useState, useMemo, useCallback } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import ScrollReveal from "./scroll-reveal";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckIcon from "@mui/icons-material/Check";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

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

  return (
    <Box
      component="section"
      id="pricing"
      sx={{
        py: { xs: 6, md: 10 },
        px: 2,
        background: "#FFFFFF",
        scrollMarginTop: "72px",
      }}
    >
      <Box sx={{ maxWidth: 1280, mx: "auto" }}>
        {/* Section heading */}
        <ScrollReveal>
          <Box sx={{ textAlign: "center", mb: { xs: 4, md: 6 } }}>
            <Typography
              variant="caption"
              sx={{ color: "primary.dark", mb: 1, display: "block" }}
            >
              Custom Pricing
            </Typography>
            <Typography
              variant="h2"
              sx={{ fontSize: { xs: "1.375rem", md: "2rem" }, mb: 1.5 }}
            >
              Pricing That Fits Your Practice
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: 560, mx: "auto" }}
            >
              Every facility operates differently. Tell us about yours and
              we&apos;ll put together a plan that matches your scale, modules,
              and budget.
            </Typography>
          </Box>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <Grid
            container
            spacing={{ xs: 3, lg: 6 }}
            sx={{ maxWidth: 1000, mx: "auto" }}
            alignItems="flex-start"
          >
            {/* Left column — highlights */}
            <Grid size={{ xs: 12, lg: 5 }}>
              <Box sx={{ mb: { xs: 2, lg: 0 } }}>
                <Typography variant="h3" sx={{ mb: 1 }}>
                  Why custom pricing?
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3, lineHeight: 1.7 }}
                >
                  Rather than locking you into rigid tiers, we work with you to
                  scope only what you need — so you never overpay for capacity
                  you won&apos;t use.
                </Typography>

                <Stack spacing={1.5}>
                  {highlights.map((item) => (
                    <Stack
                      key={item}
                      direction="row"
                      alignItems="flex-start"
                      spacing={1.5}
                    >
                      <CheckCircleOutlineIcon
                        sx={{
                          color: "primary.dark",
                          fontSize: 18,
                          mt: 0.25,
                          flexShrink: 0,
                        }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {item}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Box>
            </Grid>

            {/* Right column — form card */}
            <Grid size={{ xs: 12, lg: 7 }}>
              <Card sx={{ p: 0.5 }}>
                <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                  {submitSuccess ? (
                    <Box sx={{ textAlign: "center", py: 4 }}>
                      <Box
                        sx={{
                          width: 56,
                          height: 56,
                          borderRadius: "50%",
                          background: "#14B8A6",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mx: "auto",
                          mb: 2.5,
                        }}
                      >
                        <CheckIcon sx={{ color: "#fff", fontSize: 28 }} />
                      </Box>
                      <Typography variant="h3" sx={{ mb: 1 }}>
                        Request Received
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 3, maxWidth: 360, mx: "auto" }}
                      >
                        Our team will review your details and reach out within 24
                        hours with a tailored proposal.
                      </Typography>
                      <Button
                        variant="outlined"
                        onClick={() => setSubmitSuccess(false)}
                        sx={{ fontSize: "0.8125rem" }}
                      >
                        Submit another request
                      </Button>
                    </Box>
                  ) : (
                    <Box component="form" onSubmit={handleSubmit} noValidate>
                      <Typography variant="h3" sx={{ mb: 0.5 }}>
                        Request a Quote
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2.5 }}
                      >
                        No cookie-cutter packages. Tailored to your needs.
                      </Typography>

                      <Stack spacing={2}>
                        <TextField
                          label="Phone Number"
                          type="tel"
                          autoComplete="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          onBlur={() => markTouched("phone")}
                          error={!!err("phone")}
                          helperText={err("phone")}
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
                        />
                        <TextField
                          label="Organization / Facility"
                          autoComplete="organization"
                          value={orgName}
                          onChange={(e) => setOrgName(e.target.value)}
                          onBlur={() => markTouched("orgName")}
                          error={!!err("orgName")}
                          helperText={err("orgName")}
                        />
                        <TextField
                          label="Additional details (optional)"
                          multiline
                          rows={2}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                        />
                      </Stack>

                      {submitError && (
                        <Typography
                          variant="body2"
                          color="error"
                          sx={{ mt: 1.5, fontSize: "0.8125rem" }}
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
                        sx={{ mt: 2.5 }}
                      >
                        {submitting ? "Sending…" : "Get a Quote"}
                      </Button>

                      <Typography
                        variant="body2"
                        align="center"
                        sx={{
                          mt: 1.5,
                          color: "text.disabled",
                          fontSize: "0.6875rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 0.5,
                        }}
                      >
                        <LockOutlinedIcon sx={{ fontSize: 12 }} />
                        Your data is never shared. Reply within 24 business
                        hours.
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </ScrollReveal>
      </Box>
    </Box>
  );
}
