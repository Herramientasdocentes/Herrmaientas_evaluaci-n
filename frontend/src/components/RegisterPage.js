import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Avatar, Button, TextField, Box, Typography, Container, CircularProgress } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

/**
 * Componente de registro de usuario
 * Valida entradas en frontend y maneja errores del backend
 * @param {Object} props
 * @param {Function} props.onSwitchToLogin - Función para cambiar a la vista de login
 */
function RegisterPage({ onSwitchToLogin }) {
  const [formData, setFormData] = useState({ nombre: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { nombre, email, password } = formData;

  /**
   * Valida los datos del formulario antes de enviar
   * @returns {boolean} true si los datos son válidos
   */
  const validate = () => {
    let tempErrors = {};
    if (!nombre) tempErrors.nombre = "El nombre es requerido.";
    if (!email) {
      tempErrors.email = "El correo es requerido.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = "El formato del correo no es válido.";
    }
    if (!password) {
      tempErrors.password = "La contraseña es requerida.";
    } else if (password.length < 6) {
      tempErrors.password = "La contraseña debe tener al menos 6 caracteres.";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  /**
   * Maneja el cambio de los campos del formulario
   * @param {Object} e - Evento de cambio
   */
  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  /**
   * Envía el formulario al backend si los datos son válidos
   * Muestra mensajes claros de error en caso de fallo
   * @param {Object} e - Evento de submit
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setLoading(true);
      try {
        await axios.post(`${API_URL}/api/auth/register`, { nombre, email, password });
        toast.success('¡Registro exitoso! Ahora puedes iniciar sesión.');
        onSwitchToLogin();
      } catch (error) {
        const msg = error.response?.data?.msg || 'Error en el registro.';
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}><PersonAddIcon /></Avatar>
        <Typography component="h1" variant="h5">Crear Cuenta</Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal" required fullWidth id="nombre" label="Nombre Completo" name="nombre" value={nombre} onChange={onChange}
            error={!!errors.nombre}
            helperText={errors.nombre}
          />
          <TextField
            margin="normal" required fullWidth id="email" label="Correo Electrónico" name="email" value={email} onChange={onChange}
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            margin="normal" required fullWidth name="password" label="Contraseña" type="password" id="password" value={password} onChange={onChange}
            error={!!errors.password}
            helperText={errors.password}
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={loading}>
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Registrarse'}
          </Button>
          <Button fullWidth onClick={onSwitchToLogin} disabled={loading}>
            ¿Ya tienes una cuenta? Inicia sesión
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

/**
 * Recomendaciones:
 * - Validar todos los campos obligatorios antes de enviar.
 * - Mostrar mensajes claros y amigables al usuario.
 * - Documentar cada función y componente.
 * - Manejar errores inesperados y mostrar un mensaje genérico si es necesario.
 */

export default RegisterPage;
