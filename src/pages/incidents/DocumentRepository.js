import React, { useState, useEffect , useRef} from 'react';
import { Search, Upload, Folder, File, ChevronRight, ChevronDown, X, MessageCircle, Trash2, FolderPlus } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import { Autocomplete, Box, IconButton, Divider, TextField, Typography, Breadcrumbs, Link, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import FileFolderCard from '../../componnets/FileFolderCard';
import { useDispatch, useSelector } from 'react-redux';
import { setShowAddFolderModal } from '../../Store/uploadSlice';
import { addFolderToStructure, updateFolderWithFiles } from '../../utils/helpers';
import { useGlobalState } from '../../contexts/GlobalStateContext';
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import CloseIcon from "@mui/icons-material/Close";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DescriptionIcon from "@mui/icons-material/Description";
import ArticleIcon from "@mui/icons-material/Article";

import { resetFolderPath, setFolderPath, addFolderToPath, setActiveFolder } from '../../Store/breadcrumbSlice';

const DocumentRepository = () => {
    const files = [
        { id: 7, type: "file", name: "TeamRoster.xlsx", typeofFile: "excel" },
        { id: 8, type: "file", name: "MarketingPlan.docx", typeofFile: "doc" },
        { id: 9, type: "file", name: "SystemArchitecture.pdf", typeofFile: "pdf" },
    ];
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { setUploadTrigger } = useGlobalState();
    const fileInputRef = useRef(null);
    const { showAddFolderModal } = useSelector((state) => state.upload);
    const searchedFileName = location.state?.searchedFileName;
    const [fileNotFound, setFileNotFound] = useState(false);
    const [filesInitial, setFilesIntial] = useState(files);
    const folderPath = useSelector((root) => root.breadcrumb.folderPath);
    const activeFolder = useSelector((root) => root.breadcrumb.activeFolder)

    const initialFolders = [
        {
            id: "1",
            name: "Documents",
            files: [
                {
                    id: "file1",
                    name: "ProjectProposal.docx",
                    size: 1024,
                    type: "application/msword",
                    uploadedAt: new Date().toISOString(),
                    url: "#",
                    typeofFile: "doc",
                },
                {
                    id: "file2",
                    name: "BudgetPlan.xlsx",
                    size: 2048,
                    type: "application/vnd.ms-excel",
                    uploadedAt: new Date().toISOString(),
                    url: "#",
                    typeofFile: "excel",
                },
                {
                    id: "file3",
                    name: "MeetingNotes.txt",
                    size: 512,
                    type: "text/plain",
                    uploadedAt: new Date().toISOString(),
                    url: "#",
                    typeofFile: "txt",
                },
            ],
            children: [
                {
                    id: "1-1",
                    name: "Invoices",
                    files: [
                        {
                            id: "file7",
                            name: "Invoice-Jan.pdf",
                            size: 800,
                            type: "application/pdf",
                            uploadedAt: new Date().toISOString(),
                            url: "#",
                            typeofFile: "pdf",
                        },
                    ],
                    children: [],
                    parentId: "1",
                },
            ],
            parentId: null,
            isExpanded: true,
        },
        {
            id: "2",
            name: "Reports",
            files: [
                {
                    id: "file4",
                    name: "AnnualReport2024.pdf",
                    size: 1024,
                    type: "application/pdf",
                    uploadedAt: new Date().toISOString(),
                    url: "#",
                    typeofFile: "pdf",
                },
                {
                    id: "file5",
                    name: "FinancialSummary.docx",
                    size: 2048,
                    type: "application/msword",
                    uploadedAt: new Date().toISOString(),
                    url: "#",
                    typeofFile: "doc",
                },
                {
                    id: "file6",
                    name: "PerformanceMetrics.xlsx",
                    size: 4096,
                    type: "application/vnd.ms-excel",
                    uploadedAt: new Date().toISOString(),
                    url: "#",
                    typeofFile: "excel",
                },
            ],
            parentId: null,
            isExpanded: true,
        },
    ];

    // Retrieve folders from localStorage if available
    //   const getInitialFolders = () => {
    //     const storedFolders = localStorage.getItem("folders");
    //     return storedFolders ? JSON.parse(storedFolders) : initialFolders;
    //   };


    const [folders, setFolders] = useState(initialFolders);
    const [selectedFolder, setSelectedFolder] = useState(folders[0]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAISearch, setShowAISearch] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');
    // const [activeFolder, setActiveFolder] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [previewFile, setPreviewFile] = useState(null);


    const sortOptions = [
        { label: "Last Viewed", value: "lastViewed" },
        { label: "Edited", value: "edited" },
    ];
    const [sortBy, setSortBy] = useState(sortOptions[0]);
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

    // Save folders to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem("folders", JSON.stringify(folders));
    }, [folders]);

    const ALLOWED_TYPES = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
    ];

    const formatFileSize = (bytes) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const triggerFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };
    useEffect(() => {
        setUploadTrigger(triggerFileInput);

        // Cleanup function
        return () => {
            setUploadTrigger(null);
        };
    }, [setUploadTrigger]);
    const handleFileUpload = (event) => {
        const files = Array.from(event.target.files);
        if (!files.length || !activeFolder) return;

        setUploading(true);

        // Simulate async upload delay
        setTimeout(() => {
            setFolders((prevFolders) => {
                // Recursive function to find and update the active folder


                const updatedFolders = updateFolderWithFiles(prevFolders, activeFolder.id, files);

                // Find the updated active folder to update state
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

                const updatedActiveFolder = findFolderById(updatedFolders, activeFolder.id);
                setActiveFolder(updatedActiveFolder);

                return updatedFolders;
            });

            setUploading(false);
            event.target.value = "";
        }, 1000);
    };

    const handleFileDelete = (fileId) => {
        setFolders((prevFolders) => {
            const updatedFolders = prevFolders.map((folder) =>
                folder.id === activeFolder.id
                    ? { ...folder, files: folder.files.filter((f) => f.id !== fileId) }
                    : folder
            );

            const updatedActiveFolder = updatedFolders.find(
                (folder) => folder.id === activeFolder.id
            );
            dispatch(setActiveFolder(updatedActiveFolder));

            return updatedFolders;
        });
    };

    const toggleFolderExpansion = (folderId) => {
        setFolders((prevFolders) =>
            prevFolders.map((folder) =>
                folder.id === folderId
                    ? { ...folder, isExpanded: !folder.isExpanded }
                    : folder
            )
        );
    };

    const handleFolderDelete = (folderId) => {
        setFolders((prevFolders) =>
            prevFolders.filter((folder) => folder.id !== folderId)
        );
        if (selectedFolder && selectedFolder.id === folderId) {
            setSelectedFolder(null);
        }
    };

    const RenderFolder = ({ folder, depth = 0 }) => {
        const childFolders = folders.filter((f) => f.parentId === folder.id);
        const hasChildren = childFolders.length > 0;

        return (
            <div className="user-select-none">
                <div
                    className={`d-flex align-items-center gap-2 p-2 rounded ${selectedFolder?.id === folder.id ? "bg-light" : "hover-bg-secondary"
                        }`}
                    style={{ paddingLeft: `${depth * 16 + 8}px`, cursor: "pointer" }}
                    onClick={() => setSelectedFolder(folder)}
                >
                    {hasChildren && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleFolderExpansion(folder.id);
                            }}
                            className="btn btn-sm d-flex align-items-center justify-content-center p-0 bg-light border-0 rounded"
                            style={{ width: "1rem", height: "1rem" }}
                        >
                            {folder.isExpanded ? (
                                <ChevronDown className="bi bi-chevron-down" />
                            ) : (
                                <ChevronRight className="bi bi-chevron-right" />
                            )}
                        </button>
                    )}
                    <Folder
                        className="bi bi-folder text-primary"
                        style={{ width: "1rem", height: "1rem" }}
                    />
                    <span className="text-truncate">{folder.name}</span>
                    <span className="ms-auto text-muted small">
                        {folder.files.length} files
                    </span>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleFolderDelete(folder.id);
                        }}
                        className="btn btn-outline-danger btn-sm"
                    >
                        <Trash2 style={{ width: "1rem", height: "1rem" }} />
                    </button>
                </div>
                {folder.isExpanded &&
                    childFolders.map((childFolder) => (
                        <RenderFolder
                            key={childFolder.id}
                            folder={childFolder}
                            depth={depth + 1}
                        />
                    ))}
            </div>
        );
    };

    const handleRename = (folders, id, newName) =>
        folders.map((folder) => {
            if (folder.id === id) {
                return { ...folder, name: newName };
            }

            return {
                ...folder,
                files: folder.files.map((file) =>
                    file.id === id ? { ...file, name: newName } : file
                ),
                children: handleRename(folder.children || [], id, newName),
            };
        });

    const handleDelete = (folders, id) =>
        folders
            .map((folder) => {
                if (folder.id === id) return null; // delete folder
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
        }
        try {
            const updatedFolders = addFolderToStructure(folders, newFolder, activeFolder ? activeFolder.id : null);
            setFolders(updatedFolders);

            // Optionally select the new folder
            setSelectedFolder(newFolder);
            dispatch(setShowAddFolderModal(false));
            setNewFolderName("");
        } catch (error) {
            console.error("Error adding folder:", error);
        }
    };

    const getFilteredFiles = () => {
        if (!searchTerm) {
            return selectedFolder?.files || [];
        }

        return folders
            .flatMap((folder) => folder.files)
            .filter((file) =>
                file.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
    };

    const folderss = [
        { id: 1, type: "folder", name: "Vrinda" },
        { id: 2, type: "folder", name: "src" },
        { id: 3, type: "folder", name: "siri" },
        { id: 4, type: "folder", name: "project2" },
    ];




    const openFolder = (folder) => {
        dispatch(setActiveFolder(folder));
        dispatch(addFolderToPath(folder));
    };

    const handleBreadcrumbClick = (index) => {
        const newPath = folderPath.slice(0, index + 1);
        dispatch(setFolderPath(newPath));
        dispatch(setActiveFolder(newPath[newPath.length - 1]))
    };


    const goHome = () => {
        dispatch(resetFolderPath());
    };


    const handleViewClick = (file) => {
        setPreviewFile(file);
    }

    const handleClosePreview = () => {
        setPreviewFile(null)
    }

    const handleDownloadClick = (file) => {
        // Implement file download logic here
        console.log("Downloading file:", file.name);
    }

    useEffect(() => {
        // Sync activeFolder with current folders state
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
    return (
        <div className="p-4 ">
            <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }} separator="›">
                <Link
                    underline="hover"
                    color="inherit"
                    onClick={goHome}
                    sx={{ cursor: "pointer" }}
                >
                    Home
                </Link>

                {/* Dynamic Folders Path */}
                {Array.isArray(folderPath) && folderPath.map((folder, index) => {
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
            <input
                style={{ display: "none" }}
                ref={fileInputRef}
                type="file"
                multiple
                hidden
                onChange={handleFileUpload}
                disabled={uploading} // prevent multiple clicks
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

            <div
                className="row align-items-center"
                style={{
                    border: "1px solid #c4c4c4",
                    borderRadius: "8px",
                    padding: "8px 12px",
                    background: "white",
                    margin: "0px",
                }}
            >
                <div className="col-md-6">
                    <span style={{ fontSize: "14px", color: "#333" }}>8 items</span>
                </div>
                <div className="col-md-6 d-flex justify-content-end">
                    <Autocomplete
                        options={sortOptions}
                        value={sortBy}
                        onChange={(event, newValue) => setSortBy(newValue)}
                        getOptionLabel={(option) => option.label}
                        sx={{ width: 200 }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Sort By"
                                size="small"
                                style={{ backgroundColor: "transparent" }}
                            />
                        )}
                    />
                </div>
            </div>

            <div style={{ padding: "16px" }}>
                <div>
                    <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
                        Folders
                    </Typography>
                    {!activeFolder ? (
                        <>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
                                {folders.map((folder) => (
                                    <FileFolderCard
                                        key={folder.id}
                                        type="folder"
                                        name={folder.name}
                                        onClick={() => openFolder(folder)}
                                        // Rename
                                        onRename={(newName) => {
                                            const updated = handleRename(folders, folder.id, newName);
                                            setFolders(updated);

                                            if (activeFolder) {
                                                const refreshed = updated.find(
                                                    (f) => f.id === activeFolder.id
                                                );
                                                dispatch(setActiveFolder(refreshed));
                                            }
                                        }}
                                        // Delete
                                        onDelete={() => {
                                            const updated = handleDelete(folders, folder.id);
                                            setFolders(updated);

                                            if (activeFolder) {
                                                const refreshed = updated.find(
                                                    (f) => f.id === activeFolder.id
                                                );
                                                dispatch(setActiveFolder(refreshed || null));
                                            }
                                        }}
                                    />
                                ))}
                            </div>
                        </>
                    ) : (
                        <>


                            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
                                {/*  Show subfolders */}
                                {activeFolder?.children?.map((folder) => (
                                    <FileFolderCard
                                        key={folder.id}
                                        type="folder"
                                        name={folder.name}
                                        onClick={() => {
                                            dispatch(setActiveFolder(folder));
                                            dispatch(addFolderToPath(folder));
                                        }}
                                        onRename={(newName) => {
                                            const updated = handleRename(folders, folder.id, newName);
                                            setFolders(updated);
                                            const refreshed = updated.find((f) => f.id === activeFolder.id);
                                            dispatch(setActiveFolder(refreshed || null));
                                        }}
                                        onDelete={() => {
                                            const updated = handleDelete(folders, folder.id);
                                            setFolders(updated);
                                            const refreshed = updated.find((f) => f.id === activeFolder.id);
                                            dispatch(setActiveFolder(refreshed || null));
                                        }}
                                    />
                                ))}

                                {activeFolder.files.map((file) => (
                                    <FileFolderCard
                                        key={file.id}
                                        type="file"
                                        name={file.name}
                                        size={`${Math.round(file.size / 1024)} KB`}
                                        date={new Date(file.uploadedAt).toLocaleDateString()}
                                        typeofFile={file.typeofFile}
                                        onRename={(newName) => {
                                            const updated = handleRename(folders, file.id, newName);
                                            setFolders(updated);
                                            if (activeFolder) {
                                                const refreshed = updated.find(
                                                    (f) => f.id === activeFolder.id
                                                );
                                                dispatch(setActiveFolder(refreshed));
                                            }
                                        }}
                                        onDelete={() => {
                                            const updated = handleDelete(folders, file.id);
                                            setFolders(updated);
                                            if (activeFolder) {
                                                const refreshed = updated.find(
                                                    (f) => f.id === activeFolder.id
                                                );
                                                dispatch(setActiveFolder(refreshed || null));
                                            }
                                        }}
                                        handleViewClick={() => handleViewClick(file)}
                                        handleDownloadClick={() => handleDownloadClick(file)}
                                    />
                                ))}
                                {activeFolder.files.length > 0 ? (
                                    activeFolder.files.map((file) => (
                                        <div key={file.id} style={{ position: "relative" }}>
                                            <FileFolderCard
                                                key={file.id}
                                                type="file"
                                                name={file.name}
                                                size={`${Math.round(file.size / 1024)} KB`}
                                                date={new Date(file.uploadedAt).toLocaleDateString()}
                                                typeofFile={file.typeofFile}
                                                onRename={(newName) => {
                                                    const updated = handleRename(
                                                        folders,
                                                        file.id,
                                                        newName
                                                    );
                                                    setFolders(updated);
                                                    if (activeFolder) {
                                                        const refreshed = updated.find(
                                                            (f) => f.id === activeFolder.id
                                                        );
                                                        dispatch(setActiveFolder(refreshed));
                                                    }
                                                }}
                                                onDelete={() => {
                                                    const updated = handleDelete(folders, file.id);
                                                    setFolders(updated);
                                                    if (activeFolder) {
                                                        const refreshed = updated.find(
                                                            (f) => f.id === activeFolder.id
                                                        );
                                                        dispatch(setActiveFolder(refreshed || null));
                                                    }
                                                }}
                                                handleViewClick={() => handleViewClick(file)}
                                                handleDownloadClick={() => handleDownloadClick(file)}
                                            />
                                        </div>
                                    ))
                                ) : activeFolder.children.length === 0 ? (
                                    <Typography variant="body2" color="text.secondary">
                                        No files or folders inside this folder.
                                    </Typography>
                                ) : null}
                            </div>
                        </>
                    )}
                </div>
                {/* Files Section */}
                <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
                    Files
                </Typography>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
                    {filesInitial.map((file) => (
                        <FileFolderCard
                            key={file.id}
                            type="file"
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
                            handleDownloadClick={() => handleDownloadClick(file)}
                        />
                    ))}
                </div>
            </div>

            <Modal
                show={showAddFolderModal}
                onHide={() => dispatch(setShowAddFolderModal(false))}
                centered
                dialogClassName="custom-modal"
            >
                <Modal.Header style={{ borderBottom: "none", padding: "1rem 1.5rem" }}>
                    <Modal.Title style={{ fontWeight: "500", fontSize: "1.25rem" }}>
                        New Folder
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body style={{ padding: "1rem 1.5rem" }}>
                    <input
                        type="text"
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                        placeholder="Folder name"
                        className="form-control"
                        style={{
                            borderRadius: "8px",
                            border: "1px solid #ccc",
                            padding: "0.5rem 0.75rem",
                            fontSize: "1rem",
                            outline: "none",
                        }}
                    />
                </Modal.Body>

                <Modal.Footer style={{ borderTop: "none", padding: "0.75rem 1.5rem" }}>
                    <Button
                        variant="light"
                        onClick={() => dispatch(setShowAddFolderModal(false))}
                        style={{
                            borderRadius: "8px",
                            border: "1px solid #ccc",
                            fontWeight: "500",
                            padding: "0.5rem 1rem",
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleSaveNewFolder}
                        style={{
                            borderRadius: "8px",
                            padding: "0.5rem 1rem",
                            fontWeight: "500",
                        }}
                    >
                        OK
                    </Button>
                </Modal.Footer>
            </Modal>


            <Dialog
                open={Boolean(previewFile)}
                onClose={handleClosePreview}
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
                        {previewFile?.typeofFile === "pdf" ? (
                            <PictureAsPdfIcon color="error" />
                        ) : previewFile?.typeofFile === "txt" ? (
                            <ArticleIcon color="primary" />
                        ) : (
                            <DescriptionIcon color="action" />
                        )}
                        <Typography variant="h6" noWrap>
                            {previewFile?.name}
                        </Typography>
                    </Box>
                    <IconButton onClick={handleClosePreview}>
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
                    {previewFile?.typeofFile === "pdf" ? (
                        <iframe
                            src={previewFile.url}
                            style={{ width: "100%", height: "80vh", border: "none" }}
                            title="PDF Preview"
                        />
                    ) : previewFile?.typeofFile === "txt" ? (
                        <Box
                            sx={{
                                width: "100%",
                                bgcolor: "#fafafa",
                                p: 2,
                                borderRadius: 2,
                                fontFamily: "monospace",
                                fontSize: "0.95rem",
                                whiteSpace: "pre-wrap",
                                lineHeight: 1.6,
                                boxShadow: "inset 0 0 6px rgba(0,0,0,0.1)",
                            }}
                        >
                            {/* You’d normally fetch file content here */}
                            Sample text file preview...
                        </Box>
                    ) : previewFile?.typeofFile === "doc" ||
                        previewFile?.typeofFile === "excel" ? (
                        <Typography variant="body2" color="text.secondary" textAlign="center">
                            Preview not supported for <b>{previewFile.typeofFile}</b>. <br />
                            Please download the file instead.
                        </Typography>
                    ) : (
                        <Typography variant="body2" color="text.secondary" textAlign="center">
                            No preview available.
                        </Typography>
                    )}
                </DialogContent>

                {/* Footer */}
                <DialogActions sx={{ px: 3, py: 2, bgcolor: "#fafafa" }}>
                    <Button
                        onClick={handleClosePreview}
                        variant="contained"
                        sx={{ borderRadius: 2, px: 3 }}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

        </div>
    );
};

export default DocumentRepository;
