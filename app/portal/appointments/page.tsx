"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Skeleton,
  Alert,
  Tabs,
  Tab,
  Button,
  Stack,
  Divider,
} from "@mui/material";
import { Calendar, MapPin, Stethoscope, Clock } from "lucide-react";

const useUpcomingAppointmentsQuery = () => {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setData([
        {
          id: "apt_1",
          date: new Date(Date.now() + 86400000), // Tomorrow
          doctor: "Dr. Meera Sharma",
          specialty: "General Physician",
          facility: "Kaero Multispeciality Clinic",
          type: "OPD Consultation",
          status: "Confirmed",
        }
      ]);
      setIsLoading(false);
    }, 700);
    return () => clearTimeout(t);
  }, []);

  return { data, isLoading };
};

const usePastAppointmentsQuery = () => {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setData([
        {
          id: "apt_2",
          date: new Date(Date.now() - 10 * 86400000), 
          doctor: "Dr. Sanjay Gupta",
          specialty: "Cardiologist",
          facility: "Kaero Multispeciality Clinic",
          type: "OPD Consultation",
          status: "Completed",
        }
      ]);
      setIsLoading(false);
    }, 900);
    return () => clearTimeout(t);
  }, []);

  return { data, isLoading };
};

export default function AppointmentsPage() {
  const [tab, setTab] = useState("upcoming");
  const { data: upcoming, isLoading: upcomingLoading } = useUpcomingAppointmentsQuery();
  const { data: past, isLoading: pastLoading } = usePastAppointmentsQuery();

  const currentData = tab === "upcoming" ? upcoming : past;
  const isLoading = tab === "upcoming" ? upcomingLoading : pastLoading;

  return (
    <Container maxWidth="xl" sx={{ px: { xs: 2, md: 3, lg: 4 }, py: { xs: 3, md: 5 } }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 4, flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography variant="h4" component="h1" fontWeight="700" color="#172B3A" gutterBottom>
            Appointments
          </Typography>
          <Typography variant="body1" color="#4E6170">
            Manage your clinic visits and consultations.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Calendar size={18} />} disabled sx={{ textTransform: "none", bgcolor: "#087F8C", fontWeight: 600 }}>
          Book Appointment
        </Button>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 4 }}>
        <Tabs 
          value={tab} 
          onChange={(e, v) => setTab(v)}
          sx={{ "& .MuiTab-root": { textTransform: "none", fontWeight: 600, fontSize: "1rem" } }}
        >
          <Tab label="Upcoming" value="upcoming" />
          <Tab label="Past" value="past" />
        </Tabs>
      </Box>

      {isLoading ? (
        <Stack spacing={3}>
          <Skeleton variant="rectangular" height={160} sx={{ borderRadius: "16px" }} />
          <Skeleton variant="rectangular" height={160} sx={{ borderRadius: "16px" }} />
        </Stack>
      ) : currentData.length === 0 ? (
        <Alert severity="info" sx={{ borderRadius: "12px", border: "1px solid #DFE6EB", bgcolor: "#EAF6F7" }}>
          No {tab} appointments found.
        </Alert>
      ) : (
        <Stack spacing={3}>
          {currentData.map(apt => (
             <Card key={apt.id} sx={{ borderRadius: "16px", border: "1px solid #DFE6EB", boxShadow: "none" }}>
               <CardContent sx={{ p: 3, pb: "24px !important" }}>
                 <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", md: "center" }} spacing={3}>
                   <Box>
                     <Typography variant="h5" fontWeight="700" color="#172B3A" gutterBottom>
                       {new Intl.DateTimeFormat("en-IN", { weekday: 'long', month: 'short', day: 'numeric' }).format(apt.date)} at {new Intl.DateTimeFormat("en-IN", { hour: 'numeric', minute: '2-digit' }).format(apt.date)}
                     </Typography>
                     <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1, color: "#4E6170" }}>
                       <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}><Stethoscope size={18} /> {apt.doctor} ({apt.specialty})</Box>
                     </Box>
                     <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "#4E6170" }}>
                       <MapPin size={18} /> {apt.facility}
                     </Box>
                   </Box>
                   <Stack direction="row" spacing={2} sx={{ width: { xs: "100%", md: "auto" } }}>
                     {tab === "upcoming" ? (
                       <>
                         <Button variant="outlined" sx={{ flex: 1, textTransform: "none", fontWeight: 600, color: "#087F8C", borderColor: "#DFE6EB" }}>Reschedule</Button>
                         <Button variant="contained" disabled sx={{ flex: 1, textTransform: "none", fontWeight: 600 }}>Get Directions</Button>
                       </>
                     ) : (
                       <Button variant="outlined" sx={{ flex: 1, textTransform: "none", fontWeight: 600, color: "#172B3A", borderColor: "#DFE6EB" }}>View Summary</Button>
                     )}
                   </Stack>
                 </Stack>
               </CardContent>
             </Card>
          ))}
        </Stack>
      )}
    </Container>
  );
}
