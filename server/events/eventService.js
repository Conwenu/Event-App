// server/events/eventService.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const reservationService = require("../reservations/reservationService");

const multer = require("multer");
const fileType = require("file-type");
const sizeOf = require("image-size");
const Buffer = require("buffer").Buffer;

const maxSize = 2 * 1024 * 1024;
const createEvent = async (eventData) => {
  const {
    title,
    description,
    status,
    creatorId,
    venue,
    image,
    maxReservations,
    maxReservationsPerUser,
    startTime,
    endTime,
    finalRSVPTime,
    specialNote,
  } = eventData;

  // Validate required fields
  if (
    !title ||
    !description ||
    !creatorId ||
    !venue ||
    maxReservations == null ||
    maxReservationsPerUser == null ||
    !startTime ||
    !endTime
  ) {
    throw new Error("Missing required fields.");
  }

  // Check that startTime is before endTime
  if (new Date(startTime) >= new Date(endTime)) {
    throw new Error("Start time must be before end time.");
  }

  // Check that startTime and endTime are not in the past
  const now = new Date();

  if (new Date(startTime) < now) {
    throw new Error("Start time cannot be in the past.");
  }
  if (new Date(endTime) < now) {
    throw new Error("End time cannot be in the past.");
  }

  if (finalRSVPTime) {
    if (new Date(finalRSVPTime) < now) {
      throw new Error("Final RSVP time cannot be before the current date");
    } else if (new Date(finalRSVPTime) > new Date(startTime)) {
      throw new Error(
        "Final RSVP time must be less than or equal to start date"
      );
    }
  }

  if (title.length < 8) {
    throw new Error("Title must be at least 8 characters");
  }

  if (title.length > 30) {
    throw new Error("Title must be at most 30 characters");
  }

  if (venue.length > 30) {
    throw new Error("Venue must be at most 50 characters");
  }

  if (description.length > 240) {
    throw new Error("Description must be at most 240 characters");
  }

  if (maxReservations < 1) {
    throw new Error("Max Reservations must be at least 1");
  }
  else if(maxReservations > 100)
  {
    throw new Error("Max Reservations must be at most 100");
  }

  if (maxReservationsPerUser < 1) {
    throw new Error("Reservations per user must be at least 1");
  } else if (maxReservationsPerUser > maxReservations) {
    throw new Error(
      "Reservations per user cannot be more than max reservations"
    );
  }

  if (specialNote && specialNote.length > 240) {
    throw new Error("Special note must be at most 240 characters");
  }

  // get the base64 metadata (so the, "data:image/png;base64,")
  if(image)
  {
    const matches = image.match(/^data:image\/([a-zA-Z]*);base64,([^\"]*)$/);
    if (!matches || matches.length !== 3) {
      throw new Error("Invalid base64 image format");
    }
  
    // decode base64 string into binary buffer
    const imageBuffer = Buffer.from(matches[2], "base64");
  
    // check the image MIME type
    const fileTypeResult = await fileType.fromBuffer(imageBuffer);
    if (
      !fileTypeResult ||
      !["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(
        fileTypeResult.mime
      )
    ) {
      throw new Error(
        "Invalid image type. Only JPEG, PNG, JPG, and WebP are allowed."
      );
    }
  
    // check image size
    if (imageBuffer.length > maxSize) {
      throw new Error("Image size exceeds 2MB");
    }
  
    // check the dimensions of the image
    const dimensions = sizeOf(imageBuffer);
    if (!dimensions || dimensions.width > 2000 || dimensions.height > 2000) {
      throw new Error(
        "Image dimensions are too large. Max width/height is 2000px."
      );
    }
  }
  

  // Ensure maxReservations and maxReservationsPerUser are integers
  const maxReservationsInt = parseInt(maxReservations);
  const maxReservationsPerUserInt = parseInt(maxReservationsPerUser);

  // Create the event
  return await prisma.event.create({
    data: {
      title,
      description,
      status,
      creatorId: parseInt(creatorId),
      venue,
      maxReservations: maxReservationsInt,
      reservationsLeft: maxReservationsInt, // Initialize reservations left
      maxReservationsPerUser: maxReservationsPerUserInt,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      finalRSVPTime: !finalRSVPTime
        ? new Date(startTime)
        : new Date(finalRSVPTime),
      image: image,
      specialNote: specialNote,
    },
  });
};

const getEvents = async () => {
  return await prisma.event.findMany();
};

const getEvents2 = async () => {
  const events = await prisma.event.findMany();
  return events;
};

const getEvent = async (id) => {
  return await prisma.event.findUnique({
    where: { id: parseInt(id) },
  });
};

const editEvent = async (id, eventData) => {
  // Fetch the current event data including reservations
  const currentEvent = await prisma.event.findUnique({
    where: { id: parseInt(id) },
    include: { reservations: true }, // Include reservations for validation
  });

  if (!currentEvent) {
    throw new Error("Event not found.");
  }

  // Compare the eventData with the orignal data before throwing errors since i have the user return all fields from the client anyways
  const now = new Date();
  // If the event is currently onginig or has been completed then you can't edit it.
  if (now >= currentEvent.startTime) {
    throw new Error(
      "You cannont edit this event because it currently ongoing or completed."
    );
  } else {
    if (eventData.title !== currentEvent.title) {
      const title = eventData.title;
      if (title.length < 8) {
        throw new Error("Title must be at least 8 characters");
      }
      if (title.length > 30) {
        throw new Error("Title must be at most 30 characters");
      }
    }
    if (eventData.venue !== currentEvent.venue) {
      const venue = eventData.venue;
      if (venue.length > 30) {
        throw new Error("Venue must be at most 50 characters");
      }
    }
    if (eventData.description !== currentEvent.description) {
      const description = eventData.description;
      if (description.length > 240) {
        throw new Error("Description must be at most 240 characters");
      }
    }
    // Image validation
    if (eventData.image) {
      // get the base64 metadata (so the, "data:image/png;base64,")
      const matches = eventData.image.match(
        /^data:image\/([a-zA-Z]*);base64,([^\"]*)$/
      );
      if (!matches || matches.length !== 3) {
        throw new Error("Invalid base64 image format");
      }

      // decode base64 string into binary buffer
      const imageBuffer = Buffer.from(matches[2], "base64");

      // check the image MIME type
      const fileTypeResult = await fileType.fromBuffer(imageBuffer);
      if (
        !fileTypeResult ||
        !["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(
          fileTypeResult.mime
        )
      ) {
        throw new Error(
          "Invalid image type. Only JPEG, PNG, JPG, and WebP are allowed."
        );
      }

      // check image size
      if (imageBuffer.length > maxSize) {
        throw new Error("Image size exceeds 2MB");
      }

      // check the dimensions of the image
      const dimensions = sizeOf(imageBuffer);
      if (!dimensions || dimensions.width > 2000 || dimensions.height > 2000) {
        throw new Error(
          "Image dimensions are too large. Max width/height is 2000px."
        );
      }
    }

    const differentStart =
      new Date(eventData.startTime) !== new Date(currentEvent.startTime);
    const differentEnd =
      new Date(eventData.endTime) !== new Date(currentEvent.endTime);
    if (new Date(eventData.startTime) < now) {
      throw new Error("Start time cannot be in the past.");
    }
    if (new Date(eventData.endTime) < now) {
      throw new Error("End time cannot be in the past.");
    }

    if (eventData.finalRSVPTime) {
      if (new Date(eventData.finalRSVPTime) < now) {
        throw new Error("Final RSVP time cannot be before the current date");
      } else if (new Date(eventData.finalRSVPTime) > new Date(eventData.startTime)) {
        throw new Error(
          "Final RSVP time must be less than or equal to start date"
        );
      }
    }
    // If I changed my startTime
    if (new Date(eventData.startTime) !== new Date(currentEvent.startTime)) {
      // Verify start
      if (new Date(eventData.startTime) < now) {
        throw new Error("Start time cannot be in the past.");
      }
    }
    if (new Date(eventData.endTime) !== new Date(currentEvent.endTime)) {
      // Verify end
      if (new Date(eventData.endTime) < now) {
        throw new Error("End time cannot be in the past.");
      }
      if (
        differentStart &&
        new Date(eventData.endTime) <= new Date(eventData.startTime)
      ) {
        throw new Error("Start time must be before end time.");
      }
    }

    if (
      new Date(eventData.finalRSVPTime) !== new Date(currentEvent.finalRSVPTime)
    ) {
      if (new Date(eventData.finalRSVPTime) < now) {
        throw new Error("Final RSVP time cannot be before the current date");
      }
      if (
        differentStart &&
        eventData.finalRSVPTime > new Date(eventData.startTime)
      ) {
        throw new Error(
          "Final RSVP time must be less than or equal to start date"
        );
      }
    }

    // Seat Reservation
    // If anybody has reserved for the event then we can't edit the seat amount.
    // It would be best for the user to just cancel the event and create a new one.
    if (
      eventData.maxReservations !== currentEvent.maxReservations ||
      eventData.maxReservationsPerUser !== currentEvent.maxReservationsPerUser
    ) {
      if (currentEvent.maxReservations === currentEvent.reservationsLeft) {
        if (eventData.maxReservations !== currentEvent.maxReservations) {
          if (parseInt(eventData.maxReservations) < 1 ) {
            throw new Error("Max Reservations must be at least 1");
          }
          else if(parseInt(eventData.maxReservations) > 100)
          {
            throw new Error("Max Reservations must be at most 100");
          }
          eventData.reservationsLeft = eventData.maxReservations;
        }

        if (
          eventData.maxReservationsPerUser !==
          currentEvent.maxReservationsPerUser
        ) {
          if (parseInt(eventData.maxReservationsPerUser) < 1) {
            throw new Error("Reservations per user must be at least 1");
          }
          if (
            parseInt(eventData.maxReservationsPerUser) >
            parseInt(eventData.maxReservations)
          ) {
            throw new Error(
              "Maximum reservations per user cannot be more than max reservations"
            );
          }
          
        }
      } else {
        throw new Error(
          "Somebody has alredy reserved a seat for this event. Please cancel this event and create a new one if you wish tho change the maxReservation amount or maxReservationsPerUser ammount."
        );
      }
    }
  }

  // Proceed to update the event
  return await prisma.event.update({
    where: { id: parseInt(id) },
    data: eventData,
  });
};

const deleteEvent = async (id) => {
  await reservationService.deleteAllReservationsForEvent(id);
  await prisma.event.delete({
    where: { id: parseInt(id) },
  });
};

const deleteEventsByUser = async (userId) => {
  const events = await prisma.event.findMany({
    where: { creatorId: parseInt(userId) },
  });

  for (const event of events) {
    await reservationService.deleteAllReservationsForEvent(event.id);
  }

  const deleteResult = await prisma.event.deleteMany({
    where: { creatorId: parseInt(userId) },
  });

  return {
    message: `${deleteResult.count} events and their reservations deleted successfully`,
  };
};

const getEventsByUser = async (userId) => {
  return await prisma.event.findMany({
    where: { creatorId: parseInt(userId) },
  });
};

const cancelEvent = async (id, reason) => {
  const event = await prisma.event.findUnique({
    where: { id: parseInt(id) },
  });

  if (!event) {
    throw new Error("Event not found.");
  }

  const now = new Date();
  if (event.startTime <= now && event.endTime >= now) {
    throw new Error("Cannot cancel an event that is currently ongoing.");
  }

  if (event.status === "CANCELLED") {
    return { message: "Event is already cancelled." };
  }

  if(!reason)
  {
    throw new Error("Please provide a reason for cancelling the event.");
  }
  if(reason.length < 8)
  {
    throw new Error("Your reason should be at least 8 characters");
  }
  if(reason.length > 240)
  {
    throw new Error("Your reason should be at most 240 characters");
  }
  // In prisma add a field in the event body called cancelReason.
  await prisma.event.update({
    where: { id: parseInt(id) },
    data: { status: "CANCELLED", cancelReason : reason },
  });

  return { message: "Event has been cancelled successfully." };
};

const unCancelEvent = async (id) => {
  const event = await prisma.event.findUnique({
    where: { id: parseInt(id) },
  });

  if (!event) {
    throw new Error("Event not found.");
  }

  const now = new Date();
  if (event.startTime <= now && event.endTime >= now) {
    throw new Error("Cannot restore an event that is currently ongoing.");
  }

  if (event.status === "SCHEDULED") {
    return { message: "Event is already scheduled." };
  }

  await prisma.event.update({
    where: { id: parseInt(id) },
    data: { status: "SCHEDULED", cancelReason : null},
  });

  return { message: "Event has been restored to scheduled status." };
};

const cancelEventsByUser = async (userId) => {
  const events = await prisma.event.findMany({
    where: { creatorId: parseInt(userId) },
  });

  if (events.length === 0) {
    return { message: "No events found for this user." };
  }

  const now = new Date();
  const cancelledEvents = [];
  const ongoingEvents = [];

  for (const event of events) {
    if (event.startTime <= now && event.endTime >= now) {
      ongoingEvents.push(event.title);
    } else if (event.status !== "CANCELLED") {
      await prisma.event.update({
        where: { id: event.id },
        data: { status: "CANCELLED" },
      });
      cancelledEvents.push(event.title);
    }
  }

  const message =
    cancelledEvents.length > 0
      ? `Cancelled events: ${cancelledEvents.join(", ")}.`
      : "No events were cancelled.";

  const ongoingMessage =
    ongoingEvents.length > 0
      ? ` Ongoing events cannot be cancelled: ${ongoingEvents.join(", ")}.`
      : "";

  return { message: message + ongoingMessage };
};

const unCancelEventsByUser = async (userId) => {
  const events = await prisma.event.findMany({
    where: { creatorId: parseInt(userId) },
  });

  if (events.length === 0) {
    return { message: "No events found for this user." };
  }

  const now = new Date();
  const restoredEvents = [];
  const ongoingEvents = [];

  for (const event of events) {
    if (event.startTime <= now && event.endTime >= now) {
      ongoingEvents.push(event.title);
    } else if (event.status === "CANCELLED") {
      await prisma.event.update({
        where: { id: event.id },
        data: { status: "SCHEDULED" },
      });
      restoredEvents.push(event.title);
    }
  }

  const message =
    restoredEvents.length > 0
      ? `Restored events: ${restoredEvents.join(", ")}.`
      : "No events were restored.";

  const ongoingMessage =
    ongoingEvents.length > 0
      ? ` Ongoing events cannot be restored: ${ongoingEvents.join(", ")}.`
      : "";

  return { message: message + ongoingMessage };
};

const getCancelledEvents = async () => {
  return await prisma.event.findMany({
    where: { status: "CANCELLED" },
  });
};

const getUncancelledEvents = async () => {
  return await prisma.event.findMany({
    where: { status: "SCHEDULED" },
  });
};

const getCancelledEventsFromUser = async (userId) => {
  const cancelledEvents = await prisma.event.findMany({
    where: {
      AND: [{ creatorId: parseInt(userId) }, { status: "CANCELLED" }],
    },
  });

  if (cancelledEvents.length === 0) {
    return { message: "No cancelled events found for this user." };
  }

  return cancelledEvents;
};

const getUncancelledEventsFromUser = async (userId) => {
  const unCancelledEvents = await prisma.event.findMany({
    where: {
      AND: [{ creatorId: parseInt(userId) }, { status: "CANCELLED" }],
    },
  });

  if (unCancelledEvents.length === 0) {
    return { message: "No cancelled events found for this user." };
  }

  return unCancelledEvents;
};

// FIXME:
const getEventsByDay = async (day) => {
  const events = await prisma.event.findMany();
  const dayEvents = [];
  for (const event of events) {
    const eventDate = new Date(event.startTime);
    if (eventDate.getDay() == day) {
      dayEvents.push(event);
    }
  }
};

const getEventsByMonth = async (month) => {
  const monthEvents = [];
  const events = await prisma.event.findMany();
  for (const event of events) {
    const eventDate = new Date(event.startTime);
    if (eventDate.getMonth() + 1 === parseInt(month)) {
      monthEvents.push(event);
    }
  }
  return monthEvents;
};

const getEventsByYear = async (year) => {
  const yearEvents = [];
  const eventDate = new Date(event.startTime);
  const events = await prisma.event.findMany();
  for (const event of events) {
    if (eventDate.getFullYear() === parseInt(year)) {
      yearEvents.push(event);
    }
  }
  return yearEvents;
};

const getUpcomingEvents = async () => {
  const currDate = new Date();
  const events = await prisma.event.findMany();
  const upcomingEvents = [];
  for (const event of events) {
    const eventDate = new Date(event.startTime);
    if (currDate < eventDate) {
      upcomingEvents.push(event);
    }
  }

  return upcomingEvents;
};

module.exports = {
  createEvent,
  getEvents,
  getEvent,
  editEvent,
  deleteEvent,
  cancelEvent,
  deleteEventsByUser,
  getEventsByUser,
  cancelEventsByUser,
  unCancelEvent,
  unCancelEventsByUser,
  getCancelledEvents,
  getUncancelledEvents,
  getCancelledEventsFromUser,
  getUncancelledEventsFromUser,
};
