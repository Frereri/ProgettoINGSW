import React from "react";

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999
};

const modalStyle = {
  background: "#fff",
  padding: "20px",
  borderRadius: "8px",
  width: "320px",
  textAlign: "center",
  boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
};

const buttonRow = {
  marginTop: "20px",
  display: "flex",
  justifyContent: "space-between"
};

const btn = {
  padding: "8px 14px",
  borderRadius: "6px",
  border: "none",
  cursor: "pointer",
  fontWeight: "bold"
};

export default function ConfirmModal({ open, message, onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <p>{message}</p>

        <div style={buttonRow}>
          <button
            style={{ ...btn, background: "#e74c3c", color: "#fff" }}
            onClick={onConfirm}
          >
            Elimina
          </button>

          <button
            style={{ ...btn, background: "#bdc3c7" }}
            onClick={onCancel}
          >
            Annulla
          </button>
        </div>
      </div>
    </div>
  );
}
