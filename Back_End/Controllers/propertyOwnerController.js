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

    // Validate required fields
    if (!ownerName || !propertyReference || !titleDeedNumber || !email || !catchment) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Adjusting field names to match the database schema
    const newPropertyOwner = await PropertyOwner.create({
      catchment,
      subCatchment,
      title_deed_holder_name: ownerName,
      title_deed_holder_surname: ownerSurname,
      property_reference: propertyReference,
      title_deed_number: titleDeedNumber,
      residential_area_name: residentialAreaName,
      residential_area_code: residentialAreaCode,
      id_number: idNumber,
      email,
      alternate_email: alternateEmail,
      contact_number: contactNumber,
      alternate_contact_number: alternateContactNumber
    });

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