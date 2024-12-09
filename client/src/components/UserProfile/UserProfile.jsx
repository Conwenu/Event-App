import React from "react";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import "./UserProfile.css";
import UserEvents from "../UserEvents/UserEvents";
import CreateEvent from "../UserEvents/CreateEvent";
import UserSettings from "../UserSettings/UserSettings";
const UserProfile = () => {
  return (
    <div className="user-profile-container">
      <Tabs
        defaultActiveKey="view-events"
        id="user-profile-tabs"
        className="mb-3 nav-justified custom-tabs"
      >
        <Tab eventKey="view-events" title="View Events">
          <div>
            <UserEvents />
          </div>
        </Tab>
        <Tab eventKey="create-event" title="Create Event">
          <CreateEvent />
        </Tab>
        <Tab eventKey="settings" title="Settings">
          <UserSettings />
        </Tab>
      </Tabs>
    </div>
  );
};

export default UserProfile;
