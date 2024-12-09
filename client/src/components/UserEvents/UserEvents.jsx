import React from "react";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import "./UserEvents.css";

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
            <h2>Events RSVP'd For</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam
              ipsum praesentium voluptatem eligendi iusto labore accusantium
              ipsa dolorum, reprehenderit beatae reiciendis? Velit odio facere
              illo tempora exercitationem quia ab totam!
            </p>
          </div>
        </Tab>
        <Tab eventKey="events-created" title="Events Created">
          <div>
            <h2>Events Created</h2>
            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Odit
              reiciendis molestiae facere! Ea quibusdam nulla ipsa temporibus
              assumenda voluptatibus aut facere adipisci quis optio? Corporis
              nemo quidem voluptates neque quibusdam!
            </p>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default UserEvents;
