import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import {
  getAssemblyConstituencies,
  createAssemblyConstituencies,
  updateAssemblyConstituencies,
  deleteAssemblyConstituencies,
} from "../api/assemblyConstituencies";
import {
  FaEdit,
  FaSave,
  FaTimes,
  FaTrashAlt,
  FaMapMarkedAlt,
  FaBuilding,
  FaMapMarkerAlt,
  FaEllipsisV,
  FaPlus,
  FaListOl,
  FaInfoCircle, // ✅ ADD THIS IMPORT
} from "react-icons/fa";

import "./ACD.css";


export default function AssemblyConstituencies() {
  const MOBILE = Cookies.get("leader_regd_mobile_no") || "";
  const EMAIL = Cookies.get("email") || "";

  // Assembly Constituencies States
  const [assemblyData, setAssemblyData] = useState(null);
  const [narration, setNarration] = useState("");
  const [assemblyConst, setAssemblyConst] = useState([]);
  const [assemblyEditMode, setAssemblyEditMode] = useState(false);
  const [isCreatingAssembly, setIsCreatingAssembly] = useState(false);
  const [assemblyMenuOpen, setAssemblyMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch assembly data
  const fetchAssemblyData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching assembly data...", MOBILE, EMAIL);
      
      const res = await getAssemblyConstituencies(MOBILE, EMAIL);
      console.log("API Response:", res);
      
      const responseData = res?.data || null;
      setAssemblyData(responseData);

      if (responseData) {
        setNarration(responseData.narration || "");
        setAssemblyConst(responseData.assembly_const || []);
      } else {
        setNarration("");
        setAssemblyConst([]);
      }
      
      setIsCreatingAssembly(false);
    } catch (err) {
      console.error("Error fetching assembly data:", err);
      setError(err.message || "Failed to load assembly constituencies");
      setAssemblyData(null);
      setIsCreatingAssembly(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssemblyData();
  }, []);

  // Loading State
  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Loading Assembly Constituencies...</p>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="error-state">
        <h3>Error Loading Data</h3>
        <p>{error}</p>
        <button 
          className="btn btn-retry" 
          onClick={fetchAssemblyData}
        >
          Retry
        </button>
      </div>
    );
  }

  // Handlers
  const handleCreateNewAssembly = () => {
    setIsCreatingAssembly(true);
    setAssemblyEditMode(true);
    setNarration("This PC comprises the following ACs:");
    setAssemblyConst([{ ac_number: "", ac_name: "", district: "" }]);
  };

  const handleAddConstituency = () => {
    setAssemblyConst([...assemblyConst, { ac_number: "", ac_name: "", district: "" }]);
  };

  const handleRemoveConstituency = (index) => {
    const updated = assemblyConst.filter((_, i) => i !== index);
    setAssemblyConst(updated);
  };

  const handleConstituencyChange = (index, field, value) => {
    const updated = [...assemblyConst];
    updated[index][field] = field === "ac_number" ? Number(value) || "" : value;
    setAssemblyConst(updated);
  };

  const handleSaveAssembly = async () => {
    try {
      const constituenciesData = {
        narration,
        assembly_const_count: assemblyConst.length,
        assembly_const: assemblyConst,
      };

      console.log("Saving data:", constituenciesData);

      if (isCreatingAssembly) {
        await createAssemblyConstituencies(MOBILE, EMAIL, constituenciesData);
        alert("Assembly Constituencies Created!");
      } else {
        await updateAssemblyConstituencies(MOBILE, EMAIL, constituenciesData);
        alert("Assembly Constituencies Updated!");
      }

      setAssemblyEditMode(false);
      setIsCreatingAssembly(false);
      setAssemblyMenuOpen(false);
      fetchAssemblyData();
    } catch (err) {
      console.error("Save error:", err);
      alert(isCreatingAssembly ? "Create Failed!" : "Update Failed!");
    }
  };

  const handleEditAssembly = () => {
    setAssemblyEditMode(true);
    setAssemblyMenuOpen(false);
  };

  const handleDeleteAssembly = async () => {
    if (!window.confirm("Delete all assembly constituencies?")) return;

    setAssemblyMenuOpen(false);
    try {
      await deleteAssemblyConstituencies(MOBILE, EMAIL);
      alert("Assembly Constituencies Deleted!");
      setAssemblyData(null);
      setNarration("");
      setAssemblyConst([]);
    } catch (err) {
      alert("Delete Failed!");
    }
  };

  const handleCancelAssembly = () => {
    setAssemblyEditMode(false);
    setIsCreatingAssembly(false);
    if (assemblyData) {
      setNarration(assemblyData.narration || "");
      setAssemblyConst(assemblyData.assembly_const || []);
    }
  };

  return (
    <div className="assembly-section">
      <div className="assembly-header">
        <div className="assembly-header-left">
          <FaMapMarkedAlt className="assembly-icon" />
          <div>
            <h2>Assembly Constituencies</h2>
            <p>Parliamentary constituency assembly segments</p>
          </div>
        </div>

        <div className="assembly-header-right">
          {!assemblyEditMode ? (
            <>
              {assemblyData ? (
                <div className="assembly-menu-wrapper">
                  <button
                    className="btn btn-menu"
                    onClick={() => setAssemblyMenuOpen(!assemblyMenuOpen)}
                  >
                    <FaEllipsisV />
                  </button>

                  {assemblyMenuOpen && (
                    <div className="menu-dropdown assembly-dropdown">
                      <button className="menu-edit" onClick={handleEditAssembly}>
                        <FaEdit /> Edit
                      </button>
                      <button className="menu-delete" onClick={handleDeleteAssembly}>
                        <FaTrashAlt /> Delete All
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button className="btn btn-create" onClick={handleCreateNewAssembly}>
                  <FaPlus /> Create Assembly Constituencies
                </button>
              )}
            </>
          ) : (
            <div className="edit-actions">
              <button className="btn btn-save" onClick={handleSaveAssembly}>
                <FaSave /> {isCreatingAssembly ? "Create" : "Save"}
              </button>
              <button className="btn btn-cancel" onClick={handleCancelAssembly}>
                <FaTimes /> Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {(!assemblyData && !isCreatingAssembly) ? (
        <div className="empty-state">
          <FaMapMarkerAlt size={60} />
          <h2>No Assembly Constituencies Found</h2>
          <p>Create assembly constituencies to get started</p>
          <button className="btn btn-create" onClick={handleCreateNewAssembly}>
            <FaPlus /> Create Assembly Constituencies
          </button>
        </div>
      ) : (
        <>
          {/* Narration Section */}
          <div className="assembly-narration-card">
            <div className="field-row">
              <div className="field-label">
                <FaInfoCircle /> {/* ✅ Now this will work */}
                <label>Narration</label>
              </div>
              {assemblyEditMode ? (
                <textarea
                  value={narration}
                  onChange={(e) => setNarration(e.target.value)}
                  rows={2}
                  placeholder="Enter narration..."
                />
              ) : (
                <p className="field-value">{assemblyData?.narration || "N/A"}</p>
              )}
            </div>
          </div>

          {/* Assembly Constituencies List */}
          <div className="assembly-grid">
            {assemblyEditMode ? (
              <>
                {assemblyConst.map((ac, index) => (
                  <div key={index} className="assembly-card edit-mode">
                    <div className="assembly-card-header">
                      <FaBuilding />
                      <span>AC #{index + 1}</span>
                      {assemblyConst.length > 1 && (
                        <button
                          className="remove-btn"
                          onClick={() => handleRemoveConstituency(index)}
                        >
                          <FaTimes />
                        </button>
                      )}
                    </div>

                    <div className="assembly-card-body">
                      <div className="input-group">
                        <label>AC Number</label>
                        <input
                          type="number"
                          value={ac.ac_number}
                          onChange={(e) => handleConstituencyChange(index, "ac_number", e.target.value)}
                          placeholder="Enter AC number"
                        />
                      </div>

                      <div className="input-group">
                        <label>AC Name</label>
                        <input
                          type="text"
                          value={ac.ac_name}
                          onChange={(e) => handleConstituencyChange(index, "ac_name", e.target.value)}
                          placeholder="Enter AC name"
                        />
                      </div>

                      <div className="input-group">
                        <label>District</label>
                        <input
                          type="text"
                          value={ac.district}
                          onChange={(e) => handleConstituencyChange(index, "district", e.target.value)}
                          placeholder="Enter district"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button className="add-constituency-btn" onClick={handleAddConstituency}>
                  <FaPlus /> Add Another Constituency
                </button>
              </>
            ) : (
              <>
                {assemblyData?.assembly_const?.map((ac, index) => (
                  <div key={ac._id || index} className="assembly-card">
                    <div className="assembly-card-header">
                      <FaBuilding />
                      <span>AC #{ac.ac_number}</span>
                    </div>

                    <div className="assembly-card-body">
                      <div className="info-row">
                        <FaMapMarkerAlt className="info-icon" />
                        <div>
                          <span className="info-label">Name</span>
                          <span className="info-value">{ac.ac_name}</span>
                        </div>
                      </div>

                      <div className="info-row">
                        <FaMapMarkedAlt className="info-icon" />
                        <div>
                          <span className="info-label">District</span>
                          <span className="info-value">{ac.district}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          {!assemblyEditMode && assemblyData && (
            <div className="assembly-summary">
              <FaListOl />
              <span>Total Assembly Constituencies: <strong>{assemblyData.assembly_const_count || 0}</strong></span>
            </div>
          )}
        </>
      )}
    </div>
  );
}