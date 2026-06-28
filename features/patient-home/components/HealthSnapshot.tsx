"use client";

import React from "react";
import { Box, Typography, Card, CardContent, Skeleton } from "@mui/material";
import { Link2, FileText, Calendar, Clock } from "lucide-react";
import { usePatientHomeQuery } from "../hooks/usePatientHomeQueries";

export const HealthSnapshot = () => {
  const { data, isLoading, error } = usePatientHomeQuery();

  if (error) return null;

  if (isLoading || !data) {
    return (
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }, gap: 3, mb: 4 }}>
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} variant="rectangular" height={100} sx={{ borderRadius: "12px" }} />
        ))}
      </Box>
    );
  }

  const { activePrescriptions, pendingInvoices, nextAppointmentDate, totalVisits } = data.healthSnapshot;

  const KpiCard = ({ title, value, icon, iconBg, iconColor }: any) => (
    <Card sx={{ borderRadius: "12px", border: "1px solid #E5E7EB", boxShadow: "0 1px 2px rgba(0,0,0,0.05)", bgcolor: "#FFFFFF" }}>
      <CardContent sx={{ p: "20px !important", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          <Typography variant="body2" color="#6B7280" fontWeight="500" sx={{ mb: 1, lineHeight: 1.2 }}>
            {title.split(" ")[0]}<br/>{title.split(" ").slice(1).join(" ")}
          </Typography>
          <Typography variant="h5" fontWeight="700" color="#111827">
            {value}
          </Typography>
        </Box>
        <Box sx={{ bgcolor: iconBg, color: iconColor, width: 40, height: 40, borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {icon}
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }, gap: 3, mb: 4 }}>
      <KpiCard 
        title="Active Prescriptions" 
        value={activePrescriptions.toString().padStart(2, "0")} 
        icon={<Link2 size={20} />} 
        iconBg="#ECFEFF" 
        iconColor="#06B6D4" 
      />
      <KpiCard 
        title="Pending Invoices" 
        value={`$${pendingInvoices.toLocaleString()}`} 
        icon={<FileText size={20} />} 
        iconBg="#FEF2F2" 
        iconColor="#EF4444" 
      />
      <KpiCard 
        title="Next Appointment" 
        value={new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(nextAppointmentDate)} 
        icon={<Calendar size={20} />} 
        iconBg="#F3F4F6" 
        iconColor="#6366F1" 
      />
      <KpiCard 
        title="Total Visits" 
        value={totalVisits.toString()} 
        icon={<Clock size={20} />} 
        iconBg="#F5F3FF" 
        iconColor="#8B5CF6" 
      />
    </Box>
  );
};
