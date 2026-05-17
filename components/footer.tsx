"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import MuiLink from "@mui/material/Link";
import CircularProgress from "@mui/material/CircularProgress";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import XIcon from "@mui/icons-material/X";
import YouTubeIcon from "@mui/icons-material/YouTube";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import FavoriteIcon from "@mui/icons-material/Favorite";

const footerGroups = [
  {
    title: "Modules",
    links: [
      { label: "OPD Management", href: "#modules" },
      { label: "IPD Management", href: "#modules" },
      { label: "Lab Management", href: "#modules" },
      { label: "Pharmacy", href: "#modules" },
      { label: "Patient Portal", href: "#modules" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "For Clinics", href: "#" },
      { label: "For Hospitals", href: "#" },
      { label: "For Diagnostic Labs", href: "#" },
      { label: "For Pharmacy Chains", href: "#" },
      { label: "Enterprise Solutions", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "#" },
      { label: "API Reference", href: "#" },
      { label: "Case Studies", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Help Center", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#" },
      { label: "Partners Program", href: "/partner/register" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "HIPAA Compliance", href: "/compliance" },
      { label: "Security", href: "/compliance#security-controls" },
    ],
  },
];

export function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubmitting, setNewsletterSubmitting] = useState(false);
  const [newsletterStatus, setNewsletterStatus] = useState<
    { type: "success" | "error"; message: string } | undefined
  >(undefined);

  async function onNewsletterSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setNewsletterStatus(undefined);

    const email = newsletterEmail.trim();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setNewsletterStatus({ type: "error", message: "Enter a valid email." });
      return;
    }

    setNewsletterSubmitting(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setNewsletterStatus({
          type: "error",
          message: data?.message || "Could not subscribe. Try again.",
        });
        return;
      }

      setNewsletterStatus({ type: "success", message: "Subscribed." });
      setNewsletterEmail("");
    } catch {
      setNewsletterStatus({ type: "error", message: "Network error." });
    } finally {
      setNewsletterSubmitting(false);
    }
  }

  return (
    <Box component="footer" sx={{ background: "#0B1120" }}>
      {/* Newsletter Section */}
      <Box sx={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <Box
          sx={{
            maxWidth: 1280,
            mx: "auto",
            px: 2,
            py: { xs: 4, md: 5 },
          }}
        >
          <Grid
            container
            spacing={3}
            alignItems="center"
            justifyContent="space-between"
          >
            <Grid size={{ xs: 12, lg: 5 }}>
              <Typography
                variant="h3"
                sx={{ color: "#F1F5F9", mb: 0.5 }}
              >
                Stay Updated with KaeroPrescribe
              </Typography>
              <Typography variant="body2" sx={{ color: "#64748B" }}>
                Get the latest updates on healthcare technology and product
                features.
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, lg: 6 }}>
              <Box
                component="form"
                onSubmit={onNewsletterSubmit}
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 1.5,
                }}
              >
                <TextField
                  type="email"
                  placeholder="Enter your email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  size="small"
                  required
                  sx={{
                    flex: 1,
                    "& .MuiOutlinedInput-root": {
                      background: "#1E293B",
                      borderRadius: 2,
                      "& fieldset": {
                        borderColor: "rgba(255,255,255,0.1)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(255,255,255,0.2)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#14B8A6",
                      },
                    },
                    "& .MuiOutlinedInput-input": {
                      color: "#F1F5F9",
                      "&::placeholder": { color: "#64748B" },
                    },
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  disabled={newsletterSubmitting}
                  endIcon={
                    newsletterSubmitting ? (
                      <CircularProgress size={16} color="inherit" />
                    ) : (
                      <ArrowForwardIcon />
                    )
                  }
                  sx={{ whiteSpace: "nowrap", minWidth: 130 }}
                >
                  Subscribe
                </Button>
              </Box>
              {newsletterStatus && (
                <Typography
                  variant="body2"
                  sx={{
                    mt: 1,
                    fontSize: "0.75rem",
                    color:
                      newsletterStatus.type === "success"
                        ? "#10B981"
                        : "#EF4444",
                  }}
                >
                  {newsletterStatus.message}
                </Typography>
              )}
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* Main Footer — Desktop: Grid, Mobile: Accordions */}
      <Box sx={{ maxWidth: 1280, mx: "auto", px: 2, py: { xs: 3, md: 6 } }}>
        {/* Logo + tagline */}
        <Box sx={{ mb: 3 }}>
          <Box
            component="img"
            src="/logo.png"
            sx={{ height: 28, mb: 1.5 }}
            alt="KaeroPrescribe"
          />
          <Typography
            variant="body2"
            sx={{ color: "#64748B", maxWidth: 300, mb: 2 }}
          >
            The unified healthcare management platform for modern operations.
          </Typography>

          {/* Contact */}
          <Stack spacing={1} sx={{ mb: 2 }}>
            <MuiLink
              href="mailto:support@kaerogroup.com"
              underline="none"
              sx={{
                color: "#64748B",
                fontSize: "0.8125rem",
                display: "flex",
                alignItems: "center",
                gap: 1,
                "&:hover": { color: "#2DD4BF" },
              }}
            >
              <EmailOutlinedIcon sx={{ fontSize: 16, color: "primary.main" }} />
              support@kaerogroup.com
            </MuiLink>
            <Box
              sx={{
                color: "#64748B",
                fontSize: "0.8125rem",
                display: "flex",
                alignItems: "flex-start",
                gap: 1,
              }}
            >
              <LocationOnOutlinedIcon
                sx={{ fontSize: 16, color: "primary.main", mt: 0.25 }}
              />
              Kolkata, West Bengal
            </Box>
          </Stack>

          {/* Social */}
          <Stack direction="row" spacing={1}>
            {[
              { icon: <LinkedInIcon sx={{ fontSize: 18 }} />, label: "LinkedIn" },
              { icon: <XIcon sx={{ fontSize: 16 }} />, label: "Twitter" },
              { icon: <YouTubeIcon sx={{ fontSize: 18 }} />, label: "YouTube" },
            ].map((s) => (
              <IconButton
                key={s.label}
                aria-label={s.label}
                href="#"
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  background: "#1E293B",
                  color: "#94A3B8",
                  "&:hover": {
                    background: "#14B8A6",
                    color: "#0B1120",
                  },
                }}
              >
                {s.icon}
              </IconButton>
            ))}
          </Stack>
        </Box>

        {/* Desktop grid */}
        <Box sx={{ display: { xs: "none", md: "block" } }}>
          <Grid container spacing={4}>
            {footerGroups.map((group) => (
              <Grid size={{ md: 2.4 }} key={group.title}>
                <Typography
                  sx={{
                    color: "#F1F5F9",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    mb: 2,
                  }}
                >
                  {group.title}
                </Typography>
                <List dense disablePadding>
                  {group.links.map((link) => (
                    <ListItem key={link.label} disablePadding sx={{ py: 0.4 }}>
                      <MuiLink
                        href={link.href}
                        underline="none"
                        sx={{
                          color: "#64748B",
                          fontSize: "0.8125rem",
                          "&:hover": { color: "#2DD4BF" },
                        }}
                      >
                        {link.label}
                      </MuiLink>
                    </ListItem>
                  ))}
                </List>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Mobile accordions */}
        <Box sx={{ display: { xs: "block", md: "none" } }}>
          {footerGroups.map((group) => (
            <Accordion key={group.title} disableGutters>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: "#64748B" }} />}
                sx={{ px: 0, minHeight: 48 }}
              >
                <Typography
                  sx={{
                    color: "#F1F5F9",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                  }}
                >
                  {group.title}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 0, pt: 0, pb: 1 }}>
                <List dense disablePadding>
                  {group.links.map((link) => (
                    <ListItem key={link.label} disablePadding sx={{ py: 0.4 }}>
                      <MuiLink
                        href={link.href}
                        underline="none"
                        sx={{
                          color: "#64748B",
                          fontSize: "0.875rem",
                          "&:hover": { color: "#2DD4BF" },
                        }}
                      >
                        {link.label}
                      </MuiLink>
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Box>

      {/* Bottom bar */}
      <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />
      <Box
        sx={{
          maxWidth: 1280,
          mx: "auto",
          px: 2,
          py: 2.5,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <Typography
          variant="body2"
          sx={{ color: "#475569", fontSize: "0.75rem" }}
        >
          &copy; {new Date().getFullYear()} KaeroPrescribe by Kaero Group. All
          rights reserved.
        </Typography>
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          divider={
            <Box
              sx={{
                width: 1,
                height: 12,
                background: "rgba(255,255,255,0.1)",
              }}
            />
          }
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.75,
              fontSize: "0.6875rem",
              color: "#64748B",
            }}
          >
            <FiberManualRecordIcon
              sx={{
                fontSize: 8,
                color: "#10B981",
                animation: "pulse 2s ease-in-out infinite",
                "@keyframes pulse": {
                  "0%, 100%": { opacity: 1 },
                  "50%": { opacity: 0.4 },
                },
              }}
            />
            All Systems Operational
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              fontSize: "0.6875rem",
              color: "#64748B",
            }}
          >
            Made with
            <FavoriteIcon sx={{ fontSize: 10, color: "#EF4444" }} />
            in India
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
