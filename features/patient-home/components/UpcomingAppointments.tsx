"use client";

import React from "react";
import { Box, Typography, Card, CardContent, Skeleton, Button } from "@mui/material";
import { Calendar as CalendarIcon, ArrowRight, Clock } from "lucide-react";
import { useUpcomingAppointmentsQuery } from "../hooks/usePatientHomeQueries";

export const UpcomingAppointments = () => {
  const { data, isLoading, error } = useUpcomingAppointmentsQuery();

  if (error) return null;

  return (
    <Card sx={{ borderRadius: "12px", border: "1px solid #E5E7EB", boxShadow: "0 1px 2px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", mb: 3 }}>
      <Box sx={{ p: 3, pb: 1, bgcolor: "#FFFFFF" }}>
        <Typography variant="h6" fontWeight="700" color="#111827">Upcoming Appointments</Typography>
      </Box>
      <CardContent sx={{ p: 3, pt: 2, flexGrow: 1, bgcolor: "#FFFFFF" }}>
        {isLoading || !data ? (
          <Box>
            <Skeleton variant="rectangular" height={80} sx={{ mb: 2, borderRadius: "8px" }} />
            <Skeleton variant="rectangular" height={80} sx={{ mb: 2, borderRadius: "8px" }} />
          </Box>
        ) : data.length > 0 ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {data.slice(0, 2).map((apt) => (
              <Box key={apt.id} sx={{ display: "flex", alignItems: "center", gap: 2, p: 2, border: "1px solid #E5E7EB", borderRadius: "8px" }}>
                <Box sx={{ bgcolor: "#EEF2FF", p: 1.5, borderRadius: "8px", minWidth: 64, textAlign: "center", color: "#6366F1" }}>
                  <Typography variant="caption" fontWeight="700" sx={{ display: "block", textTransform: "uppercase" }}>
                    {new Intl.DateTimeFormat("en-US", { month: "short" }).format(apt.date)}
                  </Typography>
                  <Typography variant="h6" fontWeight="800" sx={{ lineHeight: 1 }}>
                    {new Intl.DateTimeFormat("en-US", { day: "numeric" }).format(apt.date)}
                  </Typography>
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body1" fontWeight="700" color="#111827">
                    {apt.practitioner}
                  </Typography>
                  <Typography variant="body2" color="#6B7280" gutterBottom>
                    {apt.specialty}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "#6B7280" }}>
                    <Clock size={14} />
                    <Typography variant="caption">
                      {new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(apt.date)}
                    </Typography>
                  </Box>
                </Box>
                <ArrowRight size={20} color="#9CA3AF" />
              </Box>
            ))}
            <Button 
              variant="contained" 
              fullWidth
              startIcon={<CalendarIcon size={18} />} 
              sx={{ 
                mt: 1,
                textTransform: "none", 
                bgcolor: "#6366F1", 
                fontWeight: 600,
                borderRadius: "8px",
                boxShadow: "none",
                py: 1.2,
                "&:hover": { bgcolor: "#4F46E5", boxShadow: "none" }
              }}
            >
              Schedule New Visit
            </Button>
          </Box>
        ) : (
          <Box sx={{ textAlign: "center", py: 4, px: 2 }}>
            <Typography variant="body2" color="#6B7280" gutterBottom>You have no upcoming appointments.</Typography>
            <Button variant="contained" startIcon={<CalendarIcon size={18} />} sx={{ mt: 1, textTransform: "none", fontWeight: 600 }}>
              Schedule New Visit
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
