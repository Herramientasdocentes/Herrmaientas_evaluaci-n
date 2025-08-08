const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middleware/auth');
const { createQuestion, updateQuestion, getQuestions, deleteQuestion, importQuestions } = require('../controllers/questionController');
const multer = require('multer');

// Configuración de Multer para la carga de archivos
const upload = multer({ storage: multer.memoryStorage() });

// Validaciones comunes para preguntas
const questionValidation = [
  check('pregunta', 'La pregunta es obligatoria').not().isEmpty(),
  check('opcionA', 'La opción A es obligatoria').not().isEmpty(),
  check('opcionB', 'La opción B es obligatoria').not().isEmpty(),
  check('opcionC', 'La opción C es obligatoria').not().isEmpty(),
  check('opcionD', 'La opción D es obligatoria').not().isEmpty(),
  check('respuestaCorrecta', 'La respuesta correcta es obligatoria').isIn(['A', 'B', 'C', 'D']),
  check('puntaje', 'El puntaje es obligatorio y debe ser un número').isNumeric(),
  check('oa', 'El Objetivo de Aprendizaje (OA) es obligatorio').not().isEmpty(),
];

// @route   POST api/questions
// @desc    Crear una nueva pregunta
// @access  Private
router.post('/', auth, questionValidation, createQuestion);

// @route   PUT api/questions/:id
// @desc    Actualizar una pregunta existente
// @access  Private
router.put('/:id', auth, questionValidation, updateQuestion);

// @route   GET /api/questions
// @desc    Obtener preguntas, con opción de filtrar y paginar
// @access  Private
router.get('/', auth, getQuestions);

// @route   DELETE /api/questions/:id
// @desc    Eliminar una pregunta
// @access  Private
router.delete('/:id', auth, deleteQuestion);

// @route   POST /api/questions/import
// @desc    Importar preguntas desde CSV o JSON
// @access  Private
router.post('/import', auth, upload.single('file'), importQuestions);

module.exports = router;
