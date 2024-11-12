import React, { useEffect, useState } from "react";
import axios from "axios";
import "./EventPage.css";
// import { Badge } from "react-bootstrap";
// import EventHelperFunctions from "./EventHelperFunctions.js";
// import EventCard from "./EventCard.js";
import Sidebar from "../Sidebar/Sidebar.jsx";
const API_URL = process.env.REACT_APP_API_URL;

// function formatDate(isoTime) {
//   const date = new Date(isoTime);

//   const month = String(date.getMonth() + 1).padStart(2, "0");
//   const day = String(date.getDate()).padStart(2, "0");
//   const year = date.getFullYear();

//   return `${month}/${day}/${year}`;
// }

// function getMonth(isoTime) {
//   const date = new Date(isoTime);
//   var monthName = new Intl.DateTimeFormat("en-US", { month: "long" }).format;
//   var longName = monthName(date);
//   return `${longName}`
// }

const EventPage = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${API_URL}/events`);
        setEvents(response.data.events);
      } catch (err) {
        setIsError(true);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // const defaultImage =
  //   "https://wallpapercat.com/w/full/6/2/1/116007-3840x2160-desktop-4k-bleach-wallpaper-photo.jpg";

  if (isLoading)
    return (
      <>
        <Sidebar />
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading events...</p>
        </div>
      </>
    );

  if (isError)
    return (
      <>
      <Sidebar />
        <div className="error-container">
          <p>Error loading events: {error}</p>
        </div>
      </>
    );

  if (!events || events.length === 0)
    return (
      <>
        <div className="error-container">
          <p>No events found.</p>
        </div>
      </>
    );

  return (
    <>
      <Sidebar />
      <div className="container mt-5">
        {/* <h1 className="text-center">Event Page</h1> */}
        {/* <h2 className="text-start">Events</h2> */}
        {/* <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4">
          {events.map((event) => (
            <div className="col" key={event.id}>
              <EventCard {...event} />
            </div>
          ))}
        </div> */}
      </div>
    </>
  );
};

export default EventPage;
