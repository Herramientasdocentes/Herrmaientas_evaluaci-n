const express = require('express');
const router = express.Router();
const { google } = require('googleapis');
const auth = require('../middleware/auth');
const Assessment = require('../models/Assessment');
const Question = require('../models/Question');

async function getAuthenticatedClient() {
  const credentials = require('../credentials.json');
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
  const token = require('../token.json');
  oAuth2Client.setCredentials(token);
  return oAuth2Client;
}

router.post('/', auth, async (req, res) => {
  const { nombreEvaluacion, objetivo, questionIds } = req.body;

  if (!nombreEvaluacion || !objetivo || !questionIds || questionIds.length === 0) {
    return res.status(400).json({ msg: 'Faltan datos para crear la evaluación.' });
  }

  try {
    const oAuth2Client = await getAuthenticatedClient();
    const docs = google.docs({ version: 'v1', auth: oAuth2Client });
    const forms = google.forms({ version: 'v1', auth: oAuth2Client });

    const questions = await Question.find({ '_id': { $in: questionIds } });

    // --- 1. Crear y Poblar Google Doc ---
    const createDocResponse = await docs.documents.create({ resource: { title: nombreEvaluacion } });
    const docId = createDocResponse.data.documentId;

    let docRequests = [
      { insertText: { location: { index: 1 }, text: `Objetivo: ${objetivo}\n\n` } },
      { insertText: { location: { index: 1 }, text: `${nombreEvaluacion}\n` } },
    ];
    questions.forEach((q, i) => {
      const text = `${i + 1}. ${q.pregunta}\n   A) ${q.opcionA}\n   B) ${q.opcionB}\n   C) ${q.opcionC}\n   D) ${q.opcionD}\n\n`;
      docRequests.push({ insertText: { text } });
    });
    // Invertimos las solicitudes para insertar en el orden correcto (de arriba hacia abajo)
    docRequests.reverse(); 

    await docs.documents.batchUpdate({
      documentId: docId,
      resource: { requests: docRequests },
    });

    // --- 2. Crear y Poblar Google Form ---
    const createFormResponse = await forms.forms.create({ resource: { info: { title: nombreEvaluacion } } });
    const formId = createFormResponse.data.formId;

    let formRequests = questions.map((q, i) => ({
      createItem: {
        item: {
          title: `${i + 1}. ${q.pregunta}`,
          questionItem: {
            question: {
              required: true,
              choiceQuestion: {
                type: 'RADIO',
                options: [
                  { value: q.opcionA },
                  { value: q.opcionB },
                  { value: q.opcionC },
                  { value: q.opcionD },
                ],
              },
            },
          },
        },
        location: { index: i },
      },
    }));

    await forms.forms.batchUpdate({
      formId: formId,
      resource: { requests: formRequests },
    });

    // --- 3. Guardar en la Base de Datos ---
    const newAssessment = new Assessment({
      nombreEvaluacion,
      objetivo,
      creador: req.user.id,
      enlaceDoc: `https://docs.google.com/document/d/${docId}/edit`,
      enlaceForm: `https://docs.google.com/forms/d/${formId}/edit`,
    });
    await newAssessment.save();

    res.status(201).json(newAssessment);

  } catch (error) {
    console.error('Error al crear la evaluación en Google:', error.response?.data || error.message);
    res.status(500).send('Error del servidor al interactuar con la API de Google.');
  }
});

router.get('/mis-evaluaciones', auth, async (req, res) => {
  try {
    const assessments = await Assessment.find({ creador: req.user.id }).sort({ fechaCreacion: -1 });
    res.json(assessments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del Servidor');
  }
});

module.exports = router;
