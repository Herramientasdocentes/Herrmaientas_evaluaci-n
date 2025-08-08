const { google } = require('googleapis');
const Assessment = require('../models/Assessment');
const Question = require('../models/Question');
const { getAuthenticatedClient } = require('../utils/googleAuth');

// --- Función Auxiliar para Barajar (Algoritmo de Fisher-Yates) ---
function shuffleArray(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

// --- Controlador Principal ---
exports.createAssessment = async (req, res) => {
  const { nombreEvaluacion, objetivo, questionIds, numForms = 1 } = req.body;

  if (!nombreEvaluacion || !objetivo || !questionIds || questionIds.length === 0) {
    return res.status(400).json({ msg: 'Faltan datos para crear la evaluación.' });
  }

  try {
    const oAuth2Client = await getAuthenticatedClient(req.user);
    const docs = google.docs({ version: 'v1', auth: oAuth2Client });
    const forms = google.forms({ version: 'v1', auth: oAuth2Client });

    const baseQuestions = await Question.find({ _id: { $in: questionIds } });
    const generatedLinks = [];

    for (let i = 0; i < numForms; i++) {
      const formName = numForms > 1 ? `${nombreEvaluacion} - Forma ${String.fromCharCode(65 + i)}` : nombreEvaluacion;
      const shuffledQuestions = shuffleArray([...baseQuestions]);

      // --- 1. Crear y Poblar Google Doc ---
      const createDocResponse = await docs.documents.create({ resource: { title: formName } });
      const docId = createDocResponse.data.documentId;

      let docRequests = [
        { insertText: { location: { index: 1 }, text: `Objetivo: ${objetivo}\n\n` } },
        { insertText: { location: { index: 1 }, text: `${formName}\n` } },
      ];

      shuffledQuestions.forEach((q, index) => {
        const options = shuffleArray([q.opcionA, q.opcionB, q.opcionC, q.opcionD]);
        const text = `${index + 1}. ${q.pregunta}\n   A) ${options[0]}\n   B) ${options[1]}\n   C) ${options[2]}\n   D) ${options[3]}\n\n`;
        docRequests.push({ insertText: { text } });
      });

      docRequests.reverse();
      await docs.documents.batchUpdate({ documentId: docId, resource: { requests: docRequests } });

      // --- 2. Crear y Poblar Google Form ---
      const createFormResponse = await forms.forms.create({ resource: { info: { title: formName } } });
      const formId = createFormResponse.data.formId;

      let formRequests = shuffledQuestions.map((q, index) => ({
        createItem: {
          item: {
            title: `${index + 1}. ${q.pregunta}`,
            questionItem: {
              question: {
                required: true,
                choiceQuestion: {
                  type: 'RADIO',
                  options: shuffleArray([q.opcionA, q.opcionB, q.opcionC, q.opcionD]).map(opt => ({ value: opt }))
                },
              },
            },
          },
          location: { index: index },
        },
      }));

      await forms.forms.batchUpdate({ formId: formId, resource: { requests: formRequests } });

      generatedLinks.push({
        forma: `Forma ${String.fromCharCode(65 + i)}`,
        urlDoc: `https://docs.google.com/document/d/${docId}/edit`,
        urlForm: `https://docs.google.com/forms/d/${formId}/edit`,
      });
    }

    // --- 3. Guardar en la Base de Datos ---
    const newAssessment = new Assessment({
      nombreEvaluacion,
      objetivo,
      creador: req.user.id,
      enlaces: generatedLinks,
    });

    await newAssessment.save();

    res.status(201).json(newAssessment);

  } catch (error) {
    console.error('Error al crear la evaluación en Google:', error.response?.data || error.message);
    res.status(500).send('Error del servidor al interactuar con la API de Google.');
  }
};

exports.getAssessments = async (req, res) => {
  try {
    const assessments = await Assessment.find({ creador: req.user.id }).sort({ fechaCreacion: -1 });
    res.json(assessments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del Servidor');
  }
};

exports.deleteAssessment = async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id);

    if (!assessment) {
      return res.status(404).json({ msg: 'Evaluación no encontrada' });
    }

    // Verificar que el usuario sea el creador de la evaluación
    if (assessment.creador.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Usuario no autorizado' });
    }

    await Assessment.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Evaluación eliminada exitosamente' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del Servidor');
  }
};

exports.updateAssessment = async (req, res) => {
  const { nombreEvaluacion, objetivo, enlaces } = req.body;

  try {
    let assessment = await Assessment.findById(req.params.id);

    if (!assessment) {
      return res.status(404).json({ msg: 'Evaluación no encontrada' });
    }

    // Verificar que el usuario sea el creador de la evaluación
    if (assessment.creador.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Usuario no autorizado' });
    }

    // Actualizar solo los campos permitidos
    assessment.nombreEvaluacion = nombreEvaluacion || assessment.nombreEvaluacion;
    assessment.objetivo = objetivo || assessment.objetivo;
    assessment.enlaces = enlaces || assessment.enlaces; // Permitir actualizar enlaces si es necesario

    await assessment.save();

    res.json(assessment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del Servidor');
  }
};
