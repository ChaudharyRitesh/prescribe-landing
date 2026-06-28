"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
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
  X,
  ShieldCheck,
  FileDown
} from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";

const PRIMARY_NAV = [
  { label: "Health Home", path: "/portal/home", icon: <Home size={20} />, enabled: true },
  { label: "Medical Records", path: "/portal/records", icon: <FileText size={20} />, enabled: true },
  { label: "Appointments", path: "/portal/appointments", icon: <Calendar size={20} />, enabled: true },
  { label: "Prescriptions", path: "/portal/medicines", icon: <Pill size={20} />, enabled: true },
  { label: "Lab Reports", path: "/portal/reports", icon: <TestTube size={20} />, enabled: false },
  { label: "Bills & Payments", path: "/portal/bills", icon: <CreditCard size={20} />, enabled: true },
  { label: "ABHA & Consents", path: "/portal/abha", icon: <ShieldCheck size={20} />, enabled: false },
  { label: "Profile", path: "/portal/profile", icon: <User size={20} />, enabled: true },
];

const SECONDARY_NAV = [
  { label: "Help & Support", path: "/portal/support", icon: <HelpCircle size={20} />, enabled: false },
  { label: "Privacy", path: "/portal/privacy", icon: <Shield size={20} />, enabled: false },
];

interface MobilePatientDrawerProps {
  open: boolean;
  onClose: () => void;
}

export const MobilePatientDrawer = ({ open, onClose }: MobilePatientDrawerProps) => {
  const pathname = usePathname();

  const NavItem = ({ item }: { item: any }) => {
    const isActive = pathname === item.path && item.enabled;

    return (
      <ListItem disablePadding sx={{ mb: 0.5 }}>
        <ListItemButton
          component={item.enabled ? Link : "div"}
          href={item.enabled ? item.path : undefined}
          disabled={!item.enabled}
          onClick={() => {
            if (item.enabled) onClose();
          }}
          sx={{
            minHeight: 48,
            borderRadius: "8px",
            mx: 1.5,
            bgcolor: isActive ? "#E8F5F6" : "transparent",
            color: isActive ? "#087F8C" : "#BCC8D0",
            "&.Mui-disabled": { opacity: 0.5 },
          }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: isActive ? "#087F8C" : "#BCC8D0" }}>
            {item.icon}
          </ListItemIcon>
          <ListItemText
            primary={item.label}
            primaryTypographyProps={{
              fontSize: "0.95rem",
              fontWeight: isActive ? 600 : 500,
            }}
          />
          {!item.enabled && <Typography variant="caption" color="text.secondary" sx={{ ml: 1, fontSize: "0.7rem", opacity: 0.7 }}>(Coming soon)</Typography>}
        </ListItemButton>
      </ListItem>
    );
  };

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 280,
          bgcolor: "#132532",
          borderRight: "none",
        }
      }}
    >
      <Box sx={{ height: 72, display: "flex", alignItems: "center", justifyContent: "space-between", px: 2, borderBottom: "1px solid #29404F" }}>
        <BrandLogo mark={28} />
        <IconButton onClick={onClose} sx={{ color: "#BCC8D0" }}>
          <X size={24} />
        </IconButton>
      </Box>

      <Box sx={{ flexGrow: 1, overflowY: "auto", py: 2 }}>
        <List>
          {PRIMARY_NAV.map((item, idx) => (
            <NavItem key={idx} item={item} />
          ))}
        </List>
      </Box>

      <Box sx={{ p: 2, borderTop: "1px solid #29404F", borderBottom: "1px solid #29404F" }}>
        <ListItemButton
          sx={{
            bgcolor: "rgba(8, 127, 140, 0.1)",
            borderRadius: "8px",
            color: "#087F8C",
          }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: "inherit" }}>
            <FileDown size={20} />
          </ListItemIcon>
          <ListItemText primary="Download Records" primaryTypographyProps={{ fontSize: "0.9rem", fontWeight: 600 }} />
        </ListItemButton>
      </Box>

      <Box sx={{ py: 2 }}>
        <List>
          {SECONDARY_NAV.map((item, idx) => (
            <NavItem key={idx} item={item} />
          ))}
          <ListItem disablePadding sx={{ mt: 1 }}>
            <ListItemButton
              component={Link}
              href="/patient-portal"
              sx={{ minHeight: 48, borderRadius: "8px", mx: 1.5, color: "#BCC8D0" }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: "inherit" }}>
                <LogOut size={20} />
              </ListItemIcon>
              <ListItemText primary="Sign out" primaryTypographyProps={{ fontSize: "0.95rem", fontWeight: 500 }} />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};
