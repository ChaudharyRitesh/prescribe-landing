"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import ScrollReveal from "./scroll-reveal";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import Link from "next/link";

interface CTAData {
  title?: string;
  description?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  footerText?: string;
}

interface CTASectionProps {
  data: CTAData | null;
}

export function CTASection({ data }: CTASectionProps) {
  const title =
    data?.title || "Ready to Transform Your Healthcare Operations?";
  const description =
    data?.description ||
    "Join forward-thinking healthcare organizations already using KaeroPrescribe to reduce costs, improve patient care, and scale with confidence.";

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 6, md: 10 },
        px: 2,
        background:
          "linear-gradient(160deg, #0B1120 0%, #0F2744 55%, #0D3B36 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Radial glow */}
      <Box
        sx={{
          position: "absolute",
          top: "30%",
          right: "10%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(20,184,166,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <Box sx={{ maxWidth: 800, mx: "auto", position: "relative", zIndex: 1 }}>
        <ScrollReveal>
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography
              variant="caption"
              sx={{ color: "primary.main", mb: 1, display: "block" }}
            >
              Get Started
            </Typography>
            <Typography
              variant="h2"
              sx={{
                color: "#F1F5F9",
                fontSize: { xs: "1.375rem", md: "2rem" },
                mb: 1.5,
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "#94A3B8", maxWidth: 580, mx: "auto", mb: 3 }}
            >
              {description}
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
              justifyContent="center"
            >
              <Button
                variant="contained"
                size="large"
                component={Link}
                href="/onboarding"
                endIcon={<ArrowForwardIcon />}
                disableRipple
              >
                Get Started Free
              </Button>
              <Button
                variant="outlined"
                size="large"
                color="secondary"
                startIcon={<PlayArrowRoundedIcon />}
                component="a"
                href="#features"
                sx={{
                  borderColor: "rgba(255,255,255,0.15)",
                  color: "#94A3B8",
                  "&:hover": {
                    borderColor: "#2DD4BF",
                    background: "rgba(255,255,255,0.04)",
                  },
                }}
              >
                Watch Demo
              </Button>
            </Stack>
          </Box>
        </ScrollReveal>


      </Box>
    </Box>
  );
}
