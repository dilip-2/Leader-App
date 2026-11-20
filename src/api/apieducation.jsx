// src/api/apiaducation.js
import axios from "axios";
import Cookies from "js-cookie";

// ✅ Proxy ke liye baseURL "/api"
const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Dynamic headers (app-key + accessToken from cookies)
const getHeaders = () => {
  const token = Cookies.get("accessToken");
  const appKey = Cookies.get("decodedAppKey"); // ✅ login ke time token se decode karke save hui thi

  return {
    "x-app-key": appKey || "",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

// ✅ 1️⃣ GET - Fetch all education entries
export const getEducation = (mobile, email) =>
  api.get("/edudata", {
    headers: getHeaders(),
    params: {
      leader_regd_mobile_no: mobile,
      user_email_id: email,
    },
  });

// ✅ 2️⃣ POST - Add multiple education entries
export const addEducation = (data) =>
  api.post("/edudata", data, {
    headers: getHeaders(),
  });

// ✅ 3️⃣ POST - Add single education entry
export const addEducationEntry = (data) =>
  api.post("/edudata/entry", data, {
    headers: getHeaders(),
  });

// ✅ 4️⃣ PUT - Update existing education entry
export const updateEducation = (data) =>
  api.put("/edudata/entry", data, {
    headers: getHeaders(),
  });

// ✅ 5️⃣ DELETE - Delete education entry
export const deleteEducation = (mobile, email, eduId) =>
  api.delete("/edudata/entry", {
    headers: getHeaders(),
    params: {
      leader_regd_mobile_no: mobile,
      user_email_id: email,
      eduId: eduId,
    },
  });

export default api;