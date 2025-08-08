const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const { getUsers, getUserById, updateUser, deleteUser, createUser } = require('../controllers/userController');

// @route   GET api/users
// @desc    Obtener todos los usuarios
// @access  Private/Admin
router.get('/', auth, adminAuth, getUsers);

// @route   GET api/users/:id
// @desc    Obtener un usuario por ID
// @access  Private/Admin
router.get('/:id', auth, adminAuth, getUserById);

// @route   PUT api/users/:id
// @desc    Actualizar usuario (incluyendo rol)
// @access  Private/Admin
router.put('/:id', auth, adminAuth, updateUser);

// @route   DELETE api/users/:id
// @desc    Eliminar usuario
// @access  Private/Admin
router.delete('/:id', auth, adminAuth, deleteUser);

// @route   POST api/users
// @desc    Crear un nuevo usuario
// @access  Private/Admin
router.post('/', auth, adminAuth, createUser);

module.exports = router;
