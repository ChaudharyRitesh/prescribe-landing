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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  Stack,
  Divider,
} from "@mui/material";
import { FileText, Filter, Download, ArrowRight } from "lucide-react";

// --- MOCK HOOK ---
const usePatientRecordsQuery = (category: string, facility: string) => {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    const t = setTimeout(() => {
      if (facility === "error") {
        setError("Failed to fetch records. Please try again.");
        setIsLoading(false);
        return;
      }

      let allRecords = [
        { id: "rec_1", type: "Laboratory Report", date: new Date(Date.now() - 4 * 86400000), facility: "Thyrocare Labs", category: "lab", source: "ABDM" },
        { id: "rec_2", type: "Discharge Summary", date: new Date(Date.now() - 30 * 86400000), facility: "Kaero Multispeciality Clinic", category: "clinical", source: "KaeroPrescribe" },
        { id: "rec_3", type: "OPD Prescription", date: new Date(Date.now() - 60 * 86400000), facility: "Kaero Multispeciality Clinic", category: "prescription", source: "KaeroPrescribe" },
      ];

      if (category !== "all") {
        allRecords = allRecords.filter(r => r.category === category);
      }
      if (facility !== "all") {
        allRecords = allRecords.filter(r => r.facility === facility);
      }
      
      setData(allRecords);
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(t);
  }, [category, facility]);

  return { data, isLoading, error };
};

export default function RecordsPage() {
  const [category, setCategory] = useState("all");
  const [facility, setFacility] = useState("all");
  const { data, isLoading, error } = usePatientRecordsQuery(category, facility);

  return (
    <Container maxWidth="xl" sx={{ px: { xs: 2, md: 3, lg: 4 }, py: { xs: 3, md: 5 } }}>
      <Typography variant="h4" component="h1" fontWeight="700" color="#172B3A" gutterBottom>
        Health Records
      </Typography>
      <Typography variant="body1" color="#4E6170" sx={{ mb: 4 }}>
        View and manage your medical documents and reports.
      </Typography>

      {/* Filters */}
      <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 3, mb: 4, alignItems: { md: "center" } }}>
        <Tabs 
          value={category} 
          onChange={(e, v) => setCategory(v)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: "divider", flex: 1, minHeight: 48, "& .MuiTab-root": { textTransform: "none", fontWeight: 600, fontSize: "0.95rem" } }}
        >
          <Tab label="All Records" value="all" />
          <Tab label="Clinical Notes" value="clinical" />
          <Tab label="Lab Reports" value="lab" />
          <Tab label="Prescriptions" value="prescription" />
        </Tabs>

        <FormControl size="small" sx={{ minWidth: 200, bgcolor: "#FFFFFF" }}>
          <InputLabel id="facility-filter-label">Facility</InputLabel>
          <Select
            labelId="facility-filter-label"
            value={facility}
            label="Facility"
            onChange={(e) => setFacility(e.target.value)}
          >
            <MenuItem value="all">All Facilities</MenuItem>
            <MenuItem value="Kaero Multispeciality Clinic">Kaero Multispeciality</MenuItem>
            <MenuItem value="Thyrocare Labs">Thyrocare Labs</MenuItem>
            <MenuItem value="error">Trigger Error State</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Content */}
      {isLoading ? (
        <Stack spacing={2}>
          <Skeleton variant="rectangular" height={100} sx={{ borderRadius: "16px" }} />
          <Skeleton variant="rectangular" height={100} sx={{ borderRadius: "16px" }} />
          <Skeleton variant="rectangular" height={100} sx={{ borderRadius: "16px" }} />
        </Stack>
      ) : error ? (
        <Alert severity="error" sx={{ borderRadius: "12px", border: "1px solid #B84248" }}>{error}</Alert>
      ) : data.length === 0 ? (
        <Card sx={{ borderRadius: "16px", border: "1px dashed #DFE6EB", boxShadow: "none", bgcolor: "transparent", textAlign: "center", py: 8 }}>
          <Box sx={{ color: "#71808C", mb: 2 }}><Filter size={48} style={{ margin: "0 auto" }} /></Box>
          <Typography variant="h6" color="#172B3A" fontWeight="600">No records found</Typography>
          <Typography variant="body2" color="#4E6170">Try adjusting your filters to see more results.</Typography>
        </Card>
      ) : (
        <Card sx={{ borderRadius: "16px", border: "1px solid #DFE6EB", boxShadow: "none" }}>
          {data.map((record, idx) => (
            <Box key={record.id}>
              <Box sx={{ p: 3, display: "flex", flexDirection: { xs: "column", sm: "row" }, justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" }, gap: 2 }}>
                <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
                  <Box sx={{ bgcolor: "#EAF6F7", p: 1.5, borderRadius: "10px", color: "#087F8C", display: { xs: "none", sm: "block" } }}>
                    <FileText size={24} />
                  </Box>
                  <Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                      <Typography variant="subtitle1" fontWeight="700" color="#172B3A">{record.type}</Typography>
                      {record.source === "ABDM" && <Chip label="ABDM Record" size="small" sx={{ height: 20, fontSize: "0.65rem", bgcolor: "#EFF6FF", color: "#1D4ED8", fontWeight: 600 }} />}
                    </Box>
                    <Typography variant="body2" color="#4E6170">{record.facility}</Typography>
                    <Typography variant="caption" color="#71808C" sx={{ mt: 0.5, display: "block" }}>
                      {new Intl.DateTimeFormat("en-IN", { dateStyle: "long" }).format(record.date)}
                    </Typography>
                  </Box>
                </Box>
                <Stack direction="row" spacing={1}>
                   <Button variant="outlined" size="small" startIcon={<Download size={16} />} sx={{ textTransform: "none", color: "#087F8C", borderColor: "#DFE6EB", fontWeight: 600 }}>Download</Button>
                   <Button variant="contained" size="small" endIcon={<ArrowRight size={16} />} sx={{ textTransform: "none", bgcolor: "#087F8C", fontWeight: 600, boxShadow: "none" }}>View</Button>
                </Stack>
              </Box>
              {idx < data.length - 1 && <Divider sx={{ borderColor: "#DFE6EB" }} />}
            </Box>
          ))}
        </Card>
      )}
    </Container>
  );
}
