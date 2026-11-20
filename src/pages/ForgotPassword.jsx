// src/pages/ForgotPassword.jsx (Mobile from Cookie - Hidden Field)
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {
  verifyEmail,
  sendEmailOTP,
  verifyEmailOTP,
  resetPassword,
} from "../api/ForgotPassword";
import "./ForgotPassword.css";

// ✅ Leader Logo (Your requested image)
const LEADER_LOGO =
  "https://th.bing.com/th/id/OIP.CHYTXACXpOGrgaahX3bsmAHaHZ?r=0&o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3";

export default function ForgotPassword() {
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ✅ Load mobile number from cookie on component mount
  useEffect(() => {
    const savedMobile = Cookies.get("leader_regd_mobile_no");
    
    if (savedMobile) {
      setMobile(savedMobile);
      console.log("✅ Mobile loaded from cookie:", savedMobile);
    } else {
      console.warn("⚠️ No mobile number found in cookies");
    }
  }, []);

  // STEP 1: Verify Email (Mobile from cookie - hidden)
  const handleVerifyEmail = async () => {
    if (!email) {
      return setMessage("❌ Email required!");
    }

    if (!mobile) {
      return setMessage("❌ Session expired. Please login first to use this feature.");
    }
    
    setLoading(true);
    setMessage("🔍 Checking details...");

    const result = await verifyEmail(email, mobile);
    
    if (!result.success) {
      setLoading(false);
      return setMessage(`❌ ${result.message}`);
    }

    const otpResult = await sendEmailOTP(email, mobile);
    setLoading(false);
    
    if (!otpResult.success) {
      return setMessage(`❌ ${otpResult.message}`);
    }

    setMessage("✅ OTP Sent to your email!");
    setTimeout(() => setStep(2), 1000);
  };

  // STEP 2: Verify OTP
  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      return setMessage("❌ Enter valid 6-digit OTP!");
    }
    
    setLoading(true);
    setMessage("🔍 Verifying OTP...");

    const result = await verifyEmailOTP(email, mobile, otp);
    setLoading(false);
    
    if (!result.success) {
      return setMessage(`❌ ${result.message}`);
    }

    setMessage("✅ OTP Verified! Set new password.");
    setTimeout(() => setStep(3), 1000);
  };

  // STEP 3: Reset Password
  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      return setMessage("❌ Enter both password fields!");
    }
    
    if (newPassword.length < 6) {
      return setMessage("❌ Password must be at least 6 characters!");
    }
    
    if (newPassword !== confirmPassword) {
      return setMessage("❌ Passwords do not match!");
    }

    setLoading(true);
    setMessage("🔄 Updating password...");

    const result = await resetPassword(email, mobile, newPassword);
    setLoading(false);
    
    if (!result.success) {
      return setMessage(`❌ ${result.message}`);
    }

    setMessage("✅ Password updated successfully!");
    
    setTimeout(() => {
      navigate("/login");
    }, 2000);
  };

  // Resend OTP
  const handleResendOTP = async () => {
    setLoading(true);
    setMessage("📤 Resending OTP...");
    
    const result = await sendEmailOTP(email, mobile);
    setLoading(false);
    
    if (!result.success) {
      return setMessage(`❌ ${result.message}`);
    }
    
    setMessage("✅ OTP resent to your email!");
  };

  return (
    <div className="fp-container">
      
      {/* LEFT SIDE: BRANDING (Same as Login) */}
      <div className="fp-left-panel">
        <div className="fp-left-content">
          <div className="fp-brand-logo-wrapper">
            <img src={LEADER_LOGO} alt="Leader Logo" className="fp-brand-logo" />
          </div>
          <h1 className="fp-brand-title">LeaderApp</h1>
          <h3 className="fp-brand-subtitle">Your Constituency Management Portal</h3>
          
          <div className="fp-brand-features">
            <div className="fp-brand-feature-item">
              <span className="fp-feature-icon">🔐</span>
              <span>Secure Password Reset</span>
            </div>
            <div className="fp-brand-feature-item">
              <span className="fp-feature-icon">📧</span>
              <span>Email OTP Verification</span>
            </div>
            <div className="fp-brand-feature-item">
              <span className="fp-feature-icon">🛡️</span>
              <span>Protected Admin Access</span>
            </div>
          </div>
          
          <div className="fp-brand-footer">
            <span>🛡️</span> Secure Admin Panel
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: FORM */}
      <div className="fp-right-panel">
        <div className="fp-form-wrapper">
          <div className="fp-header">
            <h2>Forgot Password?</h2>
            <p>
              {step === 1 && "Enter your email to get started"}
              {step === 2 && "We've sent a code to your email"}
              {step === 3 && "Create a strong new password"}
            </p>
          </div>

          {/* Progress Steps */}
          <div className="fp-progress">
            {[1, 2, 3].map((s) => (
              <div key={s} className="fp-progress-item">
                <div className={`fp-step ${step >= s ? 'active' : ''}`}>
                  {step > s ? '✓' : s}
                </div>
                {s < 3 && <div className={`fp-line ${step > s ? 'active' : ''}`} />}
              </div>
            ))}
          </div>

          {/* Message Alert */}
          {message && (
            <div className={`fp-message ${message.includes("❌") || message.includes("⚠️") ? "fp-error" : "fp-success"}`}>
              {message}
            </div>
          )}

          {/* Hidden Mobile Field (From Cookie) */}
          <input type="hidden" value={mobile} />

          {/* STEP 1: Email */}
          {step === 1 && (
            <div className="fp-form">
              <div className="fp-input-group">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="leader@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="fp-input"
                />
              </div>

              <button 
                className={`fp-btn fp-btn-primary ${loading ? 'loading' : ''}`}
                onClick={handleVerifyEmail}
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify Email"}
              </button>

              <button 
                className="fp-btn fp-btn-secondary"
                onClick={() => navigate("/login")}
              >
                ← Back to Login
              </button>
            </div>
          )}

          {/* STEP 2: OTP */}
          {step === 2 && (
            <div className="fp-form">
              <div className="fp-info-text">
                OTP sent to: <strong>{email}</strong>
              </div>

              <div className="fp-input-group">
                <label>Enter OTP</label>
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  maxLength="6"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  disabled={loading}
                  className="fp-input fp-otp-input"
                />
              </div>

              <button 
                className={`fp-btn fp-btn-primary ${loading ? 'loading' : ''}`}
                onClick={handleVerifyOTP}
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>

              <button 
                className="fp-btn fp-btn-secondary"
                onClick={handleResendOTP}
                disabled={loading}
              >
                🔄 Resend OTP
              </button>
            </div>
          )}

          {/* STEP 3: New Password */}
          {step === 3 && (
            <div className="fp-form">
              <div className="fp-input-group">
                <label>New Password</label>
                <div className="fp-password-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password (min 6 chars)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={loading}
                    className="fp-input"
                  />
                  <span 
                    className="fp-password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>

              <div className="fp-input-group">
                <label>Confirm Password</label>
                <div className="fp-password-container">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                    className="fp-input"
                  />
                  <span 
                    className="fp-password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>

              <button 
                className={`fp-btn fp-btn-primary ${loading ? 'loading' : ''}`}
                onClick={handleResetPassword}
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}