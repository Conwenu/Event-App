import React from "react";
import "./Header2.css";
import search_icon from "../../assets/search.svg";
import SortingFilters from "../Sidebar/SortingFilters";
import FilterIcon from "../../assets/Filter_3_Lines.png";

const Header2 = ({
  selectedSorting,
  onSortingChange,
  searchFilters,
  onSearchChange,
  toggleModal,
  isMobile,
}) => {
  return (
    <div className="event-page-heading">
      {/* Title Section */}
      <h1 className="event-page-heading-title">Events</h1>

      {/* Conditionally render based on isMobile */}
      {isMobile ? (
        // Mobile Header
        <div className="event-page-heading-mobile">
          {/* Filter Icon */}
          <img
            src={FilterIcon}
            alt="Filter"
            className="mobile-filter-icon"
            onClick={() => {
              toggleModal();
              // Add functionality for the filter icon here
            }}
          />

          {/* Search Bar */}
          <div className="searchBox">
            <input
              type="text"
              placeholder="Search"
              value={searchFilters}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            <img
              src={search_icon}
              alt="Search Icon"
              className="navbar-search-icon"
            />
          </div>
        </div>
      ) : (
        // Desktop Header
        <div className="event-page-heading-filter-a">
          {/* Search Bar */}
          <div className="searchBox">
            <input
              type="text"
              placeholder="Search"
              value={searchFilters}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            <img
              src={search_icon}
              alt="Search Icon"
              className="navbar-search-icon"
            />
          </div>

          {/* Sorting Filters */}
          <div className="event-page-heading-sort">
            <span className="event-page-heading-span">Sort By</span>
            <SortingFilters
              selectedSorting={selectedSorting}
              onSortingChange={onSortingChange}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Header2;
