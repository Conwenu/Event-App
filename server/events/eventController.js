// server/events/eventController.js
const eventService = require('./eventService');
const {validateIntegerParameters, validateStringParameters} = require("../helpers/validateParameters")

const createEvent = async (req, res) => {
    const { title, description, status, creatorId, venue, maxReservations, maxReservationsPerUser, startTime, endTime } = req.body;
    try {
        const event = await eventService.createEvent({ title, description, status, creatorId, venue, maxReservations, reservationsLeft: parseInt(maxReservations), maxReservationsPerUser, startTime, endTime });
        res.json(event);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getEvents = async (req, res) => {
    try {
        const events = await eventService.getEvents();
        res.json({events});
      } catch (error) {
        res.status(400).json({ error: 'Failed to fetch events' });
      }
}

const getEvent = async (req, res) => {
  const { id } = req.params;
  try {
      const event = await eventService.getEvent(id)
      res.json(event)
  }
  catch (error) {
    res.status(400).json({ error: 'Failed to fetch event' });
  }
}

const editEvent = async (req, res) => {
    const { id } = req.params;
    const { title, description, status, venue, maxReservations, reservationsLeft, maxReservationsPerUser, startTime, endTime } = req.body;
    try {
      const event = await eventService.editEvent(id, { title, description, status, venue, maxReservations, reservationsLeft : parseInt(maxReservations), maxReservationsPerUser, startTime, endTime });
      res.json(event);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
}

const deleteEvent = async (req, res) => {
    const { id } = req.params;
    try {
      await eventService.deleteEvent(id)
      res.json({ message: 'Event deleted successfully' });
    } catch (error) {
      res.status(400).json({ error: 'Failed to delete event' });
    }
}

const cancelEvent = async (req, res) => {
  const {id} = req.params;
  try {
    await eventService.cancelEvent(id)
    res.json({ message : "Event cancelled successfully"})
  } catch (error) {
    res.status(400).json({error : error});
  }
}

const getEventsByUser = async (req, res) => {
  const {userId} = req.params;
  try {
    const events = await eventService.getEventsByUser(userId)
    res.json({events})
  } catch (error) {
    res.status(400).json({ error: 'Failed to fetch events' });
  }
}

const deleteEventsByUser = async (req, res) => {
  const {userId} = req.params;
  try {
    await eventService.deleteEventsByUser(userId)
    res.json({message : "Deleted events from user successfully"})
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete events' });
  }
}

const cancelEventsByUser = async (req, res) => {
  const {userId} = req.params;
  try {
    const result = await eventService.cancelEventsByUser(userId)
    res.json({message : result})
  } catch (error) {
    res.status(400).json({ error: 'Failed to cancel events' });
  }
}

const unCancelEvent = async (req, res) => {
  const {id} = req.params;
  try {
    await eventService.unCancelEvent(id)
    res.json({ message : "Event restored successfully"})
  } catch (error) {
    res.status(400).json({ error: error });
  }
}

const unCancelEventsByUser = async (req, res) => {
  const {userId} = req.params;
  try {
    const result = await eventService.unCancelEventsByUser(userId)
    res.json({message : result})
  } catch (error) {
    res.status(400).json({ error: 'Failed to fetch events' });
  }
}

const getCancelledEvents = async (req, res) => {
  try {
    const events = await eventService.getCancelledEvents(userId)
    res.json({events})
  } catch (error) {
    res.status(400).json({ error: 'Failed to fetch events' });
  }
};

const getUncancelledEvents = async (req, res) => {
  try {
    const events = await eventService.getUncancelledEvents(userId)
    res.json({events})
  } catch (error) {
    res.status(400).json({ error: 'Failed to fetch events' });
  }
};

const getCancelledEventsFromUser = async (req, res) => {
  const {userId} = req.params;
  try {
    const events = await eventService.getCancelledEventsFromUser(userId);
        res.json({events});
  } catch (error) {
    res.status(400).json({ error: 'Failed to fetch events' });
  }
};

const getUncancelledEventsFromUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const events = await eventService.getUncancelledEventsFromUser(userId);
    res.json({ events });
  } catch (error) {
    res.status(400).json({ error: 'Failed to fetch events' });
  }
};

module.exports = {
    createEvent,
    getEvents,
    getEvent,
    editEvent,
    deleteEvent,
    cancelEvent,
    getEventsByUser,
    deleteEventsByUser,
    cancelEventsByUser,
    unCancelEvent,
    unCancelEventsByUser,
    getCancelledEvents,
    getUncancelledEvents,
    getCancelledEventsFromUser,
    getUncancelledEventsFromUser
};
