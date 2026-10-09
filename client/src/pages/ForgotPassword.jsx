import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";
import "./Login.css";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      return toast.error("Please enter your email");
    }

    try {
      await api.post("/auth/forgot-password", {
        email,
      });

      toast.success("OTP sent to your email");

      navigate("/reset-password", {
        state: {
          email: email,
        },
      });
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        "Failed to send OTP"
      );
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-image">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRT4gdwsFf-PoBX6KJCQnxUR6XdObSQ_YRIZPT_EjK3kw&s=10"
          alt="Event"
        />
      </div>

      <div className="auth-right">

        <div className="login-box">

          <h1>Forgot Password?</h1>

          <p>
            Enter your registered email to receive an OTP.
          </p>

          <form onSubmit={handleSubmit}>

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button type="submit">
              Send OTP
            </button>

          </form>

          <p>
            Remember your password?{" "}
            <Link
              to="/login"
              className="back-login"
            >
              Login
            </Link>
          </p>

        </div>

      </div>

    </div>
  );
}

export default ForgotPassword;