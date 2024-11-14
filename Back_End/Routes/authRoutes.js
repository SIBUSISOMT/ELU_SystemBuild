// Back_End/routes/authRoutes.js
const express = require('express');
const path = require('path'); // Import path module
const {
  register,
  login,
  forgotPassword,
  resetPassword // Import the resetPassword function
} = require('../controllers/authController');

const router = express.Router();

// User Registration
router.post('/register', register);

// User Login
router.post('/login', login);

// Forgot Password
router.post('/forgot-password', forgotPassword);

// In authRoutes.js
router.get('/reset-password', (req, res) => {
  res.redirect('/Html_Pages/PasswordReset.html');
});

// Reset Password
router.post('/reset-password', resetPassword); // Add the reset password route

module.exports = router;
