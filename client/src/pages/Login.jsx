import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      return toast.error("Please fill all fields");
    }

    try {
      const res = await login(form);

      if (res.needsVerification) {
        navigate("/verify-otp", {
          state: {
            email: form.email,
          },
        });
        return;
      }

      toast.success("Login Successful");

      navigate("/");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Login Failed"
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

          <h1>Welcome Back</h1>

          <p>Login to book amazing events around you.</p>

          <form onSubmit={handleSubmit}>

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
            />

            <button type="submit">
              Login
            </button>

          </form>

          <p>
            Don't have an account?
            <Link to="/register"> Register</Link>
          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;