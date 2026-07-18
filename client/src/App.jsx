import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SplashScreen from "./components/SplashScreen";
import PrivateRoute from "./components/PrivateRoute";

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
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return (
      <SplashScreen
        onFinish={() => setShowSplash(false)}
      />
    );
  }

  return (
    <>
      <Navbar />

      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />

        {/* Protected Routes */}
        <Route
          path="/events"
          element={
            <PrivateRoute>
              <Events />
            </PrivateRoute>
          }
        />

        <Route
          path="/event/:id"
          element={
            <PrivateRoute>
              <EventDetails />
            </PrivateRoute>
          }
        />

        <Route
          path="/booking/:id"
          element={
            <PrivateRoute>
              <Booking />
            </PrivateRoute>
          }
        />

        <Route
          path="/my-bookings"
          element={
            <PrivateRoute>
              <MyBookings />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />

      </Routes>

      <Footer />
    </>
  );
}

export default App;