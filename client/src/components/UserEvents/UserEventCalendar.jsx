import React, { useState, useEffect } from "react";
import Fullcalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import "./UserEventCalendar.css";
const API_URL = process.env.REACT_APP_API_URL;

function UserEventCalendar() {
  const [events, setEvents] = useState([]);
  const [initialDate, setInitialDate] = useState(new Date().toISOString()); // Default to the current date

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${API_URL}/reservation/user/10`);
        const data = await response.json();
        console.log(data);

        const mappedEvents = data.map(({ event }) => ({
          title: event.title,
          start: event.startTime,
          end: event.endTime,
          extendedProps: {
            description: event.description,
            creatorId: event.creatorId,
            venue: event.venue,
            status: event.status,
            reservationsLeft: event.reservationsLeft,
            maxReservations: event.maxReservations,
          },
        }));

        setEvents(mappedEvents);

        // get the first upcoming event or default to the current date
        const now = new Date();
        const futureEvent = mappedEvents.find((e) => new Date(e.start) > now);
        setInitialDate(
          futureEvent ? futureEvent.start : new Date().toISOString()
        );
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  const getEventClassNames = (eventInfo) => {
    const now = new Date();
    const start = new Date(eventInfo.event.start);
    const end = new Date(eventInfo.event.end);

    if (end < now) {
      return "event-passed";
    } else if (start <= now && end >= now) {
      return "event-ongoing";
    } else {
      return "event-scheduled";
    }
  };

  const renderEventContent = (eventInfo) => {
    const now = new Date();
    const start = new Date(eventInfo.event.start);
    const end = new Date(eventInfo.event.end);

    let bulletColor;
    if (end < now) {
      bulletColor = "gray";
    } else if (start <= now && end >= now) {
      bulletColor = "green";
    } else {
      bulletColor = "blue";
    }

    return (
      <div className="custom-event-content">
        <span
          className="custom-event-bullet"
          style={{ backgroundColor: bulletColor }}
        ></span>
        <span>{eventInfo.event.title}</span>
      </div>
    );
  };

  return (
    <div>
      <Fullcalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
        initialView="dayGridMonth"
        initialDate={initialDate}
        headerToolbar={{
          start: "prevYear,prev,today,next,nextYear",
          center: "title",
          end: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
        }}
        buttonText={{
          today: "Today",
          month: "Month",
          week: "Week",
          day: "Day",
          list: "List View",
        }}
        eventClassNames={getEventClassNames}
        eventContent={renderEventContent}
        height="auto"
        contentHeight="auto"
        themeSystem="bootstrap5"
        events={events}
      />
    </div>
  );
}

export default UserEventCalendar;
