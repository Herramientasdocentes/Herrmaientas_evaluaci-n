
const express = require('express');
const cors = require('cors');
const morgan = require('morgan'); // <-- 1. Importa morgan
const connectDB = require('./config/db');

const app = express();

// Endpoint raíz para verificación
app.get('/', (req, res) => {
  res.send('API Asistente de Evaluaciones funcionando');
});

// --- CONFIGURACIÓN DE CORS DINÁMICA Y SEGURA ---
const allowedOrigins = [
  'https://herrmaientas-evaluaci-n.vercel.app', // Dominio de producción
];

const corsOptions = {
  origin: function (origin, callback) {
    // Permitir dominios de la lista, todas las previews de Vercel, y solicitudes sin origen (Postman)
    const isAllowed = allowedOrigins.includes(origin) ||
                      /-herramientas-projects\.vercel\.app$/.test(origin);

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
app.use('/api/questions', require('./routes/questions'));
app.use('/api/evaluaciones', require('./routes/assessment'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Servidor iniciado en el puerto ${PORT}`));
