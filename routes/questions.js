const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Question = require('../models/Question');

// @route   GET /api/questions
// @desc    Obtener preguntas, con opción de filtrar
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const filter = {};
    if (req.query.oa) filter.oa = req.query.oa;
    if (req.query.dificultad) filter.dificultad = req.query.dificultad;
    if (req.query.habilidad) filter.habilidad = req.query.habilidad;
    const questions = await Question.find(filter).sort({ fechaCreacion: -1 });
    res.json(questions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del Servidor');
  }
});

// @route   POST /api/questions
// @desc    Crear una nueva pregunta en el banco
// @access  Private
router.post('/', auth, async (req, res) => {
  const { pregunta, opcionA, opcionB, opcionC, opcionD, respuestaCorrecta, puntaje, oa, indicador, habilidad, dificultad } = req.body;
  try {
    const newQuestion = new Question({
      pregunta,
      opcionA,
      opcionB,
      opcionC,
      opcionD,
      respuestaCorrecta,
      puntaje,
      oa,
      indicador,
      habilidad,
      dificultad,
      creador: req.user.id
    });
    const question = await newQuestion.save();
    res.status(201).json(question);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del Servidor');
  }
});

// @route   PUT /api/questions/:id
// @desc    Actualizar una pregunta existente
// @access  Private

// @route   PUT /api/questions/:id
// @desc    Actualizar una pregunta existente
// @access  Private
router.put('/:id', auth, async (req, res) => {
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

    // Actualizamos el documento con los nuevos datos del req.body
    const updatedQuestion = await Question.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json(updatedQuestion);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del Servidor');
  }
});

// @route   DELETE /api/questions/:id
// @desc    Eliminar una pregunta
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  // Aquí iría la lógica para encontrar una pregunta por su ID y eliminarla.
  // También se debe verificar la propiedad.
  res.send(`Lógica para eliminar la pregunta ${req.params.id} irá aquí.`);
});

module.exports = router;
