import React, { useState, useEffect } from 'react';
import { Search, Upload, Folder, File, ChevronRight, ChevronDown, X, MessageCircle, Trash2, FolderPlus } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import { Autocomplete, TextField, Typography, Breadcrumbs, Link } from '@mui/material';
import FileFolderCard from '../../componnets/FileFolderCard';
import { useDispatch, useSelector } from 'react-redux';
import { setShowAddFolderModal } from '../../Store/uploadSlice';
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

const DocumentRepository = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { showAddFolderModal } = useSelector(state => state.upload);
    const searchedFileName = location.state?.searchedFileName;
    const [fileNotFound, setFileNotFound] = useState(false);


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

    const files = [
        { id: 7, type: "file", name: "TeamRoster.xlsx", typeofFile: "excel" },
        { id: 8, type: "file", name: "MarketingPlan.docx", typeofFile: "doc" },
        { id: 9, type: "file", name: "SystemArchitecture.pdf", typeofFile: "pdf" },
    ];



    // Retrieve folders from localStorage if available
    const getInitialFolders = () => {
        const storedFolders = localStorage.getItem('folders');
        return storedFolders ? JSON.parse(storedFolders) : initialFolders;
    };

    const [folders, setFolders] = useState(getInitialFolders);
    const [selectedFolder, setSelectedFolder] = useState(folders[0]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAISearch, setShowAISearch] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');
    const [activeFolder, setActiveFolder] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [folderPath, setFolderPath] = useState([]);


    const sortOptions = [
        { label: 'Last Viewed', value: 'lastViewed' },
        { label: 'Edited', value: 'edited' }
    ];
    const [sortBy, setSortBy] = useState(sortOptions[0]);
    useEffect(() => {
        if (searchedFileName) {
            let fileFound = false;
            let folderWithFile = null;

            folders.forEach(folder => {
                const foundFile = folder.files.find(file => file.name === searchedFileName);
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
        localStorage.setItem('folders', JSON.stringify(folders));
    }, [folders]);

    const ALLOWED_TYPES = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
    ];

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleFileUpload = (event) => {
        const files = Array.from(event.target.files);
        if (!files.length || !activeFolder) return;

        setUploading(true); // show feedback while uploading

        // Simulate async upload delay (you can remove setTimeout if you don’t want fake delay)
        setTimeout(() => {
            setFolders((prevFolders) => {
                const updatedFolders = prevFolders.map((folder) =>
                    folder.id === activeFolder.id
                        ? {
                            ...folder,
                            files: [
                                ...folder.files,
                                ...files.map((file) => ({
                                    id: Date.now() + Math.random(),
                                    name: file.name,
                                    size: file.size,
                                    uploadedAt: new Date().toISOString(),
                                })),
                            ],
                        }
                        : folder
                );

                const updatedActiveFolder = updatedFolders.find(
                    (folder) => folder.id === activeFolder.id
                );
                setActiveFolder(updatedActiveFolder);

                return updatedFolders;
            });

            setUploading(false); // hide feedback
            event.target.value = ""; // reset input so same file can be re-uploaded
        }, 1000);
    };

    const handleFileDelete = (fileId) => {
        setFolders((prevFolders) => {
            const updatedFolders = prevFolders.map((folder) =>
                folder.id === activeFolder.id
                    ? { ...folder, files: folder.files.filter((f) => f.id !== fileId) }
                    : folder
            );

            const updatedActiveFolder = updatedFolders.find(folder => folder.id === activeFolder.id);
            setActiveFolder(updatedActiveFolder);

            return updatedFolders;
        });
    };


    const toggleFolderExpansion = (folderId) => {
        setFolders(prevFolders => prevFolders.map(folder =>
            folder.id === folderId
                ? { ...folder, isExpanded: !folder.isExpanded }
                : folder
        ));
    };

    const handleFolderDelete = (folderId) => {
        setFolders((prevFolders) => prevFolders.filter(folder => folder.id !== folderId));
        if (selectedFolder && selectedFolder.id === folderId) {
            setSelectedFolder(null);
        }
    };

    const RenderFolder = ({ folder, depth = 0 }) => {
        const childFolders = folders.filter(f => f.parentId === folder.id);
        const hasChildren = childFolders.length > 0;

        return (
            <div className="user-select-none">
                <div
                    className={`d-flex align-items-center gap-2 p-2 rounded ${selectedFolder?.id === folder.id ? 'bg-light' : 'hover-bg-secondary'}`}
                    style={{ paddingLeft: `${depth * 16 + 8}px`, cursor: 'pointer' }}
                    onClick={() => setSelectedFolder(folder)}
                >
                    {hasChildren && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleFolderExpansion(folder.id);
                            }}
                            className="btn btn-sm d-flex align-items-center justify-content-center p-0 bg-light border-0 rounded"
                            style={{ width: '1rem', height: '1rem' }}
                        >
                            {folder.isExpanded ? (
                                <ChevronDown className="bi bi-chevron-down" />
                            ) : (
                                <ChevronRight className="bi bi-chevron-right" />
                            )}
                        </button>
                    )}
                    <Folder className="bi bi-folder text-primary" style={{ width: '1rem', height: '1rem' }} />
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
                        <Trash2 style={{ width: '1rem', height: '1rem' }} />
                    </button>
                </div>
                {folder.isExpanded && childFolders.map(childFolder => (
                    <RenderFolder
                        key={childFolder.id}
                        folder={childFolder}
                        depth={depth + 1}
                    />
                ))}
            </div>
        );
    };

    // const handleAddFolder = () => {
    //     dispatch(setShowAddFolderModal(true));
    // };

    const handleSaveNewFolder = () => {
        const newFolder = {
            id: Date.now().toString(),
            name: newFolderName,
            files: [],
            parentId: null,
            isExpanded: true,
        };
        setFolders([...folders, newFolder]);
        setSelectedFolder(newFolder);
        dispatch(setShowAddFolderModal(false));
        setNewFolderName('');
    };

    const getFilteredFiles = () => {
        if (!searchTerm) {
            return selectedFolder?.files || [];
        }

        return folders
            .flatMap(folder => folder.files)
            .filter(file => file.name.toLowerCase().includes(searchTerm.toLowerCase()));
    };


    const folderss = [
        { id: 1, type: "folder", name: "Vrinda" },
        { id: 2, type: "folder", name: "src" },
        { id: 3, type: "folder", name: "siri" },
        { id: 4, type: "folder", name: "project2" },
    ];


    console.log(activeFolder, "ACTIVEFOLDER")

    const openFolder = (folder) => {
        setActiveFolder(folder);
        setFolderPath((prev) => [...prev, folder]);
    };

    const handleBreadcrumbClick = (index) => {
        const newPath = folderPath.slice(0, index + 1);
        setFolderPath(newPath);
        setActiveFolder(newPath[newPath.length - 1]);
    };


    const goHome = () => {
        setActiveFolder(null);
        setFolderPath([]);
    };

    const goBack = () => {
        setFolderPath((prev) => prev.slice(0, -1));
    };



    return (

        <div className="p-4 ">
            <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }} separator="›" >

                <Link
                    underline="hover"
                    color="inherit"
                    onClick={goHome}
                    sx={{ cursor: "pointer" }}
                >
                    Home
                </Link>

                {/* Dynamic Folders Path */}
                {folderPath.map((folder, index) => {
                    const isLast = index === folderPath.length - 1;
                    return isLast ? (
                        <Typography style={{color:"blue"}} key={folder.id}>
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


            {uploading && (
                <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-50" style={{ zIndex: 2000 }}>
                    <div className="spinner-border text-light" role="status" style={{ width: "3rem", height: "3rem" }}>
                        <span className="visually-hidden">Uploading...</span>
                    </div>
                </div>
            )}
            {fileNotFound && searchedFileName && (
                <div className="alert alert-warning mb-4" role="alert">
                    The file "{searchedFileName}" was not found in the repository.
                </div>
            )}

            <div className="row align-items-center" style={{
                border: '1px solid #c4c4c4',
                borderRadius: '8px',
                padding: "8px 12px",
                background: 'white',
                margin: "0px"
            }}>
                <div className="col-md-6">
                    <span style={{ fontSize: "14px", color: "#333" }}>
                        8 items
                    </span>
                </div>
                <div className='col-md-6 d-flex justify-content-end'>
                    <Autocomplete
                        options={sortOptions}
                        value={sortBy}
                        onChange={(event, newValue) => setSortBy(newValue)}
                        getOptionLabel={(option) => option.label}
                        sx={{ width: 200 }}
                        renderInput={(params) => (
                            <TextField {...params} label="Sort By" size="small" style={{ backgroundColor: "transparent" }} />
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
                                    />
                                ))}
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Back button */}
                            {/* <button
                                style={{
                                    marginBottom: "16px",
                                    padding: "6px 12px",
                                    borderRadius: "6px",
                                    border: "1px solid #ccc",
                                    cursor: "pointer",
                                }}
                                onClick={() => setActiveFolder(null)}
                            // onClick={goBack}
                            >
                                ← Back to Folders
                            </button> */}

                            {/* <label className="btn btn-primary ms-2">
                                <Upload style={{ width: '1rem', height: '1rem' }} className="me-1" />
                                {uploading ? "Uploading..." : "Upload File"}
                                <input
                                    type="file"
                                    multiple
                                    hidden
                                    onChange={handleFileUpload}
                                    disabled={uploading} // prevent multiple clicks
                                />
                            </label> */}

                            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
                                {/*  Show subfolders */}
                                {activeFolder.children && activeFolder.children.length > 0 && (
                                    activeFolder.children.map((child) => (
                                        <FileFolderCard
                                            key={child.id}
                                            type="folder"
                                            name={child.name}
                                            onClick={() => openFolder(child)}
                                        />
                                    ))
                                )}
                                {activeFolder.files.length > 0 ? (
                                    activeFolder.files.map((file) => (
                                        <div key={file.id} style={{ position: "relative" }}>
                                            <FileFolderCard
                                                type="file"
                                                name={file.name}
                                                size={`${Math.round(file.size / 1024)} KB`}
                                                date={new Date(file.uploadedAt).toLocaleDateString()}
                                                typeofFile={file.typeofFile}
                                            />
                                        </div>
                                    ))
                                ) : (activeFolder.children.length === 0 ? (
                                    <Typography variant="body2" color="text.secondary">
                                        No files or folders inside this folder.
                                    </Typography>
                                ) : null)}
                            </div>
                        </>
                    )}
                </div>
                {/* Files Section */}
                <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
                    Files
                </Typography>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
                    {files.map((file) => (
                        <FileFolderCard
                            key={file.id}
                            type="file"
                            name={file.name}
                            onClick={() => console.log("Open file:", file.name)}
                            typeofFile={file.typeofFile}
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
                <Modal.Header style={{ borderBottom: 'none', padding: '1rem 1.5rem' }}>
                    <Modal.Title style={{ fontWeight: '500', fontSize: '1.25rem' }}>New Folder</Modal.Title>
                </Modal.Header>

                <Modal.Body style={{ padding: '1rem 1.5rem' }}>
                    <input
                        type="text"
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                        placeholder="Folder name"
                        className="form-control"
                        style={{
                            borderRadius: '8px',
                            border: '1px solid #ccc',
                            padding: '0.5rem 0.75rem',
                            fontSize: '1rem',
                            outline: 'none',
                        }}
                    />
                </Modal.Body>

                <Modal.Footer style={{ borderTop: 'none', padding: '0.75rem 1.5rem' }}>
                    <Button
                        variant="light"
                        onClick={() => dispatch(setShowAddFolderModal(false))}
                        style={{
                            borderRadius: '8px',
                            border: '1px solid #ccc',
                            fontWeight: '500',
                            padding: '0.5rem 1rem',
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleSaveNewFolder}
                        style={{
                            borderRadius: '8px',
                            padding: '0.5rem 1rem',
                            fontWeight: '500',
                        }}
                    >
                        OK
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>
    );
};

export default DocumentRepository;