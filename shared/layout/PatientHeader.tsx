"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  InputBase,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import { Search, Bell, Menu as MenuIcon, HelpCircle, X } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";

interface PatientHeaderProps {
  onMenuClick: () => void;
  pageTitle?: string;
}

export const PatientHeader = ({ onMenuClick, pageTitle = "Health Home" }: PatientHeaderProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleProfileMenuClose = () => setAnchorEl(null);

  return (
    <Box
      sx={{
        height: { xs: 68, md: 72 },
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: { xs: 2, md: 4 },
        bgcolor: "#FFFFFF",
        borderBottom: "1px solid #DFE6EB",
        position: "sticky",
        top: 0,
        zIndex: 1100,
      }}
    >
      {/* Mobile Menu & Title */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <IconButton sx={{ display: { xs: "flex", md: "none" } }} onClick={onMenuClick}>
          <MenuIcon size={24} color="#172B3A" />
        </IconButton>
        <Typography variant="h6" fontWeight="700" color="#172B3A" sx={{ display: { xs: "none", sm: "block" } }}>
          {pageTitle}
        </Typography>
        <Box sx={{ display: { xs: "block", sm: "none" } }}>
          <BrandLogo mark={28} />
        </Box>
      </Box>

      {/* Center: Global Search */}
      <Box sx={{ flex: 1, maxWidth: 600, mx: { xs: 1, md: 4 }, display: { xs: "none", md: "block" } }}>
        <Box sx={{ display: "flex", alignItems: "center", bgcolor: "#F5F7FA", borderRadius: "12px", px: 2, py: 1, border: "1px solid #DFE6EB" }}>
          <Search size={20} color="#71808C" />
          <InputBase
            placeholder="Search records, reports, prescriptions or bills"
            sx={{ ml: 2, flex: 1, fontSize: "0.95rem" }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled
          />
          {searchQuery && (
            <IconButton size="small" onClick={() => setSearchQuery("")} sx={{ p: 0.5 }}>
              <X size={16} />
            </IconButton>
          )}
        </Box>
      </Box>

      {/* Right Actions */}
      <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, md: 2 } }}>
        <IconButton sx={{ display: { xs: "flex", md: "none" } }} disabled>
          <Search size={24} color="#71808C" />
        </IconButton>
        <Tooltip title="Help">
          <IconButton disabled>
            <HelpCircle size={24} color="#71808C" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Notifications">
          <IconButton disabled>
            <Bell size={24} color="#71808C" />
          </IconButton>
        </Tooltip>
        <IconButton onClick={handleProfileMenuOpen} sx={{ p: 0.5, ml: 1 }}>
          <Avatar sx={{ width: 36, height: 36, bgcolor: "#087F8C", fontSize: "1rem", fontWeight: 600 }}>A</Avatar>
        </IconButton>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        PaperProps={{ sx: { mt: 1.5, width: 200, borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" } }}
      >
        <MenuItem onClick={handleProfileMenuClose}>My Profile</MenuItem>
        <MenuItem onClick={handleProfileMenuClose}>Settings</MenuItem>
        <MenuItem onClick={handleProfileMenuClose} sx={{ color: "#B84248" }}>Sign Out</MenuItem>
      </Menu>
    </Box>
  );
};
