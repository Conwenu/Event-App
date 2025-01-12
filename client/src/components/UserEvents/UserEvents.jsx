import React from "react";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import { useNavigate, useParams } from "react-router-dom";
import "./UserEvents.css";
import UserEventCalendar from "./UserEventCalendar";
import UserEventGrid from "./UserEventGrid";
const UserEvents = ({ userId, innerTabId }) => {
  const { tabId } = useParams();
  const navigate = useNavigate();

  const handleInnerTabSelect = (innerTabKey) => {
    navigate(`/profile/${tabId}/${userId}/${innerTabKey}`);
  };

  return (
    <div className="user-events-container">
      <Tabs
        defaultActiveKey="myRsvps"
        id="user-events-tabs"
        activeKey={innerTabId || "myRsvps"}
        className="mb-3 nav-justified custom-userevents-tabs"
        onSelect={handleInnerTabSelect}
      >
        <Tab eventKey="myRsvps" title="My RSVP's">
          <div>
            <UserEventCalendar />
          </div>
        </Tab>
        <Tab eventKey="myCreatedEvents" title="My Created Events">
          <div>
            <UserEventGrid style={{ paddingLeft: "5px" }} />
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default UserEvents;
