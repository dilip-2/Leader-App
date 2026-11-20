import { useEffect, useState } from "react";
import Cookies from "js-cookie";

import {
  fetchAllGrievances,
  searchGrievanceByRegn,
  updateGrievance,
  deleteGrievance,
} from "../../../api/apiG";
//import "./list.css";

export default function filed() {
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
        setError("No  complaints found with this registration number");
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

      alert("✅ Complaints updated successfully!");
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
    if (!window.confirm(`⚠️ Are you sure you want to delete this Complaints ?\n\nRegn No: ${item.regn_no}\nName: ${item.applicant_name}`)) {
      return;
    }

    setLoading(true);
    setError("");
    setOpenMenuIndex(null);

    try {
      await deleteGrievance(MOBILE, EMAIL, item.regn_no);
      alert("✅ Complaints deleted successfully!");
      
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
      <h4>📝 Full Complaints Details</h4>

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
        <div className="filed-header">
          <h1 className="filed-title">📋 Complaints List</h1>
        </div>

        {/* Search Section */}
        <div className="search-section">
          <input
            type="text"
            placeholder="🔍 Enter Registration Number"
            value={searchRegnNo}
            onChange={(e) => setSearchRegnNo(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          />
          <button onClick={handleSearch} disabled={searchLoading}>
            {searchLoading ? "⏳ Searching..." : "🔍 Search"}
          </button>
          <button onClick={clearSearch} disabled={searchLoading}>
            🔄 Clear
          </button>
        </div>

        {error && <p className="error">{error}</p>}

        {/* LIST */}
        <div className="filed-list">
          {loading ? (
            <div className="loading-spinner">
              <p>⏳ Loading grievances...</p>
            </div>
          ) : searchResult ? (
            <div className="filed-card featured">
              <div className="filed-card-header">
                <div className="filed-summary">
                  <p><b>Regn No:</b> {searchResult.regn_no}</p>
                  <p><b>Name:</b> {searchResult.applicant_name}</p>
                  <p><b>Status:</b> <span className="status-badge">{searchResult.status || "Pending"}</span></p>
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
                    <p><b>Regn No:</b> {item.regn_no}</p>
                    <p><b>Name:</b> {item.applicant_name}</p>
                    <p><b>Status:</b> <span className="status-badge">{item.status || "Pending"}</span></p>
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
              <p>📭 No Records Found</p>
            </div>
          )}
        </div>

        {/* UPDATE FORM POPUP */}
        {showUpdateForm && (
          <div className="popup">
            <div className="popup-box">
              <h3>✏️ Update Grievance Status</h3>

              <input
                placeholder="Registration Number"
                value={updateData.regn_no}
                disabled
                style={{ backgroundColor: "#f0f0f0", cursor: "not-allowed" }}
              />
              <input
                placeholder="Status *"
                value={updateData.status}
                onChange={(e) => setUpdateData({ ...updateData, status: e.target.value })}
              />
              <textarea
                placeholder="Action Taken Comments"
                value={updateData.action_taken_comments}
                onChange={(e) =>
                  setUpdateData({ ...updateData, action_taken_comments: e.target.value })
                }
                rows="4"
              />
              <input
                placeholder="Updated By * (Your Name)"
                value={updateData.updated_by}
                onChange={(e) => setUpdateData({ ...updateData, updated_by: e.target.value })}
              />

              {error && <p className="error">{error}</p>}

              <div className="popup-actions">
                <button onClick={handleUpdateSubmit} disabled={submitting}>
                  {submitting ? "⏳ Updating..." : "✅ Update"}
                </button>
                <button
                  className="close-btn"
                  onClick={() => {
                    setShowUpdateForm(false);
                    setError("");
                  }}
                  disabled={submitting}
                >
                  ❌ Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}