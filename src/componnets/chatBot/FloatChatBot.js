import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { IconButton } from "@mui/material";
import chatBot from "../../assets/chatbot.png";
import { Bot } from "lucide-react";

const FloatingChatIcon = ({ onClick }) => {
  const pointerDownPos = useRef({ x: 0, y: 0 });

  const [showHint, setShowHint] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handlePointerDown = (e) => {
    pointerDownPos.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e) => {
    const dx = Math.abs(e.clientX - pointerDownPos.current.x);
    const dy = Math.abs(e.clientY - pointerDownPos.current.y);
    const moved = dx > 5 || dy > 5;
    if (!moved) onClick();
  };

    setTimeout(() => {
      setShowHint(true);
      setTimeout(() => {
        setShowHint(false);
      }, 10000);
    }, 30000);
  

  return (
    <motion.div
      drag
      dragElastic={0.2}
      dragMomentum={false}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      style={{
        position: "fixed",
        bottom: 24,
        left: 8,
        zIndex: 2000,
        cursor: "grab",
        touchAction: "none",
      }}
    >
      {(showHint || hovered) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            backgroundColor: "#fff",
            color: "#3b54b0",
            padding: "6px 12px",
            borderRadius: "20px",
            fontSize: "14px",
            position: "absolute",
            left: 80,
            top: "50%",
            transform: "translateY(-50%)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            whiteSpace: "nowrap",
            zIndex: 10,
          }}
        >
          Need help? I’m here!
        </motion.div>
      )}

      <IconButton
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        sx={{
          width: 62,
          height: 62,
          borderRadius: "50%",
          backgroundColor: "#3b54b0",
          color: "white",
          boxShadow: showHint
            ? "0 0 0 6px rgba(59, 84, 176, 0.3)"
            : "0 4px 12px rgba(0,0,0,0.2)",
          transition: "all 0.3s ease-in-out",
          "&:hover": {
            backgroundColor: "#32469c",
            transform: "scale(1.05)",
          },
        }}
      >
                                <Bot size={32}/>
       
      </IconButton>
    </motion.div>
  );
};

export default FloatingChatIcon;
