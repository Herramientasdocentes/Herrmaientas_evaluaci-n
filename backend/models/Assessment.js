const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Sub-esquema para los enlaces de las diferentes formas de la evaluación
const EnlaceSchema = new Schema({
  forma: { type: String, required: true }, // Ej: "Forma A", "Forma B"
  urlDoc: { type: String, required: true },
  urlForm: { type: String, required: true }
}, { _id: false });

// Definimos el esquema principal de la evaluación
const assessmentSchema = new Schema({
  nombreEvaluacion: {
    type: String,
    required: true
  },
  objetivo: {
    type: String,
    required: true
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  },
  creador: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Almacenamos un array de enlaces para soportar múltiples formas
  enlaces: [EnlaceSchema]
});

// Creamos y exportamos el modelo
module.exports = mongoose.model('Assessment', assessmentSchema);