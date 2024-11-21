const db = require('../config/dbConfig');

const User = {
  // Method to create a new user
  create: (FirstName, LastName, username, email, password, Title, callback) => { 
    const query = "INSERT INTO users (FirstName, LastName, username, email, password, Title) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(query, [FirstName, LastName, username, email, password, Title], callback);
  },

  // Find user by username
  findByUsername: (username, callback) => {
    const query = "SELECT * FROM users WHERE username = ?";
    db.query(query, [username], callback);
  },

  // Find user by email
  findByEmail: (email, callback) => {
    const query = "SELECT * FROM users WHERE email = ?";
    db.query(query, [email], callback);
  },

  // Update the reset token and expiration time
  updateResetToken: (email, resetToken, callback) => {
    const expirationTime = new Date(Date.now() + 20 * 60 * 1000); // 20 minutes from now
    const query = "UPDATE users SET reset_token = ?, reset_token_expire = ? WHERE email = ?";
    db.query(query, [resetToken, expirationTime, email], callback);
  },

  // Find user by reset token
  findByResetToken: (token, callback) => {
    const query = "SELECT * FROM users WHERE reset_token = ? AND reset_token_expire > NOW()";
    db.query(query, [token], callback);
  },

  // Update user password and clear reset token fields
  updatePassword: (id, hashedPassword, callback) => {
    const query = "UPDATE users SET password = ?, reset_token = NULL, reset_token_expire = NULL WHERE id = ?";
    db.query(query, [hashedPassword, id], callback);
  },

  // Get all users
  getAllUsers: (callback) => {
    const query = "SELECT * FROM users";
    db.query(query, callback);
  },
  // Find user by ID
findById: (id, callback) => {
  const query = "SELECT * FROM users WHERE id = ?";
  db.query(query, [id], callback);
},


  // Update user details (excluding password)
  updateUser: (id, FirstName, LastName, username, email, Title, callback) => {
    const query = "UPDATE users SET FirstName = ?, LastName = ?, username = ?, email = ?, Title = ? WHERE id = ?";
    db.query(query, [FirstName, LastName, username, email, Title, id], callback);
  },

  // Delete user
  deleteUser: (id, callback) => {
    const query = "DELETE FROM users WHERE id = ?";
    db.query(query, [id], callback);
  }
};

module.exports = User;
