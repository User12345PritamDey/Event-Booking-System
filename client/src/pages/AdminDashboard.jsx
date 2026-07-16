import { useEffect, useState } from "react";
import api from "../services/api";
import "./AdminDashboard.css";

function AdminDashboard() {

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const fetchBookings = async () => {
    try {

      const res = await api.get("/booking/my");

      setBookings(res.data);

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const confirmBooking = async (id) => {

    try {

      await api.put(`/booking/${id}/confirm`, {
        paymentStatus: "paid"
      });

      alert("Booking Confirmed Successfully");

      fetchBookings();

    } catch (err) {

      alert(
        err.response?.data?.message || "Error confirming booking"
      );

    }

  };

  const cancelBooking = async (id) => {

    try {

      await api.delete(`/booking/${id}`);

      alert("Booking Cancelled Successfully");

      fetchBookings();

    } catch (err) {

      alert(
        err.response?.data?.message || "Error cancelling booking"
      );

    }

  };

  if (loading) {

    return (
      <div className="loading">
        Loading Dashboard...
      </div>
    );

  }

  const pending = bookings.filter(
    (b) => b.status === "pending"
  ).length;

  const confirmed = bookings.filter(
    (b) => b.status === "confirmed"
  ).length;

  const cancelled = bookings.filter(
    (b) => b.status === "cancelled"
  ).length;

  const filteredBookings = bookings.filter((booking) => {

    const event =
      booking.eventId?.title?.toLowerCase() || "";

    const user =
      booking.userId?.name?.toLowerCase() || "";

    const matchesSearch =
      event.includes(search.toLowerCase()) ||
      user.includes(search.toLowerCase());

    const matchesFilter =
      filter === "all" ||
      booking.status === filter;

    return matchesSearch && matchesFilter;

  });

  return (

    <div className="admin-page">

      <h1>🎉 Admin Dashboard</h1>

      <div className="stats">

        <div className="stat-card">
          <h2>{bookings.length}</h2>
          <p>Total Bookings</p>
        </div>

        <div className="stat-card pending">
          <h2>{pending}</h2>
          <p>Pending</p>
        </div>

        <div className="stat-card confirmed">
          <h2>{confirmed}</h2>
          <p>Confirmed</p>
        </div>

        <div className="stat-card cancelled">
          <h2>{cancelled}</h2>
          <p>Cancelled</p>
        </div>

      </div>

      <h2 className="section-title">

        📋 Booking Requests

      </h2>

      <div className="admin-tools">

        <input
          type="text"
          placeholder="🔍 Search User or Event"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <select
          value={filter}
          onChange={(e) =>
            setFilter(e.target.value)
          }
        >

          <option value="all">All</option>

          <option value="pending">
            Pending
          </option>

          <option value="confirmed">
            Confirmed
          </option>

          <option value="cancelled">
            Cancelled
          </option>

        </select>

      </div>

      <table className="booking-table">

        <thead>

          <tr>

            <th>Event</th>

            <th>User</th>

            <th>Email</th>

            <th>Payment</th>

            <th>Amount</th>

            <th>Status</th>

            <th>Action</th>

          </tr>

        </thead>

        <tbody>

          {filteredBookings.length === 0 ? (

            <tr>

              <td colSpan="7">

                No Booking Requests

              </td>

            </tr>

          ) : (

            filteredBookings.map((booking) => (

              <tr key={booking._id}>

                <td>
                  {booking.eventId?.title}
                </td>

                <td>
                  {booking.userId?.name}
                </td>

                <td>
                  {booking.userId?.email}
                </td>

                <td>
                  {booking.paymentMethod}
                </td>

                <td>
                  ₹ {booking.amount}
                </td>

                <td>

                  <span
                    className={`status ${booking.status}`}
                  >

                    {booking.status}

                  </span>

                </td>

                <td>

                  {booking.status === "pending" ? (

                    <>

                      <button
                        className="approve-btn"
                        onClick={() =>
                          confirmBooking(booking._id)
                        }
                      >

                        Approve

                      </button>

                      <button
                        className="cancel-btn"
                        onClick={() =>
                          cancelBooking(booking._id)
                        }
                      >

                        Cancel

                      </button>

                    </>

                  ) : (

                    <span>
                      Completed
                    </span>

                  )}

                </td>

              </tr>

            ))

          )}

        </tbody>

      </table>

    </div>

  );

}

export default AdminDashboard;