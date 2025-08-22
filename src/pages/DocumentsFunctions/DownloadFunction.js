import { CircularProgress, Dialog, DialogContent, DialogTitle } from "@mui/material";

export default function DownloadDialog({ open, message }) {
  return (
    <Dialog open={open}>
      <DialogTitle>Download</DialogTitle>
      <DialogContent
        style={{ display: "flex", alignItems: "center", gap: "10px" }}
      >
        <CircularProgress size={24} />
        <span>{message}</span>
      </DialogContent>
    </Dialog>
  );
}
