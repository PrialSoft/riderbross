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
          transition: 'all 0.5s ease',
        },
        contained: {
          boxShadow: 'var(--shadow-md)',
          transition: 'all 0.5s ease',
          '&:hover': {
            boxShadow: 'var(--shadow-lg)',
            transform: 'translateY(-2px)',
          },
        },
        outlined: {
          transition: 'all 0.5s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
          },
        },
        text: {
          transition: 'all 0.5s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.5s ease',
          '&:hover': {
            transform: 'scale(1.1)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: 'var(--shadow-md)',
          transition: 'all 0.5s ease',
        },
      },
    },
    MuiCardActionArea: {
      styleOverrides: {
        root: {
          transition: 'all 0.5s ease',
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
    // Dropdowns (Select / Menu) - mejorar contraste y legibilidad (evitar "transparencia confusa")
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: 'rgba(4, 0, 23, 0.98)',
          border: '1px solid rgba(139, 26, 26, 0.35)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
          backdropFilter: 'blur(10px)',
        },
        list: {
          paddingTop: 6,
          paddingBottom: 6,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: '#FFFFFF',
          transition: 'background-color 0.2s ease, color 0.2s ease',
          '&.Mui-selected': {
            backgroundColor: 'rgba(139, 26, 26, 0.22)',
          },
          '&.Mui-selected:hover': {
            backgroundColor: 'rgba(139, 26, 26, 0.30)',
          },
          '&:hover': {
            backgroundColor: 'rgba(139, 26, 26, 0.18)',
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        icon: {
          color: 'rgba(255,255,255,0.85)',
        },
      },
    },
    // Autocomplete (usa Popper/Paper distinto a Menu): igualar estilo al combo de Vehículos
    MuiAutocomplete: {
      styleOverrides: {
        paper: {
          backgroundColor: 'rgba(4, 0, 23, 0.98)',
          border: '1px solid rgba(139, 26, 26, 0.35)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
          backdropFilter: 'blur(10px)',
        },
        groupLabel: {
          backgroundColor: 'rgba(4, 0, 23, 0.98)',
          color: 'rgba(255,255,255,0.85)',
        },
        groupUl: {
          padding: 0,
        },
        listbox: {
          paddingTop: 6,
          paddingBottom: 6,
          color: '#FFFFFF',
          '& .MuiAutocomplete-option': {
            transition: 'background-color 0.2s ease, color 0.2s ease',
            '&[aria-selected="true"]': {
              backgroundColor: 'rgba(139, 26, 26, 0.22)',
            },
            '&[aria-selected="true"].Mui-focused': {
              backgroundColor: 'rgba(139, 26, 26, 0.30)',
            },
            '&.Mui-focused': {
              backgroundColor: 'rgba(139, 26, 26, 0.18)',
            },
          },
          '&::-webkit-scrollbar': {
            width: 10,
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'rgba(255,255,255,0.06)',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(139, 26, 26, 0.55)',
            borderRadius: 10,
            border: '2px solid rgba(4,0,23,0.8)',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: 'rgba(139, 26, 26, 0.75)',
          },
        },
        popupIndicator: {
          color: 'rgba(255,255,255,0.85)',
        },
        clearIndicator: {
          color: 'rgba(255,255,255,0.85)',
        },
      },
    },
  },
});

