const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

router.get('/check-auth', authMiddleware, (req, res) => {
  const { username, email } = req.user; // `req.user` is set by the JWT auth middleware
  res.status(200).json({ username, email });
});
module.exports = router;
