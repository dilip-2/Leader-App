// src/api/apiaddresspermanent.js
import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔑 Helper function to attach headers
const getHeaders = () => {
  const appKey = Cookies.get("decodedAppKey"); // ✅ login ke time token se decode karke save hui thi
  const accessToken = Cookies.get("accessToken");

  console.log("🔐 Headers being sent:", {
    appKey: appKey ? "✅ Present" : "❌ Missing",
    accessToken: accessToken ? "✅ Present" : "❌ Missing",
  });

  return {
    "x-app-key": appKey || "",
    Authorization: accessToken ? `Bearer ${accessToken}` : "",
  };
};

/* ------------------ Permanent Address APIs ------------------ */

// 🟢 GET - Fetch permanent address
export const getPermAddress = (mobile, email) => {
  console.log("📥 GET Permanent Address:", { mobile, email });
  return api.get("/permaddress", {
    headers: getHeaders(),
    params: {
      leader_regd_mobile_no: mobile,
      user_email_id: email,
    },
  });
};

// 🟢 POST - Create permanent address
export const createPermAddress = (data) => {
  console.log("📤 POST Create Permanent Address - RAW DATA:", data);

  const payload = {
    leader_regd_mobile_no: data.leader_regd_mobile_no,
    user_email_id: data.user_email_id,
    perm_address: {
      address1: data.address1,
      address2: data.address2,
      address3: data.address3,
      pincode: data.pincode,
      state: data.state,
      isd_code: data.isd_code,
      std_code: data.std_code,
      tel_number1: data.tel_number1,
      tel_number2: data.tel_number2,
      mobile_number1: data.mobile_number1,
      mobile_number2: data.mobile_number2,
    },
  };

  console.log("📤 POST Create Permanent Address - FORMATTED PAYLOAD:", payload);

  return api.post("/permaddress", payload, {
    headers: getHeaders(),
  });
};

// 🟡 PUT - Update permanent address
export const updatePermAddress = (data) => {
  console.log("📤 PUT Update Permanent Address - RAW DATA:", data);

  const payload = {
    leader_regd_mobile_no: data.leader_regd_mobile_no,
    user_email_id: data.user_email_id,
    perm_address: {
      address1: data.address1,
      address2: data.address2,
      address3: data.address3,
      pincode: data.pincode,
      state: data.state,
      isd_code: data.isd_code,
      std_code: data.std_code,
      tel_number1: data.tel_number1,
      tel_number2: data.tel_number2,
      mobile_number1: data.mobile_number1,
      mobile_number2: data.mobile_number2,
    },
  };

  console.log("📤 PUT Update Permanent Address - FORMATTED PAYLOAD:", payload);

  return api.put("/permaddress", payload, {
    headers: getHeaders(),
  });
};

// 🔴 DELETE - Delete permanent address
export const deletePermAddress = (mobile, email) => {
  console.log("🗑️ DELETE Permanent Address:", { mobile, email });
  return api.delete("/permaddress", {
    headers: getHeaders(),
    params: {
      leader_regd_mobile_no: mobile,
      user_email_id: email,
    },
  });
};

export default api;