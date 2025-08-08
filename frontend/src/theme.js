import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#7E57C2', // Un púrpura más suave y amigable
      light: '#B39DDB',
      dark: '#5E35B1',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#4DD0E1', // Un cian/azul claro y refrescante
      light: '#88FFFF',
      dark: '#00ACC1',
      contrastText: '#ffffff',
    },
    background: {
      default: '#F5F7FA', // Un gris muy claro, casi blanco, para el fondo general
      paper: '#FFFFFF', // Blanco puro para el fondo de los componentes (tarjetas, etc.)
    },
    text: {
      primary: '#37474F', // Gris azulado oscuro para texto principal
      secondary: '#607D8B', // Gris azulado medio para texto secundario
    },
    error: {
      main: '#EF5350',
    },
    warning: {
      main: '#FFCA28',
    },
    info: {
      main: '#29B6F6',
    },
    success: {
      main: '#66BB6A',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      color: '#37474F',
    },
    h5: {
      fontWeight: 600,
      color: '#37474F',
    },
    h6: {
      fontWeight: 500,
      color: '#37474F',
    },
    body1: {
      fontSize: '1rem',
      color: '#607D8B',
    },
    body2: {
      fontSize: '0.875rem',
      color: '#78909C',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        containedPrimary: {
          backgroundColor: '#7E57C2',
          '&:hover': {
            backgroundColor: '#673AB7',
          },
        },
        outlinedPrimary: {
          borderColor: '#7E57C2',
          color: '#7E57C2',
          '&:hover': {
            backgroundColor: 'rgba(126, 87, 194, 0.04)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)', // Sombra más pronunciada pero suave
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.04)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#F0F4F8', // Un gris muy claro para los encabezados de tabla
        },
      },
    },
  },
});

export default theme;