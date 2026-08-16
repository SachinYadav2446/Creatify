import React, { useState, useRef, useEffect, useCallback } from "react";
import { 
  ArrowLeft, Play, Plus, Trash2, Cpu, Zap, Sparkles, 
  Layers, Download, RefreshCw, ZoomIn, ZoomOut, Check, Terminal, Eye,
  Code, Copy, Shield, GitBranch, Cloud, Share2, Settings, Box,
  CheckCircle2, AlertCircle, FileCode, Clock, ArrowRight, X, ChevronRight
} from "lucide-react";

export default function WorkflowPipelines({ onBack, onNavigate, user }) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 60, y: 40 });
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const [selectedNodeId, setSelectedNodeId] = useState("node_2");
  const [draggingNodeId, setDraggingNodeId] = useState(null);
  const [nodeOffset, setNodeOffset] = useState({ x: 0, y: 0 });
  
  // Wire creation state
  const [connectingFrom, setConnectingFrom] = useState(null); // { nodeId, portId, x, y }
  const [connectingMousePos, setConnectingMousePos] = useState({ x: 0, y: 0 });

  // Execution engine state
  const [isRunning, setIsRunning] = useState(false);
  const [executionLogs, setExecutionLogs] = useState([]);
  const [outputDrawerOpen, setOutputDrawerOpen] = useState(false);
  const [showAddNodeModal, setShowAddNodeModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeBlueprintPreset, setActiveBlueprintPreset] = useState("release_ci");

  // ── Pre-Built Developer Blueprints ──
  const BLUEPRINT_PRESETS = {
    release_ci: {
      name: "Release Asset CI/CD Automation",
      desc: "Git tag push -> 3D Terminal Bake -> Lossless 4K PNG -> README.md update",
      nodes: [
        {
          id: "node_1",
          title: "GitHub Release Trigger",
          category: "trigger",
          type: "Webhook Trigger",
          x: 60,
          y: 120,
          inputs: [],
          outputs: [{ id: "out_tag", label: "Release Tag / Commit" }],
          params: { event: "release.published", branch: "main", repo: "creatify-engine/core" },
          status: "ready",
          color: "#38bdf8",
        },
        {
          id: "node_2",
          title: "AST Code Syntax Styler",
          category: "processor",
          type: "Code Tokenizer",
          x: 420,
          y: 80,
          inputs: [{ id: "in_code", label: "Source Code" }],
          outputs: [{ id: "out_tokens", label: "Highlighted AST" }],
          params: { theme: "Synthwave 84", language: "TypeScript", font: "JetBrains Mono" },
          status: "ready",
          color: "#e1496d",
        },
        {
          id: "node_3",
          title: "3D Terminal Raytracer Bake",
          category: "processor",
          type: "WebGL PBR Renderer",
          x: 780,
          y: 60,
          inputs: [{ id: "in_tokens", label: "AST Texture" }],
          outputs: [{ id: "out_render", label: "4K Lossless PNG" }],
          params: { rig: "Terminal Window (CLI)", lighting: "Cyberpunk Neon", metalness: 0.8 },
          status: "ready",
          color: "#c084fc",
        },
        {
          id: "node_4",
          title: "GitHub README Injector",
          category: "output",
          type: "Git Bot Committer",
          x: 1140,
          y: 80,
          inputs: [{ id: "in_render", label: "Image Asset" }],
          outputs: [{ id: "out_commit", label: "Commit SHA" }],
          params: { targetFile: "README.md", section: "<!-- Hero Mockup -->" },
          status: "ready",
          color: "#22c55e",
        },
      ],
      wires: [
        { id: "w1", fromNode: "node_1", fromPort: "out_tag", toNode: "node_2", toPort: "in_code" },
        { id: "w2", fromNode: "node_2", fromPort: "out_tokens", toNode: "node_3", toPort: "in_tokens" },
        { id: "w3", fromNode: "node_3", fromPort: "out_render", toNode: "node_4", toPort: "in_render" },
      ],
    },
    social_hero: {
      name: "Social Media Hero Banner Generator",
      desc: "PR merged -> LLM summary -> 3D Perspective Card -> Twitter & Discord OG Image",
      nodes: [
        {
          id: "node_10",
          title: "GitHub PR Merge Trigger",
          category: "trigger",
          type: "PR Webhook",
          x: 60,
          y: 140,
          inputs: [],
          outputs: [{ id: "out_pr", label: "PR Metadata" }],
          params: { event: "pull_request.closed", filterMerged: true },
          status: "ready",
          color: "#38bdf8",
        },
        {
          id: "node_11",
          title: "AI Feature Summarizer",
          category: "processor",
          type: "LLM Agent",
          x: 420,
          y: 100,
          inputs: [{ id: "in_meta", label: "Commit Logs" }],
          outputs: [{ id: "out_summary", label: "Headline & Tags" }],
          params: { model: "Gemini 2.5 Flash", maxTokens: 80 },
          status: "ready",
          color: "#ff8da7",
        },
        {
          id: "node_12",
          title: "Ray.so Glass Card Bake",
          category: "processor",
          type: "3D Shader Engine",
          x: 780,
          y: 80,
          inputs: [{ id: "in_headline", label: "Headline Text" }],
          outputs: [{ id: "out_og", label: "1200x630 OG Image" }],
          params: { rig: "Ray.so Glass Scribe Card", transmission: 0.85 },
          status: "ready",
          color: "#e1496d",
        },
        {
          id: "node_13",
          title: "Discord & Twitter Webhook",
          category: "output",
          type: "Social Publisher",
          x: 1140,
          y: 100,
          inputs: [{ id: "in_og", label: "OG Image Buffer" }],
          outputs: [{ id: "out_status", label: "HTTP 200 OK" }],
          params: { channels: ["#announcements", "#changelog"] },
          status: "ready",
          color: "#22c55e",
        },
      ],
      wires: [
        { id: "w10", fromNode: "node_10", fromPort: "out_pr", toNode: "node_11", toPort: "in_meta" },
        { id: "w11", fromNode: "node_11", fromPort: "out_summary", toNode: "node_12", toPort: "in_headline" },
        { id: "w12", fromNode: "node_12", fromPort: "out_og", toNode: "node_13", toPort: "in_og" },
      ],
    },
    brand_matrix: {
      name: "Brand Favicon & Icon Matrix",
      desc: "Master SVG -> Multi-resolution rasterizer -> React JSX component -> PWA Manifest",
      nodes: [
        {
          id: "node_20",
          title: "Master SVG Vector Input",
          category: "trigger",
          type: "Vector Asset",
          x: 60,
          y: 120,
          inputs: [],
          outputs: [{ id: "out_svg", label: "Clean Vector SVG" }],
          params: { viewBox: "0 0 512 512", optimizePaths: true },
          status: "ready",
          color: "#38bdf8",
        },
        {
          id: "node_21",
          title: "Favicon Multi-Pack Rasterizer",
          category: "processor",
          type: "Image Resizer",
          x: 420,
          y: 60,
          inputs: [{ id: "in_svg", label: "SVG Vector" }],
          outputs: [{ id: "out_ico", label: "ICO + PNG Bundle" }],
          params: { sizes: [16, 32, 64, 192, 512], format: "PNG / ICO" },
          status: "ready",
          color: "#f59e0b",
        },
        {
          id: "node_22",
          title: "React / JSX Component Compiler",
          category: "processor",
          type: "AST Vector Compiler",
          x: 420,
          y: 280,
          inputs: [{ id: "in_svg", label: "SVG Vector" }],
          outputs: [{ id: "out_jsx", label: "React Component" }],
          params: { typescript: true, forwardRef: true, propsInterface: "LucideProps" },
          status: "ready",
          color: "#c084fc",
        },
        {
          id: "node_23",
          title: "npm Package & PWA Publisher",
          category: "output",
          type: "Package Publisher",
          x: 840,
          y: 160,
          inputs: [
            { id: "in_bundle", label: "Icon Bundle" },
            { id: "in_components", label: "React Components" }
          ],
          outputs: [{ id: "out_npm", label: "npm v1.0.0" }],
          params: { packageName: "@mybrand/icons", registry: "npm" },
          status: "ready",
          color: "#22c55e",
        },
      ],
      wires: [
        { id: "w20", fromNode: "node_20", fromPort: "out_svg", toNode: "node_21", toPort: "in_svg" },
        { id: "w21", fromNode: "node_20", fromPort: "out_svg", toNode: "node_22", toPort: "in_svg" },
        { id: "w22", fromNode: "node_21", fromPort: "out_ico", toNode: "node_23", toPort: "in_bundle" },
        { id: "w23", fromNode: "node_22", fromPort: "out_jsx", toNode: "node_23", toPort: "in_components" },
      ],
    },
  };

  const [nodes, setNodes] = useState(BLUEPRINT_PRESETS.release_ci.nodes);
  const [wires, setWires] = useState(BLUEPRINT_PRESETS.release_ci.wires);

  // Switch blueprint preset
  const loadBlueprint = (presetKey) => {
    setActiveBlueprintPreset(presetKey);
    const p = BLUEPRINT_PRESETS[presetKey];
    if (!p) return;
    setNodes(p.nodes);
    setWires(p.wires);
    setSelectedNodeId(p.nodes[1]?.id || p.nodes[0]?.id);
    setExecutionLogs([]);
  };

  // Node catalog for "+ Add Node" modal
  const NODE_CATALOG = [
    { title: "GitHub Webhook Trigger", category: "trigger", type: "Webhook", color: "#38bdf8", inputs: [], outputs: [{ id: "out_payload", label: "Payload" }], params: { event: "push" } },
    { title: "Cron Schedule Trigger", category: "trigger", type: "Timer", color: "#38bdf8", inputs: [], outputs: [{ id: "out_tick", label: "Trigger Tick" }], params: { cron: "0 0 * * *" } },
    { title: "AST Code Syntax Styler", category: "processor", type: "Code Tokenizer", color: "#e1496d", inputs: [{ id: "in_code", label: "Code" }], outputs: [{ id: "out_tokens", label: "AST Tokens" }], params: { theme: "Synthwave 84" } },
    { title: "3D Terminal Raytracer Bake", category: "processor", type: "WebGL PBR", color: "#c084fc", inputs: [{ id: "in_tex", label: "Texture" }], outputs: [{ id: "out_png", label: "4K PNG" }], params: { rig: "Terminal Window (CLI)" } },
    { title: "AI Screenplay & Summary LLM", category: "processor", type: "LLM Agent", color: "#ff8da7", inputs: [{ id: "in_prompt", label: "Prompt" }], outputs: [{ id: "out_text", label: "Generated Text" }], params: { model: "Gemini 2.5" } },
    { title: "SVG Vectorizer & Cleaner", category: "processor", type: "Vector Tracing", color: "#f59e0b", inputs: [{ id: "in_raster", label: "Image" }], outputs: [{ id: "out_svg", label: "Clean SVG" }], params: { precision: 2 } },
    { title: "AWS S3 / Cloudflare R2 Upload", category: "output", type: "Cloud Storage", color: "#22c55e", inputs: [{ id: "in_file", label: "Asset File" }], outputs: [{ id: "out_url", label: "CDN Public URL" }], params: { bucket: "creatify-assets" } },
    { title: "GitHub Release Committer", category: "output", type: "Git Bot", color: "#22c55e", inputs: [{ id: "in_asset", label: "Build Artifact" }], outputs: [{ id: "out_sha", label: "Commit SHA" }], params: { repo: "org/repo" } },
  ];

  // ── Sequential Pipeline Execution Simulation ──
  const runPipeline = () => {
    if (isRunning) return;
    setIsRunning(true);
    setExecutionLogs(["[00:00.000] 🚀 Initializing Creatify Pipeline Runtime v2.4..."]);
    setOutputDrawerOpen(true);

    // Reset statuses
    setNodes(prev => prev.map(n => ({ ...n, status: "queued" })));

    let delay = 350;
    nodes.forEach((n, idx) => {
      // Step 1: Active
      setTimeout(() => {
        setNodes(prev => prev.map(item => item.id === n.id ? { ...item, status: "running" } : item));
        setExecutionLogs(prev => [
          ...prev,
          `[00:0${(idx * 0.4).toFixed(3)}] ⚡ Executing [${n.title}] (${n.type})...`,
        ]);
      }, delay);

      // Step 2: Complete
      delay += 800;
      setTimeout(() => {
        setNodes(prev => prev.map(item => item.id === n.id ? { ...item, status: "done" } : item));
        setExecutionLogs(prev => [
          ...prev,
          `[00:0${((idx + 1) * 0.4).toFixed(3)}] ✓ [${n.title}] Completed in ${(Math.random() * 18 + 8).toFixed(1)}ms (HTTP 200 OK)`,
        ]);

        if (idx === nodes.length - 1) {
          setIsRunning(false);
          setExecutionLogs(prev => [
            ...prev,
            `[00:0${((idx + 2) * 0.4).toFixed(3)}] 🏁 Pipeline DAG execution finished successfully with 0 errors!`,
          ]);
        }
      }, delay);
    });
  };

  // ── Canvas Dragging Handlers ──
  const handleMouseDownCanvas = (e) => {
    if (e.target.closest(".blueprint-node") || e.target.closest(".node-port")) return;
    setIsDraggingCanvas(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMoveCanvas = (e) => {
    if (isDraggingCanvas) {
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    } else if (draggingNodeId) {
      setNodes(prev => prev.map(n => {
        if (n.id === draggingNodeId) {
          return {
            ...n,
            x: (e.clientX - pan.x) / zoom - nodeOffset.x,
            y: (e.clientY - pan.y) / zoom - nodeOffset.y,
          };
        }
        return n;
      }));
    } else if (connectingFrom) {
      setConnectingMousePos({
        x: (e.clientX - pan.x) / zoom,
        y: (e.clientY - pan.y) / zoom,
      });
    }
  };

  const handleMouseUpCanvas = () => {
    setIsDraggingCanvas(false);
    setDraggingNodeId(null);
    setConnectingFrom(null);
  };

  // Node Drag
  const handleNodeMouseDown = (e, nodeId, nodeX, nodeY) => {
    e.stopPropagation();
    setSelectedNodeId(nodeId);
    setDraggingNodeId(nodeId);
    setNodeOffset({
      x: (e.clientX - pan.x) / zoom - nodeX,
      y: (e.clientY - pan.y) / zoom - nodeY,
    });
  };

  // Start wire connection
  const handlePortMouseDown = (e, nodeId, portId, isOutput, nodeX, nodeY) => {
    e.stopPropagation();
    if (!isOutput) return; // Drag from output to input
    setConnectingFrom({
      nodeId,
      portId,
      startX: nodeX + 220,
      startY: nodeY + 54,
    });
    setConnectingMousePos({
      x: (e.clientX - pan.x) / zoom,
      y: (e.clientY - pan.y) / zoom,
    });
  };

  // Finish wire connection on target port
  const handlePortMouseUp = (e, toNodeId, toPortId, isInput) => {
    e.stopPropagation();
    if (connectingFrom && isInput && connectingFrom.nodeId !== toNodeId) {
      // Check if wire already exists
      const exists = wires.some(w => w.fromNode === connectingFrom.nodeId && w.toNode === toNodeId);
      if (!exists) {
        setWires(prev => [
          ...prev,
          {
            id: `w_${Date.now()}`,
            fromNode: connectingFrom.nodeId,
            fromPort: connectingFrom.portId,
            toNode: toNodeId,
            toPort: toPortId,
          }
        ]);
      }
    }
    setConnectingFrom(null);
  };

  // Delete wire
  const deleteWire = (wireId, e) => {
    if (e) e.stopPropagation();
    setWires(prev => prev.filter(w => w.id !== wireId));
  };

  // Add new node
  const handleAddNode = (template) => {
    const newNode = {
      id: `node_${Date.now()}`,
      title: template.title,
      category: template.category,
      type: template.type,
      x: (-pan.x + 400) / zoom,
      y: (-pan.y + 200) / zoom,
      inputs: template.inputs,
      outputs: template.outputs,
      params: { ...template.params },
      status: "ready",
      color: template.color,
    };
    setNodes(prev => [...prev, newNode]);
    setSelectedNodeId(newNode.id);
    setShowAddNodeModal(false);
  };

  // Delete node
  const handleDeleteNode = (nodeId, e) => {
    if (e) e.stopPropagation();
    setNodes(prev => prev.filter(n => n.id !== nodeId));
    setWires(prev => prev.filter(w => w.fromNode !== nodeId && w.toNode !== nodeId));
    if (selectedNodeId === nodeId) setSelectedNodeId(null);
  };

  // Selected Node Details
  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  // Generate Executable Script / YAML for Export Modal
  const generateExportCode = () => {
    return `# 🚀 GitHub Actions Workflow generated by Creatify Pipelines
name: Creatify Creative CI/CD
on:
  push:
    tags:
      - 'v*'
  workflow_dispatch:

jobs:
  bake-assets:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Source Code
        uses: actions/checkout@v4

      - name: Setup Node.js & GPU Shaders
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Execute Creatify Pipeline DAG
        run: |
          npx @creatify/cli run-pipeline --blueprint ./creatify.pipeline.json --output ./assets/mockup.png

      - name: Commit & Push High-Resolution Assets
        uses: stefanzweifel/git-auto-commit-action@v5
        with:
          commit_message: "chore: auto-generate 4K 3D release mockup [skip ci]"
          file_pattern: "assets/*.png README.md"`;
  };

  const copyExportSnippet = () => {
    navigator.clipboard.writeText(generateExportCode());
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  return (
    <div style={{
      height: "100vh", width: "100vw", overflow: "hidden",
      background: "#070208", color: "#f3f4f6",
      fontFamily: "'Instrument Sans', sans-serif",
      display: "flex", flexDirection: "column",
      userSelect: "none",
    }}
    onMouseMove={handleMouseMoveCanvas}
    onMouseUp={handleMouseUpCanvas}
    >
      
      {/* ── Top Navigation Bar ── */}
      <header style={{
        height: 54, padding: "0 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        borderBottom: "1px solid rgba(225, 73, 109, 0.22)",
        background: "rgba(12, 4, 10, 0.94)", backdropFilter: "blur(18px)",
        zIndex: 50,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button
            onClick={onBack}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "rgba(225, 73, 109, 0.14)", border: "1px solid rgba(225, 73, 109, 0.35)",
              color: "#ff8da7", borderRadius: 8, padding: "6px 12px",
              cursor: "pointer", fontSize: 12, fontWeight: 700,
            }}
          >
            <ArrowLeft size={14} /> Back
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontFamily: "Syne, sans-serif", fontSize: 16, fontWeight: 800, color: "#fff" }}>
              Creative CI/CD Workflow Pipelines
            </span>
            <span style={{
              fontSize: 9, padding: "2px 8px", borderRadius: 99,
              background: "rgba(56, 189, 248, 0.15)", color: "#38bdf8",
              border: "1px solid rgba(56, 189, 248, 0.4)", fontWeight: 800,
              letterSpacing: "0.06em",
            }}>
              NODE BLUEPRINT RUNTIME
            </span>
          </div>
        </div>

        {/* Blueprint Presets Switcher */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.04)", padding: "3px 6px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)" }}>
          {[
            { id: "release_ci", label: "Release Asset CI/CD" },
            { id: "social_hero", label: "Social Hero Banner" },
            { id: "brand_matrix", label: "Favicon Matrix" },
          ].map(p => (
            <button
              key={p.id}
              onClick={() => loadBlueprint(p.id)}
              style={{
                padding: "4px 10px", borderRadius: 6,
                background: activeBlueprintPreset === p.id ? "#e1496d" : "transparent",
                border: "none", color: "#ffffff",
                fontSize: 11, fontWeight: activeBlueprintPreset === p.id ? 700 : 500,
                cursor: "pointer", transition: "all 0.2s ease",
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Action Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Zoom controls */}
          <div style={{ display: "flex", alignItems: "center", background: "rgba(255,255,255,0.06)", borderRadius: 8, padding: 2 }}>
            <button
              onClick={() => setZoom(z => Math.max(0.4, z - 0.1))}
              style={{ background: "none", border: "none", color: "#fff", padding: "4px 7px", cursor: "pointer" }}
            >
              <ZoomOut size={13} />
            </button>
            <span style={{ fontSize: 10.5, color: "rgba(255,255,255,0.7)", minWidth: 32, textAlign: "center" }}>
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom(z => Math.min(1.6, z + 0.1))}
              style={{ background: "none", border: "none", color: "#fff", padding: "4px 7px", cursor: "pointer" }}
            >
              <ZoomIn size={13} />
            </button>
          </div>

          <button
            onClick={() => setShowAddNodeModal(true)}
            style={{
              display: "flex", alignItems: "center", gap: 5,
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)",
              color: "#e5e7eb", borderRadius: 8, padding: "6px 12px",
              fontSize: 11.5, fontWeight: 700, cursor: "pointer",
            }}
          >
            <Plus size={13} /> Add Node
          </button>

          <button
            onClick={() => setShowExportModal(true)}
            style={{
              display: "flex", alignItems: "center", gap: 5,
              background: "rgba(56, 189, 248, 0.15)", border: "1px solid rgba(56, 189, 248, 0.35)",
              color: "#38bdf8", borderRadius: 8, padding: "6px 12px",
              fontSize: 11.5, fontWeight: 700, cursor: "pointer",
            }}
          >
            <FileCode size={13} /> Export YAML / JSON
          </button>

          <button
            onClick={runPipeline}
            disabled={isRunning}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: isRunning ? "rgba(225,73,109,0.3)" : "linear-gradient(135deg, #e1496d, #942945)",
              border: "none", color: "#fff", borderRadius: 8, padding: "6px 16px",
              fontSize: 12, fontWeight: 700, fontFamily: "Syne, sans-serif",
              cursor: isRunning ? "wait" : "pointer",
              boxShadow: isRunning ? "none" : "0 4px 14px rgba(225,73,109,0.45)",
            }}
          >
            <Play size={12} fill="#fff" />
            {isRunning ? "Running DAG..." : "Execute Pipeline"}
          </button>
        </div>
      </header>

      {/* ── Main Canvas & Inspector Area ── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden", position: "relative" }}>
        
        {/* Spatial Node Graph Canvas */}
        <div
          style={{
            flex: 1, position: "relative", overflow: "hidden",
            cursor: isDraggingCanvas ? "grabbing" : "grab",
            background: `
              radial-gradient(circle at 50% 50%, rgba(225, 73, 109, 0.04) 0%, transparent 80%),
              linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: "100% 100%, 32px 32px, 32px 32px",
          }}
          onMouseDown={handleMouseDownCanvas}
        >
          <div style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "0 0",
            position: "absolute", inset: 0,
          }}>
            
            {/* SVG Bezier Wires */}
            <svg style={{ position: "absolute", top: 0, left: 0, width: 5000, height: 5000, pointerEvents: "none", overflow: "visible" }}>
              <defs>
                <linearGradient id="wireGradActive" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#e1496d" />
                  <stop offset="100%" stopColor="#38bdf8" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="glow" />
                  <feComposite in="SourceGraphic" in2="glow" operator="over" />
                </filter>
              </defs>

              {/* Render Existing Connected Wires */}
              {wires.map((wire) => {
                const srcNode = nodes.find(n => n.id === wire.fromNode);
                const tgtNode = nodes.find(n => n.id === wire.toNode);
                if (!srcNode || !tgtNode) return null;

                const x1 = srcNode.x + 220;
                const y1 = srcNode.y + 48;
                const x2 = tgtNode.x;
                const y2 = tgtNode.y + 48;

                const dx = Math.max(70, Math.abs(x2 - x1) * 0.45);
                const path = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;

                const isWireActive = srcNode.status === "running" || tgtNode.status === "running";

                return (
                  <g key={wire.id || `${wire.fromNode}-${wire.toNode}`}>
                    {/* Shadow outline */}
                    <path
                      d={path}
                      fill="none"
                      stroke="#000000"
                      strokeWidth={6}
                      opacity={0.6}
                    />
                    {/* Main wire */}
                    <path
                      d={path}
                      fill="none"
                      stroke={isWireActive ? "url(#wireGradActive)" : "rgba(225, 73, 109, 0.45)"}
                      strokeWidth={isWireActive ? 3.5 : 2}
                      strokeDasharray={isWireActive ? "6, 3" : "none"}
                      filter={isWireActive ? "url(#glow)" : "none"}
                    />
                    
                    {/* Laser bead pulse animation when running */}
                    {isRunning && (
                      <circle r={4} fill="#38bdf8" filter="url(#glow)">
                        <animateMotion path={path} dur="1.2s" repeatCount="indefinite" />
                      </circle>
                    )}
                  </g>
                );
              })}

              {/* In-progress Drag Wire */}
              {connectingFrom && (
                <path
                  d={`M ${connectingFrom.startX} ${connectingFrom.startY} C ${connectingFrom.startX + 60} ${connectingFrom.startY}, ${connectingMousePos.x - 60} ${connectingMousePos.y}, ${connectingMousePos.x} ${connectingMousePos.y}`}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth={2.5}
                  strokeDasharray="4, 4"
                />
              )}
            </svg>

            {/* ── Render Blueprint Nodes ── */}
            {nodes.map(node => {
              const isSelected = selectedNodeId === node.id;
              const isNodeRunning = node.status === "running";
              const isNodeDone = node.status === "done";

              return (
                <div
                  key={node.id}
                  className="blueprint-node"
                  onMouseDown={(e) => handleNodeMouseDown(e, node.id, node.x, node.y)}
                  style={{
                    position: "absolute",
                    left: node.x,
                    top: node.y,
                    width: 220,
                    borderRadius: 10,
                    background: "rgba(14, 5, 12, 0.94)",
                    border: `1.5px solid ${isNodeRunning ? "#38bdf8" : (isSelected ? node.color : "rgba(255, 255, 255, 0.1)")}`,
                    boxShadow: isNodeRunning 
                      ? "0 0 20px rgba(56, 189, 248, 0.5)" 
                      : (isSelected ? `0 0 16px ${node.color}40` : "0 8px 24px rgba(0,0,0,0.5)"),
                    backdropFilter: "blur(14px)",
                    cursor: "move",
                    zIndex: isSelected ? 30 : 10,
                    transition: "border 0.2s, box-shadow 0.2s",
                  }}
                >
                  {/* Node Header */}
                  <div style={{
                    padding: "8px 10px",
                    borderTopLeftRadius: 8, borderTopRightRadius: 8,
                    background: `linear-gradient(90deg, ${node.color}25, transparent)`,
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{
                        width: 7, height: 7, borderRadius: "50%",
                        background: isNodeRunning ? "#38bdf8" : (isNodeDone ? "#22c55e" : node.color),
                        boxShadow: isNodeRunning ? "0 0 8px #38bdf8" : "none",
                      }} />
                      <span style={{ fontSize: 11, fontWeight: 800, color: "#ffffff" }}>
                        {node.title}
                      </span>
                    </div>

                    <button
                      onClick={(e) => handleDeleteNode(node.id, e)}
                      title="Delete Node"
                      style={{
                        background: "none", border: "none", color: "rgba(255,255,255,0.4)",
                        cursor: "pointer", padding: 2, display: "flex",
                      }}
                    >
                      <X size={12} />
                    </button>
                  </div>

                  {/* Node Body / Subtitle */}
                  <div style={{ padding: "8px 10px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <span style={{ fontSize: 9.5, color: "rgba(255,255,255,0.5)", fontFamily: "'JetBrains Mono', monospace" }}>
                        {node.type}
                      </span>
                      <span style={{
                        fontSize: 8, padding: "1px 5px", borderRadius: 4,
                        background: isNodeRunning ? "rgba(56, 189, 248, 0.2)" : (isNodeDone ? "rgba(34, 197, 94, 0.2)" : "rgba(255,255,255,0.06)"),
                        color: isNodeRunning ? "#38bdf8" : (isNodeDone ? "#22c55e" : "rgba(255,255,255,0.6)"),
                        fontWeight: 700,
                      }}>
                        {node.status.toUpperCase()}
                      </span>
                    </div>

                    {/* Node Ports (Inputs left, Outputs right) */}
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                      
                      {/* Inputs Column */}
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {node.inputs.map(inp => (
                          <div
                            key={inp.id}
                            className="node-port"
                            onMouseUp={(e) => handlePortMouseUp(e, node.id, inp.id, true)}
                            style={{ display: "flex", alignItems: "center", gap: 5, cursor: "crosshair" }}
                          >
                            <div style={{
                              width: 9, height: 9, borderRadius: "50%",
                              background: "#38bdf8", border: "1.5px solid #070208",
                              boxShadow: "0 0 4px #38bdf8",
                            }} />
                            <span style={{ fontSize: 9, color: "rgba(255,255,255,0.7)" }}>{inp.label}</span>
                          </div>
                        ))}
                      </div>

                      {/* Outputs Column */}
                      <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
                        {node.outputs.map(out => (
                          <div
                            key={out.id}
                            className="node-port"
                            onMouseDown={(e) => handlePortMouseDown(e, node.id, out.id, true, node.x, node.y)}
                            style={{ display: "flex", alignItems: "center", gap: 5, cursor: "crosshair" }}
                          >
                            <span style={{ fontSize: 9, color: "rgba(255,255,255,0.7)" }}>{out.label}</span>
                            <div style={{
                              width: 9, height: 9, borderRadius: "50%",
                              background: "#e1496d", border: "1.5px solid #070208",
                              boxShadow: "0 0 4px #e1496d",
                            }} />
                          </div>
                        ))}
                      </div>

                    </div>
                  </div>
                </div>
              );
            })}

          </div>
        </div>

        {/* ── Right Properties Inspector Drawer ── */}
        <div style={{
          width: 280, borderLeft: "1px solid rgba(225, 73, 109, 0.18)",
          background: "rgba(14, 5, 12, 0.92)", backdropFilter: "blur(20px)",
          display: "flex", flexDirection: "column", zIndex: 40,
        }}>
          <div style={{ padding: "12px 14px", borderBottom: "1px solid rgba(225, 73, 109, 0.16)", display: "flex", alignItems: "center", gap: 6 }}>
            <Settings size={13} color="#ff8da7" />
            <span style={{ fontSize: 11.5, fontWeight: 800, color: "#fff", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Node Parameter Inspector
            </span>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: 14 }}>
            {selectedNode ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                
                <div>
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", textTransform: "uppercase" }}>Node Title</span>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#fff", marginTop: 2 }}>{selectedNode.title}</div>
                  <div style={{ fontSize: 10, color: selectedNode.color, fontFamily: "'JetBrains Mono', monospace", marginTop: 2 }}>{selectedNode.type}</div>
                </div>

                <div style={{ height: 1, background: "rgba(255,255,255,0.08)" }} />

                <span style={{ fontSize: 10, fontWeight: 800, color: "#ff8da7", textTransform: "uppercase" }}>
                  Configurable Parameters
                </span>

                {Object.entries(selectedNode.params || {}).map(([key, val]) => (
                  <div key={key}>
                    <label style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", display: "block", marginBottom: 3, textTransform: "capitalize" }}>
                      {key.replace(/([A-Z])/g, " $1")}
                    </label>
                    <input
                      type="text"
                      value={String(val)}
                      onChange={(e) => {
                        const newVal = e.target.value;
                        setNodes(prev => prev.map(n => n.id === selectedNode.id ? { ...n, params: { ...n.params, [key]: newVal } } : n));
                      }}
                      style={{
                        width: "100%", padding: "6px 8px", borderRadius: 6,
                        background: "rgba(0,0,0,0.4)", border: "1px solid rgba(225, 73, 109, 0.3)",
                        color: "#38bdf8", fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
                        boxSizing: "border-box", outline: "none",
                      }}
                    />
                  </div>
                ))}

                <div style={{ marginTop: 10 }}>
                  <span style={{ fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                    Connected Wires ({wires.filter(w => w.fromNode === selectedNode.id || w.toNode === selectedNode.id).length})
                  </span>
                  {wires.filter(w => w.fromNode === selectedNode.id || w.toNode === selectedNode.id).map(w => (
                    <div key={w.id || `${w.fromNode}-${w.toNode}`} style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "5px 8px", borderRadius: 6, background: "rgba(255,255,255,0.04)",
                      fontSize: 10, marginBottom: 4, fontFamily: "'JetBrains Mono', monospace",
                    }}>
                      <span style={{ color: "#38bdf8" }}>{w.fromNode} ➔ {w.toNode}</span>
                      <button onClick={(e) => deleteWire(w.id, e)} style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer" }}>
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>

              </div>
            ) : (
              <div style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: 11, marginTop: 40 }}>
                Select a node on the canvas to inspect and edit its parameters.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* ── Bottom Execution Terminal Console Drawer ── */}
      {outputDrawerOpen && (
        <div style={{
          height: 150, borderTop: "1px solid rgba(225, 73, 109, 0.25)",
          background: "#080206", display: "flex", flexDirection: "column",
          zIndex: 45,
        }}>
          <div style={{
            height: 28, padding: "0 14px", background: "rgba(0,0,0,0.5)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Terminal size={12} color="#38bdf8" />
              <span style={{ fontSize: 10.5, fontWeight: 700, color: "#fff", fontFamily: "'JetBrains Mono', monospace" }}>
                Pipeline Execution Runtime Logs
              </span>
            </div>

            <button
              onClick={() => setOutputDrawerOpen(false)}
              style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer" }}
            >
              <X size={12} />
            </button>
          </div>

          <div style={{ flex: 1, padding: "8px 14px", overflowY: "auto", fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5 }}>
            {executionLogs.map((log, i) => (
              <div key={i} style={{ color: log.includes("✓") ? "#22c55e" : (log.includes("⚡") ? "#38bdf8" : "rgba(255,255,255,0.7)"), marginBottom: 3 }}>
                {log}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Modal: Add Node Catalog ── */}
      {showAddNodeModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100,
        }}
        onClick={() => setShowAddNodeModal(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: 540, maxHeight: "80vh", borderRadius: 14,
              background: "#100612", border: "1px solid rgba(225, 73, 109, 0.35)",
              boxShadow: "0 20px 50px rgba(0,0,0,0.8)", overflow: "hidden", display: "flex", flexDirection: "column",
            }}
          >
            <div style={{ padding: "14px 18px", borderBottom: "1px solid rgba(225, 73, 109, 0.2)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: "Syne, sans-serif", fontSize: 15, fontWeight: 800, color: "#fff" }}>
                Add Automation Node to Pipeline
              </span>
              <button onClick={() => setShowAddNodeModal(false)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer" }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ padding: 16, overflowY: "auto", display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
              {NODE_CATALOG.map((tpl, i) => (
                <div
                  key={i}
                  onClick={() => handleAddNode(tpl)}
                  style={{
                    padding: "10px 12px", borderRadius: 10,
                    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                    cursor: "pointer", transition: "all 0.15s ease",
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = tpl.color}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: tpl.color }} />
                    <span style={{ fontSize: 11.5, fontWeight: 700, color: "#fff" }}>{tpl.title}</span>
                  </div>
                  <div style={{ fontSize: 9.5, color: "rgba(255,255,255,0.5)", fontFamily: "'JetBrains Mono', monospace" }}>{tpl.type}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Export YAML / JSON ── */}
      {showExportModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100,
        }}
        onClick={() => setShowExportModal(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: 600, maxHeight: "85vh", borderRadius: 14,
              background: "#0c040d", border: "1px solid rgba(225, 73, 109, 0.35)",
              boxShadow: "0 20px 50px rgba(0,0,0,0.8)", overflow: "hidden", display: "flex", flexDirection: "column",
            }}
          >
            <div style={{ padding: "14px 18px", borderBottom: "1px solid rgba(225, 73, 109, 0.2)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: "Syne, sans-serif", fontSize: 15, fontWeight: 800, color: "#fff" }}>
                Export GitHub Actions CI/CD Workflow
              </span>
              <button onClick={() => setShowExportModal(false)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer" }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ padding: 18, flex: 1, overflowY: "auto" }}>
              <textarea
                readOnly
                rows={14}
                value={generateExportCode()}
                style={{
                  width: "100%", padding: 12, borderRadius: 8,
                  background: "#050106", border: "1px solid rgba(56, 189, 248, 0.3)",
                  color: "#38bdf8", fontSize: 10.5, fontFamily: "'JetBrains Mono', monospace",
                  boxSizing: "border-box", resize: "none", outline: "none", lineHeight: 1.45,
                }}
              />
            </div>

            <div style={{ padding: "12px 18px", borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button
                onClick={copyExportSnippet}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "7px 16px", borderRadius: 8,
                  background: "linear-gradient(135deg, #e1496d, #942945)",
                  border: "none", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer",
                }}
              >
                {copiedCode ? <Check size={13} /> : <Copy size={13} />}
                <span>{copiedCode ? "Copied to Clipboard!" : "Copy YAML Workflow"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
