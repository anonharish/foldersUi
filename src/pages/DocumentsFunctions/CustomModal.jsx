import React from "react";
import { Modal, Button } from "react-bootstrap";

export default function CustomModal({
  show,
  title,
  bodyContent,
  onClose,
  onConfirm,
  confirmLabel = "OK",
  cancelLabel = "Cancel",
}) {
  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      dialogClassName="custom-modal"
      style={{ borderRadius: "12px" }}
    >
      {/* Header */}
      <Modal.Header style={{ borderBottom: "none", padding: "1rem 1.5rem" }}>
        <Modal.Title style={{ fontWeight: "500", fontSize: "1.25rem" }}>
          {title}
        </Modal.Title>
      </Modal.Header>

      {/* Body */}
      <Modal.Body style={{ padding: "1rem 1.5rem" }}>
        {bodyContent}
      </Modal.Body>

      {/* Footer */}
      <Modal.Footer style={{ borderTop: "none", padding: "0.75rem 1.5rem" }}>
        <Button
          variant="light"
          onClick={onClose}
          style={{
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontWeight: "500",
            padding: "0.5rem 1rem",
          }}
        >
          {cancelLabel}
        </Button>
        <Button
          variant="primary"
          onClick={onConfirm}
          style={{
            borderRadius: "8px",
            padding: "0.5rem 1rem",
            fontWeight: "500",
          }}
        >
          {confirmLabel}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
