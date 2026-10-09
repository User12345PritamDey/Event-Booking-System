import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";
import "./Login.css";

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const [form, setForm] = useState({
    otp: "",
    newPassword: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email again");
      navigate("/forgot-password");
      return;
    }

    if (!form.otp || !form.newPassword) {
      return toast.error("Please fill all fields");
    }

    if (form.otp.length !== 6) {
      return toast.error("OTP must be 6 digits");
    }

    try {
      await api.post("/auth/reset-password", {
        email,
        otp: form.otp,
        newPassword: form.newPassword,
      });

      toast.success("Password reset successfully");

      navigate("/login");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        "Password reset failed"
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

          <h1>Reset Password</h1>

          <p>
            Enter the OTP sent to your email and create a new password.
          </p>

          <form onSubmit={handleSubmit}>

            <input
              type="text"
              name="otp"
              placeholder="Enter 6-digit OTP"
              value={form.otp}
              maxLength="6"
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");

                setForm({
                  ...form,
                  otp: value,
                });
              }}
            />

            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              value={form.newPassword}
              onChange={handleChange}
            />

            <button type="submit">
              Reset Password
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}

export default ResetPassword;