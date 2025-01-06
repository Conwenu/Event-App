import React, { useState, useEffect } from "react";
import "./UserEventGrid.css";
import axios from "axios";
import UserEventGridHeader from "./UserEventGridHeader.jsx";
import EventCard from "../Events/EventCard.jsx";
const API_URL = process.env.REACT_APP_API_URL;
const UserEventGrid = () => {
  const [events, setEvents] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSort, setSelectedSort] = useState("");
  const [searchFilters, setSearchFilters] = useState("");
  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${API_URL}/userEvents`, {
        params: {
          userId: 19,
          searchQuery: searchFilters,
          sort: selectedSort,
        },
      });
      setEvents(response.data.events);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Failed to load events. Please try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [searchFilters, selectedSort]);

  const onSearchChange = (value) => {
    setSearchFilters(value);
  };

  const handleSearchChange = (event) => {
    if (event.key === "Enter") {
      // Trigger search when pressing Enter
      console.log("Search triggered: ", searchFilters);
    }
  };

  const handleSearchButtonClick = () => {
    // Example of search button logic
    console.log("Search button clicked with query:", searchFilters);
    // You could perform the search action here, like filtering data
  };

  const onSortChange = (value) => {
    setSelectedSort(value);
  };

  return (
    <div>
      <UserEventGridHeader
        searchFilters={searchFilters}
        onSearchChange={onSearchChange}
        handleSearchChange={handleSearchChange}
        handleSearchButtonClick={handleSearchButtonClick}
        selectedSort={selectedSort}
        onSortChange={onSortChange}
      />
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 event-container user-event-grid-event-container">
        {loading ? (
          <div
            className="d-flex justify-content-center align-items-center w-100"
            style={{ height: "200px" }}
          >
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : error ? (
          <div
            className="d-flex justify-content-center align-items-center w-100"
            style={{ height: "200px" }}
          >
            <p className="text-center mb-0">{error}</p>
          </div>
        ) : events && events.length > 0 ? (
          events.map((event) => (
            <div className="col" key={event.id}>
              <EventCard {...event} />
            </div>
          ))
        ) : (
          <div
            className="d-flex justify-content-center align-items-center w-100"
            style={{ height: "200px" }}
          >
            <p className="text-center mb-0">
              You have created no events. <a href="">Create Some</a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserEventGrid;
