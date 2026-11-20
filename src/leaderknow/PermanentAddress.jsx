import { useEffect, useState, useRef } from "react";
import Cookies from "js-cookie";

import { 
  getPermAddress, 
  createPermAddress, 
  updatePermAddress, 
  deletePermAddress 
} from "../api/apiaddresspermanent";
import "./Permanentadd.css";

export default function PermanentAddress() {
  const mobileNumber = Cookies.get("leader_regd_mobile_no");
  const emailId = Cookies.get("email");

  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [pincodeInfo, setPincodeInfo] = useState(null);

  const [form, setForm] = useState({
    address1: "",
    address2: "",
    address3: "",
    pincode: "",
    state: "",
    isd_code: "+91",
    std_code: "",
    tel_number1: "",
    tel_number2: "",
    mobile_number1: "",
    mobile_number2: "",
  });

  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch Address
  const fetchAddress = async () => {
    try {
      setLoading(true);
      console.log("🔍 Fetching address for:", mobileNumber, emailId);
      
      const res = await getPermAddress(mobileNumber, emailId);
      console.log("📥 Address response:", res?.data);

      const data = res.data?.perm_address || res.data || null;

      if (data) {
        setAddress(data);
        setForm({
          address1: data.address1 || "",
          address2: data.address2 || "",
          address3: data.address3 || "",
          pincode: data.pincode || "",
          state: data.state || "",
          isd_code: data.isd_code || "+91",
          std_code: data.std_code || "",
          tel_number1: data.tel_number1 || "",
          tel_number2: data.tel_number2 || "",
          mobile_number1: data.mobile_number1 || "",
          mobile_number2: data.mobile_number2 || "",
        });
      }
    } catch (err) {
      console.error("❌ Fetch error:", err);
      
      if (err.response?.status !== 404) {
        setError("Failed to load address");
        setTimeout(() => setError(""), 4000);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddress();
  }, []);

  // Fetch Pincode Info
  const fetchPincodeInfo = async () => {
    if (!form.pincode || form.pincode.length !== 6) return;
    setPincodeInfo({ city: "Bettiah", state: "Bihar" });
    setForm({ ...form, state: "Bihar" });
  };

  // Create Address
  const handleCreate = async () => {
    if (!form.address1.trim()) {
      setError("❌ Please enter Address Line 1");
      setTimeout(() => setError(""), 3000);
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    const payload = {
      leader_regd_mobile_no: mobileNumber,
      user_email_id: emailId,
      address1: form.address1 || "",
      address2: form.address2 || "",
      address3: form.address3 || "",
      pincode: form.pincode || "",
      state: form.state || "",
      isd_code: form.isd_code || "+91",
      std_code: form.std_code || "",
      tel_number1: form.tel_number1 || "",
      tel_number2: form.tel_number2 || "",
      mobile_number1: form.mobile_number1 || "",
      mobile_number2: form.mobile_number2 || "",
    };

    console.log("📤 Creating address with payload:", payload);

    try {
      const res = await createPermAddress(payload);
      console.log("✅ Create response:", res);

      if (res?.status === 200 || res?.status === 201 || res?.data) {
        const createdData = res.data?.perm_address || res.data || form;
        setAddress(createdData);
        setSuccess("✅ Address created successfully!");
        setIsEditMode(false);
        await fetchAddress();
      }
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      console.error("❌ Create error:", err);
      
      const errorMsg = err.response?.data?.error 
        || err.response?.data?.message 
        || err.message 
        || "Unknown error";
      
      setError(`❌ Failed to create: ${errorMsg}`);
      setTimeout(() => setError(""), 4000);
    } finally {
      setSaving(false);
    }
  };

  // Update Address
  const handleUpdate = async () => {
    if (!form.address1.trim()) {
      setError("❌ Please enter Address Line 1");
      setTimeout(() => setError(""), 3000);
      return;
    }

    setSaving(true);
    setShowDropdown(false);
    setError("");
    setSuccess("");

    const payload = {
      leader_regd_mobile_no: mobileNumber,
      user_email_id: emailId,
      address1: form.address1 || "",
      address2: form.address2 || "",
      address3: form.address3 || "",
      pincode: form.pincode || "",
      state: form.state || "",
      isd_code: form.isd_code || "+91",
      std_code: form.std_code || "",
      tel_number1: form.tel_number1 || "",
      tel_number2: form.tel_number2 || "",
      mobile_number1: form.mobile_number1 || "",
      mobile_number2: form.mobile_number2 || "",
    };

    console.log("📤 Updating address with payload:", payload);

    try {
      const res = await updatePermAddress(payload);
      console.log("✅ Update response:", res);

      if (res?.status === 200 || res?.data) {
        const updatedData = res.data?.perm_address || res.data || form;
        setAddress(updatedData);
        setSuccess("✅ Address updated successfully!");
        setIsEditMode(false);
        await fetchAddress();
      }
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      console.error("❌ Update error:", err);
      
      const errorMsg = err.response?.data?.error 
        || err.response?.data?.message 
        || err.message 
        || "Unknown error";
      
      setError(`❌ Update failed: ${errorMsg}`);
      setTimeout(() => setError(""), 4000);
    } finally {
      setSaving(false);
    }
  };

  // Delete Address
  const handleDelete = async () => {
    if (!window.confirm("⚠️ Delete permanent address? This cannot be undone.")) return;

    setShowDropdown(false);
    setSaving(true);
    setError("");
    setSuccess("");

    console.log("🗑️ Deleting address for:", mobileNumber, emailId);

    try {
      const res = await deletePermAddress(mobileNumber, emailId);
      console.log("✅ Delete response:", res);

      setAddress(null);
      setForm({
        address1: "",
        address2: "",
        address3: "",
        pincode: "",
        state: "",
        isd_code: "+91",
        std_code: "",
        tel_number1: "",
        tel_number2: "",
        mobile_number1: "",
        mobile_number2: "",
      });
      setIsEditMode(false);
      setPincodeInfo(null);

      setSuccess("🗑️ Address deleted successfully!");
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      console.error("❌ Delete error:", err);
      
      const errorMsg = err.response?.data?.message 
        || err.response?.data?.error 
        || err.message 
        || "Unknown error";
      
      setError(`❌ Delete failed: ${errorMsg}`);
      setTimeout(() => setError(""), 4000);
    } finally {
      setSaving(false);
    }
  };

  // Edit Mode Handlers
  const handleEditClick = () => {
    setIsEditMode(true);
    setShowDropdown(false);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setPincodeInfo(null);
    if (address) {
      setForm({
        address1: address.address1 || "",
        address2: address.address2 || "",
        address3: address.address3 || "",
        pincode: address.pincode || "",
        state: address.state || "",
        isd_code: address.isd_code || "+91",
        std_code: address.std_code || "",
        tel_number1: address.tel_number1 || "",
        tel_number2: address.tel_number2 || "",
        mobile_number1: address.mobile_number1 || "",
        mobile_number2: address.mobile_number2 || "",
      });
    }
  };

  if (loading) {
    return (
      <div className="pad-loading-wrapper">
        <div className="pad-spinner"></div>
        <p>Loading address information...</p>
      </div>
    );
  }

  return (
    <div className="pad-container">
      {/* 1. Header Card */}
      <div className="pad-header-card">
        <div className="pad-header-content">
          <div className="pad-header-left">
            <div className="pad-header-icon">🏠</div>
            <div>
              <h1 className="pad-header-title">Permanent Address</h1>
              <p className="pad-header-subtitle">Manage your permanent address details</p>
            </div>
          </div>
          
          <div className="pad-header-right">
            {!address && !isEditMode ? (
              <button className="pad-btn-primary" onClick={() => setIsEditMode(true)} disabled={saving}>
                <span className="pad-btn-icon">➕</span> Add Address
              </button>
            ) : address && !isEditMode && (
              <div className="pad-dropdown-wrapper" ref={dropdownRef}>
                <button className="pad-btn-menu" onClick={() => setShowDropdown(prev => !prev)} disabled={saving}>
                  <span className="pad-dots">⋮</span> Actions
                </button>
                {showDropdown && (
                  <div className="pad-dropdown-menu">
                    <button className="pad-dropdown-item" onClick={handleEditClick}>
                      ✏️ Edit Address
                    </button>
                    <div className="pad-dropdown-divider"></div>
                    <button className="pad-dropdown-item pad-danger" onClick={handleDelete}>
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
      {error && <div className="pad-alert pad-alert-error">⚠️ {error} <button className="pad-alert-close" onClick={() => setError("")}>×</button></div>}
      {success && <div className="pad-alert pad-alert-success">✅ {success} <button className="pad-alert-close" onClick={() => setSuccess("")}>×</button></div>}

      {/* 3. User Info Banner */}
      <div className="pad-profile-card">
        <div className="pad-profile-content">
          <div className="pad-profile-item">
            <span className="pad-profile-icon">📧</span>
            <span className="pad-profile-label">Email</span>
            <span className="pad-profile-value">{emailId}</span>
          </div>
          <div className="pad-profile-divider"></div>
          <div className="pad-profile-item">
            <span className="pad-profile-icon">📱</span>
            <span className="pad-profile-label">Mobile</span>
            <span className="pad-profile-value">{mobileNumber}</span>
          </div>
        </div>
      </div>

      {/* 4. Main Content */}
      {!address && !isEditMode ? (
        <div className="pad-empty-state">
          <div className="pad-empty-icon">🏠</div>
          <h3>No Address Found</h3>
          <p>Add your permanent address to complete your profile</p>
          <button className="pad-btn-primary" onClick={() => setIsEditMode(true)}>
            ➕ Add Address
          </button>
        </div>
      ) : (
        <>
          {/* View Mode */}
          {address && !isEditMode && (
            <div className="pad-details-card">
              <div className="pad-card-header">
                <h2 className="pad-card-title">📍 Your Permanent Address</h2>
              </div>

              <div className="pad-display-grid">
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
                  <div className="pad-display-item" key={index}>
                    <span className="pad-display-icon">{item.icon}</span>
                    <div>
                      <span className="pad-display-label">{item.label}</span>
                      <span className="pad-display-value">{item.value || "Not provided"}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Edit Mode */}
          {isEditMode && (
            <>
              <div className="pad-edit-actions-bar">
                <button className="pad-btn-primary" onClick={address ? handleUpdate : handleCreate} disabled={saving}>
                  {saving ? "⏳ Saving..." : address ? "💾 Update Address" : "💾 Create Address"}
                </button>
                <button className="pad-btn-secondary" onClick={handleCancelEdit} disabled={saving}>
                  ❌ Cancel
                </button>
              </div>

              <div className="pad-form-card">
                <div className="pad-card-header">
                  <h2 className="pad-card-title">📝 {address ? "Update" : "Add"} Address Details</h2>
                </div>

                <div className="pad-form-section">
                  <h4 className="pad-section-title">📍 Address Information</h4>
                  <div className="pad-form-grid">
                    <div className="pad-form-group pad-full-width">
                      <label className="pad-form-label">Address Line 1 <span className="pad-required">*</span></label>
                      <input type="text" className="pad-form-input" value={form.address1} onChange={(e) => setForm({ ...form, address1: e.target.value })} placeholder="Enter your address" disabled={saving} />
                    </div>
                    <div className="pad-form-group"><label className="pad-form-label">Address Line 2</label><input type="text" className="pad-form-input" value={form.address2} onChange={(e) => setForm({ ...form, address2: e.target.value })} placeholder="Apartment, suite, etc." disabled={saving} /></div>
                    <div className="pad-form-group"><label className="pad-form-label">Address Line 3</label><input type="text" className="pad-form-input" value={form.address3} onChange={(e) => setForm({ ...form, address3: e.target.value })} placeholder="Landmark, area" disabled={saving} /></div>
                    <div className="pad-form-group">
                      <label className="pad-form-label">Pincode</label>
                      <input type="text" className="pad-form-input" value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} onBlur={fetchPincodeInfo} placeholder="Enter pincode" maxLength="6" disabled={saving} />
                      {pincodeInfo && <div className="pad-pincode-info">📍 {pincodeInfo.city}, {pincodeInfo.state}</div>}
                    </div>
                    <div className="pad-form-group"><label className="pad-form-label">State</label><input type="text" className="pad-form-input" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} placeholder="Enter state" disabled={saving} /></div>
                  </div>
                </div>

                <div className="pad-form-section">
                  <h4 className="pad-section-title">📞 Contact Details</h4>
                  <div className="pad-form-grid">
                    <div className="pad-form-group"><label className="pad-form-label">ISD Code</label><input type="text" className="pad-form-input" value={form.isd_code} onChange={(e) => setForm({ ...form, isd_code: e.target.value })} placeholder="+91" disabled={saving} /></div>
                    <div className="pad-form-group"><label className="pad-form-label">STD Code</label><input type="text" className="pad-form-input" value={form.std_code} onChange={(e) => setForm({ ...form, std_code: e.target.value })} placeholder="Enter STD code" disabled={saving} /></div>
                    <div className="pad-form-group"><label className="pad-form-label">Telephone Number 1</label><input type="text" className="pad-form-input" value={form.tel_number1} onChange={(e) => setForm({ ...form, tel_number1: e.target.value })} placeholder="Primary telephone" disabled={saving} /></div>
                    <div className="pad-form-group"><label className="pad-form-label">Telephone Number 2</label><input type="text" className="pad-form-input" value={form.tel_number2} onChange={(e) => setForm({ ...form, tel_number2: e.target.value })} placeholder="Secondary telephone" disabled={saving} /></div>
                    <div className="pad-form-group"><label className="pad-form-label">Mobile Number 1</label><input type="text" className="pad-form-input" value={form.mobile_number1} onChange={(e) => setForm({ ...form, mobile_number1: e.target.value })} placeholder="Primary mobile" disabled={saving} /></div>
                    <div className="pad-form-group"><label className="pad-form-label">Mobile Number 2</label><input type="text" className="pad-form-input" value={form.mobile_number2} onChange={(e) => setForm({ ...form, mobile_number2: e.target.value })} placeholder="Secondary mobile" disabled={saving} /></div>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}