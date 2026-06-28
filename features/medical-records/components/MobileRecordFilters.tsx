"use client";

import React from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Divider,
} from "@mui/material";
import { CloseOutlinedIcon, DateRangeOutlinedIcon, FilterListOutlinedIcon } from "@/shared/icons/patientPortalIcons";
import type { DateRange, RecordStatus } from "../types/medicalRecords.types";
import { DATE_RANGE_LABELS, STATUS_LABELS } from "../types/medicalRecords.types";

interface MobileRecordFiltersProps {
  open: boolean;
  onClose: () => void;
  dateRange: DateRange;
  onDateRangeChange: (value: DateRange) => void;
  status: RecordStatus | "all";
  onStatusChange: (value: RecordStatus | "all") => void;
  onClearAll: () => void;
}

export const MobileRecordFilters = ({
  open,
  onClose,
  dateRange,
  onDateRangeChange,
  status,
  onStatusChange,
  onClearAll,
}: MobileRecordFiltersProps) => {
  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: "16px 16px 0 0",
          maxHeight: "60vh",
        },
      }}
    >
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h6" fontWeight="700" color="#111827">Filters</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseOutlinedIcon />
          </IconButton>
        </Box>

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel id="m-date-range-label">
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <DateRangeOutlinedIcon sx={{ fontSize: 16 }} /> Date Range
            </Box>
          </InputLabel>
          <Select
            labelId="m-date-range-label"
            value={dateRange}
            label="Date Range    "
            onChange={(e) => onDateRangeChange(e.target.value as DateRange)}
            sx={{ borderRadius: "8px" }}
          >
            {(Object.keys(DATE_RANGE_LABELS) as DateRange[]).map((key) => (
              <MenuItem key={key} value={key}>{DATE_RANGE_LABELS[key]}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel id="m-status-filter-label">
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <FilterListOutlinedIcon sx={{ fontSize: 16 }} /> Status
            </Box>
          </InputLabel>
          <Select
            labelId="m-status-filter-label"
            value={status}
            label="Status     "
            onChange={(e) => onStatusChange(e.target.value as RecordStatus | "all")}
            sx={{ borderRadius: "8px" }}
          >
            <MenuItem value="all">All statuses</MenuItem>
            {(Object.keys(STATUS_LABELS) as RecordStatus[]).map((key) => (
              <MenuItem key={key} value={key}>{STATUS_LABELS[key]}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Divider sx={{ mb: 2 }} />

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => { onClearAll(); onClose(); }}
            sx={{ textTransform: "none", borderRadius: "8px", color: "#374151", borderColor: "#D1D5DB" }}
          >
            Clear all
          </Button>
          <Button
            variant="contained"
            fullWidth
            onClick={onClose}
            sx={{ textTransform: "none", borderRadius: "8px", bgcolor: "#6366F1", boxShadow: "none", "&:hover": { bgcolor: "#4F46E5" } }}
          >
            Apply filters
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};
