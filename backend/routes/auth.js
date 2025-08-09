const express = require('express');
const router = express.Router();
const passport = require('passport');


const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Ruta de prueba para auth
router.get('/', (req, res) => {
  res.send('Auth route funcionando');
});

// Middleware de validación de datos de usuario
const validateUser = require('../middleware/validateUser');

// Controlador de registro de usuario
const { registerUser } = require('../controllers/authController');
router.post('/register', validateUser, registerUser);

// Login de usuario
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ msg: 'Todos los campos son obligatorios.' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Credenciales inválidas.' });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ msg: 'Credenciales inválidas.' });
    }
        if (!process.env.JWT_SECRET) {
      console.error('FATAL ERROR: JWT_SECRET no está definida.');
      return res.status(500).json({ msg: 'Error interno del servidor.' });
    }
    const token = jwt.sign({ id: user._id, rol: user.rol }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
  } catch (err) {
    console.error('Error en /login:', err);
    res.status(500).json({ msg: 'Error en el login.' });
  }
});

const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

// Solicitud de restablecimiento de contraseña
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ msg: 'No hay usuario con ese correo electrónico.' });
    }

    // Generar token de restablecimiento
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.passwordResetExpires = Date.now() + 3600000; // 1 hora

    await user.save();

    // Crear URL de restablecimiento
    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const messageTemplate = `
      <h1>Has solicitado un restablecimiento de contraseña</h1>
      <p>Por favor, ve a este enlace para restablecer tu contraseña:</p>
      <a href="${resetURL}" clicktracking="off">${resetURL}</a>
      <p>Este enlace expirará en 1 hora.</p>
      <p>Si no solicitaste esto, por favor ignora este correo.</p>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Restablecimiento de Contraseña - Asistente de Evaluaciones Anluis',
        template: messageTemplate,
        variables: { resetURL: resetURL }
      });

      res.status(200).json({ msg: 'Correo de restablecimiento enviado.' });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();
      console.error('Error al enviar el correo de restablecimiento:', err);
      return res.status(500).json({ msg: 'Error al enviar el correo de restablecimiento.' });
    }

  } catch (err) {
    console.error('Error en /forgot-password:', err);
    res.status(500).json({ msg: 'Error en la solicitud de restablecimiento de contraseña.' });
  }
});

// Restablecer contraseña
router.put('/reset-password/:token', async (req, res) => {
  try {
    const resetToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
      passwordResetToken: resetToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ msg: 'Token inválido o expirado.' });
    }

    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ msg: 'La nueva contraseña es obligatoria.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ msg: 'La contraseña debe tener al menos 6 caracteres.' });
    }

    user.password = await bcrypt.hash(password, 10);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    res.status(200).json({ msg: 'Contraseña restablecida correctamente.' });

  } catch (err) {
    console.error('Error en /reset-password:', err);
    res.status(500).json({ msg: 'Error al restablecer la contraseña.' });
  }
});

// Rutas de autenticación de Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Autenticación exitosa, redirigir al frontend o enviar un token
    // Aquí puedes generar un JWT y enviarlo al cliente
    res.redirect(process.env.FRONTEND_URL || '/');
  }
);

module.exports = router;
