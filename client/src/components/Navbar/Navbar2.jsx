import React, { useState, useEffect } from "react";
import "./Navbar2.css";
import logo from "../../assets/EventAppLogo2.png";
import search_icon from "../../assets/search.svg";

const Navbar2 = ({ toggleTheme, isDarkMode }) => {
  const minScreenSize = 990; // Minimum screen size for the search bar to appear
  const [isMobile, setIsMobile] = useState(window.innerWidth <= minScreenSize); // Track if the screen is mobile size

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= minScreenSize); // Update isMobile on window resize
    };

    window.addEventListener("resize", handleResize);

    // Cleanup the event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="customNavbar">
      <a href="/">
        <img src={logo} alt="Logo" className="navbar-logo" />
      </a>

      {!isMobile && (
        <div className="searchBox">
          <input type="text" placeholder="Search" />
          <img
            src={search_icon}
            alt="Search icon"
            className="navbar-search-icon"
          />
        </div>
      )}

      <div className="navbar-r">
        <i
          className={`bi bi-${isDarkMode ? "moon" : "sun"} fs-3`}
          onClick={toggleTheme}
        ></i>
        <ul className="navbar-r navbar-r-ul">
          <li className="sign-up-button-container">
            <a href="/signup" className="menu-title navbar-sign-up">
              Sign Up
            </a>
          </li>
          <li className="log-in-button-container">
            <a href="/login" className="menu-title navbar-log-in nav-btn">
              Log In
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar2;
