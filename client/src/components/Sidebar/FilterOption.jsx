import React from "react";
import "./Sidebar.css";
const FilterOption = () => {
  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const currentYear = new Date().getFullYear();

  const startYear = currentYear - 10;
  const endYear = currentYear + 10;

  const years = [];
  for (let year = startYear; year <= endYear; year++) {
    years.push(year);
  }

  return (
    <div className="sidebar-title">
      <h2>
        <i className="bi bi-filter"></i>
        {" Filter"}
      </h2>
      <div>
        <label className="sidebar-label-container sidebar-item">
          <input type="radio" name="test"></input>
          <input type="date"></input>
          <span className="checkmark">{"Filter By Day"}</span>
        </label>

        <label className="sidebar-label-container sidebar-item">
          <input type="radio" name="test"></input>
          <input type="week"></input>
          <span className="checkmark">{"Filter By Week"}</span>
        </label>

        <label className="sidebar-label-container sidebar-item">
          <input type="radio" name="test"></input>
          <input type="month"></input>
          <span className="checkmark">{"Filter By Month"}</span>
        </label>

        <label className="sidebar-label-container sidebar-item">
          <input type="radio" name="test"></input>
          <select id="year" name="year">
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <span className="checkmark">{"Filter By Year"}</span>
        </label>

        <label className="sidebar-label-container sidebar-item">
          <input type="radio" name="test"></input>
          <select id="weekday" name="weekday">
            {weekdays.map((weekday) => (
              <option key={weekday} value={weekday}>
                {weekday}
              </option>
            ))}
          </select>
          <span className="checkmark">{"Day of the Week"}</span>
        </label>
      </div>
    </div>
  );
};

export default FilterOption;
