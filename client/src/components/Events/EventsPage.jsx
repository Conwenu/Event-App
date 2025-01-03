import React, { useEffect, useState } from "react";
import axios from "axios";
import "./EventsPage.css";
import EventCard from "./EventCard.jsx";
import Sidebar from "../Sidebar/Sidebar.jsx";
import Header2 from "./Header2.jsx";
import Sidebar2 from "../Sidebar/Sidebar2.jsx";
import { useSearchParams } from "react-router-dom";
const API_URL = process.env.REACT_APP_API_URL;

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  const updateSearchParams = (filters) => {
    const currentParams = Object.fromEntries(searchParams.entries());
    const updatedParams = { ...currentParams, ...filters };

    Object.keys(updatedParams).forEach((key) => {
      if (
        updatedParams[key] === undefined ||
        updatedParams[key] === null ||
        updatedParams[key] === "" ||
        (Array.isArray(updatedParams[key]) && updatedParams[key].length === 0)
      ) {
        delete updatedParams[key];
      }
    });

    setSearchParams(updatedParams);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const apiParams = mapQueryToApiParams(
          Object.fromEntries(searchParams.entries())
        );
        const response = await axios.get(`${API_URL}/events2`, {
          params: apiParams,
        });
        setEvents(response.data.events);
        setIsError(false);
      } catch (err) {
        setIsError(true);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [searchParams]);

  const mapQueryToApiParams = (params) => {
    const apiParams = {};

    if (params.timeFilter) {
      apiParams.timeFilter = params.timeFilter;
    }
    if (params.selectedYear) {
      apiParams.selectedYear = params.selectedYear;
    }
    if (params.selectedMonth) {
      apiParams.selectedMonth = params.selectedMonth;
    }
    if (params.selectedWeekday) {
      apiParams.selectedWeekday = params.selectedWeekday;
    }
    if (params.startDate) {
      apiParams.startDate = params.startDate;
    }
    if (params.endDate) {
      apiParams.endDate = params.endDate;
    }
    if (params.sort) {
      apiParams.sort = params.sort;
    }
    if (params.minDuration) {
      apiParams.minDuration = params.minDuration;
    }
    if (params.maxDuration) {
      apiParams.maxDuration = params.maxDuration;
    }
    if (params.eventStatus) {
      apiParams.eventStatus = params.eventStatus;
    }
    if (params.reservationAbility) {
      apiParams.reservationAbility = params.reservationAbility;
    }
    if (params.searchQuery) {
      apiParams.searchQuery = params.searchQuery;
    }
    return apiParams;
  };

  const [timeFilter, setTimeFilter] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedSorting, setSelectedSorting] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(() => {
    return String(new Date().getMonth() + 1).padStart(2, "0");
  });
  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const [selectedWeekday, setSelectedWeekday] = useState(() => {
    const currentDay = new Date().getDay();
    return weekdays[currentDay];
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

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchFilters(value);
    if (e.key === "Enter") {
      if (value.trim() === "") {
        updateSearchParams({ searchQuery: null }); // remove search query if empty
      } else {
        updateSearchParams({ searchQuery: value });
      }
    }
  };

  const handleSearchButtonClick = () => {
    updateSearchParams({ searchQuery: searchFilters });
  };

  const getCurrentDateFormatted = () => {
    var currentDate = new Date();
    var year = currentDate.getFullYear();
    var month = currentDate.getMonth() + 1;
    var day = currentDate.getDate();

    month = month < 10 ? "0" + month : month;
    day = day < 10 ? "0" + day : day;

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

  const handleTimeFilterChange = (value, data) => {
    const year = data?.year;
    const month = data?.month;
    const weekday = data?.weekday;
    const currentParams = Object.fromEntries(searchParams.entries());
    setTimeFilter(value);

    let updatedParams = { timeFilter: value };

    // Keep the other filters intact
    if (currentParams.eventStatus)
      updatedParams.eventStatus = currentParams.eventStatus;
    if (currentParams.reservationAbility)
      updatedParams.reservationAbility = currentParams.reservationAbility;
    if (currentParams.minDuration)
      updatedParams.minDuration = currentParams.minDuration;
    if (currentParams.maxDuration)
      updatedParams.maxDuration = currentParams.maxDuration;
    if (currentParams.searchQuery)
      updatedParams.searchQuery = currentParams.searchQuery;

    if (value === "year" && year) {
      setSelectedYear(year);
      updatedParams = { ...updatedParams, selectedYear: year };
      setStartDate("");
    } else if (value === "month" && month) {
      setSelectedMonth(month);
      updatedParams = {
        ...updatedParams,
        selectedYear: data.year,
        selectedMonth: month,
      };
      setStartDate("");
    } else if (value === "weekday" && weekday) {
      setSelectedWeekday(weekday);
      updatedParams = { ...updatedParams, selectedWeekday: weekday };
      setStartDate("");
    }

    if (currentParams.startDate) {
      updatedParams.startDate = currentParams.startDate;
    }

    if (value !== "year" && value !== "month") {
      delete updatedParams.selectedYear;
    }
    if (value !== "month") {
      delete updatedParams.selectedMonth;
    }
    if (value !== "weekday") {
      delete updatedParams.selectedWeekday;
    }
    setSearchParams(updatedParams);
  };

  const handleSortingFilterChange = (value) => {
    setSelectedSorting(value);
    updateSearchParams({ sort: value });
  };

  const handleDateRangeChange = (name, value) => {
    if (name === "startDate") {
      setStartDate(value);
      updateSearchParams({ [name]: value });
    } else if (name === "endDate") {
      setEndDate(value);
      updateSearchParams({ [name]: value });
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

      updateSearchParams({
        ...prevState,
        [filterType]: newFilterValues.join(","),
      });

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
    updateSearchParams({ [name + "Duration"]: value });
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
    setDurationFilter({ min: "", max: "" });
    setSearchFilters("");

    updateSearchParams({
      timeFilter: null,
      startDate: null,
      endDate: null,
      sorting: null,
      selectedYear: null,
      selectedMonth: null,
      selectedWeekday: null,
      eventStatus: null,
      reservationAbility: null,
      minDuration: null,
      maxDuration: null,
      searchQuery: null,
    });
  };

  // const defaultImage =
  //   "https://wallpapercat.com/w/full/6/2/1/116007-3840x2160-desktop-4k-bleach-wallpaper-photo.jpg";

  return (
    <>
      <div className="full-events-page">
        <Header2
          selectedSorting={selectedSorting}
          onSortingChange={handleSortingFilterChange}
          searchFilters={searchFilters}
          onSearchChange={setSearchFilters}
          handleSearchChange={handleSearchChange}
          handleSearchButtonClick={handleSearchButtonClick}
          toggleModal={toggleModal}
          isMobile={isMobile}
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
              selectedWeekday={selectedWeekday}
              setSelectedWeekday={setSelectedWeekday}
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
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 event-container">
              {isLoading ? (
                <div
                  className="d-flex justify-content-center align-items-center w-100"
                  style={{ height: "300px" }}
                >
                  <div className="loading-container">
                    <div className="spinner"></div>
                    <h4>Loading events...</h4>
                  </div>
                </div>
              ) : isError ? (
                <div
                  className="d-flex justify-content-center align-items-center w-100"
                  style={{ height: "300px" }}
                >
                  <h4 className="">Error loading events: {error}</h4>
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
                  <h4 className="text-center mb-0">No events found</h4>
                </div>
              )}
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
              selectedWeekday={selectedWeekday}
              setSelectedWeekday={setSelectedWeekday}
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
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 event-container">
              {isLoading ? (
                <div
                  className="d-flex justify-content-center align-items-center w-100"
                  style={{ height: "300px" }}
                >
                  <div className="loading-container">
                    <div className="spinner"></div>
                    <h4>Loading events...</h4>
                  </div>
                </div>
              ) : isError ? (
                <div
                  className="d-flex justify-content-center align-items-center w-100"
                  style={{ height: "300px" }}
                >
                  <h4 className="">Error loading events: {error}</h4>
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
                  <h4 className="text-center mb-0">No events found</h4>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default EventsPage;
