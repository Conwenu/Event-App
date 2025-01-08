import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./EventPage.css";
import "bootstrap/dist/css/bootstrap.min.css";
import EventHelperFunctions from "./EventHelperFunctions.js";
import { Modal, Button, Form } from "react-bootstrap";
const API_URL = process.env.REACT_APP_API_URL;
// const idk =
//   "Lorem ipsum odor amet, consectetuer adipiscing elit. Fames eleifend per magnis posuere mi porta eros ligula fermentum. Dictumst ultricies est ante bibendum mauris sagittis iaculis. Semper habitasse pulvinar; metus mauris hac velit praesent massa massa. Mus justo ante imperdiet laoreet lacus integer posuere gravida. Facilisis vivamus torquent elit vehicula nisi taciti. Gravida non sollicitudin varius nec conubia mollis aptent phasellus. Tristique nulla primis elementum justo a imperdiet! Consequat eget cras ante ipsum semper faucibus platea.";
/**
 * @typedef {Object} Event
 * @property {number} id
 * @property {string} title
 * @property {string} description
 * @property {"SCHEDULED" | "CANCELLED" | "COMPLETED"} status
 * @property {string | null} image
 * @property {number} creatorId
 * @property {string} venue
 * @property {number} maxReservations
 * @property {number} reservationsLeft
 * @property {number} maxReservationsPerUser
 * @property {string} startTime
 * @property {string} endTime
 * @property {string} finalRSVPTime
 */

/**
 * EventPage component that displays event details.
 * @returns {JSX.Element}
 */

