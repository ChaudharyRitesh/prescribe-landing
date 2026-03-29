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
  HelpOutline as SupportIcon,
} from "@mui/icons-material";
import { useDashboard } from "@/app/mr/dashboard/context/DashboardContext";

const drawerWidth = 280;

const menuItems = [
  { text: "Overview", icon: <DashboardIcon />, path: "/mr/dashboard" },
  { text: "Calendar", icon: <EventIcon />, path: "/mr/dashboard/calendar" },
  { text: "Digital Detailing", icon: <DetailingIcon />, path: "/mr/dashboard/detailing" },
  { text: "Doctors", icon: <PeopleIcon />, path: "/mr/dashboard/doctors" },
  { text: "Expenses", icon: <ExpenseIcon />, path: "/mr/dashboard/expenses" },
  { text: "My Hospitals", icon: <BusinessIcon />, path: "/mr/dashboard/hospitals" },
  { text: "Performance", icon: <TrendingUpIcon />, path: "/mr/dashboard/performance" },
  { text: "Earnings", icon: <WalletIcon />, path: "/mr/dashboard/earnings" },
  { text: "Settings", icon: <SettingsIcon />, path: "/mr/dashboard/settings" },
  { text: "Support", icon: <SupportIcon />, path: "/mr/dashboard/support" },
];

export default function Sidebar({
  mobileOpen,
  handleDrawerToggle,
}: {
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
}) {
  const pathname = usePathname();
  const { handleLogout, supportUnreadCount } = useDashboard();

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
          MR Partner Portal
        </Typography>
      </Box>

      <List sx={{ px: 2, flexGrow: 1 }}>
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <Link href={item.path} passHref style={{ width: "100%", textDecoration: "none" }}>
                <ListItemButton
                  sx={{
                    borderRadius: 2,
                    bgcolor: isActive ? "rgba(13, 148, 136, 0.1)" : "transparent",
                    color: isActive ? "#0D9488" : "rgba(255, 255, 255, 0.7)",
                    "&:hover": {
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
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                        <span>{item.text}</span>
                        {item.text === "Support" && supportUnreadCount > 0 && (
                          <Box 
                            sx={{ 
                              bgcolor: "#ef4444", 
                              color: "white", 
                              borderRadius: "10px", 
                              px: 0.8, 
                              py: 0.2, 
                              fontSize: "10px", 
                              fontWeight: "bold",
                              ml: 1
                            }}
                          >
                            {supportUnreadCount}
                          </Box>
                        )}
                      </Box>
                    } 
                    primaryTypographyProps={{ 
                      fontSize: "0.95rem", 
                      fontWeight: isActive ? 600 : 500 
                    }} 
                  />
                </ListItemButton>
              </Link>
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

      <Box sx={{ p: 3 }}>
        <Box sx={{ p: 2, borderRadius: 2, bgcolor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
          <Typography variant="body2" sx={{ color: "white", mb: 1, fontWeight: "bold" }}>
            Need Support?
          </Typography>
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.6)", display: "block", mb: 2 }}>
            Contact your territory manager for assistance.
          </Typography>
          <Link href="/mr/dashboard/support" passHref>
            <Typography variant="caption" sx={{ color: "#0D9488", fontWeight: "bold", cursor: "pointer", "&:hover": { textDecoration: "underline" } }}>
              Open Support Ticket
            </Typography>
          </Link>
        </Box>
      </Box>
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
