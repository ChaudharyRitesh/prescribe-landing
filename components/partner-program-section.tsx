"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import HandshakeOutlinedIcon from "@mui/icons-material/HandshakeOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import PieChartOutlinedIcon from "@mui/icons-material/PieChartOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";

const benefits = [
  {
    title: "High Commission Structure",
    description:
      "Earn industry-leading commissions on every successful hospital conversion and follow-on subscription.",
    icon: <TrendingUpOutlinedIcon />,
  },
  {
    title: "Territory Exclusivity",
    description:
      "Lock in your region and manage operations with zero competition from other partners.",
    icon: <PublicOutlinedIcon />,
  },
  {
    title: "Advanced CRM Tools",
    description:
      "Access a dedicated partner dashboard to track pitches, monitor performance, and manage hospital leads.",
    icon: <PieChartOutlinedIcon />,
  },
  {
    title: "Full Training & Support",
    description:
      "Comprehensive product training and a dedicated support team to help you close larger hospital deals.",
    icon: <GroupsOutlinedIcon />,
  },
];

const features = [
  "Bespoke landing page for partners",
  "Automated commission payouts",
  "Whitelabel pitch materials",
  "Dedicated support representative",
  "Real-time analytics & reporting",
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" as const },
  transition: { duration: 0.45, ease: "easeOut" as const },
};

export function PartnerProgramSection() {
  return (
    <Box
      component="section"
      id="partner-program"
      sx={{
        py: { xs: 6, md: 10 },
        px: 2,
        background: "linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)",
        scrollMarginTop: "72px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box sx={{ maxWidth: 1280, mx: "auto" }}>
        <Grid container spacing={{ xs: 4, lg: 8 }} alignItems="center">
          {/* Left Column: Content */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <motion.div {...fadeUp}>
              {/* Badge */}
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.75,
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 10,
                  background: "#F0FDFA",
                  border: "1px solid rgba(20,184,166,0.2)",
                  mb: 2,
                }}
              >
                <HandshakeOutlinedIcon
                  sx={{ fontSize: 16, color: "primary.dark" }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: "primary.dark",
                    fontSize: "0.75rem",
                  }}
                >
                  Partner with Kaero
                </Typography>
              </Box>

              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: "1.375rem", md: "2rem" },
                  mb: 1.5,
                  lineHeight: 1.2,
                }}
              >
                Join the{" "}
                <Box component="span" sx={{ color: "primary.main" }}>
                  Kaero Partner Program
                </Box>{" "}
                & Scale Your Success
              </Typography>

              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mb: 3, maxWidth: 520 }}
              >
                Become a strategic partner in the healthcare revolution. We
                provide the tools, technology, and support you need to empower
                hospitals and grow your business.
              </Typography>

              {/* Feature list with teal left-border accent */}
              {features.map((f) => (
                <Stack
                  key={f}
                  direction="row"
                  alignItems="center"
                  spacing={1.5}
                  sx={{ mb: 1.5 }}
                >
                  <CheckCircleOutlineIcon
                    sx={{ color: "primary.main", fontSize: 20, flexShrink: 0 }}
                  />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {f}
                  </Typography>
                </Stack>
              ))}

              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  size="large"
                  component={Link}
                  href="/partner/register"
                  endIcon={<ArrowForwardIcon />}
                >
                  Become a Partner
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  component={Link}
                  href="/partner/login"
                  startIcon={<LoginOutlinedIcon />}
                  sx={{
                    borderColor: "#334155",
                    color: "#475569",
                    "&:hover": {
                      borderColor: "#14B8A6",
                      background: "rgba(20,184,166,0.04)",
                    },
                  }}
                >
                  Partner Login
                </Button>
              </Stack>
            </motion.div>
          </Grid>

          {/* Right Column: Benefits grid + Stats */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <Grid container spacing={2}>
              {benefits.map((benefit, i) => (
                <Grid size={{ xs: 12, sm: 6 }} key={benefit.title}>
                  <motion.div
                    {...fadeUp}
                    transition={{ ...fadeUp.transition, delay: i * 0.1 }}
                  >
                    <Card
                      sx={{
                        height: "100%",
                        transition: "all 0.3s",
                        "&:hover": {
                          boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      <CardContent sx={{ p: 2.5 }}>
                        <Box
                          sx={{
                            width: 44,
                            height: 44,
                            borderRadius: 2,
                            background: "#F0FDFA",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mb: 1.5,
                            color: "primary.dark",
                          }}
                        >
                          {benefit.icon}
                        </Box>
                        <Typography variant="h4" sx={{ mb: 0.5 }}>
                          {benefit.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontSize: "0.75rem" }}
                        >
                          {benefit.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}

              {/* Stats bar */}
              <Grid size={12}>
                <motion.div
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: 0.4 }}
                >
                  <Box
                    sx={{
                      background:
                        "linear-gradient(135deg, #0B1120 0%, #0F2744 100%)",
                      borderRadius: 3,
                      p: { xs: 2.5, md: 3.5 },
                    }}
                  >
                    <Grid container spacing={2} textAlign="center">
                      {[
                        { val: "500+", label: "Hospitals Empowered" },
                        { val: "₹50 Cr+", label: "Partner Commissions" },
                        { val: "₹0", label: "Joining Fee" },
                      ].map((stat) => (
                        <Grid size={4} key={stat.label}>
                          <Typography
                            variant="h2"
                            sx={{ color: "primary.main", fontWeight: 700 }}
                          >
                            {stat.val}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: "#64748B", fontSize: "0.6875rem" }}
                          >
                            {stat.label}
                          </Typography>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </motion.div>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
