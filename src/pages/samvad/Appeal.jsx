import { Link, Outlet, useLocation } from "react-router-dom";
//import "./appM.css";

export default function Appeal() {
  const location = useLocation();
  const currentPath = location.pathname;
  const activeTab = currentPath.includes('list') ? 'list' : 'preview';

  return (
    <div className="appointment-container">
      <div className="appointment-header"></div>
      <h2 className="appointment-title">Appeal</h2>
      <p className="appointment-subtitle">
          Manage and track all your Appeal in one place
        </p>
      <nav className="appointment-nav">
        <Link 
          to="preview" 
          className={`tab-link ${activeTab === 'preview' ? 'active' : ''}`}
        >
          Preview
        </Link>
        <Link 
          to="list" 
          className={`tab-link ${activeTab === 'list' ? 'active' : ''}`}
        >
          List
        </Link>
      </nav>
      
      <div className="tab-content">
        <Outlet />
      </div>
    </div>
  );
}