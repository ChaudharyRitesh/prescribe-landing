"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Divider,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  AccountBalanceWallet as WalletIcon,
  Settings as SettingsIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  TrendingUp as TrendingUpIcon,
  Event as EventIcon,
  LocalTaxi as ExpenseIcon,
  MenuBook as DetailingIcon,
  Inventory as InventoryIcon,
  Business as BusinessIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { useDashboard } from "@/app/partner/dashboard/context/DashboardContext";

const drawerWidth = 280;

const menuItems = [
  { text: "Overview", icon: <DashboardIcon />, path: "/partner/dashboard" },
  { text: "Calendar", icon: <EventIcon />, path: "/partner/dashboard/calendar" },
  { 
    text: "Digital Detailing", 
    icon: <DetailingIcon />, 
    path: "/partner/dashboard/detailing",
    disabled: true,
    badge: "unlocked at 5 deals" 
  },
  { 
    text: "Doctors", 
    icon: <PeopleIcon />, 
    path: "/partner/dashboard/doctors",
    disabled: true,
    badge: "unlocked at 5 deals"
  },
  { 
    text: "Expenses", 
    icon: <ExpenseIcon />, 
    path: "/partner/dashboard/expenses",
    disabled: true,
    badge: "unlocked at 5 deals"
  },
  { text: "My Hospitals", icon: <BusinessIcon />, path: "/partner/dashboard/hospitals" },
  { text: "Performance", icon: <TrendingUpIcon />, path: "/partner/dashboard/performance" },
  { 
    text: "Earnings", 
    icon: <WalletIcon />, 
    path: "/partner/dashboard/earnings",
    disabled: true,
    badge: "unlocked at 5 deals"
  },
  { text: "Settings", icon: <SettingsIcon />, path: "/partner/dashboard/settings" },
];

export default function Sidebar({
  mobileOpen,
  handleDrawerToggle,
}: {
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
}) {
  const pathname = usePathname();
  const { handleLogout } = useDashboard();

  const drawerContent = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", bgcolor: "#051114", color: "white" }}>
      <Box sx={{ p: 3, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" passHref>
          <Box component="img" src="/logo.png" sx={{ height: 28, filter: "brightness(0) invert(1)" }} alt="Logo" />
        </Link>
        <IconButton
          color="inherit"
          aria-label="close drawer"
          edge="end"
          onClick={handleDrawerToggle}
          sx={{ display: { sm: "none" } }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      
      <Box sx={{ px: 3, mb: 2 }}>
        <Typography variant="overline" sx={{ color: "#0D9488", fontWeight: "bold", letterSpacing: 1 }}>
          Kaero Partner Program
        </Typography>
      </Box>

      <List sx={{ px: 2, flexGrow: 1 }}>
        {menuItems.map((item: any) => {
          const isActive = pathname === item.path;
          const isDisabled = item.disabled;

          const content = (
            <ListItemButton
              disabled={isDisabled}
              sx={{
                borderRadius: 2,
                bgcolor: isActive ? "rgba(13, 148, 136, 0.1)" : "transparent",
                color: isDisabled ? "rgba(255, 255, 255, 0.3)" : (isActive ? "#0D9488" : "rgba(255, 255, 255, 0.7)"),
                opacity: isDisabled ? 0.7 : 1,
                "&:hover": isDisabled ? {} : {
                  bgcolor: "rgba(13, 148, 136, 0.15)",
                  color: "#0D9488",
                  transform: "translateX(4px)",
                },
                transition: "all 0.2s ease",
              }}
            >
              <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText 
                primary={
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
                    <Typography sx={{ fontSize: "0.95rem", fontWeight: isActive ? 600 : 500 }}>
                      {item.text}
                    </Typography>
                    {item.badge && (
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          fontSize: "0.65rem", 
                          bgcolor: "rgba(255,255,255,0.05)", 
                          px: 1, 
                          py: 0.25, 
                          borderRadius: 1,
                          color: "rgba(255,255,255,0.4)",
                          whiteSpace: "nowrap",
                          textTransform: "none"
                        }}
                      >
                        {item.badge}
                      </Typography>
                    )}
                  </Box>
                }
              />
            </ListItemButton>
          );

          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              {isDisabled ? (
                <Box sx={{ width: "100%" }}>{content}</Box>
              ) : (
                <Link href={item.path} passHref style={{ width: "100%", textDecoration: "none" }}>
                  {content}
                </Link>
              )}
            </ListItem>
          );
        })}
        
        <Divider sx={{ my: 1, bgcolor: "rgba(255,255,255,0.05)" }} />
        
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => handleLogout()}
            sx={{
              borderRadius: 2,
              color: "rgba(255, 255, 255, 0.7)",
              "&:hover": {
                bgcolor: "rgba(239, 68, 68, 0.1)",
                color: "#ef4444",
                transform: "translateX(4px)",
              },
              transition: "all 0.2s ease",
            }}
          >
            <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Logout" 
              primaryTypographyProps={{ 
                fontSize: "0.95rem", 
                fontWeight: 500 
              }} 
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }} 
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth, borderRight: "none" },
        }}
      >
        {drawerContent}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth, borderRight: "none" },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}
