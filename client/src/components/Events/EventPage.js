import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './EventPage.css'; // Make sure to include your CSS file

const EventPage = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:3050/api/events');
        setEvents(response.data.events);
      } catch (err) {
        setIsError(true);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const defaultImage = 'https://wallpapercat.com/w/full/6/2/1/116007-3840x2160-desktop-4k-bleach-wallpaper-photo.jpg';

  if (isLoading) return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Loading events...</p>
    </div>
  );

  if (isError) return (
    <div className="error-container">
      <p>Error loading events: {error}</p>
    </div>
  );

  if (!events || events.length === 0) return (
    <div className="error-container">
      <p>No events found.</p>
    </div>
  );

  return (
    <div className="container mt-5">
      <h1 className="text-center">Event Pages</h1>
      <div className="row">
        {events.map(event => (
          <div className="col-md-4" key={event.id}>
            <div className="card mt-4 event-card">
              <img
                src={defaultImage}
                className="card-img-top"
                alt={event.name}
              />
              <div className="card-body">
                <h5 className="card-title">{event.name}</h5>
                <p className="card-text">Date: {event.date}</p>
                <p className="card-text">Location: {event.location}</p>
                <p className="card-text">{event.description}</p>
                <button className="btn btn-primary">Reserve Spot</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventPage;
