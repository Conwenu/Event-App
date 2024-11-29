// server/events/eventController.js
const eventService = require("./eventService");
const {
  validateIntegerParameters,
  validateStringParameters,
} = require("../helpers/validateParameters");

function getStartOfWeek(date, startOfWeek = "monday") {
  const startDate = new Date(date);

  // Set the current date to the beginning of the week (based on specified starting day)
  const day = startDate.getDay(); // Sunday - Saturday: 0 - 6
  const diff = startOfWeek === "monday" ? day - 1 : day; // If starting on Monday: subtract 1, if Sunday - Saturday: no change

  // Adjust the date to the start of the week
  startDate.setDate(startDate.getDate() - diff);
  startDate.setHours(0, 0, 0, 0); // Set time to midnight

  return startDate;
}

const createEvent = async (req, res) => {
  const {
    title,
    description,
    status,
    creatorId,
    venue,
    maxReservations,
    maxReservationsPerUser,
    startTime,
    endTime,
  } = req.body;
  try {
    const event = await eventService.createEvent({
      title,
      description,
      status,
      creatorId,
      venue,
      maxReservations,
      reservationsLeft: parseInt(maxReservations),
      maxReservationsPerUser,
      startTime,
      endTime,
    });
    res.json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getEvents = async (req, res) => {
  try {
    const events = await eventService.getEvents();
    res.json({ events });
  } catch (error) {
    res.status(400).json({ error: "Failed to fetch events" });
  }
};

const getEvents2 = async (req, res) => {
  try {
    const {
      timeFilter,
      startDate,
      endDate,
      selectedMonth,
      selectedYear,
      scheduled,
      inProgress,
      completed,
      cancelled,
      available,
      fullyBooked,
      minDuration,
      maxDuration,
      newestFirst,
      oldestFirst,
      startTimeAscending,
      startTimeDescending,
      searchQuery,
    } = req.query;

    console.log("Query parameters:", req.query);

    const currentDate = new Date();
    const queryStartDate = new Date(startDate);
    const queryEndDate = new Date(endDate);
    const events = await eventService.getEvents();

    // Normalize the search query for case-insensitive search
    const normalizedSearchQuery = searchQuery ? searchQuery.trim().toLowerCase() : "";

    // Filter events
    const filteredEvents = events.filter(event => {
      const eventStartTime = new Date(event.startTime);
      const eventEndTime = new Date(event.endTime);
      let eventLengthInMinutes = (eventEndTime - eventStartTime) / 60000; // Convert milliseconds to minutes

      // Status Filters
      if (cancelled === "true" && event.status !== "CANCELLED") return false;
      if (scheduled === "true" && event.status !== "SCHEDULED") return false;
      if (completed === "true" && (event.status !== "SCHEDULED" && eventEndTime > currentDate)) return false;
      if (inProgress === "true" && !(eventStartTime <= currentDate && eventEndTime >= currentDate)) return false;
      if (available === "true" && event.reservationsLeft <= 0) return false;
      if (fullyBooked === "true" && event.reservationsLeft > 0) return false;

      // Duration Filters
      if (minDuration || maxDuration) {
        const min = parseInt(minDuration) || 0;
        const max = parseInt(maxDuration) || Infinity;
        if (eventLengthInMinutes < min || eventLengthInMinutes > max) return false;
      }

      // Time Filter Logic
      if (timeFilter && !checkTimeFilter(timeFilter, eventStartTime, queryStartDate, selectedMonth, selectedYear)) {
        return false;
      }

      // Search Query Logic
      if (normalizedSearchQuery && !event.title.toLowerCase().includes(normalizedSearchQuery) &&
          !event.description.toLowerCase().includes(normalizedSearchQuery)) {
        return false;
      }

      return true; // Keep event if all filters pass
    });

    // Sorting Logic
    // Oldest first and startTimeAscending are the same so I'll remove one of them
    let sortedEvents = [...filteredEvents];
    if (newestFirst === "true") {
      sortedEvents.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
    } else if (oldestFirst === "true" || startTimeAscending === "true") {
      sortedEvents.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
    } else if (startTimeDescending === "true") {
      sortedEvents.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
    }

    // Send filtered and sorted events
    res.json({ results: sortedEvents });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to fetch events" });
  }
};

// Helper function for checking time-based filters
const checkTimeFilter = (timeFilter, eventStartTime, queryStartDate, selectedMonth, selectedYear) => {
  switch (timeFilter) {
    case "day":
      const eventStartDateOnly = new Date(eventStartTime.setHours(0, 0, 0, 0));
      const queryStartDateOnly = new Date(queryStartDate.setHours(0, 0, 0, 0));
      return eventStartDateOnly.getTime() === queryStartDateOnly.getTime();

    case "week":
      const queryWeekStart = getStartOfWeek(queryStartDate, "monday");
      const eventWeekStart = getStartOfWeek(eventStartDate, "monday");
      return queryWeekStart.getTime() === eventWeekStart.getTime();

    case "month":
      const selectedMonthIndex = [
        "January", "February", "March", "April", "May", "June", "July", "August",
        "September", "October", "November", "December"
      ].indexOf(selectedMonth);
      const startOfMonth = new Date(selectedYear, selectedMonthIndex, 1);
      const endOfMonth = new Date(selectedYear, selectedMonthIndex + 1, 0);
      return eventStartTime >= startOfMonth && eventStartTime <= endOfMonth;

    case "year":
      const startOfYear = new Date(selectedYear, 0, 1);
      const endOfYear = new Date(selectedYear, 11, 31, 23, 59, 59, 999);
      return eventStartTime >= startOfYear && eventStartTime <= endOfYear;

    case "weekday":
      const selectedWeekday = selectedWeekday.toLowerCase();
      const weekdays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
      const selectedWeekdayIndex = weekdays.indexOf(selectedWeekday);
      return eventStartTime.getDay() === selectedWeekdayIndex;

    case "dateRange":
      const rangeStartDate = new Date(queryStartDate);
      const rangeEndDate = new Date(queryEndDate);
      return eventStartTime >= rangeStartDate && eventStartTime <= rangeEndDate;

    default:
      return true;
  }
};

// Helper function to get the start of the week
const getStartOfWeek = (date, firstDay = "sunday") => {
  const day = date.getDay();
  const diff = (day < (firstDay === "monday" ? 1 : 0) ? 7 : 0) + day - (firstDay === "monday" ? 1 : 0);
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - diff);
  startOfWeek.setHours(0, 0, 0, 0);
  return startOfWeek;
};


const getEvent = async (req, res) => {
  const { id } = req.params;
  try {
    const event = await eventService.getEvent(id);
    res.json(event);
  } catch (error) {
    res.status(400).json({ error: "Failed to fetch event" });
  }
};

const editEvent = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    status,
    venue,
    maxReservations,
    reservationsLeft,
    maxReservationsPerUser,
    startTime,
    endTime,
  } = req.body;
  try {
    const event = await eventService.editEvent(id, {
      title,
      description,
      status,
      venue,
      maxReservations,
      reservationsLeft: parseInt(maxReservations),
      maxReservationsPerUser,
      startTime,
      endTime,
    });
    res.json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteEvent = async (req, res) => {
  const { id } = req.params;
  try {
    await eventService.deleteEvent(id);
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: "Failed to delete event" });
  }
};

