const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const auth = require('../middleware');


// @route   GET /api/questions
// @desc    Obtener preguntas, con opción de filtrar y paginar
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // Parámetros de paginación (con valores por defecto)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10; // Mostraremos 10 preguntas por página
    const skip = (page - 1) * limit;

    // Objeto de filtro dinámico (sin cambios)
    const filter = {};
    if (req.query.oa) filter.oa = req.query.oa;
    // ... otros filtros ...

    // Buscamos en la base de datos aplicando el filtro, la paginación y el orden
    const questions = await Question.find(filter)
      .sort({ fechaCreacion: -1 })
      .skip(skip)
      .limit(limit);
    
    // Contamos el número total de documentos que coinciden con el filtro (para calcular el total de páginas)
    const totalQuestions = await Question.countDocuments(filter);

    // Devolvemos tanto las preguntas de la página actual como la información de paginación
    res.json({
      questions,
      totalPages: Math.ceil(totalQuestions / limit),
      currentPage: page,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del Servidor');
  }
});

// @route   DELETE /api/questions/:id
// @desc    Eliminar una pregunta
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    // Si la pregunta no existe
    if (!question) {
      return res.status(404).json({ msg: 'Pregunta no encontrada' });
    }

    // Verificar que el usuario sea el dueño de la pregunta
    if (question.creador.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Usuario no autorizado' });
    }

    // Eliminar el documento
    await Question.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Pregunta eliminada exitosamente' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del Servidor');
  }
});

module.exports = router;
