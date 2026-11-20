// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { FaEye, FaEyeSlash, FaUserCog } from "react-icons/fa";
import { extractAppKeyFromToken, extractMobileFromToken } from "../utils/jwt";
import "./Login.css";

// ✅ .env se values (ab APP_KEY login request me nahi bhejenge)
const BASE_URL = import.meta.env.VITE_BASE_URL;
const DEFAULT_MOBILE = import.meta.env.VITE_LEADER_MOBILE;

// ✅ Leader Logo (Your requested image)
const LEADER_LOGO =
  "https://th.bing.com/th/id/OIP.CHYTXACXpOGrgaahX3bsmAHaHZ?r=0&o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3";

export default function Login() {
  const [form, setForm] = useState({
    leader_regd_mobile_no: DEFAULT_MOBILE,
    user_email_id: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log("🔐 Attempting login with:", form);

      const res = await axios.post(
        `${BASE_URL}/api/auth/adminlogin`,
        {
          leader_regd_mobile_no: form.leader_regd_mobile_no,
          user_email_id: form.user_email_id,
          password: form.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Login successful:", res.data);

      const { accessToken, refreshToken } = res.data;

      // ✅ Token ko decode karke uske andar se app key nikalo
      const decodedAppKey = extractAppKeyFromToken(accessToken);

      if (!decodedAppKey) {
        console.warn(
          "⚠️ Token me app key nahi mili — decodeJWT() ka output console me check karo aur field name confirm karo (utils/jwt.js)"
        );
      } else {
        console.log("✅ Token se app key decode hui:", decodedAppKey);
      }

      // ✅ NEW: Token ko decode karke uske andar se mobile number nikalo
      const decodedMobile = extractMobileFromToken(accessToken);

      if (!decodedMobile) {
        console.warn(
          "⚠️ Token me mobile number nahi mila — form wala mobile hi fallback ke roop me use hoga"
        );
      } else {
        console.log("✅ Token se mobile number decode hua:", decodedMobile);
      }

      // ✅ Final mobile number: token se mila to wahi use karo, warna form wala fallback
      const finalMobile = decodedMobile || form.leader_regd_mobile_no;

      // ✅ Cookies save
      Cookies.set("accessToken", accessToken, { expires: 1, path: "/", sameSite: "Lax" });
      Cookies.set("refreshToken", refreshToken, { expires: 7, path: "/", sameSite: "Lax" });
      Cookies.set("leader_regd_mobile_no", finalMobile, { expires: 7, path: "/", sameSite: "Lax" });
      Cookies.set("email", form.user_email_id, { expires: 7, path: "/", sameSite: "Lax" });

      // ✅ Token se decode hui app key ko save karo (baad ki APIs iska use karengi)
      if (decodedAppKey) {
        Cookies.set("decodedAppKey", decodedAppKey, { expires: 7, path: "/", sameSite: "Lax" });
      }

      console.log("✅ Mobile number saved in cookie:", finalMobile);
      console.log("✅ Email saved in cookie:", form.user_email_id);

      navigate("/home");
    } catch (err) {
      console.error("❌ Login error:", err);
      console.error("Response:", err.response?.data);
      setError(err.response?.data?.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      
      {/* LEFT SIDE: BRANDING & LEADER INFO */}
      <div className="login-left-panel">
        <div className="left-content">
          <div className="brand-logo-wrapper">
            <img src={LEADER_LOGO} alt="Leader Logo" className="brand-logo" />
          </div>
          <h1 className="brand-title">LeaderApp</h1>
          <h3 className="brand-subtitle">Your Constituency Management Portal</h3>
          
          <div className="brand-features">
            <div className="brand-feature-item">
              <span className="feature-icon">📊</span>
              <span>Manage Constituency & Stats</span>
            </div>
            <div className="brand-feature-item">
              <span className="feature-icon">🗳️</span>
              <span>Track Voter & Polling Data</span>
            </div>
            <div className="brand-feature-item">
              <span className="feature-icon">📢</span>
              <span>Media Corner & Announcements</span>
            </div>
            <div className="brand-feature-item">
              <span className="feature-icon">💬</span>
              <span>Samvad & Public Interaction</span>
            </div>
          </div>
          
          <div className="brand-footer">
            <FaUserCog /> Secure Admin Panel
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: LOGIN FORM */}
      <div className="login-right-panel">
        <div className="login-form-wrapper">
          <div className="login-header">
            <h2>Welcome Back!</h2>
            <p>Please enter your details to sign in.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="user_email_id"
                placeholder="leader@example.com"
                value={form.user_email_id}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Password</label>
              <div className="password-container">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <span
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            {error && <div className="login-error">{error}</div>}

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Authenticating..." : "Sign In"}
            </button>

            <div className="login-footer-links">
              <Link to="/forgot-password" className="forgot-link">
                Forgot Password?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}