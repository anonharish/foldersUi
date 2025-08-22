import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

  export default function DeleteDialog({ open, onClose, onConfirm, selectedItems }) {
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Delete Confirmation</DialogTitle>
        <DialogContent>
          Are you sure you want to delete <b>{selectedItems.length}</b> item(s)?
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button color="error" onClick={onConfirm}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    );
  }