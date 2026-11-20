// import { useState, useEffect } from "react";
// import Cookies from "js-cookie";
// import {
//   getConstituencyProfile,
//   createConstituencyProfile,
//   updateConstituencyProfile,
//   deleteConstituencyProfile,
//   uploadMemberImage,
//   getMemberImage,
//   getMemberImageBlob,
// } from "../api/constituencyProfile";
// import {
//   FaEdit,
//   FaSave,
//   FaTimes,
//   FaTrashAlt,
//   FaMapMarkerAlt,
//   FaFlag,
//   FaUser,
//   FaUsers,
//   FaLandmark,
//   FaCalendarAlt,
//   FaInfoCircle,
//   FaChartPie,
//   FaVoteYea,
//   FaGlobe,
//   FaMale,
//   FaFemale,
//   FaTransgender,
//   FaCalculator,
//   FaPercentage,
//   FaBuilding,
//   FaEllipsisV,
//   FaPlus,
//   FaCamera,
// } from "react-icons/fa";
// import "./CP.css";

// export default function ConstituencyProfile() {
//   const MOBILE = Cookies.get("leader_regd_mobile_no") || "";
//   const EMAIL = Cookies.get("email") || "";

//   // Profile States
//   const [data, setData] = useState(null);
//   const [formData, setFormData] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [editMode, setEditMode] = useState(false);
//   const [isCreating, setIsCreating] = useState(false);
//   const [profileMenuOpen, setProfileMenuOpen] = useState(false);

//   // Member Image States
//   const [memberImage, setMemberImage] = useState(null);
//   const [memberImageFile, setMemberImageFile] = useState(null);
//   const [showMemberImageModal, setShowMemberImageModal] = useState(false);
//   const [memberImageMenuOpen, setMemberImageMenuOpen] = useState(false);
//   const [uploadingMemberImage, setUploadingMemberImage] = useState(false);
//   const [imagePreview, setImagePreview] = useState(null);

//   // Fetch profile data
//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const res = await getConstituencyProfile(MOBILE, EMAIL);
//       setData(res?.data || null);
//       setFormData(res?.data || {});
//       setIsCreating(false);
//     } catch (err) {
//       console.error(err);
//       setData(null);
//       setIsCreating(false);
//     }
//     setLoading(false);
//   };

//   // Fetch member image
//   const fetchMemberImage = async () => {
//     try {
//       console.log('🔍 Fetching member image...');

//       try {
//         const blobRes = await getMemberImageBlob(MOBILE, EMAIL);
//         if (blobRes?.data?.imageUrl) {
//           console.log('✅ Got image blob URL:', blobRes.data.imageUrl);
//           setMemberImage(blobRes.data.imageUrl);
//           return;
//         }
//       } catch (blobErr) {
//         console.log('⚠️ Blob fetch failed, trying text response...', blobErr.message);
//       }

//       const res = await getMemberImage(MOBILE, EMAIL);
//       const imageData = res?.data?.leader_image || res?.data?.image || res?.leader_image;

//       if (imageData && imageData !== 'none' && imageData !== 'null') {
//         if (imageData.startsWith('http')) {
//           setMemberImage(imageData);
//         } else if (imageData.startsWith('data:image')) {
//           setMemberImage(imageData);
//         } else {
//           const filename = imageData.split(/[/\\]/).pop();
//           const imageUrl = `/uploads/constituency_images/${filename}`;
//           setMemberImage(imageUrl);
//         }
//       } else {
//         setMemberImage(null);
//       }
//     } catch (err) {
//       console.error("❌ Member image fetch error:", err);
//       setMemberImage(null);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//     fetchMemberImage();
//   }, []);

//   // Member image handlers
//   const handleMemberImageSelect = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (!file.type.startsWith('image/')) {
//         alert('Please select an image file!');
//         return;
//       }

//       if (file.size > 5 * 1024 * 1024) {
//         alert('File size must be less than 5MB!');
//         return;
//       }

//       setMemberImageFile(file);

