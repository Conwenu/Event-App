import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "react-bootstrap";
import EventHelperFunctions from "../Events/EventHelperFunctions.js";
import EditEventModal from "./EditEventModal";
import "./EditEventCard.css";

function formatDate(isoTime) {
  const date = new Date(isoTime);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}

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
}) {
  const [openEditModal, setOpenEditModal] = useState(false);
  const navigate = useNavigate();

  const handleEventClick = () => {
    const eventId = id;
    navigate(`/events/${eventId}`);
  };

  const defaultImage =
    image ||
    "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/80d79040496883.5781e6228fd81.jpg";

  const handleEditClick = () => {
    setOpenEditModal(true);
  };

  return (
    <>
      <div
        className=" mt-4 event-card"
        style={{
          cursor: "pointer",
        }}
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
            <button
              type="button"
              className="btn"
              onClick={handleEditClick} // Open the modal on button click
            >
              Edit Event
            </button>
            <button
              type="button"
              className="btn"
              style={{ backgroundColor: "var(--bs-danger)" }}
            >
              Cancel Event
            </button>
          </div>
        </div>
      </div>
      {openEditModal && (
        <EditEventModal event={event} setOpenEditModal={setOpenEditModal} />
      )}
    </>
  );
}
