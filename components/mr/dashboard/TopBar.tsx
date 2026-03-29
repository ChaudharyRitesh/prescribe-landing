"use client";

import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Avatar,
  Badge,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import {
  Menu as MenuIcon,
  NotificationsNone as NotificationsIcon,
  KeyboardArrowDown as ArrowDownIcon,
  Logout as LogoutIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@mui/material";
import { useDashboard } from "@/app/mr/dashboard/context/DashboardContext";

export default function TopBar({
  handleDrawerToggle,
}: {
  handleDrawerToggle: () => void;
}) {
  const router = useRouter();
  const { openNewPitchModal, userData, loading, handleLogout: logout } = useDashboard();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setAnchorEl(null);
    logout();
  };

  const userInitial = userData?.name?.charAt(0) || "U";

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: "white",
        color: "text.primary",
        borderBottom: "1px solid",
        borderColor: "divider",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", minHeight: { xs: 64, sm: 72 } }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" }, color: "neutral.900" }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ 
              fontWeight: 700, 
              display: { xs: "none", md: "block" },
              color: "#111827" 
            }}
          >
            {loading ? "Loading..." : `Welcome back, ${userData?.name?.split(' ')[0] || 'Partner'} 👋`}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 2 } }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={openNewPitchModal}
            sx={{
              display: { xs: "none", sm: "flex" },
              px: { sm: 2, md: 3 },
              py: 1,
              boxShadow: "0px 4px 12px rgba(13, 148, 136, 0.2)",
              "&:hover": {
                transform: "translateY(-1px)",
                boxShadow: "0px 6px 16px rgba(13, 148, 136, 0.3)",
              },
              transition: "all 0.2s",
            }}
          >
            New Pitch
          </Button>

          <IconButton 
            sx={{ display: { xs: "flex", sm: "none" }, backgroundColor: "rgba(13, 148, 136, 0.1)", color: "primary.main" }}
            onClick={openNewPitchModal}
          >
            <AddIcon />
          </IconButton>

          <IconButton sx={{ backgroundColor: "rgba(0,0,0,0.03)" }}>
            <Badge badgeContent={3} sx={{ "& .MuiBadge-badge": { backgroundColor: "#00DACC", color: "white" } }}>
              <NotificationsIcon sx={{ color: "text.secondary" }} />
            </Badge>
          </IconButton>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              cursor: "pointer",
              p: 0.5,
              pr: 1.5,
              borderRadius: 8,
              border: "1px solid",
              borderColor: "divider",
              transition: "all 0.2s",
              "&:hover": { backgroundColor: "rgba(0,0,0,0.02)" }
            }}
            onClick={handleProfileClick}
          >
            <Avatar 
              src={userData?.profileImage}
              sx={{ width: 32, height: 32, bgcolor: "#051114", fontSize: "0.875rem" }}
            >
              {userInitial}
            </Avatar>
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <Typography variant="body2" fontWeight="600" lineHeight={1.2}>
                {loading ? "..." : userData?.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {userData?.companyName || "Field Force"}
              </Typography>
            </Box>
            <ArrowDownIcon sx={{ fontSize: 20, color: "text.secondary", display: { xs: "none", sm: "block" } }} />
          </Box>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 4px 20px rgba(0,0,0,0.08))',
                mt: 1.5,
                minWidth: 200,
                borderRadius: 2,
                '& .MuiAvatar-root': {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
              },
            }}
          >
            <MenuItem onClick={handleClose}>
              <Avatar /> Profile Details
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
              <LogoutIcon sx={{ mr: 2, fontSize: 20 }} /> Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
