const express = require('express');
const router = express.Router();
const propertyOwnerController = require('../controllers/propertyOwnerController'); // Ensure correct path

// Ensure correct routes are connected to controller methods
router.get('/', propertyOwnerController.getAllPropertyOwners);  // List all property owners
router.post('/', propertyOwnerController.createPropertyOwner);  // Create a property owner
router.delete('/:id', propertyOwnerController.deletePropertyOwner);  // Delete a property owner by ID

module.exports = router;
