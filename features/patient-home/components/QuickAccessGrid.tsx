"use client";

import React from "react";
import Link from "next/link";
import { Box, Typography, CardActionArea, Card, Skeleton } from "@mui/material";
import { FileText, Link2, BedDouble, Stethoscope, TestTube, Receipt, Clock } from "lucide-react";
import { usePatientHomeQuery } from "../hooks/usePatientHomeQueries";

export const QuickAccessGrid = () => {
  const { data, isLoading, error } = usePatientHomeQuery();

  if (error) return null;

  if (isLoading || !data) {
    return (
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" fontWeight="700" color="#111827" sx={{ mb: 2 }}>Quick Access</Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(4, 1fr)", md: "repeat(7, 1fr)" }, gap: 2 }}>
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <Skeleton key={i} variant="rectangular" height={130} sx={{ borderRadius: "12px" }} />
          ))}
        </Box>
      </Box>
    );
  }

  const QUICK_ACTIONS = [
    { label: "Records", count: data.quickAccessCounts.records, path: "/portal/records", icon: <FileText size={24} />, bg: "#EEF2FF", color: "#6366F1" },
    { label: "Prescriptions", count: data.quickAccessCounts.prescriptions, path: "/portal/medicines", icon: <Link2 size={24} />, bg: "#ECFEFF", color: "#06B6D4" },
    { label: "IPD (Inpatient)", count: data.quickAccessCounts.ipd, path: "/portal/ipd", icon: <BedDouble size={24} />, bg: "#F5F3FF", color: "#8B5CF6" },
    { label: "OPD (Outpatient)", count: data.quickAccessCounts.opd, path: "/portal/appointments", icon: <Stethoscope size={24} />, bg: "#FFF7ED", color: "#F97316" },
    { label: "Labs", count: data.quickAccessCounts.labs, path: "/portal/records?category=lab", icon: <TestTube size={24} />, bg: "#FEF2F2", color: "#EF4444" },
    { label: "Billing", count: data.quickAccessCounts.billing, path: "/portal/bills", icon: <Receipt size={24} />, bg: "#F3F4F6", color: "#4B5563" },
    { label: "Visits", count: data.quickAccessCounts.visits, path: "/portal/appointments", icon: <Clock size={24} />, bg: "#F8FAFC", color: "#64748B" },
  ];

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" fontWeight="700" color="#111827" sx={{ mb: 2 }}>Quick Access</Typography>
      <Box 
        sx={{ 
          display: "grid", 
          gridTemplateColumns: { 
            xs: "repeat(2, 1fr)", 
            sm: "repeat(4, 1fr)", 
            md: "repeat(7, 1fr)" 
          }, 
          gap: 2 
        }}
      >
        {QUICK_ACTIONS.map((action, idx) => (
          <Card 
            key={idx} 
            sx={{ 
              borderRadius: "12px", 
              border: "1px solid #E5E7EB", 
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)", 
              bgcolor: "#FFFFFF",
              transition: "transform 0.2s",
              "&:hover": {
                transform: "translateY(-2px)",
                borderColor: action.color
              }
            }}
          >
            <CardActionArea 
              component={Link} 
              href={action.path}
              sx={{ 
                height: 130, 
                display: "flex", 
                flexDirection: "column", 
                alignItems: "center", 
                justifyContent: "center",
                gap: 1.5,
                p: 2
              }}
            >
              <Box sx={{ bgcolor: action.bg, color: action.color, width: 48, height: 48, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {action.icon}
              </Box>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="body2" fontWeight="700" color="#111827" sx={{ lineHeight: 1.2 }}>
                  {action.label}
                </Typography>
                <Typography variant="caption" color="#6B7280">
                  {action.count} items found
                </Typography>
              </Box>
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </Box>
  );
};
