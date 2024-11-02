const db = require('../config/dbConfig');

const User = {
  create: (username, email, password, Title, callback) => { 
    const query = "INSERT INTO users (username, email, password, title) VALUES (?, ?, ?, ?)";
    db.query(query, [username, email, password, Title], callback);
  },

  findByUsername: (username, callback) => {
    const query = "SELECT * FROM users WHERE username = ?";
    db.query(query, [username], callback);
  },

  findByEmail: (email, callback) => {  // Add this method
    const query = "SELECT * FROM users WHERE email = ?";
    db.query(query, [email], callback);
  }
};

module.exports = User;
