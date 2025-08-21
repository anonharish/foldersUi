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
} from "@mui/material";
import { Close, Send, SmartToy } from "@mui/icons-material";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import chatBot from "../../assets/chatbot.png";
import FloatingChatIcon from "./FloatChatBot";
import { sampleResponse } from "../incidents/sampleAiSearchResponse";

const dummyBotResponse = {
  answer: "Here is a dummy response with table and suggestions.",
  table_title: "Sample Data",
  table_data: [
    { Name: "Alice", Age: 25, Role: "Engineer" },
    { Name: "Bob", Age: 30, Role: "Designer" },
  ],
  followupQuestions: [
    "Show me more data",
    "What is Alice’s role?",
    "Give me charts",
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
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMsg = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      isTypingComplete: true,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    // simulate bot reply after 1s
    setTimeout(() => {
      const botMsg = {
        id: (Date.now() + 1).toString(),
        text: `I found ${sampleResponse.top_results.length} documents.`,
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
    handleSendMessage();
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
                <SmartToy />
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
                  flex: 1.5,
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
                            maxWidth: "50%",
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
                                {msg.results.map((doc, i) => (
                                  <Paper
                                    key={i}
                                    sx={{
                                      p: 1,
                                      mb: 1,
                                      border: "1px solid #ddd",
                                      borderRadius: 1,
                                    }}
                                  >
                                    <Typography
                                      variant="body2"
                                      fontWeight={600}
                                    >
                                      {doc.fileName}
                                    </Typography>
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                    >
                                      {doc.content.slice(0, 100)}...
                                    </Typography>
                                    <Button
                                      size="small"
                                      sx={{ mt: 1 }}
                                      onClick={() => setSelectedDoc(doc)}
                                    >
                                      View
                                    </Button>
                                  </Paper>
                                ))}
                              </Box>
                            )}

                          {/* table */}
                          {!msg.isUser &&
                            msg.isTypingComplete &&
                            msg.tableData &&
                            renderTable(msg.tableData, msg.tableTitle)}
                        </Box>
                      </Box>
                    ))}

                    {isTyping && (
                      <Box
                        sx={{ display: "flex", justifyContent: "flex-start" }}
                      >
                        <Avatar sx={{ bgcolor: "#3b54b0", mr: 1 }}>
                          <img src={chatBot} alt="bot" width={20} />
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
                          <Button
                            key={i}
                            size="small"
                            variant="outlined"
                            onClick={() => handleSuggestionClick(s)}
                          >
                            {s}
                          </Button>
                        )
                      )}
                    </Box>
                  )}

                {/* Input (always fixed at very bottom) */}
                <Box
                  sx={{
                    display: "flex",
                    p: 2,
                    borderTop: "1px solid #ccc",
                    bgcolor: "white",
                  }}
                >
                  <TextField
                    fullWidth
                    placeholder="Type your message..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                  <Button
                    variant="contained"
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim()}
                    sx={{ ml: 1, bgcolor: "#3b54b0" }}
                  >
                    <Send />
                  </Button>
                </Box>
              </Box>

              {/* Right side: Preview */}
              <Box sx={{ flex: 1, borderLeft: "1px solid #ddd", p: 2 }}>
                {selectedDoc ? (
                  <>
                    <Typography fontWeight={600}>
                      {selectedDoc.fileName}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {selectedDoc.content}
                    </Typography>
                  </>
                ) : (
                  <Typography variant="caption" color="text.secondary">
                    Select a document to preview
                  </Typography>
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
