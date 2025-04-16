const express = require('express');
const router = express.Router();
const { createCanvas,fetchSheets,searchSheets } = require('../controllers/CanvasController');
const authMiddleware = require('../middleware/authMiddleware'); // Ensure JWT is verified

router.post('/create', authMiddleware, createCanvas);

router.post('/visible-sheets', authMiddleware, fetchSheets);

router.get('/search', authMiddleware, searchSheets);

module.exports = router;