const cancelEvent = async (req, res) => {
  const { id } = req.params;
  try {
    await eventService.cancelEvent(id);
    res.json({ message: "Event cancelled successfully" });
  } catch (error) {
    res.status(400).json({ error: error });
  }
};

const getEventsByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const events = await eventService.getEventsByUser(userId);
    res.json({ events });
  } catch (error) {
    res.status(400).json({ error: "Failed to fetch events" });
  }
};

const deleteEventsByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    await eventService.deleteEventsByUser(userId);
    res.json({ message: "Deleted events from user successfully" });
  } catch (error) {
    res.status(400).json({ error: "Failed to delete events" });
  }
};

const cancelEventsByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await eventService.cancelEventsByUser(userId);
    res.json({ message: result });
  } catch (error) {
    res.status(400).json({ error: "Failed to cancel events" });
  }
};

const unCancelEvent = async (req, res) => {
  const { id } = req.params;
  try {
    await eventService.unCancelEvent(id);
    res.json({ message: "Event restored successfully" });
  } catch (error) {
    res.status(400).json({ error: error });
  }
};

const unCancelEventsByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await eventService.unCancelEventsByUser(userId);
    res.json({ message: result });
  } catch (error) {
    res.status(400).json({ error: "Failed to fetch events" });
  }
};

const getCancelledEvents = async (req, res) => {
  try {
    const events = await eventService.getCancelledEvents(userId);
    res.json({ events });
  } catch (error) {
    res.status(400).json({ error: "Failed to fetch events" });
  }
};

const getUncancelledEvents = async (req, res) => {
  try {
    const events = await eventService.getUncancelledEvents(userId);
    res.json({ events });
  } catch (error) {
    res.status(400).json({ error: "Failed to fetch events" });
  }
};

const getCancelledEventsFromUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const events = await eventService.getCancelledEventsFromUser(userId);
    res.json({ events });
  } catch (error) {
    res.status(400).json({ error: "Failed to fetch events" });
  }
};

const getUncancelledEventsFromUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const events = await eventService.getUncancelledEventsFromUser(userId);
    res.json({ events });
  } catch (error) {
    res.status(400).json({ error: "Failed to fetch events" });
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
  getUncancelledEventsFromUser,
  getEvents2,
};
