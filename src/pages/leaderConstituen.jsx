import { useEffect, useState, useRef } from "react";
import Cookies from "js-cookie";

// ---- Constituency Profile API ----
import {
  getConstituencyProfile,
  createConstituencyProfile,
  updateConstituencyProfile,
  deleteConstituencyProfile,
  uploadMemberImage,
  getMemberImage,
  getMemberImageBlob,
} from "../api/constituencyProfile";

// ---- Assembly Constituencies API ----
import {
  getAssemblyConstituencies,
  createAssemblyConstituencies,
  updateAssemblyConstituencies,
  deleteAssemblyConstituencies,
} from "../api/assemblyConstituencies";

// ---- Media Corner / Banner API ----
import {
  createMediaCorner,
  getMediaCornerList,
  deleteMediaCorner,
  updateMediaCorner,
} from "../api/mediacornerapi";

// ---- Icons ----
import {
  FaEdit,
  FaSave,
  FaTimes,
  FaTrashAlt,
  FaMapMarkerAlt,
  FaFlag,
  FaUser,
  FaUsers,
  FaLandmark,
  FaCalendarAlt,
  FaInfoCircle,
  FaChartPie,
  FaVoteYea,
  FaGlobe,
  FaMale,
  FaFemale,
  FaTransgender,
  FaCalculator,
  FaPercentage,
  FaBuilding,
  FaEllipsisV,
  FaPlus,
  FaCamera,
  FaMapMarkedAlt,
  FaListOl,
} from "react-icons/fa";

import "./Admin.css";

/* ============================================================
   1) BANNER
   ============================================================ */
