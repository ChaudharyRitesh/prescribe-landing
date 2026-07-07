"use client";

import React from "react";
import { Chip } from "@mui/material";
import type { RecordStatus } from "../types/medicalRecords.types";
import { STATUS_LABELS } from "../types/medicalRecords.types";

export const STATUS_CHIP_STYLES: Record<RecordStatus, { bg: string; color: string; border: string }> = {
  new: { bg: "#EFF6FF", color: "#2563EB", border: "#BFDBFE" },
  available: { bg: "#F0FDFA", color: "#0F766E", border: "#99F6E4" },
  completed: { bg: "#F0FDF4", color: "#16A34A", border: "#BBF7D0" },
  pending: { bg: "#FFFBEB", color: "#D97706", border: "#FDE68A" },
  corrected: { bg: "#F5F3FF", color: "#7C3AED", border: "#DDD6FE" },
  superseded: { bg: "#F8FAFC", color: "#64748B", border: "#E2E8F0" },
  unavailable: { bg: "#FEF2F2", color: "#DC2626", border: "#FECACA" },
};

export const RecordStatusChip = ({ status }: { status: RecordStatus }) => {
  const style = STATUS_CHIP_STYLES[status] || STATUS_CHIP_STYLES.completed;

  return (
    <Chip
      label={STATUS_LABELS[status] || status}
      size="small"
      sx={{
        height: 26,
        fontSize: "0.75rem",
        fontWeight: 700,
        bgcolor: style.bg,
        color: style.color,
        borderRadius: "6px",
        border: `1px solid ${style.border}`,
        "& .MuiChip-label": { px: 1.1 },
      }}
    />
  );
};
