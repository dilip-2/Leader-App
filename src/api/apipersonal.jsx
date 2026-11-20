// src/api/apipersonal.js
import axios from "axios";
import Cookies from "js-cookie";

// Create Axios instance with proxy
const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔑 Helper function to attach headers
const getHeaders = () => {
  const appKey = Cookies.get("decodedAppKey"); // ✅ login ke time token se decode karke save hui thi
  const accessToken = Cookies.get("accessToken");
  return {
    "x-app-key": appKey || "",
    Authorization: accessToken ? `Bearer ${accessToken}` : "",
  };
};

/* ------------------ Personal Details APIs ------------------ */

// 🟢 GET - Fetch personal info
export const getPersonalInfo = (mobile, email) =>
  api.get("/personaldetails/", {
    headers: getHeaders(),
    params: {
      leader_regd_mobile_no: mobile,
      user_email_id: email,
    },
  });

// 🟢 POST - Create personal info
export const createPersonalInfo = (data) =>
  api.post("/personaldetails", data, {
    headers: getHeaders(),
  });

// 🟡 PUT - Update personal info
export const updatePersonalInfo = (data) =>
  api.put("/personaldetails/", data, {
    headers: getHeaders(),
  });

// 🔴 DELETE - Delete personal info
export const deletePersonalInfo = (mobile, email) =>
  api.delete("/personaldetails/", {
    headers: getHeaders(),
    params: {
      leader_regd_mobile_no: mobile,
      user_email_id: email,
    },
  });

export default api;