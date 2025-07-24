const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Definimos el esquema de la evaluación
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
    default: Date.now // La fecha se establece automáticamente al crear el registro
  },
  creador: {
    type: mongoose.Schema.Types.ObjectId, // Almacena el ID único de un usuario
    ref: 'User',                         // Especifica que este ID se refiere a un documento del modelo 'User'
    required: true
  },
  enlaceDoc: {
    type: String,
    required: true
  },
  enlaceForm: {
    type: String,
    required: true
  }
});

// Creamos y exportamos el modelo
module.exports = mongoose.model('Assessment', assessmentSchema);
