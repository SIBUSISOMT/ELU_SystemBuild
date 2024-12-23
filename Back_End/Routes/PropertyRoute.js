const express = require('express');
const router = express.Router();
const PropertyController = require('../controllers/PropertyController');

// Place the latest-reference route BEFORE the /:id route
router.get('/latest-reference', PropertyController.getLatestPropertyReference);

// Get all properties
router.get('/', PropertyController.getAllProperties);

// Get a property by ID
router.get('/:id', PropertyController.getPropertyById);

// Create a new property
router.post('/', PropertyController.createProperty);

// Update an existing property
router.put('/:id', PropertyController.updateProperty);

// Delete a property
router.delete('/:id', PropertyController.deleteProperty);

module.exports = router;
