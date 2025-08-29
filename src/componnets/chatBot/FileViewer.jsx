import { Box, Typography, Button, IconButton, CircularProgress } from '@mui/material';
import { Download, Refresh } from '@mui/icons-material';
import { useState, useEffect, useRef } from 'react';

const FileViewer = ({ document }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [retryCount, setRetryCount] = useState(0);
    const iframeRef = useRef(null);
    const [currentViewerUrl, setCurrentViewerUrl] = useState('');

    useEffect(() => {
        setLoading(true);
        setError(false);
        setRetryCount(0);
        
        if (document) {
            const viewerUrl = getViewerUrl(document.fileName);
            setCurrentViewerUrl(viewerUrl || '');
        }
    }, [document]);

    useEffect(() => {
        if (iframeRef.current && currentViewerUrl) {
            const finalUrl = retryCount > 0 
                ? `${currentViewerUrl}${currentViewerUrl.includes('?') ? '&' : '?'}retry=${Date.now()}`
                : currentViewerUrl;
            
            iframeRef.current.src = finalUrl;
        }
    }, [currentViewerUrl, retryCount]);

    if (!document) return null;

    const fileUrls = {
        "GovernmentGuaranteePolicy2022.pdf": "/files/Government Guarantee Policy.pdf",
        "GuaranteePolicy2022.pdf": "/files/Government Guarantee Policy.pdf",
        "Policy2022.pdf": "/files/Government Guarantee Policy.pdf",
        "2022PolicyGovt.pdf": "/files/Government Guarantee Policy.pdf",
        "OldPolicyCircular2018.pdf": "/files/old_policy_circular.pdf",
        "PolicyCircular2018.pdf": "/files/old_policy_circular.pdf",
        "Circular2018.pdf": "/files/old_policy_circular.pdf",
        "2018OldPolicy.pdf": "/files/old_policy_circular.pdf",
        
        // PDF files from Guidelines folder (local files)
        "GIGW_Guidelines.pdf": "/files/Guidelines_for_Government_websites.pdf",
        "Guidelines.pdf": "/files/Guidelines_for_Government_websites.pdf",
        "Govt_guidelines.pdf": "/files/Guidelines_for_Government_websites.pdf",
        "Website_guidelines.pdf": "/files/Guidelines_for_Government_websites.pdf",
        
        // PDF files from Circulars folder (local files)
        "NDSAP Implementation Guidelines.pdf": "/files/NDSAP Implementation Guidelines.pdf",
        "Implementation Guidelines.pdf": "/files/NDSAP Implementation Guidelines.pdf",
        "Guidelines.pdf": "/files/NDSAP Implementation Guidelines.pdf",
        "NDSAP.pdf": "/files/NDSAP Implementation Guidelines.pdf",
        
        // DOCX files from Implementation Guides (external URLs)
        "CyberSecurityFramework.docx": "https://www.energy.gov/sites/default/files/2023-05/EXEC-2022-008113%20-%20Cybersecurity%20Plan%20Templates_High%20Risk.docx",
        "SecurityFramework.docx": "https://www.energy.gov/sites/default/files/2023-05/EXEC-2022-008113%20-%20Cybersecurity%20Plan%20Templates_High%20Risk.docx",
        "Framework.docx": "https://www.energy.gov/sites/default/files/2023-05/EXEC-2022-008113%20-%20Cybersecurity%20Plan%20Templates_High%20Risk.docx",
        "WorkCyber.docx": "https://www.energy.gov/sites/default/files/2023-05/EXEC-2022-008113%20-%20Cybersecurity%20Plan%20Templates_High%20Risk.docx",
        
        // DOCX files from Nomination Templates (external URLs)
        "Nomination_Letter_Template.docx": "https://doiu.doi.gov/whldpdocs/Sample_Supervisor_Nomination_Letter.docx",
        "Letter_Template.docx": "https://doiu.doi.gov/whldpdocs/Sample_Supervisor_Nomination_Letter.docx",
        "Template.docx": "https://doiu.doi.gov/whldpdocs/Sample_Supervisor_Nomination_Letter.docx",
        "Nomination.docx": "https://doiu.doi.gov/whldpdocs/Sample_Supervisor_Nomination_Letter.docx",
        
        // Root level files
        "Letter_of_DO.pdf": "/files/letter_of_do.pdf", // Local PDF
        "SRP_Upload_Template.xlsx": "https://srp.fas.gsa.gov/portal/docs/FAS%20SRP%20Excel%20Upload%20Reporting%20Template%20v1.3.9.xlsx", // External Excel
        "Readme.txt": "https://www1.ncdc.noaa.gov/pub/data/ghcn/daily/readme.txt", // External Text
        "System-Design-Document.docx": "https://www.cms.gov/Research-Statistics-Data-and-Systems/CMS-Information-Technology/TLC/Downloads/System-Design-Document.docx" // External DOCX
    };

    const downloadFile = () => {
    const fileUrl = fileUrls[document.fileName] || "#";
    const fileName = document.fileName;
    const extension = fileName.split('.').pop().toLowerCase();
    
    if (fileUrl.startsWith('/')) {
        const link = window.document.createElement('a');
        link.href = fileUrl;
        link.download = fileName;
        window.document.body.appendChild(link);
        link.click();
        window.document.body.removeChild(link);
    } 
    else if (extension === 'txt') {
        window.open(fileUrl, '_blank');
    }
    else {
        fetch(fileUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.blob();
            })
            .then(blob => {
                // Create blob URL and trigger download
                const blobUrl = window.URL.createObjectURL(blob);
                const link = window.document.createElement('a');
                link.href = blobUrl;
                link.download = fileName;
                window.document.body.appendChild(link);
                link.click();
                
                // Clean up
                window.URL.revokeObjectURL(blobUrl);
                window.document.body.removeChild(link);
            })
            .catch(error => {
                console.error('Download failed:', error);
                // Fallback: open in new tab if download fails
                window.open(fileUrl, '_blank');
            });
    }
};

    const retryLoad = () => {
        setLoading(true);
        setError(false);
        setRetryCount(prev => prev + 1);
    };

    const getViewerUrl = (fileName) => {
        const extension = fileName.split('.').pop().toLowerCase();
        const fileUrl = fileUrls[fileName] || "#";
        
        if (extension === 'pdf') {
            // For local PDF files, serve them directly (they're in public/files folder)
            return fileUrl;
        } else if (['doc', 'docx'].includes(extension)) {
            // Use Microsoft Office Online Viewer for Word documents
            return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`;
        } else if (['xls', 'xlsx'].includes(extension)) {
            // Use Microsoft Office Online Viewer for Excel files
            return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`;
        } else if (extension === 'txt') {
            // Use Google Docs viewer for text files
            return `https://docs.google.com/gview?url=${encodeURIComponent(fileUrl)}&embedded=true`;
        }
        return null;
    };

    const handleIframeLoad = () => {
        setLoading(false);
        setError(false);
    };

    const handleIframeError = () => {
        setLoading(false);
        setError(true);
    };

    const renderIframeViewer = () => {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6">{document.fileName}</Typography>
                    <Box>
                        <IconButton onClick={downloadFile} size="small" title="Download">
                            <Download />
                        </IconButton>
                        <IconButton onClick={retryLoad} size="small" title="Reload">
                            <Refresh />
                        </IconButton>
                    </Box>
                </Box>

                {loading && (
                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        height: '200px',
                        flexDirection: 'column',
                        gap: 2
                    }}>
                        <CircularProgress />
                        <Typography variant="body2">Loading document...</Typography>
                    </Box>
                )}

                {error && (
                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        height: '200px',
                        flexDirection: 'column',
                        gap: 2
                    }}>
                        <Typography variant="body2" color="error">
                            Failed to load document preview.
                        </Typography>
                        <Button variant="contained" onClick={retryLoad}>
                            Retry
                        </Button>
                    </Box>
                )}

                <Box sx={{ 
                    flex: 1, 
                    minHeight: 0, 
                    display: loading || error ? 'none' : 'block' 
                }}>
                    <iframe
                        ref={iframeRef}
                        style={{ width: '100%', height: '100%', border: 'none' }}
                        title={document.fileName}
                        onLoad={handleIframeLoad}
                        onError={handleIframeError}
                        allow="autoplay; encrypted-media"
                    />
                </Box>
            </Box>
        );
    };

    const extension = document.fileName.split('.').pop().toLowerCase();
    const viewerUrl = getViewerUrl(document.fileName);

    if (viewerUrl) {
        return renderIframeViewer();
    } else {
        return (
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <Typography variant="h6" gutterBottom>
                    {document.fileName}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                    Preview not available for this file type.
                </Typography>
                <Button variant="contained" onClick={downloadFile}>
                    Download File
                </Button>
            </Box>
        );
    }
};

export default FileViewer;