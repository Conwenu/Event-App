import React, { useEffect, useState } from "react";
import axios from "axios";
import "./EventPage.css";
// import { Badge } from "react-bootstrap";
// import EventHelperFunctions from "./EventHelperFunctions.js";
import EventCard from "./EventCard.js";
import Sidebar from "../Sidebar/Sidebar.jsx";
// import SortingFilters from "../Sidebar/SortingFilters.jsx";
import Header2 from "./Header2.jsx";
import Sidebar2 from "../Sidebar/Sidebar2.jsx";
import SortingFilters from "../Sidebar/SortingFilters.jsx";
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
  // const [sortOpen, setSortOpen] = useState(false);
  // const [selectedSorting, setSelectedSorting] = useState("");
  // const handleSortingFilterChange = (value) => {
  //   setSelectedSorting(value);
  // };

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

  const [timeFilter, setTimeFilter] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedSorting, setSelectedSorting] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(() => {
    return String(new Date().getMonth() + 1).padStart(2, "0");
  });

  const [multipleFilters, setMultipleFilters] = useState({
    eventStatus: [],
    reservationAbility: [],
  });

  const [durationFilter, setDurationFilter] = useState({
    min: "",
    max: "",
  });

  const [searchFilters, setSearchFilters] = useState("");

  const getCurrentDateFormatted = () => {
    // Get the current date
    var currentDate = new Date();

    // Get the year, month, and day
    var year = currentDate.getFullYear();
    var month = currentDate.getMonth() + 1; // Months are 0-indexed, so we add 1
    var day = currentDate.getDate();

    // Format the month and day to ensure they are always two digits (e.g., 01, 09)
    month = month < 10 ? "0" + month : month;
    day = day < 10 ? "0" + day : day;

    // Return the formatted date in YYYY-MM-DD format
    return year + "-" + month + "-" + day;
  };

  const maxWidth = 990;

  const [showModal, setShowModal] = useState(false);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= maxWidth);

  const toggleModal = () => {
    setShowModal(!showModal);
    console.log("Modal: ", showModal);
    console.log("Mobile: ", isMobile);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= maxWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleTimeFilterChange = (value, year) => {
    setTimeFilter(value);
    setStartDate("");
    // if(value == "today")
    //   {
    //     setStartDate(getCurrentDateFormatted());
    //   }
    if (year) {
      setSelectedYear(year);
    }
  };

  const handleSortingFilterChange = (value) => {
    setSelectedSorting(value);
  };

  const handleDateRangeChange = (name, value) => {
    if (name === "startDate") {
      setStartDate(value);
    } else if (name === "endDate") {
      setEndDate(value);
    }
  };

  const handleMultipleFilterChange = (filterType, value) => {
    setMultipleFilters((prevState) => {
      const newFilterValues = [...prevState[filterType]];
      if (newFilterValues.includes(value)) {
        newFilterValues.splice(newFilterValues.indexOf(value), 1);
      } else {
        newFilterValues.push(value);
      }
      return { ...prevState, [filterType]: newFilterValues };
    });
  };

  const handleDurationChange = (name, value) => {
    if (value < 0) {
      value = 0;
    }
    setDurationFilter((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const resetFilters = () => {
    setTimeFilter("");
    setStartDate("");
    setEndDate("");
    setSelectedMonth("");
    setSelectedSorting("");
    setMultipleFilters({
      eventStatus: [],
      reservationAbility: [],
    });

    setSelectedYear(new Date().getFullYear());
    setDurationFilter({
      min: "",
      max: "",
    });
    setSearchFilters("");
  };

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
      <div className="full-events-page">
        <Header2
          selectedSorting={selectedSorting}
          onSortingChange={handleSortingFilterChange}
          searchFilters={searchFilters}
          onSearchChange={setSearchFilters}
          toggleModal={toggleModal}
        />
        {isMobile ? (
          <>
            <Sidebar2
              timeFilter={timeFilter}
              selectedYear={selectedYear}
              startDate={startDate}
              endDate={endDate}
              onTimeFilterChange={handleTimeFilterChange}
              onDateRangeChange={handleDateRangeChange}
              setSelectedYear={setSelectedYear}
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
              selectedEventStatus={multipleFilters.eventStatus}
              onEventStatusChange={(value) =>
                handleMultipleFilterChange("eventStatus", value)
              }
              selectedReservationAbility={multipleFilters.reservationAbility}
              onReservationAbilityChange={(value) =>
                handleMultipleFilterChange("reservationAbility", value)
              }
              durationFilter={durationFilter}
              handleDurationChange={handleDurationChange}
              resetFilters={resetFilters}
              selectedSorting={selectedSorting}
              onSortingChange={handleSortingFilterChange}
              isMobile={isMobile}
              showModal={showModal}
              toggleModal={toggleModal}
            />
            {/* <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 event-container">
              {events.map((event) => (
                <div className="col" key={event.id}>
                  <EventCard {...event} />
                </div>
              ))}
            </div> */}

            <div>
              <h1>{timeFilter}</h1>{" "}
              <h1>
                {startDate +
                  " : " +
                  endDate +
                  " : " +
                  selectedMonth +
                  " : " +
                  selectedYear}
              </h1>
              <h1>{multipleFilters.eventStatus}</h1>{" "}
              <h1>{multipleFilters.reservationAbility}</h1>
              {durationFilter.min != "" ? (
                <h1>{"Min: " + durationFilter.min}</h1>
              ) : (
                <></>
              )}
              {durationFilter.max != "" ? (
                <h1>{"Max: " + durationFilter.max}</h1>
              ) : (
                <></>
              )}
              <h1>{selectedSorting}</h1>
              <h1>{searchFilters}</h1>
            </div>
          </>
        ) : (
          <div className="events-page">
            <Sidebar2
              timeFilter={timeFilter}
              selectedYear={selectedYear}
              startDate={startDate}
              endDate={endDate}
              onTimeFilterChange={handleTimeFilterChange}
              onDateRangeChange={handleDateRangeChange}
              setSelectedYear={setSelectedYear}
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
              selectedEventStatus={multipleFilters.eventStatus}
              onEventStatusChange={(value) =>
                handleMultipleFilterChange("eventStatus", value)
              }
              selectedReservationAbility={multipleFilters.reservationAbility}
              onReservationAbilityChange={(value) =>
                handleMultipleFilterChange("reservationAbility", value)
              }
              durationFilter={durationFilter}
              handleDurationChange={handleDurationChange}
              resetFilters={resetFilters}
              selectedSorting={selectedSorting}
              onSortingChange={handleSortingFilterChange}
              isMobile={isMobile}
              showModal={showModal}
              toggleModal={toggleModal}
            />

            <div>
              <h1>{timeFilter}</h1>{" "}
              <h1>
                {startDate +
                  " : " +
                  endDate +
                  " : " +
                  selectedMonth +
                  " : " +
                  selectedYear}
              </h1>
              <h1>{multipleFilters.eventStatus}</h1>{" "}
              <h1>{multipleFilters.reservationAbility}</h1>
              {durationFilter.min != "" ? (
                <h1>{"Min: " + durationFilter.min}</h1>
              ) : (
                <></>
              )}
              {durationFilter.max != "" ? (
                <h1>{"Max: " + durationFilter.max}</h1>
              ) : (
                <></>
              )}
              <h1>{selectedSorting}</h1>
              <h1>{searchFilters}</h1>
            </div>

            {/* <h1 className="text-center">Event Page</h1> 
          <h2 className="text-start">Events</h2> */}

            {/* <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 event-container">
            {events.map((event) => (
              <div className="col" key={event.id}>
                <EventCard {...event} />
              </div>
            ))}
          </div> */}
          </div>
        )}
      </div>
    </>
  );
};

export default EventPage;
