const express = require('express');
const router = express.Router();
const reservationController = require('./reservationController');
// Create a reservation
router.post('/reservation/:userId/:eventId', reservationController.createReservation);

// Retrieve reservations
router.get('/reservation/event/:eventId', reservationController.getReservationsForEvent);
router.get('/reservation/user/:userId', reservationController.getReservationsForUser);
router.get('/reservation/:userId/:eventId', reservationController.getReservation);

// Edit a reservation
router.put('/reservation/:reservationId/:userId', reservationController.editReservation);

// Delete reservations
router.delete('/reservation/event/:eventId', reservationController.deleteAllReservationsForEvent);
router.delete('/reservation/user/:userId', reservationController.deleteAllReservationsForUser);
router.delete('/reservation/:reservationId/:userId', reservationController.deleteReservation);

// Cancelled and uncancelled reservations for a user
router.get('/reservation/cancel/:userId', reservationController.getCancelledReservationsForUser);
router.get('/reservation/uncancel/:userId', reservationController.getUnCancelledReservationsForUser);

module.exports = router;