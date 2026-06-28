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
      mode: 'dark',
      primary: {
        main: primaryColor,
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#94A3B8',
        light: '#CBD5E1',
        dark: '#64748B',
        contrastText: '#0F172A',
      },
      background: {
        default: '#0A1326', // stepper bar
        paper: '#0B1426', // content surface
      },
      text: {
        primary: '#F1F5F9',
        secondary: '#94A3B8',
      },
      divider: 'rgba(255,255,255,0.1)',
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
            borderRadius: 12,
            fontWeight: 600,
            boxShadow: 'none',
            transition: 'transform .2s ease, box-shadow .2s ease, background .2s ease',
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: `0 12px 26px -8px ${primaryColor}66`,
            },
            '&.Mui-disabled': { opacity: 0.45 },
          },
          containedPrimary: {
            backgroundImage: `linear-gradient(135deg, ${primaryColor} 0%, #0ea5e9 100%)`,
            '&:hover': {
              backgroundImage: `linear-gradient(135deg, ${primaryColor} 0%, #38bdf8 100%)`,
            },
          },
          sizeLarge: { padding: '14px 28px', fontSize: '1rem' },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            backgroundColor: 'rgba(255,255,255,0.04)',
            color: '#F1F5F9',
            transition: 'box-shadow .2s ease, background-color .2s ease',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(255,255,255,0.15)',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: primaryColor,
            },
            '&.Mui-focused': {
              backgroundColor: 'rgba(255,255,255,0.06)',
              boxShadow: `0 0 0 4px ${primaryColor}22`,
            },
          },
          input: { padding: '14px 14px' },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            backgroundImage: 'none',
            backgroundColor: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            transition: 'transform .2s ease, border-color .2s ease, box-shadow .2s ease',
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
            color: '#94A3B8',
            '&.Mui-selected': { color: '#F1F5F9' },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { fontWeight: 600 },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: '#94A3B8',
            '&.Mui-focused': { color: primaryColor },
          },
        },
      },
      MuiStepIcon: {
        styleOverrides: {
          root: {
            color: 'rgba(255,255,255,0.18)',
            '&.Mui-active': { color: primaryColor },
            '&.Mui-completed': { color: primaryColor },
            '& .MuiStepIcon-text': { fill: '#0B1426' },
          },
        },
      },
      MuiStepLabel: {
        styleOverrides: {
          label: {
            color: '#64748B',
            '&.Mui-active': { color: '#F1F5F9' },
            '&.Mui-completed': { color: '#CBD5E1' },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
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
