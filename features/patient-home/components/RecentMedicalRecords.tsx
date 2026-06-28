"use client";

import React from "react";
import Link from "next/link";
import { Box, Typography, Card, Skeleton, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from "@mui/material";
import { FileText, ChevronRight } from "lucide-react";
import { useRecentMedicalRecordsQuery } from "../hooks/usePatientHomeQueries";

export const RecentMedicalRecords = () => {
  const { data, isLoading, error } = useRecentMedicalRecordsQuery();

  if (error) return null;

  return (
    <Card sx={{ borderRadius: "12px", border: "1px solid #E5E7EB", boxShadow: "0 1px 2px rgba(0,0,0,0.05)", height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ p: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h6" fontWeight="700" color="#111827">Recent Medical Records</Typography>
        <Button variant="text" sx={{ textTransform: "none", color: "#6366F1", fontWeight: 600 }}>
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
                        <Box sx={{ bgcolor: "#EEF2FF", color: "#6366F1", p: 1, borderRadius: "8px", display: "flex" }}>
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
                      {record.status === "Complete" && <Chip label="Complete" size="small" sx={{ height: 24, fontSize: "0.75rem", bgcolor: "#ECFEFF", color: "#06B6D4", fontWeight: 600 }} />}
                      {record.status === "New" && <Chip label="New" size="small" sx={{ height: 24, fontSize: "0.75rem", bgcolor: "#EEF2FF", color: "#6366F1", fontWeight: 600 }} />}
                    </TableCell>
                    <TableCell align="right">
                      <Button 
                        component={Link} 
                        href={`/portal/records`}
                        variant="text" 
                        endIcon={<ChevronRight size={16} />} 
                        sx={{ textTransform: "none", color: "#6366F1", fontWeight: 500 }}
                      >
                        View Detail
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
