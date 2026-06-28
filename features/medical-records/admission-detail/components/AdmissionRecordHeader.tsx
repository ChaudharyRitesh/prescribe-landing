"use client";

import React from "react";
import { Box, Typography, Button, Breadcrumbs, Link, Chip, Tooltip } from "@mui/material";
import { useRouter } from "next/navigation";
import {
  ArrowBackOutlinedIcon,
  PictureAsPdfOutlinedIcon,
  CalendarMonthOutlinedIcon,
} from "@/shared/icons/patientPortalIcons";
import type { IpAdmissionRecord } from "../types/admissionRecord.types";
import { STATUS_LABELS } from "@/features/medical-records/types/medicalRecords.types";

interface AdmissionRecordHeaderProps {
  record: IpAdmissionRecord;
  onDownloadSummary: () => void;
  isDownloading: boolean;
}

const STATUS_CHIP_STYLES: Record<string, { bg: string; color: string }> = {
  active: { bg: "#EEF2FF", color: "#6366F1" },
  completed: { bg: "#ECFDF5", color: "#059669" },
  corrected: { bg: "#F5F3FF", color: "#7C3AED" },
  superseded: { bg: "#F3F4F6", color: "#6B7280" },
  unavailable: { bg: "#FEF2F2", color: "#DC2626" },
};

export const AdmissionRecordHeader = ({
  record,
  onDownloadSummary,
  isDownloading,
}: AdmissionRecordHeaderProps) => {
  const router = useRouter();

  const formatDate = (isoString?: string) => {
    if (!isoString) return "";
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(isoString));
  };

  const statusStyle = STATUS_CHIP_STYLES[record.status] || STATUS_CHIP_STYLES.completed;
  const statusLabel = (STATUS_LABELS as any)[record.status] || record.status;

  return (
    <Box sx={{ mb: 4 }}>
      {/* Breadcrumb */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2, "& .MuiBreadcrumbs-separator": { color: "#9CA3AF" } }}>
        <Link
          component="button"
          variant="body2"
          onClick={() => router.push("/portal/records")}
          sx={{
            display: "flex",
            alignItems: "center",
            color: "#6B7280",
            textDecoration: "none",
            "&:hover": { color: "#374151", textDecoration: "underline" },
          }}
        >
          <ArrowBackOutlinedIcon sx={{ fontSize: 16, mr: 0.5 }} />
          Medical Records
        </Link>
        <Typography variant="body2" color="#111827" fontWeight="500">
          IPD Admission
        </Typography>
      </Breadcrumbs>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", md: "center" },
          gap: 2,
        }}
      >
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
            <Typography variant="h4" component="h1" fontWeight="800" color="#111827">
              {record.title}
            </Typography>
            <Chip
              label={statusLabel}
              size="small"
              sx={{
                height: 24,
                fontSize: "0.75rem",
                fontWeight: 600,
                bgcolor: statusStyle.bg,
                color: statusStyle.color,
                borderRadius: "6px",
              }}
            />
          </Box>
          <Typography variant="body1" color="#6B7280" sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            <span>Admission: {formatDate(record.admission.admittedAt)}</span>
            {record.admission.dischargedAt && (
              <>
                <span>•</span>
                <span>Discharge: {formatDate(record.admission.dischargedAt)}</span>
              </>
            )}
            <span>•</span>
            <span>Record reference: •••• {record.patientFacingReference}</span>
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 2, flexShrink: 0, width: { xs: "100%", md: "auto" } }}>
          <Tooltip title={record.permissions.canDownloadSummary ? "" : "You do not have permission to download this summary"}>
            <span>
              <Button
                variant="outlined"
                fullWidth={false}
                startIcon={<PictureAsPdfOutlinedIcon />}
                disabled={!record.permissions.canDownloadSummary || isDownloading}
                onClick={onDownloadSummary}
                sx={{
                  textTransform: "none",
                  color: "#374151",
                  borderColor: "#D1D5DB",
                  fontWeight: 500,
                  borderRadius: "8px",
                  "&:hover": { borderColor: "#9CA3AF", bgcolor: "#F9FAFB" },
                  "&.Mui-disabled": { borderColor: "#E5E7EB", color: "#9CA3AF", bgcolor: "#F9FAFB" },
                  flex: { xs: 1, md: "auto" }
                }}
              >
                {isDownloading ? "Preparing..." : "Download discharge summary"}
              </Button>
            </span>
          </Tooltip>

          <Tooltip title="Follow-up booking will be available in a later phase">
            <span>
              <Button
                variant="contained"
                startIcon={<CalendarMonthOutlinedIcon />}
                disabled
                sx={{
                  textTransform: "none",
                  bgcolor: "#6366F1",
                  fontWeight: 500,
                  borderRadius: "8px",
                  boxShadow: "none",
                  "&:hover": { bgcolor: "#4F46E5", boxShadow: "none" },
                  "&.Mui-disabled": { bgcolor: "#E5E7EB", color: "#9CA3AF" },
                  flex: { xs: 1, md: "auto" }
                }}
              >
                Schedule follow-up
              </Button>
            </span>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
};
