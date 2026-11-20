import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function PrivateRoute({ children }) {
  const isLoggedIn = !!Cookies.get("accessToken");

  if (!isLoggedIn) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h2>🚫 Please login first to access this page.</h2>
        <p>You are not authorized to view this page.</p>
      </div>
    );
  }

  return children;
}
