import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.email ||
      !form.password ||
      !form.confirmPassword
    ) {
      toast.error("Please fill all fields");
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await api.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });

      toast.success(res.data.message);

      // Go to OTP verification page
      navigate("/verify-otp", {
        state: {
          email: form.email,
        },
      });
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Registration Failed"
      );
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">

        <h1>Create Account 🚀</h1>

        <p>
          Join EventBook and book your favourite events easily.
        </p>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <input
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />

          <label className="show-pass">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            <span>Show Password</span>
          </label>

          <button type="submit">
            Create Account
          </button>

        </form>

        <div className="bottom-text">
          Already have an account?
          <Link to="/login"> Login</Link>
        </div>

      </div>
    </div>
  );
}

export default Register;