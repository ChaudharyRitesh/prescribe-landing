"use client";

import { useState, useEffect } from "react";
import { Box, Stepper, Step, StepLabel, Typography, useMediaQuery, useTheme } from "@mui/material";
import { EmailInitiation } from "./steps/EmailInitiation";
import { OtpVerification } from "./steps/OtpVerification";
import { OrganizationDetails } from "./steps/OrganizationDetails";
import { ModuleCatalogSelection } from "./steps/ModuleCatalogSelection";
import { FinalReviewAndPayment } from "./steps/FinalReviewAndPayment";
import { ProvisioningStatus } from "./steps/ProvisioningStatus";

export type OnboardingData = {
  sessionId?: string;
  verifiedToken?: string;
  email?: string;
  subdomain?: string;
  orgName?: string;
  referralCode?: string;
  // more properties can be added here
};

const steps = [
  "Email Entry",
  "Verification",
  "Organization Identity",
  "Modules & Services",
  "Review & Payment",
  "Onboarding Complete",
];

export function OnboardingWizard() {
  const [activeStep, setActiveStep] = useState(0);
  const [data, setData] = useState<OnboardingData>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("kaero_onboarding_session");
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });
  
  const theme = useTheme();

  // Sync with localStorage whenever data changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("kaero_onboarding_session", JSON.stringify(data));
    }
  }, [data]);

  const updateData = (newData: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...newData }));
  };

  const nextStep = () => setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setActiveStep((prev) => Math.max(prev - 1, 0));

  // Render the appropriate step component
  const renderStepContent = (stepIndex: number) => {
    switch (stepIndex) {
      case 0:
        return <EmailInitiation onNext={nextStep} updateData={updateData} data={data} />;
      case 1:
        return <OtpVerification onNext={nextStep} onBack={prevStep} updateData={updateData} data={data} />;
      case 2:
        return <OrganizationDetails onNext={nextStep} onBack={prevStep} updateData={updateData} data={data} />;
      case 3:
        return <ModuleCatalogSelection onNext={nextStep} onBack={prevStep} updateData={updateData} data={data} />;
      case 4:
        return <FinalReviewAndPayment onNext={nextStep} onBack={prevStep} updateData={updateData} data={data} />;
      case 5:
        return <ProvisioningStatus data={data} />;
      default:
        return <Typography>Unknown step Index</Typography>;
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, minHeight: 600 }}>
      {/* Sidebar / Progress Tracker */}
      <Box 
        sx={{ 
          width: { xs: "100%", md: "35%" }, 
          bgcolor: "background.default", 
          p: { xs: 4, md: 6 },
          borderRight: { xs: 'none', md: '1px solid' },
          borderBottom: { xs: '1px solid', md: 'none' },
          borderColor: 'divider',
        }}
      >
        <Typography variant="h5" sx={{ mb: 4, fontWeight: 700, color: 'text.primary' }}>
          Setup Progress
        </Typography>
        <Stepper activeStep={activeStep} orientation="vertical" sx={{ '& .MuiStepConnector-line': { minHeight: 40 } }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel 
                sx={{
                  '& .MuiStepLabel-label': {
                    typography: 'subtitle1',
                    fontWeight: 600,
                  }
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {/* Main Content Area */}
      <Box sx={{ width: { xs: "100%", md: "65%" }, p: { xs: 4, md: 8 }, display: 'flex', flexDirection: 'column', justifyContent: 'center', bgcolor: 'background.paper' }}>
        <Box sx={{ maxWidth: 480, width: '100%', mx: 'auto' }}>
          {renderStepContent(activeStep)}
        </Box>
      </Box>
    </Box>
  );
}
