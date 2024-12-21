const PropertyModel = require('../models/PropertyModel');

// Get all properties
exports.getAllProperties = (req, res) => {
    PropertyModel.getAllProperties((err, properties) => {
        if (err) return res.status(500).json({ error: 'Failed to fetch properties' });
        res.json(properties);
    });
};

// Get a property by ID
exports.getPropertyById = (req, res) => {
    const id = req.params.id;
    PropertyModel.getPropertyById(id, (err, property) => {
        if (err) return res.status(500).json({ error: 'Failed to fetch property' });
        if (!property) return res.status(404).json({ error: 'Property not found' });
        res.json(property);
    });
};

// Create a new property
exports.createProperty = (req, res) => {
    const propertyData = req.body;
    PropertyModel.createProperty(propertyData, (err, result) => {
        if (err) return res.status(500).json({ error: 'Failed to create property' });

        // On successful creation, send a success message
        res.status(201).json({ 
            success: true, 
            message: 'Property created successfully',
            redirectUrl: 'main.html' 
        });
    });
};

// Update an existing property
exports.updateProperty = (req, res) => {
    const id = req.params.id;
    const propertyData = req.body;
    PropertyModel.updateProperty(id, propertyData, (err, result) => {
        if (err) return res.status(500).json({ error: 'Failed to update property' });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Property not found' });
        res.json({ message: 'Property updated successfully' });
    });
};

// Delete a property
exports.deleteProperty = (req, res) => {
    const id = req.params.id;
    PropertyModel.deleteProperty(id, (err, result) => {
        if (err) return res.status(500).json({ error: 'Failed to delete property' });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Property not found' });
        res.json({ message: 'Property deleted successfully' });
    });
};
