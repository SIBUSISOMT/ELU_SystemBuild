const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const connection = require('./config/dbConfig');

const groupOwnershipRoutes = require('./routes/groupOwnershipRoutes');
const authRoutes = require('./routes/authRoutes');
const propertyOwnerRoutes = require('./routes/propertyOwnerRoutes');
const propertyRoutes = require('./routes/PropertyRoute');

const app = express();
const PORT = 3000;


// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:5501'], // Frontend port
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, '../Front_End')));
app.use('/Front_End', express.static(path.join(__dirname, '../Front_End')));

// Request logger
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// API Routes
app.use('/auth', authRoutes);
app.use('/api/property-owners', propertyOwnerRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/groups', groupOwnershipRoutes);

// Error handler middleware (after routes)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
}); 

// Database connection and server start
connection.connect((err) => {
    if (err) {
        console.error('Unable to connect to the database:', err.stack);
    } else {
        console.log('Database connected successfully');
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    }
});

module.exports = app;