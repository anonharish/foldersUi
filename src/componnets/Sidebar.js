import React from "react";
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
  Drawer,
  Toolbar,
  Divider,
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  AccessTime,
  Star,
  Delete,
} from "@mui/icons-material";
import { useLocation, Link } from "react-router-dom";

const drawerWidth = 240;
const closedDrawerWidth = 80;
const menuItems = [
  {
    id: "home",
    label: "Home",
    icon: Home,
    color: "#3b54b0",
  },
  {
    id: "recent",
    label: "Recent",
    icon: AccessTime,
    color: "#ea641f",
  },
  {
    id: "starred",
    label: "Starred",
    icon: Star,
    color: "#facc15", 
  },
  {
    id: "deleted",
    label: "Deleted",
    icon: Delete,
    color: "#ef4444",
  },
];

const DrawerContent = ({ isOpen, setActiveTab, handleMobileToggle }) => {
  const location = useLocation();
  return (
    <List sx={{ px: 1 }}>
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isParent = !!item.children;
        const selected = location.pathname === `/${item.id}`;

        if (isParent) {
          return (
            <React.Fragment key={item.id}>
              <ListItemButton
                selected={location.pathname === `/${item.id}`}
                sx={{
                  justifyContent: isOpen ? "initial" : "center",
                  px: 2,
                  py: 1.2,
                  my: 0.5,
                  borderRadius: 2,
                  backgroundColor: "white",
                  color: "#111827",
                  fontWeight:  500,
                  "&:hover": { backgroundColor: "white" },
                }}
              >
                <Tooltip title={!isOpen ? item.label : ""} placement="right">
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: isOpen ? 2 : "auto",
                      justifyContent: "center",
                      color: item.color,
                      "& svg": { fontSize: isOpen ? 26 : 22 },
                    }}
                  >
                    <Icon />
                  </ListItemIcon>
                </Tooltip>
              </ListItemButton>
            </React.Fragment>
          );
        }

        return (
          <ListItemButton
            key={item.id}
            component={Link}
            to={`/${item.id}`}
            onClick={() => { setActiveTab(item.id); if (window.innerWidth < 600) handleMobileToggle(); }}
            selected={selected}
            sx={{
              justifyContent: isOpen ? "initial" : "center",
              px: 2.5,
              py: 1.2,
              my: 0.5,
              borderRadius: 2,
              backgroundColor: selected ? "#3b54b0 !important" : "transparent",
              color: selected ? "#fff" : "#111827",
              fontWeight: selected ? 600 : 500,
              "&:hover": { backgroundColor: selected ? "#3b54b0 !important" : "transparent" },
            }}
          >
            <Tooltip title={!isOpen ? item.label : ""} placement="right">
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: isOpen ? 2 : "auto",
                  justifyContent: "center",
                  color: selected ? "#fff" : item.color,
                }}
              >
                <Icon />
              </ListItemIcon>
            </Tooltip>
            {isOpen && (
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ fontWeight: 500, fontSize: "0.95rem" }}
              />
            )}
          </ListItemButton>
        );
      })}
    </List>
  );
};

const Sidebar = ({ activeTab, setActiveTab, isOpen, setIsOpen, mobileOpen, handleMobileToggle }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleMobileToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            width: mobileOpen ? drawerWidth : closedDrawerWidth,
            "& .MuiDrawer-paper": { width: mobileOpen ? drawerWidth : closedDrawerWidth },
          }}
        >
          <Toolbar sx={{ justifyContent: "space-between", px: 2 }}>
            <Typography variant="h6">Renee</Typography>
            <IconButton onClick={handleMobileToggle}><ChevronLeft /></IconButton>
          </Toolbar>
          <Divider />
          <DrawerContent
            isOpen={true}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            handleMobileToggle={handleMobileToggle}
          />
        </Drawer>
      )}

      {!isMobile && (
        <Drawer
          variant="permanent"
          open={isOpen}
          sx={{
            width: isOpen ? drawerWidth : closedDrawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": { width: isOpen ? drawerWidth : closedDrawerWidth, transition: "width 0.3s", overflowX: "hidden", boxSizing: "border-box" },
          }}
        >
          <Toolbar sx={{ justifyContent: isOpen ? "space-between" : "center", display: "flex", alignItems: "center", px: 1, gap: 1 }}>
            {isOpen && <img src={"/logoRenee.svg"} alt="healthCare" width={150} height={50} />}
            <IconButton onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <ChevronLeft /> : <>
                <img src={"/reneeLogo.png"} alt="healthCare" width={30} height={30} />
                <ChevronRight />
              </>}
            </IconButton>
          </Toolbar>
          <Divider />
          <DrawerContent
            isOpen={isOpen}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            handleMobileToggle={handleMobileToggle}
          />
        </Drawer>
      )}
    </>
  );
};

export default Sidebar;
