"use client";

import { useState } from "react";
import { useCatalogQuery } from "@/hooks/queries/useOnboarding";
import { OnboardingData } from "../OnboardingWizard";
import { ModuleItem, PackageItem } from "@/lib/api/types/onboarding.types";
import { 
  Box, Typography, Button, Tabs, Tab, Card, CardContent, 
  CardActionArea, CircularProgress, Chip, IconButton 
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import ScienceIcon from "@mui/icons-material/Science";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";

interface Props {
  onNext: () => void;
  onBack: () => void;
  updateData: (data: Partial<OnboardingData>) => void;
  data: OnboardingData;
}

export function ModuleCatalogSelection({ onNext, onBack, updateData, data }: Props) {
  const { data: catalog, isLoading, error } = useCatalogQuery();

  const [selectionTab, setSelectionTab] = useState(0); // 0 = Packages, 1 = Modules
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");

  if (isLoading) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" py={8} className="animate-fade-in">
        <CircularProgress size={48} sx={{ mb: 2 }} />
        <Typography color="text.secondary">Loading catalog...</Typography>
      </Box>
    );
  }

  if (error || !catalog) {
    return (
      <Box py={8} textAlign="center">
        <Typography color="error">Failed to load catalog. Please try again.</Typography>
      </Box>
    );
  }

  const { packages, modules } = catalog;

  const toggleModule = (slug: string) => {
    setSelectedModules((prev) =>
      prev.includes(slug) ? prev.filter((m) => m !== slug) : [...prev, slug]
    );
  };

  const handleCompleteSetup = () => {
    if (!data.verifiedToken || !data.orgName || !data.subdomain) {
      alert("Missing core identity details. Please go back.");
      return;
    }
    
    updateData({
      selectionType: selectionTab === 0 ? "package" : "individual",
      packageId: selectedPackage || undefined,
      selectedModules: selectedModules.length > 0 ? selectedModules : undefined,
      billingCycle,
    } as any);

    onNext();
  };

  const isNextDisabled = selectionTab === 0 ? !selectedPackage : selectedModules.length === 0;

  return (
    <Box className="animate-fade-up">
      <Box mb={2} display="flex" justifyContent="space-between" alignItems="flex-start">
        <Box>
          <Button
            onClick={onBack}
            startIcon={<ArrowBackIcon />}
            sx={{ mb: 1, color: "text.secondary", fontWeight: 500 }}
            size="small"
          >
            Back to Identity
          </Button>
          <Typography variant="h4" color="text.primary" gutterBottom>
            Select Modules
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Choose what tools your team needs to operate efficiently.
          </Typography>
        </Box>
        <Box bgcolor="background.default" p={0.5} borderRadius={2} display="flex" gap={0.5}>
          <Button
            size="small"
            variant={billingCycle === "monthly" ? "contained" : "text"}
            color={billingCycle === "monthly" ? "inherit" : "inherit"}
            onClick={() => setBillingCycle("monthly")}
            sx={{ 
              color: billingCycle === "monthly" ? "text.primary" : "text.secondary",
              bgcolor: billingCycle === "monthly" ? 'background.paper' : 'transparent',
              boxShadow: billingCycle === "monthly" ? 1 : 0
            }}
          >
            Monthly
          </Button>
          <Button
            size="small"
            variant={billingCycle === "yearly" ? "contained" : "text"}
            color={billingCycle === "yearly" ? "inherit" : "inherit"}
            onClick={() => setBillingCycle("yearly")}
            sx={{ 
              color: billingCycle === "yearly" ? "text.primary" : "text.secondary",
              bgcolor: billingCycle === "yearly" ? 'background.paper' : 'transparent',
              boxShadow: billingCycle === "yearly" ? 1 : 0
            }}
          >
            Yearly <Typography component="span" fontSize="0.7rem" color="success.main" fontWeight="bold" ml={0.5}>-20%</Typography>
          </Button>
        </Box>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs value={selectionTab} onChange={(_, val) => setSelectionTab(val)} textColor="primary" indicatorColor="primary">
          <Tab label="Packages (Save more)" sx={{ fontWeight: 600, textTransform: 'none', fontSize: '1rem' }} />
          <Tab label="Individual Modules" sx={{ fontWeight: 600, textTransform: 'none', fontSize: '1rem' }} />
        </Tabs>
      </Box>

      <Box sx={{ maxHeight: '55vh', overflowY: 'auto', pr: 1, pb: 2 }}>
        {selectionTab === 0 ? (
          <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }} gap={2}>
            {packages.map((pkg: PackageItem) => {
              const isSelected = selectedPackage === pkg._id;
              return (
                <Card 
                  key={pkg._id} 
                  sx={{ 
                    position: 'relative', 
                    cursor: 'pointer',
                    borderColor: isSelected ? 'primary.main' : 'divider',
                    bgcolor: isSelected ? 'primary.50' : 'background.paper',
                    borderWidth: isSelected ? 2 : 1
                  }}
                  onClick={() => setSelectedPackage(pkg._id)}
                >
                  <CardActionArea sx={{ height: '100%' }}>
                    <CardContent>
                      {pkg.badge && (
                        <Chip label={pkg.badge} color="primary" size="small" sx={{ position: 'absolute', top: 12, right: 12, fontWeight: 'bold' }} />
                      )}
                      <Typography variant="h6" fontWeight="bold" gutterBottom>{pkg.label}</Typography>
                      <Typography variant="body2" color="text.secondary" mb={2} minHeight={40}>{pkg.tagline}</Typography>
                      
                      <Box display="flex" alignItems="baseline" mb={0.5}>
                        <Typography variant="h4" fontWeight="900" color="text.primary">
                          ₹{billingCycle === "monthly" ? pkg.pricing.monthly : pkg.pricing.yearly}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" ml={0.5}>
                          /{billingCycle === "monthly" ? "mo" : "yr"}
                        </Typography>
                      </Box>
                      
                      {pkg.savings && billingCycle === "yearly" && (
                        <Chip label={pkg.savings} size="small" sx={{ bgcolor: '#DEF7EC', color: '#03543F', fontWeight: 'bold', mb: 2 }} />
                      )}

                      <Box borderTop={1} borderColor="divider" pt={2} mt={2}>
                        {pkg.modules.map((mSlug: string) => {
                          const mod = modules.find((m: ModuleItem) => m.slug === mSlug);
                          return (
                            <Typography key={mSlug} variant="body2" color="text.secondary" display="flex" alignItems="center" mb={1}>
                              <CheckCircleIcon color="primary" sx={{ fontSize: 18, mr: 1 }} />
                              {mod?.label || mSlug}
                            </Typography>
                          );
                        })}
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              );
            })}
          </Box>
        ) : (
          <Box display="flex" flexDirection="column" gap={2}>
            {modules.map((mod: ModuleItem) => {
              const isSelected = selectedModules.includes(mod.slug);
              return (
                <Card 
                  key={mod.slug}
                  sx={{ 
                    cursor: 'pointer',
                    borderColor: isSelected ? 'primary.main' : 'divider',
                    bgcolor: isSelected ? '#EEF2FF' : 'background.paper',
                    borderWidth: isSelected ? 2 : 1
                  }}
                  onClick={() => toggleModule(mod.slug)}
                >
                  <CardActionArea sx={{ p: 2 }}>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Box display="flex" alignItems="center" gap={2}>
                        <Box p={1} bgcolor={isSelected ? 'primary.main' : 'background.default'} borderRadius={2} color={isSelected ? 'white' : 'text.secondary'}>
                          {mod.icon === 'doctors' ? <LocalHospitalIcon /> : <ScienceIcon />}
                        </Box>
                        <Box>
                          <Typography variant="subtitle1" fontWeight="bold">{mod.label}</Typography>
                          <Typography variant="body2" color="text.secondary">{mod.description}</Typography>
                        </Box>
                      </Box>
                      <Box textAlign="right">
                        <Typography variant="h6" fontWeight="bold">
                          ₹{billingCycle === "monthly" ? mod.pricing.monthly : mod.pricing.yearly}
                          <Typography component="span" variant="caption" color="text.secondary">/{billingCycle === "monthly" ? "mo" : "yr"}</Typography>
                        </Typography>
                        {isSelected && <CheckCircleIcon color="primary" sx={{ mt: 0.5 }} />}
                      </Box>
                    </Box>
                  </CardActionArea>
                </Card>
              );
            })}
          </Box>
        )}
      </Box>

      <Box mt={3} pt={3} borderTop={1} borderColor="divider" display="flex" alignItems="center" justifyContent="space-between">
         <Typography variant="body2" color="text.secondary" fontWeight={500}>
           {selectionTab === 0 ? (
             selectedPackage ? "1 Package selected" : "Select a package"
           ) : (
             `${selectedModules.length} module${selectedModules.length !== 1 ? 's' : ''} selected`
           )}
         </Typography>
         <Button
            onClick={handleCompleteSetup}
            variant="contained"
            color="primary"
            size="large"
            disabled={isNextDisabled}
            endIcon={<WorkspacePremiumIcon />}
          >
            Continue to Payment
          </Button>
      </Box>
    </Box>
  );
}
