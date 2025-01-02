import React from "react";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import "./UserEvents.css";
import UserEventCalendar from "./UserEventCalendar";
import UserEventGrid from "./UserEventGrid";
const UserEvents = () => {
  return (
    <div className="user-events-container">
      <Tabs
        defaultActiveKey="events-rsvpd"
        id="user-events-tabs"
        className="mb-3 nav-justified custom-userevents-tabs"
      >
        <Tab eventKey="events-rsvpd" title="Events RSVP'd For">
          <div>
            <UserEventCalendar />
          </div>
        </Tab>
        <Tab eventKey="events-created" title="Events Created">
          <div>
            <UserEventGrid style={{ paddingLeft: "5px" }} />
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default UserEvents;
