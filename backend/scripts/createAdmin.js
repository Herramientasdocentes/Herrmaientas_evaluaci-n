// Script para crear un usuario administrador con contraseña predeterminada
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('./models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/tu_basededatos';

async function createAdmin() {
  await mongoose.connect(MONGO_URI);
  const email = 'admin@demo.com';
  const password = 'admin123';
  const nombre = 'Administrador';
  const rol = 'administrador';

  // Verifica si ya existe
  const exists = await User.findOne({ email });
  if (exists) {
    console.log('El usuario admin ya existe.');
    process.exit(0);
  }

  const hashed = await bcrypt.hash(password, 10);
  const admin = new User({ nombre, email, password: hashed, rol });
  await admin.save();
  console.log('Usuario administrador creado:', email, password);
  process.exit(0);
}

createAdmin();
