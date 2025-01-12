import React from "react";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import { useNavigate, useParams } from "react-router-dom";
import "./UserProfile.css";
import UserEvents from "../UserEvents/UserEvents";
import CreateEvent from "../UserEvents/CreateEvent";
import UserSettings from "../UserSettings/UserSettings";
const UserProfile = () => {
  const { tabId, userId, innerTabId } = useParams();
  const navigate = useNavigate();
  const handleTabSelect = (tabKey) => {
    if (tabKey === "viewEvents") {
      navigate(`/profile/${tabKey}/${userId}/myRsvps`);
    } else {
      navigate(`/profile/${tabKey}/${userId}/${tabKey}`);
    }
  };
  return (
    <div className="user-profile-container">
      <Tabs
        defaultActiveKey="viewEvents"
        id="user-profile-tabs"
        className="mb-3 nav-justified custom-tabs"
        activeKey={tabId || "viewEvents"}
        onSelect={handleTabSelect}
      >
        <Tab eventKey="viewEvents" title="View Events">
          <div>
            <UserEvents userId={userId} innerTabId={innerTabId || "myRsvps"} />
          </div>
        </Tab>
        <Tab eventKey="createEvents" title="Create Events">
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
