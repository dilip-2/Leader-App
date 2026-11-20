// src/pages/ContactUS.jsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  FaBuilding, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaSync, 
  FaEllipsisV, 
  FaEdit, 
  FaTrashAlt, 
  FaPlus, 
  FaTimes,
  FaHome,
  FaCity,
  FaExclamationTriangle,
  FaCheckCircle,
  FaUser,
  FaEnvelope,
  FaCopy,
  FaSave,
  FaTrash,
  FaPencilAlt
} from 'react-icons/fa';
import { getContactUs, createContactUs, updateContactUs, deleteContactUs } from '../api/contactus';
import Cookies from 'js-cookie';
import './ContactUS.css';

export default function Contact() {
  const [leaderMobileNo, setLeaderMobileNo] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [contactData, setContactData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [menuOpen, setMenuOpen] = useState(null);
  
  // Add a ref for dropdown container
  const menuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Initial form data structure
  const initialFormData = {
    const_off_address1: '',
    const_off_address2: '',
    const_off_address3: '',
    const_off_pincode: '',
    const_off_state: '',
    const_off_isd_code: '+91',
    const_off_std_code: '',
    const_off_tel_number1: '',
    const_off_mobile_number1: '',
    const_off_tel_number2: '',
    const_off_mobile_number2: '',
    capital_off_address1: '',
    capital_off_address2: '',
    capital_off_address3: '',
    capital_off_pincode: '',
    capital_off_state: '',
    capital_off_isd_code: '+91',
    capital_off_std_code: '',
    capital_off_tel_number1: '',
    capital_off_mobile_number1: '',
    capital_off_tel_number2: '',
    capital_off_mobile_number2: ''
  };

  const [formData, setFormData] = useState(initialFormData);

  // Show message function
  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  // Fetch contact data
  const handleFetchData = async () => {
    if (!leaderMobileNo || !userEmail) {
      showMessage('error', 'Mobile number and email are required');
      return;
    }

    setLoading(true);
    try {
      const response = await getContactUs(leaderMobileNo, userEmail);
      if (response.data.contactus) {
        setContactData(response.data.contactus);
        setFormData({ ...initialFormData, ...response.data.contactus });
        showMessage('success', 'Data fetched successfully!');
      }
    } catch (error) {
      if (error.response?.status === 404) {
        showMessage('error', 'No contact data found');
        setContactData(null);
      } else {
        showMessage('error', 'Failed to fetch data');
      }
      console.error('Fetch Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Submit form (Create or Update)
  const handleSubmit = async () => {
    if (!leaderMobileNo || !userEmail) {
      showMessage('error', 'Mobile number and email are required');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        leader_regd_mobile_no: leaderMobileNo,
        user_email_id: userEmail,
        contactus: formData
      };

      if (contactData && contactData._id) {
        await updateContactUs(payload);
        showMessage('success', 'Data updated successfully!');
      } else {
        await createContactUs(payload);
        showMessage('success', 'Data created successfully!');
      }
      
      await handleFetchData();
      setIsEditing(false);
    } catch (error) {
      showMessage('error', 'Operation failed');
      console.error('Submit Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Delete contact data
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this contact data?')) return;
    
    setLoading(true);
    setMenuOpen(null);
    try {
      await deleteContactUs(leaderMobileNo, userEmail);
      setContactData(null);
      setFormData(initialFormData);
      showMessage('success', 'Data deleted successfully!');
    } catch (error) {
      showMessage('error', 'Failed to delete data');
      console.error('Delete Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle edit button click
  const handleEdit = () => {
    setIsEditing(true);
    setMenuOpen(null);
  };

  // Copy constituency data to capital office
  const copyToCapital = () => {
    setFormData(prev => ({
      ...prev,
      capital_off_address1: prev.const_off_address1,
      capital_off_address2: prev.const_off_address2,
      capital_off_address3: prev.const_off_address3,
      capital_off_pincode: prev.const_off_pincode,
      capital_off_state: prev.const_off_state,
      capital_off_isd_code: prev.const_off_isd_code,
      capital_off_std_code: prev.const_off_std_code,
      capital_off_tel_number1: prev.const_off_tel_number1,
      capital_off_mobile_number1: prev.const_off_mobile_number1,
      capital_off_tel_number2: prev.const_off_tel_number2,
      capital_off_mobile_number2: prev.const_off_mobile_number2
    }));
    showMessage('success', 'Data copied to Capital Office!');
  };

  // Cancel editing
  const handleCancel = () => {
    setIsEditing(false);
    if (contactData) {
      setFormData({ ...initialFormData, ...contactData });
    } else {
      setFormData(initialFormData);
    }
  };

  // Toggle menu
  const toggleMenu = (menuType) => {
    setMenuOpen(menuOpen === menuType ? null : menuType);
  };

  // Initialize from cookies on mount
  useEffect(() => {
    const mobile = Cookies.get('leader_regd_mobile_no');
    const email = Cookies.get('email');
    
    if (mobile && email) {
      setLeaderMobileNo(mobile);
      setUserEmail(email);
    }
  }, []);

  // Auto-fetch when mobile and email are set
  useEffect(() => {
    if (leaderMobileNo && userEmail) {
      handleFetchData();
    }
  }, [leaderMobileNo, userEmail]);

  return (
    <div className="contactus-container">
      <div className="contactus-card">
        {/* Header */}
        <div className="contactus-header">
          <div className="header-icon">
            <FaBuilding />
          </div>
          <h1>Contact Us Manager</h1>
          <p>Manage constituency and capital office details</p>
        </div>

        {/* Alert Message */}
        {message.text && (
          <div className={`alert-message ${message.type}`}>
            <div className="alert-content">
              {message.type === 'success' ? 
                <FaCheckCircle className="alert-icon" /> : 
                <FaExclamationTriangle className="alert-icon" />
              }
              <span>{message.text}</span>
            </div>
          </div>
        )}

        <div className="contactus-content">
          {/* User Info Section with Menu */}
          <div className="user-info-section">
            <div className="info-card">
             
              <div className="info-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3>User Information</h3>
                  
                  {/* Three Dot Menu - Moved Here */}
                  {contactData && !isEditing && (
                    <div className="card-actions" ref={menuRef} style={{ position: 'relative' }}>
                      <button 
                        className="menu-btn" 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMenu('user');
                        }}
                      >
                        <FaEllipsisV />
                      </button>
                      
                      {menuOpen === 'user' && (
                        <div className="action-menu">
                          <button 
                            className="menu-item edit-item" 
                            onClick={() => {
                              handleEdit();
                              setMenuOpen(null);
                            }}
                          >
                            <FaPencilAlt />
                            <span>Edit</span>
                          </button>
                          <button 
                            className="menu-item delete-item" 
                            onClick={() => {
                              handleDelete();
                              setMenuOpen(null);
                            }}
                          >
                            <FaTrash />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="input-row">
                  <div className="input-group">
                    <label>
                      <FaUser className="input-icon" />
                      Leader Mobile Number
                    </label>
                    <input
                      type="text"
                      value={leaderMobileNo}
                      onChange={(e) => setLeaderMobileNo(e.target.value)}
                      className="input-field"
                      placeholder="Enter mobile number"
                    />
                  </div>
                  <div className="input-group">
                    <label>
                      <FaEnvelope className="input-icon" />
                      User Email
                    </label>
                    <input
                      type="email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      className="input-field"
                      placeholder="Enter email"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            
            
            {!isEditing && !contactData && (
              <button 
                onClick={() => setIsEditing(true)} 
                className="btn btn-success create-btn"
              >
                <FaPlus />
                <span>Create New</span>
              </button>
            )}
          </div>

          {/* Edit Form */}
          {isEditing && (
            <div className="edit-form-container">
              {/* Constituency Office Form */}
              <div className="office-form-section">
                <div className="section-header">
                  <div className="section-icon">
                    <FaHome />
                  </div>
                  <h2>Constituency Office Details</h2>
                </div>
                
                <div className="form-grid">
                  {[
                    { label: 'Address Line 1', name: 'const_off_address1', icon: FaMapMarkerAlt },
                    { label: 'Address Line 2', name: 'const_off_address2', icon: FaMapMarkerAlt },
                    { label: 'Address Line 3', name: 'const_off_address3', icon: FaMapMarkerAlt },
                    { label: 'Pincode', name: 'const_off_pincode', icon: FaMapMarkerAlt },
                    { label: 'State', name: 'const_off_state', icon: FaMapMarkerAlt },
                    { label: 'ISD Code', name: 'const_off_isd_code', icon: FaPhone },
                    { label: 'STD Code', name: 'const_off_std_code', icon: FaPhone },
                    { label: 'Tel Number 1', name: 'const_off_tel_number1', icon: FaPhone },
                    { label: 'Mobile Number 1', name: 'const_off_mobile_number1', icon: FaPhone },
                    { label: 'Tel Number 2', name: 'const_off_tel_number2', icon: FaPhone },
                    { label: 'Mobile Number 2', name: 'const_off_mobile_number2', icon: FaPhone }
                  ].map((field) => (
                    <div className="form-group" key={field.name}>
                      <label>
                        <field.icon className="field-icon" />
                        {field.label}
                      </label>
                      <input
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder={field.label}
                      />
                    </div>
                  ))}
                </div>
                
                <button onClick={copyToCapital} className="btn copy-btn">
                  <FaCopy />
                  <span>Copy to Capital Office</span>
                </button>
              </div>

              {/* Capital Office Form */}
              <div className="office-form-section">
                <div className="section-header">
                  <div className="section-icon">
                    <FaCity />
                  </div>
                  <h2>Capital Office Details</h2>
                </div>
                
                <div className="form-grid">
                  {[
                    { label: 'Address Line 1', name: 'capital_off_address1', icon: FaMapMarkerAlt },
                    { label: 'Address Line 2', name: 'capital_off_address2', icon: FaMapMarkerAlt },
                    { label: 'Address Line 3', name: 'capital_off_address3', icon: FaMapMarkerAlt },
                    { label: 'Pincode', name: 'capital_off_pincode', icon: FaMapMarkerAlt },
                    { label: 'State', name: 'capital_off_state', icon: FaMapMarkerAlt },
                    { label: 'ISD Code', name: 'capital_off_isd_code', icon: FaPhone },
                    { label: 'STD Code', name: 'capital_off_std_code', icon: FaPhone },
                    { label: 'Tel Number 1', name: 'capital_off_tel_number1', icon: FaPhone },
                    { label: 'Mobile Number 1', name: 'capital_off_mobile_number1', icon: FaPhone },
                    { label: 'Tel Number 2', name: 'capital_off_tel_number2', icon: FaPhone },
                    { label: 'Mobile Number 2', name: 'capital_off_mobile_number2', icon: FaPhone }
                  ].map((field) => (
                    <div className="form-group" key={field.name}>
                      <label>
                        <field.icon className="field-icon" />
                        {field.label}
                      </label>
                      <input
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder={field.label}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="form-actions">
                <button 
                  onClick={handleSubmit} 
                  disabled={loading} 
                  className="btn btn-success submit-btn"
                >
                  <FaSave />
                  <span>{contactData ? 'Update' : 'Create'}</span>
                </button>
                <button onClick={handleCancel} className="btn btn-secondary cancel-btn">
                  <FaTimes />
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          )}

          {/* Display Contact Data */}
          {!isEditing && contactData && (
            <div className="data-display-container">
              {/* Constituency Office Display */}
              <div className="office-display-card">
                <div className="card-header">
                  <div className="card-title">
                    <div className="card-icon">
                      <FaHome />
                    </div>
                    <h2>Constituency Office</h2>
                  </div>
                </div>
                
                <div className="card-content">
                  <div className="info-section">
                    <div className="section-title">
                      <FaMapMarkerAlt />
                      <h3>Address</h3>
                    </div>
                    <div className="info-list">
                      <div className="info-item">
                        <span className="label">Address Line 1:</span>
                        <span className="value">{contactData.const_off_address1 || 'Not provided'}</span>
                      </div>
                      <div className="info-item">
                        <span className="label">Address Line 2:</span>
                        <span className="value">{contactData.const_off_address2 || 'Not provided'}</span>
                      </div>
                      <div className="info-item">
                        <span className="label">Address Line 3:</span>
                        <span className="value">{contactData.const_off_address3 || 'Not provided'}</span>
                      </div>
                      <div className="info-item">
                        <span className="label">State - Pincode:</span>
                        <span className="value">{contactData.const_off_state || 'Not provided'} - {contactData.const_off_pincode || 'Not provided'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="info-section">
                    <div className="section-title">
                      <FaPhone />
                      <h3>Contact</h3>
                    </div>
                    <div className="info-list">
                      <div className="info-item">
                        <span className="label">Tel 1:</span>
                        <span className="value">{contactData.const_off_isd_code} {contactData.const_off_std_code} {contactData.const_off_tel_number1 || 'Not provided'}</span>
                      </div>
                      <div className="info-item">
                        <span className="label">Tel 2:</span>
                        <span className="value">{contactData.const_off_tel_number2 || 'Not provided'}</span>
                      </div>
                      <div className="info-item">
                        <span className="label">Mobile 1:</span>
                        <span className="value">{contactData.const_off_mobile_number1 || 'Not provided'}</span>
                      </div>
                      <div className="info-item">
                        <span className="label">Mobile 2:</span>
                        <span className="value">{contactData.const_off_mobile_number2 || 'Not provided'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Capital Office Display */}
              <div className="office-display-card">
                <div className="card-header">
                  <div className="card-title">
                    <div className="card-icon">
                      <FaCity />
                    </div>
                    <h2>Capital Office</h2>
                  </div>
                </div>
                
                <div className="card-content">
                  <div className="info-section">
                    <div className="section-title">
                      <FaMapMarkerAlt />
                      <h3>Address</h3>
                    </div>
                    <div className="info-list">
                      <div className="info-item">
                        <span className="label">Address Line 1:</span>
                        <span className="value">{contactData.capital_off_address1 || 'Not provided'}</span>
                      </div>
                      <div className="info-item">
                        <span className="label">Address Line 2:</span>
                        <span className="value">{contactData.capital_off_address2 || 'Not provided'}</span>
                      </div>
                      <div className="info-item">
                        <span className="label">Address Line 3:</span>
                        <span className="value">{contactData.capital_off_address3 || 'Not provided'}</span>
                      </div>
                      <div className="info-item">
                        <span className="label">State - Pincode:</span>
                        <span className="value">{contactData.capital_off_state || 'Not provided'} - {contactData.capital_off_pincode || 'Not provided'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="info-section">
                    <div className="section-title">
                      <FaPhone />
                      <h3>Contact</h3>
                    </div>
                    <div className="info-list">
                      <div className="info-item">
                        <span className="label">Tel 1:</span>
                        <span className="value">{contactData.capital_off_isd_code} {contactData.capital_off_std_code} {contactData.capital_off_tel_number1 || 'Not provided'}</span>
                      </div>
                      <div className="info-item">
                        <span className="label">Tel 2:</span>
                        <span className="value">{contactData.capital_off_tel_number2 || 'Not provided'}</span>
                      </div>
                      <div className="info-item">
                        <span className="label">Mobile 1:</span>
                        <span className="value">{contactData.capital_off_mobile_number1 || 'Not provided'}</span>
                      </div>
                      <div className="info-item">
                        <span className="label">Mobile 2:</span>
                        <span className="value">{contactData.capital_off_mobile_number2 || 'Not provided'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}