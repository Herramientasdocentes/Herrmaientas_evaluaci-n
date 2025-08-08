const multer = require('multer');

// Set up storage for uploaded files
const storage = multer.memoryStorage(); // Store files in memory as Buffer objects

// Create the multer instance
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.mimetype === 'application/json') {
      cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no soportado. Solo se permiten archivos CSV y JSON.'), false);
    }
  }
});

module.exports = upload;
