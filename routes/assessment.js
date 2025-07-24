// @route   GET api/evaluaciones/mis-evaluaciones
// @desc    Obtener todas las evaluaciones creadas por el usuario actual
// @access  Private
router.get('/mis-evaluaciones', auth, async (req, res) => {
  try {
    // Buscamos en la base de datos todas las evaluaciones donde el 'creador' coincida con el ID del usuario logueado
    const assessments = await Assessment.find({ creador: req.user.id }).sort({ fechaCreacion: -1 });
    res.json(assessments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});
// @route   POST api/evaluaciones/crear-form
// @desc    Crear un nuevo Google Form autocalificable
// @access  Private
router.post('/crear-form', auth, async (req, res) => {
  const { nombreEvaluacion, questions } = req.body;

  try {
    const googleAuth = new google.auth.GoogleAuth({
      keyFile: path.join(__dirname, '..', 'credentials.json'),
      scopes: [
        'https://www.googleapis.com/auth/forms.body',
        'https://www.googleapis.com/auth/forms.responses.readonly',
        'https://www.googleapis.com/auth/drive',
      ],
    });
    const forms = google.forms({ version: 'v1', auth: googleAuth });

    // 1. Crear un formulario en blanco
    const createdForm = await forms.forms.create({
      requestBody: {
        info: { title: nombreEvaluacion },
      },
    });
    const formId = createdForm.data.formId;

    // 2. Convertir el formulario en un cuestionario
    await forms.forms.batchUpdate({
      formId: formId,
      requestBody: {
        requests: [
          { updateSettings: { settings: { quizSettings: { isQuiz: true } }, updateMask: 'quizSettings.isQuiz' } },
        ],
      },
    });

    // 3. Preparar las solicitudes para añadir cada pregunta
    const questionRequests = questions.map((q, index) => {
      const correctOptionIndex = ['A', 'B', 'C', 'D'].indexOf((q.Correcta || '').toUpperCase());
      return {
        createItem: {
          item: {
            title: q.Question,
            questionItem: {
              question: {
                required: true,
                choiceQuestion: {
                  type: 'RADIO',
                  options: [
                    { value: q.A },
                    { value: q.B },
                    { value: q.C },
                    { value: q.D },
                  ],
                },
                grading: {
                  pointValue: parseInt(q.Puntaje) || 1,
                  correctAnswers: {
                    answers: [
                      { value: q[q.Correcta ? q.Correcta.toUpperCase() : 'A'] }
                    ],
                  },
                },
              },
            },
          },
          location: { index },
        },
      };
    });

    // 4. Añadir todas las preguntas al formulario en un solo lote
    if (questionRequests.length > 0) {
      await forms.forms.batchUpdate({
        formId: formId,
        requestBody: { requests: questionRequests },
      });
    }

    const formUrl = `https://docs.google.com/forms/d/${formId}/edit`;

    res.status(201).json({ msg: 'Formulario creado exitosamente', formLink: formUrl });

  } catch (error) {
    console.error('Error al crear el Google Form:', error.message);
    res.status(500).send('Error del servidor');
  }
});
const express = require('express');
const router = express.Router();
const { google } = require('googleapis');
const path = require('path');
const auth = require('../middleware/auth');
const Assessment = require('../models/Assessment'); // Importamos el modelo de Evaluación


// Pequeña función para barajar un arreglo (Fisher-Yates)
function shuffleArray(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

router.post('/crear', auth, async (req, res) => {
  const { nombreEvaluacion, objetivo, questions, neeProfile, formCount } = req.body;

  try {
    const googleAuth = new google.auth.GoogleAuth({
      keyFile: path.join(__dirname, '..', 'credentials.json'),
      scopes: ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/documents'],
    });
    const drive = google.drive({ version: 'v3', auth: googleAuth });
    const docs = google.docs({ version: 'v1', auth: googleAuth });

    const docLinks = [];
    const formLetters = ['A', 'B', 'C'];
    const totalForms = Math.min(parseInt(formCount, 10) || 1, 3);

    for (let i = 0; i < totalForms; i++) {
      const formName = `${nombreEvaluacion} - Forma ${formLetters[i]}`;
      const shuffledQuestions = shuffleArray([...questions]);

      // 1. Copiar la plantilla
      const copiedFile = await drive.files.copy({
        fileId: process.env.GOOGLE_DOC_TEMPLATE_ID,
        requestBody: { name: formName },
      });
      const newDocId = copiedFile.data.id;

      // 2. Formatear las preguntas (ya reordenadas)
      const questionsText = shuffledQuestions.map((q, index) => `${index + 1}. ${q.Question}`).join('\n');

      // 3. Preparar las solicitudes de reemplazo y formato
      let requests = [
        { replaceAllText: { containsText: { text: '{{NOMBRE_EVALUACION}}' }, replaceText: formName } },
        { replaceAllText: { containsText: { text: '{{OBJETIVO}}' }, replaceText: objetivo } },
        { replaceAllText: { containsText: { text: '{{PREGUNTAS}}' }, replaceText: questionsText } },
      ];

      // Lógica de adecuación NEE
      switch (neeProfile) {
        case 'DEA':
          requests.push({
            updateParagraphStyle: {
              range: { segmentId: '' },
              paragraphStyle: { lineSpacing: 150 },
              fields: 'lineSpacing',
            },
          });
          requests.push({
            updateTextStyle: {
              range: { segmentId: '' },
              textStyle: {
                fontSize: { magnitude: 12, unit: 'PT' },
                weightedFontFamily: { fontFamily: 'Lexend Deca' }
              },
              fields: 'fontSize,weightedFontFamily',
            },
          });
          break;
        case 'TDAH':
          requests.push({
            updateTextStyle: {
              range: { segmentId: '' },
              textStyle: { bold: true },
              fields: 'bold',
            },
          });
          break;
      }

      // 4. Ejecutar todas las solicitudes en un solo lote
      await docs.documents.batchUpdate({
        documentId: newDocId,
        requestBody: { requests },
      });

      // Añadir el enlace y nombre del nuevo documento al arreglo
      docLinks.push({
        name: formName,
        url: `https://docs.google.com/document/d/${newDocId}/edit`
      });
    }

    // Guardar un único registro en la base de datos (la Forma A)
    const newAssessment = new Assessment({
      nombreEvaluacion,
      objetivo,
      creador: req.user.id,
      enlaceDoc: docLinks[0].url,
      enlaceForm: '',
    });
    await newAssessment.save();

    // Enviar la lista de enlaces como respuesta
    res.status(201).json({
      msg: `${totalForms} forma(s) de la evaluación creada(s) con éxito`,
      docLinks: docLinks
    });

  } catch (error) {
    console.error('Error al crear la evaluación:', error.message);
    res.status(500).send('Error del servidor');
  }
});

module.exports = router;
