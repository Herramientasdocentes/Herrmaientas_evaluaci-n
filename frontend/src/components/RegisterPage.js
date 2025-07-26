import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Avatar, Button, TextField, Box, Typography, Container } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function RegisterPage({ onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
  });

  const { nombre, email, password } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/auth/register`, { nombre, email, password });
      toast.success('¡Registro exitoso! Ahora puedes iniciar sesión.');
      onSwitchToLogin();
    } catch (error) {
      const msg = error.response?.data?.msg || 'Error en el registro.';
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
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <PersonAddIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Crear Cuenta
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="nombre"
            label="Nombre Completo"
            name="nombre"
            autoComplete="name"
            autoFocus
            value={nombre}
            onChange={onChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Correo Electrónico"
            name="email"
            autoComplete="email"
            value={email}
            onChange={onChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Contraseña"
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={onChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Registrarse
          </Button>
          <Button
            fullWidth
            onClick={onSwitchToLogin}
          >
            ¿Ya tienes una cuenta? Inicia sesión
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default RegisterPage;
