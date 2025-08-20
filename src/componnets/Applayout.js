import React, { useState } from "react";
import { Box, CssBaseline, useMediaQuery } from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import DocumentRepository from "../pages/incidents/DocumentRepository";


const AppLayout = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const is320 = useMediaQuery("(max-width:320px)");

  const activeTab = location.pathname.split("/")[1] || "dashboard";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        width: "100%",
        backgroundColor: "#eaebf6",
      }}
    >
      <CssBaseline />

      <Header
        isSidebarOpen={isOpen}
        currentTab={activeTab}
        onSidebarToggle={() => setMobileOpen(true)}
      />

      <Sidebar
        activeTab={activeTab}
        setActiveTab={() => {}}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        mobileOpen={mobileOpen}
        handleMobileToggle={() => setMobileOpen(false)}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          mt: is320 ? "180px" : { xs: 14, sm: isOpen ? "100px" : 9, md: 9 },
          ml: { xs: "15px", sm: "10px" },
          pr: "10px",
          transition: "margin-left 0.3s ease",
          overflow: "hidden",
          mb: 2,
        }}
      >
       <Outlet/>
      </Box>
    </Box>
  );
};

export default AppLayout;
