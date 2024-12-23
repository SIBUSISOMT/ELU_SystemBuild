const db = require('../config/dbConfig');

const PropertyOwner = {
    getAll: async () => {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM property_Owner', (err, results) => {
                if (err) reject(err);
                else {
                    // Map database columns to frontend property names
                    const mappedResults = results.map(owner => ({
                        owner_id: owner.Owner_Id,
                        property_reference: owner.Property_Reference,
                        title_deed_number: owner.Title_Deed_Number,
                        title_deed_holder_name: owner.Title_Deed_Holder_Name,
                        title_deed_holder_surname: owner.Title_Deed_Holder_Surname,
                        residential_area_name: owner.Residential_Area_Name,
                        residential_area_code: owner.Residential_Area_Code,
                        email: owner.Email,
                        alternate_email: owner.Alternative_Email,
                        contact_number: owner.Contact_Number,
                        alternate_contact_number: owner.Alternative_Contact_Number,
                        id_number: owner.Identity_Number,
                        catchment: owner.Catchment,
                        sub_catchment: owner.SubCatchment
                    }));
                    resolve(mappedResults);
                }
            });
        });
    },

    getById: async (id) => {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM property_Owner WHERE Owner_Id = ?', [id], (err, results) => {
                if (err) reject(err);
                else if (results.length === 0) resolve(null);
                else {
                    const owner = {
                        owner_id: results[0].Owner_Id,
                        property_reference: results[0].Property_Reference,
                        title_deed_number: results[0].Title_Deed_Number,
                        title_deed_holder_name: results[0].Title_Deed_Holder_Name,
                        title_deed_holder_surname: results[0].Title_Deed_Holder_Surname,
                        residential_area_name: results[0].Residential_Area_Name,
                        residential_area_code: results[0].Residential_Area_Code,
                        email: results[0].Email,
                        alternate_email: results[0].Alternative_Email,
                        contact_number: results[0].Contact_Number,
                        alternate_contact_number: results[0].Alternative_Contact_Number,
                        id_number: results[0].Identity_Number,
                        catchment: results[0].Catchment,
                        sub_catchment: results[0].SubCatchment
                    };
                    resolve(owner);
                }
            });
        });
    },

    create: async (data) => {
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
        } = data;

        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO property_Owner (
                    Catchment, 
                    SubCatchment, 
                    Property_Reference,
                    Title_Deed_Number, 
                    Title_Deed_Holder_Name, 
                    Title_Deed_Holder_Surname,
                    Residential_Area_Name, 
                    Residential_Area_Code, 
                    Identity_Number, 
                    Email,
                    Alternative_Email, 
                    Contact_Number, 
                    Alternative_Contact_Number
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            const values = [
                catchment, 
                subCatchment, 
                propertyReference, 
                titleDeedNumber,
                ownerName, 
                ownerSurname, 
                residentialAreaName, 
                residentialAreaCode,
                idNumber, 
                email, 
                alternateEmail, 
                contactNumber, 
                alternateContactNumber
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
    }
};

module.exports = PropertyOwner;