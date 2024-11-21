// Back_End/routes/authRoutes.js
const express = require('express');
const path = require('path'); // Import path module
const userController = require('../controllers/authController'); // Adjust the path if necessary

const {
  register,
  login,
  forgotPassword,
  resetPassword,
  getAllUsers,    // New route for getting all users
  editUser,       // New route for editing a user
  deleteUser      // New route for deleting a user 
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


// User Routes for managing users
router.get('/users', getAllUsers); // Route to get all users

// Route for fetching a specific user by ID
router.get('/users/:id', userController.getUserById);  // :id allows dynamic routing for the user ID



// Edit user route (using the user id as a parameter in the URL)
router.put('/users/:id', editUser); // Route to edit a user

// Delete user route (using the user id as a parameter in the URL)
router.delete('/users/:id', deleteUser); // Route to delete a user

module.exports = router;
