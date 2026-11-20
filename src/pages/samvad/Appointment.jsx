import { Link, Outlet, useLocation } from "react-router-dom";
//import "./appM.css";

export default function Appointment() {
  const location = useLocation();
  const currentPath = location.pathname;
  const activeTab = currentPath.includes('past') ? 'past' : 'upcoming';

  return (
    <div className="appointment-container">
      <div className="appointment-header">
        <h1 className="appointment-title">Appointments</h1>
        <p className="appointment-subtitle">
          Manage and track all your appointments in one place
        </p>
      </div>

      <nav 
        className="appointment-nav" 
        data-active-tab={activeTab}
      >
        <Link 
          to="upcoming" 
          className={`tab-link ${activeTab === 'upcoming' ? 'active' : ''}`}
        >
          📋 Preview
        </Link>
        <Link 
          to="past" 
          className={`tab-link ${activeTab === 'past' ? 'active' : ''}`}
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