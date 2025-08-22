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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip
} from "@mui/material";
import { Close, Send, SmartToy ,  Description, // PDF
  Article, // Word documents
  TableChart, // Excel
  Subject, // Text files
  Image, // Images
  Folder,
  SupportAgent
 } from "@mui/icons-material";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import chatBot from "../../assets/chatbot.png";
import FloatingChatIcon from "./FloatChatBot";
import { sampleResponse } from "../incidents/sampleAiSearchResponse";
import FileViewer from "./FileViewer";
import { Bot } from "lucide-react";

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
    "Give me Summary of ProjectPlan.pdf file",
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

// Render table
const renderTable = (tableData, tableTitle) => {
  if (!tableData || tableData.length === 0) return null;
  const columns = Object.keys(tableData[0]);
  return (
    <Box sx={{ mt: 2, mb: 1 }}>
      {tableTitle && (
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          {tableTitle}
        </Typography>
      )}
      <TableContainer component={Paper} sx={{ boxShadow: 1, borderRadius: 1 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: "#e3f2fd" }}>
              {columns.map((column) => (
                <TableCell
                  key={column}
                  sx={{ fontWeight: 600, color: "#0d47a1" }}
                >
                  {column}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((row, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <TableCell key={column}>{row[column]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
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
  };

  const handleSendMessage = (text = null) => {
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
    const resultCount = sampleResponse.top_results.length;
    // simulate bot reply after 1s
    setTimeout(() => {
      const botMsg = {
        id: (Date.now() + 1).toString(),
        text: `I found ${resultCount} document${
                  resultCount === 1 ? "" : "s"
                } that might be relevant to your query.`,
        results: sampleResponse.top_results,
        isUser: false,
        tableData: dummyBotResponse.table_data,
        tableTitle: dummyBotResponse.table_title,
        followupQuestions: dummyBotResponse.followupQuestions,
        isTypingComplete: false,
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 1000);
  };

  const handleSuggestionClick = (text) => {
    if (!text || isTyping) return;
    setInputValue(text);
    handleSendMessage(text);
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
                <SupportAgent />
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

                          {/* documents */}
                          {!msg.isUser &&
                            msg.isTypingComplete &&
                            msg.results && (
                              <Box sx={{ mt: 1 }}>
                                {msg.results.map((doc, i) => {
                                  // Get file extension
                                  const fileExtension = doc.fileName
                                    .split(".")
                                    .pop()
                                    .toLowerCase();
                                  return (
                                    <Paper
                                      key={i}
                                      sx={{
                                        p: 1.5,
                                        mb: 1.5,
                                        border: "1px solid #e0e0e0",
                                        borderRadius: 2,
                                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                                        transition: "all 0.2s ease",
                                        "&:hover": {
                                          boxShadow:
                                            "0 4px 12px rgba(0,0,0,0.12)",
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
                                              mb: 0.5,
                                            }}
                                          >
                                            <Typography
                                              variant="body2"
                                              fontWeight={600}
                                              sx={{ mr: 1 }}
                                            >
                                              {doc.fileName}
                                            </Typography>
                                            <Box
                                              sx={{
                                                backgroundColor: `${getFileColor(fileExtension)}15`, // 15 = ~10% opacity
                                                color: getFileColor(fileExtension),
                                                fontSize: "10px",
                                                fontWeight: "bold",
                                                px: 1,
                                                py: 0.5,
                                                borderRadius: 1,
                                                textTransform: "uppercase",
                                              }}
                                            >
                                              {fileExtension}
                                            </Box>
                                          </Box>

                                          <Typography
                                            variant="caption"
                                            color="text.secondary"
                                            sx={{
                                              lineHeight: 1.4,
                                              display: "block",
                                            }}
                                          >
                                            {doc.content.slice(0, 120)}...
                                          </Typography>

                                          <Button
                                            variant="contained"
                                            size="small"
                                            sx={{
                                              mt: 1.5,
                                              backgroundColor: "#3b54b0", // Use your primary color instead of file-specific color
                                              "&:hover": {
                                                backgroundColor: "#2a3c82", // Darker shade for hover
                                                opacity: 0.9,
                                                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                                              },
                                              fontSize: "12px",
                                              fontWeight: "bold",
                                              px: 2,
                                              py: 0.5,
                                              borderRadius: 1,
                                              textTransform: "none",
                                            }}
                                            onClick={() => setSelectedDoc(doc)}
                                          >
                                            View Document
                                          </Button>
                                        </Box>
                                      </Box>
                                    </Paper>
                                  );
                                })}
                              </Box>
                            )}

                          {/* table */}
                          {/* {!msg.isUser &&
                            msg.isTypingComplete &&
                            msg.tableData &&
                            renderTable(msg.tableData, msg.tableTitle)} */}
                        </Box>
                      </Box>
                    ))}

                    {isTyping && (
                      <Box
                        sx={{ display: "flex", justifyContent: "flex-start" }}
                      >
                        <Avatar sx={{ bgcolor: "#3b54b0", mr: 1 }}>
                         <Bot/>
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
                              fontSize: '0.8rem',
                              fontWeight: '500',
                              height: '24px',
                              borderRadius: '12px',
                              color: '#3b54b0',
                              borderColor: '#3b54b040',
                              '&:hover': {
                                backgroundColor: '#3b54b010',
                              }
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
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim()}
                    sx={{
                      ml: 1,
                      bgcolor: "#3b54b0",
                      "&:hover": {
                        bgcolor: "#2a3c82",
                      }
                    }}
                  >
                    <Send sx={{ fontSize: 20 }} />
                  </IconButton>
                </Box>
              </Box>

              {/* Right side: File Preview */}
              <Box
                sx={{
                  flex: 1,
                  borderLeft: "1px solid #ddd",
                  p: 2,
                  height: "90vh",
                  overflow: "auto",
                }}
              >
                {selectedDoc ? (
                  <FileViewer document={selectedDoc} />
                ) : (
                    <Box
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        p: 3,
                        textAlign: "center",
                        background: "linear-gradient(135deg, #f9fafb 0%, #f0f4ff 100%)",
                        borderRadius: 1,
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

                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: "#2d3a80" }}>
                        Document Preview Area
                      </Typography>

                      <Typography variant="body2" sx={{ mb: 2, color: "text.secondary", maxWidth: 280 }}>
                        Select any document from the conversation to view its detailed content here
                      </Typography>
                    </Box>
                )}
              </Box>
            </Box>
          </Box>
        </motion.div>
      )}

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
