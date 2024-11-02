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

// Serve static files from the "Front_End" directory
app.use('/Front_End', express.static(path.join(__dirname, 'Front_End')));

// Routes
app.use('/auth', authRoutes); // Use the auth routes for user operations

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
