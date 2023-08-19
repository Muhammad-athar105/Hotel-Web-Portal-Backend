const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');

router.post('/reserveRoom', reservationController.createReservation);
router.get('/view', reservationController.getReservations);
router.get('/view/:id', reservationController.getReservationById);
router.put('/update/:id', reservationController.updateReservation);
router.delete('/delete/:id', reservationController.deleteReservation);
router.put('/approve/:id', reservationController.approveReservation);
router.put('/reject/:id', reservationController.rejectReservation);
router.put('/pending/:id', reservationController.pendingReservation);


module.exports = router;
