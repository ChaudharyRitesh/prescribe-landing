"use client";

import React from "react";
import { Box, Typography, Divider, Grid } from "@mui/material";
import {
  LocalHospitalOutlinedIcon,
} from "@/shared/icons/patientPortalIcons";
import type { IpAdmissionRecord } from "../types/admissionRecord.types";

interface AdmissionSummaryProps {
  record: IpAdmissionRecord;
}

export const AdmissionSummary = ({ record }: AdmissionSummaryProps) => {
  const formatDate = (isoString?: string) => {
    if (!isoString) return "Not recorded";
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(isoString));
  };

  const fields = [
    { label: "Attending physician", value: record.attendingPractitioner?.displayName },
    { label: "Department", value: record.attendingPractitioner?.specialty },
    { label: "Facility", value: record.facility.displayName + (record.facility.city ? `, ${record.facility.city}` : "") },
    { label: "Diagnosis", value: record.diagnosis?.displayName },
    { label: "Procedure", value: record.procedure?.displayName },
    { label: "Admission", value: formatDate(record.admission.admittedAt) },
    { label: "Discharge", value: formatDate(record.admission.dischargedAt) },
    { label: "Blood group", value: record.bloodGroup },
  ].filter(f => f.value);

  return (
    <Box sx={{ mb: 4, borderRadius: "12px", border: "1px solid #E5E7EB", bgcolor: "#FFFFFF", overflow: "hidden" }}>
      <Box sx={{ px: 3, py: 2, borderBottom: "1px solid #E5E7EB", display: "flex", alignItems: "center", gap: 1.5 }}>
        <Box sx={{ bgcolor: "#F3F4F6", color: "#4B5563", p: 1, borderRadius: "8px", display: "flex" }}>
          <LocalHospitalOutlinedIcon sx={{ fontSize: 20 }} />
        </Box>
        <Typography variant="h6" fontWeight="700" color="#111827">
          Admission Summary
        </Typography>
      </Box>
      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {fields.map((field, idx) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={idx}>
              <Typography variant="caption" color="#6B7280" sx={{ display: "block", mb: 0.5, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {field.label}
              </Typography>
              <Typography variant="body2" color="#111827" fontWeight="500">
                {field.value}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};
