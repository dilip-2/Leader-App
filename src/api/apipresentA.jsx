// src/api/apipresentA.jsx
import api from "./api";
import Cookies from "js-cookie";

// 🧠 Function to get common headers
const getHeaders = () => {
  const token = Cookies.get("accessToken");
  const appKey = Cookies.get("decodedAppKey"); // ✅ login ke time token se decode karke save hui thi

  return {
    "x-app-key": appKey || "",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

// ✅ 1️⃣ GET - Fetch Present Address
export const getPresentAddress = (mobile, email) =>
  api.get("/preaddress/", {
    headers: getHeaders(),
    params: {
      leader_regd_mobile_no: mobile,
      user_email_id: email,
    },
  });

// ✅ 2️⃣ POST - Create Present Address
export const createPresentAddress = (data) =>
  api.post("/preaddress", data, {
    headers: getHeaders(),
  });

// ✅ 3️⃣ PUT - Update Present Address
export const updatePresentAddress = (data) =>
  api.put("/preaddress", data, {
    headers: getHeaders(),
  });

// ✅ 4️⃣ DELETE - Delete Present Address
export const deletePresentAddress = (mobile, email) =>
  api.delete("/preaddress/", {
    headers: getHeaders(),
    params: {
      leader_regd_mobile_no: mobile,
      user_email_id: email,
    },
  });