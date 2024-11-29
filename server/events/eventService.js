// server/events/eventService.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const reservationService = require('../reservations/reservationService')

const createEvent = async (eventData) => {
    const { title, description, status, creatorId, venue, maxReservations, maxReservationsPerUser, startTime, endTime } = eventData;

    // Validate required fields
    if (!title || !description || !creatorId || !venue || maxReservations == null || maxReservationsPerUser == null || !startTime || !endTime) {
        throw new Error("All fields are required.");
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
        },
    });
};

const getEvents = async () => {
    return await prisma.event.findMany();
}

const getEvents2 = async () => {
    const events = await prisma.event.findMany();
    return events;
}

const getEvent = async (id) => {
    return await prisma.event.findUnique({
        where: { id: parseInt(id) },
    });
}

const editEvent = async (id, eventData) => {
    // Fetch the current event data including reservations
    const currentEvent = await prisma.event.findUnique({
        where: { id: parseInt(id) },
        include: { reservations: true }, // Include reservations for validation
    });

    if (!currentEvent) {
        throw new Error("Event not found.");
    }

    const now = new Date();
    // Validate startTime and endTime
    if (eventData.startTime) {
        const newStartTime = new Date(eventData.startTime);
        if (newStartTime < now) {
            throw new Error("Start time cannot be in the past.");
        }
        if (eventData.endTime) {
            const newEndTime = new Date(eventData.endTime);
            if (newStartTime >= newEndTime) {
                throw new Error("Start time must be before end time.");
            }
        }
    }
    
    if (currentEvent.startTime <= now && currentEvent.endTime >= now) {
        throw new Error("Cannot edit an event that is currently ongoing.");
    }

    const { maxReservations, maxReservationsPerUser } = eventData;

    // Calculate the total seats reserved
    const totalSeatsReserved = currentEvent.reservations.reduce((total, reservation) => total + reservation.seatsReserved, 0);

    // Check if changing maxReservations is valid
    if (maxReservations !== undefined && totalSeatsReserved > maxReservations) {
        throw new Error("Cannot decrease maxReservations below current reservations.");
    }

    // Check if changing maxReservationsPerUser is valid
    if (maxReservationsPerUser !== undefined) {
        for (const reservation of currentEvent.reservations) {
            if (reservation.seatsReserved > maxReservationsPerUser) {
                throw new Error("User has exceeded the new maxReservationsPerUser limit.");
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
}

const deleteEventsByUser = async (userId) => {
    const events = await prisma.event.findMany({
        where: { creatorId: parseInt(userId) },
    });

    for (const event of events) {
        await reservationService.deleteAllReservationsForEvent(event.id)
    }

    const deleteResult = await prisma.event.deleteMany({
        where: { creatorId: parseInt(userId) },
    });

    return { message: `${deleteResult.count} events and their reservations deleted successfully` };
}

const getEventsByUser = async (userId) => {
    return await prisma.event.findMany({
        where: { creatorId: parseInt(userId) },
    });
}

const cancelEvent = async (id) => {
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

    if (event.status === 'CANCELLED') {
        return { message: "Event is already cancelled." };
    }

    await prisma.event.update({
        where: { id: parseInt(id) },
        data: { status: 'CANCELLED' },
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

    if (event.status === 'SCHEDULED') {
        return { message: "Event is already scheduled." };
    }

    await prisma.event.update({
        where: { id: parseInt(id) },
        data: { status: 'SCHEDULED' },
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
        } else if (event.status !== 'CANCELLED') {
            await prisma.event.update({
                where: { id: event.id },
                data: { status: 'CANCELLED' },
            });
            cancelledEvents.push(event.title);
        }
    }

    const message = cancelledEvents.length > 0 
        ? `Cancelled events: ${cancelledEvents.join(', ')}.`
        : "No events were cancelled.";

    const ongoingMessage = ongoingEvents.length > 0 
        ? ` Ongoing events cannot be cancelled: ${ongoingEvents.join(', ')}.` 
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
        } else if (event.status === 'CANCELLED') {
            await prisma.event.update({
                where: { id: event.id },
                data: { status: 'SCHEDULED' },
            });
            restoredEvents.push(event.title);
        }
    }

    const message = restoredEvents.length > 0 
        ? `Restored events: ${restoredEvents.join(', ')}.`
        : "No events were restored.";

    const ongoingMessage = ongoingEvents.length > 0 
        ? ` Ongoing events cannot be restored: ${ongoingEvents.join(', ')}.` 
        : "";

    return { message: message + ongoingMessage };
};

const getCancelledEvents = async () => {
    return await prisma.event.findMany({
        where: { status: 'CANCELLED' },
    });
};

const getUncancelledEvents = async () => {
    return await prisma.event.findMany({
        where: { status: 'SCHEDULED' },
    });
};

const getCancelledEventsFromUser = async (userId) => {
    const cancelledEvents = await prisma.event.findMany({
        where: {
            AND: [
                { creatorId: parseInt(userId) },
                { status: 'CANCELLED' },
            ],
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
            AND: [
                { creatorId: parseInt(userId) },
                { status: 'CANCELLED' },
            ],
        },
    });

    if (unCancelledEvents.length === 0) {
        return { message: "No cancelled events found for this user." };
    }

    return unCancelledEvents;
};

// FIXME:
const getEventsByDay = async (day) =>{
    const events = await prisma.event.findMany();
    const dayEvents = [];
    for(const event of events) {
        const eventDate = new Date(event.startTime);
        if(eventDate.getDay() == day) {
            dayEvents.push(event);
        }
    }
}

const getEventsByMonth = async (month) => {
    const monthEvents = [];
    const events = await prisma.event.findMany();
    for (const event of events) {
        const eventDate = new Date(event.startTime);
        if(eventDate.getMonth() + 1 ===  parseInt(month))
        {
            monthEvents.push(event);
        }
    }
    return monthEvents;
}

const getEventsByYear = async (year) => {
    const yearEvents = [];
    const eventDate = new Date(event.startTime);
    const events = await prisma.event.findMany();
    for (const event of events) {
        
        if(eventDate.getFullYear() ===  parseInt(year))
        {
            yearEvents.push(event);
        }
    }
    return yearEvents;
}

const getUpcomingEvents = async() => {
    const currDate = new Date();
    const events = await prisma.event.findMany();
    const upcomingEvents = [];
    for (const event of events) {
        const eventDate = new Date(event.startTime);
        if(currDate < eventDate){
            upcomingEvents.push(event);
        }
    }

    return upcomingEvents;
}

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
    getUncancelledEventsFromUser
};
