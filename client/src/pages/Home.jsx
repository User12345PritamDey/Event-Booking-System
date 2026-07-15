import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <>
      <section className="hero">
        <div className="hero-left">
          <h1>
            Book Amazing Events
            <br />
            Anytime, Anywhere
          </h1>

          <p>
            Music Festivals • Tech Conferences • Workshops • Sports • Cultural
            Events
          </p>
          <button
  onClick={() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
    } else {
      navigate("/events");
    }
  }}
>
  Explore Events
</button>
        </div>

        <div className="hero-right">
          <img
            src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=900"
            alt="Event"
          />
        </div>
      </section>
    </>
  );
}

export default Home;