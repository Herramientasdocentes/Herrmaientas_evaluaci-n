const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload'); // Middleware for file uploads
const { importCsvQuestions, importJsonQuestions } = require('../controllers/importController');

// @route   POST /api/import/csv
// @desc    Import questions from a CSV file
// @access  Private
router.post('/csv', auth, upload.single('file'), importCsvQuestions);

// @route   POST /api/import/json
// @desc    Import questions from a JSON file
// @access  Private
router.post('/json', auth, upload.single('file'), importJsonQuestions);

module.exports = router;
