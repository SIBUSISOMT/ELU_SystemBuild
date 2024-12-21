const db = require('../config/dbConfig');

// Define the queries that will be used in controllers
const PropertyOwner = {
  getAll: async () => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM property_Owner', (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  },

  create: async (data) => {
    const {
      catchment, subCatchment, ownerName, ownerSurname, 
      propertyReference, titleDeedNumber, residentialAreaName, 
      residentialAreaCode, idNumber, email, 
      alternateEmail, contactNumber, alternateContactNumber
    } = data;

    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO property_Owner (
          catchment, subCatchment, Property_Reference, 
          Title_Deed_Number, Title_Deed_Holder_Name, Title_Deed_Holder_Surname, 
          Residential_Area_Name, Residential_Area_Code, Identity_Number, Email, 
          Alternative_Email, Contact_Number, Alternative_Contact_Number
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const values = [
        catchment, subCatchment, propertyReference, titleDeedNumber,
        ownerName, ownerSurname, residentialAreaName, residentialAreaCode,
        idNumber, email, alternateEmail, contactNumber, alternateContactNumber
      ];

      db.query(query, values, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  },

  delete: async (id) => {
    return new Promise((resolve, reject) => {
      db.query('DELETE FROM property_Owner WHERE Owner_Id = ?', [id], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  },

  getById: async (id) => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM property_Owner WHERE Owner_Id = ?', [id], (err, results) => {
        if (err) reject(err);
        else resolve(results[0]);
      });
    });
  }
};

module.exports = PropertyOwner;
