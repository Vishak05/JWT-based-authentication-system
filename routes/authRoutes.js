const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// Protected routes
router.get('/profile', authController.verifyToken, authMiddleware.protect, (req, res) => {
    res.json({ user: req.user });
});

// Admin route
router.get('/admin', authController.verifyToken, authMiddleware.protect, authMiddleware.restrictTo(['admin']), (req, res) => {
    res.json({ message: 'Welcome Admin' });
});

module.exports = router;
