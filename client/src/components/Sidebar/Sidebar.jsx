import React, { useState, useEffect } from "react";
import "./Sidebar.css";
import TimeBasedFilters from "./TimeBasedFilters.jsx";
import SortingFilters from "./SortingFilters.jsx";
import EventCharacteristicsFilters from "./EventCharacteristicsFilters.jsx";
import FilterIcon from "../../assets/Filter_3_Lines.png";

const Sidebar = () => {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [availabilityOpen, setAvailabilityOpen] = useState(false);
  const [durationOpen, setDurationOpen] = useState(false);

  const [timeFilter, setTimeFilter] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedSorting, setSelectedSorting] = useState("");

  const [multipleFilters, setMultipleFilters] = useState({
    eventStatus: [],
    reservationAbility: [],
  });

  const [durationFilter, setDurationFilter] = useState({
    min: "",
    max: "",
  });

  const [searchFilters, setSearchFilters] = useState({
    eventName: "",
    titleOrDescription: "",
    creator: "",
  });

  const maxWidth = 990;

  const [showModal, setShowModal] = useState(false);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= maxWidth);

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
    setDurationFilter((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSearchChange = (field, value) => {
    setSearchFilters((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const resetFilters = () => {
    setTimeFilter("");
    setStartDate("");
    setEndDate("");
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
    setSearchFilters({
      eventName: "",
      titleOrDescription: "",
      creator: "",
    });
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <div className="sidebar-container">
      {isMobile ? (
        <>
          {showModal && (
            <div className="sidebar-modal">
              <div className="modal-content">
                <div className="sidebar-section">
                  <h5>Filters</h5>
                  <i
                    className={`bi ${
                      filtersOpen ? "bi-chevron-up" : "bi-chevron-down"
                    }`}
                    onClick={() => setFiltersOpen(!filtersOpen)}
                  ></i>
                </div>
                {filtersOpen && (
                  <TimeBasedFilters
                    timeFilter={timeFilter}
                    startDate={startDate}
                    endDate={endDate}
                    selectedYear={selectedYear}
                    onTimeFilterChange={handleTimeFilterChange}
                    onDateRangeChange={handleDateRangeChange}
                    setSelectedYear={setSelectedYear}
                  />
                )}
                <hr />
                <div className="sidebar-section">
                  <h5>Status</h5>
                  <i
                    className={`bi ${
                      statusOpen ? "bi-chevron-up" : "bi-chevron-down"
                    }`}
                    onClick={() => setStatusOpen(!statusOpen)}
                  ></i>
                </div>
                {statusOpen && (
                  <EventCharacteristicsFilters
                    selectedEventStatus={multipleFilters.eventStatus}
                    onEventStatusChange={(value) =>
                      handleMultipleFilterChange("eventStatus", value)
                    }
                    selectedReservationAbility={
                      multipleFilters.reservationAbility
                    }
                    onReservationAbilityChange={(value) =>
                      handleMultipleFilterChange("reservationAbility", value)
                    }
                  />
                )}
                <hr />
                <div className="sidebar-section">
                  <h5>Sort By</h5>
                  <i
                    className={`bi ${
                      sortOpen ? "bi-chevron-up" : "bi-chevron-down"
                    }`}
                    onClick={() => setSortOpen(!sortOpen)}
                  ></i>
                </div>
                {sortOpen && (
                  <SortingFilters
                    selectedSorting={selectedSorting}
                    onSortingChange={handleSortingFilterChange}
                  />
                )}
                <hr />
                <div className="sidebar-section">
                  <h5>Search</h5>
                  <i
                    className={`bi ${
                      searchOpen ? "bi-chevron-up" : "bi-chevron-down"
                    }`}
                    onClick={() => setSearchOpen(!searchOpen)}
                  ></i>
                </div>
                {searchOpen && (
                  <div>
                    <label>
                      Filter by Title / Description:
                      <input
                        type="text"
                        value={searchFilters.titleOrDescription}
                        onChange={(e) =>
                          handleSearchChange(
                            "titleOrDescription",
                            e.target.value
                          )
                        }
                        placeholder="Search by title or description"
                      />
                    </label>
                  </div>
                )}
                <hr />
                <div className="sidebar-section">
                  <h5>Availibility</h5>
                  <i
                    className={`bi ${
                      availabilityOpen ? "bi-chevron-up" : "bi-chevron-down"
                    }`}
                    onClick={() => setAvailabilityOpen(!availabilityOpen)}
                  ></i>
                </div>
                {availabilityOpen && (
                  <div>
                    <label>
                      <input
                        type="checkbox"
                        checked={multipleFilters.reservationAbility.includes(
                          "available"
                        )}
                        onChange={() =>
                          handleMultipleFilterChange(
                            "reservationAbility",
                            "available"
                          )
                        }
                      />
                      {" Events with Available Spots"}
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={multipleFilters.reservationAbility.includes(
                          "fullyBooked"
                        )}
                        onChange={() =>
                          handleMultipleFilterChange(
                            "reservationAbility",
                            "fullyBooked"
                          )
                        }
                      />
                      {" Fully Booked Events"}
                    </label>
                  </div>
                )}
                <hr />
                <div className="sidebar-section">
                  <h5>Duration</h5>
                  <i
                    className={`bi ${
                      durationOpen ? "bi-chevron-up" : "bi-chevron-down"
                    }`}
                    onClick={() => setDurationOpen(!durationOpen)}
                  ></i>
                </div>
                {durationOpen && (
                  <div>
                    <label>
                      Min Duration (in minutes):
                      <input
                        type="number"
                        value={durationFilter.min}
                        min="0"
                        onChange={(e) =>
                          handleDurationChange("min", e.target.value)
                        }
                        placeholder="Min duration"
                      />
                    </label>
                    <label>
                      Max Duration (in minutes):
                      <input
                        type="number"
                        value={durationFilter.max}
                        min="0"
                        onChange={(e) =>
                          handleDurationChange("max", e.target.value)
                        }
                        placeholder="Max duration"
                      />
                    </label>
                  </div>
                )}
                <div className="modal-buttons">
                  <button className="reset-button" onClick={resetFilters}>
                    Reset Filters
                  </button>
                  <button className="view-events-button" onClick={toggleModal}>
                    View Events
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="sidebar">
          <div className="sidebar-section">
            <h5>Filters</h5>
            <i
              className={`bi ${
                !filtersOpen ? "bi-chevron-down" : "bi-chevron-up"
              }`}
              onClick={() => setFiltersOpen(!filtersOpen)}
            ></i>
          </div>
          {filtersOpen ? (
            <TimeBasedFilters
              timeFilter={timeFilter}
              selectedYear={selectedYear}
              startDate={startDate}
              endDate={endDate}
              onTimeFilterChange={handleTimeFilterChange}
              onDateRangeChange={handleDateRangeChange}
              setSelectedYear={setSelectedYear}
            />
          ) : (
            <></>
          )}

          <hr />
          <div className="sidebar-section">
            <h5>Status</h5>
            <i
              className={`bi ${
                !statusOpen ? "bi-chevron-down" : "bi-chevron-up"
              }`}
              onClick={() => setStatusOpen(!statusOpen)}
            ></i>
          </div>
          {statusOpen ? (
            <EventCharacteristicsFilters
              selectedEventStatus={multipleFilters.eventStatus}
              onEventStatusChange={(value) =>
                handleMultipleFilterChange("eventStatus", value)
              }
              selectedReservationAbility={multipleFilters.reservationAbility}
              onReservationAbilityChange={(value) =>
                handleMultipleFilterChange("reservationAbility", value)
              }
            />
          ) : (
            <></>
          )}

          <hr />
          <div className="sidebar-section">
            <h5>Sort By</h5>
            <i
              className={`bi ${
                !sortOpen ? "bi-chevron-down" : "bi-chevron-up"
              }`}
              onClick={() => setSortOpen(!sortOpen)}
            ></i>
          </div>

          {sortOpen ? (
            <SortingFilters
              selectedSorting={selectedSorting}
              onSortingChange={handleSortingFilterChange}
            />
          ) : (
            <></>
          )}
          <hr />
          <div className="sidebar-section">
            <h5>Search</h5>
            <i
              className={`bi ${
                !searchOpen ? "bi-chevron-down" : "bi-chevron-up"
              }`}
              onClick={() => setSearchOpen(!searchOpen)}
            ></i>
          </div>

          {searchOpen ? (
            <div>
              <label>
                <input
                  type="text"
                  value={searchFilters.titleOrDescription}
                  onChange={(e) =>
                    handleSearchChange("titleOrDescription", e.target.value)
                  }
                  placeholder="Enter title or description"
                />
              </label>
            </div>
          ) : (
            <></>
          )}
          <hr />
          <div className="sidebar-section">
            <h5>Availability</h5>
            <i
              className={`bi ${
                !availabilityOpen ? "bi-chevron-down" : "bi-chevron-up"
              }`}
              onClick={() => setAvailabilityOpen(!availabilityOpen)}
            ></i>
          </div>

          {availabilityOpen ? (
            <div>
              <label>
                <input
                  type="checkbox"
                  checked={multipleFilters.reservationAbility.includes(
                    "available"
                  )}
                  onChange={() =>
                    handleMultipleFilterChange(
                      "reservationAbility",
                      "available"
                    )
                  }
                />
                {" Events with Available Spots"}
              </label>

              <label>
                <input
                  type="checkbox"
                  checked={multipleFilters.reservationAbility.includes(
                    "fullyBooked"
                  )}
                  onChange={() =>
                    handleMultipleFilterChange(
                      "reservationAbility",
                      "fullyBooked"
                    )
                  }
                />
                {" Fully Booked Events"}
              </label>
            </div>
          ) : (
            <></>
          )}
          <hr />
          <div className="sidebar-section">
            <h5>Duration</h5>
            <i
              className={`bi ${
                !durationOpen ? "bi-chevron-down" : "bi-chevron-up"
              }`}
              onClick={() => setDurationOpen(!durationOpen)}
            ></i>
          </div>

          {durationOpen ? (
            <div>
              <label>
                Min Duration (in minutes):
                <input
                  type="number"
                  value={durationFilter.min}
                  min="0"
                  onChange={(e) => handleDurationChange("min", e.target.value)}
                  placeholder="Min duration"
                />
              </label>
              <label>
                Max Duration (in minutes):
                <input
                  type="number"
                  value={durationFilter.max}
                  min="0"
                  onChange={(e) => handleDurationChange("max", e.target.value)}
                  placeholder="Max duration"
                />
              </label>
            </div>
          ) : (
            <></>
          )}

          <button className="reset-button" onClick={resetFilters}>
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
