import React from "react";
import "./Header2.css";
import SearchBar from "../HelperComponents/SearchBar";
const Header2 = () => {
  return (
    <>
      <div className="event-page-heading">
        <div>
          <h1 className="event-page-heading-title">Events</h1>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <SearchBar />

          <select name="idk">
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
          </select>
        </div>
      </div>
    </>
  );
};

export default Header2;
