// Middleware para validar datos de registro de usuario
function validateUser(req, res, next) {
  const { nombre, email, password, rol } = req.body;
  const errores = {};

  if (!nombre || typeof nombre !== 'string' || nombre.trim().length === 0) {
    errores.nombre = 'El nombre es obligatorio.';
  }
  if (!email || typeof email !== 'string' || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    errores.email = 'Correo electrónico inválido.';
  }
  if (!password || typeof password !== 'string' || password.length < 6) {
    errores.password = 'La contraseña debe tener al menos 6 caracteres.';
  }
  if (rol && !['docente', 'administrador'].includes(rol)) {
    errores.rol = 'Rol inválido.';
  }

  if (Object.keys(errores).length > 0) {
    return res.status(400).json({ errores });
  }
  next();
}

module.exports = validateUser;
