// server/events/eventRoutes.js
const express = require('express');
const router = express.Router();
const eventController = require('./eventController');
const authController = require('../auth/authController');
// Create and retrieve events
//router.post('/event', authController.authenticateJWT, eventController.createEvent);

router.get('/events2', eventController.getEvents2);
router.get('/events', authController.verifyJWT, eventController.getEvents);
router.post('/event', authController.verifyJWT, eventController.createEvent);
router.get('/userEvents', authController.verifyJWT, eventController.getEventsByUserQuery);
// Retrieve, edit, and delete a specific event
router.get('/event/:id', eventController.getEvent);
router.put('/event/:id', authController.verifyJWT, eventController.editEvent);
router.delete('/event/:id', authController.verifyJWT, eventController.deleteEvent);

// Cancel and uncancel specific events
router.put('/event/cancel/:id', authController.verifyJWT, eventController.cancelEvent);
router.put('/event/uncancel/:id', authController.verifyJWT, eventController.unCancelEvent);

// User-specific event actions
router.get('/event/user/:userId', authController.verifyJWT, eventController.getEventsByUser);
router.delete('/event/user/:userId', authController.verifyJWT, eventController.deleteEventsByUser);
router.put('/event/cancel/user/:userId', authController.verifyJWT, eventController.cancelEventsByUser);
router.put('/event/uncancel/user/:userId', authController.verifyJWT, eventController.unCancelEventsByUser);

// Retrieve cancelled and uncancelled events
router.get('/event/cancel', authController.verifyJWT, eventController.getCancelledEvents);
router.get('/event/cancel/:userId', authController.verifyJWT, eventController.getCancelledEventsFromUser);
router.get('/event/uncancel', authController.verifyJWT, eventController.getUncancelledEvents);
router.get('/event/uncancel/:userId', authController.verifyJWT, eventController.getUncancelledEventsFromUser);


module.exports = router;