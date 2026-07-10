import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import "./EventDetails.css";

function EventDetails() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {

    const fetchEvent = async () => {

      try {

        const res = await api.get(`/event/${id}`);
        setEvent(res.data);

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }

    };


    fetchEvent();

  }, [id]);



  if(loading){
    return <h2>Loading...</h2>
  }


  if(!event){
    return <h2>Event Not Found</h2>
  }


  return (

    <div className="event-detail-page">

      <div className="event-detail-card">

        <img 
          src={event.image}
          alt={event.title}
        />


        <div className="detail-content">

          <h1>{event.title}</h1>


          <p>
            {event.description}
          </p>


          <h3>
            📅 Date: {new Date(event.date).toDateString()}
          </h3>


          <h3>
            📍 Location: {event.location}
          </h3>


          <h3>
            🎟 Available Seats: {event.availableSeats}
          </h3>


          <h2>
            ₹ {event.ticketPrice}
          </h2>


          <button 
            onClick={() => navigate(`/booking/${event._id}`)}
          >
            Book Now
          </button>


        </div>


      </div>


    </div>

  );

}


export default EventDetails;