import { useEffect, useState } from "react";
import api from "../services/api";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    try {
      const res = await api.get("/booking/my");
      setBookings(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const confirmBooking = async (id) => {
    try {
      await api.put(`/booking/${id}/confirm`, {
        paymentStatus: "paid",
      });

      alert("Booking Confirmed");

      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="admin-page">

      <h1>Admin Dashboard</h1>

      {bookings.map((booking) => (

        <div className="admin-card" key={booking._id}>

          <img
            src={booking.eventId.image}
            alt={booking.eventId.title}
          />

          <div>

            <h2>{booking.eventId.title}</h2>

            <p>User : {booking.userId.name}</p>

            <p>Email : {booking.userId.email}</p>

            <p>Status : {booking.status}</p>

            <p>Payment : {booking.paymentStatus}</p>

            {booking.status === "pending" && (

              <button
                onClick={() => confirmBooking(booking._id)}
              >
                Confirm Booking
              </button>

            )}

          </div>

        </div>

      ))}

    </div>
  );
}

export default AdminDashboard;