import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Plus } from "lucide-react";
import { Popper, Paper, Button, Fade, Box } from "@mui/material";
import {
  Folder as FolderIcon,
  CloudUpload as CloudUploadIcon,
} from "@mui/icons-material";
import { setShowAddFolderModal } from "../Store/uploadSlice";

const AddNewFolderFileButton = () => {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleButtonClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAddFolder = () => {
    dispatch(setShowAddFolderModal(true));
    handleMenuClose();
  };

  const handleUploadFile = () => {
    // Dispatch your upload file action here
    // dispatch(uploadFileAction());
    handleMenuClose();
    // You can also trigger file input click here
    document.getElementById("file-upload-input")?.click();
  };

  // Add click outside handler
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (anchorEl && !anchorEl.contains(event.target)) {
        handleMenuClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [anchorEl]);

  return (
    <>
      <button
        onClick={handleButtonClick}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
          color: "black",
          border: "none",
          borderRadius: "20px",
          padding: "10px 16px",
          fontSize: "14px",
          fontWeight: "500",
          boxShadow: "0 1px 3px rgba(0,0,0, .5)",
          marginLeft: "1rem",
        }}
      >
        <span
          style={{ marginRight: "8px", display: "flex", alignItems: "center" }}
        >
          <Plus size={25} />
        </span>
        New
      </button>

      {/* Hidden file input for upload */}
      <input
        id="file-upload-input"
        type="file"
        multiple
        style={{ display: "none" }}
        onChange={(e) => {
          // Handle file upload logic here
          console.log("Files selected:", e.target.files);
        }}
      />

      {/* Menu Popper */}
      <Popper
        open={isMenuOpen}
        anchorEl={anchorEl}
        placement="bottom-start"
        transition
        disablePortal
        modifiers={[{ name: "offset", options: { offset: [0, 8] } }]}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={200}>
            <Paper
              sx={{
                p: 1,
                width: 200,
                borderRadius: 2,
                backgroundColor: "#fff",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }}
            >
              <Box display="flex" flexDirection="column">
                <Button
                  startIcon={<FolderIcon />}
                  onClick={handleAddFolder}
                  fullWidth
                  sx={{
                    justifyContent: "flex-start",
                    textTransform: "none",
                    color: "text.primary",
                    borderRadius: 1,
                    px: 2,
                    py: 1,
                    fontSize: "14px",
                    "&:hover": {
                      backgroundColor: "#f5f5f5",
                    },
                  }}
                >
                  New Folder
                </Button>
                <Button
                  startIcon={<CloudUploadIcon />}
                  onClick={handleUploadFile}
                  fullWidth
                  sx={{
                    justifyContent: "flex-start",
                    textTransform: "none",
                    color: "text.primary",
                    borderRadius: 1,
                    px: 2,
                    py: 1,
                    fontSize: "14px",
                    "&:hover": {
                      backgroundColor: "#f5f5f5",
                    },
                  }}
                >
                  Upload File
                </Button>
              </Box>
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  );
};

export default AddNewFolderFileButton;
