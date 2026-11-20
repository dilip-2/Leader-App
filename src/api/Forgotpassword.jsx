// src/api/ForgotPassword.js
import axios from "axios";
import Cookies from "js-cookie";

// ✅ Header helper — baaki files jaisa hi pattern
const getHeaders = () => {
  const appKey = Cookies.get("decodedAppKey"); // ✅ login ke time token se decode karke save hui thi

  return {
    "Content-Type": "application/json",
    "x-app-key": appKey || "",
  };
};

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper function for error handling
const handleApiCall = async (apiCall, errorMessage) => {
  try {
    const response = await apiCall();
    console.log("✅ API Success:", response.data);
    return {
      success: true,
      data: response.data,
      message: response.data?.message || "Success",
    };
  } catch (error) {
    console.error("❌", errorMessage, error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || error.message || errorMessage,
    };
  }
};

// 1. Verify Email + Mobile
export const verifyEmail = async (email, mobile) => {
  return handleApiCall(
    () => api.post(
      "/profile/verifyemail",
      {
        leader_regd_mobile_no: mobile,
        user_email_id: email,
      },
      { headers: getHeaders() }
    ),
    "Email verification failed"
  );
};

// 2. Send OTP to Email
export const sendEmailOTP = async (email, mobile) => {
  return handleApiCall(
    () => api.post(
      "/profile/sendotp",
      {
        leader_regd_mobile_no: mobile,
        user_email_id: email,
      },
      { headers: getHeaders() }
    ),
    "Failed to send OTP"
  );
};

// 3. Verify Email OTP
export const verifyEmailOTP = async (email, mobile, otp) => {
  return handleApiCall(
    () => api.post(
      "/profile/verifyemailotp",
      {
        leader_regd_mobile_no: mobile,
        user_email_id: email,
        otp: otp,
      },
      { headers: getHeaders() }
    ),
    "OTP verification failed"
  );
};

// 4. Reset Password
export const resetPassword = async (email, mobile, newPassword) => {
  return handleApiCall(
    () => api.put(
      "/profile/fp",
      {
        leader_regd_mobile_no: mobile,
        user_email_id: email,
        npassword: newPassword,
      },
      { headers: getHeaders() }
    ),
    "Password reset failed"
  );
};

export default api;