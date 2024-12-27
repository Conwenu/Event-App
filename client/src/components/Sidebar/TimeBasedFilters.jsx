import React, { useEffect } from "react";
import "./Sidebar.css";

const TimeBasedFilters = ({
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
}) => {
  const handleFilterChange = (e) => {
    const filterType = e.target.value;
    onTimeFilterChange(filterType);

    if (filterType === "year") {
      onTimeFilterChange(filterType, { year: selectedYear });
    } else if (filterType === "month") {
      onTimeFilterChange(filterType, {
        year: selectedYear,
        month: selectedMonth,
      });
    } else if (filterType === "weekday") {
      onTimeFilterChange(filterType, {
        weekday: selectedWeekday,
      });
    } else {
      setSelectedYear(null);
    }
  };

  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    onDateRangeChange(name, value);
  };

  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value, 10));
    if (timeFilter === "year") {
      onTimeFilterChange("year", {
        year: parseInt(e.target.value, 10),
      });
    }

    if (timeFilter === "month") {
      onTimeFilterChange("month", {
        year: parseInt(e.target.value, 10),
        month: selectedMonth,
      });
    }

    if (timeFilter === "weekday") {
      onTimeFilterChange("weekday", {
        weekday: e.target.value,
      });
    }
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
    setSelectedYear(selectedYear);
    onTimeFilterChange("month", {
      year: selectedYear,
      month: e.target.value,
    });
  };

  const handleWeekdayChange = (e) => {
    setSelectedWeekday(e.target.value);
    onTimeFilterChange("weekday", {
      weekday: e.target.value,
    });
  };

  // Set default year and month
  const currentYear = new Date().getFullYear();
  const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  useEffect(() => {
    const currentMonth = String(new Date().getMonth() + 1).padStart(2, "0"); // "01" to "12"
    const currentYear = new Date().getFullYear();

    if (!selectedMonth) {
      setSelectedMonth(currentMonth);
    }
    if (!selectedYear) {
      setSelectedYear(currentYear);
    }
  }, [setSelectedMonth, setSelectedYear, selectedMonth, selectedYear]);

  console.log("Selected weekday:", selectedWeekday);

  // Generate a range of years
  const startYear = currentYear - 10;
  const endYear = currentYear + 10;
  const years = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => startYear + i
  );

  return (
    <div className="TimeBasedFilters">
      {/* Radio buttons */}
      <div className="form-check">
        <input
          type="radio"
          className="form-check-input"
          name="timeFilter"
          value="day"
          checked={timeFilter === "day"}
          onChange={handleFilterChange}
          id="filterDay"
        />
        <label className="form-check-label" htmlFor="filterDay">
          Filter By Day
        </label>
      </div>

      <div className="form-check">
        <input
          type="radio"
          className="form-check-input"
          name="timeFilter"
          value="week"
          checked={timeFilter === "week"}
          onChange={handleFilterChange}
          id="filterWeek"
        />
        <label className="form-check-label" htmlFor="filterWeek">
          Filter By Week
        </label>
      </div>

      <div className="form-check">
        <input
          type="radio"
          className="form-check-input"
          name="timeFilter"
          value="month"
          checked={timeFilter === "month"}
          onChange={handleFilterChange}
          id="filterMonth"
        />
        <label className="form-check-label" htmlFor="filterMonth">
          Filter By Month
        </label>
      </div>

      <div className="form-check">
        <input
          type="radio"
          className="form-check-input"
          name="timeFilter"
          value="year"
          checked={timeFilter === "year"}
          onChange={handleFilterChange}
          id="filterYear"
        />
        <label className="form-check-label" htmlFor="filterYear">
          Filter By Year
        </label>
      </div>

      <div className="form-check">
        <input
          type="radio"
          className="form-check-input"
          name="timeFilter"
          value="weekday"
          checked={timeFilter === "weekday"}
          onChange={handleFilterChange}
          id="filterWeekday"
        />
        <label className="form-check-label" htmlFor="filterWeekday">
          Day of the Week
        </label>
      </div>

      <div className="form-check">
        <input
          type="radio"
          className="form-check-input"
          name="timeFilter"
          value="dateRange"
          checked={timeFilter === "dateRange"}
          onChange={handleFilterChange}
          id="dateRange"
        />
        <label className="form-check-label" htmlFor="dateRange">
          Date Range
        </label>
      </div>

      {/* Render input fields based on selected time filter */}
      <div className="TimeBasedFilters">
        {timeFilter === "day" && (
          <input
            type="date"
            className="form-control mt-2"
            value={startDate}
            onChange={handleDateRangeChange}
            name="startDate"
          />
        )}
        {timeFilter === "week" && (
          <input
            type="date"
            className="form-control mt-2"
            value={startDate}
            onChange={handleDateRangeChange}
            name="startDate"
          />
        )}
        {/* Month and Year dropdowns */}
        {timeFilter === "month" && (
          <div className=" mt-2 align-items-center">
            <label htmlFor="month" className="me-2">
              Select Month:
            </label>
            <select
              id="month"
              className="form-control me-2"
              name="month"
              onChange={handleMonthChange}
              value={selectedMonth}
            >
              {/* <option value="">--Select Month--</option> */}
              {months.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
            <label htmlFor="year" className="me-2">
              Select Year:
            </label>
            <select
              id="year"
              className="form-control"
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
          </div>
        )}
      </div>

      {/* Render other time filters (e.g., year, dateRange, etc.) */}
      {timeFilter === "year" && (
        <select
          id="year"
          className="form-control mt-2"
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
          className="form-control mt-2"
          value={selectedWeekday.toLowerCase()}
          onChange={handleWeekdayChange}
          name="weekday"
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

      {timeFilter === "dateRange" && (
        <div className="">
          <label>Start Date:</label>
          <input
            type="date"
            className="form-control mt-1"
            value={startDate}
            onChange={handleDateRangeChange}
            name="startDate"
          />
          <label>End Date:</label>
          <input
            type="date"
            className="form-control mt-1"
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
