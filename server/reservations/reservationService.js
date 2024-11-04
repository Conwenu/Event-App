const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const {AppError} = require('../helpers/AppError')
const userService = require("../users/userService");

const validateReservationData = (reservationData, event) => {
  if (!reservationData) throw new AppError('reservationData is required', 400);
  if (!reservationData.seatsReserved) throw new AppError('Seats reserved is required', 400);
  if (reservationData.seatsReserved <= 0 || 
      reservationData.seatsReserved > event.maxReservationsPerUser ||
      reservationData.seatsReserved > event.reservationsLeft) {
    throw new AppError('Invalid reservation data', 400);
  }
};

const createReservation = async (userId, eventId, reservationData) => {
  const user = await prisma.user.findUnique({ where: { id: parseInt(userId) } });
  const event = await prisma.event.findUnique({ where: { id: parseInt(eventId) } });

  if (!user) throw new AppError('User not found', 400);
  if (!event) throw new AppError('Event not found', 400);

  validateReservationData(reservationData, event);

  const existingReservation = await prisma.reservation.findUnique({
    where: {
      userId_eventId: {
        userId: parseInt(userId),
        eventId: parseInt(eventId),
      },
    },
  });

  if (existingReservation) {
    throw new AppError('User already has a reservation for this event. Please try editing your reservation instead.', 400);
  }

  const now = new Date();
  if (event.startTime <= now) {
    throw new AppError('Cannot reserve for an event that is currently happening or has already happened.', 400);
  }

  const result = await prisma.$transaction(async (prisma) => {
    const newReservation = await prisma.reservation.create({
      data: {
        seatsReserved: reservationData.seatsReserved,
        userId: parseInt(userId),
        eventId: parseInt(eventId),
      },
    });

    await prisma.event.update({
      where: { id: parseInt(eventId) },
      data: { reservationsLeft: event.reservationsLeft - reservationData.seatsReserved },
    });

    return newReservation;
  });

  return result;
};


// Gets a user reservation for a given event
const getReservation = async (userId, eventId) => {
  const reservation = await prisma.reservation.findUnique({
    where: {
      userId_eventId: {
        userId: parseInt(userId),
        eventId: parseInt(eventId),
      },
    },
  });

  if (!reservation) {
    throw AppError('Reservation not found', 400)
  }
  return reservation;
};

// Gets the reservations for a given event
const getReservationsForEvent = async (eventId) => {
  const event = await prisma.event.findUnique({ where: { id: parseInt(eventId)}})

  if (!event) {
    throw new AppError('Event not found', 400);
  }

  const reservations = await prisma.reservation.findMany({
    where: { eventId: parseInt(eventId) },
    include: {
      user: true, // Include user details if needed
    },
  });

  return reservations;
};

// Gets the reservations for a given user
const getReservationsForUser = async (userId) => {
  const user = await userService.getUser(userId);
  
  if (!user) {
    throw new AppError('User not found', 400)
  }

  const reservations = await prisma.reservation.findMany({
    where: { userId: parseInt(userId) },
    include: {
      event: true, // Include event details if needed
    },
  });

  return reservations;
};

// Updates the reservation for a given user
const editReservation = async (id, userId, reservationData) => {
  // Fetch the reservation to ensure it belongs to the user
  const reservation = await prisma.reservation.findUnique({
    where: { id: parseInt(id) },
  });
  if (!reservation) {
    throw new AppError('Reservation not found', 400);
  }
  if (reservation.userId !== parseInt(userId)) {
    throw new AppError('Unauthorized', 400);
  }

  // Fetch the event to validate reservation data
  const event = await prisma.event.findUnique({
    where: { id: reservation.eventId },
  });

  validateReservationData(reservationData, event);

  const newSeatsReserved = parseInt(reservationData.seatsReserved);
  const oldSeatsReserved = parseInt(reservation.seatsReserved);
  const seatsDifference = newSeatsReserved - oldSeatsReserved;

  const updatedReservation = await prisma.$transaction(async (prisma) => {
    await prisma.event.update({
      where: { id: reservation.eventId },
      data: {
        reservationsLeft: {
          decrement: seatsDifference,
        },
      },
    });

    return await prisma.reservation.update({
      where: { id: parseInt(id) },
      data: reservationData,
    });
  });

  return updatedReservation;
  
};

