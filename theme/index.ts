'use client';

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#14B8A6',       // teal-500 — CTAs, active states
      light: '#2DD4BF',      // teal-400 — hover
      dark: '#0D9488',       // teal-600 — pressed / on-white text
      contrastText: '#0B1120',
    },
    secondary: {
      main: '#0F172A',       // slate-900 — headings, dark surfaces
      light: '#334155',      // slate-700
      dark: '#0B1120',
      contrastText: '#F1F5F9',
    },
    background: {
      default: '#F8FAFC',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#0F172A',
      secondary: '#475569',
      disabled: '#94A3B8',
    },
    success: { main: '#10B981' },
    warning: { main: '#F59E0B' },
    error: { main: '#EF4444' },
    info: { main: '#3B82F6' },
    divider: '#E2E8F0',
  },

  typography: {
    fontFamily: '"DM Sans", sans-serif',
    h1: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontWeight: 700,
      fontSize: 'clamp(1.75rem, 7vw, 3rem)',
      lineHeight: 1.2,
    },
    h2: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontWeight: 700,
      fontSize: '1.375rem',
    },
    h3: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontWeight: 600,
      fontSize: '1.0625rem',
    },
    h4: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontWeight: 600,
      fontSize: '0.9375rem',
    },
    body1: { fontSize: '0.9375rem', lineHeight: 1.65 },
    body2: { fontSize: '0.8125rem', lineHeight: 1.6 },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 500,
      letterSpacing: '0.06em',
      textTransform: 'uppercase' as const,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none' as const,
      letterSpacing: '0.01em',
    },
    overline: {
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: '0.6875rem',
      letterSpacing: '0.08em',
    },
  },

  shape: { borderRadius: 10 },

  breakpoints: {
    values: { xs: 0, sm: 390, md: 768, lg: 1024, xl: 1280 },
  },

  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 10,
          minHeight: 48,
          paddingInline: '1.5rem',
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none' },
          '&:active': { transform: 'scale(0.97)' },
        },
        containedPrimary: {
          background: '#14B8A6',
          color: '#0B1120',
          '&:hover': { background: '#0D9488' },
        },
        outlinedSecondary: {
          borderColor: 'rgba(255,255,255,0.2)',
          color: '#F1F5F9',
          '&:hover': {
            background: 'rgba(255,255,255,0.06)',
            borderColor: '#2DD4BF',
          },
        },
        sizeLarge: { minHeight: 52, fontSize: '1rem' },
      },
    },

    MuiTextField: {
      defaultProps: { variant: 'outlined' as const, fullWidth: true },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: '#F8FAFC',
            '& fieldset': { borderColor: '#CBD5E1', borderWidth: 1.5 },
            '&:hover fieldset': { borderColor: '#94A3B8' },
            '&.Mui-focused fieldset': { borderColor: '#14B8A6', borderWidth: 2 },
          },
          '& .MuiInputLabel-root.Mui-focused': { color: '#14B8A6' },
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: '1px solid #E2E8F0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 6, fontWeight: 500, fontSize: '0.75rem' },
        colorPrimary: { background: '#F0FDFA', color: '#0D9488' },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
        },
      },
    },

    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: '#0B1120',
          width: '100vw',
          borderRight: 'none',
        },
      },
    },

    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none' as const,
          fontWeight: 600,
          fontSize: '0.8125rem',
          minHeight: 40,
          borderRadius: 20,
          minWidth: 'auto',
          paddingLeft: 16,
          paddingRight: 16,
          '&.Mui-selected': { color: '#0B1120', background: '#14B8A6' },
        },
      },
    },

    MuiTabs: {
      styleOverrides: {
        root: { minHeight: 40 },
        indicator: { display: 'none' },
      },
    },

    MuiSkeleton: {
      styleOverrides: {
        root: { borderRadius: 8, background: '#E2E8F0' },
      },
    },

    MuiAccordion: {
      styleOverrides: {
        root: {
          background: 'transparent',
          boxShadow: 'none',
          '&:before': { display: 'none' },
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        },
      },
    },
  },
});

export default theme;
