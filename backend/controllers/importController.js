const Question = require('../models/Question');
const csv = require('csv-parser');
const { Readable } = require('stream');

// Helper function to validate question data
const validateQuestionData = (questionData) => {
  return (
    questionData.pregunta &&
    questionData.opcionA &&
    questionData.opcionB &&
    questionData.opcionC &&
    questionData.opcionD &&
    questionData.respuestaCorrecta
  );
};

// @desc    Import questions from a CSV file
// @route   POST /api/import/csv
// @access  Private
exports.importCsvQuestions = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ msg: 'No se ha subido ningún archivo CSV.' });
  }

  const questionsToImport = [];
  const bufferStream = new Readable();
  bufferStream.push(req.file.buffer);
  bufferStream.push(null); // Indicate end of stream

  bufferStream
    .pipe(csv())
    .on('data', (data) => {
      // Map CSV headers to your question model fields
      const questionData = {
        pregunta: data.pregunta,
        opcionA: data.opcionA,
        opcionB: data.opcionB,
        opcionC: data.opcionC,
        opcionD: data.opcionD,
        respuestaCorrecta: data.respuestaCorrecta?.toUpperCase(),
        oa: data.oa,
        dificultad: data.dificultad,
        puntaje: parseInt(data.puntaje) || 1,
        habilidad: data.habilidad,
        creador: req.user.id, // Assuming req.user.id is available from auth middleware
      };
      if (validateQuestionData(questionData)) {
        questionsToImport.push(questionData);
      }
    })
    .on('end', async () => {
      if (questionsToImport.length === 0) {
        return res.status(400).json({ msg: 'No se encontraron preguntas válidas en el archivo CSV.' });
      }
      try {
        await Question.insertMany(questionsToImport);
        res.status(201).json({ msg: `Se importaron ${questionsToImport.length} preguntas exitosamente desde CSV.` });
      } catch (err) {
        console.error('Error importing CSV questions:', err);
        res.status(500).send('Error del servidor al importar preguntas CSV.');
      }
    })
    .on('error', (err) => {
      console.error('Error parsing CSV:', err);
      res.status(500).send('Error al procesar el archivo CSV.');
    });
};

// @desc    Import questions from a JSON file
// @route   POST /api/import/json
// @access  Private
exports.importJsonQuestions = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ msg: 'No se ha subido ningún archivo JSON.' });
  }

  try {
    const jsonData = JSON.parse(req.file.buffer.toString());
    if (!Array.isArray(jsonData)) {
      return res.status(400).json({ msg: 'El archivo JSON debe contener un array de preguntas.' });
    }

    const questionsToImport = [];
    jsonData.forEach(data => {
      const questionData = {
        pregunta: data.pregunta,
        opcionA: data.opcionA,
        opcionB: data.opcionB,
        opcionC: data.opcionC,
        opcionD: data.opcionD,
        respuestaCorrecta: data.respuestaCorrecta?.toUpperCase(),
        oa: data.oa,
        dificultad: data.dificultad,
        puntaje: parseInt(data.puntaje) || 1,
        habilidad: data.habilidad,
        creador: req.user.id, // Assuming req.user.id is available from auth middleware
      };
      if (validateQuestionData(questionData)) {
        questionsToImport.push(questionData);
      }
    });

    if (questionsToImport.length === 0) {
      return res.status(400).json({ msg: 'No se encontraron preguntas válidas en el archivo JSON.' });
    }

    await Question.insertMany(questionsToImport);
    res.status(201).json({ msg: `Se importaron ${questionsToImport.length} preguntas exitosamente desde JSON.` });
  } catch (err) {
    console.error('Error importing JSON questions:', err);
    res.status(500).send('Error del servidor al importar preguntas JSON o archivo JSON inválido.');
  }
};
