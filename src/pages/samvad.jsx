import { useState } from "react";

// --- Imports ---
import List from "./samvad/appeal/List";
import Preview from "./samvad/appeal/Preview";

import Post from "./samvad/appointment/Past";
import Upcoming from "./samvad/appointment/Upcoming";

import ComplaintList from "./samvad/complaints/Filed";
import ComplaintPreview from "./samvad/complaints/Resolved";

import GrievanceList from "./samvad/grievance/Closed";
import GrievancePreview from "./samvad/grievance/Open";

import "./Samvad.css";

export default function Samvad() {
  const [activeTab, setActiveTab] = useState("Appeal");
  const [activeSubTab, setActiveSubTab] = useState("List"); // inner tab (List/Preview)

  // ✅ Config to handle which components to show
  const getComponents = () => {
    const map = {
      Appeal: { list: <List />, preview: <Preview /> },
      Appointment: { list: <Post />, preview: <Upcoming /> },
      Complaints: { list: <ComplaintList />, preview: <ComplaintPreview /> },
      Grievance: { list: <GrievanceList />, preview: <GrievancePreview /> },
    };
    return map[activeTab] || { list: null, preview: null };
  };

  // ✅ Render Sub-Tabs (Reusable to remove repetition)
  const renderTabs = () => {
    const tabs = ["List", "Preview"];
    return (
      <div className="samvad-sub-tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`sub-tab-btn ${activeSubTab === tab ? "active" : ""}`}
            onClick={() => setActiveSubTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
    );
  };

  // ✅ Render Content
  const renderContent = () => {
    const comps = getComponents();
    return activeSubTab === "List" ? comps.list : comps.preview;
  };

  return (
    <div className="samvad-layout">
      
      {/* ==========================================
          1. LEFT SIDEBAR
         ========================================== */}
      <aside className="samvad-sidebar">
        <h2 className="sidebar-title">📢 Samvad</h2>
        <p className="sidebar-subtitle">Constituency Connect</p>
        
        <ul className="sidebar-menu">
          {["Appeal", "Appointment", "Complaints", "Grievance"].map((tab) => (
            <li
              key={tab}
              className={activeTab === tab ? "active" : ""}
              onClick={() => {
                setActiveTab(tab);
                setActiveSubTab("List"); // reset sub-tab on main tab change
              }}
            >
              <span className="menu-icon">{tab === "Appeal" ? "📋" : tab === "Appointment" ? "📅" : tab === "Complaints" ? "⚠️" : "🔒"}</span>
              {tab}
            </li>
          ))}
        </ul>
      </aside>

      {/* ==========================================
          2. RIGHT CONTENT
         ========================================== */}
      <main className="samvad-main">
        
        {/* Breadcrumb Header */}
        <div className="samvad-header">
          <div className="breadcrumb">
            <span>Samvad</span>
            <span className="separator">/</span>
            <span className="current-cat">{activeTab}</span>
          </div>
          <h1 className="page-title">{activeTab} Management</h1>
          <p className="page-desc">Manage your {activeTab.toLowerCase()} requests efficiently.</p>
        </div>

        {/* Sub Tabs (List / Preview) */}
        {renderTabs()}

        {/* Dynamic Content Area */}
        <div className="samvad-body">
          {renderContent()}
        </div>

      </main>
    </div>
  );
}