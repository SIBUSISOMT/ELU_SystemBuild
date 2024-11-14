const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path'); // Import path module
const authRoutes = require('./routes/authRoutes'); // Use the updated routes

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from Front_End directory
app.use(express.static(path.join(__dirname, '../Front_End')));
// server.js
app.use('/Front_End', express.static(path.join(__dirname, '../Front_End')));
 
app.use('/auth', authRoutes); 


// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
