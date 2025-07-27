const express = require('express');
const router = express.Router();

// Ruta de prueba para questions
router.get('/', (req, res) => {
  res.send('Questions route funcionando');
});

module.exports = router;
