import React from "react";
import { Navbar, Container, Nav, Form } from "react-bootstrap";
import search_icon from "../../assets/search.svg";
import "./UserEventGridHeader.css";

const UserEventGridHeader = ({
  searchFilters,
  onSearchChange,
  handleSearchChange,
  handleSearchButtonClick,
  selectedSort,
  onSortChange,
}) => {
  return (
    <Navbar bg="light" expand="lg" className="UserEventGridHeaderNavbar">
      <Container fluid>
        <Navbar.Brand className="UserEventGridHeaderNavbar-title">
          Your Events
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarNav" className="navbar-toggler" />
        <Navbar.Collapse id="navbarNav" className="justify-content-end">
          <Nav className="d-flex">
            {/* Sort Select Box */}
            <Form.Select
              aria-label="Select an option"
              className="me-2 UserEventGridHeaderNavbar-select"
              value={selectedSort}
              onChange={(e) => onSortChange(e.target.value)}
            >
              <option value="newestFirst">Newest First</option>
              <option value="oldestFirst">Oldest First</option>
              <option value="startTimeAsc">Start Time Ascending</option>
              <option value="startTimeDesc">Start Time Descending</option>
            </Form.Select>

            {/* Searchbox Div */}
            <div className="searchBox d-flex UserEventGridHeaderNavbar-searchBox">
              <input
                type="text"
                placeholder="Search"
                value={searchFilters}
                onChange={(e) => onSearchChange(e.target.value)}
                onKeyDown={handleSearchChange}
              />
              <img
                src={search_icon}
                alt="Search Icon"
                className="navbar-search-icon"
                onClick={handleSearchButtonClick}
              />
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default UserEventGridHeader;
