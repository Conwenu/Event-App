import React from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import "./UserProfile.css";
const UserProfile = () => {
  return (
    <>
      <nav class="nav nav-pills flex-column flex-sm-row">
        <a
          class="flex-sm-fill text-sm-center nav-link active"
          aria-current="page"
          href="#"
        >
          View Events
        </a>
        <a class="flex-sm-fill text-sm-center nav-link" href="#">
          Create Event
        </a>
        <a class="flex-sm-fill text-sm-center nav-link" href="#">
          Settings
        </a>
      </nav>
    </>
  );
};

export default UserProfile;
