import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Events.css";

function Events() {

  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const fetchEvents = async (query = "") => {

    try {

      const res = await api.get(`/event?search=${query}`);

      setEvents(res.data);

    } catch (err) {

      console.log(err);

    }

  };

  useEffect(() => {

    fetchEvents();

  }, []);

  const handleSearch = () => {

    fetchEvents(search);

  };

  return (

    <div className="events-container">

      <h2 className="events-title">
        🎵 All Events
      </h2>

      <div className="search-box">

        <input
          type="text"
          placeholder="Search event..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button onClick={handleSearch}>
          Search
        </button>

      </div>

      <div className="events-grid">

        {events.length === 0 ? (

          <h2>No Events Found</h2>

        ) : (

          events.map((event) => (

            <div
              className="event-card"
              key={event._id}
            >

              <img
                src={event.image}
                alt={event.title}
              />

              <div className="event-details">

                <h2>
                  {event.title}
                </h2>

                <p>
                  {event.description}
                </p>

                <p>
                  📍 {event.location}
                </p>

                <p>
                  📅 {new Date(event.date).toLocaleDateString()}
                </p>

                <button
                  onClick={() => navigate(`/booking/${event._id}`)}
                >
                  Book Now
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