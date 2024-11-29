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
    // Access query parameters from the URL
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
    console.log(typeof scheduled);
    const currentDate = new Date();
    const startTime = new Date(startDate);
    const endTime = new Date(endDate);
    const events = await eventService.getEvents();

    let normalizedSearchQuery = "";
    if (searchQuery != "" && searchQuery != undefined && searchQuery != null) {
      normalizedSearchQuery = searchQuery.trim().toLowerCase();
    }
    let results = [];
    for (const event of events) {
      const eventStartTime = new Date(event.startTime);
      const eventEndTime = new Date(event.endTime);

      if (cancelled == "true") {
        if (event.status !== "CANCELLED") {
          continue;
        }
      }
      if (scheduled == "true") {
        if (event.status !== "SCHEDULED") {
          continue;
        }
      }
      if (completed == "true") {
        if (event.status !== "SCHEDULED" && !(eventEndTime <= currentDate)) {
          continue;
        }
      }
      if (inProgress === "true") {
        if (
          (typeof event.status === "string" &&
            event.status !== "SCHEDULED" &&
            (typeof eventStartTime === "undefined" ||
              typeof eventEndTime === "undefined" ||
              typeof currentDate === "undefined")) ||
          !(
            eventStartTime instanceof Date || typeof eventStartTime === "number"
          ) ||
          !(eventEndTime instanceof Date || typeof eventEndTime === "number") ||
          !(currentDate instanceof Date || typeof currentDate === "number")
        ) {
          console.error("Invalid input detected.");
          continue;
        }

        const eventStart =
          eventStartTime instanceof Date
            ? eventStartTime
            : new Date(eventStartTime);
        const eventEnd =
          eventEndTime instanceof Date ? eventEndTime : new Date(eventEndTime);
        const current =
          currentDate instanceof Date ? currentDate : new Date(currentDate);

        if (!(eventStart <= current && eventEnd >= current)) {
          continue;
        }
      }

      if (available == "true") {
        if (!(event.reservationsLeft > 0)) {
          continue;
        }
      }
      if (fullyBooked == "true") {
        if (!(event.reservationsLeft <= 0)) {
          continue;
        }
      }
      if (
        (minDuration != "" && minDuration != null) ||
        (maxDuration != "" && maxDuration != null)
      ) {
        let eventLengthInMinutes = (eventEndTime - eventStartTime) / 60000; // Convert milliseconds to minutes

        // If both minDuration and maxDuration are provided
        if (
          minDuration != "" &&
          minDuration != null &&
          maxDuration != "" &&
          maxDuration != null
        ) {
          let newMin = Math.min(parseInt(minDuration), parseInt(maxDuration));
          let newMax = Math.max(parseInt(minDuration), parseInt(maxDuration));

          // Check if the event length (in minutes) is within the range
          if (
            !(eventLengthInMinutes >= newMin && eventLengthInMinutes <= newMax)
          ) {
            continue; // Skip this event if the length is not in range
          }
        }
        // If only minDuration is provided
        else if (minDuration != "" && minDuration != null) {
          if (eventLengthInMinutes < parseInt(minDuration)) {
            continue; // Skip this event if it's shorter than minDuration
          }
        }
        // If only maxDuration is provided
        else if (maxDuration != "" && maxDuration != null) {
          if (eventLengthInMinutes > parseInt(maxDuration)) {
            continue; // Skip this event if it's longer than maxDuration
          }
        }
      }

      if (timeFilter !== "" && timeFilter !== null) {
        const queryStartDate =
          startTime instanceof Date ? startTime : new Date(startTime);
        const eventStartDate =
          eventStartTime instanceof Date
            ? eventStartTime
            : new Date(eventStartTime);
          const querySelectedYear = parseInt(selectedYear);
        switch (timeFilter) {
          case "day":
            // Normalize both dates to remove the time part (set time to midnight)
            const queryStartDateOnly = new Date(
              queryStartDate.setHours(0, 0, 0, 0)
            );
            const eventStartDateOnly = new Date(
              eventStartDate.setHours(0, 0, 0, 0)
            );

            // Check if the dates are not the same
            if (queryStartDateOnly.getTime() !== eventStartDateOnly.getTime()) {
              continue; // Skip if they are not on the same date
            }

            console.log(
              "Filtering by day",
              queryStartDateOnly,
              eventStartDateOnly
            );
            // Add your logic here

            break;

          case "week":
            // Normalize both dates to the start of their respective weeks
            const queryWeekStart = getStartOfWeek(queryStartDate, "monday");
            const eventWeekStart = getStartOfWeek(eventStartDate, "monday");

            // Compare if the start of the weeks are the same
            if (queryWeekStart.getTime() !== eventWeekStart.getTime()) {
              continue; // Skip if they are not in the same week
            }

            console.log("Filtering by week", queryWeekStart, eventWeekStart);
            // Add your logic here

            break;

          case "month":
            // Convert the query parameters to proper Date objects
            const selectedMonthIndex = [
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ].indexOf(selectedMonth); // Get the index of the selected month (0 - 11)

            if (selectedMonthIndex === -1 || isNaN(querySelectedYear)) {
              console.error("Invalid month or year selected.");
              continue;
            }

            // Create the range for the selected month and year
            const startOfMonth = new Date(querySelectedYear, selectedMonthIndex, 1); // Start of the month
            const endOfMonth = new Date(
              querySelectedYear,
              selectedMonthIndex + 1,
              0
            ); // End of the month

            // Check if event is in the same month and year
            if (eventStartTime < startOfMonth || eventStartTime > endOfMonth) {
              continue; // Skip if event is not in the selected month
            }

            console.log("Filtering by month", selectedMonth, querySelectedYear);
            // Add your logic here

            break;

          case "year":
            // Convert the selectedYear query parameter to an integer
            const selectedYearInt = parseInt(selectedYear);

            if (isNaN(selectedYearInt)) {
              console.error("Invalid year selected.");
              continue;
            }

            // Create the range for the selected year
            const startOfYear = new Date(selectedYearInt, 0, 1); // Start of the year (January 1st)
            const endOfYear = new Date(
              selectedYearInt,
              11,
              31,
              23,
              59,
              59,
              999
            ); // End of the year (December 31st)

            // Check if event is in the same year
            if (eventStartTime < startOfYear || eventStartTime > endOfYear) {
              continue; // Skip if event is not in the selected year
            }

            console.log("Filtering by year", selectedYearInt);
            // Add your logic here

            break;

          case "weekday":
            // Convert the query parameter to get the selected weekday (e.g., "Monday", "Tuesday", etc.)
            const selectedWeekday = selectedWeekday.toLowerCase(); // Assuming the input is in a string format

            // Map days of the week to their corresponding index (0 - 6, Sunday - Saturday)
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

            if (selectedWeekdayIndex === -1) {
              console.error("Invalid weekday selected.");
              continue;
            }

            // Get the weekday of the event's start date
            const eventWeekday = eventStartTime.getDay();

            // Check if the event falls on the selected weekday
            if (eventWeekday !== selectedWeekdayIndex) {
              continue; // Skip if the event does not fall on the selected weekday
            }

            console.log("Filtering by weekday", selectedWeekday);
            // Add your logic here

            break;

          case "dateRange":
            // Convert startDate and endDate query parameters to Date objects
            const rangeStartDate = new Date(startDate);
            const rangeEndDate = new Date(endDate);

            // Ensure the range is valid (startDate should be before endDate)
            if (rangeStartDate > rangeEndDate) {
              // Swap the dates if necessary
              const temp = rangeStartDate;
              rangeStartDate = rangeEndDate;
              rangeEndDate = temp;
            }

            // Check if the event's start time is within the date range
            if (
              eventStartTime < rangeStartDate ||
              eventStartTime > rangeEndDate
            ) {
              continue; // Skip if event is not within the date range
            }

            console.log(
              "Filtering by date range",
              rangeStartDate,
              rangeEndDate
            );
            // Add your logic here

            break;

          default:
            // console.log("Invalid time filter");
            break;
        }

        if (normalizedSearchQuery != null && normalizedSearchQuery != undefined && normalizedSearchQuery != "") {
          const normalizedTitle = event.title.toLowerCase();
          const normalizedDescription = event.description.toLowerCase();
          
          if (!normalizedTitle.includes(normalizedSearchQuery) && 
              !normalizedDescription.includes(normalizedSearchQuery)) {
            continue; 
          }
        }
      }
      if (newestFirst == "true") {
        
        sortedEvents = events.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
      } else if (oldestFirst == "true") {
        
        sortedEvents = events.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
      } else if (startTimeAscending == "true") {
        
        sortedEvents = events.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
      } else if (startTimeDescending == "true") {
        
        sortedEvents = events.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
      } else {
        // For default I'll either use the Id or maybe creation time or alphabetical order, I might just leave it alone though
        console.log('No sorting applied');
      }
      results.push(event);
    }
    console.log(results);
    res.json({ results });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to fetch events" });
  }
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
