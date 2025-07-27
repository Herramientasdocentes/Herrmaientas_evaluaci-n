const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const morgan = require('morgan');

const app = express();

// --- CONFIGURACIÓN DE CORS DEFINITIVA ---
// Lista de dominios permitidos
const allowedOrigins = [
  'https://herrmaientas-evaluaci-n.vercel.app',
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

// Conectar a la Base de Datos
connectDB();

// Middlewares
app.use(express.json({ extended: false }));
app.use(morgan('dev'));

// Definir Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/questions', require('./routes/questions'));
app.use('/api/evaluaciones', require('./routes/assessment'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Servidor iniciado en el puerto ${PORT}`));
