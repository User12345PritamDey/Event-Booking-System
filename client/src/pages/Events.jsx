import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Events.css";

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await api.get("/event");
      setEvents(res.data);
    } catch (error) {
      console.log("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        Loading Events...
      </div>
    );
  }

  return (
    <div className="events-page">
      <h1>Explore Music Events 🎵</h1>

      <p className="subtitle">
        Discover concerts, festivals, DJ nights and live performances
      </p>

      <div className="events-container">
        {events.length === 0 ? (
          <h2>No Events Available</h2>
        ) : (
          events.map((event) => (
            <div className="event-card" key={event._id}>
              <img
                src={
                  event.image ||
                  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=900"
                }
                alt={event.title}
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=900";
                }}
              />

              <div className="event-details">
                <h2>{event.title}</h2>

                <p>
                  <strong>🎤 Category:</strong> {event.category}
                </p>

                <p>
                  <strong>📍 Location:</strong> {event.location}
                </p>

                <p>
                  <strong>📅 Date:</strong>{" "}
                  {new Date(event.date).toDateString()}
                </p>

                <p>
                  <strong>🎟 Available Seats:</strong>{" "}
                  {event.availableSeats}
                </p>

                <p className="price">
                  ₹ {event.ticketPrice}
                </p>

                <button
                  onClick={() => navigate(`/event/${event._id}`)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Events;