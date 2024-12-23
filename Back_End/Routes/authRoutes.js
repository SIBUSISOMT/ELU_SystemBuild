const express = require('express');
const userController = require('../controllers/authController');
const router = express.Router();

// Authentication Routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// Password Management Routes
router.post('/forgot-password', userController.forgotPassword);
router.get('/reset-password', (req, res) => {
  res.redirect('/Html_Pages/PasswordReset.html');
});
router.post('/reset-password', userController.resetPassword);

// User Management Routes
// GET all users
router.get('/users', userController.getAllUsers);

// GET single user
router.get('/users/:id', userController.getUserById);

// UPDATE user
router.put('/users/:id', userController.editUser);

// DELETE user
router.delete('/users/:id', userController.deleteUser);

module.exports = router;