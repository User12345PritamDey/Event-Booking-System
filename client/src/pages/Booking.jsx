import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import "./Booking.css";

function Booking() {
  const { id } = useParams();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [otp, setOtp] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    fetchEvent();
  }, []);

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

  if (loading) {
    return <h2 className="loading">Loading Booking...</h2>;
  }

  if (!event) {
    return <h2 className="loading">Event Not Found</h2>;
  }
  const handleSendOTP = async () => {
  try {
    await api.post("/booking/send-otp");

    alert("Booking OTP has been sent to your email.");

    setOtpSent(true);

  } catch (error) {

    console.log(error);

    alert(
      error.response?.data?.message || "Failed to send OTP."
    );
  }
};
const handleBooking = async () => {

  if (!otp) {
    alert("Please enter OTP.");
    return;
  }

  try {

    const res = await api.post("/booking", {
      eventId: event._id,
      otp,
      paymentMethod,
    });

    alert(res.data.message);

  } catch (error) {

    alert(
      error.response?.data?.message || "Booking Failed"
    );

  }

};
return (
    <div className="booking-page">
      <div className="booking-card">

        <img
          src={event.image}
          alt={event.title}
        />

        <div className="booking-details">

          <h1>{event.title}</h1>

          <p>{event.description}</p>

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

          <h2>₹ {event.ticketPrice}</h2>

          {!otpSent ? (

  <button onClick={handleSendOTP}>
    Continue Booking
  </button>

) : (

  <>

    <h3>Select Payment Method</h3>

    <div className="payment-method">

      <label>
        <input
          type="radio"
          value="UPI"
          checked={paymentMethod === "UPI"}
          onChange={(e) =>
            setPaymentMethod(e.target.value)
          }
        />
        UPI
      </label>

      <label>
        <input
          type="radio"
          value="Card"
          checked={paymentMethod === "Card"}
          onChange={(e) =>
            setPaymentMethod(e.target.value)
          }
        />
        Card
      </label>

      <label>
        <input
          type="radio"
          value="Cash"
          checked={paymentMethod === "Cash"}
          onChange={(e) =>
            setPaymentMethod(e.target.value)
          }
        />
        Cash
      </label>

    </div>

    <div className="otp-section">

  <h3>🔐 Verify Booking</h3>

  <p>
    Enter the 6-digit OTP sent to your registered email.
  </p>

  <input
    type="text"
    placeholder="● ● ● ● ● ●"
    value={otp}
    maxLength={6}
    onChange={(e) => setOtp(e.target.value)}
  />

</div>

    <button onClick={handleBooking}>
      Confirm Booking
    </button>

  </>

)}

        </div>

      </div>
    </div>
  );
}

export default Booking;