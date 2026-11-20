import { useEffect, useState } from "react";
import Cookies from "js-cookie";

import {
  getTimeline,
  createTimelineEntry,
  updateTimeline,
  deleteTimelineEntry,
  deleteAllTimeline,
} from "../api/timeline";

import { FaTrash, FaEllipsisV, FaEdit, FaPlus, FaTimes } from "react-icons/fa";
import "./TimelineA.css";

export default function TimelineA() {
  const mobileNumber = Cookies.get("leader_regd_mobile_no");
  const emailId = Cookies.get("email");

  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);

  const [date, setDate] = useState("");
  const [title, setTitle] = useState("");
  const [titleDetails, setTitleDetails] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");

  // Format date from YYYY-MM-DD to DD/MM/YYYY
  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  // Format date from DD/MM/YYYY to YYYY-MM-DD for input
  const formatInputDate = (dateStr) => {
    if (!dateStr) return "";
    if (dateStr.includes("-")) return dateStr;
    const [day, month, year] = dateStr.split("/");
    return `${year}-${month}-${day}`;
  };

  const fetchTimeline = async () => {
    setLoading(true);
    try {
      const res = await getTimeline(mobileNumber, emailId);
      const timelineData =
        res?.data?.leader_timeline?.timeline ||
        res?.data?.timeline ||
        res?.data?.data ||
        [];
      setTimeline(Array.isArray(timelineData) ? timelineData : []);
    } catch (err) {
      console.error("Fetch timeline error:", err);
      setError("Unable to load timeline data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimeline();
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setOpenMenu(null);
    if (openMenu !== null) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [openMenu]);

  const handleSave = async () => {
    const trimmedDate = date?.trim();
    const trimmedTitle = title?.trim();
    
    if (!trimmedDate || !trimmedTitle) {
      setError("❌ Date and Title are required!");
      setTimeout(() => setError(""), 3000);
      return;
    }

    const entry = {
      date: trimmedDate,
      title: trimmedTitle,
      title_details: titleDetails?.trim() || "",
      additional_info: additionalInfo?.trim() || "",
    };

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      if (editingId) {
        const res = await updateTimeline({
          leader_regd_mobile_no: mobileNumber,
          user_email_id: emailId,
          timelineId: editingId,
          timeline: entry,
        });

        if (res?.status === 200 || res?.data) {
          setSuccess("✅ Timeline entry updated successfully!");
          await fetchTimeline();
        } else {
          throw new Error("Update failed");
        }
      } else {
        await createTimelineEntry(mobileNumber, emailId, entry);
        setSuccess("✅ Timeline entry added successfully!");
        await fetchTimeline();
      }

      handleCancel();
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      console.error("❌ Save error:", err);
      setError(`❌ ${err.message}`);
      setTimeout(() => setError(""), 4000);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item) => {
    setShowForm(true);
    setEditingId(item._id);
    setDate(formatInputDate(item.date) || "");
    setTitle(item.title || "");
    setTitleDetails(item.title_details || "");
    setAdditionalInfo(item.additional_info || "");
    setOpenMenu(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setDate("");
    setTitle("");
    setTitleDetails("");
    setAdditionalInfo("");
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("⚠️ Delete this timeline entry permanently? This cannot be undone.")) return;
    
    try {
      await deleteTimelineEntry(mobileNumber, emailId, id);
      setSuccess("🗑️ Entry deleted successfully!");
      await fetchTimeline();
      setOpenMenu(null);
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      console.error("Delete error:", err);
      setError(`❌ Delete failed: ${err.message}`);
      setTimeout(() => setError(""), 4000);
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm("⚠️ Delete ALL entries? This action cannot be undone!")) return;
    
    try {
      await deleteAllTimeline(mobileNumber, emailId);
      setSuccess("🗑️ All entries deleted successfully!");
      await fetchTimeline();
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      console.error("Delete all error:", err);
      setError(`❌ Delete all failed: ${err.message}`);
      setTimeout(() => setError(""), 4000);
    }
  };

  const toggleMenu = (e, id) => {
    e.stopPropagation();
    setOpenMenu(openMenu === id ? null : id);
  };

  if (loading) {
    return (
      <div className="tl-loading-wrapper">
        <div className="tl-spinner"></div>
        <p>Loading timeline...</p>
      </div>
    );
  }

  return (
    <div className="tl-container">
      {/* 1. Header Card */}
      <div className="tl-header-card">
        <div className="tl-header-content">
          <div className="tl-header-left">
            <div className="tl-header-icon">📅</div>
            <div>
              <h1 className="tl-header-title">Leader Timeline</h1>
              <p className="tl-header-subtitle">Manage your professional journey timeline</p>
            </div>
          </div>
          
          <div className="tl-header-right">
            {!showForm && (
              <button className="tl-btn-primary" onClick={() => setShowForm(true)} disabled={saving}>
                <span className="tl-btn-icon">➕</span> Add Entry
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Alert Messages */}
      {error && <div className="tl-alert tl-alert-error">⚠️ {error} <button className="tl-alert-close" onClick={() => setError("")}>×</button></div>}
      {success && <div className="tl-alert tl-alert-success">✅ {success} <button className="tl-alert-close" onClick={() => setSuccess("")}>×</button></div>}

      {/* 3. User Info Banner */}
      <div className="tl-profile-card">
        <div className="tl-profile-content">
          <div className="tl-profile-item">
            <span className="tl-profile-icon">📧</span>
            <span className="tl-profile-label">Email</span>
            <span className="tl-profile-value">{emailId}</span>
          </div>
          <div className="tl-profile-divider"></div>
          <div className="tl-profile-item">
            <span className="tl-profile-icon">📱</span>
            <span className="tl-profile-label">Mobile</span>
            <span className="tl-profile-value">{mobileNumber}</span>
          </div>
          <div className="tl-profile-divider"></div>
          <div className="tl-profile-item">
            <span className="tl-profile-icon">📊</span>
            <span className="tl-profile-label">Total Entries</span>
            <span className="tl-profile-value tl-count">{timeline.length}</span>
          </div>
        </div>
      </div>

      {/* 4. Add/Edit Form */}
      {showForm && (
        <div className="tl-form-card">
          <div className="tl-card-header">
            <h2 className="tl-card-title">
              {editingId ? "✏️ Edit Timeline Entry" : "➕ Add New Timeline Entry"}
            </h2>
            <button className="tl-close-btn" onClick={handleCancel} disabled={saving}>
              <FaTimes />
            </button>
          </div>

          <div className="tl-form-grid">
            <div className="tl-form-group">
              <label className="tl-form-label">Date <span className="tl-required">*</span></label>
              <input type="date" className="tl-form-input" value={date} onChange={(e) => setDate(e.target.value)} disabled={saving} required />
            </div>
            <div className="tl-form-group">
              <label className="tl-form-label">Title <span className="tl-required">*</span></label>
              <input type="text" className="tl-form-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter event title" disabled={saving} required />
            </div>
            <div className="tl-form-group tl-full-width">
              <label className="tl-form-label">Title Details</label>
              <textarea className="tl-form-textarea" value={titleDetails} onChange={(e) => setTitleDetails(e.target.value)} placeholder="Enter event details" rows="3" disabled={saving} />
            </div>
            <div className="tl-form-group tl-full-width">
              <label className="tl-form-label">Additional Information</label>
              <textarea className="tl-form-textarea" value={additionalInfo} onChange={(e) => setAdditionalInfo(e.target.value)} placeholder="Enter additional information" rows="3" disabled={saving} />
            </div>
          </div>

          <div className="tl-form-actions">
            <button className="tl-btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? "⏳ Saving..." : editingId ? "💾 Update Entry" : "💾 Save Entry"}
            </button>
            <button className="tl-btn-secondary" onClick={handleCancel} disabled={saving}>
              ❌ Cancel
            </button>
          </div>
        </div>
      )}

      {/* 5. Timeline List */}
      {timeline.length === 0 && !showForm ? (
        <div className="tl-empty-state">
          <div className="tl-empty-icon">📅</div>
          <h3>No Timeline Entries</h3>
          <p>Start building your professional journey timeline</p>
          <button className="tl-btn-primary" onClick={() => setShowForm(true)}>
            ➕ Add Your First Entry
          </button>
        </div>
      ) : (
        timeline.length > 0 && (
          <>
            <div className="tl-timeline-grid">
              {timeline.map((item, index) => (
                <div className="tl-timeline-card" key={item._id || index}>
                  
                  {/* Three-dot menu */}
                  <div className="tl-menu-wrapper">
                    <button className="tl-menu-toggle" onClick={(e) => toggleMenu(e, item._id)}>
                      <FaEllipsisV />
                    </button>
                    {openMenu === item._id && (
                      <div className="tl-dropdown-menu">
                        <button className="tl-dropdown-item" onClick={() => handleEdit(item)}>
                          <FaEdit /> Edit
                        </button>
                        <div className="tl-dropdown-divider"></div>
                        <button className="tl-dropdown-item tl-danger" onClick={() => handleDelete(item._id)}>
                          <FaTrash /> Delete
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="tl-card-content">
                    <div className="tl-date-badge">
                      <span className="tl-date-icon">📅</span>
                      <span className="tl-date-text">{formatDisplayDate(item.date)}</span>
                    </div>
                    
                    <h3 className="tl-card-title">{item.title}</h3>
                    
                    {item.title_details && (
                      <div className="tl-detail-item">
                        <span className="tl-detail-icon">📝</span>
                        <p className="tl-detail-text">{item.title_details}</p>
                      </div>
                    )}
                    
                    {item.additional_info && (
                      <div className="tl-detail-item">
                        <span className="tl-detail-icon">ℹ️</span>
                        <p className="tl-detail-text">{item.additional_info}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Delete All Button */}
            <div className="tl-footer">
              <button className="tl-btn-danger" onClick={handleDeleteAll}>
                <FaTrash /> Delete All Entries
              </button>
            </div>
          </>
        )
      )}
    </div>
  );
}