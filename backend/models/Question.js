const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
  pregunta: {
    type: String,
    required: true,
  },
  opcionA: { type: String, required: true },
  opcionB: { type: String, required: true },
  opcionC: { type: String, required: true },
  opcionD: { type: String, required: true },
  respuestaCorrecta: {
    type: String,
    required: true,
    enum: ['A', 'B', 'C', 'D'],
  },
  puntaje: {
    type: Number,
    required: true,
    default: 1,
  },
  oa: {
    type: String,
    required: true,
  },
  indicador: {
    type: String,
  },
  habilidad: {
    type: String,
  },
  dificultad: {
    type: String,
    enum: ['Fácil', 'Intermedio', 'Adecuado', 'Desafiante'],
    default: 'Intermedio',
  },
  creador: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  fechaCreacion: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Question', questionSchema);
