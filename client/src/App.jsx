import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOTP from "./pages/VerifyOTP";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import Booking from "./pages/Booking";
import MyBookings from "./pages/MyBookings";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        
        <Route path="/events" element={<Events />} />

        <Route path="/event/:id" element={<EventDetails />} />

        <Route path="/booking/:id" element={<Booking />} />

        <Route path="/my-bookings" element={<MyBookings />} />

        <Route path="/admin" element={<AdminDashboard />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/verify-otp" element={<VerifyOTP />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;