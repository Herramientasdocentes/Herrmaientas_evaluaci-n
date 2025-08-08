const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createAssessment, getAssessments, deleteAssessment, updateAssessment } = require('../controllers/assessmentController');

// @route   POST api/assessment
// @desc    Crear una nueva evaluación
// @access  Private
router.post('/', auth, createAssessment);

// @route   GET api/assessment/mis-evaluaciones
// @desc    Obtener las evaluaciones del usuario
// @access  Private
router.get('/mis-evaluaciones', auth, getAssessments);

// @route   DELETE api/assessment/:id
// @desc    Eliminar una evaluación por ID
// @access  Private
router.delete('/:id', auth, deleteAssessment);

// @route   PUT api/assessment/:id
// @desc    Actualizar una evaluación por ID
// @access  Private
router.put('/:id', auth, updateAssessment);

module.exports = router;
