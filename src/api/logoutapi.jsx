import axios from "axios";
import Cookies from "js-cookie";
const FALLBACK_APP_KEY = import.meta.env.VITE_APP_KEY;

// ✅ API instance with proxy
const api = axios.create({
  baseURL: "/api", // proxy must point to localhost:5000
});

// ✅ Dynamic Headers (using cookies)
const getHeaders = () => {
  const appKey = Cookies.get("appKey") || FALLBACK_APP_KEY;  // ✅ .env fallback
  const accessToken = Cookies.get("accessToken") || "dummy-access-token";

  return {
    "Content-Transfer-Encoding": "application/json",
    "Content-Type": "application/json",
    "x-app-key": appKey,
    Authorization: `Bearer ${accessToken}`,
  };
};

// ✅ Logout API Function
export const logoutUser = async (email, refreshToken) => {
  try {
    const response = await api.post(
      "/auth/logout",
      { email, refreshToken },
      { headers: getHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error("Logout API Error:", error.response?.data || error.message);
    throw error;
  }
};
