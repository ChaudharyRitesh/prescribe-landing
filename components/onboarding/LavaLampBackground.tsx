"use client";

import { Box, useTheme } from "@mui/material";
import { keyframes } from "@emotion/react";
import { useEffect, useState } from "react";

const float = keyframes`
  0% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0, 0) scale(1); }
`;

const floatReverse = keyframes`
  0% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(-40px, 30px) scale(0.95); }
  66% { transform: translate(15px, -35px) scale(1.05); }
  100% { transform: translate(0, 0) scale(1); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.7; }
`;

interface Props {
  facilityType?: string;
}

export function LavaLampBackground({ facilityType }: Props) {
  const theme = useTheme();
  const [colors, setColors] = useState<string[]>(['#4F46E5', '#818CF8', '#C7D2FE']);

  useEffect(() => {
    switch (facilityType) {
      case 'clinic':
        setColors(['#10B981', '#34D399', '#A7F3D0']);
        break;
      case 'eye':
        setColors(['#0891B2', '#22D3EE', '#CFFAFE']);
        break;
      case 'dental':
        setColors(['#0D9488', '#2DD4BF', '#CCFBF1']);
        break;
      case 'diagnostic':
        setColors(['#9333EA', '#C084FC', '#F3E8FF']);
        break;
      default:
        setColors(['#4F46E5', '#818CF8', '#C7D2FE']);
    }
  }, [facilityType]);

  return (
    <Box 
      sx={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        zIndex: 0, 
        overflow: 'hidden',
        pointerEvents: 'none',
        bgcolor: '#F9FAFB',
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backdropFilter: 'blur(100px)',
          bgcolor: 'rgba(249, 250, 251, 0.5)',
          zIndex: 10
        }
      }}
    >
      {/* Dynamic Orbs */}
      <Box
        sx={{
          position: 'absolute',
          top: '-5%',
          left: '-5%',
          width: '30vw',
          height: '30vw',
          borderRadius: '50%',
          bgcolor: colors[0],
          animation: `${float} 18s infinite ease-in-out`,
          opacity: 0.5,
          filter: 'blur(80px)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '5%',
          right: '-5%',
          width: '25vw',
          height: '25vw',
          borderRadius: '50%',
          bgcolor: colors[1],
          animation: `${floatReverse} 22s infinite ease-in-out`,
          opacity: 0.4,
          filter: 'blur(70px)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '-10%',
          right: '5%',
          width: '35vw',
          height: '35vw',
          borderRadius: '50%',
          bgcolor: colors[2],
          animation: `${float} 25s infinite ease-in-out`,
          opacity: 0.5,
          filter: 'blur(90px)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '5%',
          left: '-10%',
          width: '30vw',
          height: '30vw',
          borderRadius: '50%',
          bgcolor: colors[0],
          animation: `${floatReverse} 20s infinite ease-in-out`,
          opacity: 0.4,
          filter: 'blur(100px)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '40%',
          left: '-15%',
          width: '20vw',
          height: '20vw',
          borderRadius: '50%',
          bgcolor: colors[1],
          animation: `${pulse} 15s infinite ease-in-out`,
          opacity: 0.3,
          filter: 'blur(60px)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '20%',
          right: '-10%',
          width: '25vw',
          height: '25vw',
          borderRadius: '50%',
          bgcolor: colors[2],
          animation: `${pulse} 12s infinite ease-in-out reverse`,
          opacity: 0.3,
          filter: 'blur(80px)',
        }}
      />
    </Box>
  );
}
