import { useEffect, useState } from "react";
import api from "../services/api";
import "./MyBookings.css";

function MyBookings() {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    try {
      const res = await api.get("/booking/my");
      setBookings(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const cancelBooking = async (id) => {
    try {
      await api.delete(`/booking/${id}`);
      alert("Booking Cancelled");
      fetchBookings();
    } catch (error) {
      alert(error.response?.data?.message || "Error");
    }
  };

  return (
    <div className="my-bookings">
      <h1>My Bookings</h1>

      {bookings.length === 0 ? (
        <h2>No Bookings Yet</h2>
      ) : (
        bookings.map((booking) => (
          <div className="booking-box" key={booking._id}>
            <img
              src={booking.eventId.image}
              alt={booking.eventId.title}
            />

            <div>
              <h2>{booking.eventId.title}</h2>

              <p>📍 {booking.eventId.location}</p>

              <p>
                📅 {new Date(booking.eventId.date).toDateString()}
              </p>

              <p>
                💰 ₹ {booking.amount}
              </p>

              <p>
                Payment :
                <span className={`payment ${booking.paymentStatus}`}>
                  {" "}
                  {booking.paymentStatus === "paid"
                    ? "🟢 Paid"
                    : "🔴 Not Paid"}
                </span>
              </p>

              <p>
                Booking :
                <span className={`status ${booking.status}`}>
                  {" "}
                  {booking.status === "pending" && "🟡 Pending"}
                  {booking.status === "confirmed" && "🟢 Confirmed"}
                  {booking.status === "cancelled" && "🔴 Cancelled"}
                </span>
              </p>

              {booking.status === "pending" ? (
                <button
                  className="cancel-btn"
                  onClick={() => cancelBooking(booking._id)}
                >
                  Cancel Booking
                </button>
              ) : (
                <button
                  className="cancel-btn"
                  disabled
                >
                  Cannot Cancel
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default MyBookings;