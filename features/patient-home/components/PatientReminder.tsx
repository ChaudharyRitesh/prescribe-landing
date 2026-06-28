"use client";

import React from "react";
import { Box, Typography, Card, CardContent, Button } from "@mui/material";
import { AlertCircle } from "lucide-react";

export const PatientReminder = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Card sx={{ borderRadius: "12px", border: "none", boxShadow: "none", bgcolor: "#F5F3FF" }}>
        <CardContent sx={{ p: 3, pb: "24px !important" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
            <Box sx={{ bgcolor: "#EDE9FE", color: "#6366F1", p: 1, borderRadius: "50%", display: "flex" }}>
              <AlertCircle size={20} />
            </Box>
            <Typography variant="subtitle1" fontWeight="700" color="#4F46E5">
              Annual Checkup Reminder
            </Typography>
          </Box>
          <Typography variant="body2" color="#4B5563" sx={{ mb: 2, lineHeight: 1.6 }}>
            Your annual comprehensive health screening is due in 15 days. Regular checkups help in early detection and prevention.
          </Typography>
          <Button variant="text" sx={{ textTransform: "none", fontWeight: 600, color: "#4F46E5", p: 0, "&:hover": { bgcolor: "transparent", textDecoration: "underline" } }}>
            Book Screening Now
          </Button>
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: "12px", border: "1px solid #E5E7EB", boxShadow: "0 1px 2px rgba(0,0,0,0.05)", bgcolor: "#FFFFFF" }}>
        <CardContent sx={{ p: 3, pb: "24px !important", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box>
            <Typography variant="subtitle2" fontWeight="700" color="#111827">
              Need assistance?
            </Typography>
            <Typography variant="body2" color="#6B7280" sx={{ mt: 0.5 }}>
              Chat with our 24/7 care team.
            </Typography>
          </Box>
          <Button variant="outlined" sx={{ textTransform: "none", color: "#374151", borderColor: "#D1D5DB", fontWeight: 500, borderRadius: "8px" }}>
            Get Help
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};
