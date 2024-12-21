const db = require('../config/dbConfig');

// Fetch all properties
exports.getAllProperties = (callback) => {
    const query = 'SELECT * FROM properties';
    db.query(query, (err, results) => callback(err, results));
};

// Fetch a single property by ID
exports.getPropertyById = (id, callback) => {
    const query = 'SELECT * FROM properties WHERE id = ?';
    db.query(query, [id], (err, results) => callback(err, results[0]));
};

// Create a new property
exports.createProperty = (data, callback) => {
    console.log('Attempting to create property with data:', data);
    
    const query = `
        INSERT INTO properties (
            Property_Reference, Warms_Number, Title_Deed_Number, Sub_Catchment_Name, 
            Property_Area_Name, Property_Area_Code, Farm_Size_HA
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    const values = [
        data.propertyReference, 
        data.warmsNumber, 
        data.titleDeedNumber,
        data.subCatchmentName, 
        data.propertyAreaName, 
        data.propertyAreaCode, 
        data.farmSizeHA
    ];
    
    console.log('SQL Query:', query);
    console.log('Values to insert:', values);
    
    db.query(query, values, (err, results) => {
        if (err) {
            console.error('Database error:', err);
        } else {
            console.log('Insert successful:', results);
        }
        callback(err, results);
    });
};

// Update an existing property
exports.updateProperty = (id, data, callback) => {
    const query = `
        UPDATE properties 
        SET 
            Property_Reference = ?, Warms_Number = ?, Title_Deed_Number = ?, 
            Sub_Catchment_Name = ?, Property_Area_Name = ?, Property_Area_Code = ?, 
            Farm_Size_HA = ? 
        WHERE id = ?
    `;
    const values = [
        data.propertyReference, data.warmsNumber, data.titleDeedNumber,
        data.subCatchmentName, data.propertyAreaName, data.propertyAreaCode, data.farmSizeHA, id
    ];
    db.query(query, values, (err, results) => callback(err, results));
};

// Delete a property
exports.deleteProperty = (id, callback) => {
    const query = 'DELETE FROM properties WHERE id = ?';
    db.query(query, [id], (err, results) => callback(err, results));
};
