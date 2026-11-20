import axios from "axios";
import Cookies from "js-cookie";

// Base API URL (proxy handle karega)
const API_BASE = "/api";

// Header generator (access token + app key)
const getHeaders = () => {
  const accessToken = Cookies.get("accessToken");
  const appKey = Cookies.get("decodedAppKey"); // ✅ login ke time token se decode karke save hui thi

  return {
    "Content-Type": "application/json",
    Authorization: accessToken ? `Bearer ${accessToken}` : "",
    "x-app-key": appKey || "",
  };
};

/* =========================================================
   🟢 APPOINTMENTS API (GET + SEARCH + PUT + DELETE)
   ========================================================= */

// Fetch All Appointments
export const fetchAllAppointments = async (mobile, email) => {
  const response = await axios.get(`${API_BASE}/appointments/`, {
    params: {
      leader_regd_mobile_no: mobile,
      user_email_id: email,
    },
    headers: getHeaders(),
  });
  return response.data;
};

// Search Appointment
export const searchAppointment = async (mobile, email, searchText) => {
  const response = await axios.get(`${API_BASE}/appointments/search`, {
    params: {
      leader_regd_mobile_no: mobile,
      user_email_id: email,
      regn_no: searchText,
      applicant_mobile: searchText,
    },
    headers: getHeaders(),
  });
  return response.data;
};

// UPDATE Appointment (PUT)
export const updateAppointment = async (bodyData) => {
  const response = await axios.put(`${API_BASE}/appointments/`, bodyData, {
    headers: getHeaders(),
  });
  return response.data;
};

// DELETE Appointment (DELETE)
export const deleteAppointment = async (mobile, email, regnNo) => {
  const response = await axios.delete(`${API_BASE}/appointments/`, {
    params: {
      leader_regd_mobile_no: mobile,
      user_email_id: email,
      regn_no: regnNo,
    },
    headers: getHeaders(),
  });
  return response.data;
};

export default {
  fetchAllAppointments,
  searchAppointment,
  updateAppointment,
  deleteAppointment,
};