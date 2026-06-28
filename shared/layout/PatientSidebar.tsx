"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  IconButton,
  Divider,
} from "@mui/material";
import {
  Home,
  FileText,
  Calendar,
  Pill,
  TestTube,
  CreditCard,
  Shield,
  User,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  FileDown
} from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";

const PRIMARY_NAV = [
  { label: "Health Home", path: "/portal/home", icon: <Home size={20} />, enabled: true },
  { label: "Medical Records", path: "/portal/records", icon: <FileText size={20} />, enabled: true },
  { label: "Appointments", path: "/portal/appointments", icon: <Calendar size={20} />, enabled: true },
  { label: "Prescriptions", path: "/portal/medicines", icon: <Pill size={20} />, enabled: true },
  { label: "Lab Reports", path: "/portal/reports", icon: <TestTube size={20} />, enabled: false, reason: "Available in a later phase" },
  { label: "Bills & Payments", path: "/portal/bills", icon: <CreditCard size={20} />, enabled: true },
  { label: "ABHA & Consents", path: "/portal/abha", icon: <ShieldCheck size={20} />, enabled: false, reason: "Available in a later phase" },
  { label: "Profile", path: "/portal/profile", icon: <User size={20} />, enabled: true },
];

const SECONDARY_NAV = [
  { label: "Help & Support", path: "/portal/support", icon: <HelpCircle size={20} />, enabled: false, reason: "Available in a later phase" },
  { label: "Privacy", path: "/portal/privacy", icon: <Shield size={20} />, enabled: false, reason: "Available in a later phase" },
];

interface PatientSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export const PatientSidebar = ({ collapsed, onToggle }: PatientSidebarProps) => {
  const pathname = usePathname();

  const sidebarWidth = collapsed ? 76 : 248;

  const NavItem = ({ item }: { item: any }) => {
    const isActive = pathname === item.path && item.enabled;
    const isHovered = false; // Add hover state logic if complex, else CSS handles it.

    const content = (
      <ListItem disablePadding sx={{ mb: 0.5 }}>
        <ListItemButton
          component={item.enabled ? Link : "div"}
          href={item.enabled ? item.path : undefined}
          disabled={!item.enabled}
          sx={{
            minHeight: 48,
            px: collapsed ? 0 : 2.5,
            justifyContent: collapsed ? "center" : "flex-start",
            borderRadius: "8px",
            mx: 1.5,
            bgcolor: isActive ? "#E8F5F6" : "transparent",
            color: isActive ? "#087F8C" : "#BCC8D0",
            "&:hover": {
              bgcolor: isActive ? "#E8F5F6" : "rgba(255,255,255,0.05)",
            },
            transition: "all 0.2s ease-in-out",
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: collapsed ? 0 : 2,
              justifyContent: "center",
              color: isActive ? "#087F8C" : "#BCC8D0",
            }}
          >
            {item.icon}
          </ListItemIcon>
          {!collapsed && (
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{
                fontSize: "0.95rem",
                fontWeight: isActive ? 600 : 500,
              }}
            />
          )}
        </ListItemButton>
      </ListItem>
    );

    return collapsed || !item.enabled ? (
      <Tooltip title={!item.enabled ? `${item.label} (${item.reason})` : item.label} placement="right" arrow>
        {content}
      </Tooltip>
    ) : (
      content
    );
  };

  return (
    <Box
      sx={{
        width: sidebarWidth,
        flexShrink: 0,
        bgcolor: "#132532",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        display: { xs: "none", md: "flex" },
        flexDirection: "column",
        transition: "width 0.2s ease-in-out",
        borderRight: "1px solid #29404F",
        zIndex: 1200,
      }}
    >
      {/* Brand / Logo Area */}
      <Box sx={{ height: 72, display: "flex", alignItems: "center", px: collapsed ? 0 : 3, justifyContent: collapsed ? "center" : "space-between", borderBottom: "1px solid #29404F" }}>
        {!collapsed && <BrandLogo mark={32} />}
        {collapsed && <Box sx={{ width: 32, height: 32, bgcolor: "#087F8C", borderRadius: 1 }} />} {/* Fallback mark if needed */}
      </Box>

      {/* Main Navigation */}
      <Box sx={{ flexGrow: 1, overflowY: "auto", py: 3, "&::-webkit-scrollbar": { width: 4 }, "&::-webkit-scrollbar-thumb": { bgcolor: "#29404F", borderRadius: 4 } }}>
        <List sx={{ py: 0 }}>
          {PRIMARY_NAV.map((item, idx) => (
            <NavItem key={idx} item={item} />
          ))}
        </List>
      </Box>

      {/* Action Area */}
      <Box sx={{ p: collapsed ? 1 : 2, borderTop: "1px solid #29404F", borderBottom: "1px solid #29404F" }}>
        <Tooltip title="Download Health Records" placement="right" arrow={collapsed}>
          <ListItemButton
            sx={{
              justifyContent: collapsed ? "center" : "flex-start",
              bgcolor: "rgba(8, 127, 140, 0.1)",
              borderRadius: "8px",
              px: collapsed ? 0 : 2,
              py: 1.5,
              color: "#087F8C",
              "&:hover": { bgcolor: "rgba(8, 127, 140, 0.2)" },
            }}
          >
            <ListItemIcon sx={{ minWidth: 0, mr: collapsed ? 0 : 1.5, color: "inherit", justifyContent: "center" }}>
              <FileDown size={20} />
            </ListItemIcon>
            {!collapsed && <ListItemText primary="Download Records" primaryTypographyProps={{ fontSize: "0.9rem", fontWeight: 600 }} />}
          </ListItemButton>
        </Tooltip>
      </Box>

      {/* Secondary Navigation */}
      <Box sx={{ py: 2 }}>
        <List sx={{ py: 0 }}>
          {SECONDARY_NAV.map((item, idx) => (
            <NavItem key={idx} item={item} />
          ))}
          <Tooltip title="Sign Out" placement="right" arrow={collapsed}>
            <ListItem disablePadding sx={{ mt: 1 }}>
              <ListItemButton
                component={Link}
                href="/patient-portal"
                sx={{
                  minHeight: 48,
                  px: collapsed ? 0 : 2.5,
                  justifyContent: collapsed ? "center" : "flex-start",
                  borderRadius: "8px",
                  mx: 1.5,
                  color: "#BCC8D0",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.05)" },
                }}
              >
                <ListItemIcon sx={{ minWidth: 0, mr: collapsed ? 0 : 2, justifyContent: "center", color: "inherit" }}>
                  <LogOut size={20} />
                </ListItemIcon>
                {!collapsed && <ListItemText primary="Sign out" primaryTypographyProps={{ fontSize: "0.95rem", fontWeight: 500 }} />}
              </ListItemButton>
            </ListItem>
          </Tooltip>
        </List>
      </Box>

      {/* Collapse Toggle */}
      <Box sx={{ display: "flex", justifyContent: collapsed ? "center" : "flex-end", p: 2, borderTop: "1px solid #29404F" }}>
        <IconButton onClick={onToggle} size="small" sx={{ color: "#BCC8D0", "&:hover": { bgcolor: "rgba(255,255,255,0.05)" } }}>
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </IconButton>
      </Box>
    </Box>
  );
};
