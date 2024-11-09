import React, { useState } from "react";
// import { Link, NavLink } from "react-router-dom";
import horizontal_bars from "../../assets/Hamburger_icon.svg.webp";
import logo from "../../assets/EventAppLogo2.png";
import "./Navbar.css";
export default function Navbar() {
  //   const [menuOpen, setMenuOpen] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
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
            <i class="bi bi-search"></i>
          </div>
        </div>

        {signedIn ? (
          <div className="nav-right flex-div">
            <img src={horizontal_bars} alt="menu"></img>
          </div>
        ) : (
          <div>
            <div className="nav-right flex-div">
              <a href="/signin">Sign In </a> / <a href="/register"> Register</a>
            </div>
          </div>
        )}
      </nav>
      <button onClick={() => setSignedIn(!signedIn)}>test</button>
    </>
  );
}
