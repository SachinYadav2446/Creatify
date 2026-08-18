import React, { useState, useEffect, useRef } from "react";
import {
  Infinity as InfinityIcon, Sparkles, Layers, Box, Video, Zap,
  Palette, Cpu, Users, Globe, ArrowRight, Check, Compass,
  Sliders, Terminal, Activity, Play, Plus, RefreshCw, Eye,
  ShieldCheck, Share2, Download, Code, Disc, Star, Monitor,
  FolderOpen, Flame, ChevronRight, Maximize2, MousePointer,
  Crosshair, Move, Radio, Sparkle, Lock, ExternalLink
} from "lucide-react";
import THEME from "../theme";
import { awardXP } from "../utils/xpSystem";

/* ── Sample Interactive Blueprint Node Clusters ────────────────────────────── */
const BLUEPRINTS = [
  {
    id: "motion_3d",
    title: "4K Motion & 3D Spatial Pipeline",
    subtitle: "Pipes real-time Three.js raytrace renders into multi-track video timeline",
    category: "VIDEO + 3D HYBRID",
    color: "#e1496d",
    icon: Video,
    nodes: [
      { id: "n1", label: "WebGL 3D Scene", type: "3D Asset", status: "Active", x: 60, y: 80, color: "#c084fc", icon: Box },
      { id: "n2", label: "PBR Material Graph", type: "Shader", status: "Compiled", x: 260, y: 50, color: "#f59e0b", icon: Palette },
      { id: "n3", label: "4K Timeline Compositor", type: "Video", status: "Synced", x: 480, y: 110, color: "#e1496d", icon: Video },
      { id: "n4", label: "Neural Color Grading", type: "AI Filter", status: "Real-time", x: 700, y: 90, color: "#38bdf8", icon: Sparkles },
    ],
    connections: [
      { from: "n1", to: "n2" },
      { from: "n2", to: "n3" },
      { from: "n3", to: "n4" }
    ],
    telemetry: { fps: "120 FPS", resolution: "3840×2160", latency: "4.2 ms", sync: "CRDT 0-loss" }
  },
  {
    id: "brand_system",
    title: "Dynamic Brand Identity & Token Graph",
    subtitle: "Orchestrates procedural font typography, color math, and multi-asset exports",
    category: "BRAND ARCHITECTURE",
    color: "#a855f7",
    icon: Palette,
    nodes: [
      { id: "b1", label: "Brand Token Core", type: "Tokens", status: "Master", x: 60, y: 90, color: "#a855f7", icon: Palette },
      { id: "b2", label: "Procedural Typography", type: "Font Engine", status: "Variable", x: 270, y: 60, color: "#38bdf8", icon: Disc },
      { id: "b3", label: "Vector Mockup Array", type: "Vector", status: "Dynamic", x: 490, y: 120, color: "#ec4899", icon: Layers },
      { id: "b4", label: "Multi-Format Export Node", type: "Export", status: "Batch Ready", x: 710, y: 80, color: "#10b981", icon: Download },
    ],
    connections: [
      { from: "b1", to: "b2" },
      { from: "b1", to: "b3" },
      { from: "b3", to: "b4" }
    ],
    telemetry: { fps: "60 FPS", resolution: "Vector Infinite", latency: "1.8 ms", sync: "P2P Active" }
  },
  {
    id: "ai_synthesis",
    title: "Neural Prompt-to-DOM Synthesis Graph",
    subtitle: "Converts multi-lingual prompt directives into editable vector canvas nodes",
    category: "GENERATIVE AI",
    color: "#38bdf8",
    icon: Sparkles,
    nodes: [
      { id: "a1", label: "Prompt Directive Node", type: "LLM Input", status: "Ready", x: 60, y: 100, color: "#38bdf8", icon: Terminal },
      { id: "a2", label: "DOM Semantic Parser", type: "Parser", status: "Validated", x: 270, y: 70, color: "#f59e0b", icon: Code },
      { id: "a3", label: "Style Injection Matrix", type: "CSS Bridge", status: "Harmonized", x: 480, y: 130, color: "#c084fc", icon: Zap },
      { id: "a4", label: "Live Editable Component", type: "Interactive", status: "Rendered", x: 700, y: 95, color: "#22c55e", icon: Sparkle },
    ],
    connections: [
      { from: "a1", to: "a2" },
      { from: "a2", to: "a3" },
      { from: "a3", to: "a4" }
    ],
    telemetry: { fps: "120 FPS", resolution: "Fluid DOM", latency: "6.8 ms", sync: "Neural Hub" }
  }
];

