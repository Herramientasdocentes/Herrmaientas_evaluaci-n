// Importamos las librerías necesarias
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); // Librería para encriptar contraseñas
const User = require('../models/User'); // Importamos el modelo de Usuario que creamos

// @route   POST api/auth/register
// @desc    Registrar un nuevo usuario
// @access  Public
router.post('/register', async (req, res) => {
  // Extraemos nombre, email y password de la solicitud
  const { nombre, email, password } = req.body;

  try {
    // 1. Verificar si el usuario ya existe en la base de datos
    let user = await User.findOne({ email });

    if (user) {
      // Si el usuario ya existe, devolvemos un error
      return res.status(400).json({ msg: 'Un usuario ya existe con ese correo electrónico.' });
    }

    // 2. Si no existe, creamos una nueva instancia del modelo User
    user = new User({
      nombre,
      email,
      password,
    });

    // 3. Encriptar la contraseña antes de guardarla (Paso de seguridad CLAVE)
    const salt = await bcrypt.genSalt(10); // Generamos un 'salt' para la encriptación
    user.password = await bcrypt.hash(password, salt); // Reemplazamos la contraseña en texto plano por su versión encriptada

    // 4. Guardar el nuevo usuario en la base de datos
    await user.save();
    
    // 5. Enviar una respuesta de éxito
    // (Más adelante, aquí también generaremos y devolveremos un token JWT para auto-login)
    res.status(201).json({ msg: 'Usuario registrado exitosamente.' });

  } catch (err) {
    // Si ocurre un error en el servidor, lo mostramos en la consola y enviamos una respuesta de error
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

const jwt = require('jsonwebtoken'); // Para generar el JWT

// @route   POST api/auth/login
// @desc    Autenticar un usuario y obtener un token
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Verificar si el usuario existe
    let user = await User.findOne({ email });
    if (!user) {
      // Usamos un mensaje genérico por seguridad
      return res.status(400).json({ msg: 'Credenciales inválidas' });
    }

    // 2. Comparar la contraseña ingresada con la guardada en la base de datos
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Mensaje genérico también aquí
      return res.status(400).json({ msg: 'Credenciales inválidas' });
    }

    // 3. Si las credenciales son correctas, crear y firmar el JSON Web Token (JWT)
    const payload = {
      user: {
        id: user.id, // Incluimos el ID del usuario en el token
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET, // Necesitarás añadir una clave secreta en tu archivo .env
      { expiresIn: '5h' },    // El token expirará en 5 horas
      (err, token) => {
        if (err) throw err;
        res.json({ token }); // Devolvemos el token al cliente
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

// Exportamos el router para poder usarlo en nuestro archivo principal del servidor
module.exports = router;
