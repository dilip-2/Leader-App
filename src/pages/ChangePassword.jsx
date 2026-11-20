import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import "./ChangePassword.css";

export default function ChangePassword() {
  const [form, setForm] = useState({
    leader_regd_mobile_no: "",
    user_email_id: "",
    opassword: "",
    npassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, text: "", color: "" });

  useEffect(() => {
    // Load data from cookies
    const mobile = Cookies.get("leader_regd_mobile_no") || "7702000725";
    const email = Cookies.get("email") || "";
    
    setForm(prev => ({
      ...prev,
      leader_regd_mobile_no: mobile,
      user_email_id: email
    }));
  }, []);

  const checkPasswordStrength = (password) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    const levels = [
      { score: 0, text: "Too weak", color: "#e74c3c" },
      { score: 1, text: "Weak", color: "#e67e22" },
      { score: 2, text: "Fair", color: "#f39c12" },
      { score: 3, text: "Good", color: "#3498db" },
      { score: 4, text: "Strong", color: "#2ecc71" },
      { score: 5, text: "Very Strong", color: "#27ae60" }
    ];

    return levels[score] || levels[0];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setError("");
    setSuccess("");

    if (name === "npassword") {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation checks
    if (!form.user_email_id) {
      setError("Email is required");
      return;
    }

    if (!form.opassword) {
      setError("Please enter your current password");
      return;
    }

    if (form.npassword !== form.confirmPassword) {
      setError("New password and confirm password do not match");
      return;
    }

    if (form.npassword.length < 6) {
      setError("New password must be at least 6 characters long");
      return;
    }

    if (form.opassword === form.npassword) {
      setError("New password must be different from old password");
      return;
    }

    setLoading(true);

    try {
      const getCookie = (name) => {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
          const [key, value] = cookie.trim().split('=');
          if (key === name) {
            return decodeURIComponent(value);
          }
        }
        return null;
      };

      const APP_KEY = getCookie("appKey") || "7d993218545c7a0223754218a27e0c5ac052111a5181ef9df303420408a610d0";
      const ACCESS_TOKEN = getCookie("accessToken");

      console.log("🔑 App Key:", APP_KEY ? "Found" : "Not Found");
      console.log("🎫 Access Token:", ACCESS_TOKEN ? "Found" : "Not Found");
      console.log("📧 Email:", form.user_email_id);
      console.log("📱 Mobile:", form.leader_regd_mobile_no);

      if (!ACCESS_TOKEN) {
        setError("Session expired. Please login again.");
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
        return;
      }

      const response = await fetch("/api/profile/cp", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-app-key": APP_KEY,
          "Authorization": `Bearer ${ACCESS_TOKEN}`
        },
        body: JSON.stringify({
          leader_regd_mobile_no: form.leader_regd_mobile_no,
          user_email_id: form.user_email_id,
          opassword: form.opassword,
          npassword: form.npassword,
        }),
      });

      const data = await response.json();
      console.log("📩 Response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Password change failed");
      }

      console.log("✅ Password changed successfully!");
      
      setSuccess("✅ Password changed successfully! Redirecting to login page...");

      setTimeout(() => {
        Cookies.remove('appKey', { path: '/' });
        Cookies.remove('accessToken', { path: '/' });
        Cookies.remove('refreshToken', { path: '/' });
        Cookies.remove('leader_regd_mobile_no', { path: '/' });
        Cookies.remove('email', { path: '/' });
        
        window.location.href = "/";
      }, 3000);

    } catch (err) {
      console.error("❌ Password change error:", err);
      setError(err.message || "Failed to change password. Please check your current password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-password-container">
      <div className="change-password-card">
        <div className="card-content">
          <div className="header-section">
            <div className="icon-circle">🔐</div>
            <h2 className="title">Change Password</h2>
            <p className="subtitle">Create a strong new password for your account</p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">📧 Email Address</label>
              <input
                type="email"
                name="user_email_id"
                placeholder="Enter your email"
                value={form.user_email_id}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">🔒 Current Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showOldPassword ? "text" : "password"}
                  name="opassword"
                  placeholder="Enter current password"
                  value={form.opassword}
                  onChange={handleChange}
                  required
                  className="form-input password-input"
                />
                <span
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className="password-toggle"
                >
                  {showOldPassword ? "👁️" : "👁️‍🗨️"}
                </span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">🆕 New Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="npassword"
                  placeholder="Enter new password (min 6 chars)"
                  value={form.npassword}
                  onChange={handleChange}
                  required
                  className="form-input password-input"
                />
                <span
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="password-toggle"
                >
                  {showNewPassword ? "👁️" : "👁️‍🗨️"}
                </span>
              </div>
              {form.npassword && (
                <div className="password-strength">
                  <div className="strength-bar-container">
                    <div 
                      className="strength-bar"
                      style={{
                        width: `${(passwordStrength.score / 5) * 100}%`,
                        background: passwordStrength.color
                      }}
                    />
                  </div>
                  <span style={{ color: passwordStrength.color }}>{passwordStrength.text}</span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">✅ Confirm New Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm new password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                  className={`form-input password-input ${form.confirmPassword && form.npassword === form.confirmPassword ? 'match' : ''}`}
                />
                <span
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="password-toggle"
                >
                  {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                </span>
              </div>
              {form.confirmPassword && (
                <div className={`password-match ${form.npassword === form.confirmPassword ? 'valid' : 'invalid'}`}>
                  {form.npassword === form.confirmPassword ? 
                    <>✅ Passwords match</> : 
                    <>❌ Passwords don't match</>
                  }
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`submit-button ${loading ? 'loading' : ''}`}
            >
              {loading ? "🔄 Changing Password..." : "🔐 CHANGE PASSWORD"}
            </button>
          </form>

          {error && (
            <div className="alert alert-error">
              ❌ {error}
            </div>
          )}
          
          {success && (
            <div className="alert alert-success">
              <div className="success-icon">
                ✅
              </div>
              {success}
            </div>
          )}

          <div className="password-tips">
            <strong>💡 Password Tips:</strong>
            <ul>
              <li>Use at least 8 characters</li>
              <li>Mix uppercase and lowercase letters</li>
              {/* <li>Include numbers and symbols</li>
              <li>Avoid common words or patterns</li> */}
            </ul>
          </div>

          <p className="back-link">
            <a href="/">← Back to Login</a>
          </p>
        </div>
      </div>
    </div>
  );
}