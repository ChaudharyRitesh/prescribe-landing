"use client";

import React from "react";
import Link from "next/link";
import { Box, Typography, Card, Skeleton, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from "@mui/material";
import { FileText, ChevronRight } from "lucide-react";
import { useRecentMedicalRecordsQuery } from "../hooks/usePatientHomeQueries";

const STATUS_CHIP_STYLES: Record<string, { bg: string; color: string; border: string }> = {
  Completed: { bg: "#F0FDF4", color: "#16A34A", border: "#BBF7D0" },
  Complete: { bg: "#F0FDF4", color: "#16A34A", border: "#BBF7D0" },
  New: { bg: "#EFF6FF", color: "#2563EB", border: "#BFDBFE" },
  Pending: { bg: "#FFFBEB", color: "#D97706", border: "#FDE68A" },
  Available: { bg: "#F0FDFA", color: "#0F766E", border: "#99F6E4" },
  Corrected: { bg: "#F5F3FF", color: "#7C3AED", border: "#DDD6FE" },
};

const getStatusLabel = (status: string) => (status === "Complete" ? "Completed" : status);

export const RecentMedicalRecords = () => {
  const { data, isLoading, error } = useRecentMedicalRecordsQuery();

  if (error) return null;

  return (
    <Card sx={{ borderRadius: "12px", border: "1px solid #E5E7EB", boxShadow: "0 1px 2px rgba(0,0,0,0.05)", height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ p: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h6" fontWeight="700" color="#111827">Recent Medical Records</Typography>
        <Button
          component={Link}
          href="/portal/records"
          variant="text"
          sx={{
            minHeight: 36,
            px: 1.5,
            textTransform: "none",
            color: "#0F766E",
            fontWeight: 700,
            borderRadius: "8px",
            "&:hover": { bgcolor: "#F0FDFA" },
          }}
        >
          View All Records
        </Button>
      </Box>
      <Box sx={{ flexGrow: 1, p: 0 }}>
        {isLoading || !data ? (
          <Box sx={{ p: 3 }}>
            <Skeleton variant="rectangular" height={200} sx={{ borderRadius: "8px" }} />
          </Box>
        ) : data.length > 0 ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: "#6B7280", fontWeight: 700, fontSize: "0.75rem", borderBottom: "1px solid #E5E7EB" }}>DATE</TableCell>
                  <TableCell sx={{ color: "#6B7280", fontWeight: 700, fontSize: "0.75rem", borderBottom: "1px solid #E5E7EB" }}>TYPE & CATEGORY</TableCell>
                  <TableCell sx={{ color: "#6B7280", fontWeight: 700, fontSize: "0.75rem", borderBottom: "1px solid #E5E7EB" }}>PROVIDER</TableCell>
                  <TableCell sx={{ color: "#6B7280", fontWeight: 700, fontSize: "0.75rem", borderBottom: "1px solid #E5E7EB" }}>STATUS</TableCell>
                  <TableCell align="right" sx={{ color: "#6B7280", fontWeight: 700, fontSize: "0.75rem", borderBottom: "1px solid #E5E7EB" }}>ACTION</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((record) => (
                  <TableRow key={record.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                    <TableCell sx={{ color: "#374151", fontWeight: 500 }}>
                      {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(record.date)},<br/>
                      {new Intl.DateTimeFormat("en-US", { year: "numeric" }).format(record.date)}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Box sx={{ bgcolor: "#F0FDFA", color: "#0F766E", p: 1, borderRadius: "8px", display: "flex" }}>
                          <FileText size={20} />
                        </Box>
                        <Box>
                          <Typography variant="body2" fontWeight="700" color="#111827">{record.title}</Typography>
                          <Typography variant="caption" color="#6B7280">{record.category}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ color: "#6B7280" }}>{record.provider}</TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusLabel(record.status)}
                        size="small"
                        sx={{
                          height: 26,
                          fontSize: "0.75rem",
                          bgcolor: STATUS_CHIP_STYLES[record.status]?.bg || "#F8FAFC",
                          color: STATUS_CHIP_STYLES[record.status]?.color || "#64748B",
                          border: `1px solid ${STATUS_CHIP_STYLES[record.status]?.border || "#E2E8F0"}`,
                          borderRadius: "6px",
                          fontWeight: 700,
                          "& .MuiChip-label": { px: 1.1 },
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Button 
                        component={Link} 
                        href={`/portal/records`}
                        variant="outlined" 
                        endIcon={<ChevronRight size={16} />} 
                        size="small"
                        sx={{
                          minHeight: 34,
                          px: 1.25,
                          textTransform: "none",
                          color: "#0F172A",
                          borderColor: "#D7DEE8",
                          bgcolor: "#FFFFFF",
                          fontWeight: 700,
                          borderRadius: "8px",
                          "&:hover": {
                            borderColor: "#99F6E4",
                            bgcolor: "#F0FDFA",
                            color: "#0F766E",
                          },
                        }}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="body1" color="#6B7280">No recent medical records available.</Typography>
          </Box>
        )}
      </Box>
    </Card>
  );
};
