import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Home.css";

function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleExplore = () => {
    if (!user) {
      alert("Please login first to explore events.");
      navigate("/login");
      return;
    }

    navigate("/events");
  };

  return (
    <>
      <section className="hero">
        <div className="hero-overlay"></div>

        <div className="hero-content">

          <p className="small-title">
            🎵 INDIA'S #1 EVENT BOOKING PLATFORM
          </p>

          <h1>
            Experience
            <span> Live Music </span>
            Like Never Before
          </h1>

          <p className="hero-text">
            Book concerts, festivals, DJ nights and unforgettable
            experiences with just one click.
          </p>

          <div className="hero-buttons">

            <button
              className="primary-btn"
              onClick={handleExplore}
            >
              🚀 Explore Events
            </button>

          </div>

        </div>

        <div className="scroll">
          Scroll Down ↓
        </div>
      </section>

      {/* Stats */}

      <section className="stats">

        <div>
          <h2>5000+</h2>
          <p>Happy Users</p>
        </div>

        <div>
          <h2>150+</h2>
          <p>Events</p>
        </div>

        <div>
          <h2>50+</h2>
          <p>Artists</p>
        </div>

        <div>
          <h2>100%</h2>
          <p>Entertainment</p>
        </div>

      </section>
    </>
  );
}

export default Home;