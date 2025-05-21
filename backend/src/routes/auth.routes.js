const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');
// const { validateLogin } = require('../middlewares/validators/auth.validator'); // 假设有验证器

// POST /api/auth/login
router.post('/login', /* validateLogin, */ authController.login);

// GET /api/auth/me
router.get('/me', authMiddleware.verifyToken, authController.getMe);

module.exports = router; 