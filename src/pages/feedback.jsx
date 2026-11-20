import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import "./FeedB.css";

export default function FeedbackPage() {
  const mobile = Cookies.get("leader_regd_mobile_no") || "7702000725";
  const email = Cookies.get("email") ||"sanjay.jaiswal@gmail.com";

  const [activeTab, setActiveTab] = useState("feedback");
  const [subTab, setSubTab] = useState("preview");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filter & Search States
  const [statusFilter, setStatusFilter] = useState("Open");
  const [searchCaseNo, setSearchCaseNo] = useState("");

  // Get correct uf_type based on activeTab
  const getUfType = () => activeTab === "feedback" ? "feedback" : "bug";

  // ---------------------------------------------------
  // DEFAULT LOAD (Without Filter)
  // ---------------------------------------------------
  const loadData = async () => {
    setLoading(true);
    setData([]);
    try {
      const res = await axios.get("/api/userfeedback/", {
        headers: {
          "x-app-key": Cookies.get("appKey"),
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
        params: {
          leader_regd_mobile_no: mobile,
          user_email_id: email,
          uf_type: getUfType(),
        },
      });

      const responseData = Array.isArray(res.data) ? res.data : [];
      setData(responseData);
    } catch (err) {
      console.error("Load Error:", err);
      alert("Failed to load data");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------
  // FILTER API (Submit Button)
  // ---------------------------------------------------
  const loadFilteredData = async () => {
    setLoading(true);
    setData([]);
    try {
      const res = await axios.get("/api/userfeedback/fetch/", {
        headers: {
          "x-app-key": Cookies.get("appKey"),
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
        params: {
          leader_regd_mobile_no: mobile,
          user_email_id: email,
          uf_type: getUfType(),
          uf_status: statusFilter,
        },
      });

      const responseData = Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data)
          ? res.data
          : [];

      setData(responseData);

      if (responseData.length === 0) {
        alert("इस filter के लिए कोई record नहीं मिला!");
      }
    } catch (err) {
      console.error("Filter Error:", err);
      alert("Data filter करने में failure");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------
  // SEARCH BY CASE NUMBER
  // ---------------------------------------------------
  const searchByCaseNo = async () => {
    if (!searchCaseNo.trim()) {
      alert("Please enter case number!");
      return;
    }

    setLoading(true);
    setData([]);
    try {
      const res = await axios.get("/api/userfeedback/search", {
        headers: {
          "x-app-key": Cookies.get("appKey"),
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
        params: {
          leader_regd_mobile_no: mobile,
          user_email_id: email,
          uf_case_no: searchCaseNo.trim(),
        },
      });

      const responseData = res.data?.data ? [res.data.data] : [];
      setData(responseData);

      if (responseData.length === 0) {
        alert("Case Not Found!");
      }
    } catch (err) {
      console.error("Search Error:", err);
      alert("Case Not Found or API Error!");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // Reset functionality
  const resetView = () => {
    setSearchCaseNo("");
    setStatusFilter("Open");
    loadData();
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  // Get status class
  const getStatusClass = (status) => {
    const classes = {
      Open: "status-open",
      Resolved: "status-resolved",
      InProgress: "status-inprogress",
      pending: "status-pending",
    };
    return classes[status] || "status-default";
  };

  return (
    <div className="feedback-main-container">
      {/* LEFT SIDEBAR */}
      <div className="feedback-sidebar">
        <h3 className="sidebar-title">User Feedback</h3>
        
        <button
          onClick={() => setActiveTab("feedback")}
          className={`sidebar-item ${activeTab === "feedback" ? "active" : ""}`}
        >
          Feedback
        </button>

        <button
          onClick={() => setActiveTab("bug")}
          className={`sidebar-item ${activeTab === "bug" ? "active" : ""}`}
        >
          Issues
        </button>
      </div>

      {/* RIGHT CONTENT */}
      <div className="feedback-content-wrapper">
        <div className="feedback-container">
          <h2 className="feedback-title">User Feedback & Issues</h2>

          {/* MAIN TABS - REMOVED */}

          {/* SUB TABS */}
          <div className="sub-tabs">
            <button
              onClick={() => setSubTab("list")}
              className={`tab-btn ${subTab === "list" ? "active-preview" : "inactive"}`}
            >
              List
            </button>

            <button
              onClick={() => setSubTab("preview")}
              className={`tab-btn ${subTab === "preview" ? "active-preview" : "inactive"}`}
            >
              Preview
            </button>
          </div>

          {/* SEARCH BOX - ONLY IN LIST VIEW */}
          {subTab === "list" && (
            <div className="search-box">
              <input
                type="text"
                value={searchCaseNo}
                onChange={(e) => setSearchCaseNo(e.target.value)}
                placeholder="Search by Case No (ex: uf117)"
                className="search-input"
                onKeyPress={(e) => e.key === "Enter" && searchByCaseNo()}
              />
              <button onClick={searchByCaseNo} className="search-btn">
                Search
              </button>
              <button onClick={resetView} className="reset-btn">
                Reset
              </button>
            </div>
          )}

          {/* FILTER UI - ONLY IN PREVIEW VIEW */}
          {subTab === "preview" && (
            <div className="filter-box">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="filter-select"
              >
                <option value="pending">pending</option>
                <option value="Open">Open</option>
                <option value="Resolved">Resolved</option>
                <option value="InProgress">In Progress</option>
              </select>

              <button onClick={loadFilteredData} className="submit-btn">
                Submit
              </button>
            </div>
          )}

          {/* LOADING STATE */}
          {loading && <div className="loading">Loading...</div>}

          {/* CONTENT */}
          <div className="content">
            {!loading && data.length === 0 ? (
              <p className="no-data">No Data Found</p>
            ) : subTab === "preview" ? (
              <div className="card-grid">
                {data.map((item, index) => (
                  <div key={item._id || item.uf_case_no || index} className="card">
                    <h3 className="card-title">{item.uf_subject}</h3>
                    {/* <p className="card-desc">{item.uf_desc}</p> */}
                    <p className="card-info">
                      <b>Status:</b>{" "}
                      <span className={`status-badge ${getStatusClass(item.uf_status)}`}>
                        {item.uf_status}
                      </span>
                    </p>
                    <p className="card-info">
                      <b>Case No:</b> {item.uf_case_no}
                    </p>

                    {item.uf_attachment_url && (
                      <img
                        src={item.uf_attachment_url}
                        alt="feedback"
                        className="card-image"
                      />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="table-wrapper">
                <table className="feedback-table">
                  <thead>
                    <tr>
                      <th>Case No</th>
                      <th>Subject</th>
                      <th>Description</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Attachment</th>
                    </tr>
                  </thead>

                  <tbody>
                    {data.map((item, index) => (
                      <tr key={item._id || item.uf_case_no || index}>
                        <td data-label="Case No">{item.uf_case_no}</td>
                        <td data-label="Subject">{item.uf_subject}</td>
                        <td data-label="Description">{item.uf_desc}</td>
                        <td data-label="Type">{item.uf_type}</td>
                        <td data-label="Status">
                          <span className={`status-badge ${getStatusClass(item.uf_status)}`}>
                            {item.uf_status}
                          </span>
                        </td>
                        <td data-label="Attachment">
                          {item.uf_attachment_url ? (
                            <img
                              src={item.uf_attachment_url}
                              alt=""
                              className="table-image"
                            />
                          ) : (
                            "No Image"
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}