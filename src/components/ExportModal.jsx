import React from "react";
import { Download, CheckCircle2, Loader2, Video, X } from "lucide-react";

export default function ExportModal({ show, progress, downloadUrl, fileName, onClose }) {
  if (!show) return null;

  const isDone = progress === 100;

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.5)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
      <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "32px 36px", minWidth: 420, maxWidth: 480, boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.25)" }}>
        
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: isDone ? "#ecfdf5" : "#eef2ff", color: isDone ? "#059669" : "#4f46e5", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {isDone ? <CheckCircle2 size={22} /> : <Video size={22} />}
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "'Poppins', sans-serif", color: "#0f172a" }}>
                {isDone ? "Export Complete!" : "Rendering Video..."}
              </div>
              <div style={{ fontSize: 13, color: "#64748b" }}>
                {isDone ? "Your developer product video is ready for download." : "Synthesizing code, tracks & audio channels"}
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "50%", width: 28, height: 28, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" }}>
            <X size={14} />
          </button>
        </div>

        {/* Progress Bar */}
        <div style={{ background: "#f1f5f9", borderRadius: 8, height: 10, overflow: "hidden", marginTop: 20, marginBottom: 10, border: "1px solid #e2e8f0" }}>
          <div style={{ height: "100%", background: isDone ? "linear-gradient(90deg,#10b981,#059669)" : "linear-gradient(90deg,#4f46e5,#6366f1)", borderRadius: 8, width: `${progress ?? 0}%`, transition: "width 0.2s ease" }} />
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24, fontSize: 12, fontWeight: 600 }}>
          <span style={{ color: isDone ? "#059669" : "#4f46e5", display: "flex", alignItems: "center", gap: 4 }}>
            {!isDone && <Loader2 size={13} className="animate-spin" />}
            {isDone ? "Ready to Save" : `${Math.round(progress ?? 0)}% completed`}
          </span>
          <span style={{ color: "#64748b" }}>
            {isDone ? "WebM Video (HD 60fps)" : "Encoding Frames"}
          </span>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          {isDone && downloadUrl && (
            <a 
              href={downloadUrl} 
              download={fileName || "creatify-product-video.webm"} 
              style={{ flex: 2, justifyContent: "center", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, background: "#4f46e5", color: "#ffffff", padding: "10px 16px", borderRadius: 8, fontWeight: 600, fontSize: 13, boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3)" }}
            >
              <Download size={16} /> Download Video
            </a>
          )}
          <button 
            style={{ flex: 1, justifyContent: "center", background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: 8, color: "#334155", fontWeight: 600, fontSize: 13, cursor: "pointer", padding: "10px 16px" }} 
            onClick={onClose}
          >
            {isDone ? "Done" : "Cancel"}
          </button>
        </div>
      </div>
    </div>
  );
}

