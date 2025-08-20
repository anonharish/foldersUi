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



const dummyBotResponse = {
  answer: "Here is a dummy response with table and suggestions.",
  table_title: "Sample Data",
  table_data: [
    { Name: "Alice", Age: 25, Role: "Engineer" },
    { Name: "Bob", Age: 30, Role: "Designer" },
  ],
  followupQuestions: ["Show me more data", "What is Alice’s role?", "Give me charts"],
  dashboard: [] // you can keep empty for now
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
                <TableCell key={column} sx={{ fontWeight: 600, color: "#0d47a1" }}>
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
        text: dummyBotResponse.answer,
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
          <Box sx={{ width: "100vw", height: "100vh", bgcolor: "white", display: "flex", flexDirection: "column" }}>
            {/* Header */}
            <Box sx={{ display: "flex", alignItems: "center", px: 2, py: 1, background: "#3b54b0", color: "white" }}>
              <Avatar sx={{ bgcolor: "#ea641f", width: 40, height: 40 }}>
                <SmartToy />
              </Avatar>
              <Typography variant="subtitle1" fontWeight={600} ml={2}>
                AI Assistant
              </Typography>
              <Box ml="auto">
                <IconButton size="small" onClick={handleClose} sx={{ color: "white" }}>
                  <Close />
                </IconButton>
              </Box>
            </Box>

            {/* Messages */}
            <Box sx={{ flex: 1, overflowY: "auto", p: 2, bgcolor: "#f9fafb" }}>
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
                                  m.id === msg.id ? { ...m, isTypingComplete: true } : m
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

                      {/* show table after typing */}
                      {!msg.isUser && msg.isTypingComplete && msg.tableData && (
                        renderTable(msg.tableData, msg.tableTitle)
                      )}
                    </Box>
                  </Box>
                ))}

                {isTyping && (
                  <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                    <Avatar sx={{ bgcolor: "#3b54b0", mr: 1 }}>
                      <img src={chatBot} alt="bot" width={20} />
                    </Avatar>
                    <TypingIndicator />
                  </Box>
                )}

                <div ref={messagesEndRef} />
              </Stack>
            </Box>

            {/* Suggestions */}
            <Box sx={{ p: 1, display: "flex", gap: 1, flexWrap: "wrap" }}>
              {messages.length > 0 &&
                messages[messages.length - 1].followupQuestions?.map((s, i) => (
                  <Button
                    key={i}
                    size="small"
                    variant="outlined"
                    onClick={() => handleSuggestionClick(s)}
                  >
                    {s}
                  </Button>
                ))}
            </Box>

            {/* Input */}
            <Box sx={{ display: "flex", p: 2, borderTop: "1px solid #ccc", bgcolor: "white" }}>
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