//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImagePreview(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleUploadMemberImage = async () => {
//     if (!memberImageFile) {
//       alert("Please select an image!");
//       return;
//     }

//     setUploadingMemberImage(true);
//     try {
//       await uploadMemberImage(memberImageFile, MOBILE, EMAIL);
//       alert("Member Image Uploaded Successfully!");
//       setShowMemberImageModal(false);
//       setMemberImageFile(null);
//       setImagePreview(null);
//       setMemberImageMenuOpen(false);

//       setTimeout(() => {
//         fetchMemberImage();
//         setUploadingMemberImage(false);
//       }, 500);
//     } catch (err) {
//       console.error("❌ Upload error:", err);
//       setUploadingMemberImage(false);
//       alert(`Upload Failed: ${err.message}`);
//     }
//   };

 

//   const openMemberImageModal = () => {
//     setShowMemberImageModal(true);
//     setMemberImageMenuOpen(false);
//     setImagePreview(null);
//     setMemberImageFile(null);
//   };

//   // Profile handlers
//   const handleChange = (e) => {
//     setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleCreateNew = () => {
//     setIsCreating(true);
//     setEditMode(true);
//     setFormData({
//       const_no: "",
//       constituency_type: "",
//       const_name: "",
//       district: "",
//       state: "",
//       established: "",
//       overview: "",
//       sitting_member: "",
//       member_image: "",
//       member_party: "",
//       election_year: "",
//       electon_header: "",
//       geography: "",
//       eci_lablel: "",
//       eci_url: "",
//       reservation_status: "",
//       assembly_segment_count: "",
//       polling_station_label: "",
//       polling_station_count: "",
//       electors_breakups_label: "",
//       electors_general_label: "",
//       electors_general_male_data: "",
//       electors_general_female_data: "",
//       electors_general_tg_data: "",
//       electors_general_total_data: "",
//       electors_overseas_label: "",
//       electors_overseas_male_data: "",
//       electors_overseas_female_data: "",
//       electors_overseas_tg_data: "",
//       electors_overseas_total_data: "",
//       electors_service_label: "",
//       electors_service_male_data: "",
//       electors_service_female_data: "",
//       electors_service_tg_data: "",
//       electors_service_total_data: "",
//       electors_total_male_data: "",
//       electors_total_female_data: "",
//       electors_total_tg_data: "",
//       electors_grand_total_data: "",
//       avg_no_electors_per_ps_label: "",
//       avg_no_electors_per_ps_data: "",
//       total_no_voters_label: "",
//       total_no_voters_data: "",
//       voter_trunout_ratio_label: "",
//       voter_trunout_ratio_data: "",
//     });
//   };

//   const handleSave = async () => {
//     try {
//       if (isCreating) {
//         await createConstituencyProfile(formData);
//         alert("Profile Created Successfully!");
//       } else {
//         await updateConstituencyProfile(formData);
//         alert("Profile Updated Successfully!");
//       }
//       setEditMode(false);
//       setIsCreating(false);
//       setProfileMenuOpen(false);
//       await fetchData();
//       await fetchMemberImage();
//     } catch (err) {
//       console.error("Save error:", err);
//       alert(isCreating ? "Create Failed!" : "Update Failed!");
//     }
//   };

//   const handleEditProfile = () => {
//     setEditMode(true);
//     setProfileMenuOpen(false);
//   };

//   const handleDeleteProfile = async () => {
//     if (!window.confirm("Delete Constituency Profile?")) return;

//     setProfileMenuOpen(false);
//     try {
//       await deleteConstituencyProfile(MOBILE, EMAIL);
//       alert("Constituency Profile Deleted Successfully!");
//       setData(null);
//       setFormData({});
//       setEditMode(false);
//       setIsCreating(false);
//     } catch (err) {
//       alert("Delete Failed!");
//       console.error(err);
//     }
//   };

//   const handleCancelEdit = () => {
//     setEditMode(false);
//     setIsCreating(false);
//     setFormData(data || {});
//   };

