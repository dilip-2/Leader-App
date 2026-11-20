// src/utils/jwt.js
// ✅ Bina kisi extra package ke JWT token decode karne ka helper

/**
 * JWT ke payload (2nd part) ko decode karke JS object return karta hai
 * @param {string} token - JWT accessToken
 * @returns {object|null}
 */
export function decodeJWT(token) {
  try {
    if (!token) return null;

    const base64Url = token.split(".")[1]; // payload part
    if (!base64Url) return null;

    // base64url -> base64
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

    // padding fix
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "="
    );

    const jsonPayload = decodeURIComponent(
      atob(padded)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (err) {
    console.error("❌ JWT decode error:", err);
    return null;
  }
}

/**
 * Decoded token ke andar se app key nikalta hai.
 * Backend jo bhi field name use karta ho (app_key / appKey / x-app-key)
 * usko yahan check kar lo — jo bhi actual field ho waha rakh dena.
 */
export function extractAppKeyFromToken(token) {
  const decoded = decodeJWT(token);
  if (!decoded) return null;

  // 👇 In sabhi possible field names me se jo bhi match kare wo use hoga
  return (
    decoded.app_key ||
    decoded.appKey ||
    decoded["x-app-key"] ||
    decoded.appkey ||
    null
  );
}

/**
 * ✅ NEW: Decoded token ke andar se mobile number nikalta hai.
 * Backend jo bhi field name use karta ho (leader_regd_mobile_no / mobile / mobile_no / phone)
 * usme se jo bhi match kare wo use hoga.
 */
export function extractMobileFromToken(token) {
  const decoded = decodeJWT(token);
  if (!decoded) return null;

  return (
    decoded.leader_regd_mobile_no ||
    decoded.mobile ||
    decoded.mobile_no ||
    decoded.phone ||
    decoded.regd_mobile_no ||
    null
  );
}