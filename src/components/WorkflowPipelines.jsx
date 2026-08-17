import React, { useState, useRef, useEffect } from "react";
import { 
  ArrowLeft, Play, Plus, Trash2, Cpu, Zap, Sparkles, 
  Layers, Download, RefreshCw, ZoomIn, ZoomOut, Check, Terminal, Eye,
  Code, Copy, Shield, GitBranch, Cloud, Share2, Settings, Box,
  CheckCircle2, AlertCircle, FileCode, Clock, ArrowRight, X, ChevronRight,
  Maximize2, Database, Send, Radio, Compass, Sliders, PlayCircle, Search,
  Filter, Grid, ArrowUpRight, CheckCheck, Bookmark
} from "lucide-react";

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
        padding: "40px 48px 80px",
        boxSizing: "border-box",
      }}>
        {/* Top Hub Navigation Bar */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 36,
          flexWrap: "wrap",
          gap: 16,
        }}>
          <div>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "4px 12px",
              borderRadius: 99,
              background: isDark ? "rgba(225, 73, 109, 0.15)" : "rgba(225, 73, 109, 0.08)",
              border: `1px solid ${isDark ? "rgba(225, 73, 109, 0.3)" : "rgba(148, 41, 69, 0.15)"}`,
              marginBottom: 10,
            }}>
              <Cpu size={13} color="#e1496d" />
              <span style={{
                fontSize: 11,
                fontWeight: 800,
                fontFamily: "Syne, sans-serif",
                color: "#e1496d",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}>
                Workflow Automation Hub
              </span>
            </div>

            <h1 style={{
              margin: "0 0 6px",
              fontSize: "clamp(28px, 3.5vw, 42px)",
              fontWeight: 900,
              fontFamily: "Syne, sans-serif",
              letterSpacing: "-0.03em",
              color: isDark ? "#ffffff" : "#4a0e22",
            }}>
              Workflow Pipelines
            </h1>
            <p style={{
              margin: 0,
              fontSize: "14.5px",
              color: isDark ? "rgba(255,255,255,0.7)" : "#6a2135",
              maxWidth: 640,
              lineHeight: 1.45,
            }}>
              Automate developer creative assets, 3D code bakes, and GitHub release media with visual node DAG graphs.
            </p>
          </div>

          {/* Create Blank Pipeline Button */}
          <button
            onClick={() => openBlueprintInStudio("custom")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 24px",
              borderRadius: 12,
              background: "linear-gradient(135deg, #e1496d, #942945)",
              border: "none",
              color: "#ffffff",
              fontSize: "13.5px",
              fontWeight: 800,
              fontFamily: "Syne, sans-serif",
              cursor: "pointer",
              boxShadow: "0 6px 20px rgba(225, 73, 109, 0.35)",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 10px 28px rgba(225, 73, 109, 0.5)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(225, 73, 109, 0.35)";
            }}
          >
            <Plus size={16} />
            <span>Create Blank Pipeline</span>
          </button>
        </div>

        {/* Filter Chips & Search Bar */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 32,
          flexWrap: "wrap",
          gap: 16,
        }}>
          {/* Category Tabs */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: isDark ? "rgba(255,255,255,0.04)" : "rgba(148, 41, 69, 0.05)",
            padding: "4px 8px",
            borderRadius: 12,
            border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(148, 41, 69, 0.1)"}`,
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
                  onClick={() => setActiveCategory(cat.id)}
                  style={{
                    padding: "7px 16px",
                    borderRadius: 9,
                    background: active 
                      ? (isDark ? "linear-gradient(135deg, #e1496d, #942945)" : "#ffffff") 
                      : "transparent",
                    border: active && !isDark ? "1px solid rgba(148, 41, 69, 0.15)" : "none",
                    color: active ? (isDark ? "#ffffff" : "#942945") : (isDark ? "rgba(255,255,255,0.7)" : "#6a2135"),
                    fontSize: "12.5px",
                    fontWeight: active ? 800 : 600,
                    fontFamily: "Syne, sans-serif",
                    cursor: "pointer",
                    boxShadow: active && !isDark ? "0 2px 8px rgba(148,41,69,0.08)" : "none",
                    transition: "all 0.15s ease",
                  }}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div style={{
            position: "relative",
            minWidth: 260,
          }}>
            <Search size={15} style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: isDark ? "rgba(255,255,255,0.4)" : "rgba(148,41,69,0.4)",
            }} />
            <input
              type="text"
              placeholder="Search pipelines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 14px 8px 36px",
                borderRadius: 10,
                background: isDark ? "rgba(255,255,255,0.05)" : "#ffffff",
                border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "rgba(148, 41, 69, 0.18)"}`,
                color: "inherit",
                fontSize: "12.5px",
                outline: "none",
                boxSizing: "border-box",
                boxShadow: !isDark ? "0 2px 6px rgba(148,41,69,0.04)" : "none",
              }}
            />
          </div>
        </div>

        {/* Blueprint Cards Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
          gap: 24,
        }}>
          {blueprintsList.map((bp) => (
            <div
              key={bp.id}
              style={{
                borderRadius: 18,
                background: isDark ? "rgba(18, 5, 14, 0.88)" : "#ffffff",
                border: `1.5px solid ${isDark ? "rgba(225, 73, 109, 0.22)" : "rgba(148, 41, 69, 0.12)"}`,
                boxShadow: isDark 
                  ? "0 10px 30px rgba(0,0,0,0.5)" 
                  : "0 8px 24px rgba(148, 41, 69, 0.06)",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transition: "all 0.25s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.borderColor = "#e1496d";
                e.currentTarget.style.boxShadow = isDark 
                  ? "0 16px 40px rgba(225, 73, 109, 0.25)" 
                  : "0 14px 36px rgba(148, 41, 69, 0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = isDark ? "rgba(225, 73, 109, 0.22)" : "rgba(148, 41, 69, 0.12)";
                e.currentTarget.style.boxShadow = isDark 
                  ? "0 10px 30px rgba(0,0,0,0.5)" 
                  : "0 8px 24px rgba(148, 41, 69, 0.06)";
              }}
            >
              <div>
                {/* Card Header */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <span style={{
                    fontSize: "10.5px",
                    fontWeight: 800,
                    fontFamily: "Syne, sans-serif",
                    padding: "3px 10px",
                    borderRadius: 99,
                    background: "rgba(225, 73, 109, 0.1)",
                    color: "#e1496d",
                    border: "1px solid rgba(225, 73, 109, 0.25)",
                    textTransform: "uppercase",
                  }}>
                    {bp.tag}
                  </span>
                  
                  <span style={{
                    fontSize: "11px",
                    fontFamily: "'JetBrains Mono', monospace",
                    color: isDark ? "rgba(255,255,255,0.5)" : "#831843",
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
                  margin: "0 0 20px",
                  fontSize: "13px",
                  color: isDark ? "rgba(255,255,255,0.7)" : "#5a1827",
                  lineHeight: 1.45,
                }}>
                  {bp.desc}
                </p>

                {/* Visual Step Chain */}
                <div style={{
                  padding: "10px 12px",
                  borderRadius: 10,
                  background: isDark ? "rgba(255,255,255,0.03)" : "rgba(148, 41, 69, 0.03)",
                  border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(148, 41, 69, 0.08)"}`,
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "6px",
                  marginBottom: 22,
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
                        <ArrowRight size={11} color="#e1496d" />
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
                  background: "linear-gradient(135deg, #e1496d, #942945)",
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
                  boxShadow: "0 4px 14px rgba(225, 73, 109, 0.25)",
                }}
              >
                <span>Open in Blueprint Canvas</span>
                <ArrowUpRight size={15} />
              </button>
            </div>
          ))}
        </div>
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
