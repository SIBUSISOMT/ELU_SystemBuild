const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const connection = require('./config/dbConfig'); // Assuming the MySQL connection is set correctly

// Routes
const authRoutes = require('./routes/authRoutes');
const propertyOwnerRoutes = require('./Routes/propertyOwnerRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());  // Enable Cross-Origin Resource Sharing
app.use(bodyParser.json());  // Parse JSON requests
app.use(bodyParser.urlencoded({ extended: true }));  // Parse URL-encoded data

// Serve static files from Front_End directory
app.use(express.static(path.join(__dirname, '../Front_End')));

// Serve static files for the Front-End (useful for single-page apps)
app.use('/Front_End', express.static(path.join(__dirname, '../Front_End')));

// API Routes
app.use('/auth', authRoutes);
app.use('/api/property-owners', propertyOwnerRoutes); // Property Owner API routes

const propertyRoutes = require('./routes/PropertyRoute');
app.use('/api/properties', propertyRoutes);


// Database connection and server start
connection.connect((err) => {
  if (err) {
    console.error('Unable to connect to the database:', err.stack);
  } else {
    console.log('Database connected successfully');

    // Start the server after successful DB connection
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }
});
