import React from "react";

const TimeBasedFilters = ({
  timeFilter,
  onTimeFilterChange,
  startDate,
  endDate,
  onDateRangeChange,
}) => {
  const handleChange = (e) => {
    onTimeFilterChange(e.target.value);
  };

  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    onDateRangeChange(name, value);
  };

  return (
    <div>
      <label>
        <input
          type="radio"
          name="timeFilter"
          value="today"
          checked={timeFilter === "today"}
          onChange={handleChange}
        />
        Filter By Today
      </label>

      <label>
        <input
          type="radio"
          name="timeFilter"
          value="week"
          checked={timeFilter === "week"}
          onChange={handleChange}
        />
        Filter By Week
      </label>

      <label>
        <input
          type="radio"
          name="timeFilter"
          value="month"
          checked={timeFilter === "month"}
          onChange={handleChange}
        />
        Filter By Month
      </label>

      <label>
        <input
          type="radio"
          name="timeFilter"
          value="year"
          checked={timeFilter === "year"}
          onChange={handleChange}
        />
        Filter By Year
      </label>

      <label>
        <input
          type="radio"
          name="timeFilter"
          value="weekday"
          checked={timeFilter === "weekday"}
          onChange={handleChange}
        />
        Day of the Week
      </label>

      <label>
        <input
          type="radio"
          name="timeFilter"
          value="customRange"
          checked={timeFilter === "customRange"}
          onChange={handleChange}
        />
        Custom Date Range
      </label>

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
        <input
          type="number"
          value={startDate}
          onChange={handleDateRangeChange}
          name="startDate"
        />
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
