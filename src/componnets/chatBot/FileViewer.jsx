import { Box, Typography, Button, IconButton, CircularProgress } from '@mui/material';
import { Download, Refresh } from '@mui/icons-material';
import { useState, useEffect, useRef } from 'react';

const FileViewer = ({ document }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [retryCount, setRetryCount] = useState(0);
    const iframeRef = useRef(null);

    useEffect(() => {
        // Reset loading and error states when document changes
        setLoading(true);
        setError(false);
        setRetryCount(0);
    }, [document]);

    if (!document) return null;

    const downloadFile = () => {
        // Create a mapping of sample file URLs
        const fileUrls = {
            "ProjectPlan.pdf": "https://d1fpedukd3w7d8.cloudfront.net/files/project-plan.pdf",
            "IncidentReport_July.docx": "https://calibre-ebook.com/downloads/demos/demo.docx",
            "FinancialSummary.xlsx": "https://ou.edu/content/dam/cms/docs/sample-excel-file.xlsx",
            "MeetingNotes_August.txt": "https://sample-files.com/downloads/documents/txt/simple.txt",
            "UserGuide.pdf": "https://d1fpedukd3w7d8.cloudfront.net/files/project-plan.pdf"
        };

        const fileUrl = fileUrls[document.fileName] || "#";
        window.open(fileUrl, '_blank');
    };

    const retryLoad = () => {
        setLoading(true);
        setError(false);
        setRetryCount(prev => prev + 1);
        
        // Force reload the iframe after a short delay
        setTimeout(() => {
            if (iframeRef.current) {
                // Force reload by adding a timestamp parameter to bypass cache
                const currentSrc = iframeRef.current.src;
                const separator = currentSrc.includes('?') ? '&' : '?';
                iframeRef.current.src = currentSrc + separator + 'retry=' + Date.now();
            }
        }, 100);
    };

    const sampleFileUrls = {
        "ProjectPlan.pdf": "https://docs.google.com/gview?url=https://d1fpedukd3w7d8.cloudfront.net/files/project-plan.pdf&embedded=true",
        "IncidentReport_July.docx": "https://calibre-ebook.com/downloads/demos/demo.docx",
        "FinancialSummary.xlsx": "https://ou.edu/content/dam/cms/docs/sample-excel-file.xlsx",
        "MeetingNotes_August.txt": "https://docs.google.com/gview?url=https://sample-files.com/downloads/documents/txt/simple.txt&embedded=true",
        "UserGuide.pdf": "https://docs.google.com/gview?url=https://d1fpedukd3w7d8.cloudfront.net/files/project-plan.pdf&embedded=true"
    };

    const handleIframeLoad = () => {
        setLoading(false);
        setError(false);
    };

    const handleIframeError = () => {
        setLoading(false);
        setError(true);
    };

    const renderIframeViewer = (url) => {
        // Add cache-busting parameter for retries
        const finalUrl = retryCount > 0 ? `${url}&retry=${Date.now()}` : url;
        
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
                        src={finalUrl}
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

    const renderOfficeViewer = () => {
        // Use Microsoft Office Online Viewer for Office files
        const officeViewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(sampleFileUrls[document.fileName])}`;
        return renderIframeViewer(officeViewerUrl);
    };

    const extension = document.fileName.split('.').pop().toLowerCase();

    if (extension === 'pdf') {
        return renderIframeViewer(sampleFileUrls[document.fileName]);
    } else if (['doc', 'docx'].includes(extension)) {
        return renderOfficeViewer();
    } else if (['xls', 'xlsx'].includes(extension)) {
        return renderOfficeViewer();
    } else if (extension === 'txt') {
        return renderIframeViewer(sampleFileUrls[document.fileName]);
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