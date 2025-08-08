const express = require('express');
const router = express.Router();
const { generateQuestion, analyzeQuestion, generateRubric, adaptQuestionForNEE } = require('../controllers/geminiController');
const authMiddleware = require('../middleware/auth');

// @route   POST api/gemini/generate-question
// @desc    Generar una pregunta de evaluación con IA
// @access  Private
router.post('/generate-question', authMiddleware, generateQuestion);

// @route   POST api/gemini/analyze-question
// @desc    Analizar una pregunta de evaluación con IA
// @access  Private
router.post('/analyze-question', authMiddleware, analyzeQuestion);

// @route   POST api/gemini/generate-rubric
// @desc    Generar una rúbrica de evaluación con IA
// @access  Private
router.post('/generate-rubric', authMiddleware, generateRubric);

// @route   POST api/gemini/adapt-question
// @desc    Adaptar una pregunta para NEE con IA
// @access  Private
router.post('/adapt-question', authMiddleware, adaptQuestionForNEE);

module.exports = router;
