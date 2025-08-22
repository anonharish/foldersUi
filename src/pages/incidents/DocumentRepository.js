import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Modal } from "react-bootstrap";
import {
  Button,
  Autocomplete,
  TextField,
  Typography,
  Breadcrumbs,
  Link,
  Box,
  IconButton,
} from "@mui/material";
import FileFolderCard from "../../componnets/FileFolderCard";
import { useDispatch, useSelector } from "react-redux";
import { setShowAddFolderModal } from "../../Store/uploadSlice";
import {
  addFolderToStructure,
  updateFolderWithFiles,
  getFileType,
  findFolderById,
} from "../../utils/helpers";
import { useGlobalState } from "../../contexts/GlobalStateContext";
import { initialFolders } from "./data";
import {
  resetFolderPath,
  setFolderPath,
  addFolderToPath,
  setActiveFolder,
} from "../../Store/breadcrumbSlice";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import {
  Close,
  Delete,
  Download,
  DriveFileMove,
} from "@mui/icons-material";
import MoveDialog from "../DocumentsFunctions/MoveFunction";
import DownloadDialog from "../DocumentsFunctions/DownloadFunction";
import DeleteDialog from "../DocumentsFunctions/DeleteFunction";
import PreviewDialog from "../DocumentsFunctions/PreviewDialog";
import CustomModal from "../DocumentsFunctions/CustomModal";

