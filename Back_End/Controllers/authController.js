const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const authController = {
  // Register new user
  register: async (req, res) => {
    try {
      const { FirstName, LastName, username, email, password, Title } = req.body;

      // Check if user already exists
      User.findByEmail(email, async (err, results) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Database error during registration'
          });
        }

        if (results && results.length > 0) {
          return res.status(400).json({
            success: false,
            message: 'Email already registered'
          });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        User.create(FirstName, LastName, username, email, hashedPassword, Title, (err, result) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: 'Error creating user'
            });
          }

          res.status(201).json({
            success: true,
            message: 'User registered successfully'
          });
        });
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error during registration'
      });
    }
  },

  // Login user
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      User.findByEmail(email, async (err, results) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Database error during login'
          });
        }

        if (!results || results.length === 0) {
          return res.status(401).json({
            success: false,
            message: 'Invalid credentials'
          });
        }

        const user = results[0];
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
          return res.status(401).json({
            success: false,
            message: 'Invalid credentials'
          });
        }

        // Create JWT token
        const token = jwt.sign(
          { id: user.id, email: user.email },
          process.env.JWT_SECRET || 'your-secret-key',
          { expiresIn: '24h' }
        );

        res.json({
          success: true,
          token,
          user: {
            id: user.id,
            email: user.email,
            username: user.username
          }
        });
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error during login'
      });
    }
  },

  // Forgot password
  forgotPassword: (req, res) => {
    const { email } = req.body;
    
    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');

    User.updateResetToken(email, resetToken, (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Error processing password reset request'
        });
      }

      // In a real application, send email with reset link
      res.json({
        success: true,
        message: 'Password reset instructions sent to email'
      });
    });
  },

  // Reset password
  resetPassword: async (req, res) => {
    try {
      const { token, password } = req.body;

      User.findByResetToken(token, async (err, results) => {
        if (err || !results || results.length === 0) {
          return res.status(400).json({
            success: false,
            message: 'Invalid or expired reset token'
          });
        }

        const user = results[0];
        const hashedPassword = await bcrypt.hash(password, 10);

        User.updatePassword(user.id, hashedPassword, (err, result) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: 'Error resetting password'
            });
          }

          res.json({
            success: true,
            message: 'Password reset successful'
          });
        });
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error during password reset'
      });
    }
  },

  // Get all users
  getAllUsers: (req, res) => {
    User.getAllUsers((err, results) => {
      if (err) {
        console.error('Error fetching users:', err);
        return res.status(500).json({
          success: false,
          message: 'Error loading users'
        });
      }
      res.json(results);
    });
  },

  // Get user by ID
  getUserById: (req, res) => {
    const userId = req.params.id;

    User.findById(userId, (err, results) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Error fetching user'
        });
      }

      if (!results || results.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json(results[0]);
    });
  },

  // Edit user
  editUser: (req, res) => {
    const userId = req.params.id;
    const { FirstName, LastName, username, email, Title } = req.body;

    if (!FirstName || !LastName || !username || !email) {
      return res.status(400).json({
        success: false,
        message: 'Required fields missing'
      });
    }

    User.updateUser(userId, FirstName, LastName, username, email, Title, (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Error updating user'
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        message: 'User updated successfully',
        user: { id: userId, FirstName, LastName, username, email, Title }
      });
    });
  },

  // Delete user
  deleteUser: (req, res) => {
    const userId = req.params.id;

    User.deleteUser(userId, (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Error deleting user'
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        message: 'User deleted successfully'
      });
    });
  }
};

module.exports = authController;