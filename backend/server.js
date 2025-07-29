
const express = require('express');
const cors = require('cors');
const morgan = require('morgan'); // <-- 1. Importa morgan
const connectDB = require('./config/db');

const app = express();

// Endpoint raíz para verificación
app.get('/', (req, res) => {
  res.send('API Asistente de Evaluaciones funcionando');
});

// --- CONFIGURACIÓN DE CORS DEFINITIVA ---
// Lista de dominios permitidos
const allowedOrigins = [
  'https://herrmaientas-evaluaci-n.vercel.app',
  'https://herrmaientas-evaluaci-4kyy4a2kl-herramientas-projects.vercel.app',
  'https://herrmaientas-evaluaci-10l3ts0vk-herramientas-projects.vercel.app',
  'https://herrmaientas-evaluaci-bdnfhy90x-herramientas-projects.vercel.app', // Dominio de preview actual
  'https://herrmaientas-evaluaci-o381661py-herramientas-projects.vercel.app', // Dominio de preview actual
  // Si tienes otras URLs de Vercel (de previews), puedes añadirlas aquí
];

const corsOptions = {
  origin: function (origin, callback) {
    // Permite solicitudes si el origen está en la lista blanca o si no hay origen (como en Postman)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  }
};

// Habilitar CORS con las opciones específicas
app.use(cors(corsOptions));

// Middleware de Logging (en modo 'dev' para desarrollo)
app.use(morgan('dev')); // <-- 2. Usa morgan aquí

// Conectar a la Base de Datos
connectDB();

// Definir Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/questions', require('./routes/questions'));
app.use('/api/evaluaciones', require('./routes/assessment'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Servidor iniciado en el puerto ${PORT}`));
