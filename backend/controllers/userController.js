const User = require('../models/User');
const bcrypt = require('bcryptjs');

// @desc    Obtener todos los usuarios
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password'); // Excluir contraseñas
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del Servidor');
  }
};

// @desc    Obtener un usuario por ID
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del Servidor');
  }
};

// @desc    Actualizar usuario (incluyendo rol)
// @route   PUT /api/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res) => {
  const { nombre, email, rol, password } = req.body;

  try {
    let user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    // No permitir que un admin se degrade a sí mismo si es el único admin
    // (Lógica más compleja para producción, aquí simplificado)
    if (user.id === req.user.id && rol && rol !== 'administrador') {
      const adminCount = await User.countDocuments({ rol: 'administrador' });
      if (adminCount === 1) {
        return res.status(400).json({ msg: 'No puedes degradar al único administrador del sistema.' });
      }
    }

    user.nombre = nombre || user.nombre;
    user.email = email || user.email;
    user.rol = rol || user.rol;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del Servidor');
  }
};

// @desc    Eliminar usuario
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    // No permitir que un admin se elimine a sí mismo si es el único admin
    if (user.id === req.user.id) {
      const adminCount = await User.countDocuments({ rol: 'administrador' });
      if (adminCount === 1) {
        return res.status(400).json({ msg: 'No puedes eliminar al único administrador del sistema.' });
      }
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Usuario eliminado exitosamente' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del Servidor');
  }
};

// @desc    Crear un nuevo usuario
// @route   POST /api/users
// @access  Private/Admin
exports.createUser = async (req, res) => {
  const { nombre, email, password, rol } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'El usuario con este correo electrónico ya existe.' });
    }

    user = new User({
      nombre,
      email,
      password,
      rol: rol || 'docente', // Por defecto, si no se especifica, es 'docente'
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    res.status(201).json({ msg: 'Usuario creado exitosamente', user: user.id });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del Servidor');
  }
};
