import React, { useState } from "react";
import "./CreateEvent.css";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers";
import "bootstrap/dist/css/bootstrap.min.css";

const CreateEvent = () => {
  const [startDateTime, setStartDateTime] = useState(null);
  const [endDateTime, setEndDateTime] = useState(null);
  const [finalRSVPTime, setFinalRSVPTime] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageError, setImageError] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const maxSizeInBytes = 2 * 1024 * 1024; // 2MB

    if (file) {
      if (!file.type.startsWith("image/")) {
        setImageError("File must be an image.");
        setImagePreview(null);
        e.target.value = ""; // clears input
      } else if (file.size > maxSizeInBytes) {
        setImageError("File size must be under 2MB.");
        setImagePreview(null);
        e.target.value = ""; // clears input
      } else {
        setImageError("");
        const reader = new FileReader();
        reader.onload = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    console.log("Event Data:", data);
    // form submission logic l8r
  };

  return (
    <div className="createEventContainer">
      <div className="createEventHeader">
        <h2>Create Event</h2>
      </div>
      <div className="createEventFormContainer">
        <form onSubmit={handleSubmit}>
          <label htmlFor="eventName">Event Name</label>
          <input
            className="createEventFormInput createEventFormDirect"
            type="text"
            id="eventName"
            name="eventName"
            placeholder="Birthday Party"
            required
          />

          <label htmlFor="venueName">Venue</label>
          <input
            className="createEventFormInput createEventFormDirect"
            type="text"
            id="venueName"
            name="venueName"
            placeholder="1 Hacker Wy, Menlo Park, CA 94025"
            required
          />

          <label htmlFor="description">Description</label>
          <textarea
            className="createEventFormInput createEventFormDirect"
            id="description"
            name="description"
            placeholder="Describe the event..."
            required
          ></textarea>

          <label htmlFor="startDate">Start Date</label>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="Select Start Date & Time"
              value={startDateTime}
              onChange={(newValue) => setStartDateTime(newValue)}
              renderInput={(params) => (
                <input
                  {...params.inputProps}
                  name="startDate"
                  className="form-control time-inputs"
                  required
                />
              )}
            />
          </LocalizationProvider>

          <label htmlFor="endDate">End Date</label>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="Select End Date & Time"
              value={endDateTime}
              onChange={(newValue) => setEndDateTime(newValue)}
              renderInput={(params) => (
                <input
                  {...params.inputProps}
                  name="endDate"
                  className="form-control time-inputs"
                  required
                />
              )}
            />
          </LocalizationProvider>

          <label htmlFor="finalRSVPTime">Final RSVP Time</label>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="Select Final RSVP Time"
              value={finalRSVPTime}
              onChange={(newValue) => setFinalRSVPTime(newValue)}
              renderInput={(params) => (
                <input
                  {...params.inputProps}
                  name="finalRSVPTime"
                  className="form-control time-inputs"
                  required
                />
              )}
            />
          </LocalizationProvider>

          <div className="mb-3">
            <label htmlFor="image" className="form-label">
              Image
            </label>
            <input
              className="form-control"
              type="file"
              id="image"
              name="image"
              onChange={handleFileChange}
              required
            />
          </div>

          {imageError && <p className="error-message">{imageError}</p>}
          {imagePreview && (
            <img src={imagePreview} alt="Preview" className="image-preview" />
          )}

          <label htmlFor="maxReservations">Max Reservations</label>
          <input
            className="createEventFormInput createEventFormDirect"
            type="number"
            id="maxReservations"
            name="maxReservations"
            placeholder="20"
            min={1}
            required
          />

          <label htmlFor="reservationsPerUser">Reservations Per User</label>
          <input
            className="createEventFormInput createEventFormDirect"
            type="number"
            id="reservationsPerUser"
            name="reservationsPerUser"
            placeholder="1"
            min={1}
            required
          />

          <button type="submit" className="create-event-submit-button btn mt-3">
            Create Event
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
