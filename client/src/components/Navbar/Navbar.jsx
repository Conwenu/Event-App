import React, { useState } from "react";
// import { Link, NavLink } from "react-router-dom";
import horizontal_bars from "../../assets/Hamburger_icon.svg.webp";
import logo from "../../assets/EventAppLogo2.png";
import "./Navbar.css";
export default function Navbar() {
  //   const [menuOpen, setMenuOpen] = useState(false);
  const [signedIn] = useState(false);
  //setSignIn(signedIn);
  return (
    <>
      <nav className="flex-div">
        <div className="nav-left flex-div">
          <a href="/api/events">
            <img className="logo" src={logo} alt="logo"></img>
          </a>
        </div>

        <div className="nav-middle flex-div">
          <div className="search-box flex-div">
            <input type="text" placeholder="Search Events"></input>
            <i className="bi bi-search"></i>
          </div>
        </div>

        {signedIn ? (
          <div className="nav-right flex-div">
            <img src={horizontal_bars} alt="menu"></img>
          </div>
        ) : (
          <div className="nav-right flex-div">
            <ul>
              <li>
                <button type="button" className="btn btn-secondary">
                  Sign Up
                </button>
              </li>
              <li>
                <button type="button" className="btn btn-success">
                  Log In
                </button>
              </li>
            </ul>
          </div>
        )}
      </nav>
      {/* <button onClick={() => setSignedIn(!signedIn)}>test</button> */}
    </>
  );
}
