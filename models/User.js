const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Definimos el esquema del usuario
const userSchema = new Schema({
  nombre: {
    type: String,
    required: true // El nombre es obligatorio
  },
  email: {
    type: String,
    required: true, // El email es obligatorio
    unique: true    // No puede haber dos usuarios con el mismo email
  },
  password: {
    type: String,
    required: true // La contraseña es obligatoria
  },
  rol: {
    type: String,
    enum: ['docente', 'administrador'], // El rol solo puede ser uno de estos dos valores
    default: 'docente' // Por defecto, un nuevo usuario es 'docente'
  }
});

// Creamos y exportamos el modelo para que pueda ser usado en otras partes de la aplicación
module.exports = mongoose.model('User', userSchema);
