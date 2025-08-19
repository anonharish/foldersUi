import React from "react";
import { Navigate } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { useAuth } from "./useAuth";

const AuthGuard = ({ children }) => {
  const { user, authReady } = useAuth();

  if (!authReady) {
    // Simple loader instead of Lottie
    return (
      <Box
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          textAlign: "center",
        }}
      >
        <CircularProgress size={80} />
        <Box style={{ marginTop: "1rem", fontSize: "1.2rem", color: "#555" }}>
          Loading...
        </Box>
      </Box>
    );
  }

  return user ? children : <Navigate to="/login" />;
};

export default AuthGuard;
