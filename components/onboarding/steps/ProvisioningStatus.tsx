"use client";

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
  const { data: statusResp, isLoading, isError } = useProvisioningStatusQuery(data.sessionId || '', !!data.sessionId);

  if (!data.sessionId) {
    return (
      <Box p={4} textAlign="center">
        <Typography color="error">No active session found.</Typography>
      </Box>
    );
  }

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

  const isProvisioned = statusResp?.status === "provisioned";
  const isFailed = statusResp?.status === "failed" || isError;

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
             onClick={() => window.location.href = statusResp?.dashboardUrl || "#"}
             endIcon={<DashboardIcon />}
             sx={{ px: 5, py: 1.5, zIndex: 1 }}
           >
             Go to my Dashboard
           </Button>
         </>
       ) : isFailed ? (
         <>
           <ErrorOutlineIcon color="error" sx={{ fontSize: 80, mb: 3 }} />
           <Typography variant="h4" fontWeight="bold" gutterBottom color="text.primary">
             Provisioning Failed
           </Typography>
           <Typography variant="body1" color="text.secondary" mb={4} maxWidth="sm">
             Something went wrong while setting up your tenant workspace. Our support team has been notified and we will fix this shortly.
           </Typography>
           <Button variant="outlined" color="primary" onClick={() => window.location.reload()} startIcon={<RefreshIcon />}>
             Start over
           </Button>
         </>
       ) : (
         <>
           {/* Still polling but not "provisioned" yet, maybe "provisioning" status */}
           <CircularProgress size={60} sx={{ mb: 4 }} />
           <Typography variant="h4" fontWeight="bold" gutterBottom color="text.primary">
             Finalising...
           </Typography>
           <Typography variant="body1" color="text.secondary">
             Creating your dashboard.
           </Typography>
         </>
       )}
    </Box>
  );
}
