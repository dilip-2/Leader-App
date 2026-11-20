import { Link, Outlet, useLocation } from "react-router-dom";
//import "./appM.css";

export default function Grievance() {
  const location = useLocation();
  const currentPath = location.pathname;
  const activeTab = currentPath.includes('closed') ? 'closed' : 'open';

  return (
    <div className="appointment-container">
      <div className="appointment-header">
        <h1 className="appointment-title">Grievance</h1>
        <p className="appointment-subtitle">
          Manage and resolve public grievances efficiently
        </p>
      </div>

      <nav 
        className="appointment-nav" 
        data-active-tab={activeTab}
      >
        <Link 
          to="open" 
          className={`tab-link ${activeTab === 'open' ? 'active' : ''}`}
        >
          📋 Preview
        </Link>
        <Link 
          to="closed" 
          className={`tab-link ${activeTab === 'closed' ? 'active' : ''}`}
        >
          📊 List
        </Link>
      </nav>

      <div className="tab-content">
        <Outlet />
      </div>
    </div>
  );
}