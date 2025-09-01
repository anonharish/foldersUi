import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  IconButton,
  TextField,
  Typography,
  Avatar,
  Stack,
  Button,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip 
} from "@mui/material";
import {
  Close,
  Send,
  Description, // PDF
  Article, // Word documents
  TableChart, // Excel
  Subject, // Text files
  Image, // Images
  Folder,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import FloatingChatIcon from "./FloatChatBot";
import { sampleResponse } from "../incidents/sampleAiSearchResponse";
import FileViewer from "./FileViewer";
import { Bot } from "lucide-react";
import axios from "axios";

const dummyBotResponse = {
  answer: "Here is a dummy response with table and suggestions.",
  table_title: "Sample Data",
  table_data: [
    { Name: "Alice", Age: 25, Role: "Engineer" },
    { Name: "Bob", Age: 30, Role: "Designer" },
  ],
  followupQuestions: [
    "Show me more matching files",
    "Tell me, which date the files are uploaded?",
    "Give me Summary of the Framwork.docx file",
  ],
  dashboard: [], // you can keep empty for now
};

// Typing Indicator
const TypingIndicator = () => {
  const dotStyle = {
    width: 8,
    height: 8,
    borderRadius: "50%",
    backgroundColor: "grey",
    animation: "typing-bounce 1.3s infinite ease-in-out",
  };
  return (
    <Box sx={{ display: "flex", gap: "6px", alignItems: "center", p: "12px" }}>
      <Box sx={{ ...dotStyle, animationDelay: "0s" }} />
      <Box sx={{ ...dotStyle, animationDelay: "0.25s" }} />
      <Box sx={{ ...dotStyle, animationDelay: "0.5s" }} />
    </Box>
  );
};

const getFileIcon = (fileExtension) => {
  switch (fileExtension) {
    case "pdf":
      return <Description sx={{ fontSize: 24 }} />;
    case "docx":
    case "doc":
      return <Article sx={{ fontSize: 24 }} />;
    case "xlsx":
    case "xls":
      return <TableChart sx={{ fontSize: 24 }} />;
    case "txt":
      return <Subject sx={{ fontSize: 24 }} />;
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
      return <Image sx={{ fontSize: 24 }} />;
    default:
      return <Folder sx={{ fontSize: 24 }} />;
  }
};

// Define color based on file type
const getFileColor = (fileExtension) => {
  switch (fileExtension) {
    case "pdf":
      return "#e53935"; // Red for PDF
    case "docx":
    case "doc":
      return "#1976d2"; // Blue for Word
    case "xlsx":
    case "xls":
      return "#388e3c"; // Green for Excel
    case "txt":
      return "#757575"; // Gray for text
    default:
      return "#f57c00"; // Orange for others
  }
};

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: "1",
      text: "Hello! I'm your assistant. How can I help you today?",
      isUser: false,
      isTypingComplete: true,
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleClose = () => {
    setIsOpen(false);
    setMessages([
      {
        id: "1",
        text: "Hello! I'm your assistant. How can I help you today?",
        isUser: false,
        isTypingComplete: true,
      },
    ]);
    setInputValue("");
    setIsTyping(false);
    setSelectedDoc(null);
    setSearchResults([]);
  };

  const handleSendMessage = async (text = null) => {
    const messageText = text || inputValue.trim();
    if (!messageText) return;

    const userMsg = {
      id: Date.now().toString(),
      text: messageText,
      isUser: true,
      isTypingComplete: true,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);
    try {
      // For demo purposes, we'll use the sample response
      const response = await axios.get(
        `http://localhost:8084/iassure/api/incident/search`,
        {
          params: { query: encodeURIComponent(messageText) },
          headers: { "Content-Type": "application/json" },
        }
      );
     
      
      // await new Promise((res) => setTimeout(res, 800));
      // const response = { data: sampleResponse };
      
      const resultCount = response.data.sources?.length || 0;
      const botMsg = {
        id: (Date.now() + 1).toString(),
        text: response.data.summary || `I found ${resultCount} document${resultCount === 1 ? "" : "s"} that might be relevant to your query.`,
        isUser: false,
        followupQuestions: response.data.suggestions || [],
        isTypingComplete: false,
      };
      setMessages((prev) => [...prev, botMsg]);
      setSearchResults(response.data.sources || []);
    } catch (error) {
      console.error("API Error:", error);
      const errorMsg = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I encountered an error while searching. Please try again.",
        isUser: false,
        isTypingComplete: false,
        followupQuestions: [],
      };
      setMessages((prev) => [...prev, errorMsg]);
      setSearchResults([]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = (text) => {
    if (!text || isTyping) return;
    setInputValue(text);
    handleSendMessage(text);
  };

  const handleViewDocument = (doc) => {
    setSelectedDoc(doc);
    setPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
    setSelectedDoc(null);
  };

  return (
    <>
      {!isOpen && <FloatingChatIcon onClick={() => setIsOpen(true)} />}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1250,
          }}
        >
          <Box
            sx={{
              width: "100vw",
              height: "100vh",
              bgcolor: "white",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Header */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                px: 2,
                py: 1,
                background: "#3b54b0",
                color: "white",
              }}
            >
              <Avatar sx={{ bgcolor: "#ea641f", width: 40, height: 40 }}>
                <Bot />
              </Avatar>
              <Typography variant="subtitle1" fontWeight={600} ml={2}>
                AI Document Search
              </Typography>
              <Box ml="auto">
                <IconButton
                  size="small"
                  onClick={handleClose}
                  sx={{ color: "white" }}
                >
                  <Close />
                </IconButton>
              </Box>
            </Box>
            <Box sx={{ flex: 1, display: "flex" }}>
              {/* Left side: Chat area */}
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  bgcolor: "#f9fafb",
                  height: "90vh",
                }}
              >
                {/* Scrollable messages */}
                <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
                  <Stack spacing={2}>
                    {messages.map((msg) => (
                      <Box
                        key={msg.id}
                        display="flex"
                        justifyContent={msg.isUser ? "flex-end" : "flex-start"}
                      >
                        <Box
                          sx={{
                            bgcolor: msg.isUser ? "#ea641f" : "#f4f6f8",
                            color: msg.isUser ? "white" : "black",
                            p: 1.5,
                            borderRadius: 2,
                            maxWidth: "70%",
                            whiteSpace: "pre-wrap",
                          }}
                        >
                          {msg.isUser ? (
                            <span>{msg.text}</span>
                          ) : !msg.isTypingComplete ? (
                            <TypeAnimation
                              sequence={[
                                msg.text,
                                () => {
                                  setMessages((prev) =>
                                    prev.map((m) =>
                                      m.id === msg.id
                                        ? { ...m, isTypingComplete: true }
                                        : m
                                    )
                                  );
                                },
                              ]}
                              wrapper="span"
                              cursor={false}
                              speed={70}
                            />
                          ) : (
                            <span>{msg.text}</span>
                          )}
                        </Box>
                      </Box>
                    ))}

                    {isTyping && (
                      <Box
                        sx={{ display: "flex", justifyContent: "flex-start" }}
                      >
                        <Avatar sx={{ bgcolor: "#3b54b0", mr: 1 }}>
                          <Bot />
                        </Avatar>
                        <TypingIndicator />
                      </Box>
                    )}
                    <div ref={messagesEndRef} />
                  </Stack>
                </Box>

                {/* Suggestions (always above input, not scrolling) */}
                {messages.length > 0 &&
                  messages[messages.length - 1].followupQuestions?.length >
                    0 && (
                    <Box
                      sx={{
                        p: 1,
                        display: "flex",
                        gap: 1,
                        flexWrap: "wrap",
                        bgcolor: "#f9fafb",
                        borderTop: "1px solid #eee",
                      }}
                    >
                      {messages[messages.length - 1].followupQuestions.map(
                        (s, i) => (
                          <Chip
                            key={i}
                            label={s}
                            onClick={() => handleSuggestionClick(s)}
                            size="small"
                            variant="outlined"
                            sx={{
                              fontSize: "0.8rem",
                              fontWeight: "500",
                              height: "24px",
                              borderRadius: "12px",
                              color: "#3b54b0",
                              borderColor: "#3b54b040",
                              "&:hover": {
                                backgroundColor: "#3b54b010",
                              },
                            }}
                          />
                        )
                      )}
                    </Box>
                  )}

                {/* Input (always fixed at very bottom) */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 1,
                    borderTop: "1px solid #ccc",
                    bgcolor: "white",
                  }}
                >
                  <TextField
                    size="small"
                    fullWidth
                    placeholder="Type Your Query..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                  <IconButton
                    onClick={() => handleSendMessage(null)}
                    disabled={!inputValue.trim()}
                    sx={{
                      ml: 1,
                      bgcolor: "#3b54b0",
                      "&:hover": {
                        bgcolor: "#2a3c82",
                      },
                    }}
                  >
                    <Send sx={{ fontSize: 20 }} />
                  </IconButton>
                </Box>
              </Box>

              {/* Right side: Search Results */}
              <Box
                sx={{
                  width: "35%",
                  borderLeft: "1px solid #ddd",
                  p: 2,
                  height: "90vh",
                  overflow: "auto",
                  bgcolor: "#fafafa",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, mb: 2, color: "#2d3a80" }}
                >
                  Search Results
                </Typography>

                {searchResults.length === 0 ? (
                  <Box
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      p: 3,
                      textAlign: "center",
                    }}
                  >
                    <Box
                      sx={{
                        position: "relative",
                        width: 160,
                        height: 120,
                        mb: 3,
                      }}
                    >
                      <Box
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 20,
                          width: 120,
                          height: 90,
                          backgroundColor: "white",
                          borderRadius: 2,
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Description sx={{ fontSize: 40, color: "#3b54b0" }} />
                      </Box>
                      <Box
                        sx={{
                          position: "absolute",
                          top: 15,
                          left: 0,
                          width: 100,
                          height: 75,
                          backgroundColor: "white",
                          borderRadius: 2,
                          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                          opacity: 0.7,
                        }}
                      />
                      <Box
                        sx={{
                          position: "absolute",
                          top: 30,
                          left: 40,
                          width: 80,
                          height: 60,
                          backgroundColor: "white",
                          borderRadius: 2,
                          boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                          opacity: 0.5,
                        }}
                      />
                    </Box>

                    <Typography
                      variant="body2"
                      sx={{ mb: 2, color: "text.secondary", maxWidth: 280 }}
                    >
                      Your search results will appear here
                    </Typography>
                  </Box>
                ) : (
                  <Stack spacing={2}>
                    {searchResults.map((doc, i) => {
                      const fileExtension = doc.fileName
                        .split(".")
                        .pop()
                        .toLowerCase();
                      return (
                        <Paper
                          key={i}
                          sx={{
                            p: 2,
                            border: "1px solid #e0e0e0",
                            borderRadius: 2,
                            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                            transition: "all 0.2s ease",
                            "&:hover": {
                              boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                              transform: "translateY(-2px)",
                              borderColor: getFileColor(fileExtension),
                            },
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "flex-start",
                            }}
                          >
                            <Box
                              sx={{
                                fontSize: "24px",
                                mr: 2,
                                color: getFileColor(fileExtension),
                              }}
                            >
                              {getFileIcon(fileExtension)}
                            </Box>

                            <Box sx={{ flexGrow: 1 }}>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  mb: 1,
                                }}
                              >
                                <Typography
                                  variant="body2"
                                  fontWeight={600}
                                  sx={{ mr: 1 }}
                                >
                                  {doc.fileName}
                                </Typography>
                                <Chip
                                  label={`${(doc.score * 100).toFixed(
                                    1
                                  )}% match`}
                                  size="small"
                                  color="primary"
                                  variant="outlined"
                                />
                              </Box>

                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  mb: 1,
                                }}
                              >
                                <Box
                                  sx={{
                                    backgroundColor: `${getFileColor(
                                      fileExtension
                                    )}15`,
                                    color: getFileColor(fileExtension),
                                    fontSize: "10px",
                                    fontWeight: "bold",
                                    px: 1,
                                    py: 0.5,
                                    borderRadius: 1,
                                    textTransform: "uppercase",
                                    mr: 1,
                                  }}
                                >
                                  {fileExtension}
                                </Box>
                              </Box>

                              <Tooltip
                                title={doc.content}
                                placement="top"
                                arrow
                                sx={{
                                  maxWidth: "500px", // Limit tooltip width
                                  whiteSpace: "pre-wrap", // Preserve line breaks
                                  wordBreak: "break-word", // Break long words
                                }}
                              >
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  sx={{
                                    lineHeight: 1.4,
                                    display: "block",
                                    mb: 1.5,
                                  }}
                                >
                                  {doc.content.slice(0, 100)}...
                                </Typography>
                              </Tooltip>

                              <Button
                                variant="contained"
                                size="small"
                                sx={{
                                  backgroundColor: "#3b54b0",
                                  "&:hover": {
                                    backgroundColor: "#2a3c82",
                                  },
                                  fontSize: "12px",
                                  fontWeight: "bold",
                                  px: 2,
                                  py: 0.5,
                                  borderRadius: 1,
                                  textTransform: "none",
                                  marginLeft: "auto", // This will push the button to the right
                                  display: "block", // Ensure it behaves as a block element
                                }}
                                onClick={() => handleViewDocument(doc)}
                              >
                                View
                              </Button>
                            </Box>
                          </Box>
                        </Paper>
                      );
                    })}
                  </Stack>
                )}
              </Box>
            </Box>
          </Box>
        </motion.div>
      )}

      {/* Document Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={handleClosePreview}
        fullWidth
        maxWidth="lg" // Changed from "md" to "lg" for larger size
        sx={{
          "& .MuiDialog-paper": {
            height: "90vh", // Increased from 80vh to 90vh
            maxWidth: "1200px", // Added maxWidth for even larger dialog
            width: "95vw", // Added width for better control
          },
        }}
      >
        <DialogTitle>
          Document Preview
          <IconButton
            aria-label="close"
            onClick={handleClosePreview}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedDoc ? (
            <FileViewer document={selectedDoc} />
          ) : (
            <Typography variant="body2" color="textSecondary">
              No document selected for preview.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePreview} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <style>{`
        @keyframes typing-bounce {
          0% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
          100% { transform: translateY(0); }
        }
      `}</style>
    </>
  );
};

export default ChatWidget;