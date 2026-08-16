import React, { useState, useRef } from "react";
import {
  ShieldCheck, Lock, FolderOpen, Search, Plus, Sparkles, Video, Image as ImageIcon,
  Presentation, Cpu, Box, Palette, FileText, Layout, Trash2, ExternalLink,
  ChevronLeft, ChevronRight, Copy, HardDrive, Eye, RefreshCw, Key, Database, Download,
  Play, Layers, BarChart3, Move, Compass, Sliders, Heart, MessageCircle, Share2, Music2
} from "lucide-react";
import MindMapGraph from "./MindMapGraph";

import videoPreviewImg from "../assets/images/video_preview.png";
import logoPreviewImg from "../assets/images/logo_preview.png";
import pptPreviewImg from "../assets/images/ppt_preview.png";
import socialPreviewImg from "../assets/images/social_preview.png";
import imagePreviewImg from "../assets/images/image_preview.png";
import docPreviewImg from "../assets/images/doc_preview.png";
import whiteboardPreviewImg from "../assets/images/whiteboard_preview.png";
import aiPreviewImg from "../assets/images/ai_preview.png";

// ── RICH PHOTOREALISTIC & INTERACTIVE PROJECT COVER ────────────────────────
function InteractiveProjectCover({ work, isDark, strokeColor }) {
  const [isHovered, setIsHovered] = useState(false);

  const toolStr = (work.tool || work.category || "").toLowerCase();
  const title = work.title || "Untitled Project";

  // Initials for Monogram
  const initials = title
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("") || "CR";

  // Pick contextual photographic background & metadata
  let bgImage = work.thumbnail || work.image || null;
  let toolType = "default";

  if (toolStr.includes("video")) {
    toolType = "video";
    if (!bgImage) bgImage = videoPreviewImg;
  } else if (toolStr.includes("logo") || toolStr.includes("brand")) {
    toolType = "logo";
    if (!bgImage) bgImage = logoPreviewImg;
  } else if (toolStr.includes("presentation") || toolStr.includes("slide") || toolStr.includes("pitch")) {
    toolType = "presentation";
    if (!bgImage) bgImage = pptPreviewImg;
  } else if (toolStr.includes("social") || toolStr.includes("campaign") || toolStr.includes("post") || toolStr.includes("reel")) {
    toolType = "social";
    if (!bgImage) bgImage = socialPreviewImg;
  } else if (toolStr.includes("image") || toolStr.includes("photo") || toolStr.includes("design")) {
    toolType = "image";
    if (!bgImage) bgImage = imagePreviewImg;
  } else if (toolStr.includes("doc") || toolStr.includes("article") || toolStr.includes("note")) {
    toolType = "document";
    if (!bgImage) bgImage = docPreviewImg;
  } else if (toolStr.includes("whiteboard") || toolStr.includes("canvas") || toolStr.includes("mindmap")) {
    toolType = "whiteboard";
    if (!bgImage) bgImage = whiteboardPreviewImg;
  } else if (toolStr.includes("pipeline") || toolStr.includes("node") || toolStr.includes("ai")) {
    toolType = "pipeline";
    if (!bgImage) bgImage = aiPreviewImg;
  } else {
    toolType = "default";
    if (!bgImage) bgImage = imagePreviewImg;
  }

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0c0209",
      }}
    >
      {/* 1. High-Resolution Photographic/Visual Backdrop */}
      {bgImage && (
        <img
          src={bgImage}
          alt={title}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: isHovered ? "scale(1.08)" : "scale(1)",
            filter: isDark ? "brightness(0.85) contrast(1.05)" : "brightness(0.95)",
            transition: "transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), filter 0.3s ease",
          }}
        />
      )}

      {/* 2. Cinematic Gradient Glass Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: isHovered
            ? "linear-gradient(180deg, rgba(15, 3, 12, 0.35) 0%, rgba(15, 3, 12, 0.85) 100%)"
            : "linear-gradient(180deg, rgba(15, 3, 12, 0.2) 0%, rgba(15, 3, 12, 0.7) 100%)",
          transition: "all 0.3s ease",
        }}
      />

      {/* 3. Tool-Specific Interactive Glass HUD Elements */}
      
      {/* ── VIDEO EDITOR HUD ── */}
      {toolType === "video" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            padding: "12px 14px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            zIndex: 2,
            boxSizing: "border-box",
          }}
        >
          {/* Top Status - Left Aligned to avoid right SEALED badge */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "3px 9px", borderRadius: 99, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.15)" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#ef4444", boxShadow: "0 0 6px #ef4444" }} />
              <span style={{ fontSize: 9, fontFamily: "monospace", color: "#fff", fontWeight: 700 }}>
                4K 60FPS • 00:01:24
              </span>
            </div>
          </div>

          {/* Center Hover Play Icon */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #e1496d, #942945)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                boxShadow: isHovered ? "0 8px 24px rgba(225,73,109,0.7)" : "0 4px 14px rgba(0,0,0,0.4)",
                transform: isHovered ? "scale(1.15)" : "scale(1)",
                transition: "all 0.25s ease",
              }}
            >
              <Play size={16} fill="#fff" style={{ marginLeft: 2 }} />
            </div>
          </div>

          {/* Multi-Track Mini Timeline & Audio VU Wave */}
          <div>
            <div style={{ height: 5, borderRadius: 2, background: "rgba(255,255,255,0.15)", marginBottom: 4, position: "relative", overflow: "hidden" }}>
              <div style={{ width: "70%", height: "100%", background: "linear-gradient(90deg, #e1496d, #f43f5e)", borderRadius: 2 }} />
              <div style={{ position: "absolute", top: 0, bottom: 0, width: 2, background: "#ffffff", left: isHovered ? "78%" : "42%", transition: "left 0.8s ease" }} />
            </div>
            <div style={{ display: "flex", gap: 2, height: 6 }}>
              {[4, 7, 5, 9, 6, 8, 10, 6, 8, 11, 7, 5, 8, 10, 6, 9].map((h, i) => (
                <div key={i} style={{ flex: 1, height: isHovered ? `${Math.min(8, h * 1.1)}px` : `${h * 0.8}px`, background: "#38bdf8", borderRadius: 1, transition: "height 0.2s ease" }} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── VIDEO EDITOR HUD ── */}
      {toolType === "video" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            padding: "12px 14px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            zIndex: 2,
            boxSizing: "border-box",
          }}
        >
          {/* Top Status - Left Aligned */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "3px 9px", borderRadius: 99, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.15)" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#ef4444", boxShadow: "0 0 6px #ef4444" }} />
              <span style={{ fontSize: 9, fontFamily: "monospace", color: "#fff", fontWeight: 700 }}>
                4K 60FPS • 00:01:24
              </span>
            </div>
          </div>

          {/* Center Hover Play Icon */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #e1496d, #942945)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                boxShadow: isHovered ? "0 8px 24px rgba(225,73,109,0.7)" : "0 4px 14px rgba(0,0,0,0.4)",
                transform: isHovered ? "scale(1.15)" : "scale(1)",
                transition: "all 0.25s ease",
              }}
            >
              <Play size={15} fill="#fff" style={{ marginLeft: 2 }} />
            </div>
          </div>

          {/* Multi-Track Mini Timeline & Audio VU Wave */}
          <div>
            <div style={{ height: 4, borderRadius: 2, background: "rgba(255,255,255,0.15)", marginBottom: 4, position: "relative", overflow: "hidden" }}>
              <div style={{ width: "70%", height: "100%", background: "linear-gradient(90deg, #e1496d, #f43f5e)", borderRadius: 2 }} />
              <div style={{ position: "absolute", top: 0, bottom: 0, width: 2, background: "#ffffff", left: isHovered ? "78%" : "42%", transition: "left 0.8s ease" }} />
            </div>
            <div style={{ display: "flex", gap: 2, height: 6 }}>
              {[4, 7, 5, 9, 6, 8, 10, 6, 8, 11, 7, 5, 8, 10, 6, 9].map((h, i) => (
                <div key={i} style={{ flex: 1, height: isHovered ? `${Math.min(8, h * 1.1)}px` : `${h * 0.8}px`, background: "#38bdf8", borderRadius: 1, transition: "height 0.2s ease" }} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── LOGO & BRAND IDENTITY HUD ── */}
      {toolType === "logo" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            padding: "12px 14px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            zIndex: 2,
            boxSizing: "border-box",
          }}
        >
          {/* Top Left Badge */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 9px", borderRadius: 99, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.15)" }}>
              <Palette size={10} color="#10b981" />
              <span style={{ fontSize: 9, fontFamily: "monospace", color: "#fff", fontWeight: 700 }}>
                VECTOR IDENTITY • SVG
              </span>
            </div>
          </div>

          {/* Center Hover Action */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 14px",
                borderRadius: 99,
                background: isHovered ? "linear-gradient(135deg, #e1496d, #942945)" : "rgba(0,0,0,0.6)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.25)",
                color: "#ffffff",
                fontSize: 11,
                fontWeight: 700,
                fontFamily: "Syne, sans-serif",
                opacity: isHovered ? 1 : 0,
                transform: isHovered ? "scale(1.05)" : "scale(0.95)",
                transition: "all 0.25s ease",
              }}
            >
              <Eye size={12} />
              <span>Inspect Vector Kit</span>
            </div>
          </div>

          {/* Bottom Swatch Pills */}
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            {["#e1496d", "#38bdf8", "#f59e0b", "#10b981", "#ffffff"].map((c, i) => (
              <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: c, border: "1px solid rgba(0,0,0,0.4)", boxShadow: `0 0 5px ${c}80` }} />
            ))}
          </div>
        </div>
      )}

      {/* ── SLIDE STUDIO & PRESENTATIONS HUD ── */}
      {toolType === "presentation" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            padding: "12px 14px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            zIndex: 2,
            boxSizing: "border-box",
          }}
        >
          {/* Top Left Info */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "3px 9px", borderRadius: 99, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.15)" }}>
              <Presentation size={10} color="#c084fc" />
              <span style={{ fontSize: 9, fontFamily: "monospace", color: "#fff", fontWeight: 700 }}>
                KEYNOTE 16:9 • 6 SLIDES
              </span>
            </div>
          </div>

          {/* Center Presentation Play Badge */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                padding: "6px 14px",
                borderRadius: 99,
                background: isHovered ? "linear-gradient(135deg, #e1496d, #942945)" : "rgba(0,0,0,0.65)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.25)",
                color: "#ffffff",
                fontSize: 11,
                fontWeight: 700,
                fontFamily: "Syne, sans-serif",
                boxShadow: isHovered ? "0 8px 24px rgba(225,73,109,0.5)" : "0 4px 12px rgba(0,0,0,0.3)",
                transform: isHovered ? "scale(1.06)" : "scale(1)",
                transition: "all 0.25s ease",
              }}
            >
              <Play size={12} fill="#fff" />
              <span>Present Deck</span>
            </div>
          </div>

          {/* Bottom Slide Pagination Track */}
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            {[1, 2, 3, 4, 5, 6].map((s) => (
              <div
                key={s}
                style={{
                  flex: 1,
                  height: 3,
                  borderRadius: 2,
                  background: s === 1 ? "#e1496d" : "rgba(255,255,255,0.3)",
                  boxShadow: s === 1 ? "0 0 6px #e1496d" : "none",
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── SOCIAL STUDIO (INSTAGRAM / REELS / TIKTOK) HUD ── */}
      {toolType === "social" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            padding: "12px 14px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            zIndex: 2,
            boxSizing: "border-box",
          }}
        >
          {/* Top Left Reel Badge */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ fontSize: 9, padding: "3px 9px", borderRadius: 99, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", fontWeight: 700, fontFamily: "'Poppins', sans-serif" }}>
              ⚡ STORY 9:16
            </span>
          </div>

          {/* Social Engagement Stats Strip */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "6px 12px",
              borderRadius: 8,
              background: "rgba(0, 0, 0, 0.7)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#f43f5e", fontSize: 10, fontWeight: 700, fontFamily: "'Poppins', sans-serif" }}>
              <Heart size={12} fill="#f43f5e" />
              <span>24.8K</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#fff", fontSize: 10, fontWeight: 700, fontFamily: "'Poppins', sans-serif" }}>
              <MessageCircle size={12} />
              <span>1.4K</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#fff", fontSize: 10, fontWeight: 700, fontFamily: "'Poppins', sans-serif" }}>
              <Share2 size={12} />
              <span>5.2K</span>
            </div>
          </div>
        </div>
      )}

      {/* ── IMAGE STUDIO & GRAPHICS HUD ── */}
      {toolType === "image" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "12px 14px",
            zIndex: 2,
            boxSizing: "border-box",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ fontSize: 9, padding: "3px 9px", borderRadius: 99, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.15)", color: "#f59e0b", fontWeight: 800, fontFamily: "monospace" }}>
              32-BIT HDR COMPOSITE
            </span>
          </div>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 14px",
                borderRadius: 99,
                background: isHovered ? "linear-gradient(135deg, #e1496d, #942945)" : "rgba(0,0,0,0.6)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.25)",
                color: "#ffffff",
                fontSize: 11,
                fontWeight: 700,
                fontFamily: "Syne, sans-serif",
                opacity: isHovered ? 1 : 0,
                transform: isHovered ? "scale(1.05)" : "scale(0.95)",
                transition: "all 0.25s ease",
              }}
            >
              <Layers size={12} />
              <span>Open Layer Studio</span>
            </div>
          </div>

          <div style={{ display: "flex", gap: 6 }}>
            <span style={{ fontSize: 8.5, color: "#fff", padding: "2px 7px", borderRadius: 4, background: "rgba(0,0,0,0.65)", border: "1px solid rgba(255,255,255,0.1)" }}>
              LUT CINEMATIC
            </span>
            <span style={{ fontSize: 8.5, color: "#fff", padding: "2px 7px", borderRadius: 4, background: "rgba(0,0,0,0.65)", border: "1px solid rgba(255,255,255,0.1)" }}>
              CURVES +20
            </span>
          </div>
        </div>
      )}

      {/* ── PIPELINES & AI NODE HUD ── */}
      {toolType === "pipeline" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            padding: "12px 14px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            zIndex: 2,
            boxSizing: "border-box",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ fontSize: 9, padding: "3px 9px", borderRadius: 99, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.15)", color: "#10b981", fontWeight: 800, fontFamily: "monospace" }}>
              ⚡ SPATIAL AI GRAPH • GPU ACCEL
            </span>
          </div>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 14px",
                borderRadius: 99,
                background: isHovered ? "linear-gradient(135deg, #e1496d, #942945)" : "rgba(0,0,0,0.6)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.25)",
                color: "#ffffff",
                fontSize: 11,
                fontWeight: 700,
                fontFamily: "Syne, sans-serif",
                opacity: isHovered ? 1 : 0,
                transform: isHovered ? "scale(1.05)" : "scale(0.95)",
                transition: "all 0.25s ease",
              }}
            >
              <Cpu size={12} />
              <span>Launch Node Pipeline</span>
            </div>
          </div>

          <div style={{ height: 2, background: "linear-gradient(90deg, #10b981, #e1496d)", borderRadius: 1 }} />
        </div>
      )}

      {/* ── DOCUMENTS HUD ── */}
      {toolType === "document" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            padding: "14px 16px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            zIndex: 2,
            boxSizing: "border-box",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 4, background: "rgba(6, 182, 212, 0.45)", color: "#fff", fontWeight: 800, fontFamily: "monospace" }}>
              DOC PRO
            </span>
            <span style={{ fontSize: 8.5, color: "#fff", opacity: 0.8, fontFamily: "monospace" }}>3 MIN READ</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ height: 4, width: "65%", background: "#fff", borderRadius: 2 }} />
            <div style={{ height: 3, width: "90%", background: "rgba(255,255,255,0.4)", borderRadius: 2 }} />
            <div style={{ height: 3, width: "80%", background: "rgba(255,255,255,0.4)", borderRadius: 2 }} />
          </div>
        </div>
      )}

      {/* ── WHITEBOARD HUD ── */}
      {toolType === "whiteboard" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            padding: "14px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            zIndex: 2,
          }}
        >
          <div style={{ width: 34, height: 34, borderRadius: 4, background: "#fef08a", boxShadow: "0 4px 10px rgba(0,0,0,0.3)", transform: "rotate(-6deg)" }} />
          <div style={{ width: 38, height: 38, borderRadius: 4, background: "#fbcfe8", boxShadow: "0 4px 10px rgba(0,0,0,0.3)", transform: isHovered ? "rotate(4deg) scale(1.1)" : "rotate(4deg)", transition: "all 0.3s ease" }} />
          <div style={{ width: 34, height: 34, borderRadius: 4, background: "#bae6fd", boxShadow: "0 4px 10px rgba(0,0,0,0.3)", transform: "rotate(8deg)" }} />
        </div>
      )}

      {/* ── DEFAULT HUD ── */}
      {toolType === "default" && (
        <div style={{ zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              background: "linear-gradient(135deg, #e1496d, #942945)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              boxShadow: "0 6px 18px rgba(0,0,0,0.4)",
            }}
          >
            <Sparkles size={20} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function VaultView({
  pastWorks,
  onNavigate,
  onOpenWork,
  onDeleteWork,
  onDuplicateWork,
  user,
  isDark,
  THEME,
  colors,
  setShowStudioPicker,
  setActiveNav,
}) {
  const [vaultSearch, setVaultSearch] = useState("");
  const [vaultCategory, setVaultCategory] = useState("all");
  const [vaultView, setVaultView] = useState("graph"); // "graph" | "grid"
  const [isScanning, setIsScanning] = useState(false);
  const [publishingWork, setPublishingWork] = useState(null);
  const [publishToast, setPublishToast] = useState(null);
  const [customTitle, setCustomTitle] = useState("");
  const [customTags, setCustomTags] = useState("");
  const [customDesc, setCustomDesc] = useState("");
  const pastWorkScrollRef = useRef(null);

  const handleOpenPublish = (work) => {
    setPublishingWork(work);
    setCustomTitle(work.title || "Untitled Masterpiece");
    setCustomTags(Array.isArray(work.tags) ? work.tags.join(", ") : (work.tags || work.tool || "Studio"));
    setCustomDesc(work.desc || `A high-fidelity project crafted in Creatify ${work.tool || "Studio"}, ready to remix and customize.`);
  };

  const handleConfirmPublish = (e) => {
    if (e) e.preventDefault();
    if (!publishingWork) return;

    const routeMap = {
      "Video Editor": "editor_load",
      "Presentations": "presentation_load",
      "Image Editor": "image_editor_load",
      "Logo Maker": "logo_maker_load",
      "Social Studio": "social_studio_load",
      "Documents": "documents_load",
      "Whiteboard": "whiteboard_load",
      "3D Mockups": "mockup_studio",
      "Spatial Pipelines": "pipelines",
    };

    const toolName = publishingWork.tool || publishingWork.category || "Studio";
    const publishedItem = {
      id: `pub_${publishingWork.id || Date.now()}`,
      originalProjectId: publishingWork.id,
      title: customTitle.trim() || publishingWork.title || "Community Creation",
      category: (publishingWork.category || toolName).toLowerCase(),
      tool: toolName,
      route: publishingWork.route || routeMap[toolName] || "editor_load",
      ratio: publishingWork.ratio || (toolName.includes("Social") ? "9:16" : toolName.includes("Logo") ? "1:1" : "16:9"),
      aspectLabel: publishingWork.ratio === "9:16" ? "1080 × 1920" : publishingWork.ratio === "1:1" ? "1200 × 1200" : "1920 × 1080",
      image: publishingWork.thumbnail || publishingWork.image || null,
      creator: {
        name: user?.name || "Verified Creator",
        badge: "Community Publisher",
        avatar: (user?.name?.[0] || "C").toUpperCase(),
      },
      remixes: 1,
      likes: 1,
      rating: 5.0,
      tags: customTags ? customTags.split(",").map(t => t.trim()).filter(Boolean) : [toolName, "Community"],
      colors: ["#e1496d", "#38bdf8", "#10b981"],
      layers: publishingWork.layers || 6,
      desc: customDesc.trim() || "A custom community template published directly to the Creatify sovereign marketplace.",
      isUserPublished: true,
      publishedAt: new Date().toLocaleDateString(),
      data: publishingWork.data || {},
    };

    try {
      const stored = JSON.parse(localStorage.getItem("creatify_published_templates") || "[]");
      const filtered = stored.filter(p => p.id !== publishedItem.id);
      localStorage.setItem("creatify_published_templates", JSON.stringify([publishedItem, ...filtered]));
    } catch (err) {
      console.error(err);
    }

    const pubTitle = publishedItem.title;
    setPublishingWork(null);
    setPublishToast(`🎉 Successfully published "${pubTitle}" to the Community Marketplace!`);
    setTimeout(() => setPublishToast(null), 5000);
  };

  const categories = [
    { id: "all", label: "All Holdings", icon: FolderOpen, count: pastWorks.length },
    { id: "video", label: "4K Videos", icon: Video, count: pastWorks.filter(p => p.tool?.toLowerCase().includes("video") || p.category?.toLowerCase().includes("video")).length },
    { id: "image", label: "Image Works", icon: ImageIcon, count: pastWorks.filter(p => p.tool?.toLowerCase().includes("image") || p.category?.toLowerCase().includes("image")).length },
    { id: "presentation", label: "Pitch Decks", icon: Presentation, count: pastWorks.filter(p => p.tool?.toLowerCase().includes("presentation") || p.category?.toLowerCase().includes("presentation")).length },
    { id: "pipelines", label: "Node Pipelines", icon: Cpu, count: pastWorks.filter(p => p.tool?.toLowerCase().includes("pipeline") || p.category?.toLowerCase().includes("pipeline")).length },
    { id: "mockup", label: "3D Mockups", icon: Box, count: pastWorks.filter(p => p.tool?.toLowerCase().includes("mockup") || p.category?.toLowerCase().includes("mockup")).length },
    { id: "logo", label: "Brand Kits", icon: Palette, count: pastWorks.filter(p => p.tool?.toLowerCase().includes("logo") || p.category?.toLowerCase().includes("logo")).length },
    { id: "document", label: "Rich Docs", icon: FileText, count: pastWorks.filter(p => p.tool?.toLowerCase().includes("doc") || p.category?.toLowerCase().includes("doc")).length },
    { id: "whiteboard", label: "Whiteboards", icon: Layout, count: pastWorks.filter(p => p.tool?.toLowerCase().includes("whiteboard") || p.category?.toLowerCase().includes("whiteboard")).length },
  ];

  const filtered = pastWorks.filter((p) => {
    const matchSearch =
      vaultSearch === "" ||
      p.title?.toLowerCase().includes(vaultSearch.toLowerCase()) ||
      p.category?.toLowerCase().includes(vaultSearch.toLowerCase()) ||
      p.tool?.toLowerCase().includes(vaultSearch.toLowerCase());

    const matchCategory =
      vaultCategory === "all" ||
      (vaultCategory === "video" && (p.tool?.toLowerCase().includes("video") || p.category?.toLowerCase().includes("video"))) ||
      (vaultCategory === "image" && (p.tool?.toLowerCase().includes("image") || p.category?.toLowerCase().includes("image"))) ||
      (vaultCategory === "presentation" && (p.tool?.toLowerCase().includes("presentation") || p.category?.toLowerCase().includes("presentation"))) ||
      (vaultCategory === "pipelines" && (p.tool?.toLowerCase().includes("pipeline") || p.category?.toLowerCase().includes("pipeline"))) ||
      (vaultCategory === "mockup" && (p.tool?.toLowerCase().includes("mockup") || p.category?.toLowerCase().includes("mockup"))) ||
      (vaultCategory === "logo" && (p.tool?.toLowerCase().includes("logo") || p.category?.toLowerCase().includes("logo"))) ||
      (vaultCategory === "document" && (p.tool?.toLowerCase().includes("doc") || p.category?.toLowerCase().includes("doc"))) ||
      (vaultCategory === "whiteboard" && (p.tool?.toLowerCase().includes("whiteboard") || p.category?.toLowerCase().includes("whiteboard")));

    return matchSearch && matchCategory;
  });

  const strokeColor = isDark ? "#ff8da7" : "#831843";
  const cardBg = isDark ? "rgba(22, 8, 18, 0.75)" : "rgba(255, 255, 255, 0.9)";
  const cardBorder = isDark ? "1px solid rgba(225, 73, 109, 0.22)" : "1px solid rgba(148, 41, 69, 0.14)";
  const textPrimary = isDark ? "#ffffff" : "#1a040d";
  const textMuted = isDark ? "rgba(255, 255, 255, 0.6)" : "rgba(35, 8, 18, 0.65)";

  const triggerSecurityScan = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 1800);
  };

  return (
    <div style={{ padding: "30px 44px 80px", minHeight: "100vh", maxWidth: "1440px", margin: "0 auto", boxSizing: "border-box" }}>
      <style>{`
        @keyframes vaultGearSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes laserSweep {
          0% { transform: translateY(-40px); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(180px); opacity: 0; }
        }
        @keyframes canisterFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        .vault-card-hover {
          transition: all 0.28s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .vault-card-hover:hover {
          transform: translateY(-4px) scale(1.01);
          box-shadow: ${isDark ? "0 20px 45px rgba(225,73,109,0.25)" : "0 16px 36px rgba(148,41,69,0.12)"};
          border-color: ${isDark ? "#ff8da7" : "#e1496d"};
        }
      `}</style>

      {/* ── 1. LUXURY BIOMETRIC VAULT HERO CHAMBER ART ── */}
      <div
        style={{
          position: "relative",
          borderRadius: 24,
          padding: "36px 36px 28px",
          background: isDark
            ? "radial-gradient(ellipse at 70% 30%, #2a0c20 0%, #150510 50%, #0c0208 100%)"
            : "radial-gradient(ellipse at 70% 30%, #fff0f5 0%, #fdf2f7 50%, #fae6ef 100%)",
          border: cardBorder,
          boxShadow: isDark ? "0 25px 60px rgba(0,0,0,0.6)" : "0 15px 40px rgba(148,41,69,0.1)",
          marginBottom: 32,
          overflow: "hidden",
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr",
          gap: 32,
          alignItems: "center",
        }}
      >
        {/* Ambient Top Glow */}
        <div
          style={{
            position: "absolute",
            top: -50,
            right: "20%",
            width: "400px",
            height: "250px",
            background: "radial-gradient(circle, rgba(225,73,109,0.22) 0%, transparent 70%)",
            filter: "blur(70px)",
            pointerEvents: "none",
          }}
        />

        {/* Left Column: Vision & Actions */}
        <div style={{ position: "relative", zIndex: 2 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "5px 14px",
              borderRadius: 99,
              background: isDark ? "rgba(225, 73, 109, 0.16)" : "rgba(255, 255, 255, 0.9)",
              border: `1px solid ${isDark ? "rgba(225, 73, 109, 0.35)" : "rgba(148, 41, 69, 0.2)"}`,
              marginBottom: 14,
            }}
          >
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 8px #22c55e" }} />
            <span
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: 10.5,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: isDark ? "#ff8da7" : "#831843",
              }}
            >
              CREATIVE SOVEREIGN VAULT
            </span>
          </div>

          <h1
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: "clamp(28px, 3.6vw, 42px)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 1.15,
              color: textPrimary,
              margin: "0 0 10px",
            }}
          >
            Creative Master <span style={{ color: "#e1496d" }}>Vault</span>.
          </h1>

          <p
            style={{
              fontSize: 14,
              color: textMuted,
              fontFamily: "'Instrument Sans', sans-serif",
              lineHeight: 1.55,
              margin: "0 0 22px",
              maxWidth: 500,
            }}
          >
            Your high-fidelity creative studio archive. Project nodes, 4K timeline cuts, vector brand kits, and presentation decks stored with instant local access and zero latency.
          </p>

          {/* Quick Action Buttons */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              onClick={() => setShowStudioPicker(true)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 22px",
                borderRadius: 10,
                background: "linear-gradient(135deg, #e1496d, #942945)",
                border: "none",
                color: "#fff",
                fontSize: 13,
                fontWeight: 700,
                fontFamily: "Syne, sans-serif",
                cursor: "pointer",
                boxShadow: "0 6px 20px rgba(225,73,109,0.4)",
                transition: "all 0.2s ease",
              }}
            >
              <Plus size={15} />
              <span>New Master Project</span>
            </button>

            <button
              onClick={triggerSecurityScan}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                padding: "10px 18px",
                borderRadius: 10,
                background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
                border: `1px solid ${isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)"}`,
                color: textPrimary,
                fontSize: 12.5,
                fontWeight: 600,
                fontFamily: "'Poppins', sans-serif",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              <ShieldCheck size={14} color="#22c55e" />
              <span>{isScanning ? "Scanning Archive..." : "Scan Vault Integrity"}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Intricate High-Detail Sci-Fi Vault Vector Artwork */}
        <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg
            viewBox="0 0 520 280"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: "100%", maxWidth: 500, height: "auto", display: "block" }}
          >
            <defs>
              <linearGradient id="vaultDoorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={isDark ? "#2d0e23" : "#fdf2f7"} />
                <stop offset="50%" stopColor={isDark ? "#1f0918" : "#fce7f3"} />
                <stop offset="100%" stopColor={isDark ? "#12030d" : "#f8d2e2"} />
              </linearGradient>
              <linearGradient id="neonLaser" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#e1496d" stopOpacity="0" />
                <stop offset="50%" stopColor="#22c55e" stopOpacity="1" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
              </linearGradient>
              <radialGradient id="irisCoreGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#e1496d" stopOpacity="0.9" />
                <stop offset="60%" stopColor="#831843" stopOpacity="0.4" />
                <stop offset="100%" stopColor="transparent" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Background Tech Hex Grid & Circuit Traces */}
            <g opacity={isDark ? "0.3" : "0.2"}>
              <path d="M40 50 L120 50 L145 75 L220 75" stroke={strokeColor} strokeWidth="1.2" fill="none" strokeDasharray="4 4" />
              <path d="M40 230 L110 230 L135 205 L200 205" stroke={strokeColor} strokeWidth="1.2" fill="none" strokeDasharray="4 4" />
              <circle cx="120" cy="50" r="3" fill="#e1496d" />
              <circle cx="220" cy="75" r="3" fill="#38bdf8" />
              <circle cx="110" cy="230" r="3" fill="#10b981" />
            </g>

            {/* Left High-Tech Control Console Station */}
            <g transform="translate(25, 80)">
              {/* Console Desk */}
              <path d="M10 130 L115 130 L100 150 L0 150 Z" fill={isDark ? "#280a1c" : "#ffffff"} stroke={strokeColor} strokeWidth="2" />
              {/* Holographic Dual Monitors */}
              <rect x="15" y="65" width="42" height="55" rx="5" fill={isDark ? "#170410" : "#fdf2f7"} stroke="#e1496d" strokeWidth="1.5" />
              <line x1="20" y1="75" x2="48" y2="75" stroke="#e1496d" strokeWidth="2" />
              <line x1="20" y1="83" x2="42" y2="83" stroke="#38bdf8" strokeWidth="1.5" />
              <line x1="20" y1="91" x2="52" y2="91" stroke="#22c55e" strokeWidth="1.5" />
              {/* Audio Wave Meter on screen */}
              <path d="M20 108 L26 102 L32 112 L38 98 L44 106 L50 104" stroke="#38bdf8" strokeWidth="1.5" fill="none" />

              {/* Secondary Monitor */}
              <rect x="62" y="72" width="38" height="48" rx="5" fill={isDark ? "#170410" : "#fdf2f7"} stroke="#38bdf8" strokeWidth="1.5" />
              <circle cx="81" cy="94" r="10" stroke="#38bdf8" strokeWidth="1.2" strokeDasharray="3 2" />
              <line x1="81" y1="86" x2="81" y2="102" stroke="#e1496d" strokeWidth="1.5" />
              <line x1="73" y1="94" x2="89" y2="94" stroke="#e1496d" strokeWidth="1.5" />

              {/* Holographic Projector Base Glow */}
              <ellipse cx="58" cy="128" rx="45" ry="6" fill="rgba(225,73,109,0.25)" />
            </g>

            {/* Astronaut Vault Operator Specialist */}
            <g transform="translate(68, 145)">
              {/* Backpack Oxygen Module */}
              <rect x="-8" y="10" width="12" height="32" rx="4" fill={isDark ? "#180512" : "#fed7e2"} stroke={strokeColor} strokeWidth="1.8" />
              {/* Torso & Suit */}
              <rect x="2" y="14" width="26" height="36" rx="6" fill={isDark ? "#280a1c" : "#ffffff"} stroke={strokeColor} strokeWidth="2" />
              {/* Chest Control Panel */}
              <rect x="7" y="20" width="16" height="12" rx="2" fill={isDark ? "#15030e" : "#fce7f3"} stroke="#e1496d" strokeWidth="1.2" />
              <circle cx="11" cy="26" r="2" fill="#22c55e" />
              <circle cx="17" cy="26" r="2" fill="#38bdf8" />
              {/* Helmet & Visor */}
              <circle cx="15" cy="2" r="14" fill={isDark ? "#280a1c" : "#ffffff"} stroke={strokeColor} strokeWidth="2" />
              <ellipse cx="16" cy="2" rx="9" ry="6" fill="#e1496d" />
              <ellipse cx="14" cy="0" rx="4" ry="2" fill="#ffffff" opacity="0.75" />
              {/* Arms Typing on Console */}
              <path d="M26 24 L42 20 L50 26" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" fill="none" />
              {/* Legs */}
              <rect x="4" y="50" width="9" height="20" rx="3" fill={isDark ? "#200615" : "#fed7e2"} stroke={strokeColor} strokeWidth="1.8" />
              <rect x="17" y="50" width="9" height="20" rx="3" fill={isDark ? "#200615" : "#fed7e2"} stroke={strokeColor} strokeWidth="1.8" />
            </g>

            {/* Central Master Vault Heavy Mechanism */}
            <g transform="translate(340, 140)">
              {/* Outer Heavy Hydraulic Shield Housing */}
              <circle cx="0" cy="0" r="115" fill="url(#vaultDoorGrad)" stroke={strokeColor} strokeWidth="3" />
              
              {/* Outer Interlocking Planetary Gear Teeth */}
              {[...Array(20)].map((_, g) => {
                const angle = (Math.PI * 2 / 20) * g;
                const gx = Math.cos(angle) * 106;
                const gy = Math.sin(angle) * 106;
                return <circle key={g} cx={gx} cy={gy} r="4" fill={strokeColor} />;
              })}

              {/* Stepped Armor Rim */}
              <circle cx="0" cy="0" r="92" fill={isDark ? "#170511" : "#ffffff"} stroke={strokeColor} strokeWidth="2.2" />
              <circle cx="0" cy="0" r="76" fill="none" stroke="#e1496d" strokeWidth="1.5" strokeDasharray="8 4" />

              {/* Hydraulic Piston Arms (Left, Right, Top, Bottom) */}
              <rect x="-135" y="-7" width="25" height="14" rx="3" fill={isDark ? "#280a1c" : "#fed7e2"} stroke={strokeColor} strokeWidth="2" />
              <rect x="110" y="-7" width="25" height="14" rx="3" fill={isDark ? "#280a1c" : "#fed7e2"} stroke={strokeColor} strokeWidth="2" />
              <rect x="-7" y="-135" width="14" height="25" rx="3" fill={isDark ? "#280a1c" : "#fed7e2"} stroke={strokeColor} strokeWidth="2" />
              <rect x="-7" y="110" width="14" height="25" rx="3" fill={isDark ? "#280a1c" : "#fed7e2"} stroke={strokeColor} strokeWidth="2" />

              {/* Rotating Planetary Spoke Matrix Wheel */}
              <g style={{ animation: "vaultGearSpin 28s linear infinite" }}>
                <circle cx="0" cy="0" r="58" fill={isDark ? "#250a1b" : "#fdf2f7"} stroke={strokeColor} strokeWidth="2.2" />
                {/* 6 Heavy Spokes */}
                {[...Array(6)].map((_, sp) => {
                  const sAngle = (Math.PI * 2 / 6) * sp;
                  const sx2 = Math.cos(sAngle) * 56;
                  const sy2 = Math.sin(sAngle) * 56;
                  return (
                    <line
                      key={sp}
                      x1="0"
                      y1="0"
                      x2={sx2}
                      y2={sy2}
                      stroke={sp % 2 === 0 ? "#e1496d" : "#38bdf8"}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                  );
                })}
                {/* Mid Spoke Lock Ring */}
                <circle cx="0" cy="0" r="34" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
              </g>

              {/* Center Biometric Retinal Scanner Hub */}
              <circle cx="0" cy="0" r="24" fill="#e1496d" stroke={strokeColor} strokeWidth="2.5" />
              <circle cx="0" cy="0" r="38" fill="url(#irisCoreGlow)" />
              <circle cx="0" cy="0" r="12" fill="#ffffff" />
              <circle cx="0" cy="0" r="5" fill="#831843" />

              {/* Verification Scanning Laser Sweep */}
              {isScanning && (
                <g style={{ animation: "laserSweep 1.6s ease-in-out infinite" }}>
                  <line x1="-100" y1="0" x2="100" y2="0" stroke="url(#neonLaser)" strokeWidth="4" />
                  <circle cx="0" cy="0" r="85" fill="none" stroke="#22c55e" strokeWidth="2" strokeDasharray="6 6" />
                </g>
              )}
            </g>

            {/* Floating 4K RAW Cinema Reel Pod Top */}
            <g style={{ animation: "canisterFloat 4s ease-in-out infinite" }} transform="translate(190, 25)">
              <rect x="0" y="0" width="56" height="68" rx="10" fill={isDark ? "#280a1c" : "#ffffff"} stroke={strokeColor} strokeWidth="2" />
              <rect x="6" y="8" width="44" height="28" rx="5" fill="#e1496d" />
              {/* Cinema Reel Spool Graphic */}
              <circle cx="28" cy="22" r="9" fill="none" stroke="#ffffff" strokeWidth="1.8" />
              <circle cx="28" cy="22" r="3.5" fill="#ffffff" />
              <text x="28" y="50" fill={strokeColor} fontSize="8" fontFamily="monospace" fontWeight="800" textAnchor="middle">4K CINEMA</text>
              <circle cx="28" cy="59" r="3" fill="#22c55e" />
            </g>

            {/* Floating 3D Vector Shaders Pod Bottom */}
            <g style={{ animation: "canisterFloat 4.5s ease-in-out infinite 0.6s" }} transform="translate(200, 185)">
              <rect x="0" y="0" width="56" height="68" rx="10" fill={isDark ? "#280a1c" : "#ffffff"} stroke={strokeColor} strokeWidth="2" />
              <rect x="6" y="8" width="44" height="28" rx="5" fill="#38bdf8" />
              {/* Isometric Cube Wireframe */}
              <polygon points="28,12 38,18 28,24 18,18" fill="none" stroke="#ffffff" strokeWidth="1.4" />
              <polygon points="18,18 28,24 28,33 18,27" fill="rgba(255,255,255,0.3)" stroke="#ffffff" strokeWidth="1.4" />
              <polygon points="38,18 28,24 28,33 38,27" fill="rgba(255,255,255,0.5)" stroke="#ffffff" strokeWidth="1.4" />
              <text x="28" y="50" fill={strokeColor} fontSize="8" fontFamily="monospace" fontWeight="800" textAnchor="middle">3D SHADERS</text>
              <circle cx="28" cy="59" r="3" fill="#10b981" />
            </g>
          </svg>
        </div>
      </div>

      {/* ── 2. ESSENTIAL PROJECT STATS STRIP ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 16,
          marginBottom: 32,
        }}
      >
        {[
          { label: "Total Vault Holdings", val: `${pastWorks.length} Master Projects`, icon: HardDrive, color: "#ff8da7" },
          { label: "Living Node Blueprints", val: `${pastWorks.length + 8} Active Topologies`, icon: Cpu, color: "#38bdf8" },
        ].map((m, i) => {
          const Icon = m.icon;
          return (
            <div
              key={i}
              style={{
                padding: "16px 22px",
                borderRadius: 16,
                background: cardBg,
                border: cardBorder,
                backdropFilter: "blur(16px)",
                display: "flex",
                alignItems: "center",
                gap: 16,
              }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  background: `${m.color}18`,
                  border: `1px solid ${m.color}35`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon size={20} color={m.color} />
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, fontFamily: "'Poppins', sans-serif", color: textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>
                  {m.label}
                </div>
                <div style={{ fontSize: 16, fontWeight: 800, fontFamily: "Syne, sans-serif", color: m.color }}>
                  {m.val}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── 3. FILTER PILLS & SEARCH BAR ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
          marginBottom: 28,
        }}
      >
        {/* Category Pills */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
          {categories.map((c) => {
            const active = vaultCategory === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setVaultCategory(c.id)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "7px 15px",
                  borderRadius: 99,
                  background: active ? "linear-gradient(135deg, #e1496d, #942945)" : isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
                  border: active ? "1.5px solid #e1496d" : `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
                  color: active ? "#ffffff" : textMuted,
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: 11.5,
                  fontWeight: active ? 700 : 500,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.2s ease",
                  boxShadow: active ? "0 4px 12px rgba(225,73,109,0.35)" : "none",
                }}
              >
                <span>{c.label}</span>
                <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 99, background: active ? "rgba(255,255,255,0.25)" : (isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)") }}>
                  {c.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & 2-Option View Mode Switcher */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Search */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "7px 14px",
              borderRadius: 10,
              background: cardBg,
              border: cardBorder,
              minWidth: 220,
            }}
          >
            <Search size={14} color={isDark ? "#ff8da7" : "#831843"} />
            <input
              type="text"
              placeholder="Search holdings..."
              value={vaultSearch}
              onChange={(e) => setVaultSearch(e.target.value)}
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                color: textPrimary,
                fontSize: 12,
                fontFamily: "'Instrument Sans', sans-serif",
                width: "100%",
              }}
            />
            {vaultSearch && (
              <button
                onClick={() => setVaultSearch("")}
                style={{ background: "none", border: "none", color: textMuted, cursor: "pointer", fontSize: 11 }}
              >
                ✕
              </button>
            )}
          </div>

          {/* 2-Option View Mode Switcher */}
          <div
            style={{
              display: "flex",
              background: isDark ? "rgba(0,0,0,0.35)" : "rgba(0,0,0,0.05)",
              padding: 3,
              borderRadius: 10,
              border: cardBorder,
            }}
          >
            {[
              { id: "graph", label: "✦ Spatial Graph" },
              { id: "grid", label: "▤ Archive Grid" },
            ].map((v) => (
              <button
                key={v.id}
                onClick={() => setVaultView(v.id)}
                style={{
                  padding: "6px 14px",
                  borderRadius: 7,
                  background: vaultView === v.id ? "linear-gradient(135deg, #e1496d, #942945)" : "transparent",
                  border: "none",
                  color: vaultView === v.id ? "#ffffff" : textMuted,
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: 11.5,
                  fontWeight: vaultView === v.id ? 700 : 500,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── 4. LIVING TOPOLOGY GRAPH (IF GRAPH VIEW) ── */}
      {vaultView === "graph" && (
        <div style={{ marginBottom: 36 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div>
              <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: 18, fontWeight: 800, color: textPrimary, margin: "0 0 2px" }}>
                Living Creative Ecosystem Graph
              </h3>
              <p style={{ fontSize: 12.5, color: textMuted, margin: 0, fontFamily: "'Instrument Sans', sans-serif" }}>
                Interactive spatial blueprint. Click nodes to trace neural pathways or inspect project details.
              </p>
            </div>
          </div>

          <div
            style={{
              borderRadius: 20,
              overflow: "hidden",
              border: cardBorder,
              boxShadow: isDark ? "0 16px 40px rgba(0,0,0,0.5)" : "0 12px 32px rgba(148,41,69,0.08)",
              background: isDark ? "#10050d" : "#fdf6f9",
            }}
          >
            <MindMapGraph
              pastWorks={pastWorks}
              isDark={isDark}
              THEME={THEME}
              colors={colors}
              onNavigate={onNavigate}
              user={user}
              onSwitchTab={setActiveNav}
            />
          </div>
        </div>
      )}

      {/* ── 5. PROJECT ARCHIVE GALLERY GRID (IF GRID VIEW) ── */}
      {vaultView === "grid" && (
        <div>
          {/* Section Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
            <div>
              <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: 18, fontWeight: 800, color: textPrimary, margin: "0 0 2px" }}>
                Project Holdings Archive
              </h3>
              <p style={{ fontSize: 12.5, color: textMuted, margin: 0, fontFamily: "'Instrument Sans', sans-serif" }}>
                {filtered.length} {filtered.length === 1 ? "project" : "projects"} sealed in local storage.
              </p>
            </div>

            {/* Horizontal Scroll Arrows */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button
                onClick={() => {
                  if (pastWorkScrollRef.current) {
                    pastWorkScrollRef.current.scrollBy({ left: -400, behavior: "smooth" });
                  }
                }}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: cardBg,
                  border: cardBorder,
                  color: textPrimary,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => {
                  if (pastWorkScrollRef.current) {
                    pastWorkScrollRef.current.scrollBy({ left: 400, behavior: "smooth" });
                  }
                }}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: cardBg,
                  border: cardBorder,
                  color: textPrimary,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Filtered Project Cards */}
          {filtered.length === 0 ? (
            <div
              style={{
                padding: "60px 32px",
                borderRadius: 20,
                textAlign: "center",
                background: cardBg,
                border: `1.5px dashed ${isDark ? "rgba(225,73,109,0.25)" : "rgba(148,41,69,0.2)"}`,
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  background: "linear-gradient(135deg, rgba(225,73,109,0.2), rgba(148,41,69,0.3))",
                  color: "#ff8da7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                  border: "1px solid rgba(225,73,109,0.35)",
                  boxShadow: "0 8px 24px rgba(225,73,109,0.2)",
                }}
              >
                <FolderOpen size={24} color="#e1496d" />
              </div>
              <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: 18, fontWeight: 700, color: textPrimary, marginBottom: 6 }}>
                {vaultSearch || vaultCategory !== "all" ? "No Matching Projects in Vault" : "Your Creative Vault is Pristine"}
              </h3>
              <p style={{ color: textMuted, fontSize: 13, maxWidth: 440, margin: "0 auto 22px", fontFamily: "'Instrument Sans', sans-serif" }}>
                {vaultSearch || vaultCategory !== "all"
                  ? "Try adjusting your search query or switching category filters."
                  : "Launch any studio tool below to start creating your first masterpiece."}
              </p>
              <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
                <button
                  onClick={() => onNavigate("editor")}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 7,
                    padding: "9px 20px",
                    borderRadius: 10,
                    background: "linear-gradient(135deg, #e1496d, #942945)",
                    border: "none",
                    color: "#fff",
                    fontSize: 12.5,
                    fontWeight: 700,
                    fontFamily: "Syne, sans-serif",
                    cursor: "pointer",
                    boxShadow: "0 4px 14px rgba(225,73,109,0.35)",
                  }}
                >
                  <Video size={14} />
                  <span>4K Video Editor</span>
                </button>
                <button
                  onClick={() => onNavigate("image_editor")}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 7,
                    padding: "9px 20px",
                    borderRadius: 10,
                    background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
                    border: cardBorder,
                    color: textPrimary,
                    fontSize: 12.5,
                    fontWeight: 700,
                    fontFamily: "Syne, sans-serif",
                    cursor: "pointer",
                  }}
                >
                  <ImageIcon size={14} color="#f59e0b" />
                  <span>Image Studio</span>
                </button>
                <button
                  onClick={() => onNavigate("pipelines")}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 7,
                    padding: "9px 20px",
                    borderRadius: 10,
                    background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
                    border: cardBorder,
                    color: textPrimary,
                    fontSize: 12.5,
                    fontWeight: 700,
                    fontFamily: "Syne, sans-serif",
                    cursor: "pointer",
                  }}
                >
                  <Cpu size={14} color="#10b981" />
                  <span>Spatial Pipelines</span>
                </button>
              </div>
            </div>
          ) : (
            <div
              ref={pastWorkScrollRef}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(310px, 1fr))",
                gap: 22,
              }}
            >
              {filtered.map((work) => (
                <div
                  key={work.id}
                  className="vault-card-hover"
                  style={{
                    borderRadius: 18,
                    overflow: "hidden",
                    background: cardBg,
                    border: cardBorder,
                    backdropFilter: "blur(16px)",
                    boxShadow: isDark ? "0 10px 30px rgba(0,0,0,0.4)" : "0 8px 24px rgba(148,41,69,0.06)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  {/* Dynamic Interactive Photographic Cover Header */}
                  <div
                    style={{
                      height: 160,
                      position: "relative",
                      borderBottom: cardBorder,
                      overflow: "hidden",
                    }}
                  >
                    <InteractiveProjectCover work={work} isDark={isDark} strokeColor={strokeColor} />

                    {/* Tool Badge */}
                    <div
                      style={{
                        position: "absolute",
                        top: 10,
                        left: 10,
                        padding: "4px 11px",
                        borderRadius: 99,
                        background: "rgba(0, 0, 0, 0.72)",
                        backdropFilter: "blur(8px)",
                        color: "#ffffff",
                        fontSize: 10,
                        fontWeight: 700,
                        fontFamily: "'Poppins', sans-serif",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        zIndex: 4,
                      }}
                    >
                      {work.tool || work.category || "Studio"}
                    </div>

                    {/* Sealed Cryptographic Status Tag */}
                    <div
                      style={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        padding: "3px 8px",
                        borderRadius: 6,
                        background: "rgba(34, 197, 94, 0.22)",
                        border: "1px solid rgba(34, 197, 94, 0.45)",
                        color: "#22c55e",
                        fontSize: 9.5,
                        fontWeight: 800,
                        fontFamily: "monospace",
                        zIndex: 4,
                      }}
                    >
                      SEALED
                    </div>
                  </div>

                  {/* Card Content Info */}
                  <div style={{ padding: "18px 20px 16px" }}>
                    <h4
                      style={{
                        fontFamily: "Syne, sans-serif",
                        fontSize: 16,
                        fontWeight: 800,
                        color: textPrimary,
                        margin: "0 0 6px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {work.title || "Untitled Creation"}
                    </h4>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 11.5, color: textMuted, fontFamily: "'Instrument Sans', sans-serif", marginBottom: 16 }}>
                      <span>{work.updatedAt ? new Date(work.updatedAt).toLocaleDateString() : "Recently Edited"}</span>
                      <span>Local Sovereign</span>
                    </div>

                    {/* Action Bar */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                      <button
                        onClick={() => onOpenWork(work)}
                        style={{
                          flex: 1,
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 6,
                          padding: "9px 14px",
                          borderRadius: 8,
                          background: "linear-gradient(135deg, #e1496d, #942945)",
                          border: "none",
                          color: "#ffffff",
                          fontFamily: "Syne, sans-serif",
                          fontSize: 12.5,
                          fontWeight: 700,
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          boxShadow: "0 4px 14px rgba(225,73,109,0.35)",
                        }}
                      >
                        <Eye size={13} />
                        <span>Resume Work</span>
                      </button>

                      <button
                        onClick={() => handleOpenPublish(work)}
                        title="Publish to Community Marketplace"
                        style={{
                          padding: "9px 12px",
                          borderRadius: 8,
                          background: isDark ? "rgba(225, 73, 109, 0.12)" : "rgba(148, 41, 69, 0.08)",
                          border: `1px solid ${isDark ? "rgba(225, 73, 109, 0.3)" : "rgba(148, 41, 69, 0.2)"}`,
                          color: isDark ? "#ff8da7" : "#831843",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 5,
                          fontSize: 11.5,
                          fontWeight: 700,
                          fontFamily: "'Poppins', sans-serif",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }}
                      >
                        <Share2 size={13} />
                        <span>Publish</span>
                      </button>

                      {onDuplicateWork && (
                        <button
                          onClick={() => onDuplicateWork(work)}
                          title="Duplicate project"
                          style={{
                            padding: "9px",
                            borderRadius: 8,
                            background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
                            border: cardBorder,
                            color: textMuted,
                            cursor: "pointer",
                          }}
                        >
                          <Copy size={13} />
                        </button>
                      )}

                      <button
                        onClick={() => onDeleteWork(work.id)}
                        title="Delete project"
                        style={{
                          padding: "9px",
                          borderRadius: 8,
                          background: "rgba(239, 68, 68, 0.1)",
                          border: "1px solid rgba(239, 68, 68, 0.25)",
                          color: "#ef4444",
                          cursor: "pointer",
                        }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── PUBLISH WORK TO MARKETPLACE MODAL ── */}
      {publishingWork && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 1000,
          background: isDark ? "rgba(0,0,0,0.82)" : "rgba(24, 4, 15, 0.5)",
          backdropFilter: "blur(18px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: 20, boxSizing: "border-box",
        }}>
          <div style={{
            width: "100%", maxWidth: 560,
            background: isDark ? "linear-gradient(135deg, #1c0615, #0d020a)" : "linear-gradient(135deg, #ffffff, #fff2f7)",
            border: isDark ? "1.5px solid #e1496d" : "1.5px solid rgba(225, 73, 109, 0.4)",
            borderRadius: 24, padding: "28px 32px",
            boxShadow: "0 25px 65px rgba(225,73,109,0.35)",
            maxHeight: "90vh", overflowY: "auto",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
              <div>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: "#e1496d", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "'Poppins', sans-serif" }}>
                  COMMUNITY PUBLISHER
                </span>
                <h3 style={{ margin: "2px 0 0", fontFamily: "Syne, sans-serif", fontSize: 22, fontWeight: 800, color: textPrimary }}>
                  Publish Project to Marketplace
                </h3>
              </div>
              <button
                onClick={() => setPublishingWork(null)}
                style={{ background: "none", border: "none", color: textMuted, cursor: "pointer", fontSize: 18 }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmPublish} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: "#e1496d", marginBottom: 6, fontFamily: "'Poppins', sans-serif" }}>
                  Template Title *
                </label>
                <input
                  type="text"
                  required
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  style={{
                    width: "100%", padding: "10px 14px", borderRadius: 10,
                    background: isDark ? "rgba(255,255,255,0.06)" : "#ffffff",
                    border: `1px solid ${isDark ? "rgba(225,73,109,0.3)" : "rgba(148,41,69,0.2)"}`,
                    color: textPrimary, fontSize: 13, outline: "none", boxSizing: "border-box",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: "#e1496d", marginBottom: 6, fontFamily: "'Poppins', sans-serif" }}>
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={customTags}
                  onChange={(e) => setCustomTags(e.target.value)}
                  placeholder="e.g. 4K, Cyberpunk, Cinematic, Logo Kit"
                  style={{
                    width: "100%", padding: "10px 14px", borderRadius: 10,
                    background: isDark ? "rgba(255,255,255,0.06)" : "#ffffff",
                    border: `1px solid ${isDark ? "rgba(225,73,109,0.3)" : "rgba(148,41,69,0.2)"}`,
                    color: textPrimary, fontSize: 13, outline: "none", boxSizing: "border-box",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: "#e1496d", marginBottom: 6, fontFamily: "'Poppins', sans-serif" }}>
                  Description & Remix Notes
                </label>
                <textarea
                  rows={3}
                  value={customDesc}
                  onChange={(e) => setCustomDesc(e.target.value)}
                  style={{
                    width: "100%", padding: "10px 14px", borderRadius: 10,
                    background: isDark ? "rgba(255,255,255,0.06)" : "#ffffff",
                    border: `1px solid ${isDark ? "rgba(225,73,109,0.3)" : "rgba(148,41,69,0.2)"}`,
                    color: textPrimary, fontSize: 13, outline: "none", boxSizing: "border-box", resize: "none",
                  }}
                />
              </div>

              <div style={{
                padding: "12px 16px", borderRadius: 12,
                background: isDark ? "rgba(34, 197, 94, 0.1)" : "rgba(34, 197, 94, 0.08)",
                border: "1px solid rgba(34, 197, 94, 0.3)",
                display: "flex", alignItems: "center", gap: 10,
                color: "#22c55e", fontSize: 12, fontWeight: 600,
              }}>
                <ShieldCheck size={18} />
                <span>Your project layers and assets will be shared to the Sovereign Creator Hub for one-click community remixing.</span>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => setPublishingWork(null)}
                  style={{
                    padding: "10px 18px", borderRadius: 10,
                    background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
                    border: "none", color: textPrimary, fontSize: 12.5, fontWeight: 600, cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 7,
                    padding: "10px 24px", borderRadius: 10,
                    background: "linear-gradient(135deg, #e1496d, #942945)",
                    border: "none", color: "#fff", fontSize: 13, fontWeight: 700,
                    fontFamily: "Syne, sans-serif", cursor: "pointer",
                    boxShadow: "0 4px 16px rgba(225,73,109,0.4)",
                  }}
                >
                  <Share2 size={14} />
                  <span>Publish to Marketplace →</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── FLOATING PUBLISH SUCCESS TOAST ── */}
      {publishToast && (
        <div style={{
          position: "fixed", bottom: 32, right: 32, zIndex: 1000,
          background: "linear-gradient(135deg, #e1496d, #942945)",
          color: "#ffffff", padding: "14px 22px", borderRadius: 14,
          boxShadow: "0 12px 36px rgba(225,73,109,0.5)",
          display: "flex", alignItems: "center", gap: 14,
          fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 600,
        }}>
          <Sparkles size={18} />
          <span>{publishToast}</span>
          {setActiveNav && (
            <button
              onClick={() => setActiveNav("templates")}
              style={{
                padding: "6px 12px", borderRadius: 8,
                background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.4)",
                color: "#ffffff", fontSize: 11.5, fontWeight: 700,
                cursor: "pointer", whiteSpace: "nowrap",
              }}
            >
              View in Marketplace →
            </button>
          )}
        </div>
      )}
    </div>
  );
}
