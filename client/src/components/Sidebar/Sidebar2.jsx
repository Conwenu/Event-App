import React, { useState } from "react";
import "./Sidebar2.css";
import TimeBasedFilters from "./TimeBasedFilters.jsx";
import EventCharacteristicsFilters from "./EventCharacteristicsFilters.jsx";
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
  selectedEventStatus,
  onEventStatusChange,
  selectedReservationAbility,
  onReservationAbilityChange,
  durationFilter,
  handleDurationChange,
  resetFilters,
}) => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [availabilityOpen, setAvailabilityOpen] = useState(false);
  const [durationOpen, setDurationOpen] = useState(false);
  return (
    <>
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
                  onChange={(e) => handleDurationChange("min", e.target.value)}
                  placeholder="Min duration (minutes)"
                />
              </label>
              <label>
                {/* Max Duration (in minutes): */}
                <input
                  type="number"
                  value={durationFilter.max}
                  min="0"
                  onChange={(e) => handleDurationChange("max", e.target.value)}
                  placeholder="Max duration (minutes)"
                />
              </label>
            </div>
          )}
          <hr />
        </div>
        <div className="reset-filters" onClick={resetFilters}>
          Reset Filters
        </div>
      </div>
    </>
  );
};

export default Sidebar2;
