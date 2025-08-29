import React, { useState, useEffect, useRef } from "react";
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
  CircularProgress,
} from "@mui/material";
import {
  Close as CloseIcon,
  PictureAsPdf as PictureAsPdfIcon,
  Article as ArticleIcon,
  Description as DescriptionIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  Image as ImageIcon,
} from "@mui/icons-material";

export default function PreviewDialog({ open, onClose, file }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const iframeRef = useRef(null);

  useEffect(() => {
    if (file) {
      setLoading(true);
      setError(false);
      setRetryCount(0);
    }
  }, [file]);

  if (!file) return null;

  const downloadFile = () => {
    window.open(file.url, "_blank");
  };

  const retryLoad = () => {
    setLoading(true);
    setError(false);
    setRetryCount((prev) => prev + 1);

    setTimeout(() => {
      if (iframeRef.current) {
        const currentSrc = iframeRef.current.src;
        const separator = currentSrc.includes("?") ? "&" : "?";
        iframeRef.current.src = currentSrc + separator + "retry=" + Date.now();
      }
    }, 200);
  };

  const handleIframeLoad = () => {
    setLoading(false);
    setError(false);
  };

  const handleIframeError = () => {
    setLoading(false);
    setError(true);
  };

  const getFileIcon = () => {
    switch (file.typeofFile) {
      case "pdf":
      case "invoicepdf":
        return <PictureAsPdfIcon color="error" />;
      case "txt":
        return <ArticleIcon color="primary" />;
      case "img":
        return <ImageIcon color="secondary" />;
      default:
        return <DescriptionIcon color="action" />;
    }
  };

  const renderIframeViewer = (url) => {
    const finalUrl = retryCount > 0 ? `${url}&retry=${Date.now()}` : url;

    return (
      <Box sx={{ flex: 1, width: "100%" }}>
        {loading && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "300px",
              gap: 2,
            }}
          >
            <CircularProgress />
            <Typography variant="body2">Loading file...</Typography>
          </Box>
        )}

        {error && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "300px",
              gap: 2,
            }}
          >
            <Typography variant="body2" color="error">
              Failed to load file preview.
            </Typography>
            <Button variant="contained" onClick={retryLoad}>
              Retry
            </Button>
          </Box>
        )}

        <iframe
          ref={iframeRef}
          src={finalUrl}
          style={{
            display: loading || error ? "none" : "block",
            width: "100%",
            height: "80vh",
            border: "none",
          }}
          title={file.name}
          onLoad={handleIframeLoad}
          onError={handleIframeError}
        />
      </Box>
    );
  };

  const renderPreview = () => {
    switch (file.typeofFile) {
      case "pdf":
      case "txt":
        return renderIframeViewer(file.url);
      case "excel":
      case "doc":
      case "docx":
        return renderIframeViewer(
          `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
            file.url
          )}`
        );
      case "img":
        return (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "80vh",
            }}
          >
            <img
              src={file.url}
              alt={file.name}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
              }}
              onLoad={() => setLoading(false)}
              onError={handleIframeError}
            />
          </Box>
        );
      default:
        return (
          <Box
            sx={{
              textAlign: "center",
              py: 5,
            }}
          >
            <Typography variant="body2" gutterBottom>
              No preview available.
            </Typography>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={downloadFile}
            >
              Download File
            </Button>
          </Box>
        );
    }
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
        <Box>
          <IconButton onClick={downloadFile} title="Download">
            <DownloadIcon />
          </IconButton>
          <IconButton onClick={retryLoad} title="Reload">
            <RefreshIcon />
          </IconButton>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
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
