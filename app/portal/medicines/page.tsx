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
import { Pill, User, MapPin } from "lucide-react";

const useActiveMedicinesQuery = () => {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setData([
        { 
          id: "med_1", 
          name: "Paracetamol", 
          dosage: "500mg, BD (After meals)", 
          prescriber: "Dr. Meera Sharma",
          facility: "Kaero Multispeciality Clinic",
          source: "OPD Prescription - 12 Jun" 
        },
        { 
          id: "med_2", 
          name: "Pantoprazole", 
          dosage: "40mg, OD (Before breakfast)", 
          prescriber: "Dr. Meera Sharma",
          facility: "Kaero Multispeciality Clinic",
          source: "OPD Prescription - 12 Jun" 
        },
      ]);
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(t);
  }, []);

  return { data, isLoading };
};

const usePastMedicinesQuery = () => {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setData([
        { 
          id: "med_3", 
          name: "Amoxicillin", 
          dosage: "500mg, TDS (7 days)", 
          prescriber: "Dr. Sanjay Gupta",
          facility: "Kaero Multispeciality Clinic",
          source: "Discharge Summary - 14 Jan" 
        }
      ]);
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(t);
  }, []);

  return { data, isLoading };
};

export default function MedicinesPage() {
  const [tab, setTab] = useState("active");
  const { data: active, isLoading: activeLoading } = useActiveMedicinesQuery();
  const { data: past, isLoading: pastLoading } = usePastMedicinesQuery();

  const currentData = tab === "active" ? active : past;
  const isLoading = tab === "active" ? activeLoading : pastLoading;

  return (
    <Container maxWidth="xl" sx={{ px: { xs: 2, md: 3, lg: 4 }, py: { xs: 3, md: 5 } }}>
      <Typography variant="h4" component="h1" fontWeight="700" color="#172B3A" gutterBottom>
        Medicines
      </Typography>
      <Typography variant="body1" color="#4E6170" sx={{ mb: 4 }}>
        Track your current and previous medications.
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 4 }}>
        <Tabs 
          value={tab} 
          onChange={(e, v) => setTab(v)}
          sx={{ "& .MuiTab-root": { textTransform: "none", fontWeight: 600, fontSize: "1rem" } }}
        >
          <Tab label="Active" value="active" />
          <Tab label="Previous" value="past" />
        </Tabs>
      </Box>

      {isLoading ? (
        <Stack spacing={3}>
          <Skeleton variant="rectangular" height={120} sx={{ borderRadius: "16px" }} />
          <Skeleton variant="rectangular" height={120} sx={{ borderRadius: "16px" }} />
        </Stack>
      ) : currentData.length === 0 ? (
        <Alert severity="info" sx={{ borderRadius: "12px", border: "1px solid #DFE6EB", bgcolor: "#EAF6F7" }}>
          No {tab} medicines found.
        </Alert>
      ) : (
        <Card sx={{ borderRadius: "16px", border: "1px solid #DFE6EB", boxShadow: "none" }}>
          <CardContent sx={{ p: 0 }}>
            {currentData.map((med, idx) => (
              <Box key={med.id}>
                <Box sx={{ p: 3, display: "flex", flexDirection: { xs: "column", sm: "row" }, justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" }, gap: 2 }}>
                  <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
                    <Box sx={{ bgcolor: "#EAF6F7", p: 2, borderRadius: "12px", color: "#087F8C", display: { xs: "none", sm: "block" } }}>
                      <Pill size={28} />
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="700" color="#172B3A" gutterBottom>{med.name}</Typography>
                      <Typography variant="body2" color="#4E6170" gutterBottom>{med.dosage}</Typography>
                      
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "#71808C", fontSize: "0.875rem" }}>
                          <User size={14} /> {med.prescriber}
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "#71808C", fontSize: "0.875rem" }}>
                          <MapPin size={14} /> {med.facility}
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                  <Button variant="outlined" size="small" sx={{ textTransform: "none", color: "#087F8C", borderColor: "#DFE6EB", fontWeight: 600 }}>
                    View Prescription
                  </Button>
                </Box>
                {idx < currentData.length - 1 && <Divider sx={{ borderColor: "#DFE6EB" }} />}
              </Box>
            ))}
          </CardContent>
        </Card>
      )}
    </Container>
  );
}
