const express = require('express');
const router = express.Router();

// Ruta para obtener evaluaciones del usuario (demo)
router.get('/mis-evaluaciones', (req, res) => {
  // En modo demo, responde con datos simulados
  res.json({
    evaluaciones: [
      { id: 1, nombre: 'Evaluación Demo 1', fecha: '2025-07-30' },
      { id: 2, nombre: 'Evaluación Demo 2', fecha: '2025-07-29' }
    ]
  });
});

// Ruta de prueba para assessment
router.get('/', (req, res) => {
  res.send('Assessment route funcionando');
});

module.exports = router;
