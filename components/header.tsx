"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";
import Fab from "@mui/material/Fab";
import Zoom from "@mui/material/Zoom";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import LogoutIcon from "@mui/icons-material/Logout";

export default function Header() {
  const [isLogged, setIsLogged] = useState(false);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const trigger = useScrollTrigger({ threshold: 600, disableHysteresis: true });

  useEffect(() => {
    const hasToken = document.cookie
      .split(";")
      .some((item) => item.trim().startsWith("partner_token="));
    setIsLogged(hasToken);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll(); // check initial
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      document.cookie =
        "partner_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      localStorage.removeItem("partner_token");
      window.location.href = "/partner/login";
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const navLinks = [
    { label: "Modules", href: "/#modules" },
    { label: "Features", href: "/#features" },
    { label: "Pricing", href: "/#pricing" },

    { label: "Partners", href: "/#partner-program" },
    { label: "Compliance", href: "/compliance" },
  ];

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          background: scrolled
            ? "rgba(255,255,255,0.72)"
            : "rgba(255,255,255,0.92)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          boxShadow: scrolled
            ? "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)"
            : "none",
          borderBottom: scrolled
            ? "1px solid rgba(0,0,0,0.06)"
            : "1px solid transparent",
          transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <Toolbar
          sx={{
            minHeight: scrolled ? 64 : 88,
            transition: "min-height 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
            py: scrolled ? 1 : 2,
            px: 2,
            maxWidth: 1280,
            width: "100%",
            mx: "auto",
          }}
        >
          {/* Logo — shrinks on scroll */}
          <Box
            component={Link}
            href="/"
            sx={{
              mr: "auto",
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
            }}
          >
            <Box
              component="img"
              src="/logo.png"
              alt="KaeroPrescribe"
              sx={{
                height: scrolled ? { xs: 32, md: 44 } : { xs: 48, md: 64 },
                transition: "height 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            />
          </Box>

          {/* Desktop nav */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: 3,
              mr: 3,
            }}
          >
            {navLinks.map((link) => (
              <Box
                key={link.label}
                component="a"
                href={link.href}
                sx={{
                  color: "#475569",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  textDecoration: "none",
                  transition: "color 0.2s",
                  "&:hover": { color: "#0D9488" },
                }}
              >
                {link.label}
              </Box>
            ))}
          </Box>

          {/* Desktop actions */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: 1.5,
            }}
          >
            {isLogged ? (
              <>
                <Button
                  component={Link}
                  href="/partner/dashboard"
                  startIcon={<DashboardOutlinedIcon />}
                  sx={{ color: "#475569", fontSize: "0.8125rem" }}
                >
                  Dashboard
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<LogoutIcon />}
                  onClick={handleLogout}
                  sx={{ fontSize: "0.8125rem" }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  component={Link}
                  href="/partner/register"
                  variant="outlined"
                  sx={{
                    fontSize: "0.8125rem",
                    display: { xs: "none", lg: "inline-flex" },
                    borderColor: "#CBD5E1",
                    color: "#475569",
                    "&:hover": {
                      borderColor: "#14B8A6",
                      color: "#0D9488",
                      background: "rgba(20,184,166,0.04)",
                    },
                  }}
                >
                  Partner Program
                </Button>
                <Button
                  component={Link}
                  href="/onboarding"
                  variant="contained"
                  color="primary"
                  sx={{ fontSize: "0.8125rem" }}
                >
                  Get Started Free
                </Button>
              </>
            )}
          </Box>

          {/* Mobile hamburger */}
          <IconButton
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            sx={{
              display: { md: "none" },
              color: "#475569",
              p: 1,
              minHeight: 44,
              minWidth: 44,
            }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Full-screen mobile drawer */}
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Box sx={{ p: 2, display: "flex", justifyContent: "flex-end" }}>
          <IconButton
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            sx={{ color: "#94A3B8", minHeight: 44, minWidth: 44 }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <List sx={{ px: 2, flex: 1 }}>
          {navLinks.map((item) => (
            <ListItemButton
              key={item.label}
              component="a"
              href={item.href}
              onClick={() => setOpen(false)}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                "&:hover": { background: "rgba(255,255,255,0.06)" },
              }}
            >
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  color: "#F1F5F9",
                  fontWeight: 500,
                  fontSize: "1.125rem",
                }}
              />
            </ListItemButton>
          ))}

          {isLogged && (
            <>
              <ListItemButton
                component={Link}
                href="/partner/dashboard"
                onClick={() => setOpen(false)}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  "&:hover": { background: "rgba(255,255,255,0.06)" },
                }}
              >
                <DashboardOutlinedIcon
                  sx={{ color: "#94A3B8", mr: 1.5, fontSize: 20 }}
                />
                <ListItemText
                  primary="Dashboard"
                  primaryTypographyProps={{
                    color: "#F1F5F9",
                    fontWeight: 500,
                    fontSize: "1.125rem",
                  }}
                />
              </ListItemButton>
            </>
          )}
        </List>
        <Box sx={{ p: 2 }}>
          {isLogged ? (
            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={handleLogout}
              startIcon={<LogoutIcon />}
            >
              Logout
            </Button>
          ) : (
            <>
              <Button
                variant="contained"
                fullWidth
                size="large"
                component={Link}
                href="/onboarding"
                sx={{ mb: 1.5 }}
              >
                Get Started Free
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                fullWidth
                size="large"
                component={Link}
                href="/partner/register"
              >
                Partner Program
              </Button>
            </>
          )}
        </Box>
      </Drawer>

      {/* Floating CTA after hero scroll */}
      <Zoom in={trigger}>
        <Fab
          variant="extended"
          color="primary"
          component={Link}
          href="/onboarding"
          sx={{
            position: "fixed",
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%) !important",
            zIndex: 1000,
            width: "calc(100% - 32px)",
            maxWidth: 360,
            borderRadius: 3,
            fontWeight: 700,
            display: { md: "none" },
          }}
        >
          Get Started Free
        </Fab>
      </Zoom>
    </>
  );
}
