// src/components/Navbar.jsx
import Cookies from "js-cookie";
import { useLanguage } from "../context/LanguageContext";
//import "./top.css";

// Apna logo yahan import karo, ya public folder se path use karo
//import logo from "../assets/logo.png"; // ⚠️ apne actual logo path se badlo

export default function TopN() {
  const { lang, setLang, t } = useLanguage();

  // Login ke time cookie mein "name" save hona chahiye (neeche instructions dekho)
  const fullName = Cookies.get("name") || "User";
  const initial = fullName.charAt(0).toUpperCase();

  return (
    <div className="topbar">
      {/* LEFT: Logo + Site Name */}
      <div className="topbar-left">
        <img src={logo} alt="Logo" className="topbar-logo" />
        <div className="topbar-site-name">
          Leader Site
          <span className="sub">
            {lang === "hi" ? "नेता पोर्टल" : "Leader Portal"}
          </span>
        </div>
      </div>

      {/* CENTER: Logged-in User Name */}
      <div className="topbar-user">
        <div className="topbar-avatar">{initial}</div>
        <span className="topbar-user-name">{fullName}</span>
      </div>

      {/* RIGHT: Language Toggle */}
      <div className="topbar-right">
        <div className="lang-toggle">
          <button
            className={`lang-btn ${lang === "en" ? "active" : ""}`}
            onClick={() => setLang("en")}
          >
            EN
          </button>
          <button
            className={`lang-btn ${lang === "hi" ? "active" : ""}`}
            onClick={() => setLang("hi")}
          >
            हिं
          </button>
        </div>
      </div>
    </div>
  );
}