import React, { useState, useEffect } from "react";
import "./Sidebar.css";
import TimeBasedFilters from "./TimeBasedFilters.jsx";
import SortingFilters from "./SortingFilters.jsx";
import EventCharacteristicsFilters from "./EventCharacteristicsFilters.jsx";
import FilterIcon from "../../assets/Filter_3_Lines.png";

const Sidebar = () => {
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

  const [showModal, setShowModal] = useState(false);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
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
          <button className="filter-icon" onClick={toggleModal}>
            <img src={FilterIcon} alt="Filters" />
          </button>

          {showModal && (
            <div className="sidebar-modal">
              <div className="modal-content">
                <h2>Filters</h2>

                <TimeBasedFilters
                  timeFilter={timeFilter}
                  startDate={startDate}
                  endDate={endDate}
                  selectedYear={selectedYear}
                  onTimeFilterChange={handleTimeFilterChange}
                  onDateRangeChange={handleDateRangeChange}
                  setSelectedYear={setSelectedYear}
                />

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

                <SortingFilters
                  selectedSorting={selectedSorting}
                  onSortingChange={handleSortingFilterChange}
                />

                <div>
                  <label>
                    Filter by Title / Description:
                    <input
                      type="text"
                      value={searchFilters.titleOrDescription}
                      onChange={(e) =>
                        handleSearchChange("titleOrDescription", e.target.value)
                      }
                      placeholder="Search by title or description"
                    />
                  </label>
                </div>

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
                    Events with Available Spots
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
                    Fully Booked Events
                  </label>
                </div>

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
          <h2>Filters</h2>

          <TimeBasedFilters
            timeFilter={timeFilter}
            selectedYear={selectedYear}
            startDate={startDate}
            endDate={endDate}
            onTimeFilterChange={handleTimeFilterChange}
            onDateRangeChange={handleDateRangeChange}
            setSelectedYear={setSelectedYear}
          />

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

          <SortingFilters
            selectedSorting={selectedSorting}
            onSortingChange={handleSortingFilterChange}
          />

          <div>
            <label>
              {"Filter by Title / Description:"}
              <input
                type="text"
                value={searchFilters.titleOrDescription}
                onChange={(e) =>
                  handleSearchChange("titleOrDescription", e.target.value)
                }
                placeholder="Search by title or description"
              />
            </label>
          </div>

          <div>
            <label>
              <input
                type="checkbox"
                checked={multipleFilters.reservationAbility.includes(
                  "available"
                )}
                onChange={() =>
                  handleMultipleFilterChange("reservationAbility", "available")
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

          <button onClick={resetFilters}>Reset Filters</button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
