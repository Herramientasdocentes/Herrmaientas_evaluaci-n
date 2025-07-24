const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: '../.env' }); // Apuntamos al .env de la carpeta raíz del backend

const Question = require('../models/Question');
const User = require('../models/User');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Conectado...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

const migrate = async () => {
  await connectDB();

  try {
    const adminUser = await User.findOne({ email: 'Jeanclaudioconcha@gmail.com' });
    if (!adminUser) {
      console.error('Error: No se encontró al usuario administrador. Asegúrate de que esté registrado.');
      process.exit(1);
    }

    await Question.deleteMany();
    console.log('Colección de preguntas limpiada.');

    const dataDir = path.join(__dirname, '..', 'data');
    const files = fs.readdirSync(dataDir).filter(file => file.endsWith('.csv'));

    for (const file of files) {
      const questionsToInsert = [];
      const filePath = path.join(dataDir, file);

      await new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
          .pipe(csv())
          .on('data', (row) => {
            const questionData = {
              pregunta: row.Question,
              opcionA: row.A,
              opcionB: row.B,
              opcionC: row.C,
              opcionD: row.D,
              respuestaCorrecta: row.Correcta,
              puntaje: parseInt(row.Puntaje) || 1,
              oa: row.OA,
              indicador: row.ID,
              habilidad: row.Habilidad,
              dificultad: row.Dificultad,
              creador: adminUser._id,
            };
            questionsToInsert.push(questionData);
          })
          .on('end', () => {
            console.log(`Archivo ${file} procesado.`);
            resolve();
          })
          .on('error', reject);
      });

      if (questionsToInsert.length > 0) {
        await Question.insertMany(questionsToInsert);
        console.log(`${questionsToInsert.length} preguntas del archivo ${file} fueron importadas.`);
      }
    }

    console.log('¡Migración de datos completada exitosamente!');
  } catch (error) {
    console.error('Error durante la migración:', error);
  } finally {
    mongoose.connection.close();
  }
};

migrate();
