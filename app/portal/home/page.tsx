"use client";

import React from "react";
import { Container, Box } from "@mui/material";

// Feature Components
import { GreetingSection } from "@/features/patient-home/components/GreetingSection";
import { HealthSnapshot } from "@/features/patient-home/components/HealthSnapshot";
import { QuickAccessGrid } from "@/features/patient-home/components/QuickAccessGrid";
import { RecentMedicalRecords } from "@/features/patient-home/components/RecentMedicalRecords";
import { UpcomingAppointments } from "@/features/patient-home/components/UpcomingAppointments";
import { PatientReminder } from "@/features/patient-home/components/PatientReminder";

export default function PatientHomePage() {
  return (
    <Container 
      maxWidth={false} 
      disableGutters 
      sx={{ 
        px: { xs: 2, sm: 3, md: 4 }, 
        py: { xs: 3, md: 5 }, 
        maxWidth: 1440,
        margin: "0 auto"
      }}
    >
      <GreetingSection />
      
      <HealthSnapshot />

      <QuickAccessGrid />

      <Box 
        sx={{ 
          display: "grid", 
          gridTemplateColumns: { xs: "1fr", lg: "repeat(12, 1fr)" }, 
          gap: 3 
        }}
      >
        <Box sx={{ gridColumn: { xs: "span 1", lg: "span 8" } }}>
          <RecentMedicalRecords />
        </Box>

        <Box sx={{ gridColumn: { xs: "span 1", lg: "span 4" }, display: "flex", flexDirection: "column" }}>
          <UpcomingAppointments />
          <PatientReminder />
        </Box>
      </Box>
    </Container>
  );
}
