"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Card,
  Skeleton,
  Box,
} from "@mui/material";
import { RecordTableRow } from "./RecordTableRow";
import type { PatientRecordListItem } from "../types/medicalRecords.types";

interface RecordsTableProps {
  records: PatientRecordListItem[];
  selectedIds: Set<string>;
  onSelect: (id: string) => void;
  onSelectAll: () => void;
  allEligibleSelected: boolean;
  someSelected: boolean;
  isLoading: boolean;
  onView: (id: string) => void;
  onDownload: (id: string) => void;
}

const HEADER_STYLE = {
  color: "#6B7280",
  fontWeight: 700,
  fontSize: "0.75rem",
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
  borderBottom: "1px solid #E5E7EB",
  whiteSpace: "nowrap" as const,
};

export const RecordsTable = ({
  records,
  selectedIds,
  onSelect,
  onSelectAll,
  allEligibleSelected,
  someSelected,
  isLoading,
  onView,
  onDownload,
}: RecordsTableProps) => {
  if (isLoading) {
    return (
      <Card sx={{ borderRadius: "12px", border: "1px solid #E5E7EB", boxShadow: "0 1px 2px rgba(0,0,0,0.05)", overflow: "hidden" }}>
        <Box sx={{ p: 0 }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Box key={i} sx={{ px: 3, py: 2, borderBottom: "1px solid #F3F4F6" }}>
              <Skeleton variant="rectangular" height={40} sx={{ borderRadius: "6px" }} />
            </Box>
          ))}
        </Box>
      </Card>
    );
  }

  return (
    <Card sx={{ borderRadius: "12px", border: "1px solid #E5E7EB", boxShadow: "0 1px 2px rgba(0,0,0,0.05)", overflow: "hidden" }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox" sx={HEADER_STYLE}>
                <Checkbox
                  indeterminate={someSelected && !allEligibleSelected}
                  checked={allEligibleSelected && records.length > 0}
                  onChange={onSelectAll}
                  inputProps={{ "aria-label": "Select all eligible records" }}
                  sx={{ "&.Mui-checked, &.MuiCheckbox-indeterminate": { color: "#6366F1" } }}
                />
              </TableCell>
              <TableCell sx={HEADER_STYLE}>Record</TableCell>
              <TableCell sx={HEADER_STYLE}>Facility / Practitioner</TableCell>
              <TableCell sx={HEADER_STYLE}>Source</TableCell>
              <TableCell sx={HEADER_STYLE}>Status</TableCell>
              <TableCell sx={HEADER_STYLE}>Date</TableCell>
              <TableCell sx={{ ...HEADER_STYLE, textAlign: "right" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {records.map((record) => (
              <RecordTableRow
                key={record.id}
                record={record}
                selected={selectedIds.has(record.id)}
                onSelect={onSelect}
                onView={onView}
                onDownload={onDownload}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};
