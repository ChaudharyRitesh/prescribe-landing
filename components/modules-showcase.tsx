"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import MuiLink from "@mui/material/Link";
import ScrollReveal from "./scroll-reveal";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LocalPharmacyOutlinedIcon from "@mui/icons-material/LocalPharmacyOutlined";
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import BiotechOutlinedIcon from "@mui/icons-material/BiotechOutlined";

interface Module {
  title: string;
  description: string;
  icon?: string;
  image?: {
    imageUpload?: any;
    imageUrl?: string;
  };
  features?: string[];
}

interface ModulesShowcaseProps {
  modules: Module[];
}

const defaultModules = [
  {
    title: "Pharmacy Admin",
    description:
      "Complete inventory management, order processing, supplier integration, and sales analytics with integrated billing and secure payments.",
    icon: <LocalPharmacyOutlinedIcon sx={{ color: "#0D9488", fontSize: 24 }} />,
    features: [
      "Inventory management",
      "Order processing",
      "Supplier integration",
      "Sales analytics",
      "Integrated billing",
      "Secure payments",
    ],
  },
  {
    title: "Doctor's Portal",
    description:
      "Unified patient management with e-prescriptions, appointment scheduling, telemedicine, clinical decision support, and medicine alerts.",
    icon: <MedicalServicesOutlinedIcon sx={{ color: "#0D9488", fontSize: 24 }} />,
    features: [
      "Patient history",
      "E-prescriptions",
      "Appointment scheduling",
      "Telemedicine integration",
      "Clinical decision support",
      "Medicine suggestions & alerts",
    ],
  },
  {
    title: "Reception & Ops",
    description:
      "Smart queue management, appointment scheduling, patient check-in/out, staff management, notifications, and operational reporting.",
    icon: <EventNoteOutlinedIcon sx={{ color: "#0D9488", fontSize: 24 }} />,
    features: [
      "Appointment scheduling",
      "Patient check-in/out",
      "Queue management",
      "Notifications & reminders",
      "Staff management",
      "Reporting & analytics",
    ],
  },
  {
    title: "Lab Dashboard",
    description:
      "Analyzer interfacing, quality control with abnormal result alerts, and secure digital report delivery to patients.",
    icon: <BiotechOutlinedIcon sx={{ color: "#0D9488", fontSize: 24 }} />,
    features: [
      "Analyzer interfacing",
      "Quality control & alerts",
      "Digital report delivery",
    ],
  },
];

export function ModulesShowcase({ modules }: ModulesShowcaseProps) {
  const [activeTab, setActiveTab] = useState(0);
  const displayModules = defaultModules;

  return (
    <Box
      component="section"
      id="modules"
      sx={{
        py: { xs: 6, md: 10 },
        px: 2,
        background: "#F8FAFC",
        scrollMarginTop: "72px",
      }}
    >
      <Box sx={{ maxWidth: 1280, mx: "auto" }}>
        <ScrollReveal>
          <Box sx={{ textAlign: "center", mb: { xs: 4, md: 6 } }}>
            <Typography
              variant="caption"
              sx={{ color: "primary.dark", mb: 1, display: "block" }}
            >
              Platform Modules
            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: "1.375rem", md: "2rem" },
                mb: 1.5,
              }}
            >
              4+ Modules. One Unified Core
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: 600, mx: "auto" }}
            >
              Each module functions as a complete standalone solution while
              remaining deeply interconnected through a unified data
              architecture.
            </Typography>
          </Box>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          {/* Scrollable tab switcher */}
          <Tabs
            value={activeTab}
            onChange={(_, v) => setActiveTab(v)}
            variant="scrollable"
            scrollButtons={false}
            sx={{
              mb: 3,
              "& .MuiTabs-flexContainer": { gap: 1, justifyContent: "center" },
            }}
          >
            {displayModules.map((m, i) => (
              <Tab key={m.title} label={m.title} value={i} disableRipple />
            ))}
          </Tabs>

          {/* Active module card */}
          <Box sx={{ maxWidth: 600, mx: "auto" }}>
            <Card>
              <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
                {/* Icon box */}
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
                  }}
                >
                  {displayModules[activeTab].icon}
                </Box>

                <Typography variant="h3" sx={{ mb: 0.5 }}>
                  {displayModules[activeTab].title}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1.5 }}
                >
                  {displayModules[activeTab].description}
                </Typography>

                {/* Feature chips */}
                <Stack
                  direction="row"
                  spacing={0.5}
                  flexWrap="wrap"
                  useFlexGap
                  sx={{ mb: 2 }}
                >
                  {displayModules[activeTab].features.map((f) => (
                    <Chip
                      key={f}
                      label={f}
                      size="small"
                      sx={{
                        background: "#F1F5F9",
                        color: "#475569",
                        fontSize: "0.6875rem",
                        borderRadius: 1,
                      }}
                    />
                  ))}
                </Stack>

                <MuiLink
                  href="#"
                  underline="none"
                  sx={{
                    color: "primary.dark",
                    fontWeight: 600,
                    fontSize: "0.8125rem",
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    "&:hover": { color: "primary.main" },
                  }}
                >
                  Learn more <ArrowForwardIcon sx={{ fontSize: 14 }} />
                </MuiLink>
              </CardContent>
            </Card>
          </Box>
        </ScrollReveal>
      </Box>
    </Box>
  );
}
