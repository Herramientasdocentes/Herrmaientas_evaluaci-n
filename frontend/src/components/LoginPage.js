
// ADVERTENCIA: Este componente permite el acceso sin validación de usuario.
// SOLO USAR EN ENTORNOS DE PRUEBA O DEMO. NUNCA EN PRODUCCIÓN REAL.
// Controlado por la variable de entorno REACT_APP_DEMO_MODE.
import React, { useState } from 'react';
import useStore from '../store';
import { toast } from 'react-toastify';
import { Avatar, Button, Box, Typography, Container, CircularProgress } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';


function LoginPage() {
  const setToken = useStore((state) => state.setToken);
  const [loading, setLoading] = useState(false);
  // Detecta modo demo por variable de entorno
  const demoMode = process.env.REACT_APP_DEMO_MODE === 'true';

  const handleLogin = () => {
    if (!demoMode) {
      toast.error('El modo demo no está habilitado. Contacta al administrador.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setToken('demo-token');
      toast.success('¡Ingreso exitoso!');
      setLoading(false);
    }, 500);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Ingresar
        </Typography>
        {!demoMode && (
          <Typography color="error" sx={{ mt: 2, mb: 2 }}>
            El modo demo no está habilitado. Contacta al administrador.
          </Typography>
        )}
        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Ingresar'}
        </Button>
      </Box>
    </Container>
  );
}

export default LoginPage;
