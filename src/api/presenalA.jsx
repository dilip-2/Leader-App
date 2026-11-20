// src/api/apipresentA.js
import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

const getHeaders = () => {
  const appKey = Cookies.get("decodedAppKey"); // ✅ login ke time token se decode karke save hui thi
  const accessToken = Cookies.get("accessToken");
  return {
    "x-app-key": appKey || "",
    Authorization: accessToken ? `Bearer ${accessToken}` : "",
  };
};

// 1️⃣ GET
export const getPresentAddress = (mobile, email) =>
  api.get("/preaddress", {
    headers: getHeaders(),
    params: { leader_regd_mobile_no: mobile, user_email_id: email },
  });

// 2️⃣ POST - Just pass the data as-is (component sends correct format)
export const createPresentAddress = (data) => {
  console.log("📤 API createPresentAddress:", data);
  return api.post("/preaddress", data, { headers: getHeaders() });
};

// 3️⃣ PUT - Just pass the data as-is (component sends correct format)
export const updatePresentAddress = (data) => {
  console.log("📤 API updatePresentAddress:", data);
  return api.put("/preaddress", data, { headers: getHeaders() });
};

// 4️⃣ DELETE
export const deletePresentAddress = (mobile, email) =>
  api.delete("/preaddress", {
    headers: getHeaders(),
    params: { leader_regd_mobile_no: mobile, user_email_id: email },
  });

export default api;