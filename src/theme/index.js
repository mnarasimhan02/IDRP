import { createTheme } from '@mui/material/styles';

// Create a custom theme with IDRP colors
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Blue for primary actions
      light: '#4791db',
      dark: '#115293',
    },
    secondary: {
      main: '#f50057', // Pink for secondary actions
      light: '#f73378',
      dark: '#ab003c',
    },
    status: {
      draft: '#ff9800', // Orange for Draft status
      inReview: '#2196f3', // Blue for In-Review status
      approved: '#4caf50', // Green for Approved status
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        },
      },
    },
  },
});

export default theme;
