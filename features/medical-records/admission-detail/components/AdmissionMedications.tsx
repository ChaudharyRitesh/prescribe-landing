"use client";

import React from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
} from "@mui/material";
import { MedicationOutlinedIcon } from "@/shared/icons/patientPortalIcons";
import type { IpAdmissionRecord } from "../types/admissionRecord.types";

interface AdmissionMedicationsProps {
  medications: IpAdmissionRecord["medications"];
}

const HEADER_STYLE = {
  color: "#6B7280",
  fontWeight: 700,
  fontSize: "0.75rem",
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
  borderBottom: "1px solid #E5E7EB",
};

export const AdmissionMedications = ({ medications }: AdmissionMedicationsProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  if (!medications || medications.length === 0) return null;

  return (
    <Box sx={{ mb: 4, borderRadius: "12px", border: "1px solid #E5E7EB", bgcolor: "#FFFFFF", overflow: "hidden" }}>
      <Box sx={{ px: 3, py: 2, borderBottom: "1px solid #E5E7EB", display: "flex", alignItems: "center", gap: 1.5 }}>
        <Box sx={{ bgcolor: "#F3F4F6", color: "#4B5563", p: 1, borderRadius: "8px", display: "flex" }}>
          <MedicationOutlinedIcon sx={{ fontSize: 20 }} />
        </Box>
        <Typography variant="h6" fontWeight="700" color="#111827">
          Medications Administered During Admission
        </Typography>
      </Box>

      {!isMobile ? (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={HEADER_STYLE}>Medicine</TableCell>
                <TableCell sx={HEADER_STYLE}>Dose</TableCell>
                <TableCell sx={HEADER_STYLE}>Frequency</TableCell>
                <TableCell sx={HEADER_STYLE}>Route</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {medications.map((med) => (
                <TableRow key={med.id} hover>
                  <TableCell sx={{ color: "#111827", fontWeight: 600 }}>{med.displayName}</TableCell>
                  <TableCell sx={{ color: "#4B5563" }}>{med.dose || "—"}</TableCell>
                  <TableCell sx={{ color: "#4B5563" }}>{med.frequency || "—"}</TableCell>
                  <TableCell sx={{ color: "#4B5563" }}>{med.route || "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Box sx={{ p: 2 }}>
          {medications.map((med, idx) => (
            <Card key={med.id} sx={{ mb: idx === medications.length - 1 ? 0 : 2, borderRadius: "8px", border: "1px solid #E5E7EB", boxShadow: "none" }}>
              <CardContent sx={{ p: "16px !important" }}>
                <Typography variant="subtitle2" fontWeight="700" color="#111827" gutterBottom>
                  {med.displayName}
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 1 }}>
                  <Box>
                    <Typography variant="caption" color="#6B7280" sx={{ display: "block", mb: 0.25, fontWeight: 500 }}>DOSE</Typography>
                    <Typography variant="body2" color="#4B5563">{med.dose || "—"}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="#6B7280" sx={{ display: "block", mb: 0.25, fontWeight: 500 }}>FREQUENCY</Typography>
                    <Typography variant="body2" color="#4B5563">{med.frequency || "—"}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="#6B7280" sx={{ display: "block", mb: 0.25, fontWeight: 500 }}>ROUTE</Typography>
                    <Typography variant="body2" color="#4B5563">{med.route || "—"}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};
