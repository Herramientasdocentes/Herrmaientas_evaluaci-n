const express = require('express');
const router = express.Router();

// Ruta de prueba para assessment
router.get('/', (req, res) => {
  res.send('Assessment route funcionando');
});

module.exports = router;
