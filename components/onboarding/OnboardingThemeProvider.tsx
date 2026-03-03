"use client";

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ReactNode } from 'react';
import CssBaseline from '@mui/material/CssBaseline';

const kaeroTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#4F46E5', // 10% Accent (Indigo 600)
      light: '#818CF8',
      dark: '#3730A3',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#64748B', // 30% Secondary (Slate 500)
      light: '#94A3B8',
      dark: '#475569',
      contrastText: '#ffffff',
    },
    background: {
      default: '#F9FAFB', // 60% Dominant (Gray 50)
      paper: '#FFFFFF',
    },
    text: {
      primary: '#111827',
      secondary: '#4B5563',
    },
    success: {
      main: '#10B981',
    },
    error: {
      main: '#EF4444',
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h3: {
      fontWeight: 800,
      letterSpacing: '-0.02em',
    },
    h4: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '0.01em',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          padding: '12px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 14px 0 rgba(79, 70, 229, 0.39)',
          },
        },
        sizeLarge: {
          padding: '14px 28px',
          fontSize: '1.05rem',
        }
      },
      defaultProps: {
        disableElevation: true,
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: '#ffffff',
            transition: 'all 0.2s ease-in-out',
            '&:hover fieldset': {
              borderColor: '#818CF8',
            },
            '&.Mui-focused fieldset': {
              borderWidth: '2px',
            }
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
           boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
           border: '1px solid #E5E7EB',
           transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        }
      }
    },
    MuiStepIcon: {
      styleOverrides: {
        root: {
          color: '#CBD5E1', // slate-300
          '&.Mui-active': {
            color: '#4F46E5',
          },
          '&.Mui-completed': {
            color: '#4F46E5',
          },
        }
      }
    }
  },
});

export function OnboardingThemeProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={kaeroTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
