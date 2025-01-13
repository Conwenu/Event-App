import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge, Modal, Button, Form } from "react-bootstrap";
import EventHelperFunctions from "../Events/EventHelperFunctions.js";
import EditEventModal from "./EditEventModal";
import "./EditEventCard.css";
import axios from "axios";
import * as Yup from "yup";
const API_URL = process.env.REACT_APP_API_URL;
function formatDate(isoTime) {
  const date = new Date(isoTime);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}

const cancelEventSchema = Yup.object().shape({
  reason: Yup.string()
    .min(8, "Reason must be at least 8 characters long")
    .max(240, "Reason must be at most 240 characters long")
    .required("Please provide a reason for cancelling the event"),
});

export default function EditEventCard({
  title,
  startTime,
  endTime,
  image,
  status,
  maxReservations,
  reservationsLeft,
  event,
  id,
  fetchEvents,
}) {
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openCancelEventModal, setOpenCancelModal] = useState(false);
  const [openUnCancelEventModal, setOpenUnCancelEventModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const isCancelled = status === "CANCELLED" ? true : false;
  const handleEventClick = () => {
    const eventId = id;
    navigate(`/events/${eventId}`);
  };
  const defaultImage =
    image ||
    "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/80d79040496883.5781e6228fd81.jpg";

  const handleEditClick = (e) => {
    e.stopPropagation();
    setOpenEditModal(true);
  };

  const handleCancelClick = (e) => {
    e.stopPropagation();
    setOpenCancelModal(true);
  };

  const handleUnCancelClick = (e) => {
    e.stopPropagation();
    setOpenUnCancelEventModal(true);
  };

  const handleEventCancel = async () => {
    try {
      await cancelEventSchema.validate(
        { reason: cancelReason },
        { abortEarly: false }
      );

      try {
        const response = await axios.put(`${API_URL}/event/cancel/${id}`, {
          status: "CANCELLED",
          reason: cancelReason,
        });
        console.log("Event cancelled successfully:", response.data);
        setOpenCancelModal(false);
        fetchEvents();
      } catch (error) {
        console.error("Error cancelling event:", error);
      }
    } catch (err) {
      setErrorMessage(err.errors[0]);
    }
  };

  const handleEventUnCancel = async () => {
    try {
      const response = await axios.put(`${API_URL}/event/uncancel/${id}`, {
        status: "ACTIVE",
      });
      console.log("Event uncancelled successfully:", response.data);
      setOpenUnCancelEventModal(false);
      fetchEvents();
    } catch (error) {
      console.error("Error uncancelling event:", error);
    }
  };

  return (
    <>
      <div
        className=" mt-4 event-card"
        style={{
          cursor: "pointer",
        }}
        onClick={handleEventClick}
      >
        <div className="event-image-container">
          <img
            src={defaultImage}
            className="card-img-top"
            alt={title}
            style={{
              borderRadius: "8px",
              width: "355px ",
              height: "188px ",
            }}
          />
          <Badge
            className={`${EventHelperFunctions.mapStatusToColor(
              EventHelperFunctions.determineStatus(startTime, endTime, status)
            )} bg-pill`}
            style={{ position: "absolute", top: "10px", right: "10px" }}
          >
            {EventHelperFunctions.determineStatus(startTime, endTime, status)}
          </Badge>
        </div>

        <div className="card-body custom-card-body">
          <h5 className="card-title">{title}</h5>
          <div className="d-flex justify-content-between">
            <p className="card-title">{formatDate(startTime)}</p>
            <p>
              <i className="bi bi-person-check"> </i>
              {maxReservations - reservationsLeft + "/" + maxReservations}
            </p>
          </div>
          <div className="edit-event-card-buttons">
            <button type="button" className="btn" onClick={handleEditClick}>
              Edit Event
            </button>
            <button
              type="button"
              className="btn"
              style={{
                backgroundColor: isCancelled
                  ? "var(--primary)"
                  : "var(--bs-danger)",
              }}
              onClick={isCancelled ? handleUnCancelClick : handleCancelClick}
            >
              {isCancelled ? "Uncancel Event" : "Cancel Event"}
            </button>
          </div>
        </div>
      </div>

      {openEditModal && (
        <EditEventModal
          event={event}
          setOpenEditModal={setOpenEditModal}
          fetchEvents={fetchEvents}
        />
      )}
      <Modal
        show={openCancelEventModal}
        onHide={() => setOpenCancelModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Cancel Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to cancel this event?</p>

          <Form noValidate>
            <Form.Group controlId="cancelReason">
              <Form.Label>Reason for Cancellation</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Please provide a reason for cancelling the event..."
                isInvalid={!!errorMessage}
              />
              {errorMessage && (
                <div className="text-danger">{errorMessage}</div>
              )}
            </Form.Group>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setOpenCancelModal(false)}
              >
                Close
              </Button>
              <Button variant="danger" onClick={handleEventCancel}>
                Cancel Event
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal
        show={openUnCancelEventModal}
        onHide={() => setOpenUnCancelEventModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Uncancel Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to uncancel this event?</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setOpenUnCancelEventModal(false)}
          >
            Close
          </Button>
          <Button
            style={{
              backgroundColor: "var(--primary)",
              color: "var(--text)",
              border: "var(--primary)",
            }}
            onClick={handleEventUnCancel}
          >
            Uncancel Event
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
