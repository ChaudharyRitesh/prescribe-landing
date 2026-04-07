"use client";

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ReactNode } from 'react';
import CssBaseline from '@mui/material/CssBaseline';

const getKaeroTheme = (type?: string) => {
  let primaryColor = '#4F46E5'; // Default Hospital (Indigo)
  
  if (type === 'clinic') primaryColor = '#10B981'; // Emerald
  if (type === 'eye') primaryColor = '#0891B2'; // Cyan
  if (type === 'dental') primaryColor = '#0D9488'; // Teal
  if (type === 'diagnostic') primaryColor = '#9333EA'; // Purple

  return createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: primaryColor,
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#64748B', 
        light: '#94A3B8',
        dark: '#475569',
        contrastText: '#ffffff',
      },
      background: {
        default: '#F9FAFB', 
        paper: '#FFFFFF',
      },
      text: {
        primary: '#111827',
        secondary: '#4B5563',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h3: { fontWeight: 800, letterSpacing: '-0.02em' },
      h4: { fontWeight: 700, letterSpacing: '-0.01em' },
      button: { textTransform: 'none', fontWeight: 600 },
    },
    shape: { borderRadius: 12 },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            padding: '12px 24px',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: `0 4px 14px 0 ${primaryColor}40`,
            },
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: primaryColor,
            },
          },
        },
      },
      MuiStepIcon: {
        styleOverrides: {
          root: {
            color: '#CBD5E1',
            '&.Mui-active': { color: primaryColor },
            '&.Mui-completed': { color: primaryColor },
          },
        },
      },
    },
  });
};

export function OnboardingThemeProvider({ children, facilityType }: { children: ReactNode, facilityType?: string }) {
  const theme = getKaeroTheme(facilityType);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
