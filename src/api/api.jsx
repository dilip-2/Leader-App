import axios from "axios";
import Cookies from "js-cookie";

// ✅ .env se sirf BASE_URL (app key ab .env se NAHI aayegi)
const BASE_URL = import.meta.env.VITE_BASE_URL;

// Axios instance
const api = axios.create({
  baseURL: `${BASE_URL}/api`,
});

// Headers generate karein
const getHeaders = () => {
  const token = Cookies.get("accessToken");
  const appKey = Cookies.get("decodedAppKey"); // ✅ login ke time token se decode karke save hui thi

  if (!appKey) {
    console.warn(
      "⚠️ decodedAppKey cookie not mili — user shayad login nahi hai ya token se app key decode nahi ho payi"
    );
  }

  console.log("📤 Request Headers:");
  console.log("  - x-app-key:", appKey ? "✅ " + appKey.substring(0, 20) + "..." : "❌ missing");
  console.log("  - Authorization:", token ? "✅ Bearer token present" : "❌ missing");

  return {
    "x-app-key": appKey || "",
    "Authorization": token ? `Bearer ${token}` : "",
  };
};

// Axios interceptor - sabhi requests ke liye
api.interceptors.request.use(
  (config) => {
    const headers = getHeaders();
    config.headers["x-app-key"] = headers["x-app-key"];
    config.headers["Authorization"] = headers["Authorization"];

    console.log("🚀 Request:", config.method.toUpperCase(), config.url);
    console.log("   Headers:", {
      "x-app-key": config.headers["x-app-key"]
        ? config.headers["x-app-key"].substring(0, 20) + "..."
        : "missing",
      "Authorization": config.headers["Authorization"] ? "Bearer ..." : "none",
    });
    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

// Axios interceptor - sabhi responses ke liye
api.interceptors.response.use(
  (response) => {
    console.log("✅ Response:", response.status, response.config.url);
    return response;
  },
  (error) => {
    if (error.response?.status === 403) {
      console.error("🚫 403 Forbidden");
      console.error("Possible reasons:");
      console.error("  1. Invalid or missing x-app-key header");
      console.error("  2. Invalid or expired access token");
      console.error("  3. User not authorized for this resource");
    }
    if (error.response?.status === 401) {
      console.error("🚫 401 Unauthorized");
      console.error("Possible reasons:");
      console.error("  1. leader_regd_mobile_no ya user_email_id request me galat/mismatch hai");
      console.error("  2. Token expire ho gaya");
      console.error("  3. x-app-key galat decode hui / backend token mismatch");
    }
    console.error("❌ Response Error:", {
      status: error.response?.status,
      message: error.message,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);

// ✅ Helper: mobile/email agar function me explicitly pass na kiye ho,
// to cookies se (jo login ke time save hui thi, token-decoded mobile included) fallback le lo
const resolveIdentity = (mobile, email) => ({
  mobile: mobile || Cookies.get("leader_regd_mobile_no") || "",
  email: email || Cookies.get("email") || "",
});

// GET - Social Media
export const getSocial = (mobile, email) => {
  const identity = resolveIdentity(mobile, email);
  return api.get("/socialmedia", {
    params: {
      leader_regd_mobile_no: identity.mobile,
      user_email_id: identity.email,
    },
  });
};

// POST - Create Social Media
export const createSocial = (data) => api.post("/socialmedia", data);

// PUT - Update Social Media
export const updateSocial = (data) => api.put("/socialmedia", data);

// DELETE - Delete Social Media
export const deleteSocial = (mobile, email) => {
  const identity = resolveIdentity(mobile, email);
  return api.delete("/socialmedia", {
    params: {
      leader_regd_mobile_no: identity.mobile,
      user_email_id: identity.email,
    },
  });
};

// Helper: Login ke baad cookies set karne ke liye
// ✅ appKey aur mobile ab manually pass karne ki zaroorat nahi — ye Login.jsx me
// token decode hone ke baad khud "decodedAppKey" / "leader_regd_mobile_no" cookie me save ho jaate hain.
// Ye helper sirf kahin alag se accessToken/appKey/mobile save karna ho to kaam aa sakta hai.
export const setAuthCookies = (accessToken, decodedAppKey, decodedMobile) => {
  console.log("🔐 Setting auth cookies...");
  Cookies.set("accessToken", accessToken, { expires: 7, path: "/" });
  if (decodedAppKey) {
    Cookies.set("decodedAppKey", decodedAppKey, { expires: 7, path: "/" });
  }
  if (decodedMobile) {
    Cookies.set("leader_regd_mobile_no", decodedMobile, { expires: 7, path: "/" });
  }
  console.log("✅ Auth cookies saved:", {
    accessToken: accessToken ? "set" : "missing",
    decodedAppKey: decodedAppKey ? "set" : "missing",
    decodedMobile: decodedMobile ? "set" : "missing",
  });
};

// Helper: Logout - cookies remove karne ke liye
export const clearAuthCookies = () => {
  console.log("🗑️ Clearing auth cookies...");
  Cookies.remove("accessToken", { path: "/" });
  Cookies.remove("refreshToken", { path: "/" });
  Cookies.remove("decodedAppKey", { path: "/" });
  Cookies.remove("leader_regd_mobile_no", { path: "/" });
  Cookies.remove("email", { path: "/" });
  console.log("✅ Auth cookies cleared");
};

// Debug helper
export const debugAuth = () => {
  console.log("=== AUTH DEBUG ===");
  console.log("All cookies:", document.cookie);
  console.log("accessToken:", Cookies.get("accessToken") || "❌ Not found");
  console.log("decodedAppKey:", Cookies.get("decodedAppKey") || "❌ Not found");
  console.log("leader_regd_mobile_no:", Cookies.get("leader_regd_mobile_no") || "❌ Not found");
  console.log("email:", Cookies.get("email") || "❌ Not found");
  console.log("BASE_URL:", BASE_URL);
  console.log("==================");
};

export default api;