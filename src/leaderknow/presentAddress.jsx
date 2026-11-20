import { useEffect, useState, useRef } from "react";
import Cookies from "js-cookie";

import {
  getPresentAddress,
  createPresentAddress,
  updatePresentAddress,
  deletePresentAddress,
} from "../api/apipresentA";
import "./presentA.css";

export default function PresentAddress() {
  const mobile = Cookies.get("leader_regd_mobile_no");
  const email = Cookies.get("email");

  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const menuRef = useRef(null);

  const [form, setForm] = useState({
    regd_mobile_no: mobile,
    user_email_id: email,
    address1: "",
    address2: "",
    address3: "",
    pincode: "",
    state: "",
    isd_code: "+91",
    std_code: "",
    tel_number1: "",
    mobile_number1: "",
    tel_number2: "",
    mobile_number2: "",
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fetchAddress();
  }, []);

  const fetchAddress = async () => {
    try {
      setLoading(true);
      const res = await getPresentAddress(mobile, email);
      console.log("📥 Present address response:", res?.data);
      
      if (res.data?.present_address) {
        const addr = res.data.present_address;
        setAddress(addr);
        setForm({
          ...addr,
          regd_mobile_no: addr.regd_mobile_no || mobile,
          user_email_id: email,
        });
      }
    } catch (err) {
      console.error("Error fetching present address:", err);
      if (err.response?.status !== 404) {
        setError("Failed to load address");
        setTimeout(() => setError(""), 4000);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!form.address1 || !form.state || !form.pincode || !form.mobile_number1) {
      setError("❌ Please fill all required fields");
      setTimeout(() => setError(""), 3000);
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        leader_regd_mobile_no: mobile,
        user_email_id: email,
        present_address: {
          ...form,
          regd_mobile_no: mobile,
        },
      };

      console.log("📤 Sending payload:", JSON.stringify(payload, null, 2));

      let res;
      if (address) {
        res = await updatePresentAddress(payload);
        console.log("Update response:", res);
      } else {
        res = await createPresentAddress(payload);
        console.log("Create response:", res);
      }

      if (res?.status === 200 || res?.status === 201 || res?.data) {
        const savedAddress = res.data?.present_address || { ...form, regd_mobile_no: mobile };
        
        console.log("✅ Saved address:", savedAddress);
        
        setAddress(savedAddress);
        setForm({
          ...savedAddress,
          regd_mobile_no: savedAddress.regd_mobile_no || mobile,
          user_email_id: email,
        });
        setIsFormOpen(false);
        setSuccess(address ? "✅ Address updated successfully!" : "✅ Address created successfully!");
        setTimeout(() => setSuccess(""), 4000);
        
        await fetchAddress();
      }
    } catch (err) {
      console.error("Error saving:", err);
      setError(`❌ Error: ${err.response?.data?.error || err.message}`);
      setTimeout(() => setError(""), 4000);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = () => {
    setIsFormOpen(true);
    setShowMenu(false);
  };

  const handleDelete = async () => {
    setShowMenu(false);
    if (!window.confirm("⚠️ Delete present address permanently? This cannot be undone.")) return;
    
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await deletePresentAddress(mobile, email);
      setAddress(null);
      setForm({
        regd_mobile_no: mobile,
        user_email_id: email,
        address1: "",
        address2: "",
        address3: "",
        pincode: "",
        state: "",
        isd_code: "+91",
        std_code: "",
        tel_number1: "",
        mobile_number1: "",
        tel_number2: "",
        mobile_number2: "",
      });
      setIsFormOpen(false);
      setSuccess("🗑️ Address deleted successfully!");
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      console.error("Error deleting:", err);
      setError(`❌ Delete failed: ${err.response?.data?.message || err.message}`);
      setTimeout(() => setError(""), 4000);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (address) {
      setForm({
        ...address,
        regd_mobile_no: address.regd_mobile_no || mobile,
        user_email_id: email,
      });
    } else {
      setForm({
        regd_mobile_no: mobile,
        user_email_id: email,
        address1: "",
        address2: "",
        address3: "",
        pincode: "",
        state: "",
        isd_code: "+91",
        std_code: "",
        tel_number1: "",
        mobile_number1: "",
        tel_number2: "",
        mobile_number2: "",
      });
    }
    setIsFormOpen(false);
    setError("");
  };

  if (loading) {
    return (
      <div className="pra-loading-wrapper">
        <div className="pra-spinner"></div>
        <p>Loading present address...</p>
      </div>
    );
  }

  return (
    <div className="pra-container">
      {/* 1. Header Card */}
      <div className="pra-header-card">
        <div className="pra-header-content">
          <div className="pra-header-left">
            <div className="pra-header-icon">🏢</div>
            <div>
              <h1 className="pra-header-title">Present Address</h1>
              <p className="pra-header-subtitle">Manage your present address details</p>
            </div>
          </div>
          
          <div className="pra-header-right">
            {!address && !isFormOpen ? (
              <button className="pra-btn-primary" onClick={() => setIsFormOpen(true)} disabled={saving}>
                <span className="pra-btn-icon">➕</span> Add Address
              </button>
            ) : address && !isFormOpen && (
              <div className="pra-dropdown-wrapper" ref={menuRef}>
                <button className="pra-btn-menu" onClick={() => setShowMenu(prev => !prev)} disabled={saving}>
                  <span className="pra-dots">⋮</span> Actions
                </button>
                {showMenu && (
                  <div className="pra-dropdown-menu">
                    <button className="pra-dropdown-item" onClick={handleEdit}>
                      ✏️ Edit Address
                    </button>
                    <div className="pra-dropdown-divider"></div>
                    <button className="pra-dropdown-item pra-danger" onClick={handleDelete}>
                      🗑️ Delete Address
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Alert Messages */}
      {error && <div className="pra-alert pra-alert-error">⚠️ {error} <button className="pra-alert-close" onClick={() => setError("")}>×</button></div>}
      {success && <div className="pra-alert pra-alert-success">✅ {success} <button className="pra-alert-close" onClick={() => setSuccess("")}>×</button></div>}

      {/* 3. User Info Banner */}
      <div className="pra-profile-card">
        <div className="pra-profile-content">
          <div className="pra-profile-item">
            <span className="pra-profile-icon">📧</span>
            <span className="pra-profile-label">Email</span>
            <span className="pra-profile-value">{email}</span>
          </div>
          <div className="pra-profile-divider"></div>
          <div className="pra-profile-item">
            <span className="pra-profile-icon">📱</span>
            <span className="pra-profile-label">Mobile</span>
            <span className="pra-profile-value">{mobile}</span>
          </div>
        </div>
      </div>

      {/* 4. Main Content */}
      {!address && !isFormOpen ? (
        <div className="pra-empty-state">
          <div className="pra-empty-icon">🏢</div>
          <h3>No Address Found</h3>
          <p>Add your present address to complete your profile</p>
          <button className="pra-btn-primary" onClick={() => setIsFormOpen(true)}>
            ➕ Add Address
          </button>
        </div>
      ) : (
        <>
          {/* View Mode */}
          {address && !isFormOpen && (
            <div className="pra-details-card">
              <div className="pra-card-header">
                <h2 className="pra-card-title">📍 Address Details</h2>
              </div>

              <div className="pra-display-grid">
                {[
                  { icon: "🏠", label: "Address Line 1", value: address.address1 },
                  { icon: "🏠", label: "Address Line 2", value: address.address2 },
                  { icon: "🏠", label: "Address Line 3", value: address.address3 },
                  { icon: "🗺️", label: "State", value: address.state },
                  { icon: "📮", label: "Pincode", value: address.pincode },
                  { icon: "🌍", label: "ISD Code", value: address.isd_code },
                  { icon: "📞", label: "STD Code", value: address.std_code },
                  { icon: "☎️", label: "Telephone 1", value: address.tel_number1 },
                  { icon: "☎️", label: "Telephone 2", value: address.tel_number2 },
                  { icon: "📱", label: "Primary Mobile", value: address.mobile_number1 },
                  { icon: "📱", label: "Secondary Mobile", value: address.mobile_number2 },
                ].map((item, index) => (
                  item.value && ( // Only render if value exists
                    <div className="pra-display-item" key={index}>
                      <span className="pra-display-icon">{item.icon}</span>
                      <div>
                        <span className="pra-display-label">{item.label}</span>
                        <span className="pra-display-value">{item.value}</span>
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}

          {/* Edit Mode */}
          {isFormOpen && (
            <>
              <div className="pra-edit-actions-bar">
                <button className="pra-btn-primary" onClick={handleSave} disabled={saving}>
                  {saving ? "⏳ Saving..." : address ? "💾 Update Address" : "💾 Create Address"}
                </button>
                <button className="pra-btn-secondary" onClick={handleCancel} disabled={saving}>
                  ❌ Cancel
                </button>
              </div>

              <div className="pra-form-card">
                <div className="pra-card-header">
                  <h2 className="pra-card-title">📝 {address ? "Update" : "Add"} Address Details</h2>
                </div>

                <div className="pra-form-grid">
                  <div className="pra-form-group pra-full-width">
                    <label className="pra-form-label">Address Line 1 <span className="pra-required">*</span></label>
                    <input className="pra-form-input" name="address1" value={form.address1} onChange={handleChange} placeholder="Enter address line 1" disabled={saving} />
                  </div>
                  <div className="pra-form-group"><label className="pra-form-label">Address Line 2</label><input className="pra-form-input" name="address2" value={form.address2} onChange={handleChange} placeholder="Apartment, suite, etc." disabled={saving} /></div>
                  <div className="pra-form-group"><label className="pra-form-label">Address Line 3</label><input className="pra-form-input" name="address3" value={form.address3} onChange={handleChange} placeholder="Landmark, area" disabled={saving} /></div>
                  <div className="pra-form-group"><label className="pra-form-label">State <span className="pra-required">*</span></label><input className="pra-form-input" name="state" value={form.state} onChange={handleChange} placeholder="Enter state" disabled={saving} /></div>
                  <div className="pra-form-group"><label className="pra-form-label">Pincode <span className="pra-required">*</span></label><input className="pra-form-input" name="pincode" value={form.pincode} onChange={handleChange} placeholder="Enter pincode" maxLength="6" disabled={saving} /></div>
                  <div className="pra-form-group"><label className="pra-form-label">ISD Code</label><input className="pra-form-input" name="isd_code" value={form.isd_code} onChange={handleChange} placeholder="+91" disabled={saving} /></div>
                  <div className="pra-form-group"><label className="pra-form-label">STD Code</label><input className="pra-form-input" name="std_code" value={form.std_code} onChange={handleChange} placeholder="Enter STD code" disabled={saving} /></div>
                  <div className="pra-form-group"><label className="pra-form-label">Telephone 1</label><input className="pra-form-input" name="tel_number1" value={form.tel_number1} onChange={handleChange} placeholder="Primary telephone" disabled={saving} /></div>
                  <div className="pra-form-group"><label className="pra-form-label">Mobile 1 <span className="pra-required">*</span></label><input className="pra-form-input" name="mobile_number1" value={form.mobile_number1} onChange={handleChange} placeholder="Primary mobile" disabled={saving} /></div>
                  <div className="pra-form-group"><label className="pra-form-label">Telephone 2</label><input className="pra-form-input" name="tel_number2" value={form.tel_number2} onChange={handleChange} placeholder="Secondary telephone" disabled={saving} /></div>
                  <div className="pra-form-group"><label className="pra-form-label">Mobile 2</label><input className="pra-form-input" name="mobile_number2" value={form.mobile_number2} onChange={handleChange} placeholder="Secondary mobile" disabled={saving} /></div>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}