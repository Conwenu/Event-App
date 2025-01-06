// server/events/eventRoutes.js
const express = require('express');
const router = express.Router();
const eventController = require('./eventController');
const authController = require('../auth/authController');
// Create and retrieve events
//router.post('/event', authController.authenticateJWT, eventController.createEvent);
router.post('/event', eventController.createEvent);
router.get('/events', eventController.getEvents);
router.get('/events2', eventController.getEvents2);
router.get('/userEvents', eventController.getEventsByUserQuery);
// Retrieve, edit, and delete a specific event
router.get('/event/:id', eventController.getEvent);
router.put('/event/:id', eventController.editEvent);
router.delete('/event/:id', eventController.deleteEvent);

// Cancel and uncancel specific events
router.put('/event/cancel/:id', eventController.cancelEvent);
router.put('/event/uncancel/:id', eventController.unCancelEvent);

// User-specific event actions
router.get('/event/user/:userId', eventController.getEventsByUser);
router.delete('/event/user/:userId', eventController.deleteEventsByUser);
router.put('/event/cancel/user/:userId', eventController.cancelEventsByUser);
router.put('/event/uncancel/user/:userId', eventController.unCancelEventsByUser);

// Retrieve cancelled and uncancelled events
router.get('/event/cancel', eventController.getCancelledEvents);
router.get('/event/cancel/:userId', eventController.getCancelledEventsFromUser);
router.get('/event/uncancel', eventController.getUncancelledEvents);
router.get('/event/uncancel/:userId', eventController.getUncancelledEventsFromUser);


module.exports = router;