const PropertyOwner = require('../models/propertyOwner'); // Adjust this as needed

// Get all property owners
exports.getAllPropertyOwners = async (req, res) => {
  try {
    const propertyOwners = await PropertyOwner.getAll();
    res.json(propertyOwners);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching property owners', error: error.message });
  }
};

// Create a new property owner
exports.createPropertyOwner = async (req, res) => {
  try {
    const {
      catchment,
      subCatchment,
      ownerName,
      ownerSurname,
      propertyReference,
      titleDeedNumber,
      residentialAreaName,
      residentialAreaCode,
      idNumber,
      email,
      alternateEmail,
      contactNumber,
      alternateContactNumber
    } = req.body;

    // Validate all required fields
    const requiredFields = {
      catchment,
      subCatchment,
      ownerName,
      ownerSurname,
      propertyReference,
      titleDeedNumber,
      residentialAreaName,
      residentialAreaCode,
      idNumber,
      email,
      contactNumber
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      return res.status(400).json({ 
        message: 'Missing required fields', 
        missingFields: missingFields 
      });
    }

    // Create the property owner
    const newPropertyOwner = await PropertyOwner.create(req.body);
    res.status(201).json(newPropertyOwner);
  } catch (error) {
    res.status(400).json({ message: 'Error creating property owner', error: error.message });
  }
};

// Delete a property owner
exports.deletePropertyOwner = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await PropertyOwner.delete(id); // Assuming delete method is defined in the model for raw queries

    // Check if the property owner was found and deleted
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Property owner not found' });
    }

    res.status(204).send(); // No content to send back
  } catch (error) {
    res.status(400).json({ message: 'Error deleting property owner', error: error.message });
  }
};