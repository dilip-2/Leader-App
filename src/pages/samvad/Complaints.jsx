import { Link, Outlet, useLocation } from "react-router-dom";
//import "./appM.css";

export default function Complaints() {
  const location = useLocation();
  const currentPath = location.pathname;
  const activeTab = currentPath.includes('resolved') ? 'resolved' : 'filed';

  return (
    <div className="appointment-container">
      <div className="appointment-header">
        <h1 className="appointment-title">Complaints</h1>
        <p className="appointment-subtitle">
          Manage and track all complaints and feedback
        </p>
      </div>

      <nav 
        className="appointment-nav" 
        data-active-tab={activeTab}
      >
        <Link 
          to="filed" 
          className={`tab-link ${activeTab === 'filed' ? 'active' : ''}`}
        >
          📋 Preview
        </Link>
        <Link 
          to="resolved" 
          className={`tab-link ${activeTab === 'resolved' ? 'active' : ''}`}
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