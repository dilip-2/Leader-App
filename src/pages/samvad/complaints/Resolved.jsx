
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export default function ComplaintPrevie(){
  const mobile = Cookies.get("leader_regd_mobile_no") || "";
  const email = Cookies.get("email") || "";
  const requestType = "Appeal/Grievance/Complaints";

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("pending");

  // Load data based on status
  const loadData = async (status) => {
    setLoading(true);
    setData([]);
    
    try {
      console.log("📤 API Request Params:", {
        leader_regd_mobile_no: mobile,
        user_email_id: email,
        request_type: requestType,
        status: status,
      });

      const res = await axios.get("/api/grievances/status/", {
        headers: {
          "x-app-key": Cookies.get("appKey"),
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
        params: {
          leader_regd_mobile_no: mobile,
          user_email_id: email,
          request_type: requestType,
          status: status,
        },
      });

      console.log("📥 API Response:", res.data);

      // API directly returns array
      const responseData = Array.isArray(res.data) ? res.data : [];

      setData(responseData);

      if (responseData.length === 0) {
        console.log(`ℹ️ No records found for status: ${status}`);
      }
    } catch (err) {
      console.error("❌ Load Error:", err);
      alert("Data load करने में error आया!");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadData(statusFilter);
  }, []);

  // Handle status filter change
  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setStatusFilter(newStatus);
  };

  // Handle search button click
  const handleSearch = () => {
    loadData(statusFilter);
  };

  // Get status class for styling
  const getStatusClass = (status) => {
    const classes = {
      Open: "status-open",
      Resolved: "status-resolved",
      pending: "status-pending",
      InProgress: "status-inprogress",
      Closed: "status-closed",
    };
    return classes[status] || "status-default";
  };

  return (
    <div className="preview-container">
      <h3 className="preview-title">📋  Complaints preview </h3>

      {/* Filter Section */}
      <div className="filter-section">
        <select
          value={statusFilter}
          onChange={handleStatusChange}
          className="status-select"
        >
          <option value="pending">Pending</option>
          <option value="Open">Open</option>
          <option value="Resolved">Resolved</option>
          <option value="InProgress">In Progress</option>
          <option value="Closed">Closed</option>
        </select>

        <button onClick={handleSearch} className="search-button">
          🔍 Search
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading...</p>
        </div>
      )}

      {/* Data Display */}
      {!loading && (
        <div className="data-container">
          {data.length === 0 ? (
            <div className="no-data">
              <p>🔍 कोई डेटा नहीं मिला</p>
              <p className="no-data-hint">
                Status: <strong>{statusFilter}</strong> के लिए कोई grievance नहीं है।
              </p>
            </div>
          ) : (
            <div className="appeal-grid">
              {data.map((item, index) => (
                <div key={item._id || index} className="appeal-card">
                  <div className="card-header">
                    <h4 className="card-title">{item.applicant_name || "No Name"}</h4>
                    <span className={`status-badge ${getStatusClass(item.status)}`}>
                      {item.status}
                    </span>
                  </div>

                  <div className="card-body">
                    <p className="card-desc">{item.meeting_purpose || item.description || "No Purpose"}</p>

                    <div className="card-details">
                      <div className="detail-item">
                        <span className="detail-label">Registration No:</span>
                        <span className="detail-value">{item.regn_no || "N/A"}</span>
                      </div>

                      <div className="detail-item">
                        <span className="detail-label">Mobile:</span>
                        <span className="detail-value">{item.applicant_mobile || item.mobile || "N/A"}</span>
                      </div>

                      <div className="detail-item">
                        <span className="detail-label">Father's Name:</span>
                        <span className="detail-value">{item.fh_name || "N/A"}</span>
                      </div>

                      <div className="detail-item">
                        <span className="detail-label">Address:</span>
                        <span className="detail-value">{item.address || "N/A"}</span>
                      </div>

                      <div className="detail-item">
                        <span className="detail-label">District:</span>
                        <span className="detail-value">{item.district || "N/A"}</span>
                      </div>

                      <div className="detail-item">
                        <span className="detail-label">State:</span>
                        <span className="detail-value">{item.state || "N/A"}</span>
                      </div>

                      <div className="detail-item">
                        <span className="detail-label">Pincode:</span>
                        <span className="detail-value">{item.pincode || "N/A"}</span>
                      </div>

                      <div className="detail-item">
                        <span className="detail-label">Requested Meeting Date:</span>
                        <span className="detail-value">
                          {item.req_meeting_date 
                            ? new Date(item.req_meeting_date).toLocaleDateString("hi-IN")
                            : "N/A"}
                        </span>
                      </div>

                      {item.appr_meeting_date && (
                        <div className="detail-item">
                          <span className="detail-label">Approved Meeting Date:</span>
                          <span className="detail-value">
                            {new Date(item.appr_meeting_date).toLocaleDateString("hi-IN")}
                          </span>
                        </div>
                      )}

                      {item.appr_meeting_time && (
                        <div className="detail-item">
                          <span className="detail-label">Approved Meeting Time:</span>
                          <span className="detail-value">{item.appr_meeting_time}</span>
                        </div>
                      )}

                      {item.action_taken_comments && (
                        <div className="detail-item">
                          <span className="detail-label">Action Taken:</span>
                          <span className="detail-value">{item.action_taken_comments}</span>
                        </div>
                      )}

                      {item.updated_by && (
                        <div className="detail-item">
                          <span className="detail-label">Updated By:</span>
                          <span className="detail-value">{item.updated_by}</span>
                        </div>
                      )}

                      {item.createdAt && (
                        <div className="detail-item">
                          <span className="detail-label">Created:</span>
                          <span className="detail-value">
                            {new Date(item.createdAt).toLocaleDateString("hi-IN")}
                          </span>
                        </div>
                      )}

                      {item.updatedAt && (
                        <div className="detail-item">
                          <span className="detail-label">Updated:</span>
                          <span className="detail-value">
                            {new Date(item.updatedAt).toLocaleDateString("hi-IN")}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="card-footer">
                    <button className="view-details-btn">
                      👁️ View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}