import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LoadingSpinner from "../partials/components/LoadingSpinner";

export const ProtectedRoute = ({ children }) => {
  const { loading, token } = useAuth();

  if (loading) return <LoadingSpinner />;
  return token ? children : <Navigate to="/auth/signin" replace />;
};

export const AdminRoute = ({ children }) => {
  const { loading, token, user } = useAuth();

  if (loading) return <LoadingSpinner />;
  return token && user.role?.includes("Admin") ? (
    children
  ) : (
    <Navigate to="/auth/signin" replace />
  );
};
