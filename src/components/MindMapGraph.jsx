import React, { useState, useEffect, useRef } from "react";
import { Sparkles, Zap, Eye, Play, Layers, Clock, Cpu, HardDrive, Maximize2, ZoomIn, ZoomOut, RefreshCw } from "lucide-react";

export default function MindMapGraph({
  pastWorks = [],
  isDark,
  THEME,
  colors,
  onNavigate,
  user,
  onSwitchTab,
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animRef = useRef(null);
  const nodesRef = useRef([]);
  const edgesRef = useRef([]);
  const particlesRef = useRef([]);
  const timeRef = useRef(0);
  const hoveredNodeRef = useRef(null);
  const mouseRef = useRef({ x: -999, y: -999 });
  const [dimensions, setDimensions] = useState({ w: 900, h: 620 });
  const [selectedNode, setSelectedNode] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  const wineColor = THEME?.wine || "#e1496d";
  const strokeColor = isDark ? "#ff8da7" : "#831843";

  // TOOL ACCENT COLOR MAP
  const TOOL_COLORS = {
    "Video Editor": "#ef4444",
    "Presentations": "#3b82f6",
    "Logo Maker": "#10b981",
    "Whiteboard": "#a855f7",
    "Image Editor": "#f59e0b",
    "Documents": "#06b6d4",
    "Social Studio": "#ec4899",
    "AI Magic": "#8b5cf6",
    "Pipelines": "#e1496d",
    "3D Mockup": "#6366f1",
  };

  // Helper to extract 100% REAL attributes from a project
  const extractRealProjectAttributes = (proj) => {
    const attrs = [];

    // 1. Real tool format
    if (proj.tool) {
      attrs.push({
        id: "tool",
        label: proj.tool,
        type: "format",
        color: TOOL_COLORS[proj.tool] || "#e1496d",
      });
    }

    // 2. Real layer / track / slide count
    if (proj.data?.layers && Array.isArray(proj.data.layers)) {
      attrs.push({
        id: "layers",
        label: `${proj.data.layers.length} Layers`,
        type: "layers",
        color: "#38bdf8",
      });
    } else if (proj.data?.tracks && Array.isArray(proj.data.tracks)) {
      attrs.push({
        id: "tracks",
        label: `${proj.data.tracks.length} Audio/Video Tracks`,
        type: "tracks",
        color: "#38bdf8",
      });
    } else if (proj.data?.slides && Array.isArray(proj.data.slides)) {
      attrs.push({
        id: "slides",
        label: `${proj.data.slides.length} Slides`,
        type: "slides",
        color: "#38bdf8",
      });
    } else if (proj.data?.elements && Array.isArray(proj.data.elements)) {
      attrs.push({
        id: "elements",
        label: `${proj.data.elements.length} Vector Nodes`,
        type: "elements",
        color: "#38bdf8",
      });
    }

    // 3. Real Update Timestamp
    if (proj.updatedAt) {
      const dateStr = new Date(proj.updatedAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      });
      attrs.push({
        id: "date",
        label: dateStr,
        type: "date",
        color: "#22c55e",
      });
    } else if (proj.date) {
      attrs.push({
        id: "date",
        label: proj.date,
        type: "date",
        color: "#22c55e",
      });
    }

    // 4. Real Category / Tag
    if (proj.category && proj.category !== proj.tool) {
      attrs.push({
        id: "category",
        label: proj.category,
        type: "category",
        color: "#f59e0b",
      });
    }

    return attrs.slice(0, 3);
  };

  // Build Topology Graph from REAL pastWorks
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const W = container.offsetWidth || 900;
    const H = container.offsetHeight || 620;
    setDimensions({ w: W, h: H });

    const cx = W / 2;
    const cy = H / 2;
    const projects = (pastWorks || []).slice(0, 8);

    // Central Studio Engine Hub Node
    const hubNode = {
      id: "hub",
      label: "Studio Core",
      sublabel: user?.name ? `${user.name.split(" ")[0]}'s Engine` : "Local Sovereign",
      x: cx,
      y: cy,
      r: 48,
      color: wineColor,
      type: "hub",
      floatOffset: 0,
    };

    if (projects.length === 0) {
      nodesRef.current = [hubNode];
      edgesRef.current = [];
      return;
    }

    // Primary Project Nodes placed in an aesthetic golden orbit
    const mainNodes = projects.map((proj, i) => {
      const angle = (i / projects.length) * 2 * Math.PI - Math.PI / 2;
      const orbitR = Math.min(W, H - 80) * 0.32 + (i % 2 === 0 ? 0 : 25);
      const isRecent = proj.updatedAt
        ? Date.now() - new Date(proj.updatedAt).getTime() < 7 * 86400000
        : true;

      const attrs = extractRealProjectAttributes(proj);

      return {
        id: proj.id || `proj_${i}`,
        label: proj.title || "Untitled Creation",
        sublabel: proj.tool || proj.category || "Master Project",
        x: cx + orbitR * Math.cos(angle),
        y: cy + orbitR * Math.sin(angle),
        r: 36,
        color: TOOL_COLORS[proj.tool] || proj.accent || wineColor,
        type: "project",
        angle,
        isRecent,
        proj,
        attributes: attrs,
        floatOffset: (i * Math.PI) / 4,
      };
    });

    // Sub-Branch Nodes for Real Project Attributes
    const branchNodes = [];
    const edges = [];

    mainNodes.forEach((mn, mIdx) => {
      // Edge from Hub to Project
      edges.push({
        from: "hub",
        to: mn.id,
        type: "hub-to-main",
        pulses: [
          { t: 0.1 * mIdx, speed: 0.25 },
          { t: 0.5 + 0.1 * mIdx, speed: 0.25 },
        ],
        color: mn.color,
      });

      // Branch nodes around each project
      mn.attributes.forEach((attr, bIdx) => {
        const spread = mn.angle + (bIdx - (mn.attributes.length - 1) / 2) * 0.65;
        const dist = 76 + (bIdx % 2) * 12;
        const bx = Math.max(50, Math.min(W - 50, mn.x + dist * Math.cos(spread)));
        const by = Math.max(40, Math.min(H - 50, mn.y + dist * Math.sin(spread)));

        const bNodeId = `${mn.id}_attr_${bIdx}`;
        branchNodes.push({
          id: bNodeId,
          label: attr.label,
          x: bx,
          y: by,
          r: 16,
          color: attr.color,
          type: "attribute",
          parentId: mn.id,
          floatOffset: mIdx + bIdx * 0.8,
        });

        // Edge from Project to Attribute
        edges.push({
          from: mn.id,
          to: bNodeId,
          type: "main-to-branch",
          pulses: [{ t: 0.3 * bIdx, speed: 0.18 }],
          color: attr.color,
        });
      });
    });

    // Background cosmic floating particles
    const particles = Array.from({ length: 32 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 2 + 0.8,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      opacity: Math.random() * 0.35 + 0.15,
      color: [wineColor, "#38bdf8", "#f59e0b", "#22c55e"][Math.floor(Math.random() * 4)],
    }));

    nodesRef.current = [hubNode, ...mainNodes, ...branchNodes];
    edgesRef.current = edges;
    particlesRef.current = particles;
  }, [pastWorks, user, wineColor]);

  // High-Precision DPR Canvas Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;

    const hexRgba = (hex, a) => {
      if (!hex || hex.length < 7) return `rgba(225,73,109,${a})`;
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r},${g},${b},${a})`;
    };

    const roundRect = (x, y, w, h, r) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
    };

    const bezierPt = (ax, ay, cpx, cpy, bx, by, t) => ({
      x: (1 - t) * (1 - t) * ax + 2 * (1 - t) * t * cpx + t * t * bx,
      y: (1 - t) * (1 - t) * ay + 2 * (1 - t) * t * cpy + t * t * by,
    });

    const draw = () => {
      const { w, h } = dimensions;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr * zoomLevel, 0, 0, dpr * zoomLevel, (1 - zoomLevel) * (w / 2) * dpr, (1 - zoomLevel) * (h / 2) * dpr);
      ctx.clearRect(0, 0, w, h);

      if (!isPaused) {
        timeRef.current += 0.014;
      }
      const t = timeRef.current;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const nodeMap = {};
      nodesRef.current.forEach((n) => {
        nodeMap[n.id] = n;
      });

      // 1. Ambient Cosmic Dust Particles
      particlesRef.current.forEach((p) => {
        if (!isPaused) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0) p.x = w;
          if (p.x > w) p.x = 0;
          if (p.y < 0) p.y = h;
          if (p.y > h) p.y = 0;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = hexRgba(p.color, p.opacity * 0.4);
        ctx.fill();
      });

      // 2. Gentle Floating Physics
      if (!isPaused) {
        nodesRef.current.forEach((n) => {
          if (n.type === "attribute") {
            n.x += Math.sin(t * 0.8 + n.floatOffset) * 0.18;
            n.y += Math.cos(t * 0.6 + n.floatOffset) * 0.15;
          } else if (n.type === "project") {
            n.x += Math.sin(t * 0.4 + n.floatOffset) * 0.08;
            n.y += Math.cos(t * 0.35 + n.floatOffset) * 0.08;
          }
        });
      }

      // 3. Draw Laser Optical Edges with Data Pulses
      edgesRef.current.forEach((edge) => {
        const a = nodeMap[edge.from];
        const b = nodeMap[edge.to];
        if (!a || !b) return;

        const isHubEdge = edge.type === "hub-to-main";
        const cpx = (a.x + b.x) / 2 + (b.y - a.y) * 0.12;
        const cpy = (a.y + b.y) / 2 - (b.x - a.x) * 0.12;

        // Gradient Stroke
        const lg = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
        lg.addColorStop(0, hexRgba(a.color, isHubEdge ? 0.35 : 0.2));
        lg.addColorStop(1, hexRgba(b.color, isHubEdge ? 0.25 : 0.12));

        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.quadraticCurveTo(cpx, cpy, b.x, b.y);
        ctx.strokeStyle = lg;
        ctx.lineWidth = isHubEdge ? 2 : 1.2;
        ctx.setLineDash(isHubEdge ? [] : [4, 6]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Flowing Data Packet Orbs
        edge.pulses.forEach((pulse) => {
          if (!isPaused) {
            pulse.t = (pulse.t + pulse.speed * 0.012) % 1;
          }
          const pt = bezierPt(a.x, a.y, cpx, cpy, b.x, b.y, pulse.t);

          if (isHubEdge) {
            const orb = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, 8);
            orb.addColorStop(0, hexRgba(edge.color, 0.95));
            orb.addColorStop(0.5, hexRgba(edge.color, 0.45));
            orb.addColorStop(1, hexRgba(edge.color, 0));
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 8, 0, Math.PI * 2);
            ctx.fillStyle = orb;
            ctx.fill();

            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 2.2, 0, Math.PI * 2);
            ctx.fillStyle = "#ffffff";
            ctx.fill();
          } else {
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 2.8, 0, Math.PI * 2);
            ctx.fillStyle = hexRgba(b.color, 0.75);
            ctx.fill();
          }
        });
      });

      // 4. Draw Nodes (Hub, Project Master, Real Attributes)
      nodesRef.current.forEach((n) => {
        const isHov = hoveredNodeRef.current === n.id;
        const isSel = selectedNode?.id === n.id;
        const r = n.r * (isHov ? 1.12 : isSel ? 1.08 : 1);
        const prox = Math.max(0, 1 - Math.hypot(n.x - mx, n.y - my) / 160);

        if (n.type === "hub") {
          // Central Studio Engine Halo
          for (let ring = 3; ring >= 1; ring--) {
            const rr = r + 16 + ring * 14 + Math.sin(t * 0.8 + ring * 1.2) * 4;
            ctx.beginPath();
            ctx.arc(n.x, n.y, rr, 0, Math.PI * 2);
            ctx.strokeStyle = hexRgba(n.color, 0.08 / ring);
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }

          // Outer Radiant Glow
          const gw = ctx.createRadialGradient(n.x, n.y, r * 0.3, n.x, n.y, r + 35);
          gw.addColorStop(0, hexRgba(n.color, 0.45));
          gw.addColorStop(1, hexRgba(n.color, 0));
          ctx.beginPath();
          ctx.arc(n.x, n.y, r + 35, 0, Math.PI * 2);
          ctx.fillStyle = gw;
          ctx.fill();

          // Core Body
          const bd = ctx.createRadialGradient(n.x - r * 0.25, n.y - r * 0.25, 0, n.x, n.y, r);
          bd.addColorStop(0, hexRgba(n.color, 1));
          bd.addColorStop(0.7, hexRgba(n.color, 0.85));
          bd.addColorStop(1, isDark ? "#170511" : "#500d24");

          ctx.beginPath();
          ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
          ctx.fillStyle = bd;
          ctx.shadowColor = n.color;
          ctx.shadowBlur = 20 + Math.sin(t * 1.5) * 5;
          ctx.fill();
          ctx.shadowBlur = 0;

          // Inner Glass Highlight Rim
          ctx.strokeStyle = "rgba(255,255,255,0.3)";
          ctx.lineWidth = 1.8;
          ctx.stroke();

          // Hub Typography
          ctx.fillStyle = "#ffffff";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.font = `800 12px 'Syne', sans-serif`;
          ctx.fillText("CREATIFY", n.x, n.y - 7);
          ctx.font = `600 8.5px 'Poppins', sans-serif`;
          ctx.fillStyle = "rgba(255,255,255,0.75)";
          ctx.fillText("MASTER CORE", n.x, n.y + 8);

        } else if (n.type === "project") {
          // Project Halo
          const halo = ctx.createRadialGradient(n.x, n.y, r * 0.4, n.x, n.y, r + 20 + prox * 8);
          halo.addColorStop(0, hexRgba(n.color, 0.25 + prox * 0.1));
          halo.addColorStop(1, hexRgba(n.color, 0));
          ctx.beginPath();
          ctx.arc(n.x, n.y, r + 20, 0, Math.PI * 2);
          ctx.fillStyle = halo;
          ctx.fill();

          // Solid Glass Chassis
          ctx.beginPath();
          ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
          ctx.fillStyle = isDark ? "#180612" : "#ffffff";
          ctx.shadowColor = n.color;
          ctx.shadowBlur = isHov ? 26 : 10 + prox * 10;
          ctx.fill();
          ctx.shadowBlur = 0;

          // Perimeter Ring
          ctx.beginPath();
          ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
          ctx.strokeStyle = isHov || isSel ? n.color : hexRgba(n.color, 0.65);
          ctx.lineWidth = isHov ? 2.8 : 2;
          ctx.stroke();

          // Active/Recent Indicator Beacon
          if (n.isRecent) {
            ctx.beginPath();
            ctx.arc(n.x + r * 0.68, n.y - r * 0.68, 4.5, 0, Math.PI * 2);
            ctx.fillStyle = "#22c55e";
            ctx.shadowColor = "#22c55e";
            ctx.shadowBlur = 8;
            ctx.fill();
            ctx.shadowBlur = 0;
          }

          // Truncated Project Title & Format Labels
          const mw = r * 1.5;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = isDark ? "#ffffff" : "#1a040d";
          ctx.font = `700 9px 'Syne', sans-serif`;

          let lbl = n.label;
          while (ctx.measureText(lbl).width > mw && lbl.length > 3) lbl = lbl.slice(0, -1);
          if (lbl !== n.label) lbl += "…";
          ctx.fillText(lbl, n.x, n.y - 6);

          ctx.font = `600 7.5px 'Poppins', sans-serif`;
          ctx.fillStyle = n.color;
          let sub = n.sublabel;
          while (ctx.measureText(sub).width > mw && sub.length > 3) sub = sub.slice(0, -1);
          if (sub !== n.sublabel) sub += "…";
          ctx.fillText(sub, n.x, n.y + 7);

        } else if (n.type === "attribute") {
          // Sub-Attribute Badge (Real Data Tag)
          const pw = 84;
          const ph = 22;
          const pr = 9;

          // Shadow & Body
          ctx.fillStyle = isDark ? "#220a1a" : "#ffffff";
          roundRect(n.x - pw / 2, n.y - ph / 2, pw, ph, pr);
          ctx.fill();

          ctx.strokeStyle = hexRgba(n.color, isHov ? 0.9 : 0.45);
          ctx.lineWidth = isHov ? 1.8 : 1.2;
          ctx.stroke();

          // Color Dot
          ctx.beginPath();
          ctx.arc(n.x - pw / 2 + 10, n.y, 3.5, 0, Math.PI * 2);
          ctx.fillStyle = n.color;
          ctx.fill();

          // Label
          ctx.textBaseline = "middle";
          ctx.textAlign = "left";
          ctx.fillStyle = isDark ? "rgba(255,255,255,0.88)" : "rgba(35,8,18,0.85)";
          ctx.font = `600 8px 'Poppins', sans-serif`;

          let bl = n.label;
          while (ctx.measureText(bl).width > pw - 22 && bl.length > 3) bl = bl.slice(0, -1);
          if (bl !== n.label) bl += "…";
          ctx.fillText(bl, n.x - pw / 2 + 18, n.y);
        }
      });

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [dimensions, isDark, zoomLevel, isPaused, selectedNode]);

  // Handle Mouse Hover & Click
  const handleMouseMove = (e) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mx = (e.clientX - rect.left) / zoomLevel;
    const my = (e.clientY - rect.top) / zoomLevel;
    mouseRef.current = { x: mx, y: my };

    let found = null;
    for (const n of nodesRef.current) {
      const hitR = n.type === "attribute" ? 38 : n.r + 6;
      if (Math.hypot(n.x - mx, n.y - my) < hitR) {
        found = n;
        break;
      }
    }
    hoveredNodeRef.current = found?.id || null;
    if (canvasRef.current) canvasRef.current.style.cursor = found ? "pointer" : "default";
  };

  const handleCanvasClick = () => {
    const n = nodesRef.current.find((x) => x.id === hoveredNodeRef.current);
    if (!n) {
      setSelectedNode(null);
      return;
    }
    if (n.type === "project") {
      setSelectedNode(n);
    } else if (n.type === "attribute" && n.parentId) {
      const parent = nodesRef.current.find((p) => p.id === n.parentId);
      if (parent) setSelectedNode(parent);
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        height: "620px",
        background: "transparent",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      {/* Interactive DPR Canvas */}
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", inset: 0, display: "block" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          hoveredNodeRef.current = null;
          mouseRef.current = { x: -999, y: -999 };
          if (canvasRef.current) canvasRef.current.style.cursor = "default";
        }}
        onClick={handleCanvasClick}
      />

      {/* ── TOP-LEFT: REAL ECOSYSTEM TELEMETRY HUD ── */}
      <div style={{ position: "absolute", top: 18, left: 20, zIndex: 10, display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "7px 14px",
            borderRadius: 12,
            background: isDark ? "rgba(22, 7, 16, 0.85)" : "rgba(255, 255, 255, 0.9)",
            border: `1px solid ${isDark ? "rgba(225, 73, 109, 0.3)" : "rgba(148, 41, 69, 0.15)"}`,
            backdropFilter: "blur(16px)",
            boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
          }}
        >
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 8px #22c55e" }} />
          <span style={{ fontSize: 11, fontWeight: 700, fontFamily: "'Poppins', sans-serif", color: isDark ? "#ffffff" : "#1a040d" }}>
            Living Topology • {pastWorks.length} Active Master Roots
          </span>
        </div>
      </div>

      {/* ── TOP-RIGHT: VIEW CONTROLS (ZOOM + PAUSE) ── */}
      <div style={{ position: "absolute", top: 18, right: 20, zIndex: 10, display: "flex", alignItems: "center", gap: 8 }}>
        <button
          onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.1))}
          title="Zoom In"
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: isDark ? "rgba(22, 7, 16, 0.85)" : "rgba(255, 255, 255, 0.9)",
            border: `1px solid ${isDark ? "rgba(225, 73, 109, 0.25)" : "rgba(148, 41, 69, 0.15)"}`,
            color: isDark ? "#ffffff" : "#1a040d",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <ZoomIn size={14} />
        </button>

        <button
          onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.1))}
          title="Zoom Out"
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: isDark ? "rgba(22, 7, 16, 0.85)" : "rgba(255, 255, 255, 0.9)",
            border: `1px solid ${isDark ? "rgba(225, 73, 109, 0.25)" : "rgba(148, 41, 69, 0.15)"}`,
            color: isDark ? "#ffffff" : "#1a040d",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <ZoomOut size={14} />
        </button>

        <button
          onClick={() => setZoomLevel(1)}
          title="Reset View"
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: isDark ? "rgba(22, 7, 16, 0.85)" : "rgba(255, 255, 255, 0.9)",
            border: `1px solid ${isDark ? "rgba(225, 73, 109, 0.25)" : "rgba(148, 41, 69, 0.15)"}`,
            color: isDark ? "#ffffff" : "#1a040d",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <RefreshCw size={13} />
        </button>
      </div>

      {/* ── FLOATING PROJECT INSPECTION MODAL (WHEN A PROJECT IS CLICKED) ── */}
      {selectedNode && selectedNode.proj && (
        <div
          style={{
            position: "absolute",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 20,
            padding: "16px 22px",
            borderRadius: 18,
            background: isDark ? "rgba(22, 8, 18, 0.94)" : "rgba(255, 255, 255, 0.96)",
            border: `1.5px solid ${selectedNode.color}`,
            backdropFilter: "blur(24px)",
            boxShadow: `0 16px 45px ${selectedNode.color}35`,
            display: "flex",
            alignItems: "center",
            gap: 18,
            minWidth: 380,
            maxWidth: 520,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: `linear-gradient(135deg, ${selectedNode.color}, ${selectedNode.color}99)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              boxShadow: `0 6px 16px ${selectedNode.color}40`,
            }}
          >
            <Sparkles size={20} />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, fontFamily: "'Poppins', sans-serif", color: selectedNode.color, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              {selectedNode.proj.tool || selectedNode.proj.category || "Master Project"}
            </div>
            <h4
              style={{
                margin: "2px 0 4px",
                fontFamily: "Syne, sans-serif",
                fontSize: 15,
                fontWeight: 800,
                color: isDark ? "#ffffff" : "#1a040d",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {selectedNode.proj.title || "Untitled Creation"}
            </h4>
            <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 11, color: isDark ? "rgba(255,255,255,0.6)" : "rgba(35,8,18,0.6)", fontFamily: "'Instrument Sans', sans-serif" }}>
              <span>{selectedNode.proj.updatedAt ? new Date(selectedNode.proj.updatedAt).toLocaleDateString() : "Saved Sovereign"}</span>
              <span>•</span>
              <span>{selectedNode.attributes.map((a) => a.label).join(" • ")}</span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              onClick={() => {
                if (onSwitchTab) onSwitchTab("vault");
              }}
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                background: "linear-gradient(135deg, #e1496d, #942945)",
                border: "none",
                color: "#ffffff",
                fontSize: 12,
                fontWeight: 700,
                fontFamily: "Syne, sans-serif",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(225,73,109,0.35)",
              }}
            >
              View in Vault →
            </button>
            <button
              onClick={() => setSelectedNode(null)}
              style={{ background: "none", border: "none", color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)", cursor: "pointer", fontSize: 14 }}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Empty State when zero projects exist */}
      {pastWorks.length === 0 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            pointerEvents: "none",
          }}
        >
          <div style={{ fontSize: 36, opacity: 0.35 }}>✨</div>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)", fontFamily: "'Poppins', sans-serif" }}>
            Create your first master project to illuminate the neural topology graph
          </div>
        </div>
      )}
    </div>
  );
}
