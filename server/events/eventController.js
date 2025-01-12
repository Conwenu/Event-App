// server/events/eventController.js
const eventService = require("./eventService");
const {
  validateIntegerParameters,
  validateStringParameters,
} = require("../helpers/validateParameters");

// function getStartOfWeek(date, startOfWeek = "monday") {
//   const startDate = new Date(date);

//   // Set the current date to the beginning of the week (based on specified starting day)
//   const day = startDate.getDay(); // Sunday - Saturday: 0 - 6
//   const diff = startOfWeek === "monday" ? day - 1 : day; // If starting on Monday: subtract 1, if Sunday - Saturday: no change

//   // Adjust the date to the start of the week
//   startDate.setDate(startDate.getDate() - diff);
//   startDate.setHours(0, 0, 0, 0); // Set time to midnight

//   return startDate;
// }

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
    finalRSVPTime,
    image,
    specialNote
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
      finalRSVPTime,
      image,
      specialNote
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
      selectedWeekday,
      eventStatus,
      reservationAbility,
      minDuration,
      maxDuration,
      sort,
      searchQuery,
    } = req.query;

    console.log("Query parameters:", req.query);

    const currentDate = new Date();
    const queryStartDate = new Date(startDate);
    const queryEndDate = new Date(endDate);
    const events = await eventService.getEvents();

    const scheduled = eventStatus?.includes("scheduled") ? "true" : "false";
    const inProgress = eventStatus?.includes("inProgress") ? "true" : "false";
    const completed = eventStatus?.includes("completed") ? "true" : "false";
    const cancelled = eventStatus?.includes("cancelled") ? "true" : "false";

    const available = reservationAbility?.includes("available")
      ? "true"
      : "false";
    const fullyBooked = reservationAbility?.includes("fullyBooked")
      ? "true"
      : "false";

    const newestFirst =
      sort?.includes("newestFirst") || !sort ? "true" : "false";
    const oldestFirst = sort?.includes("oldestFirst") ? "true" : "false";
    const startTimeAscending = sort?.includes("startTimeAscending")
      ? "true"
      : "false";
    const startTimeDescending = sort?.includes("startTimeDescending")
      ? "true"
      : "false";

    // Normalize the search query for case-insensitive search
    const normalizedSearchQuery = searchQuery
      ? searchQuery.trim().toLowerCase()
      : "";

      const areAllFiltersTheSame = () => {
      const filters = [scheduled, inProgress, completed, cancelled];
      const allTrue = filters.every((filter) => filter === true);
      const allFalse = filters.every((filter) => filter === false);
      return allTrue || allFalse;
    };
    // Filter events
    const filteredEvents = events.filter((event) => {
      const eventStartTime = new Date(event.startTime);
      const eventEndTime = new Date(event.endTime);
      let eventLengthInMinutes = (eventEndTime - eventStartTime) / 60000; // Convert milliseconds to minutes

      // Status Filters
    if (cancelled === "true" && scheduled === "true" && inProgress === "true" && completed === "true") {
        // No action needed
    } else if (cancelled === "false" && scheduled === "false" && inProgress === "false" && completed === "false") {
        // No action needed
    } else if (scheduled === "true" && cancelled === "false" && inProgress === "true" && completed === "true") {
        if (event.status !== "SCHEDULED") return false;
    } else if (cancelled === "true" && scheduled === "true" && inProgress === "false" && completed === "true") {
        if (!(event.status === "CANCELLED" || event.status === "SCHEDULED" || eventEndTime < currentDate)) return false;
    } else if (scheduled === "true" && cancelled === "false" && inProgress === "false" && completed === "true") {
        if(!((event.status === "SCHEDULED") && currentDate < eventStartTime || eventEndTime < currentDate)) return false;
    } else if (cancelled === "true" && scheduled === "false" && inProgress === "true" && completed === "true") {
        if(event.status == "CANCELLED" || !(eventStartTime <= currentDate && eventEndTime >= currentDate) || !(eventEndTime < currentDate)) return false;
    } else if (cancelled === "true" && scheduled === "false" && inProgress === "true" && completed === "false") {
        if (event.status !== "SCHEDULED" || eventStartTime > currentDate || eventEndTime < currentDate) return false;
    } else if (scheduled === "true" && cancelled === "false" && inProgress === "false" && completed === "false") {
        if (event.status !== "SCHEDULED" || eventStartTime <= currentDate) return false;
    } else if (inProgress === "true" && cancelled === "false" && scheduled === "false" && completed === "false") {
        if (!(eventStartTime <= currentDate && eventEndTime >= currentDate)) return false;
    } else if (cancelled === "true" && scheduled === "false" && inProgress === "false" && completed === "true") {
        if (event.status !== "SCHEDULED" || eventEndTime >= currentDate) return false;
    } else if (cancelled === "false" && scheduled === "false" && inProgress === "true" && completed === "true") {
        if (event.status !== "SCHEDULED" || !( eventEndTime < currentDate ||(eventStartTime <= currentDate && eventEndTime >= currentDate))) return false;
    } else if (cancelled === "true" && scheduled === "true" && inProgress === "false" && completed === "false") {
        if ((event.status !== "CANCELLED" && event.status !== "SCHEDULED") || (eventStartTime <= currentDate && eventEndTime >= currentDate) || currentDate > eventEndTime ) return false;
    } else if (completed === "true" && cancelled === "false" && scheduled === "false" && inProgress === "false") {
        if (!(event.status === "SCHEDULED" && eventEndTime < currentDate)) return false;
    } else if (cancelled === "true" && scheduled === "true" && inProgress === "true" && completed === "false") {
        if(!(event.status === "CANCELLED" || (eventStartTime <= currentDate && eventEndTime >= currentDate) || currentDate < eventStartTime)) return false;
    } else if (cancelled === "false" && scheduled === "true" && inProgress === "true" && completed === "false") {
        if (event.status !== "SCHEDULED" || !(eventStartTime > currentDate || (eventStartTime <= currentDate && eventEndTime >= currentDate))) return false;
    } else if (cancelled === "true" && scheduled === "false" && inProgress === "false" && completed === "false") {
        if (event.status !== "CANCELLED") return false;
    } else if (scheduled === "true" && cancelled === "false" && inProgress === "false" && completed === "false") {
        if (event.status !== "SCHEDULED" || eventStartTime <= currentDate) return false;
    } else if (completed === "true" && cancelled === "false" && scheduled === "false" && inProgress === "true") {
        if (!(event.status === "SCHEDULED" && eventStartTime <= currentDate && eventEndTime >= currentDate)) return false;
    }
    else {
      console.log("No filter conditions applied");
    }
    

      if (available === "true" && event.reservationsLeft <= 0) return false;
      if (fullyBooked === "true" && event.reservationsLeft > 0) return false;

      // Duration Filters
      if (minDuration || maxDuration) {
        const min = minDuration ? parseInt(minDuration) : 0;
        const max = maxDuration ? parseInt(maxDuration) : Infinity;

        if (minDuration && maxDuration) {
          if (eventLengthInMinutes < min || eventLengthInMinutes > max) {
            return false;
          }
        } else if (minDuration) {
          if (eventLengthInMinutes < min) return false;
        } else if (maxDuration) {
          if (eventLengthInMinutes > max) return false;
        }
      }

      // Time Filter Logic
      if (
        timeFilter &&
        !checkTimeFilter(
          timeFilter,
          eventStartTime,
          queryStartDate,
          queryEndDate,
          selectedMonth,
          selectedYear,
          selectedWeekday
        )
      ) {
        return false;
      }

      // Search Query Logic
      if (
        normalizedSearchQuery &&
        !event.title.toLowerCase().includes(normalizedSearchQuery) &&
        !event.description.toLowerCase().includes(normalizedSearchQuery)
      ) {
        return false;
      }

      return true; // Keep event if all filters pass
    });

    // Sorting Logic
    // Oldest first and startTimeAscending are the same so I'll remove one of them
    let sortedEvents = [...filteredEvents];
    if (newestFirst === "true") {
      sortedEvents.sort(
        (a, b) => new Date(b.startTime) - new Date(a.startTime)
      );
    } else if (oldestFirst === "true" || startTimeAscending === "true") {
      sortedEvents.sort(
        (a, b) => new Date(a.startTime) - new Date(b.startTime)
      );
    } else if (startTimeDescending === "true") {
      sortedEvents.sort(
        (a, b) => new Date(b.startTime) - new Date(a.startTime)
      );
    }

    // Send filtered and sorted events
    res.json({ events: sortedEvents });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to fetch events" });
  }
};

