"use client";

import { useState, useEffect } from "react";
import { Box, Stepper, Step, StepLabel, Typography, useMediaQuery, useTheme } from "@mui/material";
import { OnboardingThemeProvider } from "./OnboardingThemeProvider";
import { LavaLampBackground } from "./LavaLampBackground";
import { FacilityTypeSelection } from "./steps/FacilityTypeSelection";
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
  contactName?: string;
  contactPhone?: string;
  referralCode?: string;
  gstNumber?: string;
  facilityType?: string;
  selectionType?: 'package' | 'individual';
  packageId?: string;
  selectedModules?: string[];
  billingCycle?: 'monthly' | 'yearly';
  address?: {
    building?: string;
    street?: string;
    city?: string;
    district?: string;
    state?: string;
    postalCode?: string;
  };
};

const steps = [
  "Facility Type",
  "Email Entry",
  "Verification",
  "Organization Identity",
  "Modules & Services",
  "Review & Payment",
  "Onboarding Complete",
];

interface OnboardingWizardProps {
  externalData?: OnboardingData;
  externalUpdateData?: (newData: Partial<OnboardingData>) => void;
}

export function OnboardingWizard({ externalData, externalUpdateData }: OnboardingWizardProps) {
  const [activeStep, setActiveStep] = useState(0);
  
  // Use external data if provided, otherwise fallback to local (though page should provide it)
  const [localData, setLocalData] = useState<OnboardingData>({});
  
  const data = externalData || localData;
  const updateData = externalUpdateData || ((newData: Partial<OnboardingData>) => setLocalData(prev => ({ ...prev, ...newData })));

  const theme = useTheme();

  const nextStep = () => setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setActiveStep((prev) => Math.max(prev - 1, 0));

  // Render the appropriate step component
  const renderStepContent = (stepIndex: number) => {
    switch (stepIndex) {
      case 0:
        return <FacilityTypeSelection onNext={nextStep} updateData={updateData} data={data} />;
      case 1:
        return <EmailInitiation onNext={nextStep} updateData={updateData} data={data} />;
      case 2:
        return <OtpVerification onNext={nextStep} onBack={prevStep} updateData={updateData} data={data} />;
      case 3:
        return <OrganizationDetails onNext={nextStep} onBack={prevStep} updateData={updateData} data={data} />;
      case 4:
        return <ModuleCatalogSelection onNext={nextStep} onBack={prevStep} updateData={updateData} data={data} />;
      case 5:
        return <FinalReviewAndPayment onNext={nextStep} onBack={prevStep} updateData={updateData} data={data} />;
      case 6:
        return <ProvisioningStatus data={data} />;
      default:
        return <Typography>Unknown step Index</Typography>;
    }
  };

  return (
    <Box sx={{ position: 'relative', zIndex: 1, display: "flex", flexDirection: "column", minHeight: 600 }}>
      {/* Top Progress Tracker */}
      <Box 
        sx={{ 
          width: "100%", 
          bgcolor: "background.default", 
          p: { xs: 3, md: 4 },
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
          <Stepper activeStep={activeStep} orientation="horizontal" alternativeLabel sx={{ '& .MuiStepConnector-line': { minHeight: 0 } }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel 
                  sx={{
                    '& .MuiStepLabel-label': {
                      typography: 'caption',
                      fontWeight: 600,
                      display: { xs: 'none', md: 'block' }
                    }
                  }}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
      </Box>

      {/* Main Content Area */}
      <Box sx={{ flexGrow: 1, p: { xs: 4, md: 8 }, display: 'flex', flexDirection: 'column', justifyContent: 'center', bgcolor: 'background.paper' }}>
        <Box sx={{ maxWidth: 900, width: '100%', mx: 'auto' }}>
          {renderStepContent(activeStep)}
        </Box>
      </Box>
    </Box>
  );
}
