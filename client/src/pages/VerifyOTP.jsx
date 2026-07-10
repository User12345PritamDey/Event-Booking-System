import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";
import "./VerifyOTP.css";

export default function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email not found. Please register again.");
      navigate("/register");
      return;
    }

    if (!otp) {
      toast.error("Please enter the OTP");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/verify-otp", {
        email,
        otp,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data));

      toast.success("🎉 Account verified successfully!");

      navigate("/");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Invalid or Expired OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verify-container">
      <div className="verify-card">

        <h2>Verify Your Account</h2>

        <p>
          We've sent a verification code to
          <br />
          <strong>{email}</strong>
        </p>

        <form onSubmit={handleVerify}>

          <input
            type="text"
            placeholder="Enter 6-digit OTP"
            value={otp}
            maxLength={6}
            onChange={(e) => setOtp(e.target.value)}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

        </form>

        <div className="otp-note">
          OTP expires in <strong>5 minutes</strong>.
        </div>

      </div>
    </div>
  );
}