// Importamos las librerías necesarias
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); // Librería para encriptar contraseñas
const jwt = require('jsonwebtoken'); // Para generar el JWT
const crypto = require('crypto'); // <-- 1. Importa la librería crypto
const User = require('../models/User'); // Importamos el modelo de Usuario que creamos
const sendEmail = require('../backend/utils/sendEmail'); // Importamos nuestra utilidad de correo

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

// @route   POST api/auth/forgot-password
// @desc    Solicitar restablecimiento de contraseña
// @access  Public
router.post('/forgot-password', async (req, res) => {
  try {
    // 1. Encontrar al usuario por su correo electrónico
    const user = await User.findOne({ email: req.body.email });

    // Por seguridad, siempre enviamos una respuesta positiva, incluso si el usuario no existe.
    // Esto evita que alguien pueda usar este formulario para adivinar qué correos están registrados.
    if (!user) {
      return res.status(200).json({ msg: 'Si existe una cuenta con ese correo, se ha enviado un enlace para restablecer la contraseña.' });
    }

    // 2. Generar un token de restablecimiento aleatorio y seguro
    const resetToken = crypto.randomBytes(20).toString('hex');

    // 3. Encriptar el token antes de guardarlo en la base de datos
    user.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    
    // 4. Establecer una fecha de vencimiento (ej. 10 minutos)
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    // 5. Guardar los cambios en el usuario
    await user.save();

    // 6. Crear la URL de restablecimiento que se enviará en el correo
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    
    // 7. Crear el mensaje del correo
    const message = `
      <h1>Has solicitado restablecer tu contraseña</h1>
      <p>Por favor, haz clic en el siguiente enlace para crear una nueva contraseña. Este enlace es válido por 10 minutos.</p>
      <a href="${resetUrl}" clicktracking=off>${resetUrl}</a>
    `;

    // 8. Enviar el correo electrónico
    try {
      await sendEmail({
        email: user.email,
        subject: 'Restablecimiento de contraseña - Asistente de Evaluaciones',
        message,
      });
      res.status(200).json({ msg: 'Si existe una cuenta con ese correo, se ha enviado un enlace para restablecer la contraseña.' });
    } catch (err) {
      // Si el correo falla, limpiamos el token para que el usuario pueda intentarlo de nuevo
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();
      console.error('Error al enviar el correo:', err);
      return res.status(500).send('Error al enviar el correo de restablecimiento.');
    }

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

// @route   POST api/auth/reset-password/:token
// @desc    Restablecer la contraseña del usuario usando el token
// @access  Public
router.post('/reset-password/:token', async (req, res) => {
  try {
    // 1. Encriptar el token que viene en la URL para poder compararlo con el que está en la base de datos
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    // 2. Buscar al usuario que tenga ese token y cuya fecha de vencimiento aún no haya pasado
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }, // $gt significa "greater than" (mayor que ahora)
    });

    // Si no se encuentra un usuario o el token ya expiró, se envía un error
    if (!user) {
      return res.status(400).json({ msg: 'El token para restablecer la contraseña no es válido o ha expirado.' });
    }

    // 3. Si el token es válido, procedemos a cambiar la contraseña
    // Obtenemos la nueva contraseña del cuerpo de la solicitud
    const { password } = req.body;

    // 4. Encriptamos la nueva contraseña antes de guardarla
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // 5. Limpiamos los campos del token de restablecimiento para que no pueda ser usado de nuevo
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    // 6. Guardamos los cambios en el usuario
    await user.save();

    // 7. Enviamos una respuesta de éxito
    res.status(200).json({ msg: 'La contraseña ha sido restablecida exitosamente.' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

// Exportamos el router para poder usarlo en nuestro archivo principal del servidor
module.exports = router;
