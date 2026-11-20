import { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import {
  createMediaCorner,
  getMediaCornerList,
  deleteMediaCorner,
  updateMediaCorner,
} from "../api/mediacornerapi";

import "./b.css";


export default function Banner() {
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

  // Load banner images
  const loadImages = async () => {
    try {
      const res = await getMediaCornerList(MOBILE, EMAIL, "AC");
      setImages(res.data || res);
      setCurrentSlide(0);
    } catch (err) {
      console.error("Load Images Error:", err);
    }
  };

  // Auto slide functionality
  useEffect(() => {
    if (images.length > 1) {
      autoSlideRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % (images.length + 1));
      }, 5000);
    }

    return () => {
      if (autoSlideRef.current) {
        clearInterval(autoSlideRef.current);
      }
    };
  }, [images.length]);

  useEffect(() => {
    loadImages();
  }, []);

  // Handle add image
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

  // Handle update image
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

  // Handle delete image
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
    if (autoSlideRef.current) {
      clearInterval(autoSlideRef.current);
    }
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    if (autoSlideRef.current) {
      clearInterval(autoSlideRef.current);
    }
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const openEditModal = (img) => {
    setEditId(img._id);
    setShowEditModal(true);
    setShowMenu(null);
  };

  return (
    <>
      {/* BANNER SECTION */}
      <div className="banner-wrapper">
        {images.map((img, index) => (
          <div
            key={img._id}
            className={`banner-slide ${currentSlide === index ? "active" : ""}`}
          >
            <img src={getImageURL(img.media_file)} alt={img.media_header} className="banner-image" />

            <button
              onClick={() => setShowMenu(showMenu === img._id ? null : img._id)}
              className="menu-btn"
            >
              ⋮
            </button>

            {showMenu === img._id && (
              <div className="menu-dropdown">
                <button className="menu-edit" onClick={() => openEditModal(img)}>✏️ Edit</button>
                <button className="menu-delete" onClick={() => handleDeleteImage(img._id)}>🗑️ Delete</button>
              </div>
            )}
          </div>
        ))}

        <div className={`add-banner-slide ${currentSlide === images.length ? "active" : ""}`}>
          <button className="add-btn" onClick={() => setShowUpload(true)}>
            +
          </button>
        </div>

        {totalSlides > 1 && (
          <>
            <button className="banner-nav-left" onClick={prevSlide}>‹</button>
            <button className="banner-nav-right" onClick={nextSlide}>›</button>
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

      {/* Upload Modal */}
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

      {/* Edit Modal */}
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
    </>
  );
}