function Banner() {
  const MOBILE = Cookies.get("leader_regd_mobile_no") || "";
  const EMAIL = Cookies.get("email") || "";

  const [images, setImages] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [file, setFile] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editFile, setEditFile] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMenu, setShowMenu] = useState(null);
  const [updating, setUpdating] = useState(false);

  const autoSlideRef = useRef(null);

  const loadImages = async () => {
    try {
      const res = await getMediaCornerList(MOBILE, EMAIL, "AC");
      setImages(res.data || res);
      setCurrentSlide(0);
    } catch (err) {
      console.error("Load Images Error:", err);
    }
  };

  useEffect(() => {
    if (images.length > 1) {
      autoSlideRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % (images.length + 1));
      }, 5000);
    }
    return () => {
      if (autoSlideRef.current) clearInterval(autoSlideRef.current);
    };
  }, [images.length]);

  useEffect(() => {
    loadImages();
  }, []);

  const handleAddImage = async (e) => {
    e.preventDefault();
    if (!file) return alert("Select Image!");

    setUpdating(true);
    const data = new FormData();
    data.append("leader_regd_mobile_no", MOBILE);
    data.append("user_email_id", EMAIL);
    data.append("media_header", "null");
    data.append("media_narration", "null");
    data.append("media_url", "null");
    data.append("media_type", "AC");
    data.append("media_file", file);

    try {
      await createMediaCorner(data);
      alert("Image Added Successfully!");
      setShowUpload(false);
      setFile(null);
      loadImages();
    } catch (err) {
      alert("Upload Failed!");
    }
    setUpdating(false);
  };

  const handleUpdateImage = async () => {
    if (!editFile) return alert("Please select a new image!");

    setUpdating(true);
    const data = new FormData();
    data.append("id", editId);
    data.append("leader_regd_mobile_no", MOBILE);
    data.append("user_email_id", EMAIL);
    data.append("media_type", "AC");
    data.append("media_header", "null");
    data.append("media_file", editFile);

    try {
      await updateMediaCorner(data);
      alert("Updated!");
      setShowEditModal(false);
      setEditFile(null);
      setEditId(null);
      setShowMenu(null);
      loadImages();
    } catch (err) {
      alert("Failed!");
    }
    setUpdating(false);
  };

  const handleDeleteImage = async (id) => {
    if (!window.confirm("Delete this image?")) return;
    try {
      await deleteMediaCorner(id, MOBILE, EMAIL);
      alert("Deleted!");
      setShowMenu(null);
      loadImages();
    } catch (err) {
      alert("Delete Failed!");
    }
  };

  const getImageURL = (file) =>
    `/api/mediacorner/asset/?leader_regd_mobile_no=${MOBILE}&user_email_id=${EMAIL}&media_file=${file}`;

  const totalSlides = images.length + 1;

  const nextSlide = () => {
    if (autoSlideRef.current) clearInterval(autoSlideRef.current);
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    if (autoSlideRef.current) clearInterval(autoSlideRef.current);
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const openEditModal = (img) => {
    setEditId(img._id);
    setShowEditModal(true);
    setShowMenu(null);
  };

  return (
    <>
      <div className="banner-wrapper">
        {images.map((img, index) => (
          <div
            key={img._id}
            className={`banner-slide ${currentSlide === index ? "active" : ""}`}
          >
            <img
              src={getImageURL(img.media_file)}
              alt={img.media_header}
              className="banner-image"
            />

            <button
              onClick={() => setShowMenu(showMenu === img._id ? null : img._id)}
              className="menu-btn"
            >
              ⋮
            </button>

            {showMenu === img._id && (
              <div className="menu-dropdown">
                <button className="menu-edit" onClick={() => openEditModal(img)}>
                  ✏️ Edit
                </button>
                <button
                  className="menu-delete"
                  onClick={() => handleDeleteImage(img._id)}
                >
                  🗑️ Delete
                </button>
              </div>
            )}
          </div>
        ))}

        <div
          className={`add-banner-slide ${currentSlide === images.length ? "active" : ""}`}
        >
          <button className="add-btn" onClick={() => setShowUpload(true)}>
            +
          </button>
        </div>

        {totalSlides > 1 && (
          <>
            <button className="banner-nav-left" onClick={prevSlide}>
              ‹
            </button>
            <button className="banner-nav-right" onClick={nextSlide}>
              ›
            </button>
          </>
        )}

        <div className="dots">
          {[...Array(totalSlides)].map((_, index) => (
            <button
              key={index}
              className={`dot ${currentSlide === index ? "active" : ""}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>

      {showUpload && (
        <div
          className="modal"
          onClick={(e) => e.target === e.currentTarget && setShowUpload(false)}
        >
          <div className="modal-box">
            <h2>📤 Add New Banner</h2>

            <label htmlFor="banner-file-input" className="custom-file-label">
              {file ? (
                <span className="file-selected">✓ {file.name}</span>
              ) : (
                <>
                  <span className="file-icon">📁</span>
                  <span>Click to select an image</span>
                </>
              )}
            </label>
            <input
              id="banner-file-input"
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              className="hidden-file-input"
            />

            <div className="btn-row">
              <button className="btn-green" onClick={handleAddImage} disabled={!file}>
                Upload
              </button>
              <button
                className="btn-gray"
                onClick={() => {
                  setShowUpload(false);
                  setFile(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div
          className="modal"
          onClick={(e) => e.target === e.currentTarget && setShowEditModal(false)}
        >
          <div className="modal-box">
            <h2>✏️ Edit Banner</h2>

            <label htmlFor="banner-edit-input" className="custom-file-label edit-mode">
              {editFile ? (
                <span className="file-selected edit">✓ {editFile.name}</span>
              ) : (
                <>
                  <span className="file-icon">🖼️</span>
                  <span>Click to select new image</span>
                </>
              )}
            </label>
            <input
              id="banner-edit-input"
              type="file"
              accept="image/*"
              onChange={(e) => setEditFile(e.target.files[0])}
              className="hidden-file-input"
            />

            <div className="btn-row">
              <button
                className="btn-blue"
                onClick={handleUpdateImage}
                disabled={!editFile}
              >
                Update
              </button>
              <button
                className="btn-gray"
                onClick={() => {
                  setShowEditModal(false);
                  setEditId(null);
                  setEditFile(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ============================================================
   2) CONSTITUENCY PROFILE
   ============================================================ */
function ConstituencyProfile() {
  const MOBILE = Cookies.get("leader_regd_mobile_no") || "";
  const EMAIL = Cookies.get("email") || "";

  const [data, setData] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const [memberImage, setMemberImage] = useState(null);
  const [memberImageFile, setMemberImageFile] = useState(null);
  const [showMemberImageModal, setShowMemberImageModal] = useState(false);
  const [memberImageMenuOpen, setMemberImageMenuOpen] = useState(false);
  const [uploadingMemberImage, setUploadingMemberImage] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getConstituencyProfile(MOBILE, EMAIL);
      setData(res?.data || null);
      setFormData(res?.data || {});
      setIsCreating(false);
    } catch (err) {
      console.error(err);
      setData(null);
      setIsCreating(false);
    }
    setLoading(false);
  };

  const fetchMemberImage = async () => {
    try {
      try {
        const blobRes = await getMemberImageBlob(MOBILE, EMAIL);
        if (blobRes?.data?.imageUrl) {
          setMemberImage(blobRes.data.imageUrl);
          return;
        }
      } catch (blobErr) {
        console.log("⚠️ Blob fetch failed, trying text response...", blobErr.message);
      }

      const res = await getMemberImage(MOBILE, EMAIL);
      const imageData = res?.data?.leader_image || res?.data?.image || res?.leader_image;

      if (imageData && imageData !== "none" && imageData !== "null") {
        if (imageData.startsWith("http")) {
          setMemberImage(imageData);
        } else if (imageData.startsWith("data:image")) {
          setMemberImage(imageData);
        } else {
          const filename = imageData.split(/[/\\]/).pop();
          setMemberImage(`/uploads/constituency_images/${filename}`);
        }
      } else {
        setMemberImage(null);
      }
    } catch (err) {
      console.error("❌ Member image fetch error:", err);
      setMemberImage(null);
    }
  };

  useEffect(() => {
    fetchData();
    fetchMemberImage();
  }, []);

  const handleMemberImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file!");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB!");
        return;
      }
      setMemberImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleUploadMemberImage = async () => {
    if (!memberImageFile) {
      alert("Please select an image!");
      return;
    }
    setUploadingMemberImage(true);
    try {
      await uploadMemberImage(memberImageFile, MOBILE, EMAIL);
      alert("Member Image Uploaded Successfully!");
      setShowMemberImageModal(false);
      setMemberImageFile(null);
      setImagePreview(null);
      setMemberImageMenuOpen(false);
      setTimeout(() => {
        fetchMemberImage();
        setUploadingMemberImage(false);
      }, 500);
    } catch (err) {
      console.error("❌ Upload error:", err);
      setUploadingMemberImage(false);
      alert(`Upload Failed: ${err.message}`);
    }
  };

  const openMemberImageModal = () => {
    setShowMemberImageModal(true);
    setMemberImageMenuOpen(false);
    setImagePreview(null);
    setMemberImageFile(null);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCreateNew = () => {
    setIsCreating(true);
    setEditMode(true);
    setFormData({
      const_no: "",
      constituency_type: "",
      const_name: "",
      district: "",
      state: "",
      established: "",
      overview: "",
      sitting_member: "",
      member_image: "",
      member_party: "",
      election_year: "",
      electon_header: "",
      geography: "",
      eci_lablel: "",
      eci_url: "",
      reservation_status: "",
      assembly_segment_count: "",
      polling_station_label: "",
      polling_station_count: "",
      electors_breakups_label: "",
      electors_general_label: "",
      electors_general_male_data: "",
      electors_general_female_data: "",
      electors_general_tg_data: "",
      electors_general_total_data: "",
      electors_overseas_label: "",
      electors_overseas_male_data: "",
      electors_overseas_female_data: "",
      electors_overseas_tg_data: "",
      electors_overseas_total_data: "",
      electors_service_label: "",
      electors_service_male_data: "",
      electors_service_female_data: "",
      electors_service_tg_data: "",
      electors_service_total_data: "",
      electors_total_male_data: "",
      electors_total_female_data: "",
      electors_total_tg_data: "",
      electors_grand_total_data: "",
      avg_no_electors_per_ps_label: "",
      avg_no_electors_per_ps_data: "",
      total_no_voters_label: "",
      total_no_voters_data: "",
      voter_trunout_ratio_label: "",
      voter_trunout_ratio_data: "",
    });
  };

  const handleSave = async () => {
    try {
      if (isCreating) {
        await createConstituencyProfile(formData);
        alert("Profile Created Successfully!");
      } else {
        await updateConstituencyProfile(formData);
        alert("Profile Updated Successfully!");
      }
      setEditMode(false);
      setIsCreating(false);
      setProfileMenuOpen(false);
      await fetchData();
      await fetchMemberImage();
    } catch (err) {
      console.error("Save error:", err);
      alert(isCreating ? "Create Failed!" : "Update Failed!");
    }
  };

  const handleEditProfile = () => {
    setEditMode(true);
    setProfileMenuOpen(false);
  };

  const handleDeleteProfile = async () => {
    if (!window.confirm("Delete Constituency Profile?")) return;
    setProfileMenuOpen(false);
    try {
      await deleteConstituencyProfile(MOBILE, EMAIL);
      alert("Constituency Profile Deleted Successfully!");
      setData(null);
      setFormData({});
      setEditMode(false);
      setIsCreating(false);
    } catch (err) {
      alert("Delete Failed!");
      console.error(err);
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setIsCreating(false);
    setFormData(data || {});
  };

  const renderField = (label, key, icon, type = "text") => (
    <div className="field-row">
      <div className="field-label">
        {icon}
        <label>{label}</label>
      </div>
      {editMode ? (
        type === "textarea" ? (
          <textarea name={key} value={formData[key] || ""} onChange={handleChange} rows={3} />
        ) : (
          <input type={type} name={key} value={formData[key] || ""} onChange={handleChange} />
        )
      ) : (
        <p className="field-value">{data?.[key] || "N/A"}</p>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="loading-wrapper">
        <div className="spinner"></div>Loading...
      </div>
    );
  }

  return (
    <div className="profile-section">
      {/* Header */}
      <div className="profile-header">
        <div className="profile-header-left">
          <FaLandmark className="profile-icon" />
          <div>
            <h2>Constituency Profile</h2>
            <p>Parliamentary constituency information and statistics</p>
          </div>
        </div>

        <div className="profile-header-right">
          {!editMode ? (
            <>
              {data ? (
                <div className="profile-menu-wrapper">
                  <button
                    className="btn btn-menu"
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  >
                    <FaEllipsisV />
                  </button>
                  {profileMenuOpen && (
                    <div className="menu-dropdown profile-dropdown">
                      <button className="menu-edit" onClick={handleEditProfile}>
                        <FaEdit /> Edit
                      </button>
                      <button className="menu-delete" onClick={handleDeleteProfile}>
                        <FaTrashAlt /> Delete Profile
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button className="btn btn-create" onClick={handleCreateNew}>
                  <FaPlus /> Create Profile
                </button>
              )}
            </>
          ) : (
            <div className="edit-actions">
              <button className="btn btn-save" onClick={handleSave}>
                <FaSave /> {isCreating ? "Create" : "Save"}
              </button>
              <button className="btn btn-cancel" onClick={handleCancelEdit}>
                <FaTimes /> Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Member Image */}
      <div className="member-image-section">
        <div className="member-image-container">
          {uploadingMemberImage && (
            <div className="image-loading-overlay">
              <div className="spinner"></div>
              <p style={{ color: "white", marginTop: "10px", fontSize: "14px" }}>
                {memberImage ? "Updating..." : "Uploading..."}
              </p>
            </div>
          )}

          {memberImage ? (
            <>
              <img
                src={memberImage}
                alt="Member"
                className="member-profile-image"
                onError={(e) => {
                  console.error("Image load error:", memberImage);
                  e.target.style.display = "none";
                }}
              />
              <button
                className="image-menu-btn"
                onClick={() => setMemberImageMenuOpen(!memberImageMenuOpen)}
              >
                ✏️
              </button>
              {memberImageMenuOpen && (
                <div className="image-menu-dropdown">
                  <button className="menu-edit" onClick={openMemberImageModal}>
                    <FaEdit /> Change Image
                  </button>
                </div>
              )}
            </>
          ) : (
            <div
              className="member-image-placeholder"
              onClick={() => setShowMemberImageModal(true)}
            >
              <FaCamera size={40} />
              <p>Add Member Image</p>
            </div>
          )}
        </div>
      </div>

      {showMemberImageModal && (
        <div
          className="modal"
          onClick={(e) => e.target === e.currentTarget && setShowMemberImageModal(false)}
        >
          <div className="modal-box">
            <h2>📷 {memberImage ? "Update" : "Upload"} Member Image</h2>
            {imagePreview && (
              <div className="image-preview-container">
                <img src={imagePreview} alt="Preview" className="image-preview" />
              </div>
            )}
            <label htmlFor="member-image-input" className="custom-file-label">
              {memberImageFile ? (
                <span className="file-selected">
                  ✓ {memberImageFile.name} ({(memberImageFile.size / 1024).toFixed(1)} KB)
                </span>
              ) : (
                <>
                  <span className="file-icon">👤</span>
                  <span>Click to select member image</span>
                  <span className="file-hint">(Max 5MB, JPG/PNG)</span>
                </>
              )}
            </label>
            <input
              id="member-image-input"
              type="file"
              accept="image/*"
              onChange={handleMemberImageSelect}
              className="hidden-file-input"
            />
            <div className="btn-row">
              <button
                className="btn-green"
                onClick={handleUploadMemberImage}
                disabled={!memberImageFile || uploadingMemberImage}
              >
                {uploadingMemberImage ? "Uploading..." : memberImage ? "Update" : "Upload"}
              </button>
              <button
                className="btn-gray"
                onClick={() => {
                  setShowMemberImageModal(false);
                  setMemberImageFile(null);
                  setImagePreview(null);
                }}
                disabled={uploadingMemberImage}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      {data && !editMode && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon orange">
              <FaMapMarkerAlt />
            </div>
            <div className="stat-content">
              <h3>{data.constituency_type || "Type"}</h3>
              <p>Type</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green">
              <FaUser />
            </div>
            <div className="stat-content">
              <h3>{data.sitting_member || "Member"}</h3>
              <p>Sitting Member</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon blue">
              <FaUsers />
            </div>
            <div className="stat-content">
              <h3>{data.polling_station_count || 0}</h3>
              <p>Polling Stations</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon purple">
              <FaChartPie />
            </div>
            <div className="stat-content">
              <h3>{data.total_no_voters_data || 0}</h3>
              <p>Total Voters</p>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!data && !isCreating ? (
        <div className="empty-state">
          <FaMapMarkerAlt size={60} />
          <h2>No Constituency Profile Found</h2>
          <p>Create a new constituency profile to get started</p>
          <button className="btn btn-create" onClick={handleCreateNew}>
            <FaPlus /> Create New Profile
          </button>
        </div>
      ) : (
        <div className="content-wrapper two-column">
          <div className="left-column">
            <div className="section-card">
              <h2><FaMapMarkerAlt /> Constituency Information</h2>
              {renderField("Constituency No", "const_no", <FaInfoCircle />)}
              {renderField("Constituency Type", "constituency_type", <FaLandmark />)}
              {renderField("Constituency Name", "const_name", <FaMapMarkerAlt />)}
              {renderField("District", "district", <FaMapMarkerAlt />)}
              {renderField("State", "state", <FaFlag />)}
              {renderField("Established", "established", <FaCalendarAlt />)}
              {renderField("Reservation Status", "reservation_status", <FaInfoCircle />)}
              {renderField("Overview", "overview", <FaInfoCircle />, "textarea")}
              {renderField("Geography", "geography", <FaGlobe />, "textarea")}
            </div>

            <div className="section-card">
              <h2><FaUser /> Member Information</h2>
              {renderField("Sitting Member", "sitting_member", <FaUser />)}
              {renderField("Member Party", "member_party", <FaFlag />)}
              {renderField("Election Year", "election_year", <FaCalendarAlt />)}
              {renderField("Election Header", "electon_header", <FaInfoCircle />, "textarea")}
            </div>

            <div className="section-card">
              <h2><FaBuilding /> Assembly & Polling Data</h2>
              {renderField("Assembly Segment Count", "assembly_segment_count", <FaChartPie />)}
              {renderField("Polling Station Label", "polling_station_label", <FaInfoCircle />)}
              {renderField("Polling Station Count", "polling_station_count", <FaBuilding />)}
              {renderField("Avg Electors/PS Label", "avg_no_electors_per_ps_label", <FaInfoCircle />)}
              {renderField("Avg Electors/PS", "avg_no_electors_per_ps_data", <FaCalculator />)}
            </div>

            <div className="section-card">
              <h2><FaGlobe /> ECI Information</h2>
              {renderField("ECI Label", "eci_lablel", <FaInfoCircle />)}
              {renderField("ECI URL", "eci_url", <FaGlobe />)}
            </div>
          </div>

          <div className="right-column">
            <div className="section-card">
              <h2><FaUsers /> General Electors</h2>
              {renderField("General Label", "electors_general_label", <FaInfoCircle />)}
              {renderField("Male", "electors_general_male_data", <FaMale />)}
              {renderField("Female", "electors_general_female_data", <FaFemale />)}
              {renderField("Transgender", "electors_general_tg_data", <FaTransgender />)}
              {renderField("Total", "electors_general_total_data", <FaUsers />)}
            </div>

            <div className="section-card">
              <h2><FaGlobe /> Overseas Electors</h2>
              {renderField("Overseas Label", "electors_overseas_label", <FaInfoCircle />)}
              {renderField("Male", "electors_overseas_male_data", <FaMale />)}
              {renderField("Female", "electors_overseas_female_data", <FaFemale />)}
              {renderField("Transgender", "electors_overseas_tg_data", <FaTransgender />)}
              {renderField("Total", "electors_overseas_total_data", <FaUsers />)}
            </div>

            <div className="section-card">
              <h2><FaFlag /> Service Electors</h2>
              {renderField("Service Label", "electors_service_label", <FaInfoCircle />)}
              {renderField("Male", "electors_service_male_data", <FaMale />)}
              {renderField("Female", "electors_service_female_data", <FaFemale />)}
              {renderField("Transgender", "electors_service_tg_data", <FaTransgender />)}
              {renderField("Total", "electors_service_total_data", <FaUsers />)}
            </div>

            <div className="section-card">
              <h2><FaChartPie /> Total Electors Summary</h2>
              {renderField("Electors Breakup Label", "electors_breakups_label", <FaInfoCircle />)}
              {renderField("Total Male", "electors_total_male_data", <FaMale />)}
              {renderField("Total Female", "electors_total_female_data", <FaFemale />)}
              {renderField("Total Transgender", "electors_total_tg_data", <FaTransgender />)}
              {renderField("Grand Total", "electors_grand_total_data", <FaUsers />)}
            </div>

            <div className="section-card">
              <h2><FaVoteYea /> Voter Information</h2>
              {renderField("Total Voters Label", "total_no_voters_label", <FaInfoCircle />)}
              {renderField("Total Voters", "total_no_voters_data", <FaVoteYea />)}
              {renderField("Turnout Ratio Label", "voter_trunout_ratio_label", <FaInfoCircle />)}
              {renderField("Turnout Ratio", "voter_trunout_ratio_data", <FaPercentage />)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   3) ASSEMBLY CONSTITUENCIES (UPDATED WITH CREATE BUTTON)
   ============================================================ */
function AssemblyConstituencies() {
  const MOBILE = Cookies.get("leader_regd_mobile_no") || "";
  const EMAIL = Cookies.get("email") || "";

  const [assemblyData, setAssemblyData] = useState(null);
  const [narration, setNarration] = useState("");
  const [assemblyConst, setAssemblyConst] = useState([]);
  const [assemblyEditMode, setAssemblyEditMode] = useState(false);
  const [isCreatingAssembly, setIsCreatingAssembly] = useState(false);
  const [assemblyMenuOpen, setAssemblyMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAssemblyData = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await getAssemblyConstituencies(MOBILE, EMAIL);
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

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Loading Assembly Constituencies...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        <h3>Error Loading Data</h3>
        <p>{error}</p>
        <button className="btn btn-retry" onClick={fetchAssemblyData}>
          Retry
        </button>
      </div>
    );
  }

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
    setAssemblyConst(assemblyConst.filter((_, i) => i !== index));
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
                /* 🟢 FIXED: Add New Button for Assembly */
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

      {!assemblyData && !isCreatingAssembly ? (
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
          <div className="assembly-narration-card">
            <div className="field-row">
              <div className="field-label">
                <FaInfoCircle />
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
              <span>
                Total Assembly Constituencies: <strong>{assemblyData.assembly_const_count || 0}</strong>
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ============================================================
   4) PAGE — ties everything together
   ============================================================ */
const TABS = [
  { id: "profile", label: "Constituency profile", icon: "📊" },
  { id: "assembly", label: "Assembly constituencies", icon: "🗺️" },
];

export default function LeaderConstituency() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="about-container">
      <Banner />

      <div className="about-layout">
        <nav className="about-tabs" aria-label="About sections">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`about-side-tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
              aria-current={activeTab === tab.id ? "true" : undefined}
            >
              <span className="about-tab-icon" aria-hidden="true">
                {tab.icon}
              </span>
              <span className="about-tab-text">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="about-content">
          <div className="about-tab-panel" key={activeTab}>
            {activeTab === "profile" ? <ConstituencyProfile /> : <AssemblyConstituencies />}
          </div>
        </div>
      </div>
    </div>
  );
}