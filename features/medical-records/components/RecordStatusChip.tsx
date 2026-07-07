"use client";

import React from "react";
import { Chip } from "@mui/material";
import type { RecordStatus } from "../types/medicalRecords.types";
import { STATUS_LABELS } from "../types/medicalRecords.types";

const STATUS_CHIP_STYLES: Record<RecordStatus, { bg: string; color: string }> = {
  new: { bg: "#EEF2FF", color: "#6366F1" },
  available: { bg: "#ECFDF5", color: "#059669" },
  completed: { bg: "#F3F4F6", color: "#374151" },
  pending: { bg: "#FFF7ED", color: "#D97706" },
  corrected: { bg: "#F5F3FF", color: "#7C3AED" },
  superseded: { bg: "#F3F4F6", color: "#6B7280" },
  unavailable: { bg: "#FEF2F2", color: "#DC2626" },
};

export const RecordStatusChip = ({ status }: { status: RecordStatus }) => {
  const style = STATUS_CHIP_STYLES[status] || STATUS_CHIP_STYLES.completed;

  return (
    <Chip
      label={STATUS_LABELS[status] || status}
      size="small"
      sx={{
        height: 24,
        fontSize: "0.75rem",
        fontWeight: 600,
        bgcolor: style.bg,
        color: style.color,
        borderRadius: "6px",
      }}
    />
  );
};
