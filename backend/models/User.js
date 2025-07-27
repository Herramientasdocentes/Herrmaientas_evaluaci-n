const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  nombre: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  rol: {
    type: String,
    enum: ['docente', 'administrador'],
    default: 'docente'
  },
  // ▼▼▼ NUEVOS CAMPOS ▼▼▼
  passwordResetToken: String,
  passwordResetExpires: Date,
  // ▲▲▲ FIN NUEVOS CAMPOS ▲▲▲
});

module.exports = mongoose.model('User', userSchema);
