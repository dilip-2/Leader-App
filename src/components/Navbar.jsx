// --- FULL Navbar.jsx (Logo Fixed using existing CSS class) ---

import { useState, useEffect } from "react";
import { Link, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import {
  FaHome,
  FaUserCircle,
  FaSignInAlt,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaComments,
  FaUniversity,
  FaNewspaper,
  FaKey,
  FaUser,
  FaEnvelope,
  FaLandmark,
} from "react-icons/fa";
import Cookies from "js-cookie";
import axios from "axios";

import Home from "../pages/Home";
import Login from "../pages/Login";
import User from "../pages/User";
import Samvad from "../pages/samvad";
import DefaultContent from "../pages/Default";
import LeaderConstituency from "../pages/leaderConstituen";
import Contact from "../pages/ContactUS";

import ForgotPassword from "../pages/ForgotPassword";
import ChangePassword from "../pages/ChangePassword";

import LeaderDetails from "../leaderknow/LeaderDetails";
import PersonalInfo from "../leaderknow/PersonalInfo";
import EducationInfo from "../leaderknow/EducationInfo";
import PermanentAddress from "../leaderknow/PermanentAddress";
import SocialLinks from "../leaderknow/SocialLinks";
import LeaderTimeline from "../leaderknow/timeline";
import PresentAddress from "../leaderknow/presentAddress";

import Appeal from "../pages/samvad/Appeal";
import Appointment from "../pages/samvad/Appointment";
import Complaints from "../pages/samvad/Complaints";
import Grievance from "../pages/samvad/Grievance";

import MediaCorner from "../pages/mediacorner";
import PressMeets from "../pages/media/press-meets";
import PastEvents from "../pages/media/past-Events";
import Facebook from "../pages/Facebook";
import Instagram from "../pages/Instagram";
import X from "../pages/X";
import Video from "../pages/video";
import Feedback from "../pages/feedback";

import PrivateRoute from "../routes/PrivateRoute";

import "./Navbar.css";

// ✅ .env se APP_KEY
const APP_KEY = import.meta.env.VITE_APP_KEY;

// ✅ LEADER LOGO (Your requested image)
const LEADER_LOGO =
  "https://th.bing.com/th/id/OIP.CHYTXACXpOGrgaahX3bsmAHaHZ?r=0&o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3";

// ✅ Default avatar fallback for user profile
const DEFAULT_AVATAR =
  "https://cdn-icons-png.flaticon.com/512/149/149071.png";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [leaderDropdownOpen, setLeaderDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const token = Cookies.get("accessToken");
    setIsLoggedIn(!!token);
    setProfileDropdownOpen(false);
    setLeaderDropdownOpen(false);
    setMenuOpen(false);
  }, [location]);

  // ---------------------- LOGOUT FUNCTION ----------------------
  const handleLogout = async () => {
    try {
      const accessToken = Cookies.get("accessToken");
      const appKey = Cookies.get("appKey") || APP_KEY;
      const refreshToken = Cookies.get("refreshToken");
      const email = Cookies.get("email");
      const mobile = Cookies.get("leader_regd_mobile_no");

      console.log("🔑 Logout Data:", {
        mobile,
        email,
        accessToken: accessToken?.substring(0, 20) + "...",
        refreshToken: refreshToken?.substring(0, 20) + "...",
        appKey: appKey?.substring(0, 20) + "...",
      });

      if (accessToken && refreshToken && email && mobile) {
        try {
          console.log("📤 Calling logout API...");
          const response = await axios.post(
            "/api/auth/logout",
            {
              leader_regd_mobile_no: mobile,
              user_email_id: email,
              refresh_token: refreshToken,
            },
            {
              headers: {
                "Content-Type": "application/json",
                "Content-Transfer-Encoding": "application/json",
                "x-app-key": appKey,
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          console.log("✅ Logout API success:", response.data);
        } catch (apiError) {
          console.error("⚠️ Logout API failed:", {
            status: apiError.response?.status,
            message: apiError.response?.data?.message || apiError.message,
            data: apiError.response?.data,
          });
        }
      } else {
        console.log("⚠️ Missing logout data:", {
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!refreshToken,
          hasEmail: !!email,
          hasMobile: !!mobile,
        });
      }
    } catch (err) {
      console.error("❌ Logout error:", err);
    } finally {
      console.log("🧹 Clearing all cookies...");
      Cookies.remove("accessToken", { path: "/" });
      Cookies.remove("refreshToken", { path: "/" });
      Cookies.remove("appKey", { path: "/" });
      Cookies.remove("email", { path: "/" });
      Cookies.remove("leader_regd_mobile_no", { path: "/" });

      setIsLoggedIn(false);
      setProfileDropdownOpen(false);

      console.log("🔄 Redirecting to login...");
      navigate("/login");
    }
  };

  // ---------------------- PROTECTED CLICK HANDLER ----------------------
  const handleProtectedClick = (path) => {
    if (!isLoggedIn) {
      alert("Please login first");
      navigate("/login");
    } else {
      navigate(path);
      setMenuOpen(false);
      setProfileDropdownOpen(false);
      setLeaderDropdownOpen(false);
    }
  };

  const toggleLeaderDropdown = () => {
    setLeaderDropdownOpen(!leaderDropdownOpen);
    if (!leaderDropdownOpen) setProfileDropdownOpen(false);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
    if (!profileDropdownOpen) setLeaderDropdownOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div>
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-container">
          {/* ---------------- LOGO (USING EXISTING CSS) ---------------- */}
          <div className="nav-logo" onClick={() => navigate("/")}>
            {/* 🟢 Using 'logo-img' class exactly as defined in your CSS */}
            <img 
              src={LEADER_LOGO} 
              alt="Leader Logo" 
              className="logo-img" 
            />
            <span className="logo-text">LeaderApp</span>
          </div>

          {/* ---------------- NAV LINKS ---------------- */}
          <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
            <li>
              <span
                onClick={() => handleProtectedClick("/home")}
                className={`nav-link ${isActive("/home") ? "active" : ""}`}
              >
                <FaHome /> Home
              </span>
            </li>

            <li>
              <span
                onClick={() => handleProtectedClick("/samvad")}
                className={`nav-link ${isActive("/samvad") ? "active" : ""}`}
              >
                <FaComments /> Samvad
              </span>
            </li>

            <li>
              <span
                onClick={() => handleProtectedClick("/leaderConstituen")}
                className={`nav-link ${
                  isActive("/leaderConstituen") ? "active" : ""
                }`}
              >
                <FaUniversity /> About Constituency
              </span>
            </li>

            <li>
              <span
                onClick={() => handleProtectedClick("/mediacorner")}
                className={`nav-link ${
                  isActive("/mediacorner") ? "active" : ""
                }`}
              >
                <FaNewspaper /> Media Corner
              </span>
            </li>

            <li>
              <span
                onClick={() => handleProtectedClick("/feedback")}
                className={`nav-link ${isActive("/feedback") ? "active" : ""}`}
              >
                <FaNewspaper /> Feedback
              </span>
            </li>

            <li>
              <span
                onClick={() => handleProtectedClick("/ContactUS")}
                className={`nav-link ${
                  isActive("/ContactUS") ? "active" : ""
                }`}
              >
                <FaEnvelope /> Contact Us
              </span>
            </li>

            {/* ---------------- KNOW YOUR LEADER (pill button) ---------------- */}
            <li className="dropdownt">
              <button className="dropdown-btn" onClick={toggleLeaderDropdown}>
                <FaLandmark /> Know Your Leader
                <span className="chevron">
                  {leaderDropdownOpen ? "▲" : "▼"}
                </span>
              </button>

              {leaderDropdownOpen && (
                <div
                  className={`dropdown-menu ${
                    leaderDropdownOpen ? "show" : ""
                  }`}
                >
                  <span
                    onClick={() => handleProtectedClick("/leader/profile")}
                    className="dropdown-item"
                  >
                    👤 Leader Profile
                  </span>
                  <span
                    onClick={() =>
                      handleProtectedClick("/leader/personal-info")
                    }
                    className="dropdown-item"
                  >
                    📝 Personal Info
                  </span>
                  <span
                    onClick={() =>
                      handleProtectedClick("/leader/permanent-address")
                    }
                    className="dropdown-item"
                  >
                    🏠 Permanent Address
                  </span>
                  <span
                    onClick={() =>
                      handleProtectedClick("/leader/present-address")
                    }
                    className="dropdown-item"
                  >
                    🏢 Present Address
                  </span>
                  <span
                    onClick={() => handleProtectedClick("/leader/education")}
                    className="dropdown-item"
                  >
                    🎓 Education
                  </span>
                  <span
                    onClick={() =>
                      handleProtectedClick("/leader/social-links")
                    }
                    className="dropdown-item"
                  >
                    🔗 Social Links
                  </span>
                  <span
                    onClick={() => handleProtectedClick("/leader/timeline")}
                    className="dropdown-item"
                  >
                    📅 Timeline
                  </span>
                </div>
              )}
            </li>

            {/* ---------------- PROFILE / LOGIN ---------------- */}
            {isLoggedIn ? (
              <li className="dropdownt profile-dropdown">
                <button className="profile-btn" onClick={toggleProfileDropdown}>
                  <img
                    src={Cookies.get("profileImage") || DEFAULT_AVATAR}
                    alt="Profile"
                    className="profile-avatar"
                  />
                  <span className="chevron">
                    {profileDropdownOpen ? "▲" : "▼"}
                  </span>
                </button>

                {profileDropdownOpen && (
                  <div
                    className={`dropdown-menu profile-menu ${
                      profileDropdownOpen ? "show" : ""
                    }`}
                  >
                    <span
                      onClick={() => handleProtectedClick("/change-password")}
                      className="dropdown-item"
                    >
                      <FaKey /> Change Password
                    </span>
                    <span
                      onClick={handleLogout}
                      className="dropdown-item logout-item"
                    >
                      <FaSignOutAlt /> Logout
                    </span>
                  </div>
                )}
              </li>
            ) : (
              <li>
                <Link to="/login" className="nav-link">
                  <FaSignInAlt /> Login
                </Link>
              </li>
            )}
          </ul>

          {/* ---------------- HAMBURGER ---------------- */}
          <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes /> : <FaBars />}
          </div>
        </div>
      </nav>

      {/* ---------------------- ROUTES ---------------------- */}
      <Routes>
        <Route path="/" element={<DefaultContent />} />
        <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/user" element={<PrivateRoute><User /></PrivateRoute>} />
        <Route path="/samvad" element={<PrivateRoute><Samvad /></PrivateRoute>} />
        <Route path="/login" element={<Login />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/change-password" element={<PrivateRoute><ChangePassword /></PrivateRoute>} />

        <Route path="/samvad/appeal" element={<Appeal />} />
        <Route path="/samvad/appointment" element={<Appointment />} />
        <Route path="/samvad/grievance" element={<Grievance />} />
        <Route path="/samvad/complaints" element={<Complaints />} />

        <Route path="/leader/profile" element={<LeaderDetails />} />
        <Route path="/leader/personal-info" element={<PersonalInfo />} />
        <Route path="/leader/education" element={<EducationInfo />} />
        <Route path="/leader/permanent-address" element={<PermanentAddress />} />
        <Route path="/leader/present-address" element={<PresentAddress />} />
        <Route path="/leader/social-links" element={<SocialLinks />} />
        <Route path="/leader/timeline" element={<LeaderTimeline />} />

        <Route path="/leaderConstituen" element={<LeaderConstituency />} />

        <Route path="/mediacorner" element={<MediaCorner />}>
          <Route index element={<PressMeets />} />
          <Route path="press-meets" element={<PressMeets />} />
          <Route path="past-events" element={<PastEvents />} />
          <Route path="facebook" element={<Facebook />} />
          <Route path="instagram" element={<Instagram />} />
          <Route path="X" element={<X />} />
          <Route path="video" element={<Video />} />
        </Route>

        <Route path="/feedback" element={<Feedback />} />
        <Route path="ContactUS" element={<Contact />} />

        <Route path="*" element={<h2>404 Not Found</h2>} />
      </Routes>
    </div>
  );
}