//   // Render helper
//   const renderField = (label, key, icon, type = "text") => (
//     <div className="field-row">
//       <div className="field-label">
//         {icon}
//         <label>{label}</label>
//       </div>
//       {editMode ? (
//         type === "textarea" ? (
//           <textarea name={key} value={formData[key] || ""} onChange={handleChange} rows={3} />
//         ) : (
//           <input type={type} name={key} value={formData[key] || ""} onChange={handleChange} />
//         )
//       ) : (
//         <p className="field-value">{data?.[key] || "N/A"}</p>
//       )}
//     </div>
//   );

//   if (loading) {
//     return (
//       <div className="loading-wrapper">
//         <div className="spinner"></div>Loading...
//       </div>
//     );
//   }

//   return (
//     <div className="profile-section">
//       <div className="profile-header">
//         <div className="profile-header-left">
//           <FaLandmark className="profile-icon" />
//           <div>
//             <h2>Constituency Profile</h2>
//             <p>Parliamentary constituency information and statistics</p>
//           </div>
//         </div>

//         <div className="profile-header-right">
//           {!editMode ? (
//             <>
//               {data ? (
//                 <div className="profile-menu-wrapper">
//                   <button
//                     className="btn btn-menu"
//                     onClick={() => setProfileMenuOpen(!profileMenuOpen)}
//                   >
//                     <FaEllipsisV />
//                   </button>

//                   {profileMenuOpen && (
//                     <div className="menu-dropdown profile-dropdown">
//                       <button className="menu-edit" onClick={handleEditProfile}>
//                         <FaEdit /> Edit
//                       </button>
//                       <button className="menu-delete" onClick={handleDeleteProfile}>
//                         <FaTrashAlt /> Delete Profile
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               ) : (
//                 <button className="btn btn-create" onClick={handleCreateNew}>
//                   <FaPlus /> Create Profile
//                 </button>
//               )}
//             </>
//           ) : (
//             <div className="edit-actions">
//               <button className="btn btn-save" onClick={handleSave}>
//                 <FaSave /> {isCreating ? "Create" : "Save"}
//               </button>
//               <button className="btn btn-cancel" onClick={handleCancelEdit}>
//                 <FaTimes /> Cancel
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Member Image Section */}
//       <div className="member-image-section">
//         <div className="member-image-container">
//           {uploadingMemberImage && (
//             <div className="image-loading-overlay">
//               <div className="spinner"></div>
//               <p style={{ color: 'white', marginTop: '10px', fontSize: '14px' }}>
//                 {memberImage ? 'Updating...' : 'Uploading...'}
//               </p>
//             </div>
//           )}

//           {memberImage ? (
//             <>
//               <img
//                 src={memberImage}
//                 alt="Member"
//                 className="member-profile-image"
//                 onError={(e) => {
//                   console.error('Image load error:', memberImage);
//                   e.target.style.display = 'none';
//                 }}
//               />
//               <button
//                 className="image-menu-btn"
//                 onClick={() => setMemberImageMenuOpen(!memberImageMenuOpen)}
//               >
//                 ✏️
//               </button>

//               {memberImageMenuOpen && (
//                 <div className="image-menu-dropdown">
//                   <button className="menu-edit" onClick={openMemberImageModal}>
//                     <FaEdit /> Change Image
//                   </button>
                 
//                 </div>
//               )}
//             </>
//           ) : (
//             <div className="member-image-placeholder" onClick={() => setShowMemberImageModal(true)}>
//               <FaCamera size={40} />
//               <p>Add Member Image</p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Member Image Upload Modal */}
//       {showMemberImageModal && (
//         <div className="modal" onClick={(e) => e.target === e.currentTarget && setShowMemberImageModal(false)}>
//           <div className="modal-box">
//             <h2>📷 {memberImage ? "Update" : "Upload"} Member Image</h2>

//             {imagePreview && (
//               <div className="image-preview-container">
//                 <img src={imagePreview} alt="Preview" className="image-preview" />
//               </div>
//             )}

