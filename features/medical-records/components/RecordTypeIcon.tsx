"use client";

import React from "react";
import { Box } from "@mui/material";
import { RECORD_TYPE_ICONS, RECORD_TYPE_COLORS } from "@/shared/icons/patientPortalIcons";
import type { RecordType } from "../types/medicalRecords.types";

interface RecordTypeIconProps {
  type: RecordType;
  size?: number;
}

export const RecordTypeIcon = ({ type, size = 18 }: RecordTypeIconProps) => {
  const IconComponent = RECORD_TYPE_ICONS[type];
  const colors = RECORD_TYPE_COLORS[type] || { bg: "#F3F4F6", fg: "#4B5563" };

  if (!IconComponent) return null;

  return (
    <Box
      sx={{
        width: 36,
        height: 36,
        borderRadius: "10px",
        bgcolor: colors.bg,
        color: colors.fg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <IconComponent sx={{ fontSize: size }} />
    </Box>
  );
};
