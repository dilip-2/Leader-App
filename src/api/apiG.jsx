import axios from "axios";
import Cookies from "js-cookie";

// Base API URL (proxy handle karega)
const API_BASE = "/api";

// Header generator (access token + app key)
const getHeaders = () => {
  const accessToken = Cookies.get("accessToken");
  const appKey = Cookies.get("decodedAppKey"); // ✅ login ke time token se decode karke save hui thi

  console.log("🔑 Access Token:", accessToken);
  console.log("🔐 App Key:", appKey);

  return {
    "Content-Type": "application/json",
    Authorization: accessToken ? `Bearer ${accessToken}` : "",
    "x-app-key": appKey || "",
  };
};

/* --------------------------------------------------------
   🔹 GET ALL GRIEVANCES  
---------------------------------------------------------*/
export const fetchAllGrievances = async (mobile, email) => {
  const response = await axios.get(`${API_BASE}/grievances/`, {
    params: {
      leader_regd_mobile_no: mobile,
      user_email_id: email,
    },
    headers: getHeaders(),
  });
  return response.data;
};

/* --------------------------------------------------------
   🔹 SEARCH GRIEVANCE BY REGN NO  
---------------------------------------------------------*/
export const searchGrievanceByRegn = async (mobile, email, regnNo) => {
  const response = await axios.get(`${API_BASE}/grievances/search`, {
    params: {
      leader_regd_mobile_no: mobile,
      user_email_id: email,
      regn_no: regnNo,
    },
    headers: getHeaders(),
  });
  return response.data;
};

/* --------------------------------------------------------
   🔹 UPDATE GRIEVANCE STATUS (PUT)
---------------------------------------------------------*/
export const updateGrievance = async (bodyData) => {
  const response = await axios.put(`${API_BASE}/grievances/`, bodyData, {
    headers: getHeaders(),
  });
  return response.data;
};

/* --------------------------------------------------------
   🔹 DELETE GRIEVANCE (DELETE)
---------------------------------------------------------*/
export const deleteGrievance = async (mobile, email, regnNo) => {
  const response = await axios.delete(`${API_BASE}/grievances/`, {
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
  fetchAllGrievances,
  searchGrievanceByRegn,
  updateGrievance,
  deleteGrievance,
};