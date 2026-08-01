export default function ShortcutsModal({ show, onClose }) {
  if (!show) return null;

  const shortcuts = [
    { key: "Space", desc: "Play / Pause playback" },
    { key: "S", desc: "Split clip at current playhead position" },
    { key: "Delete / Backspace", desc: "Delete selected clip" },
    { key: "Ctrl + Z", desc: "Undo last action" },
    { key: "Ctrl + Y / Shift+Z", desc: "Redo action" },
    { key: "Ctrl + S", desc: "Save project" },
    { key: "Arrow Left / Right", desc: "Seek playhead by 5 seconds (Hold Shift for 1 frame)" },
    { key: "Home", desc: "Jump to start of timeline (00:00)" },
    { key: "End", desc: "Jump to end of timeline" },
    { key: "I", desc: "Set In point at playhead" },
    { key: "O", desc: "Set Out point at playhead" },
    { key: "M", desc: "Add marker at playhead" },
    { key: "Shift + F", desc: "Zoom to fit all clips" },
    { key: "C", desc: "Switch to Cut tool" },
    { key: "V", desc: "Switch to Select tool" },
    { key: "T", desc: "Switch to Trim tool" },
    { key: "?", desc: "Toggle this Keyboard Shortcuts modal" },
  ];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(12px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        animation: "fadeIn 0.2s ease-out",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "560px",
          maxWidth: "92vw",
          maxHeight: "85vh",
          background: "rgba(18, 14, 18, 0.95)",
          border: "1px solid rgba(225, 73, 109, 0.25)",
          borderRadius: "20px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.8), 0 0 40px rgba(225,73,109,0.15)",
          padding: "28px",
          display: "flex",
          flexDirection: "column",
          color: "#e5e5e5",
          fontFamily: "'Instrument Sans', sans-serif",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "24px" }}>⌨️</span>
            <div>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "20px", fontWeight: 800, color: "#fff", margin: 0, letterSpacing: "-0.02em" }}>
                Keyboard Shortcuts
              </h2>
              <p style={{ fontSize: "12px", color: "#8c8780", margin: "2px 0 0" }}>
                Master CinéCut with rapid keyboard hotkeys
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(225, 73, 109, 0.1)",
              border: "1px solid rgba(225, 73, 109, 0.2)",
              color: "#e1496d",
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              cursor: "pointer",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.18s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(225, 73, 109, 0.25)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(225, 73, 109, 0.1)"; }}
          >
            ✕
          </button>
        </div>

        {/* Shortcuts grid */}
        <div style={{ flex: 1, overflowY: "auto", paddingRight: "6px", display: "grid", gridTemplateColumns: "1fr", gap: "8px" }}>
          {shortcuts.map((sc) => (
            <div
              key={sc.key}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 14px",
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(225, 73, 109, 0.08)",
                borderRadius: "10px",
              }}
            >
              <span style={{ fontSize: "13px", color: "#c5c0b8" }}>{sc.desc}</span>
              <kbd
                style={{
                  background: "linear-gradient(135deg, rgba(225,73,109,0.18), rgba(148,41,69,0.25))",
                  border: "1px solid rgba(225, 73, 109, 0.35)",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                  color: "#ff8da7",
                  padding: "4px 10px",
                  borderRadius: "6px",
                  fontSize: "11px",
                  fontFamily: "'Poppins', monospace",
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
        <div style={{ marginTop: "20px", paddingTop: "14px", borderTop: "1px solid rgba(225, 73, 109, 0.12)", textAlign: "center" }}>
          <span style={{ fontSize: "11px", color: "#5c5650" }}>
            Press <kbd style={{ color: "#e1496d", background: "none", border: "none" }}>Esc</kbd> or click outside to dismiss
          </span>
        </div>
      </div>
    </div>
  );
}