//             <label htmlFor="member-image-input" className="custom-file-label">
//               {memberImageFile ? (
//                 <span className="file-selected">
//                   ✓ {memberImageFile.name} ({(memberImageFile.size / 1024).toFixed(1)} KB)
//                 </span>
//               ) : (
//                 <>
//                   <span className="file-icon">👤</span>
//                   <span>Click to select member image</span>
//                   <span className="file-hint">(Max 5MB, JPG/PNG)</span>
//                 </>
//               )}
//             </label>
//             <input
//               id="member-image-input"
//               type="file"
//               accept="image/*"
//               onChange={handleMemberImageSelect}
//               className="hidden-file-input"
//             />

//             <div className="btn-row">
//               <button
//                 className="btn-green"
//                 onClick={handleUploadMemberImage}
//                 disabled={!memberImageFile || uploadingMemberImage}
//               >
//                 {uploadingMemberImage ? "Uploading..." : memberImage ? "Update" : "Upload"}
//               </button>
//               <button
//                 className="btn-gray"
//                 onClick={() => {
//                   setShowMemberImageModal(false);
//                   setMemberImageFile(null);
//                   setImagePreview(null);
//                 }}
//                 disabled={uploadingMemberImage}
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Stats grid */}
//       {data && !editMode && (
//         <div className="stats-grid">
//           <div className="stat-card">
//             <div className="stat-icon orange">
//               <FaMapMarkerAlt />
//             </div>
//             <div className="stat-content">
//               <h3>{data.constituency_type || "Type"}</h3>
//               <p>Type</p>
//             </div>
//           </div>
//           <div className="stat-card">
//             <div className="stat-icon green">
//               <FaUser />
//             </div>
//             <div className="stat-content">
//               <h3>{data.sitting_member || "Member"}</h3>
//               <p>Sitting Member</p>
//             </div>
//           </div>
//           <div className="stat-card">
//             <div className="stat-icon blue">
//               <FaUsers />
//             </div>
//             <div className="stat-content">
//               <h3>{data.polling_station_count || 0}</h3>
//               <p>Polling Stations</p>
//             </div>
//           </div>
//           <div className="stat-card">
//             <div className="stat-icon purple">
//               <FaChartPie />
//             </div>
//             <div className="stat-content">
//               <h3>{data.total_no_voters_data || 0}</h3>
//               <p>Total Voters</p>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Main content - 2 Column Layout */}
//       {(!data && !isCreating) ? (
//         <div className="empty-state">
//           <FaMapMarkerAlt size={60} />
//           <h2>No Constituency Profile Found</h2>
//           <p>Create a new constituency profile to get started</p>
//           <button className="btn btn-create" onClick={handleCreateNew}>
//             <FaPlus /> Create New Profile
//           </button>
//         </div>
//       ) : (
//         <div className="content-wrapper two-column">
//           {/* LEFT COLUMN */}
//           <div className="left-column">
//             {/* Constituency Basic Info */}
//             <div className="section-card">
//               <h2>
//                 <FaMapMarkerAlt /> Constituency Information
//               </h2>
//               {renderField("Constituency No", "const_no", <FaInfoCircle />)}
//               {renderField("Constituency Type", "constituency_type", <FaLandmark />)}
//               {renderField("Constituency Name", "const_name", <FaMapMarkerAlt />)}
//               {renderField("District", "district", <FaMapMarkerAlt />)}
//               {renderField("State", "state", <FaFlag />)}
//               {renderField("Established", "established", <FaCalendarAlt />)}
//               {renderField("Reservation Status", "reservation_status", <FaInfoCircle />)}
//               {renderField("Overview", "overview", <FaInfoCircle />, "textarea")}
//               {renderField("Geography", "geography", <FaGlobe />, "textarea")}
//             </div>

//             {/* Member Information */}
//             <div className="section-card">
//               <h2>
//                 <FaUser /> Member Information
//               </h2>
//               {renderField("Sitting Member", "sitting_member", <FaUser />)}
//               {renderField("Member Party", "member_party", <FaFlag />)}
//               {renderField("Election Year", "election_year", <FaCalendarAlt />)}
//               {renderField("Election Header", "electon_header", <FaInfoCircle />, "textarea")}
//             </div>

