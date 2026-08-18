import React, { useState, useRef, useEffect } from "react";
import { 
  ArrowLeft, Play, Plus, Trash2, Cpu, Zap, Sparkles, 
  Layers, Download, RefreshCw, ZoomIn, ZoomOut, Check, Terminal, Eye,
  Code, Copy, Shield, ShieldCheck, GitBranch, Cloud, Share2, Settings, Box,
  CheckCircle2, AlertCircle, FileCode, Clock, ArrowRight, X, ChevronRight,
  Maximize2, Database, Send, Radio, Compass, Sliders, PlayCircle, Search,
  Filter, Grid, ArrowUpRight, CheckCheck, Bookmark
} from "lucide-react";
import CommunityLandscapeBanner from "./CommunityLandscapeBanner";

export default function WorkflowPipelines({ onBack, onNavigate, user, isEmbedded = false, isDark = false }) {
  // Navigation mode: "hub" (Overview & Templates) or "studio" (DAG Canvas Engine)
  const [viewMode, setViewMode] = useState("hub");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 60, y: 40 });
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const [selectedNodeId, setSelectedNodeId] = useState("node_2");
  const [draggingNodeId, setDraggingNodeId] = useState(null);
  const [nodeOffset, setNodeOffset] = useState({ x: 0, y: 0 });
  
  // Wire creation state
  const [connectingFrom, setConnectingFrom] = useState(null);
  const [connectingMousePos, setConnectingMousePos] = useState({ x: 0, y: 0 });

  // Execution engine state
  const [isRunning, setIsRunning] = useState(false);
  const [executionLogs, setExecutionLogs] = useState([]);
  const [outputDrawerOpen, setOutputDrawerOpen] = useState(false);
  const [showAddNodeModal, setShowAddNodeModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeBlueprintPreset, setActiveBlueprintPreset] = useState("release_ci");
  const [activeDagStep, setActiveDagStep] = useState(0);
  const [isDagSimulating, setIsDagSimulating] = useState(false);
  const [activeBlueprintIndex, setActiveBlueprintIndex] = useState(0);
  const [blueprintLayoutMode, setBlueprintLayoutMode] = useState("stack");
  const [isDeckHovered, setIsDeckHovered] = useState(false);

  // ── Curated Developer Blueprints ──
  const BLUEPRINT_PRESETS = {
    release_ci: {
      id: "release_ci",
      name: "Release Asset CI/CD Automation",
      category: "cicd",
      categoryLabel: "CI/CD & Releases",
      tag: "GitHub Actions",
      trigger: "on: push tags (v*)",
      desc: "Automatically bakes 4K Ray.so 3D terminal mockups from code changes and updates the GitHub repository README.md.",
      steps: ["Release Webhook", "AST Syntax Styler", "3D Terminal Bake", "README Injector"],
      nodes: [
        {
          id: "node_1",
          title: "GitHub Release Webhook",
          category: "trigger",
          type: "Webhook Trigger",
          x: 60,
          y: 100,
          inputs: [],
          outputs: [{ id: "out_tag", label: "Release Tag / Commit" }],
          params: { event: "release.published", branch: "main", repo: "creatify-engine/core" },
          status: "ready",
          color: "#0284c7",
        },
        {
          id: "node_2",
          title: "AST Syntax Styler",
          category: "processor",
          type: "Code Tokenizer",
          x: 420,
          y: 70,
          inputs: [{ id: "in_code", label: "Source Code" }],
          outputs: [{ id: "out_tokens", label: "Highlighted AST" }],
          params: { theme: "Synthwave 84", language: "TypeScript", font: "JetBrains Mono" },
          status: "ready",
          color: "#e1496d",
        },
        {
          id: "node_3",
          title: "3D Terminal Raytracer Bake",
          category: "renderer",
          type: "WebGL PBR Renderer",
          x: 780,
          y: 60,
          inputs: [{ id: "in_tokens", label: "AST Texture" }],
          outputs: [{ id: "out_render", label: "4K Lossless PNG" }],
          params: { rig: "Terminal Window (CLI)", lighting: "Cyberpunk Neon", metalness: 0.8 },
          status: "ready",
          color: "#9333ea",
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
          color: "#16a34a",
        },
      ],
      wires: [
        { id: "w1", fromNode: "node_1", fromPort: "out_tag", toNode: "node_2", toPort: "in_code" },
        { id: "w2", fromNode: "node_2", fromPort: "out_tokens", toNode: "node_3", toPort: "in_tokens" },
        { id: "w3", fromNode: "node_3", fromPort: "out_render", toNode: "node_4", toPort: "in_render" },
      ],
    },
    social_hero: {
      id: "social_hero",
      name: "Social Media OpenGraph Hero Generator",
      category: "social",
      categoryLabel: "Social Media & OG",
      tag: "OpenGraph 4K",
      trigger: "on: pull_request.merged",
      desc: "Extracts PR release highlights, formats them into a 3D perspective glass card, and uploads 1200x630 OG social banners to CDN.",
      steps: ["PR Merge Webhook", "Changelog Summarizer", "3D Glass Rig", "Cloudflare CDN"],
      nodes: [
        {
          id: "node_10",
          title: "GitHub PR Merge Trigger",
          category: "trigger",
          type: "PR Webhook",
          x: 60,
          y: 110,
          inputs: [],
          outputs: [{ id: "out_pr", label: "PR Metadata" }],
          params: { event: "pull_request.closed", filterMerged: true },
          status: "ready",
          color: "#0284c7",
        },
        {
          id: "node_11",
          title: "Changelog Summarizer",
          category: "processor",
          type: "AST Parser",
          x: 420,
          y: 80,
          inputs: [{ id: "in_pr", label: "PR Metadata" }],
          outputs: [{ id: "out_summary", label: "Hero Title & Bullets" }],
          params: { maxBullets: 3, tone: "Technical & Precise" },
          status: "ready",
          color: "#e1496d",
        },
        {
          id: "node_12",
          title: "3D Glass Perspective Rig",
          category: "renderer",
          type: "Three.js Renderer",
          x: 780,
          y: 60,
          inputs: [{ id: "in_summary", label: "Card Layout" }],
          outputs: [{ id: "out_og", label: "1200x630 OG Image" }],
          params: { aspect: "1200x630 (OG Card)", glassBlur: "24px", bloom: 0.6 },
          status: "ready",
          color: "#9333ea",
        },
        {
          id: "node_13",
          title: "Cloudflare R2 / S3 Bucket",
          category: "output",
          type: "CDN Pusher",
          x: 1140,
          y: 90,
          inputs: [{ id: "in_og", label: "OG Image" }],
          outputs: [{ id: "out_url", label: "Public CDN URL" }],
          params: { bucket: "creatify-assets", pathPrefix: "releases/og/" },
          status: "ready",
          color: "#16a34a",
        },
      ],
      wires: [
        { id: "w10", fromNode: "node_10", fromPort: "out_pr", toNode: "node_11", toPort: "in_pr" },
        { id: "w11", fromNode: "node_11", fromPort: "out_summary", toNode: "node_12", toPort: "in_summary" },
        { id: "w12", fromNode: "node_12", fromPort: "out_og", toNode: "node_13", toPort: "in_og" },
      ],
    },
    brand_matrix: {
      id: "brand_matrix",
      name: "SVG Brand Mark to Favicon Matrix",
      category: "brand",
      categoryLabel: "Brand & Tokens",
      tag: "Multi-Platform Export",
      trigger: "on: brand_update",
      desc: "Takes vector brand SVGs, extracts Tailwind CSS tokens, and exports a production favicon bundle from 16px to 512px in a ZIP archive.",
      steps: ["SVG Ingest", "Token Quantizer", "Multi-Size Rasterizer", "ZIP Packager"],
      nodes: [
        {
          id: "node_20",
          title: "SVG Brand Mark Input",
          category: "trigger",
          type: "Asset Ingest",
          x: 60,
          y: 110,
          inputs: [],
          outputs: [{ id: "out_svg", label: "Vector XML" }],
          params: { source: "LogoMaker Studio", emblem: "Geometric Falcon" },
          status: "ready",
          color: "#0284c7",
        },
        {
          id: "node_21",
          title: "Tailwind Token Quantizer",
          category: "processor",
          type: "Color Matrix",
          x: 420,
          y: 80,
          inputs: [{ id: "in_svg", label: "Vector XML" }],
          outputs: [{ id: "out_tokens", label: "tailwind.config.js" }],
          params: { format: "Tailwind v3/v4 & CSS Vars", shades: "50-950" },
          status: "ready",
          color: "#e1496d",
        },
        {
          id: "node_22",
          title: "Multi-Size Rasterizer",
          category: "renderer",
          type: "Raster Engine",
          x: 780,
          y: 60,
          inputs: [{ id: "in_svg", label: "Vector XML" }],
          outputs: [{ id: "out_icons", label: "PNGs (16, 32, 192, 512)" }],
          params: { sizes: [16, 32, 64, 180, 192, 512], formats: ["ico", "png", "svg"] },
          status: "ready",
          color: "#9333ea",
        },
        {
          id: "node_23",
          title: "ZIP Bundle Packager",
          category: "output",
          type: "File Archiver",
          x: 1140,
          y: 90,
          inputs: [{ id: "in_icons", label: "Asset Matrix" }],
          outputs: [{ id: "out_zip", label: "brand-assets.zip" }],
          params: { fileName: "brand-bundle.zip", includeWebManifest: true },
          status: "ready",
          color: "#16a34a",
        },
      ],
      wires: [
        { id: "w20", fromNode: "node_20", fromPort: "out_svg", toNode: "node_21", toPort: "in_svg" },
        { id: "w21", fromNode: "node_20", fromPort: "out_svg", toNode: "node_22", toPort: "in_svg" },
        { id: "w22", fromNode: "node_22", fromPort: "out_icons", toNode: "node_23", toPort: "in_icons" },
      ],
    },
    tech_spec: {
      id: "tech_spec",
      name: "API Spec to Interactive Tech Spec PDF",
      category: "docs",
      categoryLabel: "Documentation",
      tag: "RFC & OpenAPI",
      trigger: "on: rfc_published",
      desc: "Parses OpenAPI YAML / Markdown documents and compiles an executive technical spec document with embedded diagrams.",
      steps: ["OpenAPI Ingest", "Spec Compiler", "Mermaid Diagram Sync", "PDF Publisher"],
      nodes: [
        {
          id: "node_30",
          title: "OpenAPI Spec Ingest",
          category: "trigger",
          type: "Spec Trigger",
          x: 60,
          y: 100,
          inputs: [],
          outputs: [{ id: "out_spec", label: "OpenAPI JSON" }],
          params: { specFile: "openapi.yaml", validateSchema: true },
          status: "ready",
          color: "#0284c7",
        },
        {
          id: "node_31",
          title: "Endpoint Visualizer",
          category: "processor",
          type: "Route Parser",
          x: 420,
          y: 70,
          inputs: [{ id: "in_spec", label: "OpenAPI JSON" }],
          outputs: [{ id: "out_routes", label: "Parsed Endpoints" }],
          params: { generateExamples: true, authType: "Bearer JWT" },
          status: "ready",
          color: "#e1496d",
        },
        {
          id: "node_32",
          title: "PDF Blueprint Publisher",
          category: "output",
          type: "Document Engine",
          x: 780,
          y: 80,
          inputs: [{ id: "in_routes", label: "Parsed Endpoints" }],
          outputs: [{ id: "out_pdf", label: "Tech-Spec.pdf" }],
          params: { layout: "Executive Whitepaper", theme: "Clean Light" },
          status: "ready",
          color: "#16a34a",
        },
      ],
      wires: [
        { id: "w30", fromNode: "node_30", fromPort: "out_spec", toNode: "node_31", toPort: "in_spec" },
        { id: "w31", fromNode: "node_31", fromPort: "out_routes", toNode: "node_32", toPort: "in_routes" },
      ],
    },
  };

  const [nodes, setNodes] = useState(BLUEPRINT_PRESETS.release_ci.nodes);
  const [wires, setWires] = useState(BLUEPRINT_PRESETS.release_ci.wires);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  // Available node library for adding new nodes
  const NODE_LIBRARY = [
    { title: "GitHub Release Webhook", category: "trigger", type: "Webhook", color: "#0284c7", inputs: [], outputs: [{ id: "out_payload", label: "Payload" }], params: { event: "release", branch: "main" } },
    { title: "Cron Timer Schedule", category: "trigger", type: "Timer", color: "#0284c7", inputs: [], outputs: [{ id: "out_tick", label: "Cron Trigger" }], params: { cron: "0 0 * * *" } },
    { title: "AST Syntax Styler", category: "processor", type: "Syntax Engine", color: "#e1496d", inputs: [{ id: "in_code", label: "Source" }], outputs: [{ id: "out_ast", label: "AST Texture" }], params: { theme: "Obsidian Cyber", lang: "Rust" } },
    { title: "3D Ray.so Glass Rig", category: "renderer", type: "3D Shader", color: "#9333ea", inputs: [{ id: "in_tex", label: "Texture" }], outputs: [{ id: "out_img", label: "4K PNG" }], params: { rig: "Glass Card", metalness: 0.85 } },
    { title: "GitHub README Injector", category: "output", type: "Git Bot", color: "#16a34a", inputs: [{ id: "in_asset", label: "Asset" }], outputs: [{ id: "out_sha", label: "Commit SHA" }], params: { file: "README.md" } },
    { title: "Cloudflare R2 / S3 Bucket", category: "output", type: "CDN Pusher", color: "#16a34a", inputs: [{ id: "in_file", label: "File" }], outputs: [{ id: "out_url", label: "CDN URL" }], params: { bucket: "assets" } },
  ];

  // Open a specific pipeline in the DAG Studio
  const openBlueprintInStudio = (presetKey) => {
    if (BLUEPRINT_PRESETS[presetKey]) {
      setActiveBlueprintPreset(presetKey);
      setNodes(BLUEPRINT_PRESETS[presetKey].nodes);
      setWires(BLUEPRINT_PRESETS[presetKey].wires);
      setSelectedNodeId(BLUEPRINT_PRESETS[presetKey].nodes[1]?.id || BLUEPRINT_PRESETS[presetKey].nodes[0]?.id);
    } else {
      // Blank custom pipeline
      setActiveBlueprintPreset("custom");
      setNodes([
        {
          id: "node_custom_1",
          title: "Custom Input Trigger",
          category: "trigger",
          type: "Webhook Trigger",
          x: 80,
          y: 100,
          inputs: [],
          outputs: [{ id: "out_data", label: "Payload" }],
          params: { event: "manual.trigger" },
          status: "ready",
          color: "#0284c7",
        }
      ]);
      setWires([]);
      setSelectedNodeId("node_custom_1");
    }
    setExecutionLogs([]);
    setViewMode("studio");
  };

  // Node parameter change handler
  const handleParamChange = (key, value) => {
    setNodes(prev => prev.map(n => {
      if (n.id !== selectedNodeId) return n;
      return { ...n, params: { ...n.params, [key]: value } };
    }));
  };

  // Delete active node
  const handleDeleteNode = (nodeId) => {
    setNodes(prev => prev.filter(n => n.id !== nodeId));
    setWires(prev => prev.filter(w => w.fromNode !== nodeId && w.toNode !== nodeId));
    if (selectedNodeId === nodeId) {
      setSelectedNodeId(null);
    }
  };

  // Add a new node from library
  const handleAddNodeFromLib = (template) => {
    const newId = `node_${Date.now().toString().slice(-4)}`;
    const newNode = {
      id: newId,
      title: template.title,
      category: template.category,
      type: template.type,
      x: 350 + Math.random() * 200,
      y: 120 + Math.random() * 150,
      inputs: template.inputs || [],
      outputs: template.outputs || [],
      params: { ...template.params },
      status: "ready",
      color: template.color || "#e1496d",
    };
    setNodes(prev => [...prev, newNode]);
    setSelectedNodeId(newId);
    setShowAddNodeModal(false);
  };

  // Run DAG Execution Simulation
  const runPipeline = () => {
    if (isRunning) return;
    setIsRunning(true);
    setOutputDrawerOpen(true);
    setExecutionLogs([]);

    const addLog = (msg, type = "info") => {
      setExecutionLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), msg, type }]);
    };

    addLog("Initializing DAG execution graph...", "info");
    addLog(`Executing pipeline: ${BLUEPRINT_PRESETS[activeBlueprintPreset]?.name || "Custom Pipeline"}`, "info");

    setNodes(prev => prev.map(n => ({ ...n, status: "ready" })));

    let step = 0;
    const interval = setInterval(() => {
      if (step >= nodes.length) {
        clearInterval(interval);
        setIsRunning(false);
        addLog("✨ Pipeline DAG execution completed successfully. All artifacts generated.", "success");
        return;
      }

      const currentNode = nodes[step];
      if (currentNode) {
        setNodes(prev => prev.map((n, idx) => {
          if (idx === step) return { ...n, status: "running" };
          if (idx < step) return { ...n, status: "done" };
          return n;
        }));

        addLog(`[${currentNode.title}] Running ${currentNode.type}...`, "running");
        
        setTimeout(() => {
          setNodes(prev => prev.map((n, idx) => {
            if (idx === step) return { ...n, status: "done" };
            return n;
          }));
          addLog(`✓ [${currentNode.title}] Artifact emitted: OK (200)`, "success");
        }, 500);
      }

      step++;
    }, 850);
  };

  // Generate GitHub Actions Workflow YAML
  const generateGitHubActionsYaml = () => {
    return `# 🚀 GitHub Actions Workflow generated by Creatify Pipelines Engine
name: Automated Creative Assets Pipeline

on:
  push:
    tags:
      - 'v*'
  workflow_dispatch:

jobs:
  build-and-deploy-assets:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Setup Node.js & Tooling
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Parse AST & Generate 3D Terminal Rigs
        run: |
          npx @creatify/ast-styler --input src/ --theme "${selectedNode?.params?.theme || "Synthwave"}"
          npx @creatify/raytracer-bake --rig "${selectedNode?.params?.rig || "Terminal Window"}" --quality 4K

      - name: Inject Generated Assets to README.md
        run: |
          npx @creatify/readme-injector --file README.md --asset dist/hero-mockup.png

      - name: Commit and Push Updated Assets
        run: |
          git config --global user.name "creatify-bot[bot]"
          git config --global user.email "bot@creatify.dev"
          git add README.md dist/
          git commit -m "chore(assets): auto-generate release mockups and diagrams [skip ci]" || exit 0
          git push origin HEAD:\${{ github.ref }}
`;
  };

  // Canvas Mouse Handlers
  const handleMouseDownCanvas = (e) => {
    if (e.target.closest(".blueprint-node") || e.target.closest(".port-handle")) return;
    setIsDraggingCanvas(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMoveCanvas = (e) => {
    if (isDraggingCanvas) {
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    } else if (draggingNodeId) {
      const newX = (e.clientX - pan.x) / zoom - nodeOffset.x;
      const newY = (e.clientY - pan.y) / zoom - nodeOffset.y;
      setNodes(prev => prev.map(n => n.id === draggingNodeId ? { ...n, x: Math.round(newX), y: Math.round(newY) } : n));
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

  const handleNodeMouseDown = (e, nodeId, nodeX, nodeY) => {
    e.stopPropagation();
    setSelectedNodeId(nodeId);
    setDraggingNodeId(nodeId);
    setNodeOffset({
      x: (e.clientX - pan.x) / zoom - nodeX,
      y: (e.clientY - pan.y) / zoom - nodeY,
    });
  };

  const handlePortMouseDown = (e, nodeId, portId, isOutput, nodeX, nodeY) => {
    e.stopPropagation();
    if (isOutput) {
      setConnectingFrom({
        nodeId,
        portId,
        startX: nodeX + 220,
        startY: nodeY + 50,
      });
      setConnectingMousePos({
        x: (e.clientX - pan.x) / zoom,
        y: (e.clientY - pan.y) / zoom,
      });
    }
  };

  const handlePortMouseUp = (e, targetNodeId, targetPortId, isInput) => {
    e.stopPropagation();
    if (connectingFrom && isInput && connectingFrom.nodeId !== targetNodeId) {
      const newWire = {
        id: `wire_${Date.now()}`,
        fromNode: connectingFrom.nodeId,
        fromPort: connectingFrom.portId,
        toNode: targetNodeId,
        toPort: targetPortId,
      };
      setWires(prev => [...prev, newWire]);
    }
    setConnectingFrom(null);
  };

  // Filtered blueprints in Hub
  const blueprintsList = Object.values(BLUEPRINT_PRESETS).filter(b => {
    const matchesCategory = activeCategory === "all" || b.category === activeCategory;
    const matchesSearch = !searchQuery || b.name.toLowerCase().includes(searchQuery.toLowerCase()) || b.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Auto-rotate 3D Deck every 3 seconds unless hovered
  useEffect(() => {
    if (blueprintLayoutMode !== "stack" || isDeckHovered || blueprintsList.length <= 1) return;
    const interval = setInterval(() => {
      setActiveBlueprintIndex(prev => (prev + 1) % blueprintsList.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [blueprintLayoutMode, isDeckHovered, blueprintsList.length]);

  // ══════════════════════════════════════════════════════════════════════════════
  // VIEW 1: PIPELINES OVERVIEW & TEMPLATES HUB (Pure Classy Light / Dark Theme)
  // ══════════════════════════════════════════════════════════════════════════════
  if (viewMode === "hub") {
    return (
      <div style={{
        minHeight: "100vh",
        background: isDark ? "#0c040a" : "#fdf8fa",
        color: isDark ? "#ffffff" : "#1a040d",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        padding: "32px 0 0",
        boxSizing: "border-box",
        position: "relative",
        overflowX: "hidden",
      }}>
        {/* Ambient Background Auras */}
        <div style={{
          position: "absolute", top: "-150px", left: "25%", width: 550, height: 550,
          borderRadius: "50%", background: "radial-gradient(circle, rgba(225,73,109,0.14) 0%, transparent 70%)",
          filter: "blur(80px)", pointerEvents: "none", zIndex: 0
        }} />
        <div style={{
          position: "absolute", top: "400px", right: "10%", width: 450, height: 450,
          borderRadius: "50%", background: "radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)",
          filter: "blur(90px)", pointerEvents: "none", zIndex: 0
        }} />

        {/* ── TOP HERO CENTERPIECE: OPEN UNBOXED LAYOUT WITH ART ── */}
        <section style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 1200,
          margin: "0 auto 52px",
          padding: "24px 24px 0",
          textAlign: "center",
        }}>
          {/* Majestic Hero Headline */}
          <h1 style={{
            margin: "0 auto 14px",
            fontSize: "clamp(32px, 4.5vw, 58px)",
            fontWeight: 900,
            fontFamily: "Syne, sans-serif",
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            color: isDark ? "#ffffff" : "#4a0e22",
            maxWidth: 920
          }}>
            Automate Developer Media & 3D Renders with <span style={{
              color: isDark ? "#ff8da7" : "#e1496d"
            }}>Visual Node DAGs</span>.
          </h1>

          <p style={{
            margin: "0 auto 36px",
            fontSize: "clamp(14.5px, 1.7vw, 17px)",
            color: isDark ? "rgba(255,255,255,0.7)" : "#6a2135",
            maxWidth: 720,
            lineHeight: 1.6,
          }}>
            Chain Webhook triggers, AST syntax styling, 3D WebGL terminal bakes, and GitHub release committers into automated production graphs.
          </p>
          {/* ── INTERACTIVE VISUAL ARTWORK: ANIMATED PIPELINE MATRIX ── */}
          <div style={{
            position: "relative",
            maxWidth: 920,
            height: 180,
            margin: "0 auto 36px",
            borderRadius: 20,
            background: isDark ? "rgba(10, 2, 8, 0.8)" : "rgba(255, 255, 255, 0.7)",
            border: `1.5px solid ${isDark ? "rgba(225, 73, 109, 0.2)" : "rgba(148, 41, 69, 0.12)"}`,
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            padding: "0 24px",
            boxShadow: isDark ? "inset 0 0 30px rgba(0,0,0,0.6)" : "inset 0 0 20px rgba(148,41,69,0.03)"
          }}>
            {/* SVG Connecting Bezier Cable Stream */}
            <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
              <path
                d="M 120 90 C 260 40, 340 140, 460 90 S 660 40, 800 90"
                fill="none"
                stroke={isDark ? "rgba(225,73,109,0.4)" : "rgba(225,73,109,0.3)"}
                strokeWidth="2.5"
                strokeDasharray="6 6"
                style={{ animation: "pipelineStream 1.5s linear infinite" }}
              />
            </svg>

            {/* Stage 1: Ingest Trigger Node */}
            <div style={{
              position: "relative", zIndex: 2,
              display: "flex", flexDirection: "column", alignItems: "center", gap: 8
            }}>
              <div style={{
                width: 52, height: 52, borderRadius: 16,
                background: "linear-gradient(135deg, #0284c7, #0369a1)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", boxShadow: "0 6px 18px rgba(2, 132, 199, 0.45)",
                border: "2px solid rgba(255,255,255,0.2)"
              }}>
                <GitBranch size={22} />
              </div>
              <div style={{ textAlign: "center" }}>
                <span style={{ fontSize: 11, fontWeight: 800, fontFamily: "Syne, sans-serif", color: isDark ? "#fff" : "#1a040d" }}>
                  Git Webhook
                </span>
                <div style={{ fontSize: 9.5, color: "#0284c7", fontWeight: 700 }}>
                  on: release (v*)
                </div>
              </div>
            </div>

            {/* Animated Flowing Pulse Orb */}
            <div style={{
              width: 10, height: 10, borderRadius: "50%", background: "#e1496d",
              boxShadow: "0 0 12px #e1496d", animation: "ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite"
            }} />

            {/* Stage 2: Code AST Parser Node */}
            <div style={{
              position: "relative", zIndex: 2,
              display: "flex", flexDirection: "column", alignItems: "center", gap: 8
            }}>
              <div style={{
                width: 52, height: 52, borderRadius: 16,
                background: "linear-gradient(135deg, #e1496d, #942945)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", boxShadow: "0 6px 18px rgba(225, 73, 109, 0.45)",
                border: "2px solid rgba(255,255,255,0.2)"
              }}>
                <Code size={22} />
              </div>
              <div style={{ textAlign: "center" }}>
                <span style={{ fontSize: 11, fontWeight: 800, fontFamily: "Syne, sans-serif", color: isDark ? "#fff" : "#1a040d" }}>
                  AST Tokenizer
                </span>
                <div style={{ fontSize: 9.5, color: "#e1496d", fontWeight: 700 }}>
                  Synthwave 84
                </div>
              </div>
            </div>

            {/* Stage 3: 3D Raytracer Bake Node */}
            <div style={{
              position: "relative", zIndex: 2,
              display: "flex", flexDirection: "column", alignItems: "center", gap: 8
            }}>
              <div style={{
                width: 52, height: 52, borderRadius: 16,
                background: "linear-gradient(135deg, #a855f7, #7e22ce)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", boxShadow: "0 6px 18px rgba(168, 85, 247, 0.45)",
                border: "2px solid rgba(255,255,255,0.2)"
              }}>
                <Box size={22} />
              </div>
              <div style={{ textAlign: "center" }}>
                <span style={{ fontSize: 11, fontWeight: 800, fontFamily: "Syne, sans-serif", color: isDark ? "#fff" : "#1a040d" }}>
                  3D PBR Bake
                </span>
                <div style={{ fontSize: 9.5, color: "#a855f7", fontWeight: 700 }}>
                  4K Terminal Asset
                </div>
              </div>
            </div>

            {/* Stage 4: GitHub Release Committer */}
            <div style={{
              position: "relative", zIndex: 2,
              display: "flex", flexDirection: "column", alignItems: "center", gap: 8
            }}>
              <div style={{
                width: 52, height: 52, borderRadius: 16,
                background: "linear-gradient(135deg, #10b981, #047857)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", boxShadow: "0 6px 18px rgba(16, 185, 129, 0.45)",
                border: "2px solid rgba(255,255,255,0.2)"
              }}>
                <CheckCircle2 size={22} />
              </div>
              <div style={{ textAlign: "center" }}>
                <span style={{ fontSize: 11, fontWeight: 800, fontFamily: "Syne, sans-serif", color: isDark ? "#fff" : "#1a040d" }}>
                  README Injector
                </span>
                <div style={{ fontSize: 9.5, color: "#10b981", fontWeight: 700 }}>
                  Auto-Committed ✓
                </div>
              </div>
            </div>
          </div>

          {/* ── ENTER BUTTONS: PROMINENT CALL TO ACTION ── */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            flexWrap: "wrap"
          }}>
            {/* Main Enter Button */}
            <button
              onClick={() => openBlueprintInStudio("release_ci")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "15px 36px",
                borderRadius: 16,
                background: "linear-gradient(135deg, #e1496d, #942945)",
                border: "none",
                color: "#ffffff",
                fontSize: "15px",
                fontWeight: 800,
                fontFamily: "Syne, sans-serif",
                cursor: "pointer",
                boxShadow: "0 8px 24px rgba(225, 73, 109, 0.45)",
                transition: "all 0.25s ease",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-3px) scale(1.02)";
                e.currentTarget.style.boxShadow = "0 12px 32px rgba(225, 73, 109, 0.6)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(225, 73, 109, 0.45)";
              }}
            >
              <Zap size={18} fill="#fff" />
              <span>Enter Pipeline Studio</span>
              <ArrowRight size={16} />
            </button>

            {/* Create Custom DAG */}
            <button
              onClick={() => openBlueprintInStudio("custom")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 28px",
                borderRadius: 16,
                background: isDark ? "rgba(255,255,255,0.06)" : "rgba(148, 41, 69, 0.05)",
                border: `1.5px solid ${isDark ? "rgba(225,73,109,0.3)" : "rgba(148,41,69,0.2)"}`,
                color: isDark ? "#ffffff" : "#4a0e22",
                fontSize: "14px",
                fontWeight: 700,
                fontFamily: "Syne, sans-serif",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "#e1496d"}
              onMouseLeave={e => e.currentTarget.style.borderColor = isDark ? "rgba(225,73,109,0.3)" : "rgba(148,41,69,0.2)"}
            >
              <Plus size={16} color="#e1496d" />
              <span>Create Blank Pipeline</span>
            </button>
          </div>
        </section>

        {/* ── DETAILED & ANIMATED: HOW VISUAL DAG PIPELINES WORK (WITH 3 DETAILED BIRD MASCOTS ATOP CARDS) ── */}
        <section style={{ maxWidth: 1240, margin: "0 auto 80px", padding: "0 24px", boxSizing: "border-box", position: "relative" }}>
          
          {/* Section Header */}
          <div style={{ textAlign: "center", marginBottom: 70 }}>
            <h2 style={{
              fontFamily: "Syne, sans-serif",
              fontSize: "clamp(28px, 3.6vw, 44px)",
              fontWeight: 900,
              margin: "0 0 12px",
              color: isDark ? "#ffffff" : "#4a0e22",
              letterSpacing: "-0.02em"
            }}>
              How Visual DAG Pipelines Work
            </h2>
            <p style={{
              fontSize: "15px",
              color: isDark ? "rgba(255,255,255,0.7)" : "#6a2135",
              maxWidth: 680,
              margin: "0 auto",
              lineHeight: 1.6,
              fontFamily: "'Instrument Sans', sans-serif"
            }}>
              Connect trigger events, WebGL 3D renders, and distribution bots into automated spatial node pipelines.
            </p>
          </div>

          {/* ── 3D ROTATIVE INTERACTIVE STAGE CAROUSEL ── */}
          <div style={{
            position: "relative",
            perspective: "1200px",
            perspectiveOrigin: "center top",
            paddingTop: 55,
            paddingBottom: 20,
            overflow: "visible",
          }}>
            {/* 3 Staggered Power Cards with 3D Rotative Transforms */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 28,
              alignItems: "stretch",
            }}>
              {[
                {
                  id: 0,
                  tag: "EVENT INGESTION",
                  phase: "Phase 01",
                  title: "Ingestion & Triggers",
                  metric: "Sub-5ms",
                  metricLabel: "Real-Time Event Stream",
                  accentColor: "#eab308",
                  borderGlow: "rgba(234, 179, 8, 0.4)",
                  desc: "Hook into GitHub push tags (`v*`), REST API webhooks, schedule cron timers, or file drop listeners to trigger automated compilation.",
                  checklist: [
                    "Sub-5ms event loop processing",
                    "HMAC SHA-256 webhook signatures",
                    "Idempotent deduplication engine",
                    "GitHub, GitLab & Bitbucket native"
                  ],
                  mascotTop: -92,
                  mascotHeight: 140,
                  renderMascot: () => (
                    <svg viewBox="0 0 170 150" style={{ width: "100%", height: "100%", overflow: "visible" }}>
                      <defs>
                        <linearGradient id="dagM1YellowBody" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#fef08a" />
                          <stop offset="40%" stopColor="#fde047" />
                          <stop offset="80%" stopColor="#eab308" />
                          <stop offset="100%" stopColor="#ca8a04" />
                        </linearGradient>
                        <linearGradient id="dagM1YellowWing" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#fef9c3" />
                          <stop offset="50%" stopColor="#facc15" />
                          <stop offset="85%" stopColor="#d97706" />
                          <stop offset="100%" stopColor="#b45309" />
                        </linearGradient>
                        <linearGradient id="dagM1Beak" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#fdba74" />
                          <stop offset="100%" stopColor="#ea580c" />
                        </linearGradient>
                      </defs>
                      <g>
                        <line x1="72" y1="126" x2="64" y2="148" stroke="#64748b" strokeWidth="3.5" strokeLinecap="round" />
                        <line x1="40" y1="134" x2="104" y2="116" stroke="#94a3b8" strokeWidth="4.5" strokeLinecap="round" />
                        <line x1="42" y1="134" x2="102" y2="117" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" />
                        <circle cx="70" cy="127" r="4" fill="#475569" />
                      </g>
                      <g className="mascot-anim-bob1">
                        {/* Golden Yellow Tail Feathers */}
                        <path d="M46,94 C30,98 18,108 14,118 C28,112 42,106 50,100 Z" fill="#ca8a04" stroke="#78350f" strokeWidth="1.2" />
                        <path d="M48,90 C34,92 22,98 18,106 C32,102 44,98 52,94 Z" fill="#eab308" stroke="#78350f" strokeWidth="1.2" />
                        <path d="M52,86 C40,86 28,90 24,96 C36,94 48,92 56,88 Z" fill="#facc15" stroke="#78350f" strokeWidth="1.2" />

                        {/* Yellow Bird Body */}
                        <path
                          d="M52,80 C50,98 62,112 80,112 C98,112 110,98 108,78 C106,62 94,52 78,54 C60,56 54,66 52,80 Z"
                          fill="url(#dagM1YellowBody)"
                          stroke="#78350f"
                          strokeWidth="1.5"
                        />
                        <path d="M72,74 C70,92 78,104 90,106 C84,102 78,92 78,78 Z" fill="#fefce8" opacity="0.6" />

                        {/* Harness */}
                        <path d="M60,68 Q78,82 96,96" stroke="#334155" strokeWidth="4" strokeLinecap="round" fill="none" />
                        <path d="M60,68 Q78,82 96,96" stroke="#64748b" strokeWidth="2" strokeLinecap="round" fill="none" />
                        <rect x="74" y="78" width="7" height="7" rx="1.5" fill="#f59e0b" stroke="#78350f" strokeWidth="1" transform="rotate(35 77 81)" />

                        {/* Golden Wing */}
                        <g>
                          <path d="M58,74 C50,82 48,98 60,104 C74,110 88,98 86,84 C84,72 70,68 58,74 Z" fill="url(#dagM1YellowWing)" stroke="#78350f" strokeWidth="1.5" />
                          <path d="M56,86 Q68,94 80,88" stroke="#ca8a04" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                          <path d="M58,94 Q70,100 78,94" stroke="#ca8a04" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                        </g>

                        {/* Feet */}
                        <g>
                          <line x1="68" y1="108" x2="64" y2="124" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" />
                          <path d="M60,126 Q64,121 68,124 Q72,121 76,125" fill="none" stroke="#b45309" strokeWidth="2.5" strokeLinecap="round" />
                          <line x1="82" y1="106" x2="80" y2="120" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" />
                          <path d="M76,122 Q80,117 84,120 Q88,117 92,121" fill="none" stroke="#b45309" strokeWidth="2.5" strokeLinecap="round" />
                        </g>

                        {/* Head */}
                        <circle cx="94" cy="56" r="18" fill="url(#dagM1YellowBody)" stroke="#78350f" strokeWidth="1.5" />
                        <ellipse cx="90" cy="62" rx="4" ry="2.5" fill="#f97316" opacity="0.5" />
                        <ellipse cx="99" cy="52" rx="6" ry="6.5" fill="#0f172a" />
                        <circle cx="101" cy="50" r="2.5" fill="#ffffff" />
                        <polygon points="106,53 126,58 106,66" fill="url(#dagM1Beak)" stroke="#78350f" strokeWidth="1.2" />

                        {/* Propeller Cap */}
                        <g>
                          <ellipse cx="94" cy="40" rx="14" ry="6" fill="#1e293b" stroke="#0f172a" strokeWidth="1.5" />
                          <path d="M84,39 C84,30 104,30 104,39 Z" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="1.5" />
                          <line x1="94" y1="31" x2="94" y2="24" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" />
                          <g className="mascot-anim-spin">
                            <ellipse cx="94" cy="23" rx="18" ry="4" fill="#f43f5e" stroke="#881337" strokeWidth="1" />
                            <circle cx="94" cy="23" r="2.5" fill="#fbbf24" />
                          </g>
                        </g>
                      </g>
                    </svg>
                  )
                },
                {
                  id: 1,
                  tag: "PARALLEL ENGINE",
                  phase: "Phase 02",
                  title: "Parallel DAG Compute",
                  metric: "180ms",
                  metricLabel: "Sub-Second 3D PBR Bake",
                  accentColor: "#b45309",
                  desc: "Pipe source code into syntax tokenizers, render 3D WebGL scenes, inject dynamic brand tokens, and apply neural grading.",
                  checklist: [
                    "WASM AST syntax tokenizer",
                    "Three.js WebGL 3D terminal shaders",
                    "Procedural SVG vector matrix tokens",
                    "Lossless 4K raytraced preview bakes"
                  ],
                  mascotTop: -108,
                  mascotHeight: 145,
                  renderMascot: () => (
                    <svg viewBox="0 0 200 160" style={{ width: "100%", height: "100%", overflow: "visible" }}>
                      <defs>
                        <linearGradient id="dagM2YellowBody" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#fef08a" />
                          <stop offset="40%" stopColor="#fde047" />
                          <stop offset="80%" stopColor="#eab308" />
                          <stop offset="100%" stopColor="#ca8a04" />
                        </linearGradient>
                        <linearGradient id="dagM2YellowWing" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#fef9c3" />
                          <stop offset="40%" stopColor="#fde047" />
                          <stop offset="75%" stopColor="#f59e0b" />
                          <stop offset="100%" stopColor="#d97706" />
                        </linearGradient>
                        <linearGradient id="dagM2Gold" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#fef08a" />
                          <stop offset="50%" stopColor="#f59e0b" />
                          <stop offset="100%" stopColor="#b45309" />
                        </linearGradient>
                      </defs>

                      <g className="mascot-anim-soar">
                        {/* Upper Wing Plumes */}
                        <g>
                          <path d="M78,60 C64,20 86,10 106,16 C102,32 94,50 82,64 Z" fill="#d97706" stroke="#78350f" strokeWidth="1.5" />
                          <path d="M88,24 C94,14 104,12 112,18 C106,30 98,44 88,54 Z" fill="#fde047" stroke="#78350f" strokeWidth="1.2" />
                        </g>

                        {/* Yellow Bird Body */}
                        <path
                          d="M60,78 C52,94 68,108 92,106 C116,104 134,88 130,68 C126,52 108,46 88,52 C72,56 64,66 60,78 Z"
                          fill="url(#dagM2YellowBody)"
                          stroke="#78350f"
                          strokeWidth="1.5"
                        />
                        <path d="M96,62 C90,78 98,96 114,94 C124,90 128,78 126,66 Z" fill="#fefce8" opacity="0.7" />

                        {/* Tail Plumes */}
                        <path d="M58,84 C40,90 28,102 22,114 C36,106 50,98 60,92 Z" fill="#ca8a04" stroke="#78350f" strokeWidth="1.2" />
                        <path d="M56,80 C36,82 24,90 18,100 C34,96 48,90 58,86 Z" fill="#eab308" stroke="#78350f" strokeWidth="1.2" />

                        {/* Front Main Wing */}
                        <g>
                          <path d="M92,72 C80,34 112,18 136,28 C128,48 116,74 98,84 Z" fill="url(#dagM2YellowWing)" stroke="#78350f" strokeWidth="1.5" />
                          <path d="M102,40 C114,32 126,30 134,36" stroke="#ca8a04" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                          <path d="M100,52 C112,44 122,42 130,48" stroke="#ca8a04" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                        </g>

                        {/* Head & Beak */}
                        <circle cx="132" cy="54" r="18" fill="url(#dagM2YellowBody)" stroke="#78350f" strokeWidth="1.5" />
                        <ellipse cx="128" cy="60" rx="4" ry="2.5" fill="#f97316" opacity="0.5" />
                        <ellipse cx="137" cy="50" rx="6" ry="6.5" fill="#0f172a" />
                        <circle cx="139" cy="48" r="2.5" fill="#ffffff" />
                        <polygon points="144,51 164,57 144,65" fill="url(#dagM2Gold)" stroke="#78350f" strokeWidth="1.2" />

                        {/* Captain Cap */}
                        <g>
                          <path d="M122,40 C122,30 144,30 144,40 Z" fill="#1e293b" stroke="#0f172a" strokeWidth="1.5" />
                          <path d="M132,44 Q148,44 154,40 Q142,36 130,40 Z" fill="#0f172a" />
                          <circle cx="133" cy="35" r="2.5" fill="#f59e0b" />
                        </g>

                        {/* Linked Golden Medal */}
                        <g>
                          <path d="M148,58 C136,80 120,102 108,124 C100,138 90,148 84,152" fill="none" stroke="url(#dagM2Gold)" strokeWidth="3" strokeDasharray="4 4" strokeLinecap="round" />
                          <g transform="translate(89, 142)">
                            <polygon points="0,-14 4,-4 14,0 4,4 0,14 -4,4 -14,0 -4,-4" fill="url(#dagM2Gold)" stroke="#78350f" strokeWidth="1" />
                            <circle cx="0" cy="0" r="4.5" fill="#ffffff" />
                            <circle cx="0" cy="0" r="2" fill="#f59e0b" />
                          </g>
                        </g>
                      </g>
                    </svg>
                  )
                },
                {
                  id: 2,
                  tag: "RELEASE DISPATCH",
                  phase: "Phase 03",
                  title: "Cryptographic Delivery",
                  metric: "100% Exact",
                  metricLabel: "Deterministic Commit Bot",
                  accentColor: "#b45309",
                  desc: "Auto-commits 4K assets to GitHub READMEs, publishes CDN release artifacts, and triggers Discord/Slack notifications.",
                  checklist: [
                    "Byte-exact cryptographic reproducibility",
                    "Automated GitHub README committer bot",
                    "Global CDN cache auto-invalidation",
                    "Slack & Discord webhook notification dispatch"
                  ],
                  mascotTop: -118,
                  mascotHeight: 160,
                  renderMascot: () => (
                    <svg viewBox="0 0 200 180" style={{ width: "100%", height: "100%", overflow: "visible" }}>
                      <defs>
                        <linearGradient id="dagM3YellowBody" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#fef08a" />
                          <stop offset="40%" stopColor="#fde047" />
                          <stop offset="80%" stopColor="#eab308" />
                          <stop offset="100%" stopColor="#ca8a04" />
                        </linearGradient>
                        <linearGradient id="dagM3Crown" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#fef08a" />
                          <stop offset="50%" stopColor="#fbbf24" />
                          <stop offset="100%" stopColor="#f59e0b" />
                        </linearGradient>
                        <linearGradient id="dagM3YellowFlame1" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#fef9c3" />
                          <stop offset="35%" stopColor="#fde047" />
                          <stop offset="70%" stopColor="#f59e0b" />
                          <stop offset="100%" stopColor="#d97706" />
                        </linearGradient>
                        <linearGradient id="dagM3YellowFlame2" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#fffbeb" />
                          <stop offset="50%" stopColor="#facc15" />
                          <stop offset="100%" stopColor="#ea580c" />
                        </linearGradient>
                        <linearGradient id="dagM3Hoop" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#cbd5e1" />
                          <stop offset="50%" stopColor="#ffffff" />
                          <stop offset="100%" stopColor="#64748b" />
                        </linearGradient>
                      </defs>

                      {/* Subtle Silver Hoop Perch */}
                      <g>
                        <circle cx="100" cy="148" r="28" fill="none" stroke="url(#dagM3Hoop)" strokeWidth="4" />
                        <circle cx="100" cy="148" r="28" fill="none" stroke="#0f172a" strokeWidth="1" />
                        <line x1="100" y1="176" x2="100" y2="195" stroke="#64748b" strokeWidth="3.5" strokeLinecap="round" />
                      </g>
                      <g className="mascot-anim-phoenix">
                        {/* Golden Tail Feathers */}
                        <g>
                          <path d="M90,118 C70,140 55,160 40,178 C65,165 85,145 96,124 Z" fill="#ca8a04" stroke="#78350f" strokeWidth="1.2" />
                          <path d="M110,118 C130,140 145,160 160,178 C135,165 115,145 104,124 Z" fill="#ca8a04" stroke="#78350f" strokeWidth="1.2" />
                          <circle cx="52" cy="168" r="4" fill="#fbbf24" stroke="#78350f" strokeWidth="1" />
                          <circle cx="148" cy="168" r="4" fill="#fbbf24" stroke="#78350f" strokeWidth="1" />
                        </g>

                        {/* Left Golden Flame Wing */}
                        <g>
                          <path d="M74,90 C40,45 15,35 24,18 C46,14 66,38 78,74 Z" fill="url(#dagM3YellowFlame1)" stroke="#78350f" strokeWidth="1.5" />
                          <path d="M76,92 C54,58 35,46 42,34 C58,30 72,50 80,80 Z" fill="url(#dagM3YellowFlame2)" stroke="#78350f" strokeWidth="1.2" />
                        </g>

                        {/* Right Golden Flame Wing */}
                        <g>
                          <path d="M126,90 C160,45 185,35 176,18 C154,14 134,38 122,74 Z" fill="url(#dagM3YellowFlame1)" stroke="#78350f" strokeWidth="1.5" />
                          <path d="M124,92 C146,58 165,46 158,34 C142,30 128,50 120,80 Z" fill="url(#dagM3YellowFlame2)" stroke="#78350f" strokeWidth="1.2" />
                        </g>

                        {/* Yellow Bird Body */}
                        <ellipse cx="100" cy="96" rx="26" ry="28" fill="url(#dagM3YellowBody)" stroke="#78350f" strokeWidth="1.5" />
                        <g>
                          <polygon points="90,78 100,86 86,88" fill="#ffffff" stroke="#334155" strokeWidth="1" />
                          <polygon points="110,78 100,86 114,88" fill="#ffffff" stroke="#334155" strokeWidth="1" />
                          <rect x="96" y="86" width="8" height="6" rx="1.5" fill="#0284c7" />
                          <polygon points="97,92 103,92 107,118 100,126 93,118" fill="#0284c7" />
                          <line x1="96" y1="100" x2="104" y2="98" stroke="#fbbf24" strokeWidth="1.8" />
                          <line x1="95" y1="108" x2="105" y2="106" stroke="#fbbf24" strokeWidth="1.8" />
                        </g>
                        <line x1="92" y1="122" x2="90" y2="128" stroke="#d97706" strokeWidth="3" strokeLinecap="round" />
                        <line x1="108" y1="122" x2="110" y2="128" stroke="#d97706" strokeWidth="3" strokeLinecap="round" />

                        {/* Head & Cap */}
                        <circle cx="100" cy="62" r="19" fill="url(#dagM3YellowBody)" stroke="#78350f" strokeWidth="1.5" />
                        <ellipse cx="91" cy="58" rx="5.5" ry="6" fill="#0f172a" />
                        <circle cx="92.5" cy="56" r="2.2" fill="#ffffff" />
                        <ellipse cx="109" cy="58" rx="5.5" ry="6" fill="#0f172a" />
                        <circle cx="110.5" cy="56" r="2.2" fill="#ffffff" />
                        <polygon points="100,64 92,72 108,72" fill="url(#dagM3Crown)" stroke="#78350f" strokeWidth="1.2" />

                        <g>
                          <ellipse cx="100" cy="46" rx="16" ry="6" fill="#1e1b4b" stroke="#0f172a" strokeWidth="1.5" />
                          <rect x="88" y="32" width="24" height="15" rx="3" fill="#1e1b4b" stroke="#0f172a" strokeWidth="1.5" />
                          <line x1="88" y1="44" x2="112" y2="44" stroke="#fbbf24" strokeWidth="2.5" />
                          <circle cx="100" cy="38" r="3.5" fill="#fbbf24" />
                          <path d="M100,32 C108,12 128,4 122,-10 C108,4 98,18 100,32 Z" fill="url(#dagM3YellowFlame1)" stroke="#78350f" strokeWidth="1.2" />
                        </g>
                      </g>
                    </svg>
                  )
                }
              ].map((card, idx) => {
                // Calculate dynamic rotational slot relative to activeDagStep (0, 1, or 2)
                const relIndex = (idx - activeDagStep + 3) % 3;
                
                // relIndex:
                // 0 -> Active Center Card
                // 1 -> Right Card (Rotated Y + tilted)
                // 2 -> Left Card (Rotated Y - tilted)
                const isCenter = relIndex === 0;
                const isRight = relIndex === 1;
                const isLeft = relIndex === 2;

                // Rotative transformation styles
                let transformStyle = "none";
                let zIndexVal = 10;
                let opacityVal = 0.92;

                if (isCenter) {
                  transformStyle = "scale(1.05) translateY(-6px) rotateY(0deg) rotate(0deg)";
                  zIndexVal = 30;
                  opacityVal = 1;
                } else if (isRight) {
                  transformStyle = "scale(0.93) translateY(10px) rotateY(-14deg) rotate(1.5deg)";
                  zIndexVal = 12;
                  opacityVal = 0.88;
                } else if (isLeft) {
                  transformStyle = "scale(0.93) translateY(10px) rotateY(14deg) rotate(-1.5deg)";
                  zIndexVal = 12;
                  opacityVal = 0.88;
                }

                return (
                  <div
                    key={card.id}
                    onClick={() => setActiveDagStep(card.id)}
                    style={{
                      position: "relative",
                      borderRadius: 24,
                      background: isCenter
                        ? (isDark
                            ? "linear-gradient(180deg, #1c150c 0%, #120e07 100%)"
                            : "#ffffff")
                        : (isDark
                            ? "linear-gradient(180deg, #140f09 0%, #0d0a06 100%)"
                            : "#ffffff"),
                      border: isCenter
                        ? `1.5px solid ${isDark ? "rgba(234, 179, 8, 0.45)" : "rgba(217, 119, 6, 0.35)"}`
                        : `1px solid ${isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)"}`,
                      padding: isCenter ? "46px 28px 32px" : "42px 28px 30px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      backdropFilter: "blur(20px)",
                      boxShadow: isCenter
                        ? (isDark
                            ? "0 22px 50px rgba(0, 0, 0, 0.6)"
                            : "0 18px 45px rgba(0, 0, 0, 0.07)")
                        : (isDark
                            ? "0 10px 25px rgba(0, 0, 0, 0.4)"
                            : "0 8px 22px rgba(0, 0, 0, 0.04)"),
                      transform: transformStyle,
                      transformStyle: "preserve-3d",
                      zIndex: zIndexVal,
                      opacity: opacityVal,
                      cursor: isCenter ? "default" : "pointer",
                      transition: "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    }}
                    onMouseEnter={e => {
                      if (!isCenter) {
                        e.currentTarget.style.opacity = "1";
                        e.currentTarget.style.borderColor = isDark ? "rgba(234, 179, 8, 0.35)" : "rgba(217, 119, 6, 0.25)";
                        e.currentTarget.style.transform = isRight
                          ? "scale(0.95) translateY(4px) rotateY(-8deg)"
                          : "scale(0.95) translateY(4px) rotateY(8deg)";
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isCenter) {
                        e.currentTarget.style.opacity = String(opacityVal);
                        e.currentTarget.style.borderColor = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)";
                        e.currentTarget.style.transform = transformStyle;
                      }
                    }}
                  >
                    {/* Perched Mascot atop Card */}
                    <div style={{
                      position: "absolute",
                      top: card.mascotTop,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: 180,
                      height: card.mascotHeight,
                      pointerEvents: "none",
                      zIndex: 25,
                      transition: "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)"
                    }}>
                      {card.renderMascot()}
                    </div>

                    <div>
                      {/* Top Tag & Phase Header */}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                        <span style={{
                          fontSize: 10, fontWeight: 800, fontFamily: "Syne, sans-serif",
                          padding: "3px 10px", borderRadius: 99,
                          background: isDark ? "rgba(234, 179, 8, 0.12)" : "rgba(217, 119, 6, 0.08)",
                          color: isDark ? "#fbbf24" : "#92400e",
                          border: `1px solid ${isDark ? "rgba(234, 179, 8, 0.25)" : "rgba(217, 119, 6, 0.18)"}`,
                          letterSpacing: "0.06em", textTransform: "uppercase",
                        }}>
                          {card.tag}
                        </span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: isDark ? "#fbbf24" : "#92400e", fontFamily: "Syne, sans-serif" }}>
                          {card.phase}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 style={{
                        fontFamily: "Syne, sans-serif", fontSize: isCenter ? 24 : 22, fontWeight: 900,
                        color: isDark ? "#ffffff" : "#1e1b18", margin: "0 0 10px", lineHeight: 1.18
                      }}>
                        {card.title}
                      </h3>

                      {/* Metric Highlight Box */}
                      <div style={{
                        padding: "10px 14px", borderRadius: 12,
                        background: isDark ? "rgba(255, 255, 255, 0.04)" : "#fdfbf7",
                        border: `1px solid ${isDark ? "rgba(234, 179, 8, 0.15)" : "rgba(217, 119, 6, 0.12)"}`,
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        marginBottom: 16,
                      }}>
                        <span style={{ fontSize: 15, fontWeight: 800, fontFamily: "Syne, sans-serif", color: isDark ? "#fbbf24" : "#b45309" }}>
                          {card.metric}
                        </span>
                        <span style={{ fontSize: 10.5, fontWeight: 700, color: isDark ? "rgba(255,255,255,0.6)" : "#78716c" }}>
                          {card.metricLabel}
                        </span>
                      </div>

                      <p style={{
                        fontSize: 13.5, color: isDark ? "rgba(255,255,255,0.65)" : "#57534e",
                        lineHeight: 1.55, margin: "0 0 20px"
                      }}>
                        {card.desc}
                      </p>

                      {/* Checklist */}
                      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
                        {card.checklist.map((item, i) => (
                          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                            <div style={{
                              width: 17, height: 17, borderRadius: "50%",
                              background: isDark ? "rgba(234, 179, 8, 0.12)" : "rgba(217, 119, 6, 0.08)",
                              border: `1px solid ${isDark ? "rgba(234, 179, 8, 0.35)" : "rgba(217, 119, 6, 0.3)"}`,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              color: isDark ? "#fbbf24" : "#b45309", flexShrink: 0, marginTop: 2,
                            }}>
                              <Check size={10} strokeWidth={3} />
                            </div>
                            <span style={{ fontSize: 12, color: isDark ? "rgba(255,255,255,0.85)" : "#292524", lineHeight: 1.45 }}>
                              {item}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Active State Click Pill for non-active cards */}
                    {!isCenter && (
                      <div style={{
                        marginTop: 12,
                        padding: "6px 0",
                        textAlign: "center",
                        fontSize: 11,
                        fontWeight: 700,
                        color: isDark ? "#fbbf24" : "#92400e",
                        fontFamily: "Syne, sans-serif",
                        background: isDark ? "rgba(234, 179, 8, 0.06)" : "rgba(217, 119, 6, 0.05)",
                        borderRadius: 8,
                        border: `1px solid ${isDark ? "rgba(234, 179, 8, 0.15)" : "rgba(217, 119, 6, 0.12)"}`
                      }}>
                        Click to Rotate to Center ↺
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom Step Indicator Dots */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              marginTop: 36
            }}>
              {[0, 1, 2].map((idx) => {
                const isActive = activeDagStep === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveDagStep(idx)}
                    style={{
                      width: isActive ? 28 : 10,
                      height: 10,
                      borderRadius: 99,
                      background: isActive ? "#f59e0b" : (isDark ? "rgba(255,255,255,0.2)" : "rgba(245,158,11,0.25)"),
                      border: "none",
                      cursor: "pointer",
                      transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                      boxShadow: isActive ? "0 0 12px rgba(245,158,11,0.6)" : "none"
                    }}
                    aria-label={`Go to Stage ${idx + 1}`}
                  />
                );
              })}
            </div>
          </div>
        </section>

        {/* ── CONTENT SECTION 3: PRODUCTION BLUEPRINTS LIBRARY (CLASSY 3D AUTO-SWAPPING DECK) ── */}
        <section id="blueprints-grid" style={{ maxWidth: 1200, margin: "0 auto 20px", padding: "0 24px", boxSizing: "border-box" }}>
          {/* Header Bar with Search & View Toggle */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 24,
            flexWrap: "wrap",
            gap: 16,
          }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <h2 style={{
                  fontFamily: "Syne, sans-serif", fontSize: 24, fontWeight: 900,
                  margin: 0, color: isDark ? "#ffffff" : "#4a0e22", letterSpacing: "-0.01em"
                }}>
                  Production Blueprints Library
                </h2>
                <span style={{
                  fontSize: 11, fontWeight: 800, fontFamily: "Syne, sans-serif",
                  padding: "2px 9px", borderRadius: 99,
                  background: isDark ? "rgba(225, 73, 109, 0.15)" : "rgba(225, 73, 109, 0.08)",
                  color: "#e1496d",
                  border: `1px solid ${isDark ? "rgba(225, 73, 109, 0.3)" : "rgba(225, 73, 109, 0.2)"}`,
                }}>
                  {blueprintsList.length} PRESETS
                </span>
              </div>
              <p style={{ fontSize: 13, color: isDark ? "rgba(255,255,255,0.65)" : "#6a2135", margin: 0 }}>
                Pre-configured DAG workflows ready to run, tweak, or customize in Blueprint Studio.
              </p>
            </div>

            {/* Controls: Search & Layout Mode Toggle */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              {/* Layout Switcher (3D Deck vs Grid) */}
              <div style={{
                display: "flex",
                alignItems: "center",
                background: isDark ? "rgba(255,255,255,0.06)" : "rgba(148, 41, 69, 0.05)",
                padding: "3px",
                borderRadius: 10,
                border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(148, 41, 69, 0.12)"}`
              }}>
                <button
                  onClick={() => setBlueprintLayoutMode("stack")}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "6px 12px", borderRadius: 7,
                    background: blueprintLayoutMode === "stack" 
                      ? (isDark ? "linear-gradient(135deg, #a82348, #e1496d)" : "#ffffff") 
                      : "transparent",
                    border: "none",
                    color: blueprintLayoutMode === "stack" ? (isDark ? "#ffffff" : "#942945") : (isDark ? "rgba(255,255,255,0.6)" : "#6a2135"),
                    fontSize: 12, fontWeight: 700, fontFamily: "Syne, sans-serif",
                    cursor: "pointer",
                    boxShadow: blueprintLayoutMode === "stack" ? (isDark ? "0 2px 8px rgba(225,73,109,0.3)" : "0 2px 6px rgba(148,41,69,0.08)") : "none",
                    transition: "all 0.2s"
                  }}
                >
                  <Layers size={13} />
                  <span>3D Deck Flow</span>
                </button>
                <button
                  onClick={() => setBlueprintLayoutMode("grid")}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "6px 12px", borderRadius: 7,
                    background: blueprintLayoutMode === "grid" 
                      ? (isDark ? "linear-gradient(135deg, #a82348, #e1496d)" : "#ffffff") 
                      : "transparent",
                    border: "none",
                    color: blueprintLayoutMode === "grid" ? (isDark ? "#ffffff" : "#942945") : (isDark ? "rgba(255,255,255,0.6)" : "#6a2135"),
                    fontSize: 12, fontWeight: 700, fontFamily: "Syne, sans-serif",
                    cursor: "pointer",
                    boxShadow: blueprintLayoutMode === "grid" ? (isDark ? "0 2px 8px rgba(225,73,109,0.3)" : "0 2px 6px rgba(148,41,69,0.08)") : "none",
                    transition: "all 0.2s"
                  }}
                >
                  <Grid size={13} />
                  <span>Grid View</span>
                </button>
              </div>

              {/* Search Input */}
              <div style={{ position: "relative", minWidth: 220 }}>
                <Search size={14} style={{
                  position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)",
                  color: isDark ? "rgba(255,255,255,0.4)" : "rgba(148, 41, 69, 0.4)",
                }} />
                <input
                  type="text"
                  placeholder="Filter blueprints..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setActiveBlueprintIndex(0);
                  }}
                  style={{
                    width: "100%",
                    padding: "7px 12px 7px 32px",
                    borderRadius: 9,
                    background: isDark ? "rgba(255,255,255,0.05)" : "#ffffff",
                    border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "rgba(148, 41, 69, 0.16)"}`,
                    color: "inherit",
                    fontSize: "12px",
                    outline: "none",
                    boxSizing: "border-box",
                    boxShadow: !isDark ? "0 1px 4px rgba(148,41,69,0.04)" : "none",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: isDark ? "rgba(255,255,255,0.03)" : "rgba(148, 41, 69, 0.04)",
            padding: "4px 6px",
            borderRadius: 10,
            border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(148, 41, 69, 0.08)"}`,
            marginBottom: 30,
            overflowX: "auto"
          }}>
            {[
              { id: "all", label: "All Pipelines" },
              { id: "cicd", label: "CI/CD & Releases" },
              { id: "social", label: "Social Media & OG" },
              { id: "brand", label: "Brand & Tokens" },
              { id: "docs", label: "Documentation" },
            ].map(cat => {
              const active = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setActiveBlueprintIndex(0);
                  }}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 8,
                    background: active 
                      ? (isDark ? "linear-gradient(135deg, #a82348, #e1496d)" : "#ffffff") 
                      : "transparent",
                    border: active && !isDark ? "1px solid rgba(148, 41, 69, 0.15)" : "none",
                    color: active ? (isDark ? "#ffffff" : "#942945") : (isDark ? "rgba(255,255,255,0.65)" : "#6a2135"),
                    fontSize: "12px",
                    fontWeight: active ? 800 : 600,
                    fontFamily: "Syne, sans-serif",
                    cursor: "pointer",
                    boxShadow: active ? (isDark ? "0 2px 8px rgba(225,73,109,0.3)" : "0 2px 6px rgba(148,41,69,0.08)") : "none",
                    transition: "all 0.15s ease",
                    whiteSpace: "nowrap"
                  }}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* ── VIEW MODE A: 3D ROTATING / SWAPPING DECK ── */}
          {blueprintLayoutMode === "stack" && (
            <div
              style={{ position: "relative", marginBottom: 30 }}
              onMouseEnter={() => setIsDeckHovered(true)}
              onMouseLeave={() => setIsDeckHovered(false)}
            >
              {blueprintsList.length === 0 ? (
                <div style={{
                  padding: "48px 24px", textAlign: "center",
                  background: isDark ? "rgba(255,255,255,0.02)" : "#ffffff",
                  borderRadius: 20, border: `1px dashed ${isDark ? "rgba(255,255,255,0.15)" : "rgba(148,41,69,0.15)"}`
                }}>
                  <p style={{ margin: 0, color: isDark ? "rgba(255,255,255,0.5)" : "#6a2135", fontSize: 14 }}>
                    No blueprints found matching your search.
                  </p>
                </div>
              ) : (
                <div style={{
                  position: "relative",
                  perspective: "1400px",
                  perspectiveOrigin: "center top",
                  minHeight: 460,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "20px 0 30px"
                }}>
                  {blueprintsList.map((bp, idx) => {
                    const total = blueprintsList.length;
                    const diff = (idx - activeBlueprintIndex + total) % total;
                    const isFront = diff === 0;

                    // 3D Deck Swapping Geometry
                    let transformStr = "";
                    let zIndexVal = 10;
                    let opacityVal = 0;
                    let pointerEventsVal = "none";
                    let filterVal = "none";

                    if (diff === 0) {
                      // Front Card in Focus
                      transformStr = "translateX(0px) translateY(0px) scale(1) translateZ(0px) rotateY(0deg)";
                      zIndexVal = 35;
                      opacityVal = 1;
                      pointerEventsVal = "auto";
                    } else if (diff === 1) {
                      // Second Card (Peeking right & behind)
                      transformStr = "translateX(75px) translateY(12px) scale(0.94) translateZ(-45px) rotateY(-8deg)";
                      zIndexVal = 25;
                      opacityVal = 0.88;
                      pointerEventsVal = "auto";
                      filterVal = isDark ? "brightness(0.85)" : "brightness(0.98)";
                    } else if (diff === 2) {
                      // Third Card (Peeking right & deeper behind)
                      transformStr = "translateX(140px) translateY(24px) scale(0.88) translateZ(-90px) rotateY(-14deg)";
                      zIndexVal = 18;
                      opacityVal = 0.65;
                      pointerEventsVal = "auto";
                      filterVal = isDark ? "brightness(0.7)" : "brightness(0.94)";
                    } else if (diff === total - 1) {
                      // Previous Card (Peeking left & behind)
                      transformStr = "translateX(-75px) translateY(12px) scale(0.94) translateZ(-45px) rotateY(8deg)";
                      zIndexVal = 25;
                      opacityVal = 0.88;
                      pointerEventsVal = "auto";
                      filterVal = isDark ? "brightness(0.85)" : "brightness(0.98)";
                    } else {
                      // Hidden deep in stack
                      transformStr = "translateX(0px) translateY(40px) scale(0.8) translateZ(-160px)";
                      zIndexVal = 5;
                      opacityVal = 0;
                      pointerEventsVal = "none";
                    }

                    return (
                      <div
                        key={bp.id}
                        onClick={() => {
                          if (!isFront) {
                            setActiveBlueprintIndex(idx);
                          }
                        }}
                        style={{
                          position: isFront ? "relative" : "absolute",
                          width: "100%",
                          maxWidth: 720,
                          borderRadius: 22,
                          background: isFront
                            ? (isDark
                                ? "linear-gradient(180deg, #180913 0%, #0e050b 100%)"
                                : "linear-gradient(180deg, #ffffff 0%, #fffbfc 100%)")
                            : (isDark
                                ? "linear-gradient(180deg, #13070f 0%, #0a0308 100%)"
                                : "#ffffff"),
                          border: isFront
                            ? `1.5px solid ${isDark ? "rgba(225, 73, 109, 0.35)" : "rgba(148, 41, 69, 0.18)"}`
                            : `1px solid ${isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(148, 41, 69, 0.08)"}`,
                          padding: "36px 36px 30px",
                          boxShadow: isFront
                            ? (isDark
                                ? "0 24px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(225, 73, 109, 0.08)"
                                : "0 20px 50px rgba(148, 41, 69, 0.08), 0 4px 14px rgba(0, 0, 0, 0.03)")
                            : (isDark
                                ? "0 10px 30px rgba(0, 0, 0, 0.4)"
                                : "0 8px 24px rgba(148, 41, 69, 0.03)"),
                          transform: transformStr,
                          transformStyle: "preserve-3d",
                          zIndex: zIndexVal,
                          opacity: opacityVal,
                          filter: filterVal,
                          pointerEvents: pointerEventsVal,
                          cursor: isFront ? "default" : "pointer",
                          transition: "all 0.55s cubic-bezier(0.34, 1.56, 0.64, 1)",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          boxSizing: "border-box",
                        }}
                      >
                        <div>
                          {/* Card Top Meta */}
                          <div style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: 16
                          }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <span style={{
                                fontSize: "10.5px",
                                fontWeight: 800,
                                fontFamily: "Syne, sans-serif",
                                padding: "3px 10px",
                                borderRadius: 99,
                                background: isDark ? "rgba(225, 73, 109, 0.15)" : "rgba(225, 73, 109, 0.08)",
                                color: "#e1496d",
                                border: `1px solid ${isDark ? "rgba(225, 73, 109, 0.3)" : "rgba(225, 73, 109, 0.2)"}`,
                                textTransform: "uppercase",
                              }}>
                                {bp.tag}
                              </span>
                              <span style={{
                                fontSize: "10.5px",
                                fontWeight: 700,
                                fontFamily: "Syne, sans-serif",
                                color: isDark ? "rgba(255,255,255,0.5)" : "#831843"
                              }}>
                                {bp.nodes?.length || bp.steps.length} Spatial Nodes
                              </span>
                            </div>
                            
                            <span style={{
                              fontSize: "11px",
                              fontFamily: "'JetBrains Mono', monospace",
                              color: isDark ? "#ff8da7" : "#942945",
                              background: isDark ? "rgba(225, 73, 109, 0.08)" : "rgba(225, 73, 109, 0.05)",
                              padding: "3px 8px",
                              borderRadius: 6,
                              border: `1px solid ${isDark ? "rgba(225, 73, 109, 0.18)" : "rgba(225, 73, 109, 0.14)"}`
                            }}>
                              {bp.trigger}
                            </span>
                          </div>

                          {/* Title & Description */}
                          <h3 style={{
                            margin: "0 0 10px",
                            fontSize: "22px",
                            fontWeight: 900,
                            fontFamily: "Syne, sans-serif",
                            color: isDark ? "#ffffff" : "#1a040d",
                            lineHeight: 1.2,
                          }}>
                            {bp.name}
                          </h3>

                          <p style={{
                            margin: "0 0 24px",
                            fontSize: "13.5px",
                            color: isDark ? "rgba(255,255,255,0.7)" : "#5a1827",
                            lineHeight: 1.55,
                          }}>
                            {bp.desc}
                          </p>

                          {/* Visual Step Pipeline Flow */}
                          <div style={{
                            padding: "12px 14px",
                            borderRadius: 12,
                            background: isDark ? "rgba(225, 73, 109, 0.04)" : "rgba(148, 41, 69, 0.03)",
                            border: `1px solid ${isDark ? "rgba(225, 73, 109, 0.12)" : "rgba(148, 41, 69, 0.08)"}`,
                            display: "flex",
                            alignItems: "center",
                            flexWrap: "wrap",
                            gap: "8px",
                            marginBottom: 24,
                          }}>
                            {bp.steps.map((st, i) => (
                              <React.Fragment key={i}>
                                <div style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 5,
                                  background: isDark ? "rgba(255,255,255,0.06)" : "#ffffff",
                                  padding: "4px 8px",
                                  borderRadius: 7,
                                  border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(148, 41, 69, 0.08)"}`
                                }}>
                                  <span style={{
                                    width: 14, height: 14, borderRadius: "50%",
                                    background: "linear-gradient(135deg, #a82348, #e1496d)",
                                    color: "#ffffff",
                                    fontSize: 9, fontWeight: 900,
                                    display: "flex", alignItems: "center", justifyContent: "center"
                                  }}>
                                    {i + 1}
                                  </span>
                                  <span style={{
                                    fontSize: "11px",
                                    fontWeight: 700,
                                    fontFamily: "'JetBrains Mono', monospace",
                                    color: isDark ? "#ffffff" : "#4a0e22",
                                  }}>
                                    {st}
                                  </span>
                                </div>
                                {i < bp.steps.length - 1 && (
                                  <ArrowRight size={12} color="#e1496d" />
                                )}
                              </React.Fragment>
                            ))}
                          </div>
                        </div>

                        {/* Card Bottom CTA & Click to Surface */}
                        {isFront ? (
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <button
                              onClick={() => openBlueprintInStudio(bp.id)}
                              style={{
                                flex: 1,
                                padding: "12px 18px",
                                borderRadius: 12,
                                background: "linear-gradient(135deg, #a82348, #e1496d)",
                                border: "none",
                                color: "#ffffff",
                                fontSize: "13px",
                                fontWeight: 800,
                                fontFamily: "Syne, sans-serif",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 8,
                                boxShadow: "0 4px 16px rgba(225, 73, 109, 0.3)",
                                transition: "all 0.2s ease"
                              }}
                              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
                              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                            >
                              <Play size={13} fill="#fff" />
                              <span>Open in Blueprint Studio</span>
                              <ArrowUpRight size={14} />
                            </button>

                            <button
                              onClick={() => setActiveBlueprintIndex((prev) => (prev + 1) % blueprintsList.length)}
                              style={{
                                padding: "12px 16px",
                                borderRadius: 12,
                                background: isDark ? "rgba(255,255,255,0.06)" : "#ffffff",
                                border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "rgba(148, 41, 69, 0.15)"}`,
                                color: isDark ? "#ffffff" : "#4a0e22",
                                fontSize: "12px",
                                fontWeight: 700,
                                fontFamily: "Syne, sans-serif",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                                transition: "all 0.2s"
                              }}
                              title="Shuffle to Next Blueprint"
                            >
                              <RefreshCw size={13} />
                              <span>Next Card</span>
                            </button>
                          </div>
                        ) : (
                          <div style={{
                            padding: "6px 0",
                            textAlign: "center",
                            fontSize: 11,
                            fontWeight: 700,
                            color: "#e1496d",
                            fontFamily: "Syne, sans-serif",
                            background: isDark ? "rgba(225, 73, 109, 0.08)" : "rgba(225, 73, 109, 0.04)",
                            borderRadius: 8,
                            border: `1px solid ${isDark ? "rgba(225, 73, 109, 0.15)" : "rgba(225, 73, 109, 0.1)"}`
                          }}>
                            Click to Bring to Front ↺
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Shuffling Deck Navigation & Auto-Rotate Indicator */}
              {blueprintsList.length > 1 && (
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 12,
                  marginTop: 10
                }}>
                  <button
                    onClick={() => setActiveBlueprintIndex((prev) => (prev - 1 + blueprintsList.length) % blueprintsList.length)}
                    style={{
                      width: 32, height: 32, borderRadius: "50%",
                      background: isDark ? "rgba(255,255,255,0.06)" : "#ffffff",
                      border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "rgba(148, 41, 69, 0.12)"}`,
                      color: isDark ? "#ffffff" : "#4a0e22",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer", boxShadow: "0 2px 6px rgba(148,41,69,0.04)",
                      transition: "all 0.15s"
                    }}
                    aria-label="Previous Blueprint"
                  >
                    ‹
                  </button>

                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    {blueprintsList.map((_, dotIdx) => (
                      <button
                        key={dotIdx}
                        onClick={() => setActiveBlueprintIndex(dotIdx)}
                        style={{
                          width: activeBlueprintIndex === dotIdx ? 22 : 8,
                          height: 8,
                          borderRadius: 99,
                          background: activeBlueprintIndex === dotIdx 
                            ? "#e1496d" 
                            : (isDark ? "rgba(255,255,255,0.2)" : "rgba(148, 41, 69, 0.15)"),
                          border: "none",
                          cursor: "pointer",
                          boxShadow: activeBlueprintIndex === dotIdx ? "0 0 10px rgba(225, 73, 109, 0.4)" : "none",
                          transition: "all 0.25s ease"
                        }}
                        aria-label={`Go to blueprint ${dotIdx + 1}`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => setActiveBlueprintIndex((prev) => (prev + 1) % blueprintsList.length)}
                    style={{
                      width: 32, height: 32, borderRadius: "50%",
                      background: isDark ? "rgba(255,255,255,0.06)" : "#ffffff",
                      border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "rgba(148, 41, 69, 0.12)"}`,
                      color: isDark ? "#ffffff" : "#4a0e22",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer", boxShadow: "0 2px 6px rgba(148,41,69,0.04)",
                      transition: "all 0.15s"
                    }}
                    aria-label="Next Blueprint"
                  >
                    ›
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── VIEW MODE B: ALL-IN-ONE CLEAN GRID ── */}
          {blueprintLayoutMode === "grid" && (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
              gap: 22,
            }}>
              {blueprintsList.map((bp) => (
                <div
                  key={bp.id}
                  style={{
                    borderRadius: 18,
                    background: isDark ? "linear-gradient(180deg, #180913 0%, #0e050b 100%)" : "#ffffff",
                    border: `1px solid ${isDark ? "rgba(225, 73, 109, 0.22)" : "rgba(148, 41, 69, 0.12)"}`,
                    boxShadow: isDark ? "0 8px 24px rgba(0,0,0,0.4)" : "0 4px 18px rgba(148, 41, 69, 0.05)",
                    padding: "24px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    transition: "all 0.25s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.borderColor = "#e1496d";
                    e.currentTarget.style.boxShadow = isDark ? "0 12px 30px rgba(225, 73, 109, 0.25)" : "0 8px 24px rgba(148, 41, 69, 0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.borderColor = isDark ? "rgba(225, 73, 109, 0.22)" : "rgba(148, 41, 69, 0.12)";
                    e.currentTarget.style.boxShadow = isDark ? "0 8px 24px rgba(0,0,0,0.4)" : "0 4px 18px rgba(148, 41, 69, 0.05)";
                  }}
                >
                  <div>
                    {/* Card Header */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                      <span style={{
                        fontSize: "10.5px",
                        fontWeight: 800,
                        fontFamily: "Syne, sans-serif",
                        padding: "3px 8px",
                        borderRadius: 99,
                        background: isDark ? "rgba(225, 73, 109, 0.15)" : "rgba(225, 73, 109, 0.08)",
                        color: "#e1496d",
                        border: `1px solid ${isDark ? "rgba(225, 73, 109, 0.3)" : "rgba(225, 73, 109, 0.2)"}`,
                        textTransform: "uppercase",
                      }}>
                        {bp.tag}
                      </span>
                      
                      <span style={{
                        fontSize: "10.5px",
                        fontFamily: "'JetBrains Mono', monospace",
                        color: isDark ? "#ff8da7" : "#942945",
                      }}>
                        {bp.trigger}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <h3 style={{
                      margin: "0 0 8px",
                      fontSize: "18px",
                      fontWeight: 800,
                      fontFamily: "Syne, sans-serif",
                      color: isDark ? "#ffffff" : "#1a040d",
                      lineHeight: 1.25,
                    }}>
                      {bp.name}
                    </h3>

                    <p style={{
                      margin: "0 0 16px",
                      fontSize: "13px",
                      color: isDark ? "rgba(255,255,255,0.65)" : "#5a1827",
                      lineHeight: 1.45,
                    }}>
                      {bp.desc}
                    </p>

                    {/* Visual Step Chain */}
                    <div style={{
                      padding: "8px 10px",
                      borderRadius: 10,
                      background: isDark ? "rgba(225, 73, 109, 0.04)" : "rgba(148, 41, 69, 0.03)",
                      border: `1px solid ${isDark ? "rgba(225, 73, 109, 0.12)" : "rgba(148, 41, 69, 0.08)"}`,
                      display: "flex",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "5px",
                      marginBottom: 20,
                    }}>
                      {bp.steps.map((st, i) => (
                        <React.Fragment key={i}>
                          <span style={{
                            fontSize: "10.5px",
                            fontWeight: 700,
                            fontFamily: "'JetBrains Mono', monospace",
                            color: isDark ? "#ffffff" : "#4a0e22",
                          }}>
                            {st}
                          </span>
                          {i < bp.steps.length - 1 && (
                            <ArrowRight size={10} color="#e1496d" />
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  {/* Launch in Studio Button */}
                  <button
                    onClick={() => openBlueprintInStudio(bp.id)}
                    style={{
                      width: "100%",
                      padding: "11px",
                      borderRadius: 10,
                      background: "linear-gradient(135deg, #a82348, #e1496d)",
                      border: "none",
                      color: "#ffffff",
                      fontSize: "12.5px",
                      fontWeight: 800,
                      fontFamily: "Syne, sans-serif",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      boxShadow: "0 2px 10px rgba(225, 73, 109, 0.25)",
                      transition: "all 0.2s ease"
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                  >
                    <Play size={12} fill="#fff" />
                    <span>Open in Blueprint Studio</span>
                    <ArrowUpRight size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── PANORAMIC DEVELOPER COMMUNITY LANDSCAPE ARTWORK (PIPELINE TWILIGHT SHADE) ── */}
        <CommunityLandscapeBanner onNavigate={onNavigate} isDark={isDark} showText={false} themeShade="pipeline" />

        {/* Global Styles */}
        <style>{`
          @keyframes pipelineStream {
            from { stroke-dashoffset: 24; }
            to { stroke-dashoffset: 0; }
          }
          @keyframes ping {
            0% { transform: scale(1); opacity: 1; }
            75%, 100% { transform: scale(2); opacity: 0; }
          }
          @keyframes birdSway {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-14px) rotate(3deg); }
          }
          @keyframes wingFlapL {
            0%, 100% { transform: scaleY(1); }
            50% { transform: scaleY(0.75) rotate(-4deg); }
          }
          @keyframes floatBob1 {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-7px) rotate(-1.5deg); }
          }
          @keyframes floatSoar2 {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-12px) rotate(2deg); }
          }
          @keyframes floatPhoenix3 {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-9px) rotate(-1deg); }
          }
          @keyframes mascotSpin {
            to { transform: rotate(360deg); }
          }
          @keyframes haloPulse {
            0%, 100% { transform: scale(1); opacity: 0.7; }
            50% { transform: scale(1.3); opacity: 1; }
          }
          @keyframes auraRadiate {
            0%, 100% { transform: scale(1); opacity: 0.6; }
            50% { transform: scale(1.15); opacity: 0.9; }
          }
          .mascot-anim-bob1 { animation: floatBob1 3.6s ease-in-out infinite; }
          .mascot-anim-soar { animation: floatSoar2 3.2s ease-in-out infinite; }
          .mascot-anim-phoenix { animation: floatPhoenix3 4.2s ease-in-out infinite; }
          .mascot-anim-spin { transform-origin: 94px 23px; animation: mascotSpin 3.5s linear infinite; }
          .mascot-halo-pulse { transform-origin: 130px 55px; animation: haloPulse 2.4s ease-in-out infinite; }
          .mascot-aura-radiate { transform-origin: 100px 80px; animation: auraRadiate 3s ease-in-out infinite; }
        `}</style>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // VIEW 2: VISUAL DAG PIPELINE CANVAS STUDIO
  // ══════════════════════════════════════════════════════════════════════════════
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: isEmbedded ? "calc(100vh - 72px)" : "100vh",
        width: "100%",
        background: isDark ? "#0c040a" : "#fdf8fa",
        color: isDark ? "#ffffff" : "#1a040d",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        overflow: "hidden",
        position: "relative",
      }}
      onMouseMove={handleMouseMoveCanvas}
      onMouseUp={handleMouseUpCanvas}
    >
      {/* ── TOP STUDIO TOOLBAR ── */}
      <header style={{
        height: 56,
        background: isDark ? "rgba(16, 5, 14, 0.96)" : "rgba(255, 255, 255, 0.98)",
        borderBottom: `1px solid ${isDark ? "rgba(225, 73, 109, 0.2)" : "rgba(148, 41, 69, 0.12)"}`,
        backdropFilter: "blur(16px)",
        padding: "0 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        zIndex: 25,
        gap: 12,
        boxShadow: !isDark ? "0 2px 8px rgba(148,41,69,0.04)" : "none",
      }}>
        {/* Left: Back to Hub + Active Pipeline Title */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button
            onClick={() => setViewMode("hub")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 12px",
              borderRadius: 8,
              background: isDark ? "rgba(255,255,255,0.06)" : "rgba(148,41,69,0.06)",
              border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(148,41,69,0.12)"}`,
              color: isDark ? "#ffffff" : "#831843",
              fontSize: "12px",
              fontWeight: 700,
              fontFamily: "Syne, sans-serif",
              cursor: "pointer",
            }}
          >
            <ArrowLeft size={14} />
            <span>Pipelines Hub</span>
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: "linear-gradient(135deg, #a855f7, #e1496d)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff",
            }}>
              <Cpu size={15} />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 13.5, fontWeight: 800, fontFamily: "Syne, sans-serif" }}>
                  {BLUEPRINT_PRESETS[activeBlueprintPreset]?.name || "Custom DAG Pipeline"}
                </span>
                <span style={{
                  fontSize: 9, padding: "2px 6px", borderRadius: 4,
                  background: "rgba(168, 85, 247, 0.15)", color: "#a855f7",
                  border: "1px solid rgba(168, 85, 247, 0.3)", fontWeight: 800,
                }}>
                  LIVE CANVAS
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Center Blueprint Presets Selector */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          background: isDark ? "rgba(255,255,255,0.04)" : "rgba(148,41,69,0.05)",
          padding: "3px 6px",
          borderRadius: 10,
          border: `1px solid ${isDark ? "rgba(225,73,109,0.15)" : "rgba(148,41,69,0.12)"}`,
        }}>
          {[
            { id: "release_ci", label: "Release CI/CD" },
            { id: "social_hero", label: "Social OG Card" },
            { id: "brand_matrix", label: "Favicon Matrix" },
            { id: "tech_spec", label: "Tech Spec PDF" },
          ].map(p => {
            const active = activeBlueprintPreset === p.id;
            return (
              <button
                key={p.id}
                onClick={() => openBlueprintInStudio(p.id)}
                style={{
                  padding: "5px 12px",
                  borderRadius: 7,
                  background: active 
                    ? "linear-gradient(135deg, #e1496d, #942945)" 
                    : "transparent",
                  border: "none",
                  color: active ? "#ffffff" : (isDark ? "rgba(255,255,255,0.7)" : "#4a0e22"),
                  fontSize: 11.5,
                  fontWeight: active ? 800 : 600,
                  fontFamily: "Syne, sans-serif",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        {/* Right Action Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Zoom controls */}
          <div style={{
            display: "flex",
            alignItems: "center",
            background: isDark ? "rgba(255,255,255,0.05)" : "rgba(148,41,69,0.06)",
            borderRadius: 8,
            padding: "2px 4px",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(148,41,69,0.1)"}`,
          }}>
            <button
              onClick={() => setZoom(z => Math.max(0.5, z - 0.1))}
              style={{ background: "none", border: "none", color: "inherit", padding: "4px 6px", cursor: "pointer" }}
              title="Zoom Out"
            >
              <ZoomOut size={13} />
            </button>
            <span style={{ fontSize: 11, fontWeight: 700, minWidth: 36, textAlign: "center" }}>
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom(z => Math.min(1.5, z + 0.1))}
              style={{ background: "none", border: "none", color: "inherit", padding: "4px 6px", cursor: "pointer" }}
              title="Zoom In"
            >
              <ZoomIn size={13} />
            </button>
          </div>

          {/* Add Node Button */}
          <button
            onClick={() => setShowAddNodeModal(true)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 13px",
              borderRadius: 8,
              background: isDark ? "rgba(255,255,255,0.06)" : "#ffffff",
              border: `1px solid ${isDark ? "rgba(225,73,109,0.25)" : "rgba(148,41,69,0.2)"}`,
              color: "inherit",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            <Plus size={14} color="#e1496d" />
            <span>Add Node</span>
          </button>

          {/* Export YAML */}
          <button
            onClick={() => setShowExportModal(true)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 13px",
              borderRadius: 8,
              background: "rgba(2, 132, 199, 0.12)",
              border: "1px solid rgba(2, 132, 199, 0.35)",
              color: "#0284c7",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            <FileCode size={14} color="#0284c7" />
            <span>Export YAML</span>
          </button>

          {/* Run DAG Pipeline Button */}
          <button
            onClick={runPipeline}
            disabled={isRunning}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "7px 18px",
              borderRadius: 99,
              background: isRunning 
                ? "rgba(225, 73, 109, 0.35)" 
                : "linear-gradient(135deg, #e1496d, #942945)",
              border: "none",
              color: "#ffffff",
              fontSize: 12.5,
              fontWeight: 800,
              fontFamily: "Syne, sans-serif",
              cursor: isRunning ? "wait" : "pointer",
              boxShadow: isRunning ? "none" : "0 6px 18px rgba(225, 73, 109, 0.4)",
              transition: "all 0.2s ease",
            }}
          >
            <Play size={13} fill="#ffffff" />
            <span>{isRunning ? "Executing DAG..." : "Run Pipeline"}</span>
          </button>
        </div>
      </header>

      {/* ── MAIN WORKSPACE: CANVAS + NODE INSPECTOR ── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden", position: "relative" }}>
        
        {/* Spatial Node Graph Canvas */}
        <div
          style={{
            flex: 1,
            position: "relative",
            overflow: "hidden",
            cursor: isDraggingCanvas ? "grabbing" : "grab",
            background: isDark
              ? `
                radial-gradient(circle at 50% 50%, rgba(225, 73, 109, 0.05) 0%, transparent 80%),
                linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
              `
              : `
                radial-gradient(circle at 50% 50%, rgba(148, 41, 69, 0.04) 0%, transparent 80%),
                linear-gradient(rgba(148, 41, 69, 0.04) 1px, transparent 1px),
                linear-gradient(90deg, rgba(148, 41, 69, 0.04) 1px, transparent 1px)
              `,
            backgroundSize: "100% 100%, 28px 28px, 28px 28px",
          }}
          onMouseDown={handleMouseDownCanvas}
        >
          <div style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "0 0",
            position: "absolute",
            inset: 0,
          }}>
            
            {/* SVG Connecting Bezier Wires */}
            <svg style={{ position: "absolute", top: 0, left: 0, width: 5000, height: 5000, pointerEvents: "none", overflow: "visible" }}>
              <defs>
                <linearGradient id="wireGradActive" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#e1496d" />
                  <stop offset="100%" stopColor="#0284c7" />
                </linearGradient>
                <filter id="wireGlow" x="-20%" y="-20%" width="140%" height="140%">
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
                    {/* Wire Base Shadow */}
                    <path
                      d={path}
                      fill="none"
                      stroke={isDark ? "#000000" : "rgba(148, 41, 69, 0.12)"}
                      strokeWidth={5}
                      opacity={0.5}
                    />
                    {/* Active Wire Path */}
                    <path
                      d={path}
                      fill="none"
                      stroke={isWireActive ? "url(#wireGradActive)" : (isDark ? "rgba(225, 73, 109, 0.5)" : "rgba(148, 41, 69, 0.35)")}
                      strokeWidth={isWireActive ? 3.5 : 2}
                      strokeDasharray={isWireActive ? "6, 3" : "none"}
                      filter={isWireActive ? "url(#wireGlow)" : "none"}
                    />
                    
                    {/* Animated laser pulse when running */}
                    {isRunning && (
                      <circle r={4} fill="#0284c7" filter="url(#wireGlow)">
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
                  stroke="#0284c7"
                  strokeWidth={2.5}
                  strokeDasharray="4, 4"
                />
              )}
            </svg>

            {/* ── Render Nodes on Canvas ── */}
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
                    borderRadius: 12,
                    background: isDark 
                      ? (isSelected ? "rgba(24, 7, 20, 0.95)" : "rgba(16, 5, 14, 0.92)") 
                      : (isSelected ? "#ffffff" : "rgba(255, 255, 255, 0.94)"),
                    border: `1.5px solid ${isSelected ? node.color : (isDark ? "rgba(225,73,109,0.25)" : "rgba(148,41,69,0.14)")}`,
                    boxShadow: isSelected 
                      ? `0 14px 36px rgba(0,0,0,0.25), 0 0 16px ${node.color}40` 
                      : (isDark ? "0 8px 24px rgba(0,0,0,0.4)" : "0 6px 18px rgba(148,41,69,0.06)"),
                    backdropFilter: "blur(16px)",
                    cursor: "move",
                    zIndex: isSelected ? 20 : 10,
                    transition: "border 0.2s, box-shadow 0.2s",
                  }}
                >
                  {/* Node Header */}
                  <div style={{
                    padding: "9px 12px",
                    borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(148,41,69,0.08)"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <div style={{
                        width: 7, height: 7, borderRadius: "50%",
                        background: node.color,
                        boxShadow: `0 0 6px ${node.color}`,
                      }} />
                      <span style={{
                        fontSize: 9.5, fontWeight: 800,
                        fontFamily: "Syne, sans-serif",
                        color: node.color,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}>
                        {node.category}
                      </span>
                    </div>

                    {/* Status Pill */}
                    <div style={{
                      fontSize: 8.5, fontWeight: 700, padding: "1px 5px", borderRadius: 4,
                      background: isNodeRunning 
                        ? "rgba(2,132,199,0.18)" 
                        : (isNodeDone ? "rgba(22,163,74,0.18)" : (isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)")),
                      color: isNodeRunning 
                        ? "#0284c7" 
                        : (isNodeDone ? "#16a34a" : (isDark ? "rgba(255,255,255,0.6)" : "#6b7280")),
                    }}>
                      {isNodeRunning ? "RUNNING" : (isNodeDone ? "DONE" : "READY")}
                    </div>
                  </div>

                  {/* Node Body */}
                  <div style={{ padding: "10px 12px" }}>
                    <div style={{
                      fontSize: 12.5, fontWeight: 800,
                      fontFamily: "Syne, sans-serif",
                      color: isDark ? "#ffffff" : "#1a040d",
                      marginBottom: 4,
                    }}>
                      {node.title}
                    </div>
                    <div style={{
                      fontSize: 10.5,
                      color: isDark ? "rgba(255,255,255,0.6)" : "rgba(26,4,13,0.6)",
                      fontFamily: "'JetBrains Mono', monospace",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}>
                      {node.type}
                    </div>
                  </div>

                  {/* Input Port (Left) */}
                  {node.inputs.map((inp) => (
                    <div
                      key={inp.id}
                      className="port-handle"
                      onMouseUp={(e) => handlePortMouseUp(e, node.id, inp.id, true)}
                      style={{
                        position: "absolute",
                        left: -7,
                        top: 48,
                        width: 14,
                        height: 14,
                        borderRadius: "50%",
                        background: isDark ? "#140510" : "#ffffff",
                        border: `2.5px solid ${node.color}`,
                        cursor: "crosshair",
                        zIndex: 25,
                      }}
                      title={`Input: ${inp.label}`}
                    />
                  ))}

                  {/* Output Port (Right) */}
                  {node.outputs.map((outp) => (
                    <div
                      key={outp.id}
                      className="port-handle"
                      onMouseDown={(e) => handlePortMouseDown(e, node.id, outp.id, true, node.x, node.y)}
                      style={{
                        position: "absolute",
                        right: -7,
                        top: 48,
                        width: 14,
                        height: 14,
                        borderRadius: "50%",
                        background: node.color,
                        border: "2px solid #ffffff",
                        cursor: "crosshair",
                        zIndex: 25,
                        boxShadow: `0 0 8px ${node.color}`,
                      }}
                      title={`Output: ${outp.label}`}
                    />
                  ))}
                </div>
              );
            })}

          </div>
        </div>

        {/* ── RIGHT NODE INSPECTOR PANEL ── */}
        <aside style={{
          width: 320,
          background: isDark ? "rgba(14, 4, 12, 0.96)" : "rgba(255, 255, 255, 0.98)",
          borderLeft: `1px solid ${isDark ? "rgba(225, 73, 109, 0.2)" : "rgba(148, 41, 69, 0.12)"}`,
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          overflowY: "auto",
          zIndex: 20,
          boxShadow: !isDark ? "-2px 0 10px rgba(148,41,69,0.04)" : "none",
        }}>
          {selectedNode ? (
            <>
              {/* Header */}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <div>
                  <div style={{
                    fontSize: 9.5, fontWeight: 800, color: selectedNode.color,
                    fontFamily: "Syne, sans-serif", textTransform: "uppercase",
                    letterSpacing: "0.06em", marginBottom: 3,
                  }}>
                    {selectedNode.category} NODE
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 800, fontFamily: "Syne, sans-serif" }}>
                    {selectedNode.title}
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteNode(selectedNode.id)}
                  style={{
                    background: "rgba(239, 68, 68, 0.12)",
                    border: "1px solid rgba(239, 68, 68, 0.3)",
                    color: "#ef4444",
                    borderRadius: 6,
                    padding: 6,
                    cursor: "pointer",
                  }}
                  title="Delete Node"
                >
                  <Trash2 size={13} />
                </button>
              </div>

              {/* Node Metadata */}
              <div style={{
                padding: "10px 12px", borderRadius: 10,
                background: isDark ? "rgba(255,255,255,0.03)" : "rgba(148,41,69,0.04)",
                border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(148,41,69,0.08)"}`,
                fontSize: 11,
                fontFamily: "'JetBrains Mono', monospace",
                display: "flex", flexDirection: "column", gap: 4,
              }}>
                <div>ID: <span style={{ color: selectedNode.color }}>{selectedNode.id}</span></div>
                <div>TYPE: <span>{selectedNode.type}</span></div>
                <div>STATUS: <span style={{ color: "#16a34a" }}>{selectedNode.status.toUpperCase()}</span></div>
              </div>

              {/* Configurable Parameters */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, fontFamily: "Syne, sans-serif", marginBottom: 10 }}>
                  NODE PARAMETERS
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {Object.entries(selectedNode.params || {}).map(([key, val]) => (
                    <div key={key}>
                      <label style={{
                        display: "block", fontSize: 10.5, fontWeight: 600,
                        color: isDark ? "rgba(255,255,255,0.6)" : "rgba(26,4,13,0.65)",
                        marginBottom: 4, textTransform: "capitalize",
                      }}>
                        {key.replace(/([A-Z])/g, " $1")}
                      </label>

                      {typeof val === "boolean" ? (
                        <button
                          type="button"
                          onClick={() => handleParamChange(key, !val)}
                          style={{
                            padding: "6px 12px", borderRadius: 6,
                            background: val ? "#e1496d" : (isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"),
                            border: "none", color: "#ffffff", fontSize: 11, fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          {val ? "Enabled" : "Disabled"}
                        </button>
                      ) : (
                        <input
                          type="text"
                          value={val}
                          onChange={(e) => handleParamChange(key, e.target.value)}
                          style={{
                            width: "100%", padding: "7px 10px", borderRadius: 8,
                            background: isDark ? "rgba(255,255,255,0.05)" : "#ffffff",
                            border: `1px solid ${isDark ? "rgba(225,73,109,0.25)" : "rgba(148,41,69,0.18)"}`,
                            color: "inherit", fontSize: 11.5,
                            fontFamily: "'JetBrains Mono', monospace",
                            boxSizing: "border-box", outline: "none",
                          }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
                <button
                  onClick={runPipeline}
                  style={{
                    padding: "9px", borderRadius: 8,
                    background: "linear-gradient(135deg, #e1496d, #942945)",
                    border: "none", color: "#ffffff",
                    fontSize: 12, fontWeight: 800, fontFamily: "Syne, sans-serif",
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  }}
                >
                  <Play size={12} fill="#fff" />
                  <span>Execute Node Step</span>
                </button>
              </div>
            </>
          ) : (
            <div style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", height: "100%", textAlign: "center",
              color: isDark ? "rgba(255,255,255,0.4)" : "rgba(26,4,13,0.4)",
              gap: 8,
            }}>
              <Compass size={28} />
              <div style={{ fontSize: 12.5, fontWeight: 700, fontFamily: "Syne, sans-serif" }}>
                Select a node on canvas
              </div>
              <div style={{ fontSize: 11 }}>
                Click any pipeline node to inspect and edit its execution parameters.
              </div>
            </div>
          )}
        </aside>

      </div>

      {/* ── BOTTOM COLLAPSIBLE EXECUTION TERMINAL DRAWER ── */}
      {outputDrawerOpen && (
        <div style={{
          height: 160,
          background: isDark ? "#080206" : "#1a040d",
          borderTop: "1px solid rgba(225, 73, 109, 0.3)",
          display: "flex",
          flexDirection: "column",
          zIndex: 30,
        }}>
          <div style={{
            padding: "6px 16px",
            background: "rgba(225, 73, 109, 0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 11,
            fontFamily: "'JetBrains Mono', monospace",
            color: "#ff8da7",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Terminal size={12} />
              <span>DAG EXECUTION LOGS</span>
            </div>
            <button
              onClick={() => setOutputDrawerOpen(false)}
              style={{ background: "none", border: "none", color: "#ff8da7", cursor: "pointer" }}
            >
              <X size={13} />
            </button>
          </div>

          <div style={{
            flex: 1, padding: "10px 16px", overflowY: "auto",
            fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
            display: "flex", flexDirection: "column", gap: 4,
          }}>
            {executionLogs.map((log, i) => (
              <div key={i} style={{
                color: log.type === "success" ? "#22c55e" : (log.type === "running" ? "#38bdf8" : "rgba(255,255,255,0.7)"),
              }}>
                <span style={{ opacity: 0.5, marginRight: 8 }}>[{log.time}]</span>
                <span>{log.msg}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── MODAL: ADD NEW NODE ── */}
      {showAddNodeModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)",
          backdropFilter: "blur(8px)", display: "flex", alignItems: "center",
          justifyContent: "center", zIndex: 100, padding: 20,
        }}>
          <div style={{
            width: "100%", maxWidth: 540, borderRadius: 18,
            background: isDark ? "#140511" : "#ffffff",
            border: `1px solid ${isDark ? "rgba(225,73,109,0.3)" : "rgba(148,41,69,0.18)"}`,
            padding: 24, boxShadow: "0 20px 60px rgba(0,0,0,0.8)",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div style={{ fontSize: 16, fontWeight: 800, fontFamily: "Syne, sans-serif" }}>
                Add Pipeline Node
              </div>
              <button
                onClick={() => setShowAddNodeModal(false)}
                style={{ background: "none", border: "none", color: "inherit", cursor: "pointer" }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {NODE_LIBRARY.map((tmpl, idx) => (
                <div
                  key={idx}
                  onClick={() => handleAddNodeFromLib(tmpl)}
                  style={{
                    padding: "12px", borderRadius: 12,
                    background: isDark ? "rgba(255,255,255,0.04)" : "rgba(148,41,69,0.04)",
                    border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(148,41,69,0.12)"}`,
                    cursor: "pointer", transition: "all 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = tmpl.color;
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = isDark ? "rgba(255,255,255,0.08)" : "rgba(148,41,69,0.12)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div style={{ fontSize: 9, fontWeight: 800, color: tmpl.color, textTransform: "uppercase", marginBottom: 4 }}>
                    {tmpl.category}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 800, fontFamily: "Syne, sans-serif", marginBottom: 2 }}>
                    {tmpl.title}
                  </div>
                  <div style={{ fontSize: 10.5, color: isDark ? "rgba(255,255,255,0.5)" : "rgba(26,4,13,0.5)" }}>
                    {tmpl.type}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: EXPORT GITHUB ACTIONS YAML ── */}
      {showExportModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)",
          backdropFilter: "blur(8px)", display: "flex", alignItems: "center",
          justifyContent: "center", zIndex: 100, padding: 20,
        }}>
          <div style={{
            width: "100%", maxWidth: 640, borderRadius: 18,
            background: isDark ? "#140511" : "#ffffff",
            border: `1px solid ${isDark ? "rgba(225,73,109,0.3)" : "rgba(148,41,69,0.18)"}`,
            padding: 24, boxShadow: "0 20px 60px rgba(0,0,0,0.8)",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <FileCode size={16} color="#0284c7" />
                <span style={{ fontSize: 16, fontWeight: 800, fontFamily: "Syne, sans-serif" }}>
                  GitHub Actions CI/CD Workflow
                </span>
              </div>
              <button
                onClick={() => setShowExportModal(false)}
                style={{ background: "none", border: "none", color: "inherit", cursor: "pointer" }}
              >
                <X size={16} />
              </button>
            </div>

            <pre style={{
              padding: "14px", borderRadius: 10,
              background: "#080206", color: "#38bdf8",
              fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
              maxHeight: 280, overflowY: "auto",
              border: "1px solid rgba(56, 189, 248, 0.2)",
              margin: "0 0 16px",
            }}>
              {generateGitHubActionsYaml()}
            </pre>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(generateGitHubActionsYaml());
                  setCopiedCode(true);
                  setTimeout(() => setCopiedCode(false), 2000);
                }}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "8px 18px", borderRadius: 8,
                  background: "linear-gradient(135deg, #e1496d, #942945)",
                  border: "none", color: "#ffffff",
                  fontSize: 12, fontWeight: 800, fontFamily: "Syne, sans-serif",
                  cursor: "pointer",
                }}
              >
                {copiedCode ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedCode ? "Copied YAML!" : "Copy to Clipboard"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
