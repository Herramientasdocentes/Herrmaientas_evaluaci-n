import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, TextField, Box, Typography, Container } from '@mui/material';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/auth/reset-password/${token}`, { password });
      toast.success('¡Contraseña restablecida con éxito! Ahora puedes iniciar sesión.');
      navigate('/');
    } catch (error) {
      const msg = error.response?.data?.msg || 'El enlace no es válido o ha expirado.';
      toast.error(msg);
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
          Crear Nueva Contraseña
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Nueva Contraseña"
            type="password"
            id="password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Guardar Nueva Contraseña
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default ResetPasswordPage;