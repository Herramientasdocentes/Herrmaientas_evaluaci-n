import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#673ab7', // Un púrpura suave
    },
    secondary: {
      main: '#00bcd4', // Un cian suave
    },
    background: {
      default: '#f4f6f8', // Un gris muy claro para el fondo general
      paper: '#ffffff', // Blanco para el fondo de los componentes (tarjetas, etc.)
    },
    text: {
      primary: '#333333', // Gris oscuro para texto principal
      secondary: '#666666', // Gris medio para texto secundario
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h5: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Bordes ligeramente redondeados para botones
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12, // Bordes más redondeados para tarjetas/papel
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)', // Sombra suave
        },
      },
    },
  },
});

export default theme;