/* ── Benchmark Comparison Data ────────────────────────────────────────────── */
const BENCHMARKS = [
  { feature: "Spatial Coordinate Range", infiniteStudio: "64-bit Infinite Sub-Pixel (1% - 3200%)", legacyTools: "Limited Fixed Artboards (e.g. 1920×1080)" },
  { feature: "Multi-Modal Convergence", infiniteStudio: "Video, 3D WebGL, Vectors & AI on 1 Plane", legacyTools: "Requires 4 Separate Isolated Software Apps" },
  { feature: "Multiplayer Real-time Sync", infiniteStudio: "Sub-10ms CRDT Conflict-Free State", legacyTools: "File Locking / Cloud Refresh Lag" },
  { feature: "Viewport Render Engine", infiniteStudio: "Hardware Accelerated WebGL / WebGPU 120 FPS", legacyTools: "CPU-Bound DOM / Heavy GPU Throttling" },
  { feature: "Live Node Cross-Piping", infiniteStudio: "Instant Bidirectional Data Streams", legacyTools: "Manual File Export & Re-Import" },
];

/* ── Preset Starter Blueprints ───────────────────────────────────────────── */
const STARTER_PRESETS = [
  {
    title: "Omni-Channel Brand Broadcast",
    desc: "Simultaneously generate 16:9 4K YouTube intros, 9:16 TikTok reels, and 1:1 Instagram motion teasers from a single root node.",
    category: "Motion & Social",
    nodesCount: 8,
    color: "#e1496d",
    icon: Video,
  },
  {
    title: "Interactive 3D Device Showcase",
    desc: "Animate a realistic 3D smartphone mockup rotating in raytraced light while live UI screens stream directly onto its screen texture.",
    category: "3D Spatial WebGL",
    nodesCount: 6,
    color: "#c084fc",
    icon: Box,
  },
  {
    title: "Automated Social Ad Generator",
    desc: "Connect dynamic spreadsheet rows to auto-compose 50 customized video ads with localized text and product mockups in seconds.",
    category: "Pipeline Automation",
    nodesCount: 11,
    color: "#f59e0b",
    icon: Zap,
  },
  {
    title: "Generative Typography Laboratory",
    desc: "Experiment with procedural variable font keyframes, fluid wave distortions, and generative SVG path morphing.",
    category: "Brand & Design",
    nodesCount: 5,
    color: "#38bdf8",
    icon: Palette,
  }
];

