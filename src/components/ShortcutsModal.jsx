import React from "react";
import { Keyboard, X, Command } from "lucide-react";

export default function ShortcutsModal({ show, onClose }) {
  if (!show) return null;

  const shortcuts = [
    { key: "Space", desc: "Play / Pause video preview" },
    { key: "S", desc: "Split clip at current playhead" },
    { key: "Delete / Backspace", desc: "Delete selected clip" },
    { key: "Ctrl + Z", desc: "Undo last action" },
    { key: "Ctrl + Y / Shift+Z", desc: "Redo action" },
    { key: "Ctrl + S", desc: "Save project locally & cloud" },
    { key: "Arrow Left / Right", desc: "Seek playhead by 5s (Hold Shift for 1 frame)" },
    { key: "Home / End", desc: "Jump to beginning or end of timeline" },
    { key: "I", desc: "Set In-Point marker" },
    { key: "O", desc: "Set Out-Point marker" },
    { key: "M", desc: "Add timestamp marker" },
    { key: "Shift + F", desc: "Zoom to fit all timeline clips" },
    { key: "V / C / T", desc: "Switch between Select / Cut / Trim tools" },
    { key: "R", desc: "Toggle Screen & Camera PIP recorder" },
    { key: "?", desc: "Toggle this Shortcuts modal" },
  ];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15, 23, 42, 0.45)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "560px",
          maxWidth: "92vw",
          maxHeight: "85vh",
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "18px",
          boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.05)",
          padding: "24px 28px",
          display: "flex",
          flexDirection: "column",
          color: "#0f172a",
          fontFamily: "'Instrument Sans', sans-serif",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#e0e7ff", color: "#4f46e5", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Keyboard size={20} />
            </div>
            <div>
              <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: "17px", fontWeight: 700, color: "#0f172a", margin: 0, letterSpacing: "-0.01em" }}>
                Keyboard Shortcuts
              </h2>
              <p style={{ fontSize: "12px", color: "#64748b", margin: "2px 0 0" }}>
                Developer hotkeys for rapid timeline editing
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "#f1f5f9",
              border: "1px solid #e2e8f0",
              color: "#64748b",
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#e2e8f0"; e.currentTarget.style.color = "#0f172a"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#f1f5f9"; e.currentTarget.style.color = "#64748b"; }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Shortcuts grid */}
        <div style={{ flex: 1, overflowY: "auto", paddingRight: "4px", display: "grid", gridTemplateColumns: "1fr", gap: "6px" }}>
          {shortcuts.map((sc) => (
            <div
              key={sc.key}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 12px",
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
              }}
            >
              <span style={{ fontSize: "13px", color: "#334155", fontWeight: 500 }}>{sc.desc}</span>
              <kbd
                style={{
                  background: "#ffffff",
                  border: "1px solid #cbd5e1",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                  color: "#4f46e5",
                  padding: "3px 8px",
                  borderRadius: "6px",
                  fontSize: "11.5px",
                  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                }}
              >
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ marginTop: "16px", paddingTop: "12px", borderTop: "1px solid #f1f5f9", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
          <Command size={13} color="#94a3b8" />
          <span style={{ fontSize: "11.5px", color: "#94a3b8" }}>
            Press <kbd style={{ color: "#4f46e5", background: "#eef2ff", padding: "1px 5px", borderRadius: "4px", border: "1px solid #c7d2fe", fontWeight: 600 }}>Esc</kbd> or click outside to close
          </span>
        </div>
      </div>
    </div>
  );
}

