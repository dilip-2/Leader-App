import { useEffect, useState } from "react";
import Cookies from "js-cookie";

import {
  getEducation,
  addEducationEntry,
  updateEducation,
  deleteEducation,
} from "../api/apieducation";
import { FaEdit, FaSave, FaTrash, FaPlus, FaTimes, FaEllipsisV } from "react-icons/fa";
import "./Educationinfo.css";

export default function EducationA() {
  const mobile = Cookies.get("leader_regd_mobile_no");
  const email = Cookies.get("email");
  
  const [educationList, setEducationList] = useState([]);
  const [newEntry, setNewEntry] = useState({
    degree: "",
    college: "",
    university: "",
    place: "",
  });
  const [isEditing, setIsEditing] = useState(null);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);

  // Fetch education data on mount
  useEffect(() => {
    fetchEducation();
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setOpenMenu(null);
    if (openMenu !== null) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [openMenu]);

  const fetchEducation = async () => {
    try {
      setLoading(true);
      const res = await getEducation(mobile, email);
      setEducationList(res.data?.leader_edu_data?.edu_qual || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching education:", error);
      setLoading(false);
    }
  };

  // Add new education
  const handleAdd = async () => {
    if (!newEntry.degree || !newEntry.college) {
      setMessage("⚠️ Please add all required fields");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    try {
      const data = {
        leader_regd_mobile_no: mobile,
        user_email_id: email,
        edu_qual: newEntry
      };
      
      console.log("📤 Sending data:", data);
      
      const response = await addEducationEntry(data);
      console.log("📥 Response:", response);
      
      setMessage("✅ Education added successfully!");
      setNewEntry({ degree: "", college: "", university: "", place: "" });
      setShowAddForm(false);
      fetchEducation();
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("❌ Full Error:", error);
      console.error("❌ Response:", error.response);
      setMessage(`❌ ${error.response?.data?.message || "Failed to add"}`);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  // Edit mode enable
  const handleEdit = (index) => {
    setIsEditing(index);
    setEditData(educationList[index]);
    setOpenMenu(null);
  };

  // Save update
  const handleSave = async (index) => {
    try {
      const eduId = educationList[index]._id;
      const data = {
        leader_regd_mobile_no: mobile,
        user_email_id: email,
        eduId: eduId,
        edu_qual: {
          degree: editData.degree,
          college: editData.college,
          university: editData.university,
          place: editData.place,
        },
      };
      await updateEducation(data);
      setIsEditing(null);
      setMessage("✅ Updated successfully!");
      fetchEducation();
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error updating education:", error);
      setMessage("❌ Update failed");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  // Delete entry
  const handleDelete = async (eduId) => {
    if (!window.confirm("⚠️ Delete this education record permanently? This cannot be undone.")) return;

    try {
      await deleteEducation(mobile, email, eduId);
      setMessage("🗑️ Deleted successfully!");
      fetchEducation();
      setTimeout(() => setMessage(""), 3000);
      setOpenMenu(null);
    } catch (error) {
      console.error("Error deleting education:", error);
      setMessage("❌ Delete failed");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  // Cancel add form
  const handleCancelAdd = () => {
    setShowAddForm(false);
    setNewEntry({ degree: "", college: "", university: "", place: "" });
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setIsEditing(null);
    setEditData({});
  };

  // Toggle three-dot menu
  const toggleMenu = (e, index) => {
    e.stopPropagation();
    setOpenMenu(openMenu === index ? null : index);
  };

  if (loading) {
    return (
      <div className="edu-loading-wrapper">
        <div className="edu-spinner"></div>
        <p>Loading education details...</p>
      </div>
    );
  }

  return (
    <div className="edu-container">
      {/* 1. Header Card */}
      <div className="edu-header-card">
        <div className="edu-header-content">
          <div className="edu-header-left">
            <div className="edu-header-icon">🎓</div>
            <div>
              <h1 className="edu-header-title">Education Details</h1>
              <p className="edu-header-subtitle">Manage your educational qualifications</p>
            </div>
          </div>
          
          <div className="edu-header-right">
            <button className="edu-btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
              <span className="edu-btn-icon">{showAddForm ? <FaTimes /> : <FaPlus />}</span>
              {showAddForm ? "Close Form" : "Add Education"}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Alert Messages */}
      {message && (
        <div className={`edu-alert ${message.includes('✅') || message.includes('🗑️') ? 'edu-alert-success' : 'edu-alert-error'}`}>
          <div className="edu-alert-content">
            <span className="edu-alert-icon">{message.includes('✅') ? '✅' : message.includes('🗑️') ? '🗑️' : '⚠️'}</span>
            <span className="edu-alert-text">{message}</span>
          </div>
          <button className="edu-alert-close" onClick={() => setMessage("")}>×</button>
        </div>
      )}

      {/* 3. User Info Banner */}
      <div className="edu-profile-card">
        <div className="edu-profile-content">
          <div className="edu-profile-item">
            <span className="edu-profile-icon">📧</span>
            <span className="edu-profile-label">Email</span>
            <span className="edu-profile-value">{email}</span>
          </div>
          <div className="edu-profile-divider"></div>
          <div className="edu-profile-item">
            <span className="edu-profile-icon">📱</span>
            <span className="edu-profile-label">Mobile</span>
            <span className="edu-profile-value">{mobile}</span>
          </div>
        </div>
      </div>

      {/* 4. Add Form */}
      {showAddForm && (
        <div className="edu-form-card">
          <div className="edu-card-header">
            <h2 className="edu-card-title">➕ Add New Education Qualification</h2>
          </div>

          <div className="edu-form-grid">
            <div className="edu-form-group edu-full-width">
              <label className="edu-form-label">Degree / Qualification <span className="edu-required">*</span></label>
              <input type="text" className="edu-form-input" value={newEntry.degree} onChange={(e) => setNewEntry({ ...newEntry, degree: e.target.value })} placeholder="Enter degree name" />
            </div>
            <div className="edu-form-group">
              <label className="edu-form-label">College / Institution <span className="edu-required">*</span></label>
              <input type="text" className="edu-form-input" value={newEntry.college} onChange={(e) => setNewEntry({ ...newEntry, college: e.target.value })} placeholder="Enter college name" />
            </div>
            <div className="edu-form-group">
              <label className="edu-form-label">University / Board</label>
              <input type="text" className="edu-form-input" value={newEntry.university} onChange={(e) => setNewEntry({ ...newEntry, university: e.target.value })} placeholder="Enter university name" />
            </div>
            <div className="edu-form-group">
              <label className="edu-form-label">Place / Location</label>
              <input type="text" className="edu-form-input" value={newEntry.place} onChange={(e) => setNewEntry({ ...newEntry, place: e.target.value })} placeholder="Enter location" />
            </div>
          </div>

          <div className="edu-form-actions">
            <button className="edu-btn-primary" onClick={handleAdd}><FaSave /> Save Education</button>
            <button className="edu-btn-secondary" onClick={handleCancelAdd}><FaTimes /> Cancel</button>
          </div>
        </div>
      )}

      {/* 5. Education List */}
      {educationList.length === 0 && !showAddForm ? (
        <div className="edu-empty-state">
          <div className="edu-empty-icon">🎓</div>
          <h3>No Education Records</h3>
          <p>Add your educational qualifications to complete your profile</p>
          <button className="edu-btn-primary" onClick={() => setShowAddForm(true)}>
            <FaPlus /> Add Your First Qualification
          </button>
        </div>
      ) : (
        educationList.length > 0 && (
          <div className="edu-list-grid">
            {educationList.map((edu, index) => (
              <div key={index} className="edu-card">
                
                {/* Three-Dot Menu */}
                {isEditing !== index && (
                  <div className="edu-menu-wrapper">
                    <button className="edu-menu-toggle" onClick={(e) => toggleMenu(e, index)}>
                      <FaEllipsisV />
                    </button>
                    {openMenu === index && (
                      <div className="edu-dropdown-menu">
                        <button className="edu-dropdown-item" onClick={() => handleEdit(index)}>
                          <FaEdit /> Edit
                        </button>
                        <div className="edu-dropdown-divider"></div>
                        <button className="edu-dropdown-item edu-danger" onClick={() => handleDelete(edu._id)}>
                          <FaTrash /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Edit Mode */}
                {isEditing === index ? (
                  <div className="edu-edit-mode">
                    <div className="edu-edit-grid">
                      <div className="edu-form-group edu-full-width">
                        <label className="edu-form-label">Degree / Qualification</label>
                        <input type="text" className="edu-form-input" value={editData.degree} onChange={(e) => setEditData({ ...editData, degree: e.target.value })} placeholder="Degree" />
                      </div>
                      <div className="edu-form-group">
                        <label className="edu-form-label">College / Institution</label>
                        <input type="text" className="edu-form-input" value={editData.college} onChange={(e) => setEditData({ ...editData, college: e.target.value })} placeholder="College" />
                      </div>
                      <div className="edu-form-group">
                        <label className="edu-form-label">University / Board</label>
                        <input type="text" className="edu-form-input" value={editData.university} onChange={(e) => setEditData({ ...editData, university: e.target.value })} placeholder="University" />
                      </div>
                      <div className="edu-form-group">
                        <label className="edu-form-label">Place / Location</label>
                        <input type="text" className="edu-form-input" value={editData.place} onChange={(e) => setEditData({ ...editData, place: e.target.value })} placeholder="Place" />
                      </div>
                    </div>
                    <div className="edu-form-actions">
                      <button className="edu-btn-primary" onClick={() => handleSave(index)}><FaSave /> Save Changes</button>
                      <button className="edu-btn-secondary" onClick={handleCancelEdit}><FaTimes /> Cancel</button>
                    </div>
                  </div>
                ) : (
                  /* View Mode */
                  <div className="edu-display-content">
                    <div className="edu-degree-badge">
                      <span className="edu-degree-icon">🎓</span>
                      <h3 className="edu-degree-title">{edu.degree}</h3>
                    </div>
                    <div className="edu-details-grid">
                      {[
                        { icon: "🏛️", label: "College", value: edu.college },
                        { icon: "📚", label: "University", value: edu.university },
                        { icon: "📍", label: "Location", value: edu.place }
                      ].map((item, i) => (
                        <div className="edu-detail-item" key={i}>
                          <span className="edu-detail-icon">{item.icon}</span>
                          <div>
                            <span className="edu-detail-label">{item.label}</span>
                            <span className="edu-detail-value">{item.value || "Not provided"}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}