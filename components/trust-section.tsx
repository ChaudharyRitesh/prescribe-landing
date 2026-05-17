"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import MuiLink from "@mui/material/Link";
import ScrollReveal from "./scroll-reveal";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Link from "next/link";

interface TrustItem {
  title: string;
  description: string;
}

interface TrustSectionProps {
  items: TrustItem[];
}

const complianceBadges = [
  { acronym: "HIPAA", label: "Compliant" },
  { acronym: "DPDP", label: "Compliant" },
  { acronym: "ISO 27001", label: "Aligned" },
  { acronym: "GDPR", label: "Ready" },
];

const slaMetrics = [
  { val: "99.9%", label: "Uptime SLA" },
  { val: "256-bit", label: "Encryption" },
  { val: "<1hr", label: "Recovery Time" },
  { val: "24/7", label: "Monitoring" },
];

export function TrustSection({ items }: TrustSectionProps) {
  return (
    <Box
      component="section"
      sx={{
        background: "#0B1120",
        py: { xs: 6, md: 10 },
        px: 2,
      }}
    >
      <Box sx={{ maxWidth: 1280, mx: "auto" }}>
        <ScrollReveal>
          <Box sx={{ textAlign: "center", mb: { xs: 3, md: 4 } }}>
            <Typography
              variant="caption"
              sx={{ color: "primary.main", mb: 0.5, display: "block" }}
            >
              Compliance & Certifications
            </Typography>
            <Typography
              variant="h2"
              sx={{
                color: "#F1F5F9",
                fontSize: { xs: "1.375rem", md: "2rem" },
                mb: 1.5,
              }}
            >
              Trust Built In
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "#94A3B8", maxWidth: 480, mx: "auto" }}
            >
              Healthcare data demands the highest standards. We don&apos;t
              compromise on security or compliance.
            </Typography>
          </Box>
        </ScrollReveal>

        {/* Compliance badge grid */}
        <ScrollReveal delay={100}>
          <Grid
            container
            spacing={1.5}
            sx={{ mb: 4, maxWidth: 600, mx: "auto" }}
          >
            {complianceBadges.map((b) => (
              <Grid size={{ xs: 6 }} key={b.acronym}>
                <Paper
                  sx={{
                    background: "#1E293B",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 2,
                    p: 2,
                    textAlign: "center",
                    transition: "all 0.3s",
                    "&:hover": {
                      borderColor: "rgba(20,184,166,0.3)",
                      background: "#263549",
                    },
                  }}
                >
                  <Typography
                    sx={{
                      color: "primary.main",
                      fontWeight: 700,
                      fontSize: "1rem",
                    }}
                  >
                    {b.acronym}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "#64748B", fontSize: "0.6875rem" }}
                  >
                    {b.label}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </ScrollReveal>

        {/* SLA metrics strip */}
        <ScrollReveal delay={200}>
          <Grid
            container
            spacing={1.5}
            sx={{ maxWidth: 600, mx: "auto", mb: 4 }}
          >
            {slaMetrics.map((m) => (
              <Grid size={{ xs: 6, sm: 3 }} key={m.label}>
                <Box sx={{ textAlign: "center" }}>
                  <Typography
                    variant="overline"
                    sx={{
                      color: "primary.main",
                      fontWeight: 700,
                      fontSize: "1.125rem",
                      display: "block",
                      lineHeight: 1.4,
                    }}
                  >
                    {m.val}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#64748B" }}>
                    {m.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </ScrollReveal>

        {/* CTA to Compliance Page */}
        <ScrollReveal delay={300}>
          <Box sx={{ textAlign: "center" }}>
            <MuiLink
              component={Link}
              href="/compliance"
              underline="none"
              sx={{
                color: "primary.main",
                fontWeight: 600,
                fontSize: "0.8125rem",
                display: "inline-flex",
                alignItems: "center",
                gap: 0.5,
                transition: "all 0.2s",
                "&:hover": {
                  color: "primary.light",
                  gap: 1,
                },
              }}
            >
              View Full Compliance Documentation
              <ArrowForwardIcon sx={{ fontSize: 16 }} />
            </MuiLink>
          </Box>
        </ScrollReveal>
      </Box>
    </Box>
  );
}
