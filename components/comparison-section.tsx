"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ScrollReveal from "./scroll-reveal";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

interface Comparison {
  feature: string;
  kaero: boolean;
  traditional: boolean;
}

interface ComparisonSectionProps {
  comparisons: Comparison[];
}

const defaultComparisons = [
  { feature: "Modular Architecture", kaero: true, traditional: false },
  { feature: "AI-Native Intelligence", kaero: true, traditional: false },
  { feature: "Real-time Sync", kaero: true, traditional: false },
  { feature: "Automated Compliance", kaero: true, traditional: false },
  { feature: "Scalable Pricing", kaero: true, traditional: false },
  { feature: "Cloud-Native", kaero: true, traditional: false },
  { feature: "Audit Trails", kaero: true, traditional: true },
];

export function ComparisonSection({ comparisons }: ComparisonSectionProps) {
  const displayComparisons =
    comparisons.length > 0 ? comparisons : defaultComparisons;

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 6, md: 10 },
        px: 2,
        background: "#F8FAFC",
      }}
    >
      <Box sx={{ maxWidth: 1280, mx: "auto" }}>
        <ScrollReveal>
          <Box sx={{ textAlign: "center", mb: { xs: 4, md: 6 } }}>
            <Typography
              variant="caption"
              sx={{ color: "primary.dark", mb: 1, display: "block" }}
            >
              Comparison
            </Typography>
            <Typography
              variant="h2"
              sx={{ fontSize: { xs: "1.375rem", md: "2rem" }, mb: 1.5 }}
            >
              Why KaeroPrescribe Wins
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: 520, mx: "auto" }}
            >
              Built from the ground up for modern healthcare. Not a legacy system
              with AI bolted on.
            </Typography>
          </Box>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <Box
            sx={{
              maxWidth: 800,
              mx: "auto",
              borderRadius: 2,
              overflow: "hidden",
              border: "1px solid",
              borderColor: "divider",
              background: "#FFFFFF",
            }}
          >
            {/* Table header */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 0,
                px: { xs: 2, md: 4 },
                py: { xs: 1.5, md: 2 },
                background: "#FFFFFF",
                borderBottom: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: "text.primary",
                  fontSize: { xs: "0.75rem", md: "0.875rem" },
                }}
              >
                Feature
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: "primary.main",
                  textAlign: "center",
                  fontSize: { xs: "0.75rem", md: "0.875rem" },
                }}
              >
                KaeroPrescribe
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: "#64748B",
                  textAlign: "center",
                  fontSize: { xs: "0.75rem", md: "0.875rem" },
                }}
              >
                Traditional
              </Typography>
            </Box>

            {/* Table rows */}
            {displayComparisons.map((row, idx) => (
              <Box
                key={idx}
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 0,
                  px: { xs: 2, md: 4 },
                  py: { xs: 1.25, md: 1.5 },
                  borderBottom:
                    idx < displayComparisons.length - 1
                      ? "1px solid"
                      : "none",
                  borderColor: "divider",
                  transition: "background 0.2s",
                  "&:hover": { background: "#F8FAFC" },
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 500,
                    color: "text.primary",
                    display: "flex",
                    alignItems: "center",
                    fontSize: { xs: "0.75rem", md: "0.8125rem" },
                  }}
                >
                  {row.feature}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {row.kaero ? (
                    <CheckCircleOutlineIcon
                      sx={{ color: "primary.main", fontSize: { xs: 18, md: 20 } }}
                    />
                  ) : (
                    <CancelOutlinedIcon
                      sx={{ color: "text.disabled", fontSize: { xs: 18, md: 20 } }}
                    />
                  )}
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {row.traditional ? (
                    <CheckCircleOutlineIcon
                      sx={{ color: "primary.main", fontSize: { xs: 18, md: 20 } }}
                    />
                  ) : (
                    <CancelOutlinedIcon
                      sx={{ color: "error.main", fontSize: { xs: 18, md: 20 } }}
                    />
                  )}
                </Box>
              </Box>
            ))}
          </Box>
        </ScrollReveal>
      </Box>
    </Box>
  );
}
