const express = require('express');
const router = express.Router();

// Ruta de prueba para auth
router.get('/', (req, res) => {
  res.send('Auth route funcionando');
});

module.exports = router;
