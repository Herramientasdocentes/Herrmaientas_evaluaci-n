const express = require('express');
const router = express.Router();

// Ruta de prueba
router.get('/', (req, res) => {
  res.send('Assessment route working');
});

module.exports = router;
