import React, { useState, useEffect } from "react";
import { Plus  } from 'lucide-react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Box,
  Typography,
  useMediaQuery,
  useTheme,
  Popper,
  Paper,
  Divider,
  Button,
  Fade,
  InputBase
} from "@mui/material";
import {
  AccountCircle,
  ArrowBack,
  Logout,
  Menu as MenuIcon,
  Search as SearchIcon
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { keyframes } from "@emotion/react";
import { useAuth } from "./Auth/useAuth";
import { setShowAddFolderModal } from "../Store/uploadSlice";
import { useDispatch } from "react-redux";
import AddNewFolderFileButton from "./AddNewFolderFileButton";

const slideIn = keyframes`
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Header = ({ isSidebarOpen, currentTab, onSidebarToggle }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
   const { logout, user } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;

  const [popperAnchorEl, setPopperAnchorEl] = useState(null);
  const isPopperOpen = Boolean(popperAnchorEl);
  const [searchValue, setSearchValue] = useState("");

  const handleAvatarClick = (event) => setPopperAnchorEl(popperAnchorEl ? null : event.currentTarget);
  const handleClosePopper = () => setPopperAnchorEl(null);
  const handleProfile = () => { handleClosePopper(); navigate("/profile"); };
  const handleLogout = () => { logout(); handleClosePopper(); navigate("/login"); };


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popperAnchorEl && !popperAnchorEl.contains(event.target)) handleClosePopper();
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [popperAnchorEl]);

  const getInitials = (name) => {
    const parts = name.split(" ");
    return parts.length >= 2 ? parts[0][0] + parts[1][0] : name.slice(0, 2);
  };


  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor: "white",
        borderBottom: "1px solid #e5e7eb",
        width: { xs: "100%", sm: `calc(100% - ${isSidebarOpen ? 240 : 60}px)` },
        ml: { xs: 0, sm: `${isSidebarOpen ? 240 : 60}px` },
        transition: "all 0.3s ease",
      }}
    >
      <Toolbar
        sx={{
          flexWrap: "wrap",
          gap: 1,
          justifyContent: "space-between",
          pl: isSidebarOpen ? (state ? "24px" : "6px") : "25px",
          backgroundColor: "white",
          animation: `${slideIn} 0.5s ease`,
          minHeight: "44px !important"
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          {isMobile && <IconButton onClick={onSidebarToggle}><MenuIcon /></IconButton>}
          {state && (
            <IconButton onClick={() => location.pathname.includes("updateUser") ? navigate("/users") : navigate("/home")}>
              <ArrowBack fontSize="small" />
            </IconButton>
          )}
        </Box>
        <Typography sx={{color:'black',fontWeight:'bold',fontSize:'24px'}}>My Documents</Typography>
        <Box flexGrow={1} mx={2} display="flex" justifyContent="center">
          <Paper
            component="form"
            sx={{
              display: "flex",
              alignItems: "center",
              width: { xs: "100%", sm: "60%" },
              p: "0px 2px",
              borderRadius: 2,
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
            }}
            onSubmit={(e) => e.preventDefault()}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              inputProps={{ "aria-label": "search" }}
            />
            <IconButton type="submit" sx={{ p: "10px" }}>
              <SearchIcon />
            </IconButton>
          </Paper>
          <AddNewFolderFileButton/>
        </Box>
        
        <Box display="flex" alignItems="center" gap={1}>
          <IconButton onClick={handleAvatarClick}>
            <Avatar sx={{ width: 30, height: 30, fontSize: "0.875rem", background: "linear-gradient(to right, #3b54b0, #ea641f)" }}>
               {getInitials(user?.username || "U")}
            </Avatar>
          </IconButton>
        </Box>
      </Toolbar>
      <Popper
        open={isPopperOpen}
        anchorEl={popperAnchorEl}
        placement="bottom-end"
        transition
        disablePortal
        modifiers={[{ name: "offset", options: { offset: [0, 8] } }]}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={200}>
            <Paper sx={{ p: 2, width: { xs: "90vw", sm: 300 }, maxWidth: 300, borderRadius: 2, backgroundColor: "#fff" }}>
                    <Box display="flex" alignItems="center" gap={2} mb={1}>
                <Avatar
                  sx={{
                    bgcolor: "#3b54b0",
                    width: 48,
                    height: 48,
                    fontSize: 18,
                  }}
                >
                  {getInitials(user?.username || "U")}
                </Avatar>
                <Box>
                  <Typography fontWeight={600} sx={{ wordBreak: "break-word" }}>
                    {user?.username || "Unknown User"}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ wordBreak: "break-word", whiteSpace: "normal" }}
                  >
                    {user?.username || "unknown@example.com"}
                  </Typography>

                  {user?.role && (
                    <Typography
                      variant="caption"
                      sx={{ color: "#ea641f", fontWeight: 500 }}
                    >
                      {user.role}
                    </Typography>
                  )}
                </Box>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box display="flex" flexDirection="column" gap={1}>
                <Button startIcon={<AccountCircle />} onClick={handleProfile} fullWidth sx={{ justifyContent: "flex-start", textTransform: "none", color: "text.primary" }}>
                  My Profile
                </Button>
                <Divider />
                <Button startIcon={<Logout />} onClick={handleLogout} fullWidth sx={{ justifyContent: "flex-start", textTransform: "none", color: "#ea641f", "&:hover": { backgroundColor: "#f4dabe" } }}>
                  Sign out
                </Button>
              </Box>
            </Paper>
          </Fade>
        )}
      </Popper>
    </AppBar>
  );
};

export default Header;
