const express = require('express');
const router = express.Router();

const roomController = require('../controllers/roomController');
router.post('/addRoom', roomController.createRoom);
router.get('/hotelRooms', roomController.getAllRooms);
router.get('/view/:id', roomController.getRoomById);
router.put('/update/:id', roomController.updateRoom);
router.delete('/delete/:id', roomController.deleteRoom);

module.exports = router;