// Helper function for checking time-based filters
const checkTimeFilter = (
  timeFilter,
  eventStartTime,
  queryStartDate,
  queryEndDate,
  selectedMonth,
  selectedYear,
  querySelectedWeekday
) => {
  const isValidDate = (date) => {
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime()); // returns true if the date is valid
  };

  switch (timeFilter) {
    case "day":
      if(!isValidDate(queryStartDate)) {
        return true; // The date might not be provided yet so just assume it's not a valid date
      }
      const eventStartDateOnly = new Date(eventStartTime.setHours(0, 0, 0, 0));
      const queryStartDateOnly = new Date(queryStartDate.setHours(0, 0, 0, 0));
      return eventStartDateOnly.getTime() === queryStartDateOnly.getTime();

    case "week":
      if(!isValidDate(queryStartDate)) {
        return true; 
      }
      const queryWeekStart = getStartOfWeek(queryStartDate, "monday");
      const eventWeekStart = getStartOfWeek(eventStartTime, "monday");
      return queryWeekStart.getTime() === eventWeekStart.getTime();

    case "month":
      const selectedMonthIndex = parseInt(selectedMonth, 10) - 1; // subtract 1 to convert from 1-based to 0-based month index

      // ensure selectedMonthIndex is within a valid range (0 to 11)
      if (selectedMonthIndex < 0 || selectedMonthIndex > 11) {
        return false;
      }

      // start of the month (1st day of the selected month at midnight)
      const startOfMonth = new Date(selectedYear, selectedMonthIndex, 1);

      // end of the month (last day of the selected month at the end of the day)
      const endOfMonth = new Date(selectedYear, selectedMonthIndex + 1, 0);
      return eventStartTime >= startOfMonth && eventStartTime <= endOfMonth;

    case "year":
      const startOfYear = new Date(selectedYear, 0, 1);
      const endOfYear = new Date(selectedYear, 11, 31, 23, 59, 59, 999);
      return eventStartTime >= startOfYear && eventStartTime <= endOfYear;

    case "weekday":
      const selectedWeekday = querySelectedWeekday.toLowerCase();
      const weekdays = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
      ];
      const selectedWeekdayIndex = weekdays.indexOf(selectedWeekday);
      return eventStartTime.getDay() === selectedWeekdayIndex;

    case "dateRange":
      const validStartDate = queryStartDate && isValidDate(queryStartDate);
      const validEndDate = queryEndDate && isValidDate(queryEndDate);

      // If both start and end dates are invalid (invalid or not provided)
      if (!validStartDate && !validEndDate) {
        // console.log("Neither queryStartDate nor queryEndDate provided or both are invalid.");
        return true; // no filtering, return all events
      }

      if (validStartDate && validEndDate) {
        // console.log("Both queryStartDate and queryEndDate provided", queryStartDate, queryEndDate);
        const rangeStartDate = new Date(queryStartDate);
        const rangeEndDate = new Date(queryEndDate);
        return (
          eventStartTime >= rangeStartDate && eventStartTime <= rangeEndDate
        );

      } else if (validStartDate) {
        //console.log("queryStartDate provided and valid");
        const rangeStartDate = new Date(queryStartDate);
        return eventStartTime >= rangeStartDate;

      } else if (validEndDate) {
        console.log("queryEndDate provided and valid");
        const rangeEndDate = new Date(queryEndDate);
        return eventStartTime <= rangeEndDate;

      } else {
        //console.log("Invalid date inputs detected.");
        return true; 
      }

    default:
      return true;
  }
};

