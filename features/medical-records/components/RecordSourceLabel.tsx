"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import { VerifiedOutlinedIcon } from "@/shared/icons/patientPortalIcons";
import type { RecordSource } from "../types/medicalRecords.types";

const SOURCE_MAP: Record<RecordSource, { label: string; color: string }> = {
  "kaero-prescribe": { label: "KaeroPrescribe", color: "#6366F1" },
  facility: { label: "Facility provided", color: "#4B5563" },
  abdm: { label: "ABDM linked", color: "#2563EB" },
  "patient-upload": { label: "Patient uploaded", color: "#059669" },
};

export const RecordSourceLabel = ({ source }: { source: RecordSource }) => {
  const info = SOURCE_MAP[source] || { label: source, color: "#4B5563" };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
      <VerifiedOutlinedIcon sx={{ fontSize: 14, color: info.color }} />
      <Typography variant="caption" sx={{ color: info.color, fontWeight: 500, textTransform: "none", letterSpacing: 0 }}>
        {info.label}
      </Typography>
    </Box>
  );
};
