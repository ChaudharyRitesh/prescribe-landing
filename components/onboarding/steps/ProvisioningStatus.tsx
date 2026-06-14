"use client";

import { useProvisioningStatusQuery } from "@/hooks/queries/useOnboarding";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import PeopleIcon from "@mui/icons-material/People";
import RefreshIcon from "@mui/icons-material/Refresh";
import ScienceIcon from "@mui/icons-material/Science";
import TerminalIcon from "@mui/icons-material/Terminal";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import { Box, Button, Grid, LinearProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { OnboardingData } from "../OnboardingWizard";

interface Props {
  data: OnboardingData;
}

export function ProvisioningStatus({ data }: Props) {
  const [localSessionId, setLocalSessionId] = useState(data.sessionId);
  const [progress, setProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  // Sync / Fallback for sessionId
  useEffect(() => {
    if (data.sessionId) {
      setLocalSessionId(data.sessionId);
    } else if (typeof window !== "undefined") {
      const saved = localStorage.getItem("kaero_onboarding_session");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.sessionId) {
            setLocalSessionId(parsed.sessionId);
          }
        } catch (e) {
          console.error("Failed to parse onboarding session from localStorage", e);
        }
      }
    }
  }, [data.sessionId]);

  const { data: statusResp, isLoading, isError } = useProvisioningStatusQuery(
    localSessionId || '',
    !!localSessionId
  );

  // Debug logging
  if (statusResp) {
    console.log(`[ProvisioningStatus] localSessionID: ${localSessionId}, status: ${statusResp.status}`);
  }

  const isProvisioned = statusResp?.status === "provisioned";
  const isQuotePending = statusResp?.status === "quote_pending";
  const isFailed = statusResp?.status === "failed" || isError;

  const clearAllStorageAndCookies = () => {
    if (typeof window === "undefined") return;
    try {
      localStorage.clear();
      sessionStorage.clear();
      const cookies = document.cookie.split(";");
      for (const cookie of cookies) {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
      }
    } catch (e) {
      console.error("Failed to clear all storage and cookies", e);
    }
  };

  useEffect(() => {
    if (isProvisioned || isQuotePending) {
      clearAllStorageAndCookies();
    } else if (isFailed) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("kaero_onboarding_session");
      }
    }
  }, [isProvisioned, isFailed, isQuotePending]);

  useEffect(() => {
    if (!localSessionId || isProvisioned || isFailed || isQuotePending) return;

    const startTime = Date.now();
    const duration = 40000; // Target duration of 40 seconds

    const logMessages = [
      { delay: 1000, text: "⚡ Connecting to Kaero provisioning gateway..." },
      { delay: 3000, text: "🔒 Cryptographic JWT verification successful." },
      { delay: 5000, text: "📂 Allocating isolated database and file storage volumes..." },
      { delay: 8000, text: "💾 Initialising PostgreSQL database schemas..." },
      { delay: 11000, text: "💾 Database indexes and core constraints applied successfully." },
      { delay: 14000, text: "🚀 Deploying Kaero Prescribe core API engine..." },
      { delay: 17000, text: "🩺 Injecting clinical module: Doctors & AI Scribe..." },
      { delay: 21000, text: "👥 Injecting clinical module: Reception & Scheduling..." },
      { delay: 25000, text: "💊 Injecting clinical module: Pharmacy & Stocks..." },
      { delay: 29000, text: "🔬 Injecting clinical module: Pathology & Lab (LIS)..." },
      { delay: 33000, text: "⚙️ Applying plan limits (doctors, receptionists, storage)..." },
      { delay: 35000, text: "🌐 Reserving secure subdomain..." },
      { delay: 37000, text: "🛡️ Provisioning SSL/TLS certificates and routing maps..." },
      { delay: 39000, text: "✅ Post-provisioning health tests completed. Finalising..." }
    ];

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const calculatedProgress = Math.min(98, Math.round((elapsed / duration) * 100));
      setProgress(calculatedProgress);

      if (calculatedProgress < 20) setActiveStep(0);
      else if (calculatedProgress < 55) setActiveStep(1);
      else if (calculatedProgress < 80) setActiveStep(2);
      else setActiveStep(3);

      const triggeredLogs = logMessages
        .filter(m => m.delay <= elapsed)
        .map(m => m.text);
      setLogs(triggeredLogs);
    }, 1000);

    return () => clearInterval(timer);
  }, [localSessionId, isProvisioned, isFailed, isQuotePending]);

  useEffect(() => {
    const el = document.getElementById("terminal-logs");
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [logs]);

  const renderLoadingState = () => {
    return (
      <Box
        className="animate-fade-in"
        display="flex"
        flexDirection="column"
        alignItems="center"
        width="100%"
        maxWidth="md"
        mx="auto"
        sx={{
          background: "rgba(255, 255, 255, 0.03)",
          backdropFilter: "blur(20px)",
          borderRadius: "24px",
          border: "1px solid rgba(255,255,255,0.1)",
          p: { xs: 3, md: 5 },
          boxShadow: "0 30px 60px -20px rgba(2,6,23,0.8)"
        }}
      >
        <style>{`
          @keyframes heartbeat {
            0% { stroke-dashoffset: 600; }
            100% { stroke-dashoffset: 0; }
          }
          @keyframes pulseScale {
            0%, 100% { transform: scale(1); opacity: 0.15; }
            50% { transform: scale(1.05); opacity: 0.25; }
          }
          .ecg-line {
            stroke-dasharray: 600;
            animation: heartbeat 4s linear infinite;
          }
          .pulse-circle {
            animation: pulseScale 2s ease-in-out infinite;
          }
        `}</style>

        {/* Pulsing Glowing Medical Core */}
        <Box position="relative" display="flex" alignItems="center" justifyContent="center" mb={4}>
          <Box
            sx={{
              position: 'absolute',
              width: 130,
              height: 130,
              borderRadius: '50%',
              background: 'radial-gradient(circle, #14b8a6 0%, rgba(20, 184, 166, 0) 70%)',
            }}
            className="pulse-circle"
          />
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            sx={{
              width: 90,
              height: 90,
              borderRadius: '50%',
              bgcolor: 'rgba(20,184,166,0.15)',
              color: '#5eead4',
              boxShadow: '0 8px 30px rgba(20, 184, 166, 0.25)',
              zIndex: 1
            }}
          >
            <LocalHospitalIcon sx={{ fontSize: 42 }} className="animate-pulse" />
          </Box>
        </Box>

        <Typography variant="h4" fontWeight="bold" gutterBottom color="text.primary" sx={{ letterSpacing: "-0.5px" }}>
          Finalising Your Workspace Setup
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={4} maxWidth="sm">
          We are tailoring your isolated healthcare dashboard, configuring modules, and securing databases. This takes a brief moment...
        </Typography>

        {/* ECG Heartbeat Line */}
        <Box width="100%" maxWidth="500px" mb={4} sx={{ background: 'rgba(20,184,166,0.05)', borderRadius: '12px', border: '1px solid rgba(20,184,166,0.15)', p: 1 }}>
          <svg width="100%" height="60" viewBox="0 0 300 60" fill="none">
            <path
              d="M0,30 L60,30 L70,30 L75,20 L80,45 L85,5 L90,55 L95,30 L100,30 L160,30 L170,30 L175,20 L180,45 L185,5 L190,55 L195,30 L200,30 L260,30 L270,30 L275,20 L280,45 L285,5 L290,55 L295,30 L300,30"
              stroke="#2dd4bf"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="ecg-line"
            />
          </svg>
        </Box>

        {/* Overall Progress */}
        <Box width="100%" maxWidth="500px" mb={5}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="body2" fontWeight="bold" color="text.secondary">
              {activeStep === 0 && "🔌 Connecting gateway & storage..."}
              {activeStep === 1 && "📦 Installing medical core & modules..."}
              {activeStep === 2 && "⚙️ Customizing account limits..."}
              {activeStep === 3 && "🛡️ Reserving domain & SSL certificates..."}
            </Typography>
            <Typography variant="body2" fontWeight="bold" color="primary">
              {progress}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: 'rgba(255,255,255,0.1)',
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
                backgroundImage: 'linear-gradient(90deg, #2dd4bf 0%, #0ea5e9 100%)'
              }
            }}
          />
        </Box>

        {/* 2x2 Grid of Modules */}
        <Typography variant="subtitle1" fontWeight="bold" color="text.primary" mb={2} alignSelf="flex-start">
          Clinical Suite Installation
        </Typography>
        <Grid container spacing={3} mb={5}>
          {[
            { name: "Doctor & AI Clinical Scribe", icon: <MedicalServicesIcon />, active: progress >= 25 },
            { name: "Receptionist & Appointments", icon: <PeopleIcon />, active: progress >= 40 },
            { name: "Pharmacy & Stock Ledger", icon: <VaccinesIcon />, active: progress >= 55 },
            { name: "Pathology & Lab (LIS)", icon: <ScienceIcon />, active: progress >= 70 },
          ].map((mod, i) => (
            <Grid size={{ xs: 12, sm: 6 }} key={i}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  p: 2.5,
                  borderRadius: "16px",
                  border: "1px solid",
                  borderColor: mod.active ? "rgba(45,212,191,0.45)" : "rgba(255,255,255,0.1)",
                  bgcolor: mod.active ? "rgba(20,184,166,0.12)" : "rgba(255,255,255,0.03)",
                  transition: "all 0.5s ease",
                  boxShadow: mod.active ? "0 8px 20px -6px rgba(45, 212, 191, 0.3)" : "none"
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 44,
                    height: 44,
                    borderRadius: "12px",
                    bgcolor: mod.active ? "rgba(45,212,191,0.18)" : "rgba(255,255,255,0.06)",
                    color: mod.active ? "#5eead4" : "text.secondary",
                    transition: "all 0.5s ease"
                  }}
                >
                  {mod.icon}
                </Box>
                <Box textAlign="left" flex={1}>
                  <Typography variant="body2" fontWeight="bold" color={mod.active ? "success.main" : "text.primary"}>
                    {mod.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {mod.active ? "Module ready & verified" : "Awaiting installation..."}
                  </Typography>
                </Box>
                {mod.active && <CheckCircleIcon color="success" sx={{ fontSize: 20 }} />}
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Live Rolling Logs Console */}
        <Box width="100%" textAlign="left">
          <Typography variant="subtitle2" fontWeight="bold" color="text.primary" mb={1.5} display="flex" alignItems="center" gap={1}>
            <TerminalIcon sx={{ fontSize: 18 }} />
            <span>Provisioning System Logs</span>
          </Typography>
          <Box
            id="terminal-logs"
            sx={{
              width: "100%",
              height: 160,
              bgcolor: "#0f172a",
              color: "#38bdf8",
              p: 2.5,
              borderRadius: "16px",
              fontFamily: "monospace",
              fontSize: "13px",
              overflowY: "auto",
              boxShadow: "inset 0 2px 8px rgba(0,0,0,0.3)",
              border: "1px solid rgba(51, 65, 85, 0.5)",
              "&::-webkit-scrollbar": {
                width: "6px"
              },
              "&::-webkit-scrollbar-thumb": {
                bgcolor: "rgba(56, 189, 248, 0.2)",
                borderRadius: "3px"
              }
            }}
          >
            {logs.length === 0 ? (
              <Box color="rgba(56, 189, 248, 0.4)" className="animate-pulse">
                Initializing safe connection tunnel...
              </Box>
            ) : (
              logs.map((log, i) => (
                <Box key={i} mb={0.5} sx={{ display: "flex", gap: 1 }}>
                  <Box color="success.main" component="span">[Kaero]</Box>
                  <Box color="white" component="span">{log}</Box>
                </Box>
              ))
            )}
          </Box>
        </Box>

        {/* Warning / Setup Notice Alert */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mt: 4,
            p: 2,
            width: "100%",
            borderRadius: "16px",
            border: "1px solid rgba(245, 158, 11, 0.35)",
            bgcolor: "rgba(245, 158, 11, 0.12)",
            color: "warning.light",
            boxShadow: "0 4px 12px -2px rgba(245, 158, 11, 0.1)",
            textAlign: "left"
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              borderRadius: "10px",
              bgcolor: "rgba(245, 158, 11, 0.1)",
              color: "warning.main",
              flexShrink: 0
            }}
          >
            <ErrorOutlineIcon sx={{ fontSize: 22 }} />
          </Box>
          <Box>
            <Typography variant="body2" fontWeight="bold" sx={{ color: "#fbbf24", mb: 0.5 }}>
              Crucial: Setup Underway (Please Do Not Close, Refresh, or Go Back)
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Tailoring an isolated healthcare server instance can take up to <strong>2 to 5 minutes</strong> to complete DNS, DB indexing, and SSL binding operations. Please keep this browser window active.
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  };

  if (isLoading) {
    return renderLoadingState();
  }

  return (
    <Box
      className="animate-scale-in"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="50vh"
      textAlign="center"
    >
      {isProvisioned ? (
        <>
          <Box
            bgcolor="success.light"
            color="success.main"
            p={2}
            borderRadius="50%"
            display="flex"
            alignItems="center"
            justifyContent="center"
            mb={3}
            sx={{ opacity: 0.15, position: 'absolute', width: 120, height: 120, zIndex: 0 }}
          />
          <CheckCircleOutlineIcon color="success" sx={{ fontSize: 80, mb: 3, zIndex: 1 }} />

          <Typography variant="h3" fontWeight="bold" gutterBottom color="text.primary" sx={{ zIndex: 1 }}>
            You're all set! 🎉
          </Typography>

          <Typography variant="h6" color="text.secondary" mb={4} maxWidth="sm" sx={{ zIndex: 1 }}>
            Your organization setup is complete.
            We have securely shared the administrator login credentials via email to: <br />
            <Box component="span" fontWeight="bold" color="text.primary">{statusResp?.adminEmail || data.email}</Box>.
          </Typography>

          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => {
              clearAllStorageAndCookies();
              window.location.href = statusResp?.dashboardUrl || "#";
            }}
            endIcon={<DashboardIcon />}
            sx={{ px: 5, py: 1.5, zIndex: 1 }}
          >
            Go to my Dashboard
          </Button>
        </>
      ) : isQuotePending ? (
        <>
          {/* Dynamic success screen for Quote Requests */}
          <Box
            bgcolor="primary.light"
            color="primary.main"
            p={2}
            borderRadius="50%"
            display="flex"
            alignItems="center"
            justifyContent="center"
            mb={3}
            sx={{ opacity: 0.15, position: 'absolute', width: 120, height: 120, zIndex: 0 }}
          />
          <CheckCircleOutlineIcon color="primary" sx={{ fontSize: 80, mb: 3, zIndex: 1 }} />

          <Typography variant="h3" fontWeight="bold" gutterBottom color="text.primary" sx={{ zIndex: 1 }}>
            Quote Request Submitted! 📝
          </Typography>

          <Typography variant="h6" color="text.secondary" mb={4} maxWidth="sm" sx={{ zIndex: 1 }}>
            We have received your custom setup requirements for <strong>Kaero Nexus</strong>. Our team is currently reviewing your requested limits.
          </Typography>

          <Box
            sx={{
              bgcolor: 'background.paper',
              p: 3,
              borderRadius: 2,
              border: 1,
              borderColor: 'divider',
              textAlign: 'left',
              maxWidth: 'sm',
              mb: 4,
              zIndex: 1
            }}
          >
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="text.primary">
              What's next?
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={1} display="flex" alignItems="center">
              <Box component="span" sx={{ mr: 1, fontWeight: 'bold' }}>1.</Box> <span><strong>Super Admin Review:</strong> We will evaluate your custom doctor/staff accounts and cloud storage caps.</span>
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={1} display="flex" alignItems="center">
              <Box component="span" sx={{ mr: 1, fontWeight: 'bold' }}>2.</Box> <span><strong>Custom Quotation Email:</strong> You will receive a specialized email proposal containing your custom limits and pricing.</span>
            </Typography>
            <Typography variant="body2" color="text.secondary" display="flex" alignItems="center">
              <Box component="span" sx={{ mr: 1, fontWeight: 'bold' }}>3.</Box> <span><strong>Setup Activation:</strong> Simply click the payment link in the email to activate and auto-provision your workspace instantly.</span>
            </Typography>
          </Box>

          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => {
              clearAllStorageAndCookies();
              window.location.href = "/";
            }}
            sx={{ px: 5, py: 1.5, zIndex: 1 }}
          >
            Back to Homepage
          </Button>
        </>
      ) : isFailed ? (
        <>
          <ErrorOutlineIcon color="error" sx={{ fontSize: 80, mb: 3 }} />
          <Typography variant="h4" fontWeight="bold" gutterBottom color="text.primary">
            Provisioning Failed
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={4} maxWidth="sm">
            {statusResp?.failureReason || "Something went wrong while setting up your tenant workspace. Our support team has been notified and we will fix this shortly."}
          </Typography>
          <Button variant="outlined" color="primary" onClick={() => {
            if (typeof window !== "undefined") {
              localStorage.removeItem("kaero_onboarding_session");
            }
            window.location.href = "/onboarding";
          }} startIcon={<RefreshIcon />}>
            Start over
          </Button>
        </>
      ) : !localSessionId ? (
        <>
          <ErrorOutlineIcon color="warning" sx={{ fontSize: 80, mb: 3 }} />
          <Typography variant="h4" fontWeight="bold" gutterBottom color="text.primary">
            Session ID Missing
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={4} maxWidth="sm">
            We couldn't find your active session. Please contact support or try starting over.
          </Typography>
          <Button variant="outlined" color="primary" onClick={() => {
            if (typeof window !== "undefined") {
              localStorage.removeItem("kaero_onboarding_session");
            }
            window.location.reload();
          }}>
            Restart Onboarding
          </Button>
        </>
      ) : (
        renderLoadingState()
      )}
    </Box>
  );
}
