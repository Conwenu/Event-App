import React, { useState } from "react";

const TimeBasedFilters = ({
  timeFilter,
  onTimeFilterChange,
  startDate,
  endDate,
  onDateRangeChange,
  selectedYear,
  setSelectedYear,
}) => {
  const handleFilterChange = (e) => {
    onTimeFilterChange(e.target.value);
  };

  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    onDateRangeChange(name, value);
  };

  // Set default year as the current year
  const currentYear = new Date().getFullYear();

  const handleYearChange = (e) => {
    const year = parseInt(e.target.value, 10);
    setSelectedYear(year);
  };

  // Generate a range of years from 10 years ago to 10 years in the future
  const startYear = currentYear - 10;
  const endYear = currentYear + 10;
  const years = [];
  for (let year = startYear; year <= endYear; year++) {
    years.push(year);
  }

  return (
    <div>
      <label>
        <input
          type="radio"
          name="timeFilter"
          value="today"
          checked={timeFilter === "today"}
          onChange={handleFilterChange}
        />
        {" Filter By Day"}
      </label>

      <label>
        <input
          type="radio"
          name="timeFilter"
          value="week"
          checked={timeFilter === "week"}
          onChange={handleFilterChange}
        />
        {" Filter By Week"}
      </label>

      <label>
        <input
          type="radio"
          name="timeFilter"
          value="month"
          checked={timeFilter === "month"}
          onChange={handleFilterChange}
        />
        {" Filter By Month"}
      </label>

      <label>
        <input
          type="radio"
          name="timeFilter"
          value="year"
          checked={timeFilter === "year"}
          onChange={() => onTimeFilterChange("year", selectedYear)}
        />
        {" Filter By Year"}
      </label>

      <label>
        <input
          type="radio"
          name="timeFilter"
          value="weekday"
          checked={timeFilter === "weekday"}
          onChange={handleFilterChange}
        />
        {" Day of the Week"}
      </label>

      <label>
        <input
          type="radio"
          name="timeFilter"
          value="customRange"
          checked={timeFilter === "customRange"}
          onChange={handleFilterChange}
        />
        {" Custom Date Range"}
      </label>

      {/* Render input fields based on selected time filter */}
      {timeFilter === "today" && (
        <input
          type="date"
          value={startDate}
          onChange={handleDateRangeChange}
          name="startDate"
        />
      )}
      {timeFilter === "week" && (
        <input
          type="week"
          value={startDate}
          onChange={handleDateRangeChange}
          name="startDate"
        />
      )}
      {timeFilter === "month" && (
        <input
          type="month"
          value={startDate}
          onChange={handleDateRangeChange}
          name="startDate"
        />
      )}
      {timeFilter === "year" && (
        <select
          id="year"
          name="year"
          onChange={handleYearChange}
          value={selectedYear}
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      )}
      {timeFilter === "weekday" && (
        <select
          value={startDate}
          onChange={handleDateRangeChange}
          name="startDate"
        >
          <option value="sunday">Sunday</option>
          <option value="monday">Monday</option>
          <option value="tuesday">Tuesday</option>
          <option value="wednesday">Wednesday</option>
          <option value="thursday">Thursday</option>
          <option value="friday">Friday</option>
          <option value="saturday">Saturday</option>
        </select>
      )}
      {timeFilter === "customRange" && (
        <div>
          <label>Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={handleDateRangeChange}
            name="startDate"
          />
          <label>End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={handleDateRangeChange}
            name="endDate"
          />
        </div>
      )}
    </div>
  );
};

export default TimeBasedFilters;
