const reservationService = require("./reservationService");
const { handleError } = require("../helpers/AppError");
const {validateIntegerParameters} = require("../helpers/validateParameters")
// Create a new reservation
const createReservation = async (req, res) => {
  const { userId, eventId } = req.params;
  const { seatsReserved } = req.body;
  if (!validateIntegerParameters({ userId, eventId, seatsReserved }, res)) return;
  try {
    const reservation = await reservationService.createReservation(
      userId,
      eventId,
      { seatsReserved }
    );
    res.json(reservation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Gets a user reservation for a given event
const getReservation = async (req, res) => {
  const { userId, eventId } = req.params;
  if (!validateIntegerParameters({userId, eventId}, res)) return;
  try {
    const reservation = await reservationService.getReservation(userId, eventId);
    res.json(reservation);
  } catch (error) {
    handleError(res, error);
  }
};

// Gets all reservations for a given event
const getReservationsForEvent = async (req, res) => {
  const { eventId } = req.params;
  if (!validateIntegerParameters({ eventId }, res)) return;
  try {
    const reservation = await reservationService.getReservationsForEvent(eventId);
    res.json({reservation});
  } catch (error) {
    handleError(res, error);
  }
};

// Gets all reservation events for a given user
const getReservationsForUser = async (req, res) => {
  const { userId } = req.params;
  if (!validateIntegerParameters({ userId }, res)) return;
  try {
    const reservation = await reservationService.getReservationsForUser(userId);
    res.json(reservation);
  } catch (error) {
    handleError(res, error);
  }
};

// Edits a reservation
const editReservation = async (req, res) => {
  const { reservationId, userId } = req.params;
  const { seatsReserved } = req.body;
  if (!validateIntegerParameters({ reservationId, userId, seatsReserved }, res)) return;
  try {
    const reservation = await reservationService.editReservation(
      reservationId,
      userId,
      {seatsReserved}
    );
    res.json(reservation);
  } catch (error) {
    handleError(res, error);
  }
};

// Deletes / Cancels a reservation
const deleteReservation = async (req, res) => {
  const { reservationId, userId } = req.params;
  if (!validateIntegerParameters({ reservationId, userId }, res)) return;
  try {
    const result = await reservationService.deleteReservation(userId,reservationId);
    if (result.error) {
      return res.status(400).json(result); // Return the error message
    }
    res.json(result);
  } catch (error) {
    handleError(res, error);
  }
};

// Deletes /  Cancels all reservations for an event
const deleteAllReservationsForEvent = async (req, res) => {
  const { eventId } = req.params;
  if (!validateIntegerParameters({ eventId }, res)) return;
  try {
    const result = await reservationService.deleteAllReservationsForEvent(eventId);
    if (result.error) {
      return res.status(400).json(result); // Return the error message
    }
    res.json({ message: "Reservations for event deleted successfully" });
  } catch (error) {
    handleError(res, error);
  }
};

// Deletes /  Cancels all reservation events for a user
const deleteAllReservationsForUser = async (req, res) => {
  const { userId } = req.params;
  if (!validateIntegerParameters({ userId }, res)) return;
  try {
    const result = await reservationService.deleteAllReservationsForUser(userId);
    if (result.error) {
      return res.status(400).json(result); // Return the error message
    }
    res.json({ message: "Reservations for user deleted successfully" });
  } catch (error) {
    handleError(res, error);
  }
};

const getCancelledReservationsForUser  = async (req, res) => {
  const {userId} = req.params;
  if (!validateIntegerParameters({userId}, res)) return;
  try {
    const reservations = reservationService.getCancelledReservationsForUser(userId);
    res.json({reservations})
  } catch (error) {
    handleError(res, error);
  }
}
const getUnCancelledReservationsForUser = async (req, res) => {
  const {userId} = req.params;
  if (!validateIntegerParameters({ userId }, res)) return;
  try {
    const reservations = reservationService.getUnCancelledReservationsForUser(userId);
    res.json({reservations})
  } catch (error) {
    handleError(res, error);
  }
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
