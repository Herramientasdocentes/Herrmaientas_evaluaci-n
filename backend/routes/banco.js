const express = require('express');
const router = express.Router();

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Question = require('../models/Question');

// @route   GET api/banco
// @desc    Obtener una lista de todos los Objetivos de Aprendizaje (OAs) únicos
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // Usamos .distinct() para obtener un array de valores únicos del campo 'oa'
    const oas = await Question.distinct('oa');
    
    // Mapeamos el resultado al formato que el frontend espera (id, name)
    const bancos = oas.map((oa, index) => ({
      id: oa, // Usamos el mismo OA como ID
      name: `OA: ${oa}` // Le damos un nombre más descriptivo
    }));

    res.json(bancos);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del Servidor');
  }
});

module.exports = router;
