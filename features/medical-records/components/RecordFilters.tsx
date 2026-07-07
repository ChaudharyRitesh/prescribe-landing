"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  SearchOutlinedIcon,
  CloseOutlinedIcon,
  DateRangeOutlinedIcon,
  FilterListOutlinedIcon,
  TuneOutlinedIcon,
} from "@/shared/icons/patientPortalIcons";
import type { DateRange, RecordStatus } from "../types/medicalRecords.types";
import { DATE_RANGE_LABELS, STATUS_LABELS } from "../types/medicalRecords.types";

interface RecordFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  dateRange: DateRange;
  onDateRangeChange: (value: DateRange) => void;
  status: RecordStatus | "all";
  onStatusChange: (value: RecordStatus | "all") => void;
  onClearAll: () => void;
  hasActiveFilters: boolean;
  onOpenMobileFilters?: () => void;
}

export const RecordFilters = ({
  search,
  onSearchChange,
  dateRange,
  onDateRangeChange,
  status,
  onStatusChange,
  onClearAll,
  hasActiveFilters,
  onOpenMobileFilters,
}: RecordFiltersProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [localSearch, setLocalSearch] = useState(search);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      if (localSearch !== search) onSearchChange(localSearch);
    }, 350);
    return () => clearTimeout(t);
  }, [localSearch, search, onSearchChange]);

  // Sync external search changes
  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  const clearSearch = useCallback(() => {
    setLocalSearch("");
    onSearchChange("");
  }, [onSearchChange]);

  return (
    <Box sx={{ mb: 3 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
          alignItems: { md: "center" },
        }}
      >
        {/* Search */}
        <TextField
          size="small"
          placeholder="Search by record title, practitioner, facility, or record ID"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          sx={{
            flex: 1,
            maxWidth: { md: 480 },
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              bgcolor: "#FFFFFF",
              "& fieldset": { borderColor: "#E5E7EB", borderWidth: 1 },
              "&:hover fieldset": { borderColor: "#D1D5DB" },
              "&.Mui-focused fieldset": { borderColor: "#6366F1", borderWidth: 2 },
            },
            "& .MuiInputLabel-root.Mui-focused": { color: "#6366F1" },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlinedIcon sx={{ fontSize: 20, color: "#9CA3AF" }} />
              </InputAdornment>
            ),
            endAdornment: localSearch ? (
              <InputAdornment position="end">
                <IconButton size="small" onClick={clearSearch} aria-label="Clear search">
                  <CloseOutlinedIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </InputAdornment>
            ) : null,
          }}
        />

        {/* Desktop: Date Range + Status */}
        {!isMobile ? (
          <Stack direction="row" spacing={2}>
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel id="date-range-label">
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <DateRangeOutlinedIcon sx={{ fontSize: 16 }} /> Date Range
                </Box>
              </InputLabel>
              <Select
                labelId="date-range-label"
                value={dateRange}
                label="Date Range    "
                onChange={(e) => onDateRangeChange(e.target.value as DateRange)}
                sx={{ borderRadius: "8px", bgcolor: "#FFFFFF", "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#6366F1" } }}
              >
                {(Object.keys(DATE_RANGE_LABELS) as DateRange[]).map((key) => (
                  <MenuItem key={key} value={key}>{DATE_RANGE_LABELS[key]}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel id="status-filter-label">
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <FilterListOutlinedIcon sx={{ fontSize: 16 }} /> Status
                </Box>
              </InputLabel>
              <Select
                labelId="status-filter-label"
                value={status}
                label="Status     "
                onChange={(e) => onStatusChange(e.target.value as RecordStatus | "all")}
                sx={{ borderRadius: "8px", bgcolor: "#FFFFFF", "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#6366F1" } }}
              >
                <MenuItem value="all">All statuses</MenuItem>
                {(Object.keys(STATUS_LABELS) as RecordStatus[]).map((key) => (
                  <MenuItem key={key} value={key}>{STATUS_LABELS[key]}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        ) : (
          /* Mobile: Filters button */
          <Button
            variant="outlined"
            startIcon={<TuneOutlinedIcon />}
            onClick={onOpenMobileFilters}
            sx={{
              textTransform: "none",
              color: "#374151",
              borderColor: "#D1D5DB",
              fontWeight: 500,
              borderRadius: "8px",
              alignSelf: "flex-start",
            }}
          >
            Filters
            {hasActiveFilters && (
              <Chip label="Active" size="small" sx={{ ml: 1, height: 20, fontSize: "0.7rem", bgcolor: "#EEF2FF", color: "#6366F1" }} />
            )}
          </Button>
        )}
      </Box>

      {/* Active filter chips */}
      {hasActiveFilters && (
        <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: "wrap", gap: 1 }}>
          {dateRange !== "all" && (
            <Chip
              label={DATE_RANGE_LABELS[dateRange]}
              size="small"
              onDelete={() => onDateRangeChange("all")}
              sx={{ borderRadius: "6px" }}
            />
          )}
          {status !== "all" && (
            <Chip
              label={STATUS_LABELS[status]}
              size="small"
              onDelete={() => onStatusChange("all")}
              sx={{ borderRadius: "6px" }}
            />
          )}
          {search.trim() && (
            <Chip
              label={`Search: "${search}"`}
              size="small"
              onDelete={clearSearch}
              sx={{ borderRadius: "6px" }}
            />
          )}
          <Button
            variant="text"
            size="small"
            onClick={onClearAll}
            sx={{ textTransform: "none", color: "#6366F1", fontWeight: 600 }}
          >
            Clear all filters
          </Button>
        </Stack>
      )}
    </Box>
  );
};
