"use client";

import React from "react";
import { Box, Typography, Skeleton, Button, Stack } from "@mui/material";
import { usePatientHomeQuery } from "../hooks/usePatientHomeQueries";
import { Download, Plus } from "lucide-react";

export const GreetingSection = () => {
  const { data, isLoading, error } = usePatientHomeQuery();

  if (error) return null;

  if (isLoading || !data) {
    return (
      <Box sx={{ mb: 4 }}>
        <Skeleton variant="text" width={300} height={48} sx={{ mb: 1 }} />
        <Skeleton variant="text" width={400} height={24} />
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 4, display: "flex", flexDirection: { xs: "column", md: "row" }, justifyContent: "space-between", alignItems: { xs: "flex-start", md: "center" }, gap: 2 }}>
      <Box>
        <Typography variant="h4" component="h1" fontWeight="800" color="#111827" gutterBottom>
          Health Dashboard
        </Typography>
        <Typography variant="body1" color="#6B7280">
          Welcome back, {data.patient.firstName}. Here is an overview of your medical journey.
        </Typography>
      </Box>
      <Stack direction="row" spacing={2}>
        <Button 
          variant="outlined" 
          startIcon={<Download size={18} />} 
          sx={{ 
            textTransform: "none", 
            color: "#374151", 
            borderColor: "#D1D5DB", 
            fontWeight: 500,
            borderRadius: "8px",
            px: 2,
            "&:hover": { borderColor: "#9CA3AF", bgcolor: "#F9FAFB" }
          }}
        >
          Request Downloads
        </Button>
        <Button 
          variant="contained" 
          startIcon={<Plus size={18} />} 
          sx={{ 
            textTransform: "none", 
            bgcolor: "#6366F1", 
            fontWeight: 500,
            borderRadius: "8px",
            boxShadow: "none",
            px: 2,
            "&:hover": { bgcolor: "#4F46E5", boxShadow: "none" }
          }}
        >
          New Visit
        </Button>
      </Stack>
    </Box>
  );
};
