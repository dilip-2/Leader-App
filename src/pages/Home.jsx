import { useEffect, useState } from "react";
import Cookies from "js-cookie";

import {
  createMediaCorner,
  getMediaCornerList,
  deleteMediaCorner,
  updateMediaCorner,
} from "../api/mediacornerapi";
import "./home.css";

// Mock images for demo
const mockImages = [
  {
    _id: "mock1",
    media_file: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=1200&h=400&fit=crop",
    media_header: "Empowering Communities",
    media_narration: "Building a better future together"
  },
  {
    _id: "mock2",
    media_file: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&h=400&fit=crop",
    media_header: "Education for All",
    media_narration: "Quality education for every child"
  },
  {
    _id: "mock3",
    media_file: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&h=400&fit=crop",
    media_header: "Healthcare Initiative",
    media_narration: "Affordable healthcare for everyone"
  },
  {
    _id: "mock4",
    media_file: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=400&fit=crop",
    media_header: "Digital Transformation",
    media_narration: "Technology for better governance"
  }
];

export default function Home() {
  const mobile = Cookies.get("leader_regd_mobile_no");
  const email = Cookies.get("email");

  const [images, setImages] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  const [file, setFile] = useState(null);
  const [mediaHeader, setMediaHeader] = useState("");
  const [showUpload, setShowUpload] = useState(false);

  const [editId, setEditId] = useState(null);
  const [editFile, setEditFile] = useState(null);
  const [editHeader, setEditHeader] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMenu, setShowMenu] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadImages = async () => {
    setIsLoading(true);
    try {
      const res = await getMediaCornerList(mobile, email, "AC");
      const apiData = res.data || res;
      if (apiData && apiData.length > 0) {
        setImages(apiData);
      } else {
        setImages(mockImages);
      }
      setCurrentSlide(0);
    } catch (err) {
      console.error("Load Images Error:", err);
      setImages(mockImages);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadImages();
  }, []);

  const handleAddImage = async (e) => {
    e.preventDefault();
    if (!file) return alert("Select Image!");

    const data = new FormData();
    data.append("leader_regd_mobile_no", mobile);
    data.append("user_email_id", email);
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
      setMediaHeader("");
      loadImages();
    } catch (err) {
      alert("Upload Failed!");
    }
  };

  const handleUpdateImage = async () => {
    if (!editFile && !editHeader) return alert("No Changes!");

    const data = new FormData();
    data.append("id", editId);
    data.append("regd_mobile_no", mobile);
    data.append("leader_regd_mobile_no", mobile);
    data.append("user_email_id", email);
    data.append("media_type", "AC");
    data.append("media_header", editHeader);

    if (editFile) data.append("media_file", editFile);

    try {
      await updateMediaCorner(data);
      alert("Updated!");
      setShowEditModal(false);
      setEditFile(null);
      setEditHeader("");
      setEditId(null);
      setShowMenu(null);
      loadImages();
    } catch (err) {
      alert("Failed!");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this image?")) return;
    try {
      await deleteMediaCorner(id, mobile, email);
      alert("Deleted!");
      setShowMenu(null);
      loadImages();
    } catch (err) {
      alert("Delete Failed!");
    }
  };

  const getImageURL = (file) => {
    if (file && file.startsWith && (file.startsWith('http://') || file.startsWith('https://'))) {
      return file;
    }
    return `/api/mediacorner/asset/?leader_regd_mobile_no=${mobile}&user_email_id=${email}&media_file=${file}`;
  };

  const totalSlides = images.length + 1;
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % totalSlides);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);

  const openEditModal = (img) => {
    setEditId(img._id);
    setEditHeader(img.media_header || "");
    setShowEditModal(true);
    setShowMenu(null);
  };

  useEffect(() => {
    if (images.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length, totalSlides]);

  // Leader statistics data
  const leaderStats = [
    { icon: "🏗️", count: "150+", label: "Development Projects" },
    { icon: "🏫", count: "50+", label: "Schools Renovated" },
    { icon: "🏥", count: "25+", label: "Healthcare Centers" },
    { icon: "🌾", count: "10,000+", label: "Farmers Benefited" },
  ];

  // Key initiatives
  const initiatives = [
    {
      icon: "🎓",
      title: "Education Revolution",
      description: "Digital classrooms, scholarships, and quality education for underprivileged students.",
    },
    {
      icon: "🏥",
      title: "Health for All",
      description: "Free health checkups, mobile medical vans, and affordable medicines in rural areas.",
    },
    {
      icon: "🌾",
      title: "Farmers Empowerment",
      description: "Modern farming techniques, subsidies, and direct market access for farmers.",
    },
    {
      icon: "💻",
      title: "Digital Governance",
      description: "Transparent online services, citizen portals, and e-governance initiatives.",
    },
  ];

  return (
    <div className="homepage">
      {/* Banner Section - FULL WIDTH */}
      <div className="banner-wrapper">
        {isLoading ? (
          <div className="loading-spinner">
            <div className="loader"></div>
            <p>Loading banners...</p>
          </div>
        ) : (
          <>
            {images.map((img, index) => (
              <div
                key={img._id}
                className={`banner-slide ${currentSlide === index ? "active" : ""}`}
              >
                <img 
                  src={getImageURL(img.media_file)} 
                  alt={img.media_header || "Banner"} 
                  className="banner-image" 
                />

                <div className="banner-overlay">
                  {img.media_header && (
                    <div className="banner-title">{img.media_header}</div>
                  )}
                  {img.media_narration && (
                    <div className="banner-subtitle">{img.media_narration}</div>
                  )}
                </div>

                <button
                  onClick={() => setShowMenu(showMenu === img._id ? null : img._id)}
                  className="menu-btn"
                >
                  ⋮
                </button>

                {showMenu === img._id && (
                  <div className="menu-dropdown">
                    <button className="menu-edit" onClick={() => openEditModal(img)}>✏️ Edit</button>
                    <button className="menu-delete" onClick={() => handleDelete(img._id)}>🗑️ Delete</button>
                  </div>
                )}
              </div>
            ))}

            <div className={`add-banner-slide ${currentSlide === images.length ? "active" : ""}`}>
              <button className="add-btn" onClick={() => setShowUpload(true)}>
                <span>+</span>
                <span className="add-text">Add Banner</span>
              </button>
            </div>

            {totalSlides > 1 && (
              <>
                <button className="nav-left" onClick={prevSlide}>‹</button>
                <button className="nav-right" onClick={nextSlide}>›</button>
              </>
            )}

            <div className="dots">
              {[...Array(totalSlides)].map((_, index) => (
                <button
                  key={index}
                  className={`dot ${currentSlide === index ? "active" : ""}`}
                  onClick={() => setCurrentSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Leader Profile Section */}
      <div className="leader-section">
        <div className="leader-container">
          <div className="leader-left">
            <div className="leader-photo-wrapper">
              <img
                src="https://img.freepik.com/premium-photo/portrait-handsome-confident-business-man-leadership-concept-mixed-media_641298-4280.jpg?w=2000"
                alt="Leader"
                className="leader-photo"
              />
              <div className="leader-photo-overlay">
                <span className="leader-status">Active Leader</span>
              </div>
            </div>
          </div>

          <div className="leader-right">
            <div className="leader-badge">✦ Member of Parliament</div>
            <h2 className="leader-title">Leader Name</h2>
            <h4 className="leader-subtitle">Paschim Champaran (Bihar)</h4>
            
            <div className="leader-desc-wrapper">
              <p className="leader-desc">
                Leader Name is a respected political leader, actively working towards
                improving healthcare, education, farmers' welfare and implementing
                transparent digital services for the citizens of Bihar.
              </p>
              <p className="leader-desc">
                His dedicated public service and continuous development initiatives have
                positively impacted thousands of lives in the region.
              </p>
            </div>

            {/* Social Media/Contact Buttons */}
            <div className="leader-social">
              <button className="social-btn facebook">📘</button>
              <button className="social-btn twitter">🐦</button>
              <button className="social-btn instagram">📸</button>
              <button className="social-btn youtube">▶️</button>
              <button className="social-btn website">🌐</button>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="stats-section">
          <h3 className="stats-title">📊 Impact in Numbers</h3>
          <div className="stats-grid">
            {leaderStats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-count">{stat.count}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Initiatives Section */}
        <div className="initiatives-section">
          <h3 className="initiatives-title">🚀 Key Initiatives</h3>
          <div className="initiatives-grid">
            {initiatives.map((initiative, index) => (
              <div key={index} className="initiative-card">
                <div className="initiative-icon">{initiative.icon}</div>
                <h4 className="initiative-title">{initiative.title}</h4>
                <p className="initiative-description">{initiative.description}</p>
                <button className="learn-more-btn">Learn More →</button>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial/Quote Section */}
        <div className="testimonial-section">
          <div className="testimonial-content">
            <div className="quote-icon">"</div>
            <p className="testimonial-text">
              Working tirelessly for the development of our region and the welfare of every citizen. 
              Together, we can build a brighter future for Paschim Champaran.
            </p>
            <div className="testimonial-author">
              <span className="author-name">Leader Name</span>
              <span className="author-title">Member of Parliament</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Components */}
      {showUpload && (
        <div className="modal" onClick={(e) => e.target === e.currentTarget && setShowUpload(false)}>
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
              <button className="btn-gray" onClick={() => {
                setShowUpload(false);
                setFile(null);
              }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="modal" onClick={(e) => e.target === e.currentTarget && setShowEditModal(false)}>
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
              <button className="btn-blue" onClick={handleUpdateImage} disabled={!editFile}>
                Update
              </button>
              <button className="btn-gray" onClick={() => {
                setShowEditModal(false);
                setEditId(null);
                setEditFile(null);
              }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="main-footer">
        <div className="footer-content">
          <p>© 2025 | All Rights Reserved</p>
          <div className="footer-links">
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
            <a href="#privacy">Privacy Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}