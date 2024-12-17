// import { useState, useEffect } from "react";
// import { Card } from "react-bootstrap";
// import { Link } from "react-router-dom";
// import axios from "axios";
import EventHelperFunctions from "./EventHelperFunctions.js";
import { Badge } from "react-bootstrap";
function formatDate(isoTime) {
  const date = new Date(isoTime);

  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();

  return `${month}/${day}/${year}`;
}

export default function EventCard({
  title,
  startTime,
  endTime,
  image,
  status,
  maxReservations,
  reservationsLeft
}) {
  
  // const defaultImage1 =
  //   "https://wallpapercat.com/w/full/6/2/1/116007-3840x2160-desktop-4k-bleach-wallpaper-photo.jpg";

    const defaultImage = "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/80d79040496883.5781e6228fd81.jpg";
  return (
    <>
      <div className=" mt-4 event-card">
              <div className="event-image-container">
                <img
                  src={defaultImage}
                  className="card-img-top"
                  alt={title}
                  style={{ borderRadius: "8px" }}
                />
                <Badge
                  className={`${EventHelperFunctions.mapStatusToColor(
                    status
                  )} bg-pill`}
                  style={{ position: "absolute", top: "10px", right: "10px" }}
                >
                  {status}
                </Badge>
                {/* <span className="event-badge badge badge-secondary">{event.status}</span> */}
              </div>

              <div className="card-body custom-card-body">
                <h5 className="card-title">{title}</h5>
                <div className="d-flex justify-content-between">
                  <p className="card-title">{formatDate(startTime)}</p>
                  {/* If the reservation percentage is like over 90% then i'll highlight it red else if the user is registered then highlight it green */}
                  <p>
                    <i className="bi bi-person-check"> </i>
                    {maxReservations -
                      reservationsLeft +
                      "/" +
                      maxReservations}
                  </p>
                  {/* When I implement application wide user context, i'll check if the client has already registered for this event
                  <p> <i className="bi bi-person-fill-check"></i> {event.maxReservations - event.reservationsLeft + "/" + event.maxReservations}</p> 
                */}
                </div>
              </div>
            </div>
    </>
  );
}

// I only need the image, title and date