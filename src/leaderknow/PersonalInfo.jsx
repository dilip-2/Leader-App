import { useEffect, useState, useRef } from "react";
import Cookies from "js-cookie";

import {
  getPersonalInfo,
  createPersonalInfo,
  updatePersonalInfo,
  deletePersonalInfo,
} from "../api/apipersonal";
import "./PSN.css";

export default function PersonalInfo() {
  const mobileNumber = Cookies.get("leader_regd_mobile_no");
  const emailId = Cookies.get("email");

  const [personal, setPersonal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const [form, setForm] = useState({
    dob: "",
    birth_place: "",
    father_name: "",
    mother_name: "",
    profession: "",
  });

  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch Personal Info
  const fetchPersonalInfo = async () => {
    try {
      setLoading(true);
      const res = await getPersonalInfo(mobileNumber, emailId);
      console.log("📥 Personal info response:", res?.data);
      
      const data = res.data?.personal_details || res.data?.data || res.data || null;

      if (data) {
        setPersonal(data);
        setForm({
          dob: data.dob || "",
          birth_place: data.birth_place || "",
          father_name: data.father_name || "",
          mother_name: data.mother_name || "",
          profession: data.profession || "",
        });
      }
    } catch (err) {
      console.error("Fetch Error:", err.response?.data || err);
      if (err.response?.status !== 404) {
        setError("Failed to load personal information");
        setTimeout(() => setError(""), 4000);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPersonalInfo();
  }, []);

  // Create New Personal Info
  const handleCreate = async () => {
    if (!form.dob && !form.birth_place && !form.profession) {
      setError("❌ Please fill at least one field");
      setTimeout(() => setError(""), 3000);
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    const payload = {
      leader_regd_mobile_no: mobileNumber,
      user_email_id: emailId,
      dob: form.dob || "",
      birth_place: form.birth_place || "",
      father_name: form.father_name || "",
      mother_name: form.mother_name || "",
      profession: form.profession || "",
    };

    console.log("📤 Creating personal info:", payload);

    try {
      const res = await createPersonalInfo(payload);

      if (res?.status === 200 || res?.status === 201 || res?.data) {
        setPersonal(res.data?.personal_details || res.data || form);
        setSuccess("✅ Personal information created successfully!");
        setIsEditMode(false);
        await fetchPersonalInfo();
      }
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      console.error("Create Error:", err);
      setError(`❌ Failed to create: ${err.response?.data?.error || err.message}`);
      setTimeout(() => setError(""), 4000);
    } finally {
      setSaving(false);
    }
  };

  // Update Personal Info
  const handleUpdate = async () => {
    if (!form.dob && !form.birth_place && !form.profession) {
      setError("❌ Please fill at least one field");
      setTimeout(() => setError(""), 3000);
      return;
    }

    setSaving(true);
    setShowDropdown(false);
    setError("");
    setSuccess("");

    const payload = {
      leader_regd_mobile_no: mobileNumber,
      user_email_id: emailId,
      dob: form.dob || "",
      birth_place: form.birth_place || "",
      father_name: form.father_name || "",
      mother_name: form.mother_name || "",
      profession: form.profession || "",
    };

    console.log("📤 Updating personal info:", payload);

    try {
      const res = await updatePersonalInfo(payload);

      if (res?.status === 200 || res?.data) {
        setPersonal(res.data?.personal_details || res.data || form);
        setSuccess("✅ Personal information updated successfully!");
        setIsEditMode(false);
        await fetchPersonalInfo();
      }
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      console.error("Update Error:", err);
      setError(`❌ Update failed: ${err.response?.data?.error || err.message}`);
      setTimeout(() => setError(""), 4000);
    } finally {
      setSaving(false);
    }
  };

  // Delete Personal Info
  const handleDelete = async () => {
    if (!window.confirm("⚠️ Delete personal information permanently? This cannot be undone.")) return;

    setShowDropdown(false);
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await deletePersonalInfo(mobileNumber, emailId);

      setPersonal(null);
      setForm({
        dob: "",
        birth_place: "",
        father_name: "",
        mother_name: "",
        profession: "",
      });
      setIsEditMode(false);

      setSuccess("🗑️ Personal information deleted successfully!");
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      console.error("Delete Error:", err);
      setError(`❌ Delete failed: ${err.response?.data?.message || err.message}`);
      setTimeout(() => setError(""), 4000);
    } finally {
      setSaving(false);
    }
  };

  // Edit Mode Handlers
  const handleEditClick = () => {
    setIsEditMode(true);
    setShowDropdown(false);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    if (personal) {
      setForm({
        dob: personal.dob || "",
        birth_place: personal.birth_place || "",
        father_name: personal.father_name || "",
        mother_name: personal.mother_name || "",
        profession: personal.profession || "",
      });
    }
  };

  if (loading) {
    return (
      <div className="psn-loading-wrapper">
        <div className="psn-spinner"></div>
        <p>Loading personal information...</p>
      </div>
    );
  }

  return (
    <div className="psn-container">
      {/* 1. Header Card */}
      <div className="psn-header-card">
        <div className="psn-header-content">
          <div className="psn-header-left">
            <div className="psn-header-icon">👤</div>
            <div>
              <h1 className="psn-header-title">Personal Information</h1>
              <p className="psn-header-subtitle">Manage your personal details</p>
            </div>
          </div>
          
          <div className="psn-header-right">
            {!personal && !isEditMode ? (
              <button className="psn-btn-primary" onClick={() => setIsEditMode(true)} disabled={saving}>
                <span className="psn-btn-icon">➕</span> Add Personal Info
              </button>
            ) : personal && !isEditMode && (
              <div className="psn-dropdown-wrapper" ref={dropdownRef}>
                <button className="psn-btn-menu" onClick={() => setShowDropdown(prev => !prev)} disabled={saving}>
                  <span className="psn-dots">⋮</span> Actions
                </button>
                {showDropdown && (
                  <div className="psn-dropdown-menu">
                    <button className="psn-dropdown-item" onClick={handleEditClick}>
                      ✏️ Edit Information
                    </button>
                    <div className="psn-dropdown-divider"></div>
                    <button className="psn-dropdown-item psn-danger" onClick={handleDelete}>
                      🗑️ Delete Information
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Alert Messages */}
      {error && <div className="psn-alert psn-alert-error">⚠️ {error} <button className="psn-alert-close" onClick={() => setError("")}>×</button></div>}
      {success && <div className="psn-alert psn-alert-success">✅ {success} <button className="psn-alert-close" onClick={() => setSuccess("")}>×</button></div>}

      {/* 3. User Info Banner */}
      <div className="psn-profile-card">
        <div className="psn-profile-content">
          <div className="psn-profile-item">
            <span className="psn-profile-icon">📱</span>
            <span className="psn-profile-label">Mobile</span>
            <span className="psn-profile-value">{mobileNumber}</span>
          </div>
          <div className="psn-profile-divider"></div>
          <div className="psn-profile-item">
            <span className="psn-profile-icon">📧</span>
            <span className="psn-profile-label">Email</span>
            <span className="psn-profile-value">{emailId}</span>
          </div>
        </div>
      </div>

      {/* 4. Main Content */}
      {!personal && !isEditMode ? (
        <div className="psn-empty-state">
          <div className="psn-empty-icon">📭</div>
          <h3>No Personal Information</h3>
          <p>Add your personal details to complete your profile</p>
          <button className="psn-btn-primary" onClick={() => setIsEditMode(true)}>
            ➕ Add Personal Info
          </button>
        </div>
      ) : (
        <>
          {/* View Mode */}
          {personal && !isEditMode && (
            <div className="psn-details-card">
              <div className="psn-card-header">
                <h2 className="psn-card-title">👁️ Current Information</h2>
              </div>
              <div className="psn-display-grid">
                {[
                  { icon: "📅", label: "Date of Birth", value: personal.dob },
                  { icon: "📍", label: "Birth Place", value: personal.birth_place },
                  { icon: "💼", label: "Profession", value: personal.profession },
                  { icon: "👨", label: "Father's Name", value: personal.father_name },
                  { icon: "👩", label: "Mother's Name", value: personal.mother_name }
                ].map((item, index) => (
                  <div className="psn-display-item" key={index}>
                    <span className="psn-display-icon">{item.icon}</span>
                    <div>
                      <span className="psn-display-label">{item.label}</span>
                      <span className="psn-display-value">{item.value || "Not provided"}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Edit Mode */}
          {isEditMode && (
            <>
              <div className="psn-edit-actions-bar">
                <button className="psn-btn-primary" onClick={personal ? handleUpdate : handleCreate} disabled={saving}>
                  {saving ? "⏳ Saving..." : personal ? "💾 Update Information" : "💾 Create Information"}
                </button>
                <button className="psn-btn-secondary" onClick={handleCancelEdit} disabled={saving}>
                  ❌ Cancel
                </button>
              </div>

              <div className="psn-form-card">
                <div className="psn-card-header">
                  <h2 className="psn-card-title">📝 {personal ? "Update" : "Add"} Personal Details</h2>
                </div>
                <div className="psn-form-grid">
                  {[
                    { label: "📅 Date of Birth", key: "dob", type: "date" },
                    { label: "📍 Birth Place", key: "birth_place", type: "text", placeholder: "Enter birth place" },
                    { label: "💼 Profession", key: "profession", type: "text", placeholder: "Enter profession" },
                    { label: "👨 Father's Name", key: "father_name", type: "text", placeholder: "Enter father's name" },
                    { label: "👩 Mother's Name", key: "mother_name", type: "text", placeholder: "Enter mother's name" }
                  ].map((field) => (
                    <div className="psn-form-group" key={field.key}>
                      <label className="psn-form-label">{field.label}</label>
                      <input
                        type={field.type}
                        className="psn-form-input"
                        value={form[field.key]}
                        placeholder={field.placeholder}
                        onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                        disabled={saving}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}