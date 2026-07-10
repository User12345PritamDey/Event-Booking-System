import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {

  const { user, logout } = useAuth();

  return (
    <nav className="navbar">

      <h2>🎉 EventBook</h2>

      <div>

        <Link to="/">Home</Link>

        <Link to="/events">Events</Link>

        {user ? (
          <>

            <Link to="/my-bookings">
              My Bookings
            </Link>

            {user.role === "admin" && (
              <Link to="/admin">
                Admin
              </Link>
            )}

            <button
              onClick={logout}
              className="logout-btn"
            >
              Logout
            </button>

          </>
        ) : (
          <>

            <Link to="/login">
              Login
            </Link>

            <Link to="/register">
              Register
            </Link>

          </>
        )}

      </div>

    </nav>
  );
}

export default Navbar;