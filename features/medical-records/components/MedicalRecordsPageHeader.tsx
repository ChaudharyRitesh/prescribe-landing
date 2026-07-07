"use client";

import React from "react";
import { Box, Typography, Button, Tooltip, Stack } from "@mui/material";
import {
  DownloadForOfflineOutlinedIcon,
  AddCircleOutlineIcon,
} from "@/shared/icons/patientPortalIcons";

interface MedicalRecordsPageHeaderProps {
  selectedCount: number;
  onDownloadSelected: () => void;
  isExporting: boolean;
}

export const MedicalRecordsPageHeader = ({
  selectedCount,
  onDownloadSelected,
  isExporting,
}: MedicalRecordsPageHeaderProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        justifyContent: "space-between",
        alignItems: { xs: "flex-start", md: "center" },
        gap: 2,
        mb: 4,
      }}
    >
      <Box>
        <Typography variant="h4" component="h1" fontWeight="800" color="#111827" gutterBottom>
          Medical Records
        </Typography>
        <Typography variant="body1" color="#6B7280">
          Access your available clinical records, prescriptions, reports, admissions, and billing documents.
        </Typography>
      </Box>
      <Stack direction="row" spacing={2} sx={{ flexShrink: 0 }}>
        <Button
          variant="outlined"
          startIcon={<DownloadForOfflineOutlinedIcon />}
          disabled={selectedCount === 0 || isExporting}
          onClick={onDownloadSelected}
          sx={{
            textTransform: "none",
            color: "#374151",
            borderColor: "#D1D5DB",
            fontWeight: 500,
            borderRadius: "8px",
            "&:hover": { borderColor: "#9CA3AF", bgcolor: "#F9FAFB" },
            "&.Mui-disabled": { borderColor: "#E5E7EB" },
          }}
        >
          {selectedCount > 0
            ? `Download selected (${selectedCount})`
            : "Download selected"}
        </Button>
        <Tooltip title="Appointment booking will be available in a later phase">
          <span>
            <Button
              variant="contained"
              startIcon={<AddCircleOutlineIcon />}
              disabled
              sx={{
                textTransform: "none",
                bgcolor: "#6366F1",
                fontWeight: 500,
                borderRadius: "8px",
                boxShadow: "none",
                "&:hover": { bgcolor: "#4F46E5", boxShadow: "none" },
              }}
            >
              Book appointment
            </Button>
          </span>
        </Tooltip>
      </Stack>
    </Box>
  );
};