const deleteReservation = async (userId, reservationId) => {
  const reservation = await prisma.reservation.findUnique({
    where: { id: parseInt(reservationId) },
  });

  if (!reservation) {
    throw new AppError('Reservation not found', 400)
  }
  
  if (reservation.userId !== parseInt(userId)) {
    throw new AppError('Unauthorized', 400)
  }

  const result = await prisma.$transaction(async (prisma) => {
    await prisma.event.update({
      where: { id: parseInt(reservation.eventId) },
      data: {
        reservationsLeft: {
          increment: reservation.seatsReserved,
        },
      },
    });

    await prisma.reservation.delete({
      where: { id: parseInt(reservationId) },
    });

    return { message: 'Reservation deleted successfully' };
  });

  return result;
};

const deleteAllReservationsForEvent = async (eventId) => {
  const event = await prisma.event.findUnique({
    where: { id: parseInt(eventId) },
  });

  if (!event) {
    throw new AppError('Event not found', 400)
  }

  // Fetch all reservations for the event
  const reservations = await prisma.reservation.findMany({
    where: { eventId: parseInt(eventId) },
  });

  // Sum up the seatsReserved values
  const totalSeatsReserved = reservations.reduce((sum, reservation) => sum + reservation.seatsReserved, 0);

  const result = await prisma.$transaction(async (prisma) => {
    await prisma.event.update({
      where: { id: parseInt(eventId) },
      data: {
        reservationsLeft: {
          increment: totalSeatsReserved,
        },
      },
    });

    await prisma.reservation.deleteMany({
      where: { eventId: parseInt(eventId) },
    });

    return { message: 'All reservations for the event deleted successfully' };
  });

  return result;
};


const deleteAllReservationsForUser = async (userId) => {
  const user = await prisma.user.findUnique({ where: { id: parseInt(userId) }});

  if (!user) {
    throw new AppError('User not found', 400)
  }

  // Fetch all reservations for the user
  const reservations = await prisma.reservation.findMany({
    where: { userId: parseInt(userId) },
  });

  // Group reservations by event and sum up the seatsReserved values
  const eventSeatsMap = reservations.reduce((map, reservation) => {
    if (!map[reservation.eventId]) {
      map[reservation.eventId] = 0;
    }
    map[reservation.eventId] += reservation.seatsReserved;
    return map;
  }, {});

  const result = await prisma.$transaction(async (prisma) => {
    for (const [eventId, seatsReserved] of Object.entries(eventSeatsMap)) {
      await prisma.event.update({
        where: { id: parseInt(eventId) },
        data: {
          reservationsLeft: {
            increment: seatsReserved,
          },
        },
      });
    }

    await prisma.reservation.deleteMany({
      where: { userId: parseInt(userId) },
    });

    return { message: 'All reservations for the user deleted successfully' };
  });

  return result;
};

// Gets the reservations for the events the user has registered for that have been cancelled
const getCancelledReservationsForUser = async (userId) => {
  const cancelledReservations = await prisma.reservation.findMany({
      where: {
          userId: parseInt(userId),
          event: {
              status: 'CANCELLED',
          },
      },
      include: {
          event: true, // Optionally include event details
      },
  });

  if (cancelledReservations.length === 0) {
      return { message: "No cancelled reservations found for this user." };
  }

  return cancelledReservations; // Return the list of cancelled reservations
};

// Gets the reservations for the events the user has registered for that have not been cancelled
const getUnCancelledReservationsForUser = async (userId) => {
  const unCancelledReservations = await prisma.reservation.findMany({
      where: {
          userId: parseInt(userId),
          event: {
              status: 'SCHEDULED',
          },
      },
      include: {
          event: true, // Optionally include event details
      },
  });

  if (unCancelledReservations.length === 0) {
      return { message: "No uncancelled reservations found for this user." };
  }

  return unCancelledReservations; // Return the list of uncancelled reservations
};


module.exports = {
  createReservation,
  getReservation,
  getReservationsForEvent,
  getReservationsForUser,
  editReservation,
  deleteReservation,
  deleteAllReservationsForEvent,
  deleteAllReservationsForUser,
  getCancelledReservationsForUser,
  getUnCancelledReservationsForUser
};
