"use client";

import React, { useState, useCallback, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Container,
  Box,
  Typography,
  Alert,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import { MedicalRecordsPageHeader } from "@/features/medical-records/components/MedicalRecordsPageHeader";
import { RecordCategoryTabs } from "@/features/medical-records/components/RecordCategoryTabs";
import { RecordFilters } from "@/features/medical-records/components/RecordFilters";
import { MobileRecordFilters } from "@/features/medical-records/components/MobileRecordFilters";
import { RecordsTable } from "@/features/medical-records/components/RecordsTable";
import { RecordMobileCard, RecordMobileCardSkeleton } from "@/features/medical-records/components/RecordMobileCard";
import { RecordsPagination } from "@/features/medical-records/components/RecordsPagination";
import { MissingRecordPanel } from "@/features/medical-records/components/MissingRecordPanel";

import { usePatientRecordsQuery } from "@/features/medical-records/hooks/usePatientRecordsQuery";
import { useRecordDownloadMutation, useRecordExportMutation } from "@/features/medical-records/hooks/useRecordMutations";

import type {
  RecordCategory,
  DateRange,
  RecordStatus,
} from "@/features/medical-records/types/medicalRecords.types";
import { FolderSharedOutlinedIcon } from "@/shared/icons/patientPortalIcons";

export default function RecordsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // --- URL STATE ---
  const category = (searchParams.get("category") as RecordCategory) || "all";
  const search = searchParams.get("search") || "";
  const dateRange = (searchParams.get("dateRange") as DateRange) || "all";
  const status = (searchParams.get("status") as RecordStatus | "all") || "all";
  const page = parseInt(searchParams.get("page") || "1", 10);

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, val]) => {
        if (val === "" || val === "all" || val === "1") {
          params.delete(key);
        } else {
          params.set(key, val);
        }
      });
      router.push(`/portal/records?${params.toString()}`, { scroll: false });
    },
    [searchParams, router]
  );

  // --- SELECTION (client state) ---
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // --- QUERY ---
  const { data: records, totalCount, totalPages, pageSize, isLoading, error, refetch } =
    usePatientRecordsQuery({ category, search, dateRange, status, page });

  // --- MUTATIONS ---
  const { download: downloadRecord } = useRecordDownloadMutation();
  const { exportRecords, isExporting } = useRecordExportMutation();

  // --- SELECTION LOGIC ---
  const eligibleIds = useMemo(() => records.filter((r) => r.canSelect).map((r) => r.id), [records]);
  const allEligibleSelected = eligibleIds.length > 0 && eligibleIds.every((id) => selectedIds.has(id));
  const someSelected = eligibleIds.some((id) => selectedIds.has(id));

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    if (allEligibleSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(eligibleIds));
    }
  }, [allEligibleSelected, eligibleIds]);

  // --- FILTER HELPERS ---
  const hasActiveFilters = search.trim() !== "" || dateRange !== "all" || status !== "all";

  const clearAll = useCallback(() => {
    setSelectedIds(new Set());
    router.push(`/portal/records${category !== "all" ? `?category=${category}` : ""}`, { scroll: false });
  }, [category, router]);

  const handleView = useCallback((id: string) => {
    router.push(`/portal/records/${id}`);
  }, [router]);

  const handleDownloadSelected = useCallback(() => {
    exportRecords(Array.from(selectedIds));
  }, [selectedIds, exportRecords]);

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{ px: { xs: 2, sm: 3, md: 4 }, py: { xs: 3, md: 5 }, maxWidth: 1440, margin: "0 auto" }}
    >
      {/* Page Header */}
      <MedicalRecordsPageHeader
        selectedCount={selectedIds.size}
        onDownloadSelected={handleDownloadSelected}
        isExporting={isExporting}
      />

      {/* Category Tabs */}
      <RecordCategoryTabs
        value={category}
        onChange={(cat) => {
          setSelectedIds(new Set());
          updateParams({ category: cat, page: "1" });
        }}
      />

      {/* Filters */}
      <RecordFilters
        search={search}
        onSearchChange={(v) => updateParams({ search: v, page: "1" })}
        dateRange={dateRange}
        onDateRangeChange={(v) => updateParams({ dateRange: v, page: "1" })}
        status={status}
        onStatusChange={(v) => updateParams({ status: v, page: "1" })}
        onClearAll={clearAll}
        hasActiveFilters={hasActiveFilters}
        onOpenMobileFilters={() => setMobileFiltersOpen(true)}
      />

      {/* Mobile Filters Drawer */}
      <MobileRecordFilters
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        dateRange={dateRange}
        onDateRangeChange={(v) => updateParams({ dateRange: v, page: "1" })}
        status={status}
        onStatusChange={(v) => updateParams({ status: v, page: "1" })}
        onClearAll={clearAll}
      />

      {/* Error State */}
      {error && (
        <Alert
          severity="error"
          sx={{ borderRadius: "12px", mb: 3 }}
          action={
            <Button color="inherit" size="small" onClick={refetch}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* Content */}
      {!error && (
        <>
          {/* Desktop Table / Mobile Cards */}
          {!isMobile ? (
            <RecordsTable
              records={records}
              selectedIds={selectedIds}
              onSelect={toggleSelect}
              onSelectAll={toggleSelectAll}
              allEligibleSelected={allEligibleSelected}
              someSelected={someSelected}
              isLoading={isLoading}
              onView={handleView}
              onDownload={downloadRecord}
            />
          ) : isLoading ? (
            <Box>
              {[1, 2, 3].map((i) => (
                <RecordMobileCardSkeleton key={i} />
              ))}
            </Box>
          ) : records.length > 0 ? (
            <Box>
              {records.map((record) => (
                <RecordMobileCard
                  key={record.id}
                  record={record}
                  selected={selectedIds.has(record.id)}
                  onSelect={toggleSelect}
                  onView={handleView}
                  onDownload={downloadRecord}
                />
              ))}
            </Box>
          ) : null}

          {/* Empty State */}
          {!isLoading && records.length === 0 && !error && (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <FolderSharedOutlinedIcon sx={{ fontSize: 48, color: "#D1D5DB", mb: 2 }} />
              <Typography variant="h6" fontWeight="600" color="#374151" gutterBottom>
                {hasActiveFilters
                  ? "No records match these filters."
                  : "No medical records are available yet."}
              </Typography>
              <Typography variant="body2" color="#6B7280" sx={{ mb: 3, maxWidth: 400, mx: "auto" }}>
                {hasActiveFilters
                  ? "Try changing the date range, category, or status."
                  : "Records created by participating healthcare facilities will appear here when available."}
              </Typography>
              {hasActiveFilters && (
                <Button
                  variant="outlined"
                  onClick={clearAll}
                  sx={{ textTransform: "none", borderRadius: "8px", color: "#6366F1", borderColor: "#D1D5DB" }}
                >
                  Clear filters
                </Button>
              )}
            </Box>
          )}

          {/* Pagination */}
          {!isLoading && records.length > 0 && (
            <RecordsPagination
              page={page}
              totalPages={totalPages}
              totalCount={totalCount}
              pageSize={pageSize}
              onPageChange={(p) => updateParams({ page: p.toString() })}
            />
          )}
        </>
      )}

      {/* Missing Record Panel */}
      <MissingRecordPanel onClearFilters={clearAll} />
    </Container>
  );
}
