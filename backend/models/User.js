const mongoose = require('mongoose');
const { isEmail } = require('validator'); // Importa la función de validación de email
const Schema = mongoose.Schema;

const userSchema = new Schema({
  nombre: {
    type: String,
    required: [true, 'Por favor, ingrese un nombre.'], // Mensaje de error personalizado
  },
  email: {
    type: String,
    required: [true, 'Por favor, ingrese un correo electrónico.'],
    unique: true,
    lowercase: true, // Convierte el email a minúsculas antes de guardarlo
    validate: [isEmail, 'Por favor, ingrese un correo electrónico válido.'], // Validación de formato
  },
  password: {
    type: String,
    required: [true, 'Por favor, ingrese una contraseña.'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres.'], // Validación de largo mínimo
  },
  rol: {
    type: String,
    enum: ['docente', 'administrador'],
    default: 'docente',
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  googleAccessToken: String,
  googleRefreshToken: String,
  googleExpiryDate: Date,
  googleScope: String,
  googleTokenType: String,
  googleId: { type: String, unique: true, sparse: true }, // sparse: permite nulos, pero si existe, debe ser único
});

module.exports = mongoose.model('User', userSchema);
