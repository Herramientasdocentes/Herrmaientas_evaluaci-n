// Importamos las librerías necesarias
const { google } = require('googleapis');
const path = require('path');

// Creamos una función asíncrona para poder usar 'await'
async function listFiles() {
  try {
    // 1. Autenticación
    // Apuntamos a nuestro archivo de credenciales JSON
    const auth = new google.auth.GoogleAuth({
      keyFile: path.join(__dirname, 'credentials.json'),
      scopes: ['https://www.googleapis.com/auth/drive.readonly'], // Usamos 'readonly' porque solo vamos a leer
    });

    // Creamos un cliente de Drive autenticado
    const drive = google.drive({ version: 'v3', auth });

    // 2. Obtenemos el ID de la carpeta
    // ¡IMPORTANTE! Reemplaza el texto de abajo con el ID real de tu carpeta de Google Drive.
    const folderId = '1u3gyLHcMJF6dbTCfK5vcCOJaRV1kwPq-';

    // 3. Realizamos la consulta a la API
    console.log('Buscando archivos en la carpeta...');
    const res = await drive.files.list({
      q: `'${folderId}' in parents`, // Esta es la consulta para buscar archivos dentro de una carpeta específica
      fields: 'files(id, name)', // Pedimos solo el ID y el nombre de los archivos
    });

    const files = res.data.files;
    if (files.length) {
      console.log('¡Éxito! Archivos encontrados:');
      files.forEach((file) => {
        console.log(`- ${file.name} (ID: ${file.id})`);
      });
    } else {
      console.log('No se encontraron archivos en la carpeta especificada.');
    }
  } catch (error) {
    console.error('ERROR: No se pudo conectar a la API de Google Drive.', error.message);
    console.error('Posibles causas: ¿Compartiste la carpeta con el email de la cuenta de servicio? ¿El ID de la carpeta es correcto?');
  }
}

// Ejecutamos la función
listFiles();
