import React, { useState } from "react";
import {
  Card,
  CardContent,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Button
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import VisibilityIcon from '@mui/icons-material/Visibility';

import FolderIcon from "@mui/icons-material/Folder";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DescriptionIcon from "@mui/icons-material/Description";
import TableChartIcon from "@mui/icons-material/TableChart";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

const FileFolderCard = ({ type, name, onClick, date, size, typeofFile }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [hovered, setHovered] = useState(false);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const isFolder = type === "folder";

  // Determine icon based on file type
  const renderFileIcon = () => {
    if (isFolder) return <FolderIcon sx={{ fontSize: 28, color: "#06379e" }} />;

    switch (typeofFile?.toLowerCase()) {
      case "pdf":
        return <PictureAsPdfIcon sx={{ fontSize: 36, color: "#fc3d39" }} />;
      case "excel":
      case "xls":
      case "xlsx":
        return <TableChartIcon sx={{ fontSize: 36, color: "#207245" }} />;
      case "doc":
      case "docx":
        return <DescriptionIcon sx={{ fontSize: 36, color: "#2a5699" }} />;
      default:
        return <InsertDriveFileIcon sx={{ fontSize: 36, color: "#fc8f2f" }} />;
    }
  };

  return (
    <Card
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{
        width: isFolder ? 180 : 250,
        textAlign: "center",
        cursor: "pointer",
        borderRadius: "12px",
        backgroundColor: "#e2e8f0",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: "0 8px 20px rgba(0,0,0,0.12)"
        }
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1 }}>
            {renderFileIcon()}
            <span
              style={{
                fontSize: "14px",
                fontWeight: 500,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                flex: 1
              }}
            >
              {name}
            </span>
          </div>

          {isFolder && (
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleMenuOpen(e);
              }}
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>
          )}
        </div>

        {/* File actions: show only on hover */}
        {!isFolder && hovered && (
          <div style={{ display: "flex", justifyContent: "space-around", marginTop: "12px" }}>
             <Button size="small" startIcon={<VisibilityIcon />} sx={{ color: "blue", fontSize: "10px" }}/>
            <Button size="small" startIcon={<FileDownloadOutlinedIcon />} sx={{ fontSize: "10px" }}/>
           
            <Button size="small" startIcon={<DriveFileRenameOutlineIcon />} sx={{ fontSize: "10px" }}/>
           
            <Button size="small" startIcon={<DeleteOutlineIcon />} sx={{ color: "red", fontSize: "10px" }}/>
          
          </div>
        )}

        {/* Folder menu */}
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              borderRadius: "10px",
              minWidth: 180,
              boxShadow: "0px 6px 18px rgba(0,0,0,0.12)"
            }
          }}
        >
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon><FileDownloadOutlinedIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="Download" />
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon><DriveFileRenameOutlineIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="Rename" />
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon><ShareOutlinedIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="Share" />
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon><InfoOutlinedIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="Folder info" />
          </MenuItem>
          <MenuItem onClick={handleMenuClose} sx={{ color: "red" }}>
            <ListItemIcon><DeleteOutlineIcon fontSize="small" sx={{ color: "red" }} /></ListItemIcon>
            <ListItemText primary="Move to trash" />
          </MenuItem>
        </Menu>
      </CardContent>
    </Card>
  );
};

export default FileFolderCard;
