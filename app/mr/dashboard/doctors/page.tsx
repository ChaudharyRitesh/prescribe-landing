"use client";

import {
  Box,
  Typography,
  Card,
  Grid,
  TextField,
  InputAdornment,
  Chip,
  Avatar,
  IconButton,
  Button,
  Menu,
  MenuItem,
  Tooltip,
  Divider,
} from "@mui/material";
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  MoreVert as MoreVertIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Assignment as NoteIcon,
  Star as StarIcon,
  History as HistoryIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { useState } from "react";

// Mock data for HCPs
const mockDoctors = [
  {
    id: 1,
    name: "Dr. Sarah Chen",
    specialty: "Cardiology",
    hospital: "City General Hospital",
    lastVisit: "2026-03-20",
    priority: "High",
    email: "s.chen@citygeneral.com",
    phone: "+91 98765 43210",
    tags: ["Decision Maker", "AI Advocate"],
    notes: "Interested in the new AI diagnostics suite. Prefers morning visits.",
  },
  {
    id: 2,
    name: "Dr. James Wilson",
    specialty: "Oncology",
    hospital: "Metro Cancer Center",
    lastVisit: "2026-03-24",
    priority: "Medium",
    email: "j.wilson@metro.org",
    phone: "+91 98765 43211",
    tags: ["Researcher"],
    notes: "Wants to see clinical trial results for KOS-DK-01.",
  },
  {
    id: 3,
    name: "Dr. Priya Sharma",
    specialty: "Pediatrics",
    hospital: "Sunshine Children's Clinic",
    lastVisit: "2026-03-15",
    priority: "Low",
    email: "p.sharma@sunshine.in",
    phone: "+91 98765 43212",
    tags: ["Fast Follower"],
    notes: "Requested patient portal vouchers for parents.",
  },
  {
    id: 4,
    name: "Dr. Robert Taylor",
    specialty: "Radiology",
    hospital: "City General Hospital",
    lastVisit: "2026-03-22",
    priority: "High",
    email: "r.taylor@citygeneral.com",
    phone: "+91 98765 43213",
    tags: ["Influencer"],
    notes: "Head of Dept. Key person for the AI Diagnostics pilot.",
  },
];

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "High": return "#0D9488";
    case "Medium": return "#0284C7";
    default: return "#64748B";
  }
};

export default function DoctorsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const filteredDoctors = mockDoctors.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.hospital.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ width: "100%", pb: 6 }}>
      {/* Header section */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: "#051114", mb: 0.5 }}>
            Healthcare Professionals (HCPs)
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748B" }}>
            Manage and track individual relationships across your assigned hospitals.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            bgcolor: "#0D9488",
            "&:hover": { bgcolor: "#0f766e" },
            textTransform: "none",
            borderRadius: "8px",
            px: 3,
          }}
        >
          Add HCP
        </Button>
      </Box>

      {/* Stats and Dashboard summary (Mini) */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {[
          { label: "Total HCPs", value: "48", color: "#0D9488" },
          { label: "High Priority", value: "12", color: "#0D9488" },
          { label: "Visits This week", value: "8", color: "#0D9488" },
          { label: "Avg. Engagement", value: "84%", color: "#0D9488" },
        ].map((stat, i) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
            <Card sx={{ p: 2, borderRadius: "12px", border: "1px solid #E2E8F0", boxShadow: "none" }}>
              <Typography variant="overline" sx={{ color: "#64748B", fontWeight: 600 }}>{stat.label}</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: stat.color }}>{stat.value}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Search and filter bar */}
      <Card sx={{ p: 2, mb: 3, borderRadius: "12px", border: "1px solid #E2E8F0", boxShadow: "none", display: "flex", gap: 2, alignItems: "center" }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search by name, specialty, or hospital..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#94A3B8" }} />
              </InputAdornment>
            ),
            sx: { borderRadius: "8px", bgcolor: "#F8FAFC" }
          }}
        />
        <Button
          variant="outlined"
          startIcon={<FilterIcon />}
          sx={{ color: "#64748B", borderColor: "#E2E8F0", textTransform: "none", borderRadius: "8px", minWidth: "120px" }}
        >
          Filters
        </Button>
      </Card>

      {/* HCP List */}
      <Grid container spacing={3}>
        {filteredDoctors.map((doc) => (
          <Grid size={{ xs: 12, md: 6 }} key={doc.id}>
            <Card sx={{ 
              p: 2.5, 
              borderRadius: "12px", 
              border: "1px solid #E2E8F0", 
              boxShadow: "none",
              transition: "transform 0.2s ease, border-color 0.2s ease",
              "&:hover": { borderColor: "#0D9488", transform: "translateY(-2px)" }
            }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Avatar sx={{ bgcolor: "rgba(13, 148, 136, 0.1)", color: "#0D9488", fontWeight: 700 }}>
                    {doc.name.split(" ").map(n => n[0]).join("")}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#051114", lineHeight: 1.2 }}>
                      {doc.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#64748B", display: "block" }}>
                      {doc.specialty} • {doc.hospital}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Chip 
                    label={doc.priority} 
                    size="small" 
                    sx={{ 
                      bgcolor: "rgba(13, 148, 136, 0.05)", 
                      color: getPriorityColor(doc.priority), 
                      fontWeight: 600,
                      borderRadius: "6px",
                      fontSize: "0.7rem",
                    }} 
                  />
                  <IconButton size="small" onClick={handleMenuOpen}>
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>

              <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <HistoryIcon sx={{ fontSize: "1rem", color: "#64748B" }} />
                  <Typography variant="caption" sx={{ color: "#64748B" }}>
                    Last Visit: {doc.lastVisit}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <StarIcon sx={{ fontSize: "1rem", color: "#F59E0B" }} />
                  <Typography variant="caption" sx={{ color: "#64748B" }}>
                    Key Account
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ bgcolor: "#F8FAFC", p: 1.5, borderRadius: "8px", mb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                  <NoteIcon sx={{ fontSize: "0.9rem", color: "#0D9488" }} />
                  <Typography variant="caption" sx={{ fontWeight: 600, color: "#051114" }}>Latest Insights</Typography>
                </Box>
                <Typography variant="body2" sx={{ color: "#475569", fontSize: "0.85rem" }}>
                  "{doc.notes}"
                </Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box sx={{ display: "flex", gap: 1 }}>
                  {doc.tags.map(tag => (
                    <Chip key={tag} label={tag} size="small" variant="outlined" sx={{ borderRadius: "4px", fontSize: "0.65rem", height: "20px" }} />
                  ))}
                </Box>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Tooltip title="Call">
                    <IconButton size="small" sx={{ color: "#64748B", border: "1px solid #E2E8F0" }}>
                      <PhoneIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Email">
                    <IconButton size="small" sx={{ color: "#64748B", border: "1px solid #E2E8F0" }}>
                      <EmailIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Button
                    size="small"
                    variant="contained"
                    sx={{
                      bgcolor: "white",
                      color: "#0D9488",
                      border: "1px solid #0D9488",
                      boxShadow: "none",
                      "&:hover": { bgcolor: "rgba(13, 148, 136, 0.05)", boxShadow: "none" },
                      textTransform: "none",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                    }}
                  >
                    View History
                  </Button>
                </Box>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleMenuClose} sx={{ fontSize: "0.85rem" }}>Edit Profile</MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ fontSize: "0.85rem" }}>Add Private Note</MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ fontSize: "0.85rem" }}>Schedule Follow-up</MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuClose} sx={{ fontSize: "0.85rem", color: "#EF4444" }}>Archive HCP</MenuItem>
      </Menu>
    </Box>
  );
}
