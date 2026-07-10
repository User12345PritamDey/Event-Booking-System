import { Link } from "react-router-dom";
import "./Login.css";
function Login() {
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

          <h1>Welcome Back </h1>

          <p>Login to book amazing events around you.</p>

          <form>

            <input
              type="email"
              placeholder="Email Address"
            />

            <input
              type="password"
              placeholder="Password"
            />

            <button>
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