// Helper function to get the start of the week
const getStartOfWeek = (date, firstDay = "sunday") => {
  const day = date.getDay();
  const diff =
    (day < (firstDay === "monday" ? 1 : 0) ? 7 : 0) +
    day -
    (firstDay === "monday" ? 1 : 0);
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - diff);
  startOfWeek.setHours(0, 0, 0, 0);
  return startOfWeek;
};

const getEventsByUserQuery = async (req, res) => {
  try {
    const {userId, searchQuery, sort} = req.query;
    const events = await eventService.getEventsByUser(userId);
    const newestFirst =
      sort?.includes("newestFirst") || !sort ? "true" : "false";
    const oldestFirst = sort?.includes("oldestFirst") ? "true" : "false";
    const startTimeAscending = sort?.includes("startTimeAscending")
      ? "true"
      : "false";
    const startTimeDescending = sort?.includes("startTimeDescending")
      ? "true"
      : "false";

    const normalizedSearchQuery = searchQuery
      ? searchQuery.trim().toLowerCase()
      : "";

      const filteredEvents = events.filter((event) => {
        // Search Query Logic
      if (
        normalizedSearchQuery &&
        !event.title.toLowerCase().includes(normalizedSearchQuery) &&
        !event.description.toLowerCase().includes(normalizedSearchQuery)
      ) {
        return false;
      }

      return true; 
      })

      let sortedEvents = [...filteredEvents];
      if (newestFirst === "true") {
        sortedEvents.sort(
          (a, b) => new Date(b.startTime) - new Date(a.startTime)
        );
      } else if (oldestFirst === "true" || startTimeAscending === "true") {
        sortedEvents.sort(
          (a, b) => new Date(a.startTime) - new Date(b.startTime)
        );
      } else if (startTimeDescending === "true") {
        sortedEvents.sort(
          (a, b) => new Date(b.startTime) - new Date(a.startTime)
        );
      }
  
      res.json({ events: sortedEvents });
  }
  catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to fetch events" });
  }
}

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
    maxReservationsPerUser,
    startTime,
    endTime,
    finalRSVPTime,
    specialNote,
    image,
  } = req.body;
  try {
    console.log(title, description, status, venue, startTime, endTime, specialNote);
    const event = await eventService.editEvent(id, {
      title,
      description,
      status,
      venue,
      maxReservations,
      maxReservationsPerUser,
      startTime,
      endTime,
      finalRSVPTime,
      specialNote,
      image,
    });
    res.json(event);
  } catch (error) {
    console.log(error);
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
  getEventsByUserQuery,
};
