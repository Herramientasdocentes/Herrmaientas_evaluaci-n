const express = require('express');
const router = express.Router();
const { google } = require('googleapis');
const auth = require('../middleware/auth');
const Question = require('../models/Question');
const { getAuthenticatedClient } = require('../utils/googleAuth'); // <-- Usar la función de autenticación correcta

// @route   GET /api/sheets/drive-files
// @desc    Listar archivos de Google Sheets desde Google Drive
// @access  Private
router.get('/drive-files', auth, async (req, res) => {
  try {
    const oAuth2Client = await getAuthenticatedClient(req.user);
    const drive = google.drive({ version: 'v3', auth: oAuth2Client });

    const response = await drive.files.list({
      q: "mimeType='application/vnd.google-apps.spreadsheet'", // Solo hojas de cálculo
      fields: 'files(id, name)',
      spaces: 'drive',
    });

    res.status(200).json(response.data.files);
  } catch (error) {
    console.error('Error al listar archivos de Google Drive:', error.message);
    res.status(500).send('Error del servidor al listar archivos de Drive.');
  }
});

// @route   GET /api/sheets/:sheetId/questions
// @desc    Leer preguntas de una hoja de cálculo de Google Sheets sin importarlas
// @access  Private
router.get('/:sheetId/questions', auth, async (req, res) => {
  const { sheetId } = req.params;

  try {
    const oAuth2Client = await getAuthenticatedClient(req.user);
    const sheets = google.sheets({ version: 'v4', auth: oAuth2Client });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'Sheet1', // Asume que las preguntas están en la primera hoja
    });

    const rows = response.data.values;

    if (!rows || rows.length < 2) { // Se necesita al menos una fila de encabezado y una de datos
      return res.status(400).json({ msg: 'La hoja de cálculo está vacía o no tiene un formato válido.' });
    }

    const headers = rows[0].map(h => h.trim().toLowerCase());
    const questions = [];

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const questionData = {};
      headers.forEach((header, index) => {
        questionData[header] = row[index];
      });

      // Mapear a un formato de pregunta consistente con el resto de la app
      if (questionData.pregunta && questionData.opciona && questionData.opcionb && questionData.opcionc && questionData.opciond) {
        questions.push({
          _id: `sheet_${sheetId}_${i}`,
          pregunta: questionData.pregunta,
          opcionA: questionData.opciona,
          opcionB: questionData.opcionb,
          opcionC: questionData.opcionc,
          opcionD: questionData.opciond,
          respuestaCorrecta: questionData.respuestacorrecta?.toUpperCase() || 'A',
          oa: questionData.oa || 'Desde Hoja de Cálculo',
          dificultad: questionData.dificultad || 'Intermedio',
          // No se incluye creador ya que no se guarda en BD
        });
      }
    }

    res.status(200).json(questions);

  } catch (error) {
    console.error('Error al leer preguntas desde Google Sheet:', error.message);
    res.status(500).send('Error del servidor al leer la hoja de cálculo.');
  }
});


// @route   POST /api/sheets/import-questions
// @desc    Importar y guardar preguntas desde una hoja de cálculo de Google Sheets
// @access  Private
router.post('/import-questions', auth, async (req, res) => {
  const { sheetId } = req.body;

  if (!sheetId) {
    return res.status(400).json({ msg: 'Se requiere el ID de la hoja de cálculo.' });
  }

  try {
    const oAuth2Client = await getAuthenticatedClient(req.user);
    const sheets = google.sheets({ version: 'v4', auth: oAuth2Client });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'Sheet1',
    });

    const rows = response.data.values;

    if (!rows || rows.length < 2) {
      return res.status(400).json({ msg: 'La hoja de cálculo está vacía o no tiene un formato válido.' });
    }

    const headers = rows[0].map(h => h.trim().toLowerCase());
    const questionsToImport = [];

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const questionData = {};
      headers.forEach((header, index) => {
        questionData[header] = row[index];
      });

      if (questionData.pregunta && questionData.opciona && questionData.opcionb && questionData.opcionc && questionData.opciond) {
        questionsToImport.push({
          pregunta: questionData.pregunta,
          opcionA: questionData.opciona,
          opcionB: questionData.opcionb,
          opcionC: questionData.opcionc,
          opcionD: questionData.opciond,
          respuestaCorrecta: questionData.respuestacorrecta?.toUpperCase() || 'A',
          puntaje: parseInt(questionData.puntaje) || 1,
          oa: questionData.oa,
          habilidad: questionData.habilidad || '',
          dificultad: questionData.dificultad || 'Intermedio',
          creador: req.user.id,
        });
      }
    }

    if (questionsToImport.length === 0) {
      return res.status(400).json({ msg: 'No se encontraron preguntas válidas para importar.' });
    }

    await Question.insertMany(questionsToImport);

    res.status(201).json({ msg: `Se importaron ${questionsToImport.length} preguntas exitosamente.` });

  } catch (error) {
    console.error('Error al importar preguntas desde Google Sheet:', error.message);
    res.status(500).send('Error del servidor al importar preguntas.');
  }
});

module.exports = router;