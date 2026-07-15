import { useEffect, useState } from "react";
import api from "../services/api";
import "./AdminDashboard.css";

function AdminDashboard() {

  const [bookings, setBookings] = useState([]);
  const [events, setEvents] = useState([]);

  const fetchData = async () => {
    try {

      const bookingRes = await api.get("/booking/my");
      const eventRes = await api.get("/event");

      setBookings(bookingRes.data);
      setEvents(eventRes.data);

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const pendingBookings = bookings.filter(
    (b) => b.status === "pending"
  ).length;

  const confirmedBookings = bookings.filter(
    (b) => b.status === "confirmed"
  ).length;
  const confirmBooking = async (id) => {

  try {

    await api.put(`/booking/${id}/confirm`, {
      paymentStatus: "paid"
    });

    alert("Booking Confirmed Successfully");

    fetchData();

  } catch (err) {

    alert(
      err.response?.data?.message || "Something went wrong"
    );

  }

};

  return (
    <div className="admin-page">

      <h1>🎉 Admin Dashboard</h1>

      <div className="dashboard-cards">

        <div className="card">
          <h2>{events.length}</h2>
          <p>Total Events</p>
        </div>

        <div className="card">
          <h2>{bookings.length}</h2>
          <p>Total Bookings</p>
        </div>

        <div className="card">
          <h2>{pendingBookings}</h2>
          <p>Pending Requests</p>
        </div>

        <div className="card">
          <h2>{confirmedBookings}</h2>
          <p>Confirmed</p>
        </div>

      </div>

      <h2 className="section-title">
        📋 Booking Requests
      </h2>

      {bookings.map((booking) => (

        <div className="admin-card" key={booking._id}>

          <img
            src={booking.eventId.image}
            alt={booking.eventId.title}
          />

          <div className="admin-info">

            <h2>{booking.eventId.title}</h2>

            <p>
              <strong>User:</strong> {booking.userId.name}
            </p>

            <p>
              <strong>Email:</strong> {booking.userId.email}
            </p>

            <p>
              <strong>Payment:</strong> {booking.paymentMethod}
            </p>

            <p>
              <strong>Status:</strong> {booking.status}
            </p>
            <p>
  <strong>Payment Status:</strong> {booking.paymentStatus}
</p>

{
  booking.status === "pending" ? (

    <button
      className="confirm-btn"
      onClick={() => confirmBooking(booking._id)}
    >
      ✅ Confirm Booking
    </button>

  ) : (

    <button
      className="confirmed-btn"
      disabled
    >
      ✔ Confirmed
    </button>

  )
}

          </div>

        </div>

      ))}

    </div>
  );
}

export default AdminDashboard;