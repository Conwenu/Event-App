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
  handleSearchChange,
  handleSearchButtonClick,
  toggleModal,
  isMobile,
  toggleDesktopModal,
  setToggleDesktopModal,
}) => {
  return (
    <div className="event-page-heading">
      {isMobile ? (
        // Mobile Header
        <div className="event-page-heading-mobile">
          <img
            src={FilterIcon}
            alt="Filter"
            className="mobile-filter-icon"
            onClick={() => {
              toggleModal();
              // Add functionality for the filter icon here
            }}
          />

          <div className="searchBox">
            <input
              type="text"
              placeholder="Search"
              value={searchFilters}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={handleSearchChange}
            />
            <img
              src={search_icon}
              alt="Search Icon"
              className="navbar-search-icon"
              onClick={handleSearchButtonClick}
            />
          </div>
        </div>
      ) : (
        // Desktop Header
        <div>
          <h1 className="event-page-heading-title">Events</h1>
          <div className="event-page-heading-filter-a">
            <div className="event-page-header-filter-section-1">
              <img
                src={FilterIcon}
                alt="Filter"
                className="mobile-filter-icon"
                onClick={() => {
                  setToggleDesktopModal(true);
                  // Add functionality for the filter icon here
                }}
              />
            </div>
            <div className="event-page-header-filter-section-2">
              <div className="searchBox">
                <input
                  type="text"
                  placeholder="Search"
                  value={searchFilters}
                  onChange={(e) => onSearchChange(e.target.value)}
                  onKeyDown={handleSearchChange}
                />
                <img
                  src={search_icon}
                  alt="Search Icon"
                  className="navbar-search-icon"
                  onClick={handleSearchButtonClick}
                />
              </div>
              <div className="event-page-heading-sort">
                <span className="event-page-heading-span">Sort By</span>
                <SortingFilters
                  selectedSorting={selectedSorting}
                  onSortingChange={onSortingChange}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header2;
