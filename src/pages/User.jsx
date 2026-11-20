import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import {
  createCoordinates,
  getCoordinates,
  updateCoordinates,
  deleteCoordinates,
  uploadLeaderImage,
  getLeaderImage,
  deleteLeaderImage,
} from "../api/leaderC";

export default function LeaderCoordinates() {
  // ✅ Cookies se mobile aur email lo (hardcoded nahi)
  const mobile = Cookies.get("leader_regd_mobile_no") || import.meta.env.VITE_LEADER_MOBILE;
  const email = Cookies.get("email") || "";

  const [coords, setCoords] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    title: "",
    member_name: "",
    party: "",
    constituency: "",
    state: "",
    email_id: "",
    member_photo: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  // ✅ Fetch Coordinates Data
  const fetchCoordinates = async () => {
    try {
      setLoading(true);
      const res = await getCoordinates(mobile, email);
      const data = res?.data?.leader_coordinates || null;
      setCoords(data);
      if (data) {
        setForm({
          title: data.title || "",
          member_name: data.member_name || "",
          party: data.party || "",
          constituency: data.constituency || "",
          state: data.state || "",
          email_id: data.email_id || "",
          member_photo: data.member_photo || "",
        });
      }
    } catch (err) {
      console.error("❌ Fetch Error:", err.response?.data || err);
      setError("Failed to load coordinates.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch Leader Image
  const fetchImage = async () => {
    try {
      const res = await getLeaderImage(mobile, email);
      const url =
        res?.data?.leader_coordinates?.member_photo ||
        res?.data?.leader_image_url ||
        "";
      if (url) setImageUrl(url);
    } catch (err) {
      console.error("❌ Image Fetch Error:", err.response?.data || err);
    }
  };

  useEffect(() => {
    fetchCoordinates();
    fetchImage();
  }, []);

  // ✅ Save or Update
  const handleSave = async () => {
    const payload = {
      leader_regd_mobile_no: mobile,
      user_email_id: email,
      leader_coordinates: form,
    };

    try {
      const res = coords
        ? await updateCoordinates(payload)
        : await createCoordinates(payload);

      setCoords(res.data?.leader_coordinates || payload.leader_coordinates);
      setSuccess(coords ? "✅ Profile updated successfully!" : "✅ Profile created successfully!");
      setIsEditing(false);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("❌ Save Error:", err.response?.data || err);
      setError("❌ Failed to save profile information.");
      setTimeout(() => setError(""), 3000);
    }
  };

  // ✅ Delete Coordinates
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this leader profile?")) return;
    try {
      await deleteCoordinates(mobile, email);
      setCoords(null);
      setForm({
        title: "",
        member_name: "",
        party: "",
        constituency: "",
        state: "",
        email_id: "",
        member_photo: "",
      });
      setSuccess("🗑️ Profile deleted successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("❌ Delete Error:", err.response?.data || err);
      setError("❌ Failed to delete profile.");
      setTimeout(() => setError(""), 3000);
    }
  };

  // ✅ Upload Leader Image
  const handleUploadImage = async () => {
    if (!imageFile) {
      setError("❌ Please select an image file!");
      setTimeout(() => setError(""), 3000);
      return;
    }
    try {
      const res = await uploadLeaderImage(mobile, email, imageFile);
      const newUrl =
        res?.data?.leader_image ||
        res?.data?.leader_coordinates?.member_photo ||
        URL.createObjectURL(imageFile);
      setImageUrl(newUrl);
      setSuccess("✅ Image uploaded successfully!");
      setPreview("");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("❌ Upload Error:", err.response?.data || err);
      setError("❌ Failed to upload image.");
      setTimeout(() => setError(""), 3000);
    }
  };

  // ✅ Delete Leader Image
  const handleDeleteImage = async () => {
    try {
      await deleteLeaderImage(mobile, email);
      setImageUrl("");
      setPreview("");
      setSuccess("🗑️ Image deleted successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("❌ Delete Image Error:", err.response?.data || err);
      setError("❌ Failed to delete image.");
      setTimeout(() => setError(""), 3000);
    }
  };

  // ✅ Cookie missing check
  if (!mobile || !email) {
    return (
      <div className="leader-error">
        ❌ Session expired. Please <a href="/login">login again</a>.
      </div>
    );
  }

  if (loading) return <div className="leader-loading">Loading leader profile...</div>;

  return (
    // ... baaki JSX bilkul same rahega
    <div className="leader-page-container">
      <div className="leader-overlay">
        <div className="leader-header">
          <h1 className="leader-title">Leader Profile</h1>
          <div className="leader-subtitle">
            Political Representative Information System
          </div>
        </div>

        {error && <div className="leader-error">{error}</div>}
        {success && <div className="leader-success">{success}</div>}

        <div className="leader-content">
          <div className="leader-sidebar">
            <h3>📍 Contact Info</h3>
            <div className="contact-item">
              <strong>Email:</strong>{" "}
              <a href={`mailto:${coords?.email_id || email}`}>
                {coords?.email_id || email}
              </a>
            </div>
            <div className="contact-item">
              <strong>Mobile:</strong> {mobile}
            </div>
            {coords?.constituency && (
              <div className="contact-item">
                <strong>Constituency:</strong> {coords.constituency}
              </div>
            )}
            {coords?.state && (
              <div className="contact-item">
                <strong>State:</strong> {coords.state}
              </div>
            )}
          </div>

          <div className="leader-main">
            <div className="profile-with-image">
              <div className="leader-image-section">
                <div className="leader-image-container">
                  {preview || imageUrl ? (
                    <img
                      src={preview || imageUrl}
                      alt="Leader Portrait"
                      className="leader-profile-image"
                    />
                  ) : (
                    <div className="leader-image-placeholder">
                      <span className="placeholder-icon">👤</span>
                      <span className="placeholder-text">No Image</span>
                    </div>
                  )}
                </div>

                <div className="image-action-buttons">
                  <label htmlFor="leaderImageUpload" className="image-upload-label">
                    <span className="upload-icon">📷</span>
                    Upload Photo
                  </label>
                  <input
                    id="leaderImageUpload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setImageFile(file);
                        setPreview(URL.createObjectURL(file));
                      }
                    }}
                    style={{ display: "none" }}
                  />

                  {(preview || imageUrl) && (
                    <button className="btn-remove-image" onClick={handleDeleteImage}>
                      <span className="remove-icon">🗑️</span>
                      Remove
                    </button>
                  )}
                </div>

                {preview && !imageUrl && (
                  <button
                    className="btn-academic btn-primary"
                    onClick={handleUploadImage}
                    style={{ marginTop: "10px" }}
                  >
                    💾 Save Image
                  </button>
                )}
              </div>

              <div className="profile-info-section">
                <h2>Political Profile Information</h2>
                <p className="profile-description">
                  Manage and update your political profile details and public information.
                </p>

                {isEditing ? (
                  <div className="form-container">
                    <div className="form-row">
                      <div className="form-group">
                        <label>Title</label>
                        <input
                          type="text"
                          value={form.title}
                          onChange={(e) => setForm({ ...form, title: e.target.value })}
                          placeholder="e.g., Honorable Member"
                        />
                      </div>
                      <div className="form-group">
                        <label>Full Name</label>
                        <input
                          type="text"
                          value={form.member_name}
                          onChange={(e) => setForm({ ...form, member_name: e.target.value })}
                          placeholder="Enter full name"
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Political Party</label>
                        <input
                          type="text"
                          value={form.party}
                          onChange={(e) => setForm({ ...form, party: e.target.value })}
                          placeholder="Party affiliation"
                        />
                      </div>
                      <div className="form-group">
                        <label>State</label>
                        <input
                          type="text"
                          value={form.state}
                          onChange={(e) => setForm({ ...form, state: e.target.value })}
                          placeholder="State/Region"
                        />
                      </div>
                    </div>

                    <div className="form-group full-width">
                      <label>Constituency</label>
                      <input
                        type="text"
                        value={form.constituency}
                        onChange={(e) => setForm({ ...form, constituency: e.target.value })}
                        placeholder="Constituency name"
                      />
                    </div>

                    <div className="form-group full-width">
                      <label>Official Email</label>
                      <input
                        type="email"
                        value={form.email_id}
                        onChange={(e) => setForm({ ...form, email_id: e.target.value })}
                        placeholder="official@email.com"
                      />
                    </div>

                    <div className="form-buttons">
                      <button className="btn-academic btn-primary" onClick={handleSave}>
                        {coords ? "🔄 Update Profile" : "💾 Create Profile"}
                      </button>
                      <button className="btn-academic btn-secondary" onClick={() => setIsEditing(false)}>
                        ❌ Cancel
                      </button>
                    </div>
                  </div>
                ) : coords ? (
                  <div className="profile-details-container">
                    <div className="info-grid">
                      <div className="info-item">
                        <span className="info-label">Title</span>
                        <span className="info-value">{coords.title}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Full Name</span>
                        <span className="info-value">{coords.member_name}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Political Party</span>
                        <span className="info-value">{coords.party}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Constituency</span>
                        <span className="info-value">{coords.constituency}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">State</span>
                        <span className="info-value">{coords.state}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Official Email</span>
                        <span className="info-value">{coords.email_id}</span>
                      </div>
                    </div>

                    <div className="card-buttons">
                      <button className="btn-academic btn-primary" onClick={() => setIsEditing(true)}>
                        ✏️ Edit Profile
                      </button>
                      <button className="btn-academic btn-danger" onClick={handleDelete}>
                        🗑️ Delete Profile
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="empty-state">
                    <p>No profile information found.</p>
                    <button className="btn-academic btn-primary" onClick={() => setIsEditing(true)}>
                      🏛️ Create Political Profile
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="leader-footer">
          <p>© 2025 Political Profile System. Transparency through technology.</p>
        </div>
      </div>
    </div>
  );
}