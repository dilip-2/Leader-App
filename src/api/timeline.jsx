// src/api/timeline.js
import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

const getHeaders = () => {
  const appKey = Cookies.get("decodedAppKey"); // ✅ login ke time token se decode karke save hui thi
  const token = Cookies.get("accessToken");
  return {
    "x-app-key": appKey || "",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

const handleError = (error, action) => {
  if (error.response) {
    console.error(`❌ ${action} failed:`, error.response.data);
    throw new Error(`${action} failed: ${error.response?.data?.message || "Server error"}`);
  } else if (error.request) {
    console.error(`⚠️ ${action} failed: No response from server`);
    throw new Error(`${action} failed: No response from server`);
  } else {
    console.error(`❗ ${action} failed:`, error.message);
    throw new Error(`${action} failed: ${error.message}`);
  }
};

// GET - Fetch timeline
export const getTimeline = async (mobile, email) => {
  try {
    const res = await api.get("/leadertimeline", {
      headers: getHeaders(),
      params: { leader_regd_mobile_no: mobile, user_email_id: email },
    });
    return res;
  } catch (error) {
    handleError(error, "Fetching timeline");
  }
};

// POST - Create timeline entry (FIXED - Correct structure)
export const createTimelineEntry = async (mobile, email, entry) => {
  try {
    const data = {
      leader_regd_mobile_no: mobile,
      user_email_id: email,
      timeline: [entry], // ✅ Direct timeline array, no nested object
    };

    console.log("📤 Creating timeline entry:", data);

    const res = await api.post("/leadertimeline", data, { headers: getHeaders() });
    return res;
  } catch (error) {
    handleError(error, "Creating timeline entry");
  }
};

// PUT - Update timeline entry
export const updateTimeline = async ({ leader_regd_mobile_no, user_email_id, timelineId, timeline }) => {
  try {
    const data = {
      leader_regd_mobile_no,
      user_email_id,
      timelineId,
      timeline,
    };

    console.log("📤 Updating timeline entry:", data);

    const res = await api.put("/leadertimeline", data, {
      headers: getHeaders(),
    });

    return res;
  } catch (error) {
    handleError(error, "Updating timeline entry");
  }
};

// DELETE - Single entry
export const deleteTimelineEntry = async (mobile, email, timelineId) => {
  if (!timelineId) throw new Error("timelineId required for delete");
  try {
    const res = await api.delete("/leadertimeline/entry", {
      headers: getHeaders(),
      params: { leader_regd_mobile_no: mobile, user_email_id: email, timelineId },
    });
    return res;
  } catch (error) {
    handleError(error, "Deleting timeline entry");
  }
};

// DELETE - All entries
export const deleteAllTimeline = async (mobile, email) => {
  try {
    const res = await api.delete("/leadertimeline", {
      headers: getHeaders(),
      params: { leader_regd_mobile_no: mobile, user_email_id: email },
    });
    return res;
  } catch (error) {
    handleError(error, "Deleting all timeline entries");
  }
};

export default api;