"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  Grid,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
} from "@mui/material";
import {
  Search,
  Visibility,
  Share,
  Download,
  FilterList,
  LibraryBooks,
  Close,
} from "@mui/icons-material";

const brochures = [
  {
    id: 1,
    title: "Kaero OS: The Future of Hospital Management",
    category: "Software",
    lastUpdated: "Mar 2026",
    coverUrl: "/kaero_os_brochure_cover_1774376765862.png", // Paths will be absolute in final build or relative to public
    description: "Comprehensive guide to Kaero's flagship hospital operating system, covering AI modules and patient management.",
  },
  {
    id: 2,
    title: "AI Diagnostics Suite: Clinical Intelligence",
    category: "AI Tools",
    lastUpdated: "Feb 2026",
    coverUrl: "/ai_diagnostics_brochure_cover_1774376783163.png",
    description: "Detailed overview of AI-powered diagnostic tools for radiology and pathology.",
  },
  {
    id: 3,
    title: "Patient Portal Elite: Mobile Experience",
    category: "Software",
    lastUpdated: "Jan 2026",
    coverUrl: "/patient_portal_brochure_cover_1774376800325.png",
    description: "Features and benefits of the patient-facing mobile application and portal.",
  },
];

export default function DetailingPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedBrochure, setSelectedBrochure] = useState<any>(null);

  const handlePreview = (brochure: any) => {
    setSelectedBrochure(brochure);
    setPreviewOpen(true);
  };

  const handleClosePreview = () => setPreviewOpen(false);

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 4 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: "text.primary", mb: 0.5 }}>
            Digital Detailing Hub
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Access and present approved product brochures and clinical study materials.
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            size="small"
            placeholder="Search brochures..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ fontSize: 20, color: "text.secondary" }} />
                </InputAdornment>
              ),
            }}
            sx={{ width: 250 }}
          />
          <Button variant="outlined" startIcon={<FilterList />} sx={{ whiteSpace: "nowrap" }}>
            Filter
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {brochures.map((brochure) => (
          <Grid key={brochure.id} size={{ xs: 12, sm: 6, lg: 4 }}>
            <Card sx={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden", "&:hover .MuiBox-root": { transform: "scale(1.02)" } }}>
              <Box 
                sx={{ 
                  height: 200, 
                  overflow: "hidden", 
                  bgcolor: "rgba(0,0,0,0.05)",
                  transition: "transform 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box 
                  component="img" 
                  src={brochure.id === 1 ? "/kaero_os_brochure_cover_1774376765862.png" : brochure.id === 2 ? "/ai_diagnostics_brochure_cover_1774376783163.png" : "/patient_portal_brochure_cover_1774376800325.png"}
                  sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                  alt={brochure.title}
                />
              </Box>
              <Box sx={{ p: 2.5, flexGrow: 1 }}>
                <Chip 
                  label={brochure.category} 
                  size="small" 
                  sx={{ mb: 1.5, fontWeight: 700, fontSize: "10px", bgcolor: "rgba(13, 148, 136, 0.1)", color: "primary.main" }} 
                />
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, lineHeight: 1.3 }}>
                  {brochure.title}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", mb: 2, fontSize: "0.85rem" }}>
                  {brochure.description}
                </Typography>
                <Typography variant="caption" sx={{ color: "text.disabled", display: "block" }}>
                  Last updated: {brochure.lastUpdated}
                </Typography>
              </Box>
              <Divider />
              <Box sx={{ p: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Button 
                  startIcon={<Visibility />} 
                  size="small" 
                  fullWidth 
                  sx={{ color: "text.primary", fontWeight: 600 }}
                  onClick={() => handlePreview(brochure)}
                >
                  Present
                </Button>
                <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
                <Box sx={{ display: "flex" }}>
                  <IconButton size="small"><Share fontSize="small" /></IconButton>
                  <IconButton size="small"><Download fontSize="small" /></IconButton>
                </Box>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Brochure Preview Dialog */}
      <Dialog 
        open={previewOpen} 
        onClose={handleClosePreview} 
        fullScreen 
        PaperProps={{ sx: { bgcolor: "#051114" } }}
      >
        <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center", color: "white" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <LibraryBooks sx={{ color: "#0D9488" }} />
            <Typography variant="h6" fontWeight="700">{selectedBrochure?.title}</Typography>
          </Box>
          <IconButton onClick={handleClosePreview} color="inherit">
            <Close />
          </IconButton>
        </Box>
        <DialogContent sx={{ p: 0, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "rgba(255,255,255,0.05)" }}>
          <Box 
            component="img" 
            src={selectedBrochure?.id === 1 ? "/kaero_os_brochure_cover_1774376765862.png" : selectedBrochure?.id === 2 ? "/ai_diagnostics_brochure_cover_1774376783163.png" : "/patient_portal_brochure_cover_1774376800325.png"} 
            sx={{ maxWidth: "100%", maxHeight: "100%", boxShadow: "0px 10px 40px rgba(0,0,0,0.5)" }} 
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
}
