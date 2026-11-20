// import { useEffect, useState } from "react";
// import axios from "axios";
// import "./Know.css";

// // Import Child Components
// import LeaderDetails from "../leaderknow/LeaderDetails";
// import CurrentPosition from "../leaderknow/CurrentPosition";
// import SocialLinks from "../leaderknow/SocialLinks";
// import PersonalInfo from "../leaderknow/PersonalInfo";
// import EducationInfo from "../leaderknow/EducationInfo";
// import PermanentAddress from "../leaderknow/PermanentAddress";

// export default function LeaderCoordinates() {
//   const [leader, setLeader] = useState(null);
//   const [social, setSocial] = useState([]);
//   const [personal, setPersonal] = useState(null);
//   const [education, setEducation] = useState([]);
//   const [address, setAddress] = useState(null);
//   const [present, setPresent] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Dropdown (accordion) state
//   const [openSection, setOpenSection] = useState(null);

//   const toggleSection = (section) => {
//     setOpenSection(openSection === section ? null : section);
//   };

//   const mobileNumber = "7702000725"; // Hardcoded number

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const res = await axios.get(`/api/coordinates/${mobileNumber}`);
//         setLeader(res.data.leader_coordinates);

//         const socialRes = await axios.get(`/api/socialmedia/${mobileNumber}`);
//         setSocial(socialRes.data.social_media || []);

//         const addressthat = await axios.get(`/api/permaddress/${mobileNumber}`);
//         setAddress(addressthat.data.perm_address || null);

//         const presentAdd = await axios.get(`/api/preaddress/${mobileNumber}`);
//         setPresent(presentAdd.data.present_address || null);

//         const personalRes = await axios.get(`/api/personaldetails/${mobileNumber}`);
//         setPersonal(personalRes.data.personal_details || null);

//         const eduRes = await axios.get(`/api/edudata/${mobileNumber}`);
//         setEducation(eduRes.data.leader_edu_data || []);
//       } catch (err) {
//         console.error("API Error:", err);
//         setError("Failed to fetch leader data.");
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchData();
//   }, []);

//   if (loading) return <h3 className="status">Loading...</h3>;
//   if (error) return <h3 className="status error">{error}</h3>;

//   return (
//     <div className="main-container">

//       {/* Leader Details */}
//       <div className="dropdown-section">
//         <h2 onClick={() => toggleSection("leader")} className="dropdown-header">
//           Leader Details
//         </h2>
//         {openSection === "leader" && <LeaderDetails leader={leader} />}
//       </div>

//       {/* Current Position */}
//       <div className="dropdown-section">
//         <h2 onClick={() => toggleSection("position")} className="dropdown-header">
//           Current Position
//         </h2>
//         {openSection === "position" && <CurrentPosition />}
//       </div>

//       {/* Social Media */}
//       <div className="dropdown-section">
//         <h2 onClick={() => toggleSection("social")} className="dropdown-header">
//           Social Media Links
//         </h2>
//         {openSection === "social" && <SocialLinks social={social} />}
//       </div>

//       {/* Personal Info */}
//       <div className="dropdown-section">
//         <h2 onClick={() => toggleSection("personal")} className="dropdown-header">
//           Personal Information
//         </h2>
//         {openSection === "personal" && <PersonalInfo personal={personal} />}
//       </div>

//       {/* Education */}
//       <div className="dropdown-section">
//         <h2 onClick={() => toggleSection("education")} className="dropdown-header">
//           Education Qualifications
//         </h2>
//         {openSection === "education" && <EducationInfo education={education} />}
//       </div>

//       {/* Permanent + Present Address */}
//       <div className="dropdown-section">
//         <h2 onClick={() => toggleSection("address")} className="dropdown-header">
//           Address Details
//         </h2>
//         {openSection === "address" && (
//           <PermanentAddress address={address} personal={personal} present={present} />
//         )}
//       </div>
//     </div>
//   );
// }