//             {/* Assembly & Polling Info */}
//             <div className="section-card">
//               <h2>
//                 <FaBuilding /> Assembly & Polling Data
//               </h2>
//               {renderField("Assembly Segment Count", "assembly_segment_count", <FaChartPie />)}
//               {renderField("Polling Station Label", "polling_station_label", <FaInfoCircle />)}
//               {renderField("Polling Station Count", "polling_station_count", <FaBuilding />)}
//               {renderField("Avg Electors/PS Label", "avg_no_electors_per_ps_label", <FaInfoCircle />)}
//               {renderField("Avg Electors/PS", "avg_no_electors_per_ps_data", <FaCalculator />)}
//             </div>

//             {/* ECI Information */}
//             <div className="section-card">
//               <h2>
//                 <FaGlobe /> ECI Information
//               </h2>
//               {renderField("ECI Label", "eci_lablel", <FaInfoCircle />)}
//               {renderField("ECI URL", "eci_url", <FaGlobe />)}
//             </div>
//           </div>

//           {/* RIGHT COLUMN */}
//           <div className="right-column">
//             {/* General Electors */}
//             <div className="section-card">
//               <h2>
//                 <FaUsers /> General Electors
//               </h2>
//               {renderField("General Label", "electors_general_label", <FaInfoCircle />)}
//               {renderField("Male", "electors_general_male_data", <FaMale />)}
//               {renderField("Female", "electors_general_female_data", <FaFemale />)}
//               {renderField("Transgender", "electors_general_tg_data", <FaTransgender />)}
//               {renderField("Total", "electors_general_total_data", <FaUsers />)}
//             </div>

//             {/* Overseas Electors */}
//             <div className="section-card">
//               <h2>
//                 <FaGlobe /> Overseas Electors
//               </h2>
//               {renderField("Overseas Label", "electors_overseas_label", <FaInfoCircle />)}
//               {renderField("Male", "electors_overseas_male_data", <FaMale />)}
//               {renderField("Female", "electors_overseas_female_data", <FaFemale />)}
//               {renderField("Transgender", "electors_overseas_tg_data", <FaTransgender />)}
//               {renderField("Total", "electors_overseas_total_data", <FaUsers />)}
//             </div>

//             {/* Service Electors */}
//             <div className="section-card">
//               <h2>
//                 <FaFlag /> Service Electors
//               </h2>
//               {renderField("Service Label", "electors_service_label", <FaInfoCircle />)}
//               {renderField("Male", "electors_service_male_data", <FaMale />)}
//               {renderField("Female", "electors_service_female_data", <FaFemale />)}
//               {renderField("Transgender", "electors_service_tg_data", <FaTransgender />)}
//               {renderField("Total", "electors_service_total_data", <FaUsers />)}
//             </div>

//             {/* Total Electors */}
//             <div className="section-card">
//               <h2>
//                 <FaChartPie /> Total Electors Summary
//               </h2>
//               {renderField("Electors Breakup Label", "electors_breakups_label", <FaInfoCircle />)}
//               {renderField("Total Male", "electors_total_male_data", <FaMale />)}
//               {renderField("Total Female", "electors_total_female_data", <FaFemale />)}
//               {renderField("Total Transgender", "electors_total_tg_data", <FaTransgender />)}
//               {renderField("Grand Total", "electors_grand_total_data", <FaUsers />)}
//             </div>

//             {/* Voter Information */}
//             <div className="section-card">
//               <h2>
//                 <FaVoteYea /> Voter Information
//               </h2>
//               {renderField("Total Voters Label", "total_no_voters_label", <FaInfoCircle />)}
//               {renderField("Total Voters", "total_no_voters_data", <FaVoteYea />)}
//               {renderField("Turnout Ratio Label", "voter_trunout_ratio_label", <FaInfoCircle />)}
//               {renderField("Turnout Ratio", "voter_trunout_ratio_data", <FaPercentage />)}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }