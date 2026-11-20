import { useEffect, useState } from "react";
import Cookies from "js-cookie";

import { getSocial, createSocial, updateSocial, deleteSocial } from "../api/api";
import "./Social.css";

import { FaFacebook, FaInstagram, FaEllipsisV, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function SocialLinks() {
  const mobileNumber = Cookies.get("leader_regd_mobile_no");
  const email = Cookies.get("email");

  const [social, setSocial] = useState(null);
  const [formData, setFormData] = useState({ facebook: "", twitter: "", instagram: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSocial();
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowMenu(false);
    if (showMenu) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [showMenu]);

  const loadSocial = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getSocial(mobileNumber, email);
      const data = res.data.social_media || null;

      setSocial(data);
      setFormData({
        facebook: data?.facebook || "",
        twitter: data?.twitter || "",
        instagram: data?.instagram || "",
      });
    } catch (err) {
      console.error("Fetch error:", err);
      if (err.response?.status !== 404) {
        setError("Unable to fetch social links");
        setTimeout(() => setError(""), 4000);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    if (!formData.facebook && !formData.twitter && !formData.instagram) {
      setError("❌ Please add at least one social link");
      setTimeout(() => setError(""), 3000);
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        leader_regd_mobile_no: mobileNumber,
        user_email_id: email,
        social_media: { ...formData },
      };

      const res = social
        ? await updateSocial(payload)
        : await createSocial(payload);

      setSocial(res.data.social_media);
      setIsEditing(false);
      setSuccess(social ? "✅ Social links updated successfully!" : "✅ Social links created successfully!");
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      console.error("Save error:", err);
      setError(`❌ Save failed: ${err.response?.data?.message || err.message}`);
      setTimeout(() => setError(""), 4000);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setShowMenu(false);
  };

  const handleDelete = async () => {
    setShowMenu(false);
    if (!window.confirm("⚠️ Delete all social links permanently? This cannot be undone.")) return;
    
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await deleteSocial(mobileNumber, email);
      setSocial(null);
      setFormData({ facebook: "", twitter: "", instagram: "" });
      setIsEditing(false);
      setSuccess("🗑️ Social links deleted successfully!");
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      console.error("Delete error:", err);
      setError(`❌ Delete failed: ${err.response?.data?.message || err.message}`);
      setTimeout(() => setError(""), 4000);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (social) {
      setFormData({
        facebook: social.facebook || "",
        twitter: social.twitter || "",
        instagram: social.instagram || "",
      });
    } else {
      setFormData({ facebook: "", twitter: "", instagram: "" });
    }
    setIsEditing(false);
    setError("");
  };

  const toggleMenu = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const formatUrl = (url) => {
    if (!url) return "#";
    return url.startsWith("http") ? url : `https://${url}`;
  };

  if (loading && !social && !isEditing) {
    return (
      <div className="soc-loading-wrapper">
        <div className="soc-spinner"></div>
        <p>Loading social links...</p>
      </div>
    );
  }

  return (
    <div className="soc-container">
      {/* 1. Header Card */}
      <div className="soc-header-card">
        <div className="soc-header-content">
          <div className="soc-header-left">
            <div className="soc-header-icon">🌐</div>
            <div>
              <h1 className="soc-header-title">Social Media Links</h1>
              <p className="soc-header-subtitle">Manage your social media presence</p>
            </div>
          </div>
          
          <div className="soc-header-right">
            {!social && !isEditing ? (
              <button className="soc-btn-primary" onClick={() => setIsEditing(true)} disabled={loading}>
                <span className="soc-btn-icon">➕</span> Add Social Links
              </button>
            ) : social && !isEditing && (
              <div className="soc-dropdown-wrapper">
                <button className="soc-btn-menu" onClick={toggleMenu} disabled={loading}>
                  <span className="soc-dots">⋮</span> Actions
                </button>
                {showMenu && (
                  <div className="soc-dropdown-menu">
                    <button className="soc-dropdown-item" onClick={handleEdit}>
                      ✏️ Edit Links
                    </button>
                    <div className="soc-dropdown-divider"></div>
                    <button className="soc-dropdown-item soc-danger" onClick={handleDelete}>
                      🗑️ Delete Links
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Alert Messages */}
      {error && <div className="soc-alert soc-alert-error">⚠️ {error} <button className="soc-alert-close" onClick={() => setError("")}>×</button></div>}
      {success && <div className="soc-alert soc-alert-success">✅ {success} <button className="soc-alert-close" onClick={() => setSuccess("")}>×</button></div>}

      {/* 3. User Info Banner */}
      <div className="soc-profile-card">
        <div className="soc-profile-content">
          <div className="soc-profile-item">
            <span className="soc-profile-icon">📧</span>
            <span className="soc-profile-label">Email</span>
            <span className="soc-profile-value">{email}</span>
          </div>
          <div className="soc-profile-divider"></div>
          <div className="soc-profile-item">
            <span className="soc-profile-icon">📱</span>
            <span className="soc-profile-label">Mobile</span>
            <span className="soc-profile-value">{mobileNumber}</span>
          </div>
        </div>
      </div>

      {/* 4. Main Content */}
      {!social && !isEditing ? (
        <div className="soc-empty-state">
          <div className="soc-empty-icon">🌐</div>
          <h3>No Social Links</h3>
          <p>Add your social media links to connect with your audience</p>
          <button className="soc-btn-primary" onClick={() => setIsEditing(true)}>
            ➕ Add Social Links
          </button>
        </div>
      ) : (
        <>
          {/* View Mode */}
          {social && !isEditing && (
            <div className="soc-links-card">
              <div className="soc-card-header">
                <h2 className="soc-card-title">🔗 Your Social Links</h2>
              </div>

              <div className="soc-links-grid">
                {social.facebook && (
                  <a className="soc-link-item soc-facebook" href={formatUrl(social.facebook)} target="_blank" rel="noopener noreferrer">
                    <div className="soc-link-icon-wrapper"><FaFacebook className="soc-link-icon" /></div>
                    <div className="soc-link-content">
                      <span className="soc-link-label">Facebook</span>
                      <span className="soc-link-url">{social.facebook}</span>
                    </div>
                  </a>
                )}

                {social.twitter && (
                  <a className="soc-link-item soc-twitter" href={formatUrl(social.twitter)} target="_blank" rel="noopener noreferrer">
                    <div className="soc-link-icon-wrapper"><FaXTwitter className="soc-link-icon" /></div>
                    <div className="soc-link-content">
                      <span className="soc-link-label">Twitter / X</span>
                      <span className="soc-link-url">{social.twitter}</span>
                    </div>
                  </a>
                )}

                {social.instagram && (
                  <a className="soc-link-item soc-instagram" href={formatUrl(social.instagram)} target="_blank" rel="noopener noreferrer">
                    <div className="soc-link-icon-wrapper"><FaInstagram className="soc-link-icon" /></div>
                    <div className="soc-link-content">
                      <span className="soc-link-label">Instagram</span>
                      <span className="soc-link-url">{social.instagram}</span>
                    </div>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Edit Mode */}
          {isEditing && (
            <>
              <div className="soc-edit-actions-bar">
                <button className="soc-btn-primary" onClick={handleSave} disabled={loading}>
                  {loading ? "⏳ Saving..." : social ? "💾 Update Links" : "💾 Create Links"}
                </button>
                <button className="soc-btn-secondary" onClick={handleCancel} disabled={loading}>
                  ❌ Cancel
                </button>
              </div>

              <div className="soc-form-card">
                <div className="soc-card-header">
                  <h2 className="soc-card-title">📝 {social ? "Update" : "Add"} Social Media Links</h2>
                  <p className="soc-form-hint">Enter full URLs or usernames (e.g., https://facebook.com/username)</p>
                </div>

                <div className="soc-form-grid">
                  <div className="soc-form-group">
                    <label className="soc-form-label"><FaFacebook className="soc-form-icon" /> Facebook</label>
                    <input className="soc-form-input" placeholder="https://facebook.com/username or @username" value={formData.facebook} onChange={(e) => handleInputChange("facebook", e.target.value)} disabled={loading} />
                  </div>
                  <div className="soc-form-group">
                    <label className="soc-form-label"><FaXTwitter className="soc-form-icon" /> Twitter / X</label>
                    <input className="soc-form-input" placeholder="https://twitter.com/username or @username" value={formData.twitter} onChange={(e) => handleInputChange("twitter", e.target.value)} disabled={loading} />
                  </div>
                  <div className="soc-form-group">
                    <label className="soc-form-label"><FaInstagram className="soc-form-icon" /> Instagram</label>
                    <input className="soc-form-input" placeholder="https://instagram.com/username or @username" value={formData.instagram} onChange={(e) => handleInputChange("instagram", e.target.value)} disabled={loading} />
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}