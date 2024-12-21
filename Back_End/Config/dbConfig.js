// dbConfig.js
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Mabulala@18',
  database: 'Elu_Database'
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL Database.");
});

module.exports = db;
