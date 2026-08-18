import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ children, adminOnly = false }) {

  const location = useLocation();

  const token = localStorage.getItem("token");

  const role = String(
    localStorage.getItem("userRole") || ""
  )
    .replace("ROLE_", "")
    .trim()
    .toUpperCase();

  console.log("PROTECTED ROUTE");
  console.log("TOKEN:", !!token);
  console.log("ROLE:", role);
  console.log("ADMIN ONLY:", adminOnly);

  // Login nahi hai
  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname
        }}
      />
    );
  }

  // Admin route hai lekin user admin nahi hai
  if (adminOnly && role !== "ADMIN") {

    console.log(
      "ACCESS DENIED - ROLE:",
      role
    );

    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return children;
}

export default ProtectedRoute;