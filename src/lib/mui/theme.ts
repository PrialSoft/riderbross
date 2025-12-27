import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#8B1A1A', // Rojo profundo de las alas del logo
      dark: '#6B1414',
      light: '#A52A2A',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#2C3E50', // Azul-gris oscuro del fondo del logo
      light: '#34495E',
      dark: '#1E2A35',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#040017',
      paper: 'rgba(255, 255, 255, 0.05)',
    },
    text: {
      primary: '#FFFFFF',
      secondary: 'rgba(255, 255, 255, 0.8)',
    },
    mode: 'dark',
  },
  typography: {
    fontFamily: 'var(--font-family-body)',
    h1: {
      fontFamily: 'var(--font-family-headings)',
      fontWeight: 400,
      fontSize: '2.5rem',
      letterSpacing: '0.02em',
      '@media (max-width:600px)': {
        fontSize: '2rem',
      },
    },
    h2: {
      fontFamily: 'var(--font-family-headings)',
      fontWeight: 400,
      fontSize: '2rem',
      letterSpacing: '0.02em',
      '@media (max-width:600px)': {
        fontSize: '1.5rem',
      },
    },
    h3: {
      fontFamily: 'var(--font-family-headings)',
      fontWeight: 400,
      fontSize: '1.5rem',
      letterSpacing: '0.02em',
      '@media (max-width:600px)': {
        fontSize: '1.25rem',
      },
    },
    h4: {
      fontFamily: 'var(--font-family-headings)',
      fontWeight: 400,
      fontSize: '1.25rem',
      letterSpacing: '0.02em',
    },
    h5: {
      fontFamily: 'var(--font-family-headings)',
      fontWeight: 400,
      fontSize: '1.125rem',
      letterSpacing: '0.02em',
    },
    h6: {
      fontFamily: 'var(--font-family-headings)',
      fontWeight: 400,
      fontSize: '1rem',
      letterSpacing: '0.02em',
    },
    body1: {
      fontFamily: 'var(--font-family-body)',
    },
    body2: {
      fontFamily: 'var(--font-family-body)',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      fontFamily: 'var(--font-family-body)',
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          padding: '10px 24px',
          fontSize: '1rem',
        },
        contained: {
          boxShadow: 'var(--shadow-md)',
          transition: 'background-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease',
          '&:hover': {
            boxShadow: 'var(--shadow-lg)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: 'var(--shadow-md)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
          },
        },
      },
    },
  },
});

