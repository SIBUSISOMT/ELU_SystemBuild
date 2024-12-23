const db = require('../config/dbConfig');

class GroupOwnership {
    static findAll() {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM group_ownership ORDER BY created_at DESC';
            
            if (!db) {
                console.error('Database connection not established');
                reject(new Error('Database connection not established'));
                return;
            }

            db.query(query, (error, results) => {
                if (error) {
                    console.error('Database error in findAll:', error);
                    reject(error);
                    return;
                }
                resolve(results || []);
            });
        });
    }

    static findById(id) {
        return new Promise((resolve, reject) => {
            if (!id) {
                reject(new Error('ID is required'));
                return;
            }

            const query = 'SELECT * FROM group_ownership WHERE group_id = ?';
            db.query(query, [id], (error, results) => {
                if (error) {
                    console.error('Database error in findById:', error);
                    reject(error);
                    return;
                }
                resolve(results[0] || null);
            });
        });
    }

    static create(groupData) {
        return new Promise((resolve, reject) => {
            if (!groupData) {
                reject(new Error('Group data is required'));
                return;
            }

            const query = `
                INSERT INTO group_ownership (
                    group_name,
                    description,
                    email,
                    alternative_email,
                    contact_number,
                    alternative_contact,
                    area_name,
                    area_code,
                    property_reference,
                    group_registration_number,
                    group_type,
                    member_count,
                    created_by
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const values = [
                groupData.group_name,
                groupData.description,
                groupData.email,
                groupData.alternative_email,
                groupData.contact_number,
                groupData.alternative_contact,
                groupData.area_name,
                groupData.area_code,
                groupData.property_reference,
                groupData.group_registration_number,
                groupData.group_type,
                groupData.member_count || 0,
                groupData.created_by
            ];

            db.query(query, values, (error, results) => {
                if (error) {
                    console.error('Database error in create:', error);
                    reject(error);
                    return;
                }
                resolve(results);
            });
        });
    }

    static update(id, groupData) {
        return new Promise((resolve, reject) => {
            const query = `
                UPDATE group_ownership
                SET 
                    group_name = COALESCE(?, group_name),
                    description = COALESCE(?, description),
                    email = COALESCE(?, email),
                    alternative_email = ?,
                    contact_number = COALESCE(?, contact_number),
                    alternative_contact = ?,
                    area_name = ?,
                    area_code = ?,
                    property_reference = ?,
                    group_registration_number = ?,
                    group_type = COALESCE(?, group_type),
                    member_count = COALESCE(?, member_count)
                WHERE group_id = ?
            `;

            const values = [
                groupData.group_name,
                groupData.description,
                groupData.email,
                groupData.alternative_email,
                groupData.contact_number,
                groupData.alternative_contact,
                groupData.area_name,
                groupData.area_code,
                groupData.property_reference,
                groupData.group_registration_number,
                groupData.group_type,
                groupData.member_count,
                id
            ];

            db.query(query, values, (error, results) => {
                if (error) {
                    console.error('Database error in update:', error);
                    reject(error);
                    return;
                }
                resolve(results);
            });
        });
    }

    static delete(id) {
        return new Promise((resolve, reject) => {
            const query = 'DELETE FROM group_ownership WHERE group_id = ?';
            db.query(query, [id], (error, results) => {
                if (error) {
                    console.error('Database error in delete:', error);
                    reject(error);
                    return;
                }
                resolve(results);
            });
        });
    }

    static getLatestPropertyRef() {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT property_reference 
                FROM properties 
                ORDER BY id DESC 
                LIMIT 1
            `;
            
            db.query(query, (error, results) => {
                if (error) {
                    console.error('Database error in getLatestPropertyRef:', error);
                    reject(error);
                    return;
                }
                resolve(results[0]?.property_reference || null);
            });
        });
    }
}

module.exports = GroupOwnership;