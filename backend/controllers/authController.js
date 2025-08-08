const User = require('../models/User');
const bcrypt = require('bcryptjs');

/**
 * Controlador para registrar un nuevo usuario
 * @param {Request} req
 * @param {Response} res
 */
async function registerUser(req, res) {
  try {
    const { nombre, email, password } = req.body;
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
}

module.exports = { registerUser };
