"use client";

import React from "react";
import {
  TableRow,
  TableCell,
  Checkbox,
  Box,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  VisibilityOutlinedIcon,
  DownloadOutlinedIcon,
} from "@/shared/icons/patientPortalIcons";
import { RecordTypeIcon } from "./RecordTypeIcon";
import { RecordSourceLabel } from "./RecordSourceLabel";
import { RecordStatusChip } from "./RecordStatusChip";
import type { PatientRecordListItem } from "../types/medicalRecords.types";

interface RecordTableRowProps {
  record: PatientRecordListItem;
  selected: boolean;
  onSelect: (id: string) => void;
  onView: (id: string) => void;
  onDownload: (id: string) => void;
}

export const RecordTableRow = ({
  record,
  selected,
  onSelect,
  onView,
  onDownload,
}: RecordTableRowProps) => {
  const formattedDate = new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(record.recordDate));

  return (
    <TableRow
      hover
      selected={selected}
      sx={{
        "&.Mui-selected": { bgcolor: "#F8F7FF" },
        "&.Mui-selected:hover": { bgcolor: "#F0EEFF" },
      }}
    >
      {/* Selection */}
      <TableCell padding="checkbox">
        <Checkbox
          checked={selected}
          onChange={() => onSelect(record.id)}
          disabled={!record.canSelect}
          inputProps={{ "aria-label": `Select ${record.title}` }}
          sx={{ "&.Mui-checked": { color: "#6366F1" } }}
        />
      </TableCell>

      {/* Record */}
      <TableCell>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <RecordTypeIcon type={record.recordType} />
          <Box>
            <Typography variant="body2" fontWeight="700" color="#111827">
              {record.title}
            </Typography>
            <Typography variant="caption" color="#6B7280" sx={{ textTransform: "none", letterSpacing: 0 }}>
              {record.categoryLabel}
              {record.recordReference && ` · Record ···· ${record.recordReference.slice(-4)}`}
            </Typography>
          </Box>
        </Box>
      </TableCell>

      {/* Facility / Practitioner */}
      <TableCell>
        <Typography variant="body2" color="#111827" fontWeight="500">
          {record.facility.displayName}
        </Typography>
        {record.practitioner && (
          <Typography variant="caption" color="#6B7280" sx={{ textTransform: "none", letterSpacing: 0 }}>
            {record.practitioner.displayName}
          </Typography>
        )}
      </TableCell>

      {/* Source */}
      <TableCell>
        <RecordSourceLabel source={record.source} />
      </TableCell>

      {/* Status */}
      <TableCell>
        <RecordStatusChip status={record.status} />
      </TableCell>

      {/* Date */}
      <TableCell sx={{ color: "#374151", fontWeight: 500, whiteSpace: "nowrap" }}>
        {formattedDate}
      </TableCell>

      {/* Actions */}
      <TableCell align="right">
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 0.5 }}>
          <Tooltip title={record.canView ? "View record" : "Record not available for viewing"}>
            <span>
              <IconButton
                size="small"
                onClick={() => onView(record.id)}
                disabled={!record.canView}
                aria-label={`View ${record.title}`}
                sx={{ minWidth: 40, minHeight: 40 }}
              >
                <VisibilityOutlinedIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title={record.canDownload ? "Download record" : "Download not available for this record"}>
            <span>
              <IconButton
                size="small"
                onClick={() => onDownload(record.id)}
                disabled={!record.canDownload}
                aria-label={`Download ${record.title}`}
                sx={{ minWidth: 40, minHeight: 40 }}
              >
                <DownloadOutlinedIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      </TableCell>
    </TableRow>
  );
};
