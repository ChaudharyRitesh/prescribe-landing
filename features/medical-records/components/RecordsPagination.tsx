"use client";

import React from "react";
import { Box, Typography, Button, IconButton, Stack } from "@mui/material";
import {
  ChevronLeftOutlinedIcon,
  ChevronRightOutlinedIcon,
} from "@/shared/icons/patientPortalIcons";

interface RecordsPaginationProps {
  page: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export const RecordsPagination = ({
  page,
  totalPages,
  totalCount,
  pageSize,
  onPageChange,
}: RecordsPaginationProps) => {
  if (totalPages <= 1) return null;

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalCount);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        justifyContent: "space-between",
        alignItems: "center",
        mt: 3,
        gap: 2,
      }}
    >
      <Typography variant="body2" color="#6B7280">
        Showing {start}–{end} of {totalCount} records
      </Typography>

      <Stack direction="row" spacing={1} alignItems="center">
        <IconButton
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
          sx={{ minWidth: 40, minHeight: 40 }}
        >
          <ChevronLeftOutlinedIcon sx={{ fontSize: 20 }} />
        </IconButton>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <Button
            key={p}
            variant={p === page ? "contained" : "text"}
            onClick={() => onPageChange(p)}
            aria-label={`Page ${p}`}
            aria-current={p === page ? "page" : undefined}
            sx={{
              minWidth: 36,
              minHeight: 36,
              borderRadius: "8px",
              fontWeight: 600,
              fontSize: "0.875rem",
              ...(p === page
                ? { bgcolor: "#6366F1", color: "#FFFFFF", boxShadow: "none", "&:hover": { bgcolor: "#4F46E5" } }
                : { color: "#374151" }),
            }}
          >
            {p}
          </Button>
        ))}

        <IconButton
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Next page"
          sx={{ minWidth: 40, minHeight: 40 }}
        >
          <ChevronRightOutlinedIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </Stack>
    </Box>
  );
};
