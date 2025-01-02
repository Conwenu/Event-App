import React from "react";
import logo from "../../assets/EventAppLogo2.png";
import "./AuthNavbar.css";
import { useNavigate } from "react-router-dom";
const AuthNavbar = ({ toggleTheme, isDarkMode }) => {
  const navigate = useNavigate();
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
            <a className="auth-navbar-profile-icon-link" href={`/profile/4`}>
              <i class="bi bi-person-circle auth-navbar-profile-icon fs-3 my-2 my-sm-0"></i>
            </a>
            <button class="btn btn-outline-danger my-2 my-sm-0" type="">
              Log Out
            </button>
          </div>
        </nav>
      </div>
    </>
  );
};

export default AuthNavbar;
