import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./useAuth";

const GuestGuard = ({ children }) => {
  const { user, authReady } = useAuth();

  if (!authReady) return null;

  return user ? <Navigate to="/home" replace /> : children;
};

export default GuestGuard;
