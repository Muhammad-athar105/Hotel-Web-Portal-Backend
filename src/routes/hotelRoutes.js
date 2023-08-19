const express = require('express');
const hotelController = require('../controllers/hotelController');


const router = express.Router();
//Routes 

router.post('/create', hotelController.createHotel);
router.post('/login', hotelController.login);
router.get('/viewhotels', hotelController.getHotels);
router.get('/:id/location', hotelController.getHotelLocation);
router.get('/hotel/:id', hotelController.getHotelById);
router.put('/update/:id', hotelController.updateHotel);
router.delete('/delete/:id', hotelController.deleteHotel);
// router.post('/upload', hotelController.uploadHandler);

module.exports = router;
