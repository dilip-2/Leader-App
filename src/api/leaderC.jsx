import api from "./api";
import Cookies from "js-cookie";

const getHeaders = (isForm = false) => {
  const token = Cookies.get("accessToken");
  const appKey = Cookies.get("decodedAppKey"); // ✅ login ke time token se decode karke save hui thi

  const headers = {
    "x-app-key": appKey || "",
    Authorization: token ? `Bearer ${token}` : "",
  };

  // Don't set Content-Type for FormData - browser sets it automatically
  if (!isForm) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
};

/* ------------------------------------------
   COORDINATES APIs - FIXED for both POST & PUT
------------------------------------------- */

export const getCoordinates = (mobile, email) =>
  api.get("/coordinates", {
    headers: getHeaders(),
    params: {
      leader_regd_mobile_no: mobile,
      user_email_id: email,
    },
  });

// ✅ POST: Flat structure (as per Postman)
export const createCoordinates = (data) => {
  console.log("📤 createCoordinates (POST) with data:", data);
  return api.post("/coordinates", data, {
    headers: getHeaders(),
  });
};

// ✅ PUT: Nested structure (as per Postman)
export const updateCoordinates = (data) => {
  // Convert flat structure to nested for PUT
  const payload = { ...data };

  // Check if we need to convert flat to nested
  // If data has title but no leader_coordinates, it's flat
  if (data.title && !data.leader_coordinates) {
    console.log("🔄 Converting flat to nested for PUT...");

    // Extract leader_coordinates fields
    const leaderCoords = {
      title: data.title,
      member_name: data.member_name,
      party: data.party,
      constituency: data.constituency,
      state: data.state,
      email_id: data.email_id,
      digital_sansad_url: data.digital_sansad_url || "",
    };

    // Create nested structure
    payload.leader_coordinates = leaderCoords;

    // Remove flat properties
    delete payload.title;
    delete payload.member_name;
    delete payload.party;
    delete payload.constituency;
    delete payload.state;
    delete payload.email_id;
    delete payload.digital_sansad_url;
  }

  console.log("📤 updateCoordinates (PUT) with FINAL payload:", payload);
  return api.put("/coordinates", payload, {
    headers: getHeaders(),
  });
};

export const deleteCoordinates = (mobile, email) =>
  api.delete("/coordinates", {
    headers: getHeaders(),
    params: {
      leader_regd_mobile_no: mobile,
      user_email_id: email,
    },
  });

/* ------------------------------------------
   IMAGE APIs
------------------------------------------- */

export const uploadLeaderImage = async (mobile, email, file) => {
  const formData = new FormData();
  formData.append("leader_regd_mobile_no", mobile);
  formData.append("user_email_id", email);
  formData.append("leader_image", file);

  console.log("📤 Uploading image...");

  // Try with trailing slash first
  try {
    return await api.put("/leaderimage/", formData, {
      headers: getHeaders(true),
    });
  } catch (error) {
    // Try without trailing slash
    if (error.response?.status === 404) {
      try {
        return await api.put("/leaderimage", formData, {
          headers: getHeaders(true),
        });
      } catch (err2) {
        // Last attempt: POST
        if (err2.response?.status === 404) {
          return await api.post("/leaderimage", formData, {
            headers: getHeaders(true),
          });
        }
        throw err2;
      }
    }
    throw error;
  }
};

// GET Leader Image
export const getLeaderImage = (mobile, email, leaderImageName = "") =>
  api.get("/leaderimage", {
    headers: getHeaders(),
    params: {
      leader_regd_mobile_no: mobile,
      user_email_id: email,
      leader_image: leaderImageName,
    },
  });

// DELETE Leader Image
export const deleteLeaderImage = (mobile, email) =>
  api.delete("/leaderimage", {
    headers: getHeaders(),
    params: {
      leader_regd_mobile_no: mobile,
      user_email_id: email,
    },
  });