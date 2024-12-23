const express = require('express');
const router = express.Router();
const groupOwnershipController = require('../controllers/groupOwnershipController');

// Test route
router.get('/test', (req, res) => {
    res.json({ message: 'Groups router is working' });
});

// CRUD routes
router.get('/', groupOwnershipController.getAllGroups);
router.get('/latest-reference', groupOwnershipController.getLatestPropertyReference);
router.get('/:id', groupOwnershipController.getGroupById);
router.post('/', groupOwnershipController.createGroup);
router.put('/:id', groupOwnershipController.updateGroup);
router.delete('/:id', groupOwnershipController.deleteGroup);

module.exports = router;
