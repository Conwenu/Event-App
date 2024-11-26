import React from "react";
import "./Navbar2.css";
// import horizontal_bars from "../../assets/Hamburger_icon.svg.webp";
import logo from "../../assets/EventAppLogo2.png";
import search_icon from "../../assets/search.svg";
const Navbar2 = () => {
  return (
    <>
      <div className="customNavbar">
        <img src={logo} alt="" className="navbar-logo"></img>

        <div className="searchBox">
          <input type="text" placeholder="Search"></input>
          <img src={search_icon} alt="" className="navbar-search-icon" />
        </div>

        <div className="navbar-r">
          <ul className="navbar-r navbar-r-ul">
            <li className="sign-up-button-container">
              <a href="/#" className="menu-title navbar-sign-up">
                Sign Up
              </a>
            </li>
            <li className="log-in-button-container">
              <a href="/#" className="menu-title navbar-log-in nav-btn">
                Log In
              </a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Navbar2;
