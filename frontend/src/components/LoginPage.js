
import React, { useState } from 'react';
import useStore from '../store';
import { toast } from 'react-toastify';
import { Avatar, Button, Box, Typography, Container, CircularProgress, TextField } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Link } from 'react-router-dom';

function LoginPage() {
  const setToken = useStore((state) => state.setToken);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const demoMode = process.env.REACT_APP_DEMO_MODE === 'true';

  const handleLogin = async () => {
    if (!demoMode) {
      toast.error('El modo demo no está habilitado. Contacta al administrador.');
      return;
    }
    setLoading(true);
    // Simulación de login para modo demo
    setTimeout(() => {
      setToken('demo-token');
      toast.success('¡Ingreso exitoso!');
      setLoading(false);
    }, 500);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          p: 4, // Padding
          boxShadow: 3, // Sombra suave
          borderRadius: 2, // Bordes redondeados
          bgcolor: 'background.paper', // Usa el color de fondo del tema
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
          Ingresar
        </Typography>
        {!demoMode && (
          <Typography color="error" sx={{ mt: 2, mb: 2 }}>
            El modo demo no está habilitado. Contacta al administrador.
          </Typography>
        )}
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Correo Electrónico"
          name="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading || !demoMode} // Deshabilitar si no es modo demo
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Contraseña"
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading || !demoMode} // Deshabilitar si no es modo demo
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          onClick={handleLogin}
          disabled={loading || !demoMode} // Deshabilitar si no es modo demo
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Ingresar'}
        </Button>
        <Link to="/forgot-password" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Typography variant="body2" color="primary">
            ¿Olvidaste tu contraseña?
          </Typography>
        </Link>
      </Box>
    </Container>
  );
}

export default LoginPage;
