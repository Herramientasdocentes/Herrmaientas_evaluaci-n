// Middleware para manejo centralizado de errores
function errorHandler(err, req, res, next) {
  console.error('Error:', err.message);
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message, details: err.errors });
  }
  res.status(500).json({ error: 'Error interno del servidor' });
}

module.exports = errorHandler;
