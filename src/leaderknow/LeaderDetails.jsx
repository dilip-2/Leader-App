import { useEffect, useState, useRef } from "react";
import Cookies from "js-cookie";

import {
  createCoordinates,
  getCoordinates,
  updateCoordinates,
  deleteCoordinates,
  uploadLeaderImage,
  deleteLeaderImage,
} from "../api/leaderC";
import "./LeaderDetailsC.css";

export default function LeaderCoordinates() {
  const mobile = Cookies.get("leader_regd_mobile_no");
  const email = Cookies.get("email");

  const [coords, setCoords] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showImageMenu, setShowImageMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isEditingUrl, setIsEditingUrl] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const [form, setForm] = useState({
    title: "",
    member_name: "",
    party: "",
    constituency: "",
    state: "",
    email_id: "",
    digital_sansad_url: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  
  const fileInputRef = useRef(null);
  const imageMenuRef = useRef(null);
  const profileMenuRef = useRef(null);

  // Cleanup preview URL
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (imageMenuRef.current && !imageMenuRef.current.contains(event.target)) {
        setShowImageMenu(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch Coordinates
  const fetchCoordinates = async () => {
    try {
      setLoading(true);
      const res = await getCoordinates(mobile, email);
      
      let data = null;
      if (res?.data?.leader_coordinates) {
        data = res.data.leader_coordinates;
      } else if (res?.data) {
        data = res.data;
      }
      
      setCoords(data);
      if (data) {
        setForm({
          title: data.title || "",
          member_name: data.member_name || "",
          party: data.party || "",
          constituency: data.constituency || "",
          state: data.state || "",
          email_id: data.email_id || "",
          digital_sansad_url: data.digital_sansad_url || "",
        });
        setIsEditMode(false);
      }
    } catch (err) {
      console.error("Fetch coordinates error:", err);
      setError("Failed to load profile.");
      setTimeout(() => setError(""), 4000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCoordinates(); }, []);

  // Add New Profile
  const handleAddNewProfile = async () => {
    if (!form.member_name.trim()) {
      setError("❌ Please enter member name");
      setTimeout(() => setError(""), 3000);
      return;
    }
    setSaving(true);
    setError("");
    setSuccess("");
    
    const payload = {
      leader_regd_mobile_no: mobile,
      user_email_id: email,
      title: form.title || "",
      member_name: form.member_name || "",
      party: form.party || "",
      constituency: form.constituency || "",
      state: form.state || "",
      email_id: form.email_id || "",
      digital_sansad_url: form.digital_sansad_url || "",
    };

    try {
      const res = await createCoordinates(payload);
      if (res?.status === 200 || res?.status === 201 || res?.data) {
        setCoords(res.data || form);
        setSuccess("✅ New profile created successfully!");
        setIsEditMode(false);
        await fetchCoordinates();
      }
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      console.error("Create profile error:", err);
      if (err.response?.status === 409) {
        setError(`❌ Profile already exists for mobile: ${mobile}`);
        await fetchCoordinates();
      } else {
        setError(`❌ Failed to create: ${err.response?.data?.error || err.message}`);
      }
      setTimeout(() => setError(""), 4000);
    } finally {
      setSaving(false);
    }
  };

  // Update Profile
  const handleUpdateProfile = async () => {
    if (!form.member_name.trim()) {
      setError("❌ Please enter member name");
      setTimeout(() => setError(""), 3000);
      return;
    }
    setSaving(true);
    setShowProfileMenu(false);
    setIsEditingUrl(false);
    setError("");
    setSuccess("");
    
    const payload = {
      leader_regd_mobile_no: mobile,
      user_email_id: email,
      title: form.title || "",
      member_name: form.member_name || "",
      party: form.party || "",
      constituency: form.constituency || "",
      state: form.state || "",
      email_id: form.email_id || "",
      digital_sansad_url: form.digital_sansad_url || "",
    };

    try {
      const res = await updateCoordinates(payload);
      if (res?.status === 200 || res?.data) {
        const responseData = res.data?.leader_coordinates || res.data;
        setCoords(responseData || form);
        setSuccess("✅ Profile updated successfully!");
        setIsEditMode(false);
        await fetchCoordinates();
      }
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      console.error("Update profile error:", err);
      setError(`❌ Update failed: ${err.response?.data || err.message}`);
      setTimeout(() => setError(""), 4000);
    } finally {
      setSaving(false);
    }
  };

  // Upload Image
  const handleUploadImage = async () => {
    if (!imageFile) {
      setError("❌ Please select an image!");
      setTimeout(() => setError(""), 3000);
      return;
    }
    setUploadingImage(true);
    setError("");
    setSuccess("");
    try {
      const res = await uploadLeaderImage(mobile, email, imageFile);
      if (res?.status === 200 || res?.data) {
        setSuccess("✅ Image uploaded successfully!");
        if (preview) URL.revokeObjectURL(preview);
        setPreview("");
        setImageFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        await fetchCoordinates();
      }
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      console.error("Upload error:", err);
      setError(`❌ Upload failed: ${err.response?.data?.error || err.message}`);
      setTimeout(() => setError(""), 4000);
    } finally {
      setUploadingImage(false);
      setShowImageMenu(false);
    }
  };

  // Delete Image
  const handleDeleteImage = async () => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;
    setShowImageMenu(false);
    try {
      await deleteLeaderImage(mobile, email);
      if (preview) URL.revokeObjectURL(preview);
      setPreview("");
      setImageFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setSuccess("🗑️ Image deleted successfully!");
      await fetchCoordinates();
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      console.error("Delete image error:", err);
      setError("❌ Failed to delete image");
      setTimeout(() => setError(""), 4000);
    }
  };

  // Delete Profile
  const handleDeleteProfile = async () => {
    if (!window.confirm("⚠️ Delete this profile permanently? This cannot be undone.")) return;
    setShowProfileMenu(false);
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await deleteCoordinates(mobile, email);
      setCoords(null);
      if (preview) URL.revokeObjectURL(preview);
      setPreview("");
      setImageFile(null);
      setForm({ title: "", member_name: "", party: "", constituency: "", state: "", email_id: "", digital_sansad_url: "" });
      setIsEditMode(false);
      setSuccess("🗑️ Profile deleted successfully!");
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      console.error("Delete profile error:", err);
      let errorMessage = "❌ Failed to delete profile";
      if (err.response?.status === 400) {
        const backendMsg = err.response?.data?.message;
        if (backendMsg && backendMsg.includes("child records")) {
          errorMessage = "❌ Cannot delete: Related records exist. Delete those first.";
        } else {
          errorMessage = `❌ ${backendMsg || "Bad request"}`;
        }
      } else if (err.response?.status === 404) {
        errorMessage = "❌ Profile not found";
      } else if (err.response?.status === 401) {
        errorMessage = "❌ Unauthorized: Please login again";
      } else {
        errorMessage = `❌ ${err.response?.data?.message || err.message}`;
      }
      setError(errorMessage);
      setTimeout(() => setError(""), 6000);
    } finally {
      setSaving(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("❌ Image size should be less than 5MB");
        setTimeout(() => setError(""), 4000);
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError("❌ Please select a valid image file");
        setTimeout(() => setError(""), 4000);
        return;
      }
      if (preview) URL.revokeObjectURL(preview);
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
      setShowImageMenu(false);
    }
  };

  const handleAddImageClick = () => {
    fileInputRef.current?.click();
    setShowImageMenu(false);
  };

  const handleCancelImage = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview("");
    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleEditClick = () => {
    setIsEditMode(true);
    setShowProfileMenu(false);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setIsEditingUrl(false);
    if (coords) {
      setForm({
        title: coords.title || "",
        member_name: coords.member_name || "",
        party: coords.party || "",
        constituency: coords.constituency || "",
        state: coords.state || "",
        email_id: coords.email_id || "",
        digital_sansad_url: coords.digital_sansad_url || "",
      });
    } else {
      setForm({ title: "", member_name: "", party: "", constituency: "", state: "", email_id: "", digital_sansad_url: "" });
      setIsEditMode(false);
    }
  };

  const handleStartCreateProfile = () => {
    setForm({ title: "", member_name: "", party: "", constituency: "", state: "", email_id: "", digital_sansad_url: "" });
    setIsEditMode(true);
    setError("");
    setSuccess("");
  };

  if (loading) {
    return (
      <div className="ldr-loading-wrapper">
        <div className="ldr-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  const displayImage = preview || coords?.leader_photo || "";

  return (
    <div className="ldr-container">
      {/* 1. Header Card with Actions */}
      <div className="ldr-header-card">
        <div className="ldr-header-content">
          <div className="ldr-header-left">
            <div className="ldr-header-icon">👤</div>
            <div>
              <h1 className="ldr-header-title">Leader Profile</h1>
              <p className="ldr-header-subtitle">Manage your profile information</p>
            </div>
          </div>
          
          <div className="ldr-header-right">
            {!coords && !isEditMode ? (
              <button className="ldr-btn-primary" onClick={handleStartCreateProfile} disabled={saving}>
                <span className="ldr-btn-icon">➕</span> Add New Profile
              </button>
            ) : coords && !isEditMode ? (
              <div className="ldr-dropdown-wrapper" ref={profileMenuRef}>
                <button className="ldr-btn-menu" onClick={() => setShowProfileMenu(prev => !prev)} disabled={saving || uploadingImage}>
                  <span className="ldr-dots">⋮</span> Actions
                </button>
                {showProfileMenu && (
                  <div className="ldr-dropdown-menu">
                    <button className="ldr-dropdown-item" onClick={handleEditClick}>
                      ✏️ Edit Profile
                    </button>
                    <div className="ldr-dropdown-divider"></div>
                    <button className="ldr-dropdown-item ldr-danger" onClick={handleDeleteProfile}>
                      🗑️ Delete Profile
                    </button>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* 2. Alert Messages */}
      {error && <div className="ldr-alert ldr-alert-error">⚠️ {error} <button className="ldr-alert-close" onClick={() => setError("")}>×</button></div>}
      {success && <div className="ldr-alert ldr-alert-success">✅ {success} <button className="ldr-alert-close" onClick={() => setSuccess("")}>×</button></div>}

      {/* 3. Main Content Grid */}
      <div className="ldr-main-grid">
        
        {/* === LEFT COLUMN: IMAGE === */}
        <div className="ldr-image-card">
          <div className="ldr-image-container">
            {displayImage ? (
              <img src={displayImage} alt="Leader" className="ldr-profile-image" />
            ) : (
              <div className="ldr-image-placeholder">
                <div className="ldr-placeholder-icon">📷</div>
                <p>No Photo Uploaded</p>
              </div>
            )}
          </div>

          <div className="ldr-image-actions-wrapper" ref={imageMenuRef}>
            {coords && !preview && (
              <>
                <button className="ldr-btn-secondary ldr-full-width" onClick={() => setShowImageMenu(prev => !prev)} disabled={uploadingImage}>
                  ⚙️ Manage Photo
                </button>
                {showImageMenu && (
                  <div className="ldr-dropdown-menu ldr-centered-dropdown">
                    <button className="ldr-dropdown-item" onClick={handleAddImageClick}>📷 Upload Photo</button>
                    <button className="ldr-dropdown-item ldr-danger" onClick={handleDeleteImage}>🗑️ Remove Photo</button>
                  </div>
                )}
              </>
            )}
            {!coords && !preview && (
              <button className="ldr-btn-secondary ldr-full-width" onClick={handleAddImageClick} disabled={uploadingImage}>
                📷 Add Photo
              </button>
            )}
            
            <input type="file" accept="image/*" onChange={handleFileSelect} ref={fileInputRef} style={{ display: 'none' }} />

            {preview && (
              <div className="ldr-preview-actions">
                <button className="ldr-btn-primary ldr-half-width" onClick={handleUploadImage} disabled={uploadingImage}>
                  {uploadingImage ? "⏳ Saving..." : "💾 Save"}
                </button>
                <button className="ldr-btn-secondary ldr-half-width" onClick={handleCancelImage} disabled={uploadingImage}>
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* === RIGHT COLUMN: DETAILS FORM === */}
        <div className="ldr-details-card">
          <div className="ldr-card-header">
            <h2 className="ldr-card-title">📋 Profile Details</h2>
            
            {isEditMode && (
              <div className="ldr-edit-actions">
                <button className="ldr-btn-primary ldr-btn-sm" onClick={coords ? handleUpdateProfile : handleAddNewProfile} disabled={saving}>
                  {saving ? "⏳ Saving..." : coords ? "💾 Update" : "💾 Create"}
                </button>
                <button className="ldr-btn-secondary ldr-btn-sm" onClick={handleCancelEdit} disabled={saving}>
                  Cancel
                </button>
              </div>
            )}
          </div>

          {!coords && !isEditMode ? (
            <div className="ldr-empty-state">
              <div className="ldr-empty-icon">📭</div>
              <h3>No Profile Found</h3>
              <p>Create a new profile to get started with managing your leader information</p>
              <button className="ldr-btn-primary" onClick={handleStartCreateProfile}>
                ➕ Create New Profile
              </button>
            </div>
          ) : (
            <div className="ldr-form-grid">
              {[
                { label: "Full Name", key: "member_name", required: true },
                { label: "Title / Designation", key: "title" },
                { label: "Political Party", key: "party" },
                { label: "Constituency", key: "constituency" },
                { label: "State", key: "state" },
                { label: "Official Email", key: "email_id", type: "email" }
              ].map((field) => (
                <div className="ldr-form-group" key={field.key}>
                  <label className="ldr-form-label">
                    {field.label} {field.required && <span className="ldr-required">*</span>}
                  </label>
                  <input
                    type={field.type || "text"}
                    className={`ldr-form-input ${!isEditMode ? 'ldr-readonly' : ''}`}
                    value={form[field.key]}
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    disabled={!isEditMode || saving}
                  />
                </div>
              ))}

              {/* Special handling for URL */}
              <div className="ldr-form-group ldr-full-width">
                <label className="ldr-form-label">Digital Sansad URL</label>
                {isEditingUrl || isEditMode ? (
                  <input
                    type="url"
                    className={`ldr-form-input ${!isEditMode ? 'ldr-readonly' : ''}`}
                    value={form.digital_sansad_url}
                    placeholder="https://..."
                    onChange={(e) => setForm({ ...form, digital_sansad_url: e.target.value })}
                    onBlur={() => form.digital_sansad_url && !isEditMode && setIsEditingUrl(false)}
                    disabled={!isEditMode || saving}
                  />
                ) : form.digital_sansad_url ? (
                  <div className="ldr-url-display" onDoubleClick={() => !saving && setIsEditingUrl(true)}>
                    <a href={form.digital_sansad_url} target="_blank" rel="noopener noreferrer" className="ldr-url-link">
                      🔗 {form.digital_sansad_url}
                    </a>
                    <span className="ldr-url-hint">(Double click to edit)</span>
                  </div>
                ) : (
                  <div className="ldr-url-empty">
                    <span>No URL added</span>
                    <span className="ldr-url-hint">(Edit profile to add URL)</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}