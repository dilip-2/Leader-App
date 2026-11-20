// src/api/apicontactus.js
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
    "Authorization": accessToken ? `Bearer ${accessToken}` : "",
  };
};

/* ------------------ Contact Us APIs ------------------ */

// 🟢 GET - Fetch contact us info
export const getContactUs = (mobile, email) =>
  api.get("/contactus/", {
    headers: getHeaders(),
    params: {
      leader_regd_mobile_no: mobile,
      user_email_id: email,
    },
  });

// 🟢 POST - Create contact us info
export const createContactUs = (data) =>
  api.post("/contactus", data, {
    headers: getHeaders(),
  });

// 🟡 PUT - Update contact us info
export const updateContactUs = (data) =>
  api.put("/contactus/", data, {
    headers: getHeaders(),
  });

// 🔴 DELETE - Delete contact us info
export const deleteContactUs = (mobile, email) =>
  api.delete("/contactus/", {
    headers: getHeaders(),
    params: {
      leader_regd_mobile_no: mobile,
      user_email_id: email,
    },
  });

export default api;