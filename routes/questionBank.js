const express = require('express');
const router = express.Router();
const { google } = require('googleapis');
const path = require('path');
const auth = require('../middleware/auth'); // ¡Importamos nuestro guardián!

// @route   GET api/banco
// @desc    Obtener la lista de archivos del banco de preguntas
// @access  Private (Protegida)
router.get('/', auth, async (req, res) => {
  try {
    // La lógica de autenticación y consulta que ya validamos
    const googleAuth = new google.auth.GoogleAuth({
      keyFile: path.join(__dirname, '..', 'credentials.json'), // Usamos '..' para subir un nivel desde la carpeta 'routes'
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    });

    const drive = google.drive({ version: 'v3', auth: googleAuth });
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID; // Guardaremos el ID en el archivo .env

    const response = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false`,
      fields: 'files(id, name)',
    });

    res.json(response.data.files); // Enviamos la lista de archivos como respuesta

  } catch (error) {
    console.error('Error al contactar la API de Drive:', error.message);
    res.status(500).send('Error del servidor al obtener los archivos del banco de preguntas.');
  }
});


// @route   GET api/banco/preguntas/:fileId
// @desc    Obtener las preguntas de un archivo específico
// @access  Private
router.get('/preguntas/:fileId', auth, async (req, res) => {
  try {
    const { fileId } = req.params; // Obtenemos el ID del archivo de la URL

    const googleAuth = new google.auth.GoogleAuth({
      keyFile: path.join(__dirname, '..', 'credentials.json'),
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    });

    const drive = google.drive({ version: 'v3', auth: googleAuth });

    // Descargamos el contenido del archivo
    const fileResponse = await drive.files.get(
      { fileId: fileId, alt: 'media' },
      { responseType: 'stream' }
    );

    // Procesamos el archivo CSV y lo convertimos a JSON
    const questions = [];
    fileResponse.data
      .pipe(require('csv-parser')())
      .on('data', (data) => questions.push(data))
      .on('end', () => {
        res.json(questions); // Enviamos las preguntas como respuesta
      });

  } catch (error) {
    console.error('Error al obtener las preguntas del archivo:', error.message);
    res.status(500).send('Error del servidor');
  }
});

module.exports = router;
