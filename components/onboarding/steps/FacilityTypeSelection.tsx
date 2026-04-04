"use client";

import { Box, Typography, Grid, Card, CardContent, CardActionArea } from "@mui/material";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import ApartmentIcon from "@mui/icons-material/Apartment";
import VisibilityIcon from "@mui/icons-material/Visibility";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import ScienceIcon from "@mui/icons-material/Science";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { OnboardingData } from "../OnboardingWizard";
import { FacilityType } from "@/lib/api/types/onboarding.types";

interface Props {
  onNext: () => void;
  updateData: (data: Partial<OnboardingData>) => void;
  data: OnboardingData;
}

const facilityTypes: { type: FacilityType; icon: any; title: string; description: string; color: string }[] = [
  {
    type: 'hospital',
    icon: <ApartmentIcon sx={{ fontSize: 40 }} />,
    title: 'Hospital',
    description: 'Multi-specialty facility with IPD, OPD, OT, and Ward management.',
    color: '#4F46E5', // Indigo
  },
  {
    type: 'clinic',
    icon: <LocalHospitalIcon sx={{ fontSize: 40 }} />,
    title: 'General Clinic',
    description: 'Private practice or polyclinic focused on outpatient care.',
    color: '#10B981', // Emerald
  },
  {
    type: 'eye',
    icon: <VisibilityIcon sx={{ fontSize: 40 }} />,
    title: 'Eye Hospital',
    description: 'Specialized eye care with Vision Testing, Refraction, and IOP.',
    color: '#0891B2', // Cyan
  },
  {
    type: 'dental',
    icon: <MedicalServicesIcon sx={{ fontSize: 40 }} />,
    title: 'Dental Clinic',
    description: 'Dentistry focused with Odontogram and Perio-charting tools.',
    color: '#0D9488', // Teal
  },
  {
    type: 'diagnostic',
    icon: <ScienceIcon sx={{ fontSize: 40 }} />,
    title: 'Diagnostic Center',
    description: 'Lab or Radiology center with LIS and automated reporting.',
    color: '#9333EA', // Purple
  },
];

export function FacilityTypeSelection({ onNext, updateData, data }: Props) {
  const handleSelect = (type: FacilityType) => {
    updateData({ facilityType: type });
    onNext();
  };

  return (
    <Box className="animate-fade-up">
      <Box mb={4}>
        <Typography variant="h4" color="text.primary" gutterBottom sx={{ fontWeight: 800 }}>
          Welcome to Kaero
        </Typography>
        <Typography variant="body1" color="text.secondary">
          What type of healthcare facility are you setting up today?
        </Typography>
      </Box>

      <Box 
        sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          gap: 3 
        }}
      >
        {facilityTypes.map((item) => (
          <Card 
            key={item.type} 
            sx={{ 
              border: data.facilityType === item.type ? `2px solid ${item.color}` : '1px solid #E5E7EB',
              bgcolor: data.facilityType === item.type ? `${item.color}05` : 'background.paper',
              '&:hover': {
                borderColor: item.color,
                transform: 'translateY(-2px)',
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
              }
            }}
          >
            <CardActionArea onClick={() => handleSelect(item.type)} sx={{ p: 1 }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: { xs: 2, sm: 3 } }}>
                <Box 
                  sx={{ 
                    p: { xs: 1.5, sm: 2 }, 
                    borderRadius: '16px', 
                    bgcolor: `${item.color}15`, 
                    color: item.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {item.icon}
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                    {item.description}
                  </Typography>
                </Box>
                <ArrowForwardIcon sx={{ color: 'text.disabled', display: { xs: 'none', sm: 'block' } }} />
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
