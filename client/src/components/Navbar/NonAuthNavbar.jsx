import React from "react";
import logo from "../../assets/EventAppLogo2.png";
import "./NonAuthNavbar.css";
const NonAuthNavbar = ({ toggleTheme, isDarkMode }) => {
  return (
    <>
      <div className="w-100">
        <nav className="non-auth-navbar navbar navbar-light justify-content-between">
          <a className="non-auth-navbar-logo navbar-brand" href="/">
            <img className="logo" src={logo} alt="logo" width="80px"></img>
          </a>
          <div className="non-auth-navbar-right-side">
            <i
              className={`bi bi-${
                isDarkMode ? "moon" : "sun"
              } fs-3 non-auth-navbar-theme-toggle`}
              onClick={toggleTheme}
            ></i>
            <a href="/signup">
              <button
                className="btn my-2 my-sm-0 non-auth-navbar-button"
                type="button"
              >
                Sign Up
              </button>
            </a>
            <a href="/login">
              <button
                className="btn my-2 my-sm-0 non-auth-navbar-button"
                type="button"
              >
                Log In
              </button>
            </a>
          </div>
        </nav>
      </div>
    </>
  );
};

export default NonAuthNavbar;
