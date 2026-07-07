"use client";

import React from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import { PublishedWithChangesOutlinedIcon } from "@/shared/icons/patientPortalIcons";

interface RecordCorrectionBannerProps {
  status: string;
}

export const RecordCorrectionBanner = ({ status }: RecordCorrectionBannerProps) => {
  if (status !== "superseded" && status !== "corrected") return null;

  const isSuperseded = status === "superseded";
  const bg = isSuperseded ? "#FFFBEB" : "#F5F3FF";
  const color = isSuperseded ? "#D97706" : "#7C3AED";
  const title = isSuperseded
    ? "A newer version of this record is available."
    : "This record was corrected.";

  return (
    <Paper
      elevation={0}
      sx={{
        bgcolor: bg,
        borderRadius: "12px",
        p: 2,
        mb: 4,
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "flex-start", sm: "center" },
        justifyContent: "space-between",
        gap: 2,
        border: `1px solid ${isSuperseded ? "#FDE68A" : "#DDD6FE"}`,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <PublishedWithChangesOutlinedIcon sx={{ color, fontSize: 24 }} />
        <Typography variant="body2" fontWeight="600" sx={{ color: "#111827" }}>
          {title}
        </Typography>
      </Box>
      <Button
        variant="text"
        size="small"
        sx={{
          textTransform: "none",
          fontWeight: 600,
          color,
          bgcolor: "rgba(255,255,255,0.5)",
          borderRadius: "8px",
          px: 2,
          "&:hover": { bgcolor: "rgba(255,255,255,0.8)" },
        }}
      >
        {isSuperseded ? "View latest version" : "View correction details"}
      </Button>
    </Paper>
  );
};
