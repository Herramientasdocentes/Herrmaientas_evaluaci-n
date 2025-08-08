import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { Button, TextField, Box, Typography, Container } from '@mui/material';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/auth/forgot-password`, { email });
      toast.info('Si existe una cuenta con ese correo, se ha enviado un enlace para restablecer la contraseña.');
    } catch (error) {
      toast.error('Ocurrió un error. Por favor, inténtalo de nuevo.');
    }
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
        <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
          Recuperar Contraseña
        </Typography>
        <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 1, mb: 3 }}>
          Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
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
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Enviar Enlace de Recuperación
          </Button>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Button fullWidth>
              Volver a Iniciar Sesión
            </Button>
          </Link>
        </Box>
      </Box>
    </Container>
  );
}

export default ForgotPasswordPage;