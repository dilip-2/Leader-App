import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "./Media.css";

export default function MediaCorner() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const clean = location.pathname.replace(/\/+$/, "");
    if (clean.endsWith("mediacorner")) {
      navigate("press-meets", { replace: true });
    }
  }, [location.pathname, navigate]);

  // Helper to check if link is active
  const isActive = (path) => location.pathname.includes(path);

  return (
    <div className="media-container">
      <h2 className="media-title">
        <span className="media-title-icon">📰</span> Media Corner
      </h2>

      <nav className="media-nav">
        <Link
          to="press-meets"
          className={`media-link ${isActive("press-meets") ? "active" : ""}`}
        >
          Press Meets
        </Link>

        <Link
          to="past-events"
          className={`media-link ${isActive("past-events") ? "active" : ""}`}
        >
          Past Events
        </Link>

        <Link
          to="facebook"
          className={`media-link ${isActive("facebook") ? "active" : ""}`}
        >
          Facebook
        </Link>

        <Link
          to="instagram"
          className={`media-link ${isActive("instagram") ? "active" : ""}`}
        >
          Instagram
        </Link>

        <Link
          to="x"
          className={`media-link ${isActive("x") ? "active" : ""}`}
        >
          X (Twitter)
        </Link>

        <Link
          to="video"
          className={`media-link ${isActive("video") ? "active" : ""}`}
        >
          Videos
        </Link>
      </nav>

      <div className="media-content">
        <Outlet />
      </div>
    </div>
  );
}