const DocumentRepository = () => {
 const files = [
  {
    id: 9,
    type: "file",
    name: "SystemArchitecture.pdf",
    typeofFile: "pdf",
    url: "/files/invoice.pdf", 
  },
];
  const sortDropDownOptions = [
    { label: "Last modified" },
    { label: "Last modified by me" },
    { label: "Last opened by me" },
    { label: "Name" },
  ];
  const location = useLocation();
  const dispatch = useDispatch();
  const { setUploadTrigger } = useGlobalState();
  const fileInputRef = useRef(null);
  const { showAddFolderModal } = useSelector((state) => state.upload);
  const searchedFileName = location.state?.searchedFileName;
  const [fileNotFound, setFileNotFound] = useState(false);
  const [filesInitial, setFilesIntial] = useState(files);
  const folderPath = useSelector((root) => root.breadcrumb.folderPath);
  const activeFolder = useSelector((root) => root.breadcrumb.activeFolder);
  const [selectedIds, setSelectedIds] = useState([]);
  const [focusedIndex, setFocusedIndex] = useState(null);
  const [folderSelections, setFolderSelections] = useState({});
  const [folders, setFolders] = useState(initialFolders);
  const [selectedFolder, setSelectedFolder] = useState(folders[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newFolderName, setNewFolderName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);
  const [showMoveDialog, setShowMoveDialog] = useState(false);
  const [sortBy, setSortBy] = useState(sortDropDownOptions[0]);

  const allItems = activeFolder
    ? [...(activeFolder.children || []), ...(activeFolder.files || [])]
    : [...folders, ...filesInitial];
  
  useEffect(() => {
    localStorage.setItem("folders", JSON.stringify(folders));
  }, [folders]);

  useEffect(() => {
    if (searchedFileName) {
      let fileFound = false;
      let folderWithFile = null;

      folders.forEach((folder) => {
        const foundFile = folder.files.find(
          (file) => file.name === searchedFileName
        );
        if (foundFile) {
          fileFound = true;
          folderWithFile = folder;
        }
      });

      if (fileFound) {
        setSelectedFolder(folderWithFile);
        setFileNotFound(false);
      } else {
        setFileNotFound(true);
        alert(`File "${searchedFileName}" was not found in the repository.`);
      }
    }
  }, [searchedFileName, folders]);

  useEffect(() => {
    setUploadTrigger(triggerFileInput);
    return () => {
      setUploadTrigger(null);
    };
  }, [setUploadTrigger]);

  useEffect(() => {
    if (activeFolder) {
      const findUpdatedFolder = (foldersArray, folderId) => {
        for (const folder of foldersArray) {
          if (folder.id === folderId) return folder;
          if (folder.children && folder.children.length > 0) {
            const found = findUpdatedFolder(folder.children, folderId);
            if (found) return found;
          }
        }
        return null;
      };

      const updatedFolder = findUpdatedFolder(folders, activeFolder.id);
      if (updatedFolder && updatedFolder !== activeFolder) {
        dispatch(setActiveFolder(updatedFolder));
      }
    }
  }, [folders, activeFolder, dispatch]);

  const flattenItems = (folders) => {
    let result = [];
    folders.forEach((folder) => {
      result.push(...folder.files); 
      if (folder.children?.length) {
        result.push(...flattenItems(folder.children)); 
      }
    });
    return result;
  };

const handleMoveClick = () => {
  const allFiles = [
    ...filesInitial,          
    ...flattenItems(folders)  
  ];

  const hasFileSelected = selectedIds.some((id) =>
    allFiles.find((file) => file.id === id)
  );

  if (hasFileSelected) {
    setShowMoveDialog(true);
  }
};

  const handleConfirmMove = (targetFolder) => {
    let updatedFolders = folders;

    selectedIds.forEach((id) => {
      let file = filesInitial.find((f) => f.id === id);
      if (!file && activeFolder) {
        file = activeFolder.files.find((f) => f.id === id);
      }
      if (file) {
        updatedFolders = handleDelete(updatedFolders, file.id);
        updatedFolders = updateFolderWithFiles(
          updatedFolders,
          targetFolder.id,
          [file]
        );
      }
    });

    setFolders(updatedFolders);
    setFilesIntial(filesInitial.filter((f) => !selectedIds.includes(f.id)));
    setSelectedIds([]);
    setShowMoveDialog(false);
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    if (!files.length) return;
    setUploading(true);
    setTimeout(() => {
      setFolders((prevFolders) => {
        let updatedFolders;

        if (!activeFolder) {
          updatedFolders = [
            ...prevFolders,
            ...files.map((file) => ({
              id: Date.now() + Math.random(),
              name: file.name,
              type: "file",
              size: file.size,
              uploadedAt: new Date().toISOString(),
              url: "#",
              typeofFile: getFileType(file.name),
            })),
          ];
        } else {
          updatedFolders = updateFolderWithFiles(
            prevFolders,
            activeFolder.id,
            files
          );

          const updatedActiveFolder = findFolderById(
            updatedFolders,
            activeFolder.id
          );
          setActiveFolder(updatedActiveFolder);
        }

        return updatedFolders;
      });

      setUploading(false);
      event.target.value = "";
    }, 1000);
  };

  const updateSelection = (newSelectedIds, focusIndex = null) => {
    setSelectedIds(newSelectedIds);
    if (activeFolder) {
      setFolderSelections((prev) => ({
        ...prev,
        [activeFolder.id]: newSelectedIds,
      }));
    }
    if (focusIndex !== null) {
      setFocusedIndex(focusIndex);
    }
  };

  const handleItemClick = (e, item, index) => {
    if (e.shiftKey && focusedIndex !== null) {
      const start = Math.min(focusedIndex, index);
      const end = Math.max(focusedIndex, index);
      const rangeIds = allItems.slice(start, end + 1).map((i) => i.id);
      updateSelection(
        Array.from(new Set([...selectedIds, ...rangeIds])),
        index
      );
    } else if (e.metaKey || e.ctrlKey) {
      if (selectedIds.includes(item.id)) {
        updateSelection(
          selectedIds.filter((id) => id !== item.id),
          index
        );
      } else {
        updateSelection([...selectedIds, item.id], index);
      }
    } else {
      if (selectedIds.includes(item.id)) {
        updateSelection([]);
      } else {
        updateSelection([item.id], index); 
      }
    }
  };

  const handleDownloadSelected = async () => {
    setShowDownloadDialog(true);

    const zip = new JSZip();

    const addFolderToZip = (folder, zipFolder) => {
      folder.files?.forEach((file) => {
        zipFolder.file(file.name, `Dummy content of ${file.name}`);
      });
      folder.children?.forEach((childFolder) => {
        const childZip = zipFolder.folder(childFolder.name);
        addFolderToZip(childFolder, childZip);
      });
    };
    const findFolderById = (folders, id) => {
      for (const folder of folders) {
        if (folder.id === id) return folder;
        if (folder.children && folder.children.length > 0) {
          const found = findFolderById(folder.children, id);
          if (found) return found;
        }
      }
      return null;
    };
    selectedIds.forEach((id) => {
      const folder = findFolderById(folders, id);
      if (folder) {
        const zipFolder = zip.folder(folder.name);
        addFolderToZip(folder, zipFolder);
      } else {
        let file = filesInitial.find((f) => f.id === id);
        if (!file && activeFolder) {
          file = activeFolder.files.find((f) => f.id === id);
        }
        if (file) {
          zip.file(file.name, `Dummy content of ${file.name}`);
        }
      }
    });

    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, `Selected_Items.zip`);

    setShowDownloadDialog(false); // close after download finishes
  };

  const handleDeleteSelected = () => {
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    let updatedFolders = folders;
    let updatedFiles = filesInitial;

    selectedIds.forEach((id) => {
      if (folders.some((f) => f.id === id)) {
        updatedFolders = handleDeleteFolder(updatedFolders, id);
      } else {
        updatedFiles = updatedFiles.filter((f) => f.id !== id);
        if (activeFolder) {
          updatedFolders = updateFolderWithFiles(
            updatedFolders,
            activeFolder.id,
            activeFolder.files.filter((f) => f.id !== id)
          );
        }
      }
    });

    setFolders(updatedFolders);
    setFilesIntial(updatedFiles);
    setSelectedIds([]);
    setShowDeleteDialog(false); 
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (focusedIndex === null) return;
      let newIndex = focusedIndex;
      const columns = 4;

      switch (e.key) {
        case "ArrowDown":
          newIndex = Math.min(focusedIndex + columns, allItems.length - 1);
          break;
        case "ArrowUp":
          newIndex = Math.max(focusedIndex - columns, 0);
          break;
        case "ArrowRight":
          newIndex = Math.min(focusedIndex + 1, allItems.length - 1);
          break;
        case "ArrowLeft":
          newIndex = Math.max(focusedIndex - 1, 0);
          break;
        default:
          return;
      }

      if (e.shiftKey) {
        // Shift + arrow: extend selection
        const start = Math.min(focusedIndex, newIndex);
        const end = Math.max(focusedIndex, newIndex);
        const rangeIds = allItems.slice(start, end + 1).map((i) => i.id);
        updateSelection(
          Array.from(new Set([...selectedIds, ...rangeIds])),
          newIndex
        );
      } else {
        // Arrow without shift: select only the focused item
        updateSelection([allItems[newIndex].id], newIndex);
      }

      e.preventDefault();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [focusedIndex, allItems, selectedIds]);

  const handleRename = (folders, fileId, newName) => {
    return folders?.map((folder) => ({
      ...folder,
      files: folder?.files.map((file) =>
        file.id === fileId ? { ...file, name: newName } : file
      ),
      children: handleRename(folder?.children || [], fileId, newName),
    }));
  };

  const handleDelete = (folders, id) =>
    folders
      .map((folder) => {
        if (folder.id === id) return null; 
        return {
          ...folder,
          files: folder.files.filter((file) => file.id !== id),
          children: handleDelete(folder.children || [], id),
        };
      })
      .filter(Boolean);

  const handleSaveNewFolder = () => {
    if (!newFolderName.trim()) {
      return;
    }
    const newFolder = {
      id: Date.now().toString(),
      name: newFolderName.trim(),
      files: [],
      parentId: activeFolder ? activeFolder.id : null,
      isExpanded: true,
      children: [],
    };
    try {
      const updatedFolders = addFolderToStructure(
        folders,
        newFolder,
        activeFolder ? activeFolder.id : null
      );
      setFolders(updatedFolders);
      setSelectedFolder(newFolder);
      dispatch(setShowAddFolderModal(false));
      setNewFolderName("");
    } catch (error) {
      console.error("Error adding folder:", error);
    }
  };

  const onClear = () => {
    setSelectedIds([]);
  };

  const openFolder = (folder) => {
    dispatch(setActiveFolder(folder));
    dispatch(addFolderToPath(folder));
    setSelectedIds([]); 
    setFocusedIndex(null);
  };

  const handleBreadcrumbClick = (index) => {
    setSelectedIds([]);
    const newPath = folderPath.slice(0, index + 1);
    dispatch(setFolderPath(newPath));
    dispatch(setActiveFolder(newPath[newPath.length - 1]));
  };

  const goHome = () => {
    dispatch(resetFolderPath());
  };

  const handleViewClick = (file) => {
    setPreviewFile(file);
  };

  const handleClosePreview = () => {
    setPreviewFile(null);
  };

  const handleDownloadClick = (file) => {
    console.log("Downloading file:", file.name);
  };

  const handleRenameFolder = (folders, folderId, newName) => {
    return folders.map((folder) => {
      if (folder.id === folderId) {
        return { ...folder, name: newName };
      }
      if (folder.children) {
        return {
          ...folder,
          children: handleRenameFolder(folder.children, folderId, newName),
        };
      }
      return folder;
    });
  };

  const handleDeleteFolder = (folders, folderId) => {
    return folders
      .filter((folder) => folder.id !== folderId)
      .map((folder) => ({
        ...folder,
        children: folder.children
          ? handleDeleteFolder(folder.children, folderId)
          : [],
      }));
  };

  const handleDownloadFolder = async (folder) => {
    const zip = new JSZip();

    const addFilesToZip = (currentFolder, zipFolder) => {
      currentFolder.files?.forEach((file) => {
        zipFolder.file(file.name, `Dummy content of ${file.name}`);
      });

      currentFolder.children?.forEach((childFolder) => {
        const childZip = zipFolder.folder(childFolder.name);
        addFilesToZip(childFolder, childZip);
      });
    };

    addFilesToZip(folder, zip);

    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, `${folder.name}.zip`);
  };

  return (
    <div className="p-4 ">
      <input
        style={{ display: "none" }}
        ref={fileInputRef}
        type="file"
        multiple
        hidden
        onChange={handleFileUpload}
        disabled={uploading} 
      />
      {uploading && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-50"
          style={{ zIndex: 2000 }}
        >
          <div
            className="spinner-border text-light"
            role="status"
            style={{ width: "3rem", height: "3rem" }}
          >
            <span className="visually-hidden">Uploading...</span>
          </div>
        </div>
      )}
      {fileNotFound && searchedFileName && (
        <div className="alert alert-warning mb-4" role="alert">
          The file "{searchedFileName}" was not found in the repository.
        </div>
      )}
      {selectedIds.length > 0 && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#f8fafc",
            borderRadius: "24px",
            px: 2,
            py: 0.5,
            boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
          }}
        >
          {/* Left Side */}
          <Box display="flex" alignItems="center" gap={1}>
            <IconButton size="small" onClick={onClear}>
              <Close fontSize="small" />
            </IconButton>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {selectedIds.length} selected
            </Typography>
            <Box display="flex" alignItems="center" gap={0.5}>
              <IconButton size="small" onClick={handleDownloadSelected}>
                <Download fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={handleMoveClick}
                disabled={selectedIds.every((id) => {
                  const item = allItems.find((i) => i.id === id);
                  return item?.isExpanded; 
                })}
              >
                <DriveFileMove fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={handleDeleteSelected}>
                <Delete fontSize="small" />
              </IconButton>
            </Box>
          </Box>
          <Box>
            <Autocomplete
              options={sortDropDownOptions}
              value={sortBy}
              onChange={(event, newValue) => setSortBy(newValue)}
              getOptionLabel={(option) => option.label}
              sx={{ width: 200 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  variant="outlined"
                  sx={{
                    backgroundColor: "white",
                    borderRadius: "8px",
                    "& .MuiOutlinedInput-root": { borderRadius: "8px" },
                  }}
                />
              )}
            />
          </Box>
        </Box>
      )}
      <Breadcrumbs
        aria-label="breadcrumb"
        separator="›"
        sx={{ padding: "4px", color: "black" }}
      >
        <Link
          underline="hover"
          color="inherit"
          onClick={goHome}
          sx={{ cursor: "pointer" }}
        >
          Home
        </Link>

        {/* Dynamic Folders Path */}
        {Array.isArray(folderPath) &&
          folderPath.map((folder, index) => {
            const isLast = index === folderPath.length - 1;
            return isLast ? (
              <Typography style={{ color: "blue" }} key={folder.id}>
                {folder.name}
              </Typography>
            ) : (
              <Link
                underline="hover"
                color="inherit"
                key={folder.id}
                onClick={() => handleBreadcrumbClick(index)}
                sx={{ cursor: "pointer" }}
              >
                {folder.name}
              </Link>
            );
          })}
      </Breadcrumbs>
      <div style={{ padding: "4px" }}>
        <div>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {!activeFolder ? "Folders" : "All Items"}
          </Typography>
          {!activeFolder ? (
            <>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
                {folders.map((folder, index) =>
                  folder.type != "file" ? (
                    <FileFolderCard
                      key={folder.id}
                      type={"folder"}
                      isSelected={selectedIds.includes(folder.id)}
                      name={folder.name}
                      onClick={(e) =>
                        handleItemClick(e, folder, index, filesInitial)
                      }
                      onDoubleClick={() => {
                        setSelectedIds([]);
                        openFolder(folder);
                      }} 
                      onRename={(newName) => {
                        const updated = handleRenameFolder(
                          folders,
                          folder.id,
                          newName
                        );
                        setFolders(updated);
                      }}
                      onDelete={() => {
                        const updated = handleDeleteFolder(folders, folder.id);
                        setFolders(updated);
                      }}
                      onDownload={() => handleDownloadFolder(folder)}
                    />
                  ) : (
                    <FileFolderCard
                      key={folder.id}
                      type="file"
                      name={folder.name}
                      size={`${Math.round(folder.size / 1024)} KB`}
                      date={new Date(folder.uploadedAt).toLocaleDateString()}
                      typeofFile={folder.typeofFile}
                      onRename={(newName) => {
                        const updated = handleRenameFolder(
                          folders,
                          folder.id,
                          newName
                        );
                        setFolders(updated);
                      }}
                      isSelected={selectedIds.includes(folder.id)} 
                      onClick={(e) =>
                        handleItemClick(e, folder, index, filesInitial)
                      }
                      handleViewClick={() => handleViewClick(folder)}
                      handleDownloadClick={() => handleDownloadClick(folder)}
                      onDoubleClick={() => {
                        setSelectedIds([]);
                        handleViewClick(folder);
                      }}
                      onDelete={() => {
                        const updated = handleDeleteFolder(folders, folder.id);
                        setFolders(updated);
                      }}
                    />
                  )
                )}
              </div>
            </>
          ) : (
            <>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
                {activeFolder?.children?.map((folder, index) => (
                  <FileFolderCard
                    key={folder.id}
                    type="folder"
                    name={folder.name}
                    isSelected={selectedIds.includes(folder.id)}
                    onClick={(e) => handleItemClick(e, folder, index)}
                    onDoubleClick={() => {
                      setSelectedIds([]); 
                      openFolder(folder);
                    }}
                    onRename={(newName) => {
                      const updated = handleRenameFolder(
                        folders,
                        folder.id,
                        newName
                      );
                      setFolders(updated);
                    }}
                    onDelete={() => {
                      const updated = handleDeleteFolder(folders, folder.id);
                      setFolders(updated);
                    }}
                    onDownload={() => handleDownloadFolder(folder)}
                  />
                ))}

                {activeFolder.files.map((file, index) => (
                  <FileFolderCard
                    key={file.id}
                    type="file"
                    isSelected={selectedIds.includes(file.id)} // NEW
                    onClick={(e) =>
                      handleItemClick(e, file, index, filesInitial)
                    }
                    name={file.name}
                    size={`${Math.round(file.size / 1024)} KB`}
                    date={new Date(file.uploadedAt).toLocaleDateString()}
                    typeofFile={file.typeofFile}
                    onRename={(newName) => {
                      const updated = handleRename(folders, file.id, newName);
                      setFolders(updated);
                      if (activeFolder) {
                        const refreshed = findFolderById(
                          updated,
                          activeFolder.id
                        );
                        dispatch(setActiveFolder(refreshed || null));
                      }
                    }}
                    handleViewClick={() => handleViewClick(file)}
                    handleDownloadClick={() => handleDownloadClick(file)}
                    onDoubleClick={() => {
                      setSelectedIds([]);
                      handleViewClick(file);
                    }}
                    onDelete={() => {
                      const updated = handleDelete(folders, file.id);
                      setFolders(updated);

                      if (activeFolder) {
                        const refreshed = findFolderById(
                          updated,
                          activeFolder.id
                        );
                        dispatch(setActiveFolder(refreshed || null));
                      }
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </div>
        {!activeFolder && (
          <>
            <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
              Files
            </Typography>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
              {filesInitial.map((file, index) => (
                <FileFolderCard
                  key={file.id}
                  type="file"
                  isSelected={selectedIds.includes(file.id)} // NEW
                  onClick={(e) => handleItemClick(e, file, index, filesInitial)}
                  name={file.name}
                  size={`${Math.round(file.size / 1024)} KB`}
                  date={new Date(file.uploadedAt).toLocaleDateString()}
                  typeofFile={file.typeofFile}
                  onRename={(newName) => {
                    const updatedFiles = filesInitial.map((f) =>
                      f.id === file.id ? { ...f, name: newName } : f
                    );
                    setFilesIntial(updatedFiles);
                  }}
                  onDelete={() => {
                    const updatedFiles = filesInitial.filter(
                      (f) => f.id !== file.id
                    );
                    setFilesIntial(updatedFiles);
                  }}
                  handleViewClick={() => handleViewClick(file)}
                  onDoubleClick={() => {
                    setSelectedIds([]);
                    handleViewClick(file);
                  }}
                  handleDownloadClick={() => handleDownloadClick(file)}
                />
              ))}
            </div>
          </>
        )}
      </div>
 <CustomModal
  show={showAddFolderModal}
  onClose={() => dispatch(setShowAddFolderModal(false))}
  onConfirm={handleSaveNewFolder}
  title="New Folder"
  bodyContent={
    <input
      type="text"
      value={newFolderName}
      onChange={(e) => setNewFolderName(e.target.value)}
      placeholder="Folder name"
      className="form-control"
      style={{
        borderRadius: "12px",
        border: "1px solid #ccc",
        padding: "0.5rem 0.75rem",
        fontSize: "1rem",
        outline: "none",
        backgroundColor: "#f8fafc",
      }}
    />
  }
/>     
 <PreviewDialog
      open={Boolean(previewFile)}
      onClose={handleClosePreview}
      file={previewFile}
    />
      <DeleteDialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        selectedItems={selectedIds}
      />
      <DownloadDialog
        open={showDownloadDialog}
        message="Preparing your download..."
      />
      <MoveDialog
        open={showMoveDialog}
        onClose={() => setShowMoveDialog(false)}
        onConfirm={handleConfirmMove}
        folders={folders}
      />
    </div>
  );
};

export default DocumentRepository;
