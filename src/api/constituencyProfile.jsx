// ✅ Constituency Profile API (GET, POST, PUT, DELETE)
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
  const userId = Cookies.get("userId");

  return {
    "Content-Type": "application/json",
    "x-app-key": appKey || "",
    Authorization: token ? `Bearer ${token}` : "",
    "x-user-id": userId || "admin_user",
  };
};

// ✅ Get headers for FormData (multipart/form-data)
const getFormDataHeaders = () => {
  const token = Cookies.get("accessToken");
  const userId = Cookies.get("userId");
  const appKey = Cookies.get("decodedAppKey"); // ✅ login ke time token se decode karke save hui thi

  return {
    "Content-Type": "multipart/form-data",
    "x-app-key": appKey || "",
    Authorization: token ? `Bearer ${token}` : "",
    "x-user-id": userId || "admin_user",
  };
};

// ✅ Get user credentials from cookies
const getUserCredentials = () => {
  return {
    mobile: Cookies.get("leader_regd_mobile_no") || "",
    email: Cookies.get("email") || "",
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

/* =======================================================
   🟢 GET Constituency Profile
   Example GET:
   /api/constituencyprofile?leader_regd_mobile_no=7702000725&user_email_id=sanjay.jaiswal@gmail.com
======================================================= */
export const getConstituencyProfile = async (mobile, email) => {
  try {
    // ✅ If mobile/email not provided, get from cookies
    const credentials = mobile && email ? { mobile, email } : getUserCredentials();

    console.log("📡 Fetching constituency profile with:", credentials);

    const res = await api.get("/constituencyprofile", {
      headers: getHeaders(),
      params: {
        leader_regd_mobile_no: credentials.mobile,
        user_email_id: credentials.email,
      },
    });
    return res;
  } catch (error) {
    handleError(error, "Fetching Constituency Profile");
  }
};

/* =======================================================
   🔵 CREATE Constituency Profile (POST)
   ✅ Now accepts mobile & email as parameters
   Backend expects:
   {
     "leader_regd_mobile_no": "7702000725",
     "user_email_id": "sanjay.jaiswal@gmail.com",
     "constitency_profile": { ...all fields... }
   }
======================================================= */
export const createConstituencyProfile = async (profileData, mobile, email) => {
  try {
    // ✅ If mobile/email not provided, get from cookies
    const credentials = mobile && email ? { mobile, email } : getUserCredentials();

    console.log("📤 Creating constituency profile with:", credentials);

    const res = await api.post(
      "/constituencyprofile",
      {
        leader_regd_mobile_no: credentials.mobile, // ✅ Dynamic
        user_email_id: credentials.email,           // ✅ Dynamic
        constitency_profile: profileData,
      },
      { headers: getHeaders() }
    );
    return res;
  } catch (error) {
    handleError(error, "Creating Constituency Profile");
  }
};

/* =======================================================
   🟡 UPDATE Constituency Profile (PUT)
   ✅ Now accepts mobile & email as parameters
   Backend expects:
   {
     "user_email_id": "sanjay.jaiswal@gmail.com",
     "leader_regd_mobile_no": "7702000725",
     "constitency_profile": { ...all fields... }
   }
======================================================= */
export const updateConstituencyProfile = async (profileData, mobile, email) => {
  try {
    // ✅ If mobile/email not provided, get from cookies
    const credentials = mobile && email ? { mobile, email } : getUserCredentials();

    console.log("🔄 Updating constituency profile with:", credentials);

    const res = await api.put(
      "/constituencyprofile",
      {
        user_email_id: credentials.email,           // ✅ Dynamic
        leader_regd_mobile_no: credentials.mobile, // ✅ Dynamic
        constitency_profile: profileData,
      },
      { headers: getHeaders() }
    );
    return res;
  } catch (error) {
    handleError(error, "Updating Constituency Profile");
  }
};

/* =======================================================
   🔴 DELETE Constituency Profile
   Example DELETE:
   /api/constituencyprofile?leader_regd_mobile_no=7702000725&user_email_id=sanjay.jaiswal@gmail.com
======================================================= */
export const deleteConstituencyProfile = async (mobile, email) => {
  try {
    // ✅ If mobile/email not provided, get from cookies
    const credentials = mobile && email ? { mobile, email } : getUserCredentials();

    console.log("🗑️ Deleting constituency profile with:", credentials);

    const res = await api.delete("/constituencyprofile", {
      headers: getHeaders(),
      params: {
        leader_regd_mobile_no: credentials.mobile,
        user_email_id: credentials.email,
      },
    });
    return res;
  } catch (error) {
    handleError(error, "Deleting Constituency Profile");
  }
};

/* =======================================================
   🟣 UPLOAD/UPDATE Member Image (PUT)
   Endpoint: /api/constituencyprofile/image
   ✅ Uses FormData for file upload (multipart/form-data)
   Accepts: File object or base64 string
======================================================= */
export const uploadMemberImage = async (imageData, mobile, email) => {
  try {
    // ✅ If mobile/email not provided, get from cookies
    const credentials = mobile && email ? { mobile, email } : getUserCredentials();

    console.log('🚀 Uploading member image...', {
      ...credentials,
      imageType: imageData instanceof File ? 'File' : 'base64',
      fileName: imageData instanceof File ? imageData.name : 'converted'
    });

    // ✅ Create FormData for file upload
    const formData = new FormData();
    formData.append('leader_regd_mobile_no', credentials.mobile);
    formData.append('user_email_id', credentials.email);

    // ✅ Handle File object or base64 string
    if (imageData instanceof File) {
      formData.append('leader_image', imageData);
    } else if (typeof imageData === 'string' && imageData.startsWith('data:image')) {
      // Convert base64 to Blob
      const blob = await fetch(imageData).then(r => r.blob());
      formData.append('leader_image', blob, 'leader_image.jpg');
    } else {
      throw new Error('Invalid image format. Expected File object or base64 string.');
    }

    const res = await api.put("/constituencyprofile/image", formData, {
      headers: getFormDataHeaders(),
    });

    console.log('✅ Member image upload successful:', res.data);
    return res;
  } catch (error) {
    console.error('❌ Member image upload error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    handleError(error, "Uploading/Updating Member Image");
  }
};

/* =======================================================
   🟢 GET Member Image
   Endpoint: /api/constituencyprofile/image
   Query Params: leader_regd_mobile_no, user_email_id
======================================================= */
export const getMemberImage = async (mobile, email) => {
  try {
    // ✅ If mobile/email not provided, get from cookies
    const credentials = mobile && email ? { mobile, email } : getUserCredentials();

    console.log('🔍 Fetching member image...', credentials);

    const res = await api.get("/constituencyprofile/image", {
      headers: getHeaders(),
      params: {
        leader_regd_mobile_no: credentials.mobile,
        user_email_id: credentials.email,
      },
    });

    console.log('✅ Member image fetched:', {
      hasImage: !!res.data?.leader_image,
      imageType: res.data?.leader_image?.substring(0, 30)
    });

    return res;
  } catch (error) {
    console.error('❌ Member image fetch error:', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    });
    handleError(error, "Fetching Member Image");
  }
};

/* =======================================================
   🟢 GET Member Image as Blob (Direct Image URL)
   Returns actual image file, not just path
======================================================= */
export const getMemberImageBlob = async (mobile, email) => {
  try {
    // ✅ If mobile/email not provided, get from cookies
    const credentials = mobile && email ? { mobile, email } : getUserCredentials();

    console.log('🔍 Fetching member image as blob...', credentials);

    const res = await api.get("/constituencyprofile/image", {
      headers: getHeaders(),
      params: {
        leader_regd_mobile_no: credentials.mobile,
        user_email_id: credentials.email,
      },
      responseType: 'blob',
    });

    console.log('✅ Member image blob fetched:', res.data);

    // Convert blob to URL
    const imageUrl = URL.createObjectURL(res.data);
    return { data: { imageUrl } };
  } catch (error) {
    console.error('❌ Member image blob fetch error:', error);
    throw error;
  }
};

/* =======================================================
   🔴 DELETE Member Image
   Endpoint: /api/constituencyprofile/image
   Query Params: leader_regd_mobile_no, user_email_id
======================================================= */
export const deleteMemberImage = async (mobile, email) => {
  try {
    // ✅ If mobile/email not provided, get from cookies
    const credentials = mobile && email ? { mobile, email } : getUserCredentials();

    console.log('🗑️ Deleting member image...', credentials);

    const res = await api.delete("/constituencyprofile/image", {
      headers: getHeaders(),
      params: {
        leader_regd_mobile_no: credentials.mobile,
        user_email_id: credentials.email,
      },
    });

    console.log('✅ Member image deleted successfully');
    return res;
  } catch (error) {
    console.error('❌ Member image delete error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    handleError(error, "Deleting Member Image");
  }
};

export default api;