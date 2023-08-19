const express = require('express');
const filterConrtoller = require('../controllers/filterController');

const router = express.Router();

// Search hotels by name and location
router.get('/search', filterConrtoller.searchHotels);
//router.get('/rooms', filterConrtoller.searchAvailableRooms);

module.exports = router;
