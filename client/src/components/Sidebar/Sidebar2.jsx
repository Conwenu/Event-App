import React, { useState } from "react";
import "./Sidebar2.css";
import TimeBasedFilters from "./TimeBasedFilters.jsx";
import EventCharacteristicsFilters from "./EventCharacteristicsFilters.jsx";
import SortingFilters from "./SortingFilters.jsx";
const Sidebar2 = ({
  timeFilter,
  onTimeFilterChange,
  startDate,
  endDate,
  onDateRangeChange,
  selectedYear,
  setSelectedYear,
  selectedMonth,
  setSelectedMonth,
  selectedWeekday,
  setSelectedWeekday,
  selectedEventStatus,
  onEventStatusChange,
  selectedReservationAbility,
  onReservationAbilityChange,
  durationFilter,
  handleDurationChange,
  resetFilters,
  selectedSorting,
  onSortingChange,
  isMobile,
  showModal,
  toggleModal,
}) => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [availabilityOpen, setAvailabilityOpen] = useState(false);
  const [durationOpen, setDurationOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  return (
    <>
      {isMobile ? (
        <>
          {showModal && (
            <div className="sidebar-modal">
              <div className="modal-content">
                <div
                  className="sidebar-section"
                  onClick={() => setFilterOpen(!filterOpen)}
                >
                  <h5>Filters</h5>
                  <i
                    className={`bi ${
                      !filterOpen ? "bi-chevron-down" : "bi-chevron-up"
                    }`}
                  ></i>
                </div>
                {filterOpen ? (
                  <TimeBasedFilters
                    timeFilter={timeFilter}
                    selectedYear={selectedYear}
                    startDate={startDate}
                    endDate={endDate}
                    onTimeFilterChange={onTimeFilterChange}
                    onDateRangeChange={onDateRangeChange}
                    setSelectedYear={setSelectedYear}
                    selectedMonth={selectedMonth}
                    setSelectedMonth={setSelectedMonth}
                    selectedWeekday={selectedWeekday}
                    setSelectedWeekday={setSelectedWeekday}
                  />
                ) : (
                  <></>
                )}
                <hr />
                <div
                  className="sidebar-section"
                  onClick={() => setStatusOpen(!statusOpen)}
                >
                  <h5>Status</h5>
                  <i
                    className={`bi ${
                      !statusOpen ? "bi-chevron-down" : "bi-chevron-up"
                    }`}
                  ></i>
                </div>
                {statusOpen ? (
                  <EventCharacteristicsFilters
                    selectedEventStatus={selectedEventStatus}
                    onEventStatusChange={onEventStatusChange}
                    selectedReservationAbility={selectedReservationAbility}
                    onReservationAbilityChange={onReservationAbilityChange}
                  />
                ) : (
                  <></>
                )}
                <hr />
                {!isMobile ? (
                  <>
                    <div
                      className="sidebar-section"
                      onClick={() => setSortOpen(!sortOpen)}
                    >
                      <h5>Sort</h5>
                      <i
                        className={`bi ${
                          !sortOpen ? "bi-chevron-down" : "bi-chevron-up"
                        }`}
                      ></i>
                    </div>
                    {sortOpen ? (
                      <SortingFilters
                        selectedSorting={selectedSorting}
                        onSortingChange={onSortingChange}
                      />
                    ) : (
                      <></>
                    )}
                    <hr />
                  </>
                ) : (
                  <></>
                )}
                <div
                  className="sidebar-section"
                  onClick={() => setSortOpen(!sortOpen)}
                >
                  <h5>Sort</h5>
                  <i
                    className={`bi ${
                      !sortOpen ? "bi-chevron-down" : "bi-chevron-up"
                    }`}
                  ></i>
                </div>
                {sortOpen && (
                  <SortingFilters
                    selectedSorting={selectedSorting}
                    onSortingChange={onSortingChange}
                  />
                )}
                <hr />
                <div
                  className="sidebar-section"
                  onClick={() => setAvailabilityOpen(!availabilityOpen)}
                >
                  <h5>Availability</h5>
                  <i
                    className={`bi ${
                      !availabilityOpen ? "bi-chevron-down" : "bi-chevron-up"
                    }`}
                  ></i>
                </div>
                {availabilityOpen && (
                  <div>
                    <label>
                      <input
                        type="checkbox"
                        checked={selectedReservationAbility.includes(
                          "available"
                        )}
                        onChange={() => onReservationAbilityChange("available")}
                      />
                      {" Events with Available Spots"}
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={selectedReservationAbility.includes(
                          "fullyBooked"
                        )}
                        onChange={() =>
                          onReservationAbilityChange("fullyBooked")
                        }
                      />
                      {" Fully Booked Events"}
                    </label>
                  </div>
                )}
                <hr />
                <div
                  className="sidebar-section"
                  onClick={() => setDurationOpen(!durationOpen)}
                >
                  <h5>Duration</h5>
                  <i
                    className={`bi ${
                      !durationOpen ? "bi-chevron-down" : "bi-chevron-up"
                    }`}
                  ></i>
                </div>
                {durationOpen && (
                  <div>
                    <label>
                      {/* Min Duration (in minutes): */}
                      <input
                        type="number"
                        value={durationFilter.min}
                        min="0"
                        onChange={(e) =>
                          handleDurationChange("min", e.target.value)
                        }
                        placeholder="Min duration (minutes)"
                      />
                    </label>
                    <label>
                      {/* Max Duration (in minutes): */}
                      <input
                        type="number"
                        value={durationFilter.max}
                        min="0"
                        onChange={(e) =>
                          handleDurationChange("max", e.target.value)
                        }
                        placeholder="Max duration (minutes)"
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
        <div className="sidebar-container">
          <div>
            <div
              className="sidebar-section"
              onClick={() => setFilterOpen(!filterOpen)}
            >
              <h5>Filters</h5>
              <i
                className={`bi ${
                  !filterOpen ? "bi-chevron-down" : "bi-chevron-up"
                }`}
              ></i>
            </div>
            {filterOpen ? (
              <TimeBasedFilters
                timeFilter={timeFilter}
                selectedYear={selectedYear}
                startDate={startDate}
                endDate={endDate}
                onTimeFilterChange={onTimeFilterChange}
                onDateRangeChange={onDateRangeChange}
                setSelectedYear={setSelectedYear}
                selectedMonth={selectedMonth}
                setSelectedMonth={setSelectedMonth}
                selectedWeekday={selectedWeekday}
                setSelectedWeekday={setSelectedWeekday}
              />
            ) : (
              <></>
            )}
            <hr />
            <div
              className="sidebar-section"
              onClick={() => setStatusOpen(!statusOpen)}
            >
              <h5>Status</h5>
              <i
                className={`bi ${
                  !statusOpen ? "bi-chevron-down" : "bi-chevron-up"
                }`}
              ></i>
            </div>
            {statusOpen ? (
              <EventCharacteristicsFilters
                selectedEventStatus={selectedEventStatus}
                onEventStatusChange={onEventStatusChange}
                selectedReservationAbility={selectedReservationAbility}
                onReservationAbilityChange={onReservationAbilityChange}
              />
            ) : (
              <></>
            )}
            <hr />
            <div
              className="sidebar-section"
              onClick={() => setAvailabilityOpen(!availabilityOpen)}
            >
              <h5>Availability</h5>
              <i
                className={`bi ${
                  !availabilityOpen ? "bi-chevron-down" : "bi-chevron-up"
                }`}
              ></i>
            </div>
            {availabilityOpen && (
              <div>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedReservationAbility.includes("available")}
                    onChange={() => onReservationAbilityChange("available")}
                  />
                  {" Events with Available Spots"}
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedReservationAbility.includes("fullyBooked")}
                    onChange={() => onReservationAbilityChange("fullyBooked")}
                  />
                  {" Fully Booked Events"}
                </label>
              </div>
            )}
            <hr />
            <div
              className="sidebar-section"
              onClick={() => setDurationOpen(!durationOpen)}
            >
              <h5>Duration</h5>
              <i
                className={`bi ${
                  !durationOpen ? "bi-chevron-down" : "bi-chevron-up"
                }`}
              ></i>
            </div>
            {durationOpen && (
              <div>
                <label>
                  {/* Min Duration (in minutes): */}
                  <input
                    type="number"
                    value={durationFilter.min}
                    min="0"
                    onChange={(e) =>
                      handleDurationChange("min", e.target.value)
                    }
                    placeholder="Min duration (minutes)"
                  />
                </label>
                <label>
                  {/* Max Duration (in minutes): */}
                  <input
                    type="number"
                    value={durationFilter.max}
                    min="0"
                    onChange={(e) =>
                      handleDurationChange("max", e.target.value)
                    }
                    placeholder="Max duration (minutes)"
                  />
                </label>
              </div>
            )}
            <hr />
          </div>
          {isMobile && (
            <div className="reset-filters" onClick={resetFilters}>
              Reset Filters
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Sidebar2;
