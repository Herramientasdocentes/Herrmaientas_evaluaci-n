const express = require('express');
const cors = require('cors');
require('dotenv').config();
const morgan = require('morgan'); // <-- 1. Importa morgan
const connectDB = require('./config/db');

const app = express();

// Endpoint raíz para verificación
app.get('/', (req, res) => {
  res.send('API Asistente de Evaluaciones funcionando');
});

// --- CONFIGURACIÓN DE CORS DINÁMICA Y SEGURA ---
const allowedOrigins = [
  'https://herrmaientas-evaluaci-n.vercel.app', // Dominio de producción (con guion)
  'https://herrmaientas-evaluaci.vercel.app',   // Dominio alternativo (sin guion, por si acaso)
  'https://herrmaientas-evaluaci-lhnurgnax-herramientas-projects.vercel.app', // Dominio de despliegue actual
];

const corsOptions = {
  origin: function (origin, callback) {
    // Permitir dominios de la lista, todas las previews de Vercel, y solicitudes sin origen (Postman)
    const isAllowed = allowedOrigins.includes(origin) ||
                      /-herramientas-projects\.vercel\.app$/.test(origin) ||
                      /-evaluaci(-[a-z0-9]+)?-herramientas-projects\.vercel\.app$/.test(origin);

    if (!origin || isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  }
};

// Habilitar CORS con las opciones específicas
app.use(cors(corsOptions));


// Middleware para parsear JSON
app.use(express.json());

// Middleware de Logging (en modo 'dev' para desarrollo)
app.use(morgan('dev')); // <-- 2. Usa morgan aquí

// Conectar a la Base de Datos
connectDB();

// Definir Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/user')); // Nueva ruta para gestión de usuarios
app.use('/api/questions', require('./routes/questions'));
app.use('/api/evaluaciones', require('./routes/assessment'));
app.use('/api/banco', require('./routes/banco'));
app.use('/api/sheets', require('./routes/sheets'));
app.use('/api/classroom', require('./routes/classroom'));
app.use('/api/gemini', require('./routes/gemini'));
app.use('/api/import', require('./routes/import')); // Add this line

const PORT = process.env.PORT || 5000;


// Middleware de manejo de errores (debe ir al final)
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

app.listen(PORT, () => console.log(`Servidor iniciado en el puerto ${PORT}`));