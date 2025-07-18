import React from "react";
import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireCustomer?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false, requireCustomer = false }: Props) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const role = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    // Örneğin: "Admin", "Customer", "Employee" vs.

    if (requireAdmin && role !== "Admin") {
      return <Navigate to="/login" replace />;
    }

    if (requireCustomer && role !== "Customer") {
      return <Navigate to="/login-customer" replace />;
    }

    return children;
  } catch (err) {
    console.error("JWT parse error:", err);
    localStorage.removeItem("token"); // güvenlik için temizle
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
