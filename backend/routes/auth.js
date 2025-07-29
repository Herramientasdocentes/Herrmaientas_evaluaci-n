const express = require('express');
const router = express.Router();


const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Ruta de prueba para auth
router.get('/', (req, res) => {
  res.send('Auth route funcionando');
});

// Registro de usuario
router.post('/register', async (req, res) => {
  try {
    const { nombre, email, password } = req.body;
    if (!nombre || !email || !password) {
      return res.status(400).json({ msg: 'Todos los campos son obligatorios.' });
    }
    const existe = await User.findOne({ email });
    if (existe) {
      return res.status(400).json({ msg: 'El usuario ya existe.' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ nombre, email, password: hashed });
    await user.save();
    res.status(201).json({ msg: 'Usuario registrado correctamente.' });
  } catch (err) {
    res.status(500).json({ msg: 'Error en el registro.' });
  }
});

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
    const token = jwt.sign({ id: user._id, rol: user.rol }, process.env.JWT_SECRET || 'secreto', { expiresIn: '1d' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ msg: 'Error en el login.' });
  }
});

module.exports = router;
