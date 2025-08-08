const express = require('express');
const router = express.Router();
const { google } = require('googleapis');
const auth = require('../middleware/auth');
const User = require('../models/User');

// Función para obtener un cliente autenticado (reutilizado de assessment.js)
async function getAuthenticatedClient(user) {
  const credentials = require('../credentials.json');
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  oAuth2Client.setCredentials({
    access_token: user.googleAccessToken,
    refresh_token: user.googleRefreshToken,
    expiry_date: user.googleExpiryDate,
    token_type: user.googleTokenType,
    scope: user.googleScope,
  });

  return oAuth2Client;
}

// @route   GET /api/classroom/courses
// @desc    Obtener la lista de cursos de Google Classroom del usuario
// @access  Private
router.get('/courses', auth, async (req, res) => {
  try {
    const oAuth2Client = await getAuthenticatedClient(req.user);
    const classroom = google.classroom({ version: 'v1', auth: oAuth2Client });

    const response = await classroom.courses.list({
      courseStates: 'ACTIVE',
    });

    res.json(response.data.courses || []);
  } catch (error) {
    console.error('Error al obtener cursos de Classroom:', error.message);
    res.status(500).send('Error del servidor al obtener cursos de Classroom.');
  }
});

// @route   POST /api/classroom/courses/:courseId/assignments
// @desc    Crear una nueva tarea en un curso de Google Classroom
// @access  Private
router.post('/courses/:courseId/assignments', auth, async (req, res) => {
  const { courseId } = req.params;
  const { title, description, dueDate, dueTime, link } = req.body;

  if (!title || !link) {
    return res.status(400).json({ msg: 'Título y enlace de la tarea son obligatorios.' });
  }

  try {
    const oAuth2Client = await getAuthenticatedClient(req.user);
    const classroom = google.classroom({ version: 'v1', auth: oAuth2Client });

    const assignment = {
      title: title,
      description: description,
      state: 'PUBLISHED',
      workType: 'ASSIGNMENT',
      materials: [{
        link: {
          url: link,
          title: title,
        },
      }],
    };

    if (dueDate) {
      const date = new Date(dueDate);
      assignment.dueDate = {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
      };
    }

    if (dueTime) {
      const [hours, minutes] = dueTime.split(':').map(Number);
      assignment.dueTime = {
        hours: hours,
        minutes: minutes,
      };
    }

    const response = await classroom.courses.courseWork.create({
      courseId: courseId,
      requestBody: assignment,
    });

    res.status(201).json(response.data);
  } catch (error) {
    console.error('Error al crear tarea en Classroom:', error.message);
    res.status(500).send('Error del servidor al crear tarea en Classroom.');
  }
});

module.exports = router;
