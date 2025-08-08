const { validationResult } = require('express-validator');
const Question = require('../models/Question');
const csv = require('csv-parser');
const { Readable } = require('stream');

// @desc    Crear una nueva pregunta
// @route   POST /api/questions
// @access  Private
exports.createQuestion = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const newQuestion = new Question({
      ...req.body,
      creador: req.user.id, // Asignamos el creador a partir del token de autenticación
    });

    const question = await newQuestion.save();
    res.status(201).json(question);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del Servidor');
  }
};

// @desc    Actualizar una pregunta existente
// @route   PUT /api/questions/:id
// @access  Private
exports.updateQuestion = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    let question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ msg: 'Pregunta no encontrada' });
    }

    // Verificar que el usuario sea el dueño de la pregunta
    if (question.creador.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Usuario no autorizado' });
    }

    question = await Question.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.json(question);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del Servidor');
  }
};

// @desc    Obtener preguntas, con opción de filtrar y paginar
// @route   GET /api/questions
// @access  Private
exports.getQuestions = async (req, res) => {
  try {
    // Parámetros de paginación (con valores por defecto)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10; // Mostraremos 10 preguntas por página
    const skip = (page - 1) * limit;

    // Objeto de filtro dinámico
    const filter = {};
    if (req.query.oa) filter.oa = req.query.oa;
    if (req.query.habilidad) filter.habilidad = req.query.habilidad;
    if (req.query.dificultad) filter.dificultad = req.query.dificultad;
    // Add this line for question text search
    if (req.query.pregunta) {
      filter.pregunta = { $regex: req.query.pregunta, $options: 'i' };
    }

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
};

// @desc    Eliminar una pregunta
// @route   DELETE /api/questions/:id
// @access  Private
exports.deleteQuestion = async (req, res) => {
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
};

// @desc    Importar preguntas desde CSV o JSON
// @route   POST /api/questions/import
// @access  Private
exports.importQuestions = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ msg: 'No se ha subido ningún archivo.' });
  }

  const fileBuffer = req.file.buffer;
  const fileType = req.file.mimetype;
  const creatorId = req.user.id;
  const questionsToImport = [];

  try {
    if (fileType === 'text/csv') {
      const stream = Readable.from(fileBuffer.toString());
      stream.pipe(csv())
        .on('data', (row) => {
          // Mapear columnas CSV a campos de pregunta
          questionsToImport.push({
            pregunta: row.pregunta,
            opcionA: row.opcionA,
            opcionB: row.opcionB,
            opcionC: row.opcionC,
            opcionD: row.opcionD,
            respuestaCorrecta: row.respuestaCorrecta,
            puntaje: parseInt(row.puntaje) || 1,
            oa: row.oa,
            habilidad: row.habilidad || '',
            dificultad: row.dificultad || 'Intermedio',
            creador: creatorId,
          });
        })
        .on('end', async () => {
          if (questionsToImport.length === 0) {
            return res.status(400).json({ msg: 'No se encontraron preguntas válidas en el archivo CSV.' });
          }
          await Question.insertMany(questionsToImport);
          res.status(201).json({ msg: `Se importaron ${questionsToImport.length} preguntas desde CSV.` });
        });
    } else if (fileType === 'application/json') {
      const jsonData = JSON.parse(fileBuffer.toString());
      if (!Array.isArray(jsonData)) {
        return res.status(400).json({ msg: 'El archivo JSON debe contener un array de preguntas.' });
      }
      jsonData.forEach(q => {
        questionsToImport.push({
          pregunta: q.pregunta,
          opcionA: q.opcionA,
          opcionB: q.opcionB,
          opcionC: q.opcionC,
          opcionD: q.opcionD,
          respuestaCorrecta: q.respuestaCorrecta,
          puntaje: parseInt(q.puntaje) || 1,
          oa: q.oa,
          habilidad: q.habilidad || '',
          dificultad: q.dificultad || 'Intermedio',
          creador: creatorId,
        });
      });

      if (questionsToImport.length === 0) {
        return res.status(400).json({ msg: 'No se encontraron preguntas válidas en el archivo JSON.' });
      }
      await Question.insertMany(questionsToImport);
      res.status(201).json({ msg: `Se importaron ${questionsToImport.length} preguntas desde JSON.` });

    } else {
      return res.status(400).json({ msg: 'Tipo de archivo no soportado. Solo se permiten CSV y JSON.' });
    }
  } catch (err) {
    console.error('Error al importar preguntas:', err);
    res.status(500).send('Error del Servidor al importar preguntas.');
  }
};
