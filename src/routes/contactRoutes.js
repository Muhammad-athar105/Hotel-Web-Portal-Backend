
const express = require('express');
const contactController = require('../controllers/contactController');

const router = express.Router();

// Routes
router.post('/create', contactController.createContact);
router.get('/getAll', contactController.getAllContact);
router.get('/getById/:id', contactController.getContactById);
router.put('/update/:id', contactController.updateContact);
router.delete('/delete/:id', contactController.deleteContact);

module.exports = router;
