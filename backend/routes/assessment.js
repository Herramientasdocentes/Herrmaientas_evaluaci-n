const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createAssessment, getAssessments } = require('../controllers/assessmentController');

// @route   POST api/assessment
// @desc    Crear una nueva evaluación
// @access  Private
router.post('/', auth, createAssessment);

// @route   GET api/assessment/mis-evaluaciones
// @desc    Obtener las evaluaciones del usuario
// @access  Private
router.get('/mis-evaluaciones', auth, getAssessments);

module.exports = router;