import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}/api`,
});

const getHeaders = () => {
  // ✅ Ab .env wala fallback nahi — sirf login ke time token se decode
  // karke save ki gayi app key use hogi (Login.jsx dekho: "decodedAppKey" cookie)
  const appKey = Cookies.get("decodedAppKey") || "";
  const accessToken = Cookies.get("accessToken") || "";

  return {
    "x-app-key": appKey,
    Authorization: `Bearer ${accessToken}`,
  };
};

// CREATE MEDIA (POST) - multipart/form-data
export const createMediaCorner = (formData) =>
  api.post("/mediacorner", formData, {
    headers: {
      ...getHeaders(),
      "Content-Type": "multipart/form-data",
    },
  });

// LIST ALL MEDIA
export const getMediaCornerList = (mobile, email, mediaType) =>
  api.get("/mediacorner", {
    headers: getHeaders(),
    params: {
      leader_regd_mobile_no: mobile,
      user_email_id: email,
      media_type: mediaType,
    },
  });

// DELETE MEDIA
export const deleteMediaCorner = (id, mobile, email) =>
  api.delete("/mediacorner", {
    headers: getHeaders(),
    params: {
      id,
      leader_regd_mobile_no: mobile,
      user_email_id: email,
    },
  });

// UPDATE MEDIA (PUT) - multipart/form-data
export const updateMediaCorner = (formData) =>
  api.put("/mediacorner", formData, {
    headers: {
      ...getHeaders(),
      "Content-Type": "multipart/form-data",
    },
  });

// GET MEDIA ASSET
export const getMediaAsset = (mobile, email, fileName) =>
  api.get("/mediacorner/asset", {
    headers: getHeaders(),
    params: {
      leader_regd_mobile_no: mobile,
      user_email_id: email,
      media_file: fileName,
    },
    responseType: "blob", // Important for file downloads
  });

export default api;