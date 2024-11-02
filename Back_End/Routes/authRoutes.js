// Back_End/routes/authRoutes.js
const express = require('express');
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

// Reset Password
router.post('/reset-password', resetPassword); // Add the reset password route

module.exports = router;
