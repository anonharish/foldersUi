import React, { useState } from "react";
import { Grid, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import FileFolderCard from "../componnets/FileFolderCard";


const initialFiles = [
  {
      id: "file100",
      name: "Letter_of_DO.pdf",
      size: 2048,
      type: "application/pdf",
      uploadedAt: new Date().toISOString(),
      url: "/files/letter_of_do.pdf",
      typeofFile: "pdf",
    },
    {
          id: "file101",
          name: "GovernmentGuaranteePolicy2022.pdf",
          size: 1024,
          type: "application/pdf",
          uploadedAt: new Date().toISOString(),
          url: "/files/Government Guarantee Policy.pdf",
          typeofFile: "pdf",
        },
];

const RecentDocs = () => {
  const [files, setFiles] = useState(initialFiles);
  const [viewFile, setViewFile] = useState(null); // file to view

  // Delete file
  const handleDelete = (file) => {
      setFiles((prev) => prev.filter((f) => f.id !== file.id));
  };

  // Rename file
  const handleRename = (file, newName) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === file.id ? { ...f, name: newName } : f))
    );
  };

  // View file in dialog
  const handleView = (file) => {
    setViewFile(file);
  };

  const handleCloseView = () => {
    setViewFile(null);
  };

  const handleDownloadClick = (file) => {
  console.log("Downloading file:", file.name);

  // Create an invisible link element
  const link = document.createElement("a");
  link.href = file.url; // The file URL (PDF, DOCX, XLSX etc.)
  link.download = file.name; // Suggested download file name
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

  return (
    <div className="p-4 ">
      <h2 style={{ marginBottom: "16px" }}>Recent Documents</h2>

     <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
        {files.map((file) => (
          <Grid item xs={12} sm={6} key={file.id}>
            <FileFolderCard
              type={file.type}
              name={file.name}
              typeofFile={file.typeofFile}
              date={file.date}
              size={file.size}
              handleViewClick={() => handleView(file)}
              onDelete={() => handleDelete(file)}
              onRename={(newName) => handleRename(file, newName)}
              handleDownloadClick={() => handleDownloadClick(file)}
            />
          </Grid>
        ))}
      </div>

      {/* View Dialog with iframe */}
      <Dialog open={!!viewFile} onClose={handleCloseView} maxWidth="lg" fullWidth>
        <DialogTitle>{viewFile?.name}</DialogTitle>
        <DialogContent>
          {viewFile && (
            <iframe
              src={viewFile.url}
              title={viewFile.name}
              width="100%"
              height="600px"
              style={{ border: "none" }}
            ></iframe>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseView} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RecentDocs;
