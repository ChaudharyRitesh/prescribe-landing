"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import { ChecklistOutlinedIcon } from "@/shared/icons/patientPortalIcons";

interface DischargeInstructionsProps {
  instructions?: string[];
}

export const DischargeInstructions = ({ instructions }: DischargeInstructionsProps) => {
  if (!instructions || instructions.length === 0) return null;

  return (
    <Box sx={{ mb: 4, borderRadius: "12px", border: "1px solid #E5E7EB", bgcolor: "#FFFFFF", overflow: "hidden" }}>
      <Box sx={{ px: 3, py: 2, borderBottom: "1px solid #E5E7EB", display: "flex", alignItems: "center", gap: 1.5 }}>
        <Box sx={{ bgcolor: "#F3F4F6", color: "#4B5563", p: 1, borderRadius: "8px", display: "flex" }}>
          <ChecklistOutlinedIcon sx={{ fontSize: 20 }} />
        </Box>
        <Typography variant="h6" fontWeight="700" color="#111827">
          Discharge Instructions
        </Typography>
      </Box>
      <Box sx={{ p: 3 }}>
        <ul style={{ margin: 0, paddingLeft: "1.25rem", color: "#4B5563" }}>
          {instructions.map((inst, idx) => {
            const isWarning = inst.toLowerCase().includes("warning sign") || inst.toLowerCase().includes("immediate attention");
            return (
              <li key={idx} style={{ marginBottom: idx === instructions.length - 1 ? 0 : "1rem", lineHeight: 1.7 }}>
                <Typography variant="body1" sx={{ display: "inline", color: isWarning ? "#B45309" : "inherit", fontWeight: isWarning ? 600 : 400, fontSize: "1rem" }}>
                  {inst}
                </Typography>
              </li>
            );
          })}
        </ul>
        <Typography variant="caption" color="#9CA3AF" sx={{ display: "block", mt: 3, fontStyle: "italic" }}>
          These instructions were provided by the treating facility.
        </Typography>
      </Box>
    </Box>
  );
};
