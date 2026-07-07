"use client";

import React from "react";
import { Box, Typography, Button, Card, CardContent, Tooltip } from "@mui/material";
import { SupportAgentOutlinedIcon } from "@/shared/icons/patientPortalIcons";

export const AdmissionSupportPanel = () => {
  return (
    <Card sx={{ borderRadius: "12px", border: "1px solid #E5E7EB", boxShadow: "none", bgcolor: "#F9FAFB" }}>
      <CardContent sx={{ p: 3, pb: "24px !important" }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
          <Box sx={{ bgcolor: "#EEF2FF", color: "#6366F1", p: 1, borderRadius: "8px", display: "flex", flexShrink: 0 }}>
            <SupportAgentOutlinedIcon sx={{ fontSize: 20 }} />
          </Box>
          <Box>
            <Typography variant="subtitle2" fontWeight="700" color="#111827" gutterBottom>
              Need help understanding this record?
            </Typography>
            <Typography variant="body2" color="#6B7280" sx={{ mb: 2, lineHeight: 1.6 }}>
              Contact the healthcare facility or patient support if any information appears incomplete or incorrect.
            </Typography>
            <Tooltip title="Support contact will be available in a later phase">
              <span>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<SupportAgentOutlinedIcon sx={{ fontSize: 16 }} />}
                  disabled
                  sx={{
                    textTransform: "none",
                    fontWeight: 500,
                    borderRadius: "8px",
                    borderColor: "#D1D5DB",
                    "&.Mui-disabled": { borderColor: "#E5E7EB", color: "#9CA3AF" },
                  }}
                >
                  Contact support
                </Button>
              </span>
            </Tooltip>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
