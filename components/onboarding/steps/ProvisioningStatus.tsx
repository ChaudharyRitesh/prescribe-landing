"use client";

import { useState, useEffect } from "react";
import { useProvisioningStatusQuery } from "@/hooks/queries/useOnboarding";
import { OnboardingData } from "../OnboardingWizard";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import DashboardIcon from "@mui/icons-material/Dashboard";
import RefreshIcon from "@mui/icons-material/Refresh";

interface Props {
  data: OnboardingData;
}

export function ProvisioningStatus({ data }: Props) {
  const [localSessionId, setLocalSessionId] = useState(data.sessionId);

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

  useEffect(() => {
    if (isProvisioned || isFailed || isQuotePending) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("kaero_onboarding_session");
      }
    }
  }, [isProvisioned, isFailed, isQuotePending]);

  if (isLoading) {
    return (
       <Box 
         className="animate-fade-in" 
         display="flex" 
         flexDirection="column" 
         alignItems="center" 
         justifyContent="center" 
         minHeight="40vh"
         textAlign="center"
       >
         <Box position="relative" display="inline-flex" mb={4}>
           <CircularProgress size={80} thickness={4} color="primary" />
           <Box
             top={0}
             left={0}
             bottom={0}
             right={0}
             position="absolute"
             display="flex"
             alignItems="center"
             justifyContent="center"
           >
             <Typography variant="h5" component="div" color="primary" className="animate-pulse">
               🚀
             </Typography>
           </Box>
         </Box>
         <Typography variant="h4" fontWeight="bold" gutterBottom color="text.primary">
           Setting up your workspace
         </Typography>
         <Typography variant="body1" color="text.secondary" maxWidth="sm">
           We're provisioning databases, applying your modules, and securing your custom domain. This usually takes a few seconds...
         </Typography>
       </Box>
    );
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
               if (typeof window !== "undefined") {
                 localStorage.removeItem("kaero_onboarding_session");
               }
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
                 if (typeof window !== "undefined") {
                   localStorage.removeItem("kaero_onboarding_session");
                 }
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
          <>
            {/* Still polling but not "provisioned" yet, maybe "provisioning" status */}
            <CircularProgress size={60} sx={{ mb: 4 }} />
            <Typography variant="h4" fontWeight="bold" gutterBottom color="text.primary">
              Finalising...
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Session: {localSessionId?.substring(0, 8)}...
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Creating your dashboard.
            </Typography>
          </>
        )}
    </Box>
  );
}
