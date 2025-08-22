import { Close, FolderOpen } from "@mui/icons-material";
import { Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, IconButton, Slide, TextField, Typography } from "@mui/material";
import React from "react";
import { useState } from "react";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

  export default function MoveDialog({ open, onClose, onConfirm, folders }) {
    const [selectedTarget, setSelectedTarget] = useState(null);

    return (
      <Dialog
        open={open}
        onClose={onClose}
        TransitionComponent={Transition}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            boxShadow: "0px 6px 20px rgba(0,0,0,0.15)",
            width: 400,
          },
        }}
      >
        {/* Custom Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)", // ✅ use background
            color: "white",
            p: 2,
            borderTopLeftRadius: "16px",
            borderTopRightRadius: "16px",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <FolderOpen />
            <Typography variant="h6">Move File(s)</Typography>
          </Box>
          <IconButton onClick={onClose} sx={{ color: "white" }}>
            <Close />
          </IconButton>
        </Box>

        {/* Body */}
        <DialogContent sx={{ mt: 2 }}>
          <Typography variant="body2" sx={{ mb: 1, color: "text.secondary" }}>
            Select a target folder where you want to move the files:
          </Typography>
          <Autocomplete
            options={folders}
            getOptionLabel={(option) => option.name}
            onChange={(e, newValue) => setSelectedTarget(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Choose folder"
                variant="outlined"
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                  },
                }}
              />
            )}
          />
        </DialogContent>

        {/* Actions */}
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{ borderRadius: "10px" }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => selectedTarget && onConfirm(selectedTarget)}
            disabled={!selectedTarget}
            variant="contained"
            sx={{
              borderRadius: "10px",
              bgcolor: "#2575fc",
              "&:hover": { bgcolor: "#1a5dcc" },
            }}
          >
            Move
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

