"use client";

import { Box, Typography, Grid, Card, CardContent, CardActionArea } from "@mui/material";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import ApartmentIcon from "@mui/icons-material/Apartment";
import VisibilityIcon from "@mui/icons-material/Visibility";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import ScienceIcon from "@mui/icons-material/Science";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
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
    icon: <ApartmentIcon sx={{ fontSize: 26 }} />,
    title: 'Hospital',
    description: 'Multi-specialty facility with IPD, OPD, OT, and Ward management.',
    color: '#4F46E5', // Indigo
  },
  {
    type: 'clinic',
    icon: <LocalHospitalIcon sx={{ fontSize: 26 }} />,
    title: 'General Clinic',
    description: 'Private practice or polyclinic focused on outpatient care.',
    color: '#10B981', // Emerald
  },
  {
    type: 'eye',
    icon: <VisibilityIcon sx={{ fontSize: 26 }} />,
    title: 'Eye Hospital',
    description: 'Specialized eye care with Vision Testing, Refraction, and IOP.',
    color: '#0891B2', // Cyan
  },
  {
    type: 'dental',
    icon: <MedicalServicesIcon sx={{ fontSize: 26 }} />,
    title: 'Dental Clinic',
    description: 'Dentistry focused with Odontogram and Perio-charting tools.',
    color: '#0D9488', // Teal
  },
  {
    type: 'diagnostic',
    icon: <ScienceIcon sx={{ fontSize: 26 }} />,
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
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
          gap: 2.5,
        }}
      >
        {facilityTypes.map((item) => {
          const selected = data.facilityType === item.type;
          return (
            <Card
              key={item.type}
              sx={{
                position: 'relative',
                borderRadius: '18px',
                border: selected ? `2px solid ${item.color}` : '1px solid rgba(255,255,255,0.1)',
                bgcolor: selected ? `${item.color}1f` : 'rgba(255,255,255,0.03)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: item.color,
                  transform: 'translateY(-3px)',
                  boxShadow: `0 16px 38px -12px ${item.color}66`,
                },
              }}
            >
              <CardActionArea
                onClick={() => handleSelect(item.type)}
                sx={{ p: 2.75, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
              >
                {selected && (
                  <CheckCircleIcon
                    sx={{ position: 'absolute', top: 14, right: 14, color: item.color, fontSize: 22 }}
                  />
                )}
                <Box
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: `${item.color}26`,
                    color: item.color,
                    border: `1px solid ${item.color}40`,
                    mb: 2,
                  }}
                >
                  {item.icon}
                </Box>
                <Typography sx={{ fontWeight: 700, color: 'text.primary', fontSize: '1.05rem', lineHeight: 1.3 }}>
                  {item.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.75, fontSize: '0.82rem', lineHeight: 1.55 }}
                >
                  {item.description}
                </Typography>
              </CardActionArea>
            </Card>
          );
        })}
      </Box>
    </Box>
  );
}
