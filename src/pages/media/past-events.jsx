import { useEffect, useState } from "react";
import Cookies from "js-cookie"; // ✅ ADD THIS IMPORT

import {
  createMediaCorner,
  getMediaCornerList,
  deleteMediaCorner,
  updateMediaCorner,
} from "../../api/mediacornerapi";
import "./PastEvents.css";

export default function PastEvents() {

  const leaderMobile = Cookies.get("leader_regd_mobile_no");
  const useremail = Cookies.get("email");

  const [mediaList, setMediaList] = useState([]);
  const [file, setFile] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState({});

  const [editForm, setEditForm] = useState({
    media_header: "",
    media_narration: "",
    media_url: "",
    media_type: "",
    media_file: "",
  });

  const [formData, setFormData] = useState({
    leader_regd_mobile_no:   leaderMobile || "",
    user_email_id: useremail  || "",
    media_header: "",
    media_narration: "",
    media_url: "",
    media_type: "PE",
  });

  // Load Media List
  const loadMedia = async () => {
    try {
      const res = await getMediaCornerList(
        formData.leader_regd_mobile_no,
        formData.user_email_id,
        formData.media_type
      );
      setMediaList(res.data || res);
    } catch (error) {
      console.error("Error fetching media:", error);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  // ✅ FIXED: Add New Media
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      
      // ✅ Explicitly append all required fields with correct names
      data.append("leader_regd_mobile_no", formData.leader_regd_mobile_no);
      data.append("user_email_id", formData.user_email_id);
      data.append("media_type", formData.media_type);
      data.append("media_header", formData.media_header);
      data.append("media_narration", formData.media_narration);
      
      // Optional fields
      if (formData.media_url && formData.media_url.trim() !== "") {
        data.append("media_url", formData.media_url);
      }
      
      if (file) {
        data.append("media_file", file);
      }

      // Debug log (remove in production)
      console.log("=== Sending FormData ===");
      for (let [key, value] of data.entries()) {
        console.log(key, ":", value);
      }

      await createMediaCorner(data);
      alert("Media Uploaded Successfully!");
      
      // Reset form
      setFormData({ 
        ...formData, 
        media_header: "", 
        media_narration: "", 
        media_url: "" 
      });
      setFile(null);
      setShowForm(false);
      loadMedia();
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed: " + (error.response?.data?.message || error.message));
    }
  };

  // Start Edit
  const startEdit = (item) => {
    setEditingId(item._id);
    setEditForm({
      media_header: item.media_header || "",
      media_narration: item.media_narration || "",
      media_url: item.media_url || "",
      media_type: item.media_type || "",
      media_file: item.media_file || "",
    });
    setFile(null);
  };

  // ✅ FIXED: Handle Edit Submit
  const handleEditSubmit = async (e, id) => {
    e.preventDefault();
    try {
      const data = new FormData();
      
      // ✅ Explicitly append all required fields
      data.append("id", id);
      data.append("leader_regd_mobile_no", formData.leader_regd_mobile_no);
      data.append("user_email_id", formData.user_email_id);
      data.append("media_type", editForm.media_type || formData.media_type);
      data.append("media_header", editForm.media_header);
      data.append("media_narration", editForm.media_narration);
      
      if (editForm.media_url && editForm.media_url.trim() !== "") {
        data.append("media_url", editForm.media_url);
      }

      if (file) {
        data.append("media_file", file);
      } else if (editForm.media_file) {
        data.append("media_file_name", editForm.media_file);
      }

      // Debug log (remove in production)
      console.log("=== Updating with FormData ===");
      for (let [key, value] of data.entries()) {
        console.log(key, ":", value);
      }

      await updateMediaCorner(data);
      alert("Updated Successfully!");
      setEditingId(null);
      setFile(null);
      loadMedia();
    } catch (err) {
      console.error("Update failed:", err);
      alert("Update failed: " + (err.response?.data?.message || err.message));
    }
  };

  // Delete Media
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this media?")) return;
    try {
      await deleteMediaCorner(
        id, 
        formData.leader_regd_mobile_no, 
        formData.user_email_id
      );
      alert("Deleted Successfully!");
      loadMedia();
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Delete failed: " + (error.response?.data?.message || error.message));
    }
  };

  // ✅ FIXED: Media URL Helper
  const getMediaURL = (fileName) => {
    if (!fileName) return "";
    return `/api/mediacorner/asset/?leader_regd_mobile_no=${encodeURIComponent(
      formData.leader_regd_mobile_no
    )}&user_email_id=${encodeURIComponent(
      formData.user_email_id
    )}&media_file=${encodeURIComponent(fileName)}`;
  };

  return (
    <div className="video-container">
      <div className="video-header">
        <h2>🎬 Media Corner</h2>
        <button className="add-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Close" : "➕ Add Media"}
        </button>
      </div>

      {/* ADD FORM */}
      {showForm && (
        <form onSubmit={handleAddSubmit} className="media-form">
          <input
            type="text"
            placeholder="Media Header *"
            value={formData.media_header}
            onChange={(e) => setFormData({ ...formData, media_header: e.target.value })}
            required
          />
          <textarea
            placeholder="Media Description *"
            value={formData.media_narration}
            onChange={(e) => setFormData({ ...formData, media_narration: e.target.value })}
            required
            rows="4"
          ></textarea>
          <input
            type="text"
            placeholder="Media URL (optional)"
            value={formData.media_url}
            onChange={(e) => setFormData({ ...formData, media_url: e.target.value })}
          />
          
          {/* File Input */}
          <div className="file-input-wrapper">
            <label htmlFor="file-upload" className="file-label">
              📁 {file ? file.name : "Choose Image/Video"}
            </label>
            <input 
              id="file-upload"
              type="file" 
              accept="image/*,video/*" 
              onChange={(e) => setFile(e.target.files[0])}
              style={{ display: 'none' }}
            />
          </div>

          <button type="submit" className="upload-btn">Upload Media</button>
        </form>
      )}

      {/* MEDIA LIST */}
      <div className="media-grid">
        {mediaList.length === 0 ? (
          <p className="empty-text">No media found. Add your first media!</p>
        ) : (
          mediaList.map((item) => (
            <div key={item._id} id={item._id} className="media-card">
              {editingId === item._id ? (
                <form className="edit-inline-form" onSubmit={(e) => handleEditSubmit(e, item._id)}>
                  <input
                    type="text"
                    placeholder="Media Header *"
                    value={editForm.media_header}
                    onChange={(e) => setEditForm({ ...editForm, media_header: e.target.value })}
                    required
                  />
                  <textarea
                    placeholder="Media Description *"
                    value={editForm.media_narration}
                    onChange={(e) => setEditForm({ ...editForm, media_narration: e.target.value })}
                    required
                    rows="4"
                  ></textarea>
                  <input
                    type="text"
                    placeholder="Media URL (optional)"
                    value={editForm.media_url}
                    onChange={(e) => setEditForm({ ...editForm, media_url: e.target.value })}
                  />
                  
                  {/* File Input in Edit Mode */}
                  <div className="file-input-wrapper">
                    <label htmlFor={`file-upload-edit-${item._id}`} className="file-label">
                      📁 {file ? file.name : "Change Image/Video"}
                    </label>
                    <input 
                      id={`file-upload-edit-${item._id}`}
                      type="file" 
                      accept="image/*,video/*" 
                      onChange={(e) => setFile(e.target.files[0])}
                      style={{ display: 'none' }}
                    />
                  </div>

                  <div className="edit-actions">
                    <button type="submit" className="upload-btn">Update</button>
                    <button 
                      type="button" 
                      className="cancel-btn" 
                      onClick={() => {
                        setEditingId(null);
                        setFile(null);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  {/* Three-dot dropdown */}
                  <div className="mc-dropdown-container">
                    <button
                      className="mc-dropdown-btn"
                      onClick={() =>
                        setDropdownOpen((prev) => ({ ...prev, [item._id]: !prev[item._id] }))
                      }
                    >
                      ⋮
                    </button>
                    {dropdownOpen[item._id] && (
                      <div className="mc-dropdown-menu">
                        <button
                          className="mc-dropdown-item"
                          onClick={() => {
                            startEdit(item);
                            setDropdownOpen({});
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="mc-dropdown-item delete"
                          onClick={() => {
                            handleDelete(item._id);
                            setDropdownOpen({});
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Media Display */}
                  {item.media_file &&
                    (item.media_file.endsWith(".mp4") || 
                     item.media_file.endsWith(".webm") ||
                     item.media_file.endsWith(".mov")) ? (
                    <video 
                      controls 
                      src={getMediaURL(item.media_file)} 
                      className="media-video"
                      onError={(e) => console.error("Video load error:", e)}
                    />
                  ) : item.media_file ? (
                    <img 
                      src={getMediaURL(item.media_file)} 
                      className="media-img" 
                      alt={item.media_header || "media"}
                      onError={(e) => {
                        console.error("Image load error:", e);
                        e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23ddd' width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999'%3ENo Image%3C/text%3E%3C/svg%3E";
                      }}
                    />
                  ) : (
                    <div className="media-placeholder">📷 No Media</div>
                  )}

                  <h3>{item.media_header}</h3>
                  <p className="media-desc">{item.media_narration}</p>

                  {item.media_url && (
                    <button 
                      className="read-more-btn" 
                      onClick={() => window.open(item.media_url, "_blank")}
                    >
                      🔗 Read More
                    </button>
                  )}
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}