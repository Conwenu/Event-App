import React, { useState } from "react";
import "./Sidebar2.css";
import TimeBasedFilters from "./TimeBasedFilters.jsx";
const Sidebar2 = ({
  timeFilter,
  onTimeFilterChange,
  startDate,
  endDate,
  onDateRangeChange,
  selectedYear,
  setSelectedYear,
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
          <hr />
        </div>
        <div className="reset-filters">Reset Filters</div>
      </div>
    </>
  );
};

export default Sidebar2;
