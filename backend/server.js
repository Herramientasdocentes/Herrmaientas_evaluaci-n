// Basic Express server setup for backend
const express = require('express');
const cors = require('cors'); // <-- Importa la librería cors
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors()); // <-- Habilita CORS para todas las rutas
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// TODO: Import routes and middleware as needed

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
