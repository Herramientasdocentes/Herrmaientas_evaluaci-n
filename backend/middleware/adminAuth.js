module.exports = function (req, res, next) {
  // Asume que el middleware de autenticación (auth.js) ya se ejecutó
  // y que req.user contiene la información del usuario (incluido el rol).
  if (!req.user || req.user.rol !== 'administrador') {
    return res.status(403).json({ msg: 'Acceso denegado. Se requiere rol de administrador.' });
  }
  next();
};
