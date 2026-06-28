"use client";

import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { PatientSidebar } from "@/shared/layout/PatientSidebar";
import { MobilePatientDrawer } from "@/shared/layout/MobilePatientDrawer";
import { PatientHeader } from "@/shared/layout/PatientHeader";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const sidebarWidth = desktopCollapsed ? 76 : 248;

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#F5F7FA" }}>
      {/* Desktop Sidebar (Fixed) */}
      <PatientSidebar collapsed={desktopCollapsed} onToggle={() => setDesktopCollapsed(!desktopCollapsed)} />

      {/* Mobile Drawer (Temporary) */}
      <MobilePatientDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} />

      {/* Main Content Area */}
      <Box 
        sx={{ 
          flexGrow: 1, 
          display: "flex", 
          flexDirection: "column",
          width: { xs: "100%", md: `calc(100% - ${sidebarWidth}px)` },
          ml: { xs: 0, md: `${sidebarWidth}px` },
          transition: "margin-left 0.2s ease-in-out, width 0.2s ease-in-out",
        }}
      >
        <PatientHeader onMenuClick={() => setMobileOpen(true)} />
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1, 
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Box sx={{ width: "100%", maxWidth: 1440 }}>
            {children}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