const EventPage = () => {
  const { eventId } = useParams();
  const userId = 10;
  const [event, setEvent] = useState();
  const [modalOpen, setModalOpen] = useState(false);
  const [editRSVPModalOpen, setEditRSVPModalOpen] = useState(false);
  const [reservedSeats, setReservedSeats] = useState(1);
  const isLoggedIn = true;
  const [reservation, setReservation] = useState(null);
  // const [openLogInPromptModal, setOpenLogInPromptModal] = useState(false);
  // const hasRSVPd = true;

  const getEvent = async () => {
    try {
      const response = await axios.get(`${API_URL}/event/${eventId}`);
      setEvent(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getReservation = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/reservation/${userId}/${eventId}`
      );
      setReservation(response.data);
      if (response.data) {
        setReservedSeats(response.data.seatsReserved);
      }
      console.log(response.data);
    } catch (err) {
      setReservation(null);
      console.log(err);
    }
  };

  const hasFinalRSVPTimePassed = () => {
    if (event.finalRSVPTime == null) {
      event.finalRSVPTime = event.startTime;
    }
    // const finalRSVPDate = new Date(event.finalRSVPTime);
    // return new Date() >= finalRSVPDate;
    return false;
  };

  const handleReserve = async () => {
    const postData = { seatsReserved: reservedSeats };
    try {
      const response = await axios.post(
        `${API_URL}/reservation/${userId}/${eventId}`,
        postData
      );
      alert(`Reserved ${reservedSeats} seats for ${event.title}`);
      setModalOpen(false);
      console.log("Reservation successful:", response.data);
      setReservation(response.data);
    } catch (error) {
      console.error(
        "There was an error making the reservation:",
        error.response ? error.response.data : error.message
      );
      alert(
        "There was an error making the reservation. Please try again or try at a later time."
      );
    }
  };

  const handleIncrement = () => {
    if (
      reservedSeats <
      Math.min(event.maxReservationsPerUser, event.reservationsLeft)
    ) {
      setReservedSeats(reservedSeats + 1);
    }
  };

  const handleDecrement = () => {
    if (reservedSeats > Math.min(1, event.reservationsLeft)) {
      setReservedSeats(reservedSeats - 1);
    }
  };

  const handleCancelReservation = async () => {
    alert(`Cancelled reserved seats for ${event.title}`);
    setEditRSVPModalOpen(false);
  };
  const handleEditReservation = async () => {
    alert(`Reserved ${reservedSeats} seats for ${event.title}`);
    setEditRSVPModalOpen(false);
  };

  useEffect(() => {
    getEvent();
    getReservation();
  }, []);

  const image = event
    ? event.image == null
      ? "https://media.cntraveler.com/photos/5eb18e42fc043ed5d9779733/16:9/w_4288,h_2412,c_limit/BlackForest-Germany-GettyImages-147180370.jpg"
      : event.image
    : "";

  return (
    <>
      {event ? (
        <div className="specific-event-page">
          <div className="specific-event">
            <div className="specific-event-container">
              <div className="specific-event">
                <img className="specific-event-image" src={image} alt="event" />
              </div>
              <div className="specific-event-res">
                <div className="specific-event-title">
                  <h1>{event.title}</h1>
                  <div>Venue: {event.venue}</div>
                  <div>
                    Date:{" "}
                    {EventHelperFunctions.formatTimestamps(
                      event.startTime,
                      event.endTime
                    )}
                  </div>
                </div>
                <div className="specific-event-res-info-container">
                  <div className="specific-event-res-info">
                    {event.reservationsLeft > 0 && (
                      <div>{`${event.maxReservationsPerUser} per user`}</div>
                    )}
                    <div>
                      <i className="bi bi-person-check"> </i>
                      {EventHelperFunctions.generateReservationString(
                        event.reservationsLeft,
                        event.maxReservations
                      )}
                    </div>
                  </div>
                  <div
                    className="specific-event-reservation-button"
                    onClick={() => {
                      if (hasFinalRSVPTimePassed()) {
                        return;
                      }
                      isLoggedIn
                        ? reservation
                          ? setEditRSVPModalOpen(true)
                          : setModalOpen(true)
                        : console.log("?");
                    }}
                    style={{
                      cursor: `${
                        hasFinalRSVPTimePassed() ? "default" : "pointer"
                      }`,
                      backgroundColor: `${
                        hasFinalRSVPTimePassed()
                          ? "var(--bs-danger)"
                          : "var(--primary)"
                      }`,
                    }}
                  >
                    {hasFinalRSVPTimePassed()
                      ? "RSVP Closed"
                      : isLoggedIn
                      ? reservation
                        ? "Edit Reservation"
                        : "Reserve"
                      : "Log In To Reserve Seats"}
                  </div>
                </div>
              </div>
            </div>
            <div className="specific-event-info">
              <div className="specific-event-info-desc">
                <h4>Description: </h4>{" "}
                {event.description ? event.description : <></>}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
      {modalOpen && (
        <Modal show={modalOpen} onHide={() => setModalOpen(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Reserve Seats for {event.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>Event Venue</Form.Label>
                <Form.Control
                  type="text"
                  value={event.venue}
                  readOnly
                  disabled
                  style={{
                    backgroundColor: "var(--background2)",
                    color: "var(--text)",
                  }}
                ></Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label>Event Time</Form.Label>
                <Form.Control
                  type="text"
                  value={EventHelperFunctions.formatTimestamps(
                    event.startTime,
                    event.endTime
                  )}
                  readOnly
                  disabled
                  style={{
                    backgroundColor: "var(--background2)",
                    color: "var(--text)",
                  }}
                ></Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label>Reservations</Form.Label>
                <div className="d-flex align-items-center">
                  <Button variant="outline-secondary" onClick={handleDecrement}>
                    -
                  </Button>
                  <Form.Control
                    type="text"
                    value={reservedSeats}
                    readOnly
                    className="text-center mx-2"
                    style={{
                      width: "50px",
                      backgroundColor: "var(--background2)",
                      color: "var(--text)",
                    }}
                  />
                  <Button variant="outline-secondary" onClick={handleIncrement}>
                    +
                  </Button>
                </div>
                <Form.Text style={{ color: "var(--text)" }}>
                  Max Reservations Per User: {event.maxReservationsPerUser}
                </Form.Text>
                <br />
                <Form.Text style={{ color: "var(--text)" }}>
                  Reservations Left: {event.reservationsLeft}
                </Form.Text>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setModalOpen(false)}
              style={{
                color: "var(--text)",
              }}
            >
              Close
            </Button>
            <Button
              variant="primary"
              onClick={handleReserve}
              style={{
                backgroundColor: "var(--primary)",
                borderColor: "var(--primary)",
                color: "var(--text)",
              }}
            >
              Reserve
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      {editRSVPModalOpen && (
        <Modal
          show={editRSVPModalOpen}
          onHide={() => setEditRSVPModalOpen(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Edit Reservation for {event.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>Event Venue</Form.Label>
                <Form.Control
                  type="text"
                  value={event.venue}
                  readOnly
                  disabled
                  style={{
                    backgroundColor: "var(--background2)",
                    color: "var(--text)",
                  }}
                ></Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label>Event Time</Form.Label>
                <Form.Control
                  type="text"
                  value={EventHelperFunctions.formatTimestamps(
                    event.startTime,
                    event.endTime
                  )}
                  readOnly
                  disabled
                  style={{
                    backgroundColor: "var(--background2)",
                    color: "var(--text)",
                  }}
                ></Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label>Edit Reserved Seats</Form.Label>
                <div className="d-flex align-items-center">
                  <Button variant="outline-secondary" onClick={handleDecrement}>
                    -
                  </Button>
                  <Form.Control
                    type="text"
                    value={reservedSeats}
                    readOnly
                    className="text-center mx-2"
                    style={{
                      width: "50px",
                      backgroundColor: "var(--background2)",
                      color: "var(--text)",
                    }}
                  />
                  <Button variant="outline-secondary" onClick={handleIncrement}>
                    +
                  </Button>
                </div>
                <Form.Text style={{ color: "var(--text)" }}>
                  Max Reservations Per User: {event.maxReservationsPerUser}
                </Form.Text>
                <br />
                <Form.Text style={{ color: "var(--text)" }}>
                  Reservations Left: {event.reservationsLeft}
                </Form.Text>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer className="d-flex justify-content-between">
            <Button
              variant="danger"
              onClick={handleCancelReservation}
              style={{
                backgroundColor: "var(--bs-danger)",
                borderColor: "var(--bs-danger)",
                color: "var(--text)",
              }}
            >
              Cancel Reservation
            </Button>
            <div>
              <Button
                variant="secondary"
                onClick={() => setEditRSVPModalOpen(false)}
                style={{
                  color: "var(--text)",
                }}
              >
                Close
              </Button>
              <Button
                variant="primary"
                onClick={handleEditReservation}
                style={{
                  backgroundColor: "var(--primary)",
                  borderColor: "var(--primary)",
                  color: "var(--text)",
                  marginLeft: "10px",
                }}
              >
                Edit Reservation
              </Button>
            </div>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default EventPage;
