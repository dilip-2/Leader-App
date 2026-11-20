import { useEffect, useState } from "react";
import Cookies from "js-cookie";

import {
  fetchAllGrievances,
  searchGrievanceByRegn,
  updateGrievance,
  deleteGrievance,
} from "../../../api/apiG";
import "./list.css";

export default function List() {
  const MOBILE = Cookies.get("leader_regd_mobile_no");
  const EMAIL = Cookies.get("email");

  const [grievances, setGrievances] = useState([]);
  const [searchResult, setSearchResult] = useState(null);
  const [searchRegnNo, setSearchRegnNo] = useState("");
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState("");
  const [openMenuIndex, setOpenMenuIndex] = useState(null);

  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [updateData, setUpdateData] = useState({
    leader_regd_mobile_no: MOBILE || "",
    user_email_id: EMAIL || "",
    regn_no: "",
    status: "",
    action_taken_comments: "",
    updated_by: "",
  });

  useEffect(() => {
    getAllGrievances();
  }, []);

  const getAllGrievances = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchAllGrievances(MOBILE, EMAIL);
      setGrievances(data || []);
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchRegnNo.trim()) {
      setError("⚠️ Please enter a registration number");
      return;
    }
    setError("");
    setSearchLoading(true);
    try {
      const data = await searchGrievanceByRegn(MOBILE, EMAIL, searchRegnNo.trim());
      if (data) {
        setSearchResult(data);
        setExpandedIndex(0);
      } else {
        setError("No grievance found with this registration number");
      }
    } catch (err) {
      handleApiError(err);
      setSearchResult(null);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleApiError = (err) => {
    console.error("API Error:", err);
    if (err.response?.status === 401) {
      setError("🔒 Session expired. Please login again.");
      setTimeout(() => (window.location.href = "/login"), 2000);
    } else if (err.response?.status === 404) {
      setError("❌ No record found.");
    } else {
      setError(err.response?.data?.message || "❌ Something went wrong. Please try again.");
    }
  };

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const toggleMenu = (index) => {
    setOpenMenuIndex(openMenuIndex === index ? null : index);
  };

  const clearSearch = () => {
    setSearchResult(null);
    setSearchRegnNo("");
    setError("");
    setExpandedIndex(null);
    setOpenMenuIndex(null);
    getAllGrievances();
  };

  const validateUpdateForm = () => {
    if (!updateData.status.trim()) {
      setError("⚠️ Status is required");
      return false;
    }
    if (!updateData.updated_by.trim()) {
      setError("⚠️ Updated By is required");
      return false;
    }
    return true;
  };

  const handleUpdateSubmit = async () => {
    if (!validateUpdateForm()) return;

    setSubmitting(true);
    setError("");

    try {
      const updatePayload = {
        leader_regd_mobile_no: updateData.leader_regd_mobile_no,
        user_email_id: updateData.user_email_id,
        regn_no: updateData.regn_no,
        status: updateData.status,
        action_taken_comments: updateData.action_taken_comments,
        updated_by: updateData.updated_by,
      };

      await updateGrievance(updatePayload);

      alert("✅ Appeal updated successfully!");
      setShowUpdateForm(false);

      setUpdateData({
        leader_regd_mobile_no: MOBILE || "",
        user_email_id: EMAIL || "",
        regn_no: "",
        status: "",
        action_taken_comments: "",
        updated_by: "",
      });

      if (searchResult) {
        await handleSearch();
      } else {
        await getAllGrievances();
      }
    } catch (err) {
      handleApiError(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`⚠️ Are you sure you want to delete this Appeal? \n\nRegn No: ${item.regn_no}\nName: ${item.applicant_name}`)) {
      return;
    }

    setLoading(true);
    setError("");
    setOpenMenuIndex(null);

    try {
      await deleteGrievance(MOBILE, EMAIL, item.regn_no);
      alert("✅ Appeal deleted successfully!");

      if (searchResult && searchResult.regn_no === item.regn_no) {
        clearSearch();
      } else {
        await getAllGrievances();
      }
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  const openEditForm = (item) => {
    setUpdateData({
      leader_regd_mobile_no: MOBILE || "",
      user_email_id: EMAIL || "",
      regn_no: item.regn_no,
      status: item.status || "",
      action_taken_comments: item.action_taken_comments || "",
      updated_by: item.updated_by || "",
    });
    setShowUpdateForm(true);
    setOpenMenuIndex(null);
  };

  const DetailSection = ({ item }) => (
    <div className="filed-details">
      <h4>📝 Full Appeal Details</h4>

      <table>
        <tbody>
          <tr><td><b>Regn No</b></td><td>{item.regn_no || "N/A"}</td></tr>
          <tr><td><b>Applicant Name</b></td><td>{item.applicant_name || "N/A"}</td></tr>
          <tr><td><b>Mobile</b></td><td>{item.applicant_mobile || "N/A"}</td></tr>
          <tr><td><b>Father/Husband</b></td><td>{item.fh_name || "N/A"}</td></tr>
          <tr><td><b>Address</b></td><td>{item.address || "N/A"}</td></tr>
          <tr><td><b>Pincode</b></td><td>{item.pincode || "N/A"}</td></tr>
          <tr><td><b>District</b></td><td>{item.district || "N/A"}</td></tr>
          <tr><td><b>State</b></td><td>{item.state || "N/A"}</td></tr>
          <tr><td><b>Status</b></td><td><span className="status-badge">{item.status || "Pending"}</span></td></tr>
          <tr><td><b>Description</b></td><td>{item.description || "N/A"}</td></tr>
          <tr><td><b>Action Taken</b></td><td>{item.action_taken_comments || "No action taken yet"}</td></tr>
          <tr><td><b>Updated By</b></td><td>{item.updated_by || "N/A"}</td></tr>
          <tr><td><b>Device IP</b></td><td>{item.device_ip_number || "N/A"}</td></tr>
          <tr><td><b>Created At</b></td><td>{item.createdAt ? new Date(item.createdAt).toLocaleString() : "N/A"}</td></tr>
          <tr><td><b>Updated At</b></td><td>{item.updatedAt ? new Date(item.updatedAt).toLocaleString() : "N/A"}</td></tr>
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="filed-container">
      <div className="filed-overlay">
        
        {/* Header */}
        <div className="filed-header">
          <h1 className="filed-title">📋 Appeal List</h1>
          <p className="filed-subtitle">Manage and track all registered appeals</p>
        </div>

        {/* Search Section */}
        <div className="search-section">
          <input
            type="text"
            placeholder="🔍 Enter Registration Number"
            value={searchRegnNo}
            onChange={(e) => setSearchRegnNo(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button onClick={handleSearch} disabled={searchLoading}>
            {searchLoading ? "⏳ Searching..." : "🔍 Search"}
          </button>
          <button className="clear-btn" onClick={clearSearch} disabled={searchLoading}>
            🔄 Clear
          </button>
        </div>

        {error && <div className="error-alert">{error}</div>}

        {/* LIST */}
        <div className="filed-list">
          {loading ? (
            <div className="loading-wrapper">
              <div className="loader"></div>
              <p>Loading appeals...</p>
            </div>
          ) : searchResult ? (
            <div className="filed-card featured">
              <div className="filed-card-header">
                <div className="filed-summary">
                  <span className="summary-tag">#{searchResult.regn_no}</span>
                  <h3 className="summary-name">{searchResult.applicant_name}</h3>
                  <span className={`status-badge ${searchResult.status || "Pending"}`}>
                    {searchResult.status || "Pending"}
                  </span>
                </div>
                <div className="actions-container">
                  <button className="view-button" onClick={() => toggleExpand(0)}>
                    {expandedIndex === 0 ? "▲ Hide" : "▼ View"}
                  </button>
                  <div className="menu-container">
                    <button className="menu-button" onClick={() => toggleMenu(0)}>
                      ⋮
                    </button>
                    {openMenuIndex === 0 && (
                      <div className="dropdown">
                        <button className="dropdown-item" onClick={() => openEditForm(searchResult)}>
                          ✏️ Edit
                        </button>
                        <button className="dropdown-item delete-item" onClick={() => handleDelete(searchResult)}>
                          🗑️ Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {expandedIndex === 0 && <DetailSection item={searchResult} />}
            </div>
          ) : grievances.length > 0 ? (
            grievances.map((item, index) => (
              <div className="filed-card" key={item.regn_no || index}>
                <div className="filed-card-header">
                  <div className="filed-summary">
                    <span className="summary-tag">#{item.regn_no}</span>
                    <h3 className="summary-name">{item.applicant_name}</h3>
                    <span className={`status-badge ${item.status || "Pending"}`}>
                      {item.status || "Pending"}
                    </span>
                  </div>
                  <div className="actions-container">
                    <button className="view-button" onClick={() => toggleExpand(index)}>
                      {expandedIndex === index ? "▲ Hide" : "▼ View"}
                    </button>
                    <div className="menu-container">
                      <button className="menu-button" onClick={() => toggleMenu(index)}>
                        ⋮
                      </button>
                      {openMenuIndex === index && (
                        <div className="dropdown">
                          <button className="dropdown-item" onClick={() => openEditForm(item)}>
                            ✏️ Edit
                          </button>
                          <button className="dropdown-item delete-item" onClick={() => handleDelete(item)}>
                            🗑️ Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {expandedIndex === index && <DetailSection item={item} />}
              </div>
            ))
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h3>No Records Found</h3>
              <p>No appeals have been registered yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* UPDATE FORM POPUP */}
      {showUpdateForm && (
        <div className="popup-overlay" onClick={() => setShowUpdateForm(false)}>
          <div className="popup-box" onClick={(e) => e.stopPropagation()}>
            <div className="popup-header">
              <h3>✏️ Update Appeal Status</h3>
              <button className="popup-close" onClick={() => setShowUpdateForm(false)}>×</button>
            </div>

            <div className="popup-body">
              <div className="form-group">
                <label>Registration Number</label>
                <input
                  placeholder="Regn No"
                  value={updateData.regn_no}
                  disabled
                  className="input-disabled"
                />
              </div>

              <div className="form-group">
                <label>Status <span className="required">*</span></label>
                <input
                  placeholder="Status"
                  value={updateData.status}
                  onChange={(e) => setUpdateData({ ...updateData, status: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Action Taken Comments</label>
                <textarea
                  placeholder="Comments"
                  value={updateData.action_taken_comments}
                  onChange={(e) => setUpdateData({ ...updateData, action_taken_comments: e.target.value })}
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Updated By <span className="required">*</span></label>
                <input
                  placeholder="Your Name"
                  value={updateData.updated_by}
                  onChange={(e) => setUpdateData({ ...updateData, updated_by: e.target.value })}
                />
              </div>

              {error && <div className="error-alert">{error}</div>}
            </div>

            <div className="popup-actions">
              <button className="btn-save" onClick={handleUpdateSubmit} disabled={submitting}>
                {submitting ? "⏳ Updating..." : "✅ Update"}
              </button>
              <button className="btn-cancel" onClick={() => setShowUpdateForm(false)} disabled={submitting}>
                ❌ Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}