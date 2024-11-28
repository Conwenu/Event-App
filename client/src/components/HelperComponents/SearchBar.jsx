import React from "react";
import "./SearchBar.css";

const SearchBar = () => {
  return (
    <div style={{ width: "50%", marginRight: "1rem" }}>
      <div className="search-container">
        <i className="bi bi-search search-icon"></i>
        <input
          type="text"
          className="form-control search-input"
          placeholder="Search..."
        />
      </div>
    </div>
  );
};

export default SearchBar;
