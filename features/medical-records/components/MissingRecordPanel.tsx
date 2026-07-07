"use client";

import React from "react";
import { Box, Typography, Button, Card, CardContent, Stack } from "@mui/material";
import { HelpOutlineIcon } from "@/shared/icons/patientPortalIcons";

interface MissingRecordPanelProps {
  onClearFilters: () => void;
}

export const MissingRecordPanel = ({ onClearFilters }: MissingRecordPanelProps) => {
  return (
    <Card sx={{ borderRadius: "12px", border: "1px solid #E5E7EB", boxShadow: "none", bgcolor: "#F9FAFB", mt: 3 }}>
      <CardContent sx={{ p: 3, pb: "24px !important" }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
          <Box sx={{ bgcolor: "#EEF2FF", color: "#6366F1", p: 1, borderRadius: "10px", display: "flex", flexShrink: 0 }}>
            <HelpOutlineIcon sx={{ fontSize: 22 }} />
          </Box>
          <Box>
            <Typography variant="subtitle1" fontWeight="700" color="#111827" gutterBottom>
              Can&apos;t find a record?
            </Typography>
            <Typography variant="body2" color="#6B7280" sx={{ mb: 2, lineHeight: 1.6 }}>
              Some records may take time to appear or may require linking from the healthcare facility.
              Check your filters first, then contact support if the record is still unavailable.
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                size="small"
                onClick={onClearFilters}
                sx={{
                  textTransform: "none",
                  color: "#374151",
                  borderColor: "#D1D5DB",
                  fontWeight: 500,
                  borderRadius: "8px",
                }}
              >
                Clear filters
              </Button>
              <Button
                variant="outlined"
                size="small"
                disabled
                startIcon={<HelpOutlineIcon sx={{ fontSize: 16 }} />}
                sx={{
                  textTransform: "none",
                  fontWeight: 500,
                  borderRadius: "8px",
                  borderColor: "#D1D5DB",
                }}
              >
                Contact support
              </Button>
            </Stack>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
