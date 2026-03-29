"use client";

import { useState } from "react";
import { Box, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import Sidebar from "@/components/partner/dashboard/Sidebar";
import TopBar from "@/components/partner/dashboard/TopBar";
import { DashboardProvider } from "./context/DashboardContext";
import NewPitchModal from "@/components/partner/dashboard/NewPitchModal";
import { Toaster } from "sonner";

// Create a custom theme for the dashboard that matches the landing page aesthetics
const mrDashboardTheme = createTheme({
  palette: {
    primary: {
      main: "#0D9488",
      light: "#14B8A6",
      dark: "#0F766E",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#051114",
    },
    background: {
      default: "#F9FAFB",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#111827",
      secondary: "#6B7280",
    },
  },
  typography: {
    fontFamily: '"DM Sans", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h6: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 700,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "8px",
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.03)",
          border: "1px solid rgba(0,0,0,0.05)",
        },
      },
    },
  },
});

export default function MRDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <ThemeProvider theme={mrDashboardTheme}>
      <DashboardProvider>
        <Box sx={{ display: "flex", minHeight: "100vh" }}>
          <CssBaseline />
          <Sidebar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
          
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              width: { sm: `calc(100% - 280px)` },
              display: "flex",
              flexDirection: "column",
              bgcolor: "background.default",
            }}
          >
            <TopBar handleDrawerToggle={handleDrawerToggle} />
            
            <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, flexGrow: 1, display: "flex", flexDirection: "column" }}>
              {children}
            </Box>
          </Box>
        </Box>
        <NewPitchModal />
        <Toaster richColors position="top-right" />
      </DashboardProvider>
    </ThemeProvider>
  );
}
