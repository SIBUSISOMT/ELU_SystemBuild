const bcrypt = require('bcrypt');
const User = require('../models/User');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'Gmail',  
  auth: {
    user: 'sbusisozamowakhe18@gmail.com', 
    pass: 'gryr khog dboq fwng',
  },
});

// Registration
exports.register = async (req, res) => {
  const { username, email, password, Title } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // Corrected the create method to include the Title parameter
    User.create(username, email, hashedPassword, Title, (err, result) => {
      if (err) {
        console.error("Error during user creation:", err); // Log the error
        return res.status(500).send("Error registering user.");
      }
      res.status(201).send("User registered successfully.");
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).send("An error occurred during registration.");
  }
};

// Login
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    User.findByUsername(username, async (err, results) => {
      if (err || results.length === 0) {
        return res.status(401).send("User not found.");
      }

      const user = results[0];
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).send("Invalid Credentials.");
      }

      // Send a JSON response with the redirect URL instead of using res.redirect
      res.status(200).json({ redirectUrl: '/Front_End/Html_Pages/Dashboard.html' });
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send("An error occurred during login.");
  }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  console.log("Forgot Password Request Received for:", email); // Log incoming request

  try {
    User.findByEmail(email, async (err, results) => {
      if (err) {
        console.error("Database error:", err); // Log database error
        return res.status(500).send("Internal server error.");
      }

      if (results.length === 0) {
        console.warn("Email not registered:", email); // Log unregistered email
        return res.status(404).send("Email not registered.");
      }

      const user = results[0];
      const token = crypto.randomBytes(32).toString('hex');

      console.log("Generated reset token:", token); // Log generated token

      // Send the password reset email
      const resetLink = `http://localhost:3000/reset-password?token=${token}&id=${user.id}`;
      const mailOptions = {
        from: 'sbusisozamowakhe18@gmail.com',
        to: email,
        subject: 'Password Reset',
        text: `Click the following link to reset your password: ${resetLink}`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error); // Log email sending error
          return res.status(500).send("Error sending email.");
        }
        console.log("Password reset email sent:", info); // Log successful email
        res.status(200).send("Password reset link sent to your email.");
      });
    });
  } catch (error) {
    console.error("Forgot password error:", error); // Log unexpected error
    res.status(500).send("An error occurred while processing your request.");
  }
};

// Password Reset
exports.resetPassword = async (req, res) => {
  const { token, id, newPassword, confirmPassword } = req.body;

  if (newPassword !== confirmPassword) {
    return res.status(400).send("Passwords do not match.");
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password in the database for the user with the given id
    const query = "UPDATE users SET password = ? WHERE id = ?";
    db.query(query, [hashedPassword, id], (err, results) => {
      if (err) {
        console.error("Error updating password:", err);
        return res.status(500).send("Error updating password.");
      }
      res.status(200).send("Password has been reset successfully.");
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).send("An error occurred while resetting the password.");
  }
};