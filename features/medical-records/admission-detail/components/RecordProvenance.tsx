"use client";

import React from "react";
import { Box, Typography, Card, CardContent } from "@mui/material";
import { SourceOutlinedIcon } from "@/shared/icons/patientPortalIcons";
import type { IpAdmissionRecord } from "../types/admissionRecord.types";

interface RecordProvenanceProps {
  source: IpAdmissionRecord["source"];
}

export const RecordProvenance = ({ source }: RecordProvenanceProps) => {
  const formattedDate = new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(source.lastUpdatedAt));

  const sourceLabels: Record<string, string> = {
    "kaero-prescribe": "KaeroPrescribe",
    "facility": "Facility provided",
    "abdm": "ABDM linked",
    "patient-upload": "Patient uploaded",
  };

  return (
    <Card sx={{ borderRadius: "12px", border: "1px solid #E5E7EB", boxShadow: "none", mb: 4 }}>
      <CardContent sx={{ p: 3, pb: "24px !important" }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
          <Box sx={{ mt: 0.5, color: "#6B7280" }}>
            <SourceOutlinedIcon sx={{ fontSize: 20 }} />
          </Box>
          <Box>
            <Typography variant="subtitle2" fontWeight="700" color="#111827" gutterBottom>
              Record Source
            </Typography>
            <Typography variant="body2" color="#4B5563" sx={{ mb: 0.5 }}>
              <span style={{ fontWeight: 600 }}>Source:</span> {source.facilityName}
            </Typography>
            <Typography variant="body2" color="#4B5563" sx={{ mb: 0.5 }}>
              <span style={{ fontWeight: 600 }}>System:</span> {sourceLabels[source.type] || source.type}
            </Typography>
            <Typography variant="body2" color="#6B7280" sx={{ fontSize: "0.75rem" }}>
              Last updated: {formattedDate}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
