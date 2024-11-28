import React from "react";
import "./Header2.css";
import search_icon from "../../assets/search.svg";
import SortingFilters from "../Sidebar/SortingFilters";

const Header2 = ({
  selectedSorting,
  onSortingChange,
  searchFilters,
  onSearchChange,
}) => {
  return (
    <>
      <div className="event-page-heading">
        <div>
          <h1 className="event-page-heading-title">Events</h1>
        </div>
        <div className="event-page-heading-filter-a">
          <div className="searchBox">
            <input
              type="text"
              placeholder="Search"
              value={searchFilters}
              onChange={(e) => onSearchChange(e.target.value)}
            ></input>
            <img src={search_icon} alt="" className="navbar-search-icon" />
          </div>

          <div className="event-page-heading-sort">
            <span className="event-page-heading-span"> Sort By</span>
            <SortingFilters
              selectedSorting={selectedSorting}
              onSortingChange={onSortingChange}
            />
            {/* <select className="form-select" aria-label="Sorting options">
              <option value="newestFirst">Newest First</option>
              <option value="oldestFirst">Oldest First</option>
              <option value="startTimeAsc">Start Time Ascending</option>
              <option value="startTimeDesc">Start Time Descending</option>
            </select> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header2;
