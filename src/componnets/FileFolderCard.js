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

import FolderIcon from "@mui/icons-material/Folder";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

const FileFolderCard = ({ type, name, onClick, date, size }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <Card
            onClick={onClick}
            sx={{
                width: type === "folder" ? 200 : 300,
                textAlign: "center",
                p: 0,
                borderRadius: "10px",
                cursor: "pointer",
                backgroundColor: "#f8fafd",
                "&:hover": { backgroundColor: "#f1f3f4" },
            }}
        >
            <CardContent sx={{ p: 1, "&:last-child": { paddingBottom: 1 } }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    {type === "folder" ? (
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1, padding: 0 }}>
                            <FolderIcon sx={{ fontSize: 20, color: "#5f6368" }} />
                            <span
                                style={{
                                    fontSize: "14px",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    flex: 1,
                                }}
                            >
                                {name}
                            </span>

                        </div>
                    ) : (
                        <InsertDriveFileIcon sx={{ fontSize: 40, color: "#1967d2" }} />
                    )}
                    {type === "folder" && (
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


                {/* File details */}
                {type === "file" && (
                    <div style={{ textAlign: "left", marginTop: "8px" }}>
                        <div
                            style={{
                                fontSize: "14px",
                                fontWeight: 500,
                                color: "#202124",
                            }}
                        >
                            {name}
                        </div>
                        <div>
                            <span style={{ fontSize: "12px", color: "#5f6368" }}>
                                Last edited: {new Date().toLocaleDateString()}
                            </span>
                        </div>
                        <div
                            style={{ fontSize: "12px", color: "#5f6368", marginTop: "2px" }}
                        >
                            {date} • {size}
                        </div>

                        {/* Inline Actions */}
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-around",
                                marginTop: "10px",
                            }}
                        >
                            <Button
                                size="small"
                                startIcon={<FileDownloadOutlinedIcon />}
                                sx={{fontSize: "10px"}}
                            >
                                Download
                            </Button>
                            <Button
                                size="small"
                                startIcon={<DriveFileRenameOutlineIcon />}
                                 sx={{fontSize: "10px"}}
                            >
                                Rename
                            </Button>
                            <Button
                                size="small"
                                startIcon={<DeleteOutlineIcon />}
                                sx={{ color: "red", fontSize:"10px" }}
                                
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                )}

                {/* 3-dot menu */}
                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleMenuClose}
                    PaperProps={{
                        sx: {
                            borderRadius: "8px",
                            minWidth: 180,
                            boxShadow: "0px 4px 12px rgba(0,0,0,0.15)",
                        },
                    }}
                >
                    <MenuItem onClick={handleMenuClose}>
                        <ListItemIcon>
                            <FileDownloadOutlinedIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Download" />
                    </MenuItem>

                    <MenuItem onClick={handleMenuClose}>
                        <ListItemIcon>
                            <DriveFileRenameOutlineIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Rename" />
                    </MenuItem>

                    <MenuItem onClick={handleMenuClose}>
                        <ListItemIcon>
                            <ShareOutlinedIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Share" />
                    </MenuItem>

                    <MenuItem onClick={handleMenuClose}>
                        <ListItemIcon>
                            <InfoOutlinedIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Folder information" />
                    </MenuItem>

                    <MenuItem onClick={handleMenuClose} sx={{ color: "red" }}>
                        <ListItemIcon>
                            <DeleteOutlineIcon fontSize="small" sx={{ color: "red" }} />
                        </ListItemIcon>
                        <ListItemText primary="Move to trash" />
                    </MenuItem>
                </Menu>
            </CardContent>
        </Card>
    );
};

export default FileFolderCard;