// ✅ Assembly Constituencies API (GET, POST, PUT, DELETE)
import axios from "axios";
import Cookies from "js-cookie";

// ✅ Base Axios instance
const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

// ✅ Get headers (from Cookies)
const getHeaders = () => {
  const token = Cookies.get("accessToken");
  const appKey = Cookies.get("decodedAppKey"); // ✅ login ke time token se decode karke save hui thi

  return {
    "Content-Type": "application/json",
    "x-app-key": appKey || "",
    Authorization: token ? `Bearer ${token}` : "",
    "x-user-id": "admin_user",
  };
};

// ✅ Centralized Error Handler
const handleError = (error, action) => {
  if (error.response) {
    console.error(`❌ ${action} failed:`, error.response.data);
    throw new Error(
      `${action} failed: ${error.response?.data?.message || "Server error"}`
    );
  } else if (error.request) {
    console.error(`⚠️ ${action} failed: No response from server`);
    throw new Error(`${action} failed: No response from server`);
  } else {
    console.error(`❗ ${action} failed:`, error.message);
    throw new Error(`${action} failed: ${error.message}`);
  }
};

// 🟢 GET Assembly Constituencies
export const getAssemblyConstituencies = async (mobile, email) => {
  try {
    const res = await api.get("/assemblyconstituencies", {
      headers: getHeaders(),
      params: {
        leader_regd_mobile_no: mobile,
        user_email_id: email,
      },
    });
    return res;
  } catch (error) {
    handleError(error, "Fetching Assembly Constituencies");
  }
};

// 🔵 CREATE Assembly Constituencies (POST)
export const createAssemblyConstituencies = async (mobile, email, constituenciesData) => {
  try {
    const res = await api.post(
      "/assemblyconstituencies",
      {
        leader_regd_mobile_no: mobile,
        user_email_id: email,
        assembly_constituencies: constituenciesData,
      },
      { headers: getHeaders() }
    );
    return res;
  } catch (error) {
    handleError(error, "Creating Assembly Constituencies");
  }
};

// 🟡 UPDATE Assembly Constituencies (PUT)
export const updateAssemblyConstituencies = async (mobile, email, constituenciesData) => {
  try {
    const res = await api.put(
      "/assemblyconstituencies",
      {
        leader_regd_mobile_no: mobile,
        user_email_id: email,
        assembly_constituencies: constituenciesData,
      },
      { headers: getHeaders() }
    );
    return res;
  } catch (error) {
    handleError(error, "Updating Assembly Constituencies");
  }
};

// 🔴 DELETE Assembly Constituencies
export const deleteAssemblyConstituencies = async (mobile, email) => {
  try {
    const res = await api.delete("/assemblyconstituencies", {
      headers: getHeaders(),
      params: {
        leader_regd_mobile_no: mobile,
        user_email_id: email,
      },
    });
    return res;
  } catch (error) {
    handleError(error, "Deleting Assembly Constituencies");
  }
};

export default api;