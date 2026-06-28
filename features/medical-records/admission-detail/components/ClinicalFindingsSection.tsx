"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import { FactCheckOutlinedIcon } from "@/shared/icons/patientPortalIcons";
import type { IpAdmissionRecord } from "../types/admissionRecord.types";

interface ClinicalFindingsSectionProps {
  clinicalSections: IpAdmissionRecord["clinicalSections"];
}

export const ClinicalFindingsSection = ({ clinicalSections }: ClinicalFindingsSectionProps) => {
  const sections = [
    { title: "Presenting symptoms", content: clinicalSections.presentingSymptoms },
    { title: "Clinical findings", content: clinicalSections.findings },
    { title: "Procedure performed", content: clinicalSections.procedureNote },
    { title: "Post-procedure outcome", content: clinicalSections.outcome },
  ].filter(s => s.content);

  if (sections.length === 0) return null;

  return (
    <Box sx={{ mb: 4, borderRadius: "12px", border: "1px solid #E5E7EB", bgcolor: "#FFFFFF", overflow: "hidden" }}>
      <Box sx={{ px: 3, py: 2, borderBottom: "1px solid #E5E7EB", display: "flex", alignItems: "center", gap: 1.5 }}>
        <Box sx={{ bgcolor: "#F3F4F6", color: "#4B5563", p: 1, borderRadius: "8px", display: "flex" }}>
          <FactCheckOutlinedIcon sx={{ fontSize: 20 }} />
        </Box>
        <Typography variant="h6" fontWeight="700" color="#111827">
          Clinical Findings & Procedure
        </Typography>
      </Box>
      <Box sx={{ p: 3 }}>
        {sections.map((section, idx) => (
          <Box key={idx} sx={{ mb: idx === sections.length - 1 ? 0 : 3 }}>
            <Typography variant="subtitle2" fontWeight="700" color="#374151" sx={{ mb: 1 }}>
              {section.title}
            </Typography>
            <Typography variant="body1" color="#374151" sx={{ lineHeight: 1.7, fontSize: "1rem" }}>
              {section.content}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
