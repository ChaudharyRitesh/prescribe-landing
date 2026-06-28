"use client";

import React from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  Checkbox,
  Button,
  Stack,
  Skeleton,
} from "@mui/material";
import { VisibilityOutlinedIcon, DownloadOutlinedIcon } from "@/shared/icons/patientPortalIcons";
import { RecordTypeIcon } from "./RecordTypeIcon";
import { RecordSourceLabel } from "./RecordSourceLabel";
import { RecordStatusChip } from "./RecordStatusChip";
import type { PatientRecordListItem } from "../types/medicalRecords.types";

interface RecordMobileCardProps {
  record: PatientRecordListItem;
  selected: boolean;
  onSelect: (id: string) => void;
  onView: (id: string) => void;
  onDownload: (id: string) => void;
}

export const RecordMobileCard = ({ record, selected, onSelect, onView, onDownload }: RecordMobileCardProps) => {
  const formattedDate = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(record.recordDate));

  return (
    <Card
      sx={{
        borderRadius: "12px",
        border: selected ? "1px solid #6366F1" : "1px solid #E5E7EB",
        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
        mb: 2,
        bgcolor: selected ? "#FAFAFE" : "#FFFFFF",
      }}
    >
      <CardContent sx={{ p: "16px !important" }}>
        {/* Top: Checkbox + Icon + Title + Status */}
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, mb: 2 }}>
          <Checkbox
            checked={selected}
            onChange={() => onSelect(record.id)}
            disabled={!record.canSelect}
            sx={{ p: 0, mt: 0.5, "&.Mui-checked": { color: "#6366F1" } }}
            inputProps={{ "aria-label": `Select ${record.title}` }}
          />
          <RecordTypeIcon type={record.recordType} />
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" fontWeight="700" color="#111827">{record.title}</Typography>
            <Typography variant="caption" color="#6B7280" sx={{ textTransform: "none", letterSpacing: 0 }}>
              {record.categoryLabel}
            </Typography>
          </Box>
          <RecordStatusChip status={record.status} />
        </Box>

        {/* Meta */}
        <Box sx={{ ml: 5.5 }}>
          <Typography variant="caption" color="#6B7280" sx={{ display: "block", mb: 0.5, textTransform: "none", letterSpacing: 0 }}>
            {formattedDate}
          </Typography>
          <Typography variant="caption" color="#374151" fontWeight="500" sx={{ display: "block", mb: 0.5, textTransform: "none", letterSpacing: 0 }}>
            {record.facility.displayName}
            {record.practitioner && ` · ${record.practitioner.displayName}`}
          </Typography>
          <RecordSourceLabel source={record.source} />
        </Box>

        {/* Actions */}
        <Stack direction="row" spacing={1} sx={{ mt: 2, ml: 5.5 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<VisibilityOutlinedIcon sx={{ fontSize: 16 }} />}
            disabled={!record.canView}
            onClick={() => onView(record.id)}
            sx={{
              textTransform: "none",
              color: "#6366F1",
              borderColor: "#E5E7EB",
              fontWeight: 600,
              borderRadius: "8px",
              minHeight: 44,
              flex: 1,
            }}
          >
            View details
          </Button>
          {record.canDownload && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<DownloadOutlinedIcon sx={{ fontSize: 16 }} />}
              onClick={() => onDownload(record.id)}
              sx={{
                textTransform: "none",
                color: "#374151",
                borderColor: "#E5E7EB",
                fontWeight: 500,
                borderRadius: "8px",
                minHeight: 44,
              }}
            >
              Download
            </Button>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export const RecordMobileCardSkeleton = () => (
  <Card sx={{ borderRadius: "12px", border: "1px solid #E5E7EB", mb: 2 }}>
    <CardContent sx={{ p: "16px !important" }}>
      <Box sx={{ display: "flex", gap: 1.5, mb: 2 }}>
        <Skeleton variant="circular" width={20} height={20} />
        <Skeleton variant="rounded" width={36} height={36} />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width="70%" height={20} />
          <Skeleton variant="text" width="40%" height={16} />
        </Box>
      </Box>
      <Box sx={{ ml: 5.5 }}>
        <Skeleton variant="text" width="50%" height={16} />
        <Skeleton variant="text" width="60%" height={16} />
      </Box>
    </CardContent>
  </Card>
);
