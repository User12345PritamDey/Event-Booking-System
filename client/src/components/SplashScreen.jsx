import { useEffect } from "react";
import "./SplashScreen.css";

function SplashScreen({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="splash">

      <div className="particles"></div>

      <div className="content">

        <h1 className="logo">
          EventBook
        </h1>

        <h2 className="welcome">
          Welcome
        </h2>

        <p className="tagline">
          Your Journey To Amazing Events Starts Here
        </p>

        <div className="typing">
          Enjoy Every Concert 🎵
        </div>

        <div className="loader">

          <span></span>
          <span></span>
          <span></span>

        </div>

        <p className="bottom">
          Music Festivals • DJ Nights • Live Concerts • Memories Forever
        </p>

      </div>

      <div className="note note1">🎵</div>
      <div className="note note2">🎶</div>
      <div className="note note3">🎼</div>
      <div className="note note4">🎤</div>

    </div>
  );
}

export default SplashScreen;