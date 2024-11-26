import React from "react";
import "./Header2.css";
// import SearchBar from "../HelperComponents/SearchBar";
import search_icon from "../../assets/search.svg";
// import Sort2 from "../Sidebar/Sort2";

const Header2 = () => {
  return (
    <>
      <div className="event-page-heading">
        <div>
          <h1 className="event-page-heading-title">Events</h1>
        </div>
        <div className="event-page-heading-filter-a">
          {/* <SearchBar /> */}
          <div className="searchBox">
            <input type="text" placeholder="Search"></input>
            <img src={search_icon} alt="" className="navbar-search-icon" />
          </div>

          <div className="event-page-heading-sort">
            <span className="event-page-heading-span"> Sort By</span>
            {/* <Sort2 /> */}

            <select className="form-select" aria-label="Sorting options">
              <option value="newestFirst">Newest First</option>
              <option value="oldestFirst">Oldest First</option>
              <option value="startTimeAsc">Start Time Ascending</option>
              <option value="startTimeDesc">Start Time Descending</option>
            </select>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header2;
