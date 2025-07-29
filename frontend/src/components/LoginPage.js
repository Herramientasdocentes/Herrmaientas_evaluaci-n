import React, { useState } from 'react';
import axios from 'axios';
import useStore from '../store';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { Avatar, Button, TextField, Box, Typography, Container, Grid, CircularProgress } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function LoginPage({ onSwitchToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const setToken = useStore((state) => state.setToken);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, { email, password });
      toast.success('¡Inicio de sesión exitoso!');
      setToken(response.data.token);
    } catch (error) {
      toast.error('Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Iniciar Sesión
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField margin="normal" required fullWidth id="email" label="Correo Electrónico" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <TextField margin="normal" required fullWidth name="password" label="Contraseña" type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Entrar'}
          </Button>
          <Grid container>
            <Grid item xs>
              <Button component={Link} to="/forgot-password" size="small" disabled={loading}>
                ¿Olvidaste tu contraseña?
              </Button>
            </Grid>
            <Grid item>
              <Button onClick={onSwitchToRegister} size="small" disabled={loading}>
                ¿No tienes una cuenta? Regístrate
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default LoginPage;
