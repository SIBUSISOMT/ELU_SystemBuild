
const GroupOwnership = require('../models/GroupOwnership');
const db = require('../config/dbConfig');

// Validation helpers
const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validatePhoneNumber = (phone) => {
    return /^\+?[\d\s-]{10,}$/.test(phone);
};

const validateRequiredFields = (data) => {
    const required = ['group_name', 'email', 'contact_number', 'group_type'];
    return required.filter(field => !data[field]);
};


// Helper function to get latest property reference
const getLatestPropertyRef = async () => {
    try {
        const query = `
            SELECT property_reference 
            FROM properties 
            ORDER BY id DESC 
            LIMIT 1`;
        
        return new Promise((resolve, reject) => {
            db.query(query, (error, results) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(results[0]?.property_reference || null);
            });
        });
    } catch (error) {
        console.error('Error in getLatestPropertyRef:', error);
        throw error;
    }
};

const groupOwnershipController = {
    getAllGroups: async (req, res) => {
        try {
            const groups = await GroupOwnership.findAll();
            res.json({
                success: true,
                data: groups
            });
        } catch (error) {
            console.error('Error in getAllGroups:', error);
            res.status(500).json({
                success: false,
                message: "Failed to retrieve groups",
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    },

    getLatestPropertyReference: async (req, res) => {
        try {
            const propertyRef = await getLatestPropertyRef();
            res.json({ propertyReference: propertyRef });
        } catch (error) {
            console.error('Error fetching latest property reference:', error);
            res.status(500).json({ message: 'Database error' });
        }
    },

    getGroupById: async (req, res) => {
        try {
            const group = await GroupOwnership.findById(req.params.id);
            if (!group) {
                return res.status(404).json({
                    success: false,
                    message: "Group not found",
                    details: `No group exists with ID ${req.params.id}`
                });
            }
            res.json({
                success: true,
                data: group
            });
        } catch (error) {
            console.error('Error in getGroupById:', error);
            res.status(500).json({
                success: false,
                message: "Error retrieving group",
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    },

    createGroup: async (req, res) => {
        try {
            // Validate required fields
            const missingFields = validateRequiredFields(req.body);
            if (missingFields.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: "Missing required fields",
                    details: `Please provide: ${missingFields.join(', ')}`
                });
            }

            // Validate email and alternative email
            if (!validateEmail(req.body.email)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid email format"
                });
            }

            if (req.body.alternative_email && !validateEmail(req.body.alternative_email)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid alternative email format"
                });
            }

            // Validate phone numbers
            if (!validatePhoneNumber(req.body.contact_number)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid contact number"
                });
            }

            if (req.body.alternative_contact && !validatePhoneNumber(req.body.alternative_contact)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid alternative contact number"
                });
            }

            const propertyRef = await getLatestPropertyRef();
            const result = await GroupOwnership.create({
                ...req.body,
                property_reference: propertyRef
            });

            res.status(201).json({
                success: true,
                message: "Group created successfully",
                data: { 
                    id: result.insertId,
                    property_reference: propertyRef
                }
            });
        } catch (error) {
            console.error('Error in createGroup:', error);
            res.status(500).json({
                success: false,
                message: "Failed to create group",
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    },

    updateGroup: async (req, res) => {
        try {
            const existingGroup = await GroupOwnership.findById(req.params.id);
            if (!existingGroup) {
                return res.status(404).json({
                    success: false,
                    message: "Group not found"
                });
            }

            // Validate email and alternative email if provided
            if (req.body.email && !validateEmail(req.body.email)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid email format"
                });
            }

            if (req.body.alternative_email && !validateEmail(req.body.alternative_email)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid alternative email format"
                });
            }

            // Validate phone numbers if provided
            if (req.body.contact_number && !validatePhoneNumber(req.body.contact_number)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid contact number"
                });
            }

            if (req.body.alternative_contact && !validatePhoneNumber(req.body.alternative_contact)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid alternative contact number"
                });
            }

            await GroupOwnership.update(req.params.id, req.body);
            res.json({
                success: true,
                message: "Group updated successfully"
            });
        } catch (error) {
            console.error('Error in updateGroup:', error);
            res.status(500).json({
                success: false,
                message: "Failed to update group",
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    },

    deleteGroup: async (req, res) => {
        try {
            const existingGroup = await GroupOwnership.findById(req.params.id);
            if (!existingGroup) {
                return res.status(404).json({
                    success: false,
                    message: "Group not found"
                });
            }

            await GroupOwnership.delete(req.params.id);
            res.json({
                success: true,
                message: "Group deleted successfully"
            });
        } catch (error) {
            console.error('Error in deleteGroup:', error);
            res.status(500).json({
                success: false,
                message: "Failed to delete group",
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
};

module.exports = groupOwnershipController;