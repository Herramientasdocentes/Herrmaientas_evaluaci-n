const express = require('express');
const router = express.Router();

// Ruta demo para /api/banco
router.get('/', (req, res) => {
  res.json({
    bancos: [
      { id: 1, nombre: 'Banco Demo 1', descripcion: 'Banco de preguntas de ejemplo' },
      { id: 2, nombre: 'Banco Demo 2', descripcion: 'Otro banco de preguntas' }
    ]
  });
});

module.exports = router;
