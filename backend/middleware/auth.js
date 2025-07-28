const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // 1. Obtener el token del encabezado de la solicitud
  const token = req.header('x-auth-token');

  // 2. Verificar si no hay token
  if (!token) {
    return res.status(401).json({ msg: 'No hay token, permiso denegado.' });
  }

  // 3. Si hay token, verificarlo
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Usamos el mismo secreto que en el login

    // Si el token es válido, extraemos el usuario y lo añadimos a la solicitud
    req.user = decoded.user;
    next(); // Le damos paso para que continúe a la ruta principal
  } catch (err) {
    res.status(401).json({ msg: 'El token no es válido.' });
  }
};
