import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#b71c1c', // Rouge foncé
      light: '#f05545',
      dark: '#7f0000',
    },
    background: {
      default: '#181212', // Noir avec une pointe de rouge
      paper: '#221313',
    },
    error: {
      main: '#d32f2f',
    },
    warning: {
      main: '#ffa726',
    },
    success: {
      main: '#66bb6a',
      light: '#98ee99',
      dark: '#338a3e',  
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          background: 'rgba(40, 10, 10, 0.9)',
          border: '1px solid #b71c1c',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1a0a0a',
        },
      },
    },
  },
});

export default theme;