export default function InfiniteStudioLanding({
  onNavigate,
  onBack,
  user,
  isDark = true,
  THEME = THEME,
}) {
  const [activeBlueprintIndex, setActiveBlueprintIndex] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simStep, setSimStep] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [panPos, setPanPos] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [activeNodeDetail, setActiveNodeDetail] = useState(null);

  const activeBlueprint = BLUEPRINTS[activeBlueprintIndex];

  // Palette styling
  const bg = isDark ? "#0e060b" : "#f7f6fb";
  const surface = isDark ? "rgba(24, 7, 18, 0.85)" : "rgba(255, 255, 255, 0.95)";
  const border = isDark ? "rgba(225, 73, 109, 0.22)" : "rgba(148, 41, 69, 0.14)";
  const textPrimary = isDark ? "#fdf2f4" : "#0f0208";
  const textMuted = isDark ? "rgba(255, 255, 255, 0.52)" : "rgba(15, 2, 8, 0.52)";
  const accent = "#e1496d";

  // Handle Simulation Pulsing
  const triggerSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setSimStep(0);
    awardXP("EXECUTE_PIPELINE", { detail: `Simulated ${activeBlueprint.title}` });

    let step = 0;
    const interval = setInterval(() => {
      step++;
      setSimStep(step);
      if (step >= activeBlueprint.nodes.length) {
        clearInterval(interval);
        setTimeout(() => setIsSimulating(false), 800);
      }
    }, 600);
  };

  // Canvas Pan Interaction
  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    setIsPanning(true);
    setPanStart({ x: e.clientX - panPos.x, y: e.clientY - panPos.y });
  };

  const handleMouseMove = (e) => {
    if (!isPanning) return;
    setPanPos({
      x: e.clientX - panStart.x,
      y: e.clientY - panStart.y
    });
  };

  const handleMouseUp = () => setIsPanning(false);

  const resetCanvasView = () => {
    setPanPos({ x: 0, y: 0 });
    setZoomLevel(100);
  };

  return (
    <div style={{
      width: "100%",
      minHeight: "100vh",
      background: bg,
      color: textPrimary,
      fontFamily: "'Poppins', sans-serif",
      position: "relative",
      overflowX: "hidden",
      paddingBottom: 100,
    }}>
      {/* ── AMBIENT GRADIENT AURAS ── */}
      <div style={{
        position: "fixed", top: "-200px", left: "20%", width: 600, height: 600,
        borderRadius: "50%", background: "radial-gradient(circle, rgba(225,73,109,0.14) 0%, transparent 70%)",
        filter: "blur(80px)", pointerEvents: "none", zIndex: 0
      }} />
      <div style={{
        position: "fixed", bottom: "10%", right: "10%", width: 500, height: 500,
        borderRadius: "50%", background: "radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)",
        filter: "blur(90px)", pointerEvents: "none", zIndex: 0
      }} />

      {/* ── TOP HEADER NAVIGATION ── */}
      <header style={{
        padding: "20px 48px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: `1px solid ${border}`,
        backdropFilter: "blur(16px)",
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: isDark ? "rgba(14, 6, 11, 0.85)" : "rgba(247, 246, 251, 0.88)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button
            onClick={onBack}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
              border: `1px solid ${border}`,
              color: textPrimary,
              padding: "7px 14px",
              borderRadius: 10,
              fontSize: 12.5,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = accent}
            onMouseLeave={e => e.currentTarget.style.borderColor = border}
          >
            ← Back to Home
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: textMuted }}>
            <span>Creatify Suite</span>
            <span>/</span>
            <span style={{ color: accent, fontWeight: 700, display: "flex", alignItems: "center", gap: 5 }}>
              <InfinityIcon size={15} />
              Infinite Studio Architecture
            </span>
          </div>
        </div>

        {/* Live Engine Status Badge */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            padding: "5px 12px", borderRadius: 99,
            background: isDark ? "rgba(34,197,94,0.12)" : "rgba(34,197,94,0.08)",
            border: "1px solid rgba(34,197,94,0.3)",
            color: "#22c55e", fontSize: 11.5, fontWeight: 600,
          }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 8px #22c55e" }} />
            WebGPU Viewport Active • 120 FPS
          </div>

          <button
            onClick={() => onNavigate && onNavigate("editor")}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "9px 20px", borderRadius: 12, border: "none",
              background: "linear-gradient(135deg, #e1496d, #942945)",
              color: "#fff", fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 700,
              cursor: "pointer", boxShadow: "0 4px 16px rgba(225,73,109,0.35)",
              transition: "all 0.2s"
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
          >
            <Sparkles size={14} />
            Launch Infinite Canvas
          </button>
        </div>
      </header>

      {/* ── HERO BANNER SECTION ── */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "64px 36px 40px", textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "6px 16px", borderRadius: 99,
          background: isDark ? "rgba(225,73,109,0.12)" : "rgba(225,73,109,0.08)",
          border: `1.5px solid ${accent}`,
          color: accent, fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
          marginBottom: 20
        }}>
          <InfinityIcon size={16} />
          BOUNDLESS MULTI-MODAL CANVAS ENGINE
        </div>

        <h1 style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: "clamp(36px, 5.2vw, 68px)",
          fontWeight: 800,
          letterSpacing: "-0.03em",
          lineHeight: 1.08,
          margin: "0 auto 20px",
          maxWidth: 960,
          color: textPrimary
        }}>
          Where Every Creative Medium Converges on <span style={{
            background: "linear-gradient(135deg, #e1496d, #ff8da7, #c084fc)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>One Infinite Plane</span>.
        </h1>

        <p style={{
          fontSize: "clamp(15px, 1.8vw, 18px)",
          lineHeight: 1.6,
          color: textMuted,
          maxWidth: 780,
          margin: "0 auto 36px"
        }}>
          Unifying 4K multi-track timelines, WebGL 3D spatial raytracing, generative neural nodes, and vector brand systems with sub-10ms collaborative CRDT synchronization.
        </p>

        {/* Quick Spec Metrics Strip */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 14, maxWidth: 980, margin: "0 auto 48px"
        }}>
          {[
            { value: "64-bit Floating", label: "Infinite Coordinate Space", icon: Move, color: "#38bdf8" },
            { value: "< 10 ms", label: "CRDT Multi-Cursor Sync", icon: Users, color: "#10b981" },
            { value: "100,000+", label: "Spatial Node Capacity", icon: Layers, color: "#a855f7" },
            { value: "120 FPS", label: "Hardware Accelerated Engine", icon: Cpu, color: "#f59e0b" },
          ].map((m, i) => {
            const Icon = m.icon;
            return (
              <div
                key={i}
                style={{
                  background: surface,
                  border: `1.5px solid ${border}`,
                  borderRadius: 16,
                  padding: "16px 20px",
                  textAlign: "left",
                  display: "flex",
                  alignItems: "center",
                  gap: 14
                }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: `${m.color}20`, display: "flex", alignItems: "center", justifyContent: "center",
                  color: m.color, flexShrink: 0
                }}>
                  <Icon size={20} />
                </div>
                <div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 700, color: textPrimary }}>
                    {m.value}
                  </div>
                  <div style={{ fontSize: 11, color: textMuted, marginTop: 2 }}>
                    {m.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── INTERACTIVE CANVAS VIEWPORT SIMULATOR ── */}
      <section style={{ maxWidth: 1280, margin: "0 auto 80px", padding: "0 36px", position: "relative", zIndex: 2 }}>
        <div style={{
          background: isDark ? "rgba(18, 5, 14, 0.95)" : "rgba(255, 255, 255, 0.95)",
          border: `1.5px solid ${border}`,
          borderRadius: 24,
          overflow: "hidden",
          boxShadow: isDark
            ? "0 24px 60px rgba(0,0,0,0.6), 0 0 40px rgba(225,73,109,0.12)"
            : "0 16px 50px rgba(148,41,69,0.1)",
        }}>
          {/* Blueprint Selector & Viewport Controls Toolbar */}
          <div style={{
            padding: "14px 24px",
            borderBottom: `1px solid ${border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
            background: isDark ? "rgba(12, 3, 9, 0.6)" : "rgba(240, 238, 245, 0.6)"
          }}>
            {/* Blueprint Switcher Pills */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: textMuted, marginRight: 4 }}>
                Active Graph:
              </span>
              {BLUEPRINTS.map((bp, idx) => {
                const isActive = activeBlueprintIndex === idx;
                const BpIcon = bp.icon;
                return (
                  <button
                    key={bp.id}
                    onClick={() => { setActiveBlueprintIndex(idx); setIsSimulating(false); }}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 6,
                      padding: "6px 14px", borderRadius: 10,
                      background: isActive ? `${bp.color}25` : "transparent",
                      border: `1.5px solid ${isActive ? bp.color : (isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)")}`,
                      color: isActive ? (isDark ? "#fff" : bp.color) : textMuted,
                      fontFamily: "'Poppins', sans-serif", fontSize: 12, fontWeight: 600,
                      cursor: "pointer", transition: "all 0.18s ease"
                    }}
                  >
                    <BpIcon size={13} color={isActive ? bp.color : "currentColor"} />
                    {bp.title.split(" ")[0]} Flow
                  </button>
                );
              })}
            </div>

            {/* Viewport Pan/Zoom & Run Controls */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "4px 10px", borderRadius: 8,
                background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
                fontSize: 11.5, color: textMuted
              }}>
                <Move size={13} />
                <span>Drag to Pan</span>
                <span style={{ margin: "0 4px", opacity: 0.4 }}>|</span>
                <span>Zoom: {zoomLevel}%</span>
              </div>

              <button
                onClick={resetCanvasView}
                title="Reset Viewport"
                style={{
                  background: "transparent", border: `1px solid ${border}`,
                  padding: "5px 10px", borderRadius: 8, color: textMuted, cursor: "pointer",
                  fontSize: 11.5
                }}
              >
                Reset
              </button>

              <button
                onClick={triggerSimulation}
                disabled={isSimulating}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "6px 16px", borderRadius: 10, border: "none",
                  background: isSimulating ? "#22c55e" : `linear-gradient(135deg, ${activeBlueprint.color}, #7c233c)`,
                  color: "#fff", fontFamily: "'Syne', sans-serif", fontSize: 12, fontWeight: 700,
                  cursor: isSimulating ? "default" : "pointer",
                  boxShadow: `0 4px 14px ${activeBlueprint.color}40`,
                  transition: "all 0.2s"
                }}
              >
                {isSimulating ? <RefreshCw size={13} style={{ animation: "spin 1s linear infinite" }} /> : <Play size={13} />}
                {isSimulating ? "Processing Stream…" : "Simulate Flow (+25 XP)"}
              </button>
            </div>
          </div>

          {/* Infinite Interactive Canvas Viewport Stage */}
          <div
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{
              position: "relative",
              height: 380,
              cursor: isPanning ? "grabbing" : "grab",
              overflow: "hidden",
              userSelect: "none",
              background: isDark
                ? "radial-gradient(circle at 50% 50%, rgba(35, 10, 26, 0.4) 0%, #0c0409 100%)"
                : "radial-gradient(circle at 50% 50%, rgba(253, 242, 244, 0.8) 0%, #f4eff6 100%)",
            }}
          >
            {/* Grid Pattern Overlay */}
            <div style={{
              position: "absolute", inset: 0,
              backgroundImage: `radial-gradient(${isDark ? "rgba(225,73,109,0.15)" : "rgba(148,41,69,0.1)"} 1px, transparent 1px)`,
              backgroundSize: "24px 24px",
              pointerEvents: "none"
            }} />

            {/* Transform Canvas Surface */}
            <div style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: `translate(calc(-50% + ${panPos.x}px), calc(-50% + ${panPos.y}px)) scale(${zoomLevel / 100})`,
              transformOrigin: "center center",
              width: 900,
              height: 260,
              transition: isPanning ? "none" : "transform 0.15s ease-out"
            }}>
              {/* SVG Connecting Bezier Cables */}
              <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
                {activeBlueprint.connections.map((c, i) => {
                  const src = activeBlueprint.nodes.find(n => n.id === c.from);
                  const dst = activeBlueprint.nodes.find(n => n.id === c.to);
                  if (!src || !dst) return null;
                  const x1 = src.x + 90;
                  const y1 = src.y + 35;
                  const x2 = dst.x + 90;
                  const y2 = dst.y + 35;
                  const cx1 = x1 + (x2 - x1) * 0.5;
                  const cy1 = y1;
                  const cx2 = x1 + (x2 - x1) * 0.5;
                  const cy2 = y2;
                  const isActive = isSimulating && simStep > i;

                  return (
                    <g key={i}>
                      <path
                        d={`M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`}
                        fill="none"
                        stroke={isActive ? activeBlueprint.color : (isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)")}
                        strokeWidth={isActive ? 3 : 2}
                        strokeDasharray={isActive ? "6 4" : "none"}
                        style={{
                          animation: isActive ? "cableFlow 1s linear infinite" : "none"
                        }}
                      />
                      {isActive && (
                        <circle cx={x2} cy={y2} r={5} fill={activeBlueprint.color} />
                      )}
                    </g>
                  );
                })}
              </svg>

              {/* Node Cards on Canvas */}
              {activeBlueprint.nodes.map((node, i) => {
                const NodeIcon = node.icon;
                const isCurrentActive = isSimulating && simStep === i;
                const isProcessed = isSimulating && simStep > i;

                return (
                  <div
                    key={node.id}
                    onClick={(e) => { e.stopPropagation(); setActiveNodeDetail(node); }}
                    style={{
                      position: "absolute",
                      left: node.x,
                      top: node.y,
                      width: 180,
                      padding: "14px 16px",
                      borderRadius: 16,
                      background: isDark ? "rgba(22, 6, 17, 0.95)" : "rgba(255, 255, 255, 0.98)",
                      border: `1.5px solid ${isCurrentActive ? node.color : (isProcessed ? "#22c55e" : (isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"))}`,
                      boxShadow: isCurrentActive
                        ? `0 0 24px ${node.color}50, 0 8px 24px rgba(0,0,0,0.4)`
                        : (isDark ? "0 8px 20px rgba(0,0,0,0.3)" : "0 4px 16px rgba(0,0,0,0.06)"),
                      transform: isCurrentActive ? "scale(1.05)" : "scale(1)",
                      transition: "all 0.25s cubic-bezier(0.16,1,0.3,1)",
                      cursor: "pointer",
                      zIndex: isCurrentActive ? 10 : 2
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                      <div style={{
                        width: 30, height: 30, borderRadius: 8,
                        background: `${node.color}20`, display: "flex", alignItems: "center", justifyContent: "center",
                        color: node.color
                      }}>
                        <NodeIcon size={16} />
                      </div>
                      <span style={{
                        fontSize: 9.5, fontWeight: 700, padding: "2px 6px", borderRadius: 6,
                        background: isProcessed ? "rgba(34,197,94,0.15)" : (isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"),
                        color: isProcessed ? "#22c55e" : textMuted
                      }}>
                        {isProcessed ? "STREAMING" : node.type}
                      </span>
                    </div>

                    <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 12.5, fontWeight: 700, color: textPrimary, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {node.label}
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: textMuted, marginTop: 4 }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: isProcessed ? "#22c55e" : node.color }} />
                      {node.status}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Real-Time Telemetry Bar inside Viewport */}
            <div style={{
              position: "absolute", bottom: 12, left: 16, right: 16,
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "8px 18px", borderRadius: 12,
              background: isDark ? "rgba(10, 2, 7, 0.85)" : "rgba(255, 255, 255, 0.9)",
              border: `1px solid ${border}`,
              fontSize: 11.5, color: textMuted, backdropFilter: "blur(10px)",
              flexWrap: "wrap", gap: 10
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <span><strong>Pipeline:</strong> {activeBlueprint.category}</span>
                <span><strong>Render FPS:</strong> <span style={{ color: "#22c55e", fontWeight: 700 }}>{activeBlueprint.telemetry.fps}</span></span>
                <span><strong>Resolution:</strong> {activeBlueprint.telemetry.resolution}</span>
                <span><strong>Latency:</strong> {activeBlueprint.telemetry.latency}</span>
              </div>
              <div style={{ color: accent, fontWeight: 600 }}>
                {activeBlueprint.telemetry.sync}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CORE ARCHITECTURAL PILLARS (DEEP DIVE) ── */}
      <section style={{ maxWidth: 1280, margin: "0 auto 80px", padding: "0 36px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 32, fontWeight: 800, margin: "0 0 10px" }}>
            Four Pillars of the Infinite Canvas
          </h2>
          <p style={{ fontSize: 14, color: textMuted, maxWidth: 640, margin: "0 auto" }}>
            Engineered from ground up to dismantle the boundaries between discrete graphic, video, and 3D applications.
          </p>
        </div>

        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 24
        }}>
          {[
            {
              pillar: "01",
              title: "Sub-Pixel Quadtree Space",
              tag: "PRECISION ENGINE",
              icon: Maximize2,
              color: "#38bdf8",
              desc: "64-bit floating-point spatial coordinate matrix allowing micro vector node editing at 3200% zoom alongside macro storyboard overviews at 1% zoom without rounding artifacts."
            },
            {
              pillar: "02",
              title: "Real-Time CRDT Presence",
              tag: "COLLABORATION",
              icon: Users,
              color: "#10b981",
              desc: "Sub-10ms conflict-free replicated data sync. Multiple team members can simultaneously edit video keyframes, adjust 3D shaders, and modify text without state locks."
            },
            {
              pillar: "03",
              title: "Universal Cross-Medium Piping",
              tag: "INTEROPERABILITY",
              icon: Zap,
              color: "#e1496d",
              desc: "Pipe 3D mockup viewport outputs directly into video timeline keyframe layers, or send vector brand tokens straight to neural prompt generators seamlessly."
            },
            {
              pillar: "04",
              title: "GPU Instanced Acceleration",
              tag: "HIGH PERFORMANCE",
              icon: Cpu,
              color: "#f59e0b",
              desc: "Hardware-accelerated WebGL / WebGPU canvas render loop capable of maintaining a stable 120 FPS across 100,000+ interactive vector nodes, textures, and video tracks."
            },
          ].map((p, i) => {
            const Icon = p.icon;
            return (
              <div
                key={i}
                style={{
                  background: surface,
                  border: `1.5px solid ${border}`,
                  borderRadius: 20,
                  padding: "32px 28px",
                  position: "relative",
                  transition: "all 0.25s ease",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between"
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = p.color;
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = border;
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 12,
                      background: `${p.color}20`, display: "flex", alignItems: "center", justifyContent: "center",
                      color: p.color
                    }}>
                      <Icon size={22} />
                    </div>
                    <span style={{
                      fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800,
                      color: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)"
                    }}>
                      {p.pillar}
                    </span>
                  </div>

                  <div style={{
                    fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
                    color: p.color, textTransform: "uppercase", marginBottom: 6
                  }}>
                    {p.tag}
                  </div>

                  <h3 style={{
                    fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700,
                    margin: "0 0 12px", color: textPrimary
                  }}>
                    {p.title}
                  </h3>

                  <p style={{ fontSize: 12.5, lineHeight: 1.6, color: textMuted, margin: 0 }}>
                    {p.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── TECHNICAL BENCHMARK COMPARISON MATRIX ── */}
      <section style={{ maxWidth: 1100, margin: "0 auto 80px", padding: "0 36px" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, margin: "0 0 8px" }}>
            Architectural Benchmark Comparison
          </h2>
          <p style={{ fontSize: 13.5, color: textMuted }}>
            How Creatify Infinite Studio stacks against traditional fragmented desktop tools.
          </p>
        </div>

        <div style={{
          background: surface,
          border: `1.5px solid ${border}`,
          borderRadius: 20,
          overflow: "hidden"
        }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 13 }}>
            <thead>
              <tr style={{
                background: isDark ? "rgba(225,73,109,0.1)" : "rgba(148,41,69,0.06)",
                borderBottom: `1.5px solid ${border}`
              }}>
                <th style={{ padding: "16px 24px", color: textPrimary, fontFamily: "'Syne', sans-serif", fontWeight: 700 }}>Architectural Capability</th>
                <th style={{ padding: "16px 24px", color: accent, fontFamily: "'Syne', sans-serif", fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
                  <InfinityIcon size={16} /> Creatify Infinite Studio
                </th>
                <th style={{ padding: "16px 24px", color: textMuted, fontFamily: "'Syne', sans-serif", fontWeight: 600 }}>Legacy Fragmented Apps</th>
              </tr>
            </thead>
            <tbody>
              {BENCHMARKS.map((b, i) => (
                <tr
                  key={i}
                  style={{
                    borderBottom: i < BENCHMARKS.length - 1 ? `1px solid ${border}` : "none",
                    background: i % 2 === 0 ? "transparent" : (isDark ? "rgba(255,255,255,0.015)" : "rgba(0,0,0,0.01)")
                  }}
                >
                  <td style={{ padding: "16px 24px", fontWeight: 600, color: textPrimary }}>{b.feature}</td>
                  <td style={{ padding: "16px 24px", color: "#22c55e", fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                    <Check size={16} color="#22c55e" />
                    {b.infiniteStudio}
                  </td>
                  <td style={{ padding: "16px 24px", color: textMuted }}>{b.legacyTools}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── PRESET STARTER WORKSPACES (LAUNCH BLUEPRINTS) ── */}
      <section style={{ maxWidth: 1280, margin: "0 auto 80px", padding: "0 36px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
          <div>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, margin: 0 }}>
              Curated Infinite Blueprints
            </h2>
            <p style={{ fontSize: 13.5, color: textMuted, margin: "4px 0 0" }}>
              Start your next multi-modal project from these battle-tested canvas node graphs.
            </p>
          </div>

          <button
            onClick={() => onNavigate && onNavigate("editor")}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "transparent", border: `1.5px solid ${accent}`,
              color: accent, padding: "8px 18px", borderRadius: 12,
              fontFamily: "'Poppins', sans-serif", fontSize: 12.5, fontWeight: 600,
              cursor: "pointer", transition: "all 0.18s"
            }}
            onMouseEnter={e => { e.currentTarget.style.background = accent; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = accent; }}
          >
            Create Blank Canvas <Plus size={14} />
          </button>
        </div>

        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 20
        }}>
          {STARTER_PRESETS.map((preset, i) => {
            const PresetIcon = preset.icon;
            return (
              <div
                key={i}
                style={{
                  background: surface,
                  border: `1.5px solid ${border}`,
                  borderRadius: 20,
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "all 0.2s ease",
                  cursor: "pointer"
                }}
                onClick={() => {
                  awardXP("CREATE_PROJECT", { detail: `Opened ${preset.title} Blueprint` });
                  if (onNavigate) onNavigate("editor");
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = preset.color;
                  e.currentTarget.style.transform = "translateY(-3px)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = border;
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: 10,
                      background: `${preset.color}20`, display: "flex", alignItems: "center", justifyContent: "center",
                      color: preset.color
                    }}>
                      <PresetIcon size={18} />
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: textMuted }}>
                      {preset.nodesCount} Nodes
                    </span>
                  </div>

                  <span style={{ fontSize: 10, fontWeight: 700, color: preset.color, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    {preset.category}
                  </span>

                  <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 700, margin: "6px 0 10px", color: textPrimary }}>
                    {preset.title}
                  </h3>

                  <p style={{ fontSize: 12, lineHeight: 1.55, color: textMuted, margin: 0 }}>
                    {preset.desc}
                  </p>
                </div>

                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  marginTop: 20, paddingTop: 14, borderTop: `1px solid ${border}`,
                  fontSize: 12, fontWeight: 600, color: preset.color
                }}>
                  <span>Open Blueprint</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── BOTTOM CALL TO ACTION ── */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "0 36px" }}>
        <div style={{
          background: isDark
            ? "linear-gradient(135deg, rgba(35, 10, 26, 0.95) 0%, rgba(18, 4, 14, 0.98) 100%)"
            : "linear-gradient(135deg, rgba(255, 240, 246, 0.98) 0%, rgba(254, 226, 238, 0.95) 100%)",
          border: `1.5px solid ${accent}`,
          borderRadius: 28,
          padding: "48px 40px",
          textAlign: "center",
          boxShadow: "0 20px 60px rgba(225,73,109,0.2)",
          position: "relative",
          overflow: "hidden"
        }}>
          <h2 style={{
            fontFamily: "'Syne', sans-serif", fontSize: "clamp(26px, 3.8vw, 42px)",
            fontWeight: 800, margin: "0 0 14px", color: textPrimary
          }}>
            Ready to Create Without Canvas Limits?
          </h2>
          <p style={{ fontSize: 15, color: textMuted, maxWidth: 600, margin: "0 auto 32px", lineHeight: 1.6 }}>
            Launch a clean infinite workspace or continue composing your multi-track productions directly in the browser.
          </p>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
            <button
              onClick={() => onNavigate && onNavigate("editor")}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "13px 32px", borderRadius: 14, border: "none",
                background: "linear-gradient(135deg, #e1496d, #942945)",
                color: "#fff", fontFamily: "'Syne', sans-serif", fontSize: 14.5, fontWeight: 700,
                cursor: "pointer", boxShadow: "0 6px 20px rgba(225,73,109,0.4)",
                transition: "all 0.2s"
              }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
            >
              <InfinityIcon size={18} />
              Launch Infinite Workspace
            </button>

            <button
              onClick={() => onNavigate && onNavigate("vault")}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "13px 28px", borderRadius: 14,
                background: "transparent", border: `1.5px solid ${border}`,
                color: textPrimary, fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 600,
                cursor: "pointer", transition: "all 0.2s"
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = accent}
              onMouseLeave={e => e.currentTarget.style.borderColor = border}
            >
              <FolderOpen size={16} />
              Browse Vault Masterpieces
            </button>
          </div>
        </div>
      </section>

      {/* Global CSS for animation */}
      <style>{`
        @keyframes cableFlow {
          from { stroke-dashoffset: 20; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
