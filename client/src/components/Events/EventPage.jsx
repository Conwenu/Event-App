import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./EventPage.css";
const idk =
  "Lorem ipsum odor amet, consectetuer adipiscing elit. Fames eleifend per magnis posuere mi porta eros ligula fermentum. Dictumst ultricies est ante bibendum mauris sagittis iaculis. Semper habitasse pulvinar; metus mauris hac velit praesent massa massa. Mus justo ante imperdiet laoreet lacus integer posuere gravida. Facilisis vivamus torquent elit vehicula nisi taciti. Gravida non sollicitudin varius nec conubia mollis aptent phasellus. Tristique nulla primis elementum justo a imperdiet! Consequat eget cras ante ipsum semper faucibus platea.";
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
 */

/**
 * EventPage component that displays event details.
 * @returns {JSX.Element}
 */

const EventPage = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState();
  const getEvent = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3050/api/event/${eventId}`
      );

      setEvent(response.data);
      console.log(event.id);
    } catch (err) {
      console.log(err);
    }
  };

  const generateReservationString = (resLeft, maxRes) => {
    return `${maxRes - resLeft + " / " + maxRes}`;
  };
  function formatTimestamps(startTime1, startTime2) {
    function formatDateTime(timestamp) {
      const options = {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      };
      const dateTimeString = new Date(timestamp).toLocaleDateString(
        "en-US",
        options
      );
      const [date, time, period] = dateTimeString.split(/, | /);
      const formattedTime = `${time}${period.toLowerCase()}`;
      return `${date} ${formattedTime}`;
    }

    const formattedStartTime1 = formatDateTime(startTime1);
    const formattedStartTime2 = formatDateTime(startTime2);

    const date1 = formattedStartTime1.split(" ")[0];
    const date2 = formattedStartTime2.split(" ")[0];

    if (date1 === date2) {
      return `${date1} ${formattedStartTime1.split(" ")[1]} - ${
        formattedStartTime2.split(" ")[1]
      }`;
    } else {
      return `${formattedStartTime1} - ${formattedStartTime2}`;
    }
  }

  useEffect(() => {
    getEvent(eventId);
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
                <img className="specific-event-image" src={image}></img>
              </div>
              <div className="specific-event-res">
                <div className="specific-event-title">
                  <h1>{event.title}</h1>
                  <div>Venue: {event.venue}</div>
                  <div>
                    Date: {formatTimestamps(event.startTime, event.endTime)}
                  </div>
                </div>
                <div className="specific-event-res-info-container">
                  <div className="specific-event-res-info">
                    {event.reservationsLeft > 0 && (
                      <div>{`${event.maxReservationsPerUser} per user`}</div>
                    )}
                    <div>
                      <i className="bi bi-person-check"> </i>
                      {generateReservationString(
                        event.reservationsLeft,
                        event.maxReservations
                      )}
                    </div>
                  </div>
                  <div className="specific-event-reservation-button">
                    Reserve
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
    </>
  );
};

export default EventPage;
