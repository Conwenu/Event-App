import React from "react";
import logo from "../../assets/EventAppLogo2.png";
import "./AuthNavbar.css";
import useLogout from "../../hooks/useLogout";
const AuthNavbar = ({ toggleTheme, isDarkMode }) => {
  const handleLogout = useLogout();
  return (
    <>
      <div>
        <nav className="auth-navbar navbar navbar-light justify-content-between">
          <a className="auth-navbar-logo navbar-brand" href="/">
            <img className="logo" src={logo} alt="logo" width="80px"></img>
          </a>
          <div className="auth-navbar-right-side">
            <i
              className={`bi bi-${
                isDarkMode ? "moon" : "sun"
              } fs-3 auth-navbar-theme-toggle`}
              onClick={toggleTheme}
            ></i>
            <a
              className="auth-navbar-profile-icon-link"
              href={`/profile/viewEvents/4/myRsvps`}
            >
              <i className="bi bi-person-circle auth-navbar-profile-icon fs-3 my-2 my-sm-0"></i>
            </a>
            <button
              className="btn my-2 my-sm-0 auth-navbar-button"
              type="button"
              onClick={handleLogout}
            >
              Log Out
            </button>
          </div>
        </nav>
      </div>
    </>
  );
};

export default AuthNavbar;
