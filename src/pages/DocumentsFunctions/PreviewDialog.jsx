import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Typography,
  Box,
  Button,
  IconButton,
} from "@mui/material";
import { Close as CloseIcon, PictureAsPdf as PictureAsPdfIcon, Article as ArticleIcon, Description as DescriptionIcon } from "@mui/icons-material";

export default function PreviewDialog({ open, onClose, file }) {
  if (!file) return null;

  const renderPreview = () => {
    switch (file.typeofFile) {
      case "pdf":
        return (
          <iframe
            src={file.url}
            style={{ width: "100%", height: "80vh", border: "none" }}
            title={file.name}
          />
        );
      case "txt":
        return (
          <iframe
            src={file.url}
            style={{ width: "100%", height: "80vh", border: "none" }}
            title={file.name}
          />
        );
      case "img":
        return (
          <img
            src={file.url}
            alt={file.name}
            style={{ maxWidth: "100%", maxHeight: "80vh", objectFit: "contain" }}
          />
        );
      case "invoicepdf":
        return (
          <iframe
            src={file.url}
            style={{ width: "100%", height: "80vh", border: "none" }}
            title={file.name}
          />
        );
      default:
        return (
          <Typography variant="body2" color="text.secondary" textAlign="center">
            No preview available.
          </Typography>
        );
    }
  };

  const getFileIcon = () => {
    if (file.typeofFile === "pdf" || file.typeofFile === "invoicepdf") {
      return <PictureAsPdfIcon color="error" />;
    }
    if (file.typeofFile === "txt") {
      return <ArticleIcon color="primary" />;
    }
    return <DescriptionIcon color="action" />;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3, overflow: "hidden" },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          bgcolor: "#f5f5f5",
          px: 3,
          py: 2,
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          {getFileIcon()}
          <Typography variant="h6" noWrap>
            {file.name}
          </Typography>
        </Box>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider />

      {/* Content */}
      <DialogContent
        dividers
        sx={{
          bgcolor: "background.default",
          minHeight: "400px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {renderPreview()}
      </DialogContent>

      {/* Footer */}
      <DialogActions sx={{ px: 3, py: 2, bgcolor: "#fafafa" }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{ borderRadius: 2, px: 3 }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
