import React, { useState, useRef, useEffect } from "react";
import { 
  ArrowLeft, Play, Plus, Trash2, Cpu, Zap, Sparkles, 
  Layers, Download, RefreshCw, ZoomIn, ZoomOut, Check, Terminal, Eye
} from "lucide-react";

export default function WorkflowPipelines({ onBack, onNavigate, user }) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 40, y: 40 });
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [draggingNodeId, setDraggingNodeId] = useState(null);
  const [nodeOffset, setNodeOffset] = useState({ x: 0, y: 0 });
  
  const [isRunning, setIsRunning] = useState(false);
  const [executionStep, setExecutionStep] = useState(0);
  const [executionLogs, setExecutionLogs] = useState([]);
  const [outputDrawerOpen, setOutputDrawerOpen] = useState(false);
  const [showAddNodeModal, setShowAddNodeModal] = useState(false);

  // Initial Blueprint Nodes
  const initialNodes = [
    {
      id: "node_1",
      title: "User Prompt Input",
      category: "input",
      type: "Prompt",
      x: 80,
      y: 120,
      inputs: [],
      outputs: [{ id: "out_prompt", label: "Text Prompt" }],
      params: { text: "Cyberpunk synthwave skyline, ultra-detailed 3D render, neon lighting" },
      status: "ready", // ready, running, done
      color: "#e1496d",
    },
    {
      id: "node_2",
      title: "Neural Script Synthesizer",
      category: "ai",
      type: "LLM Agent",
      x: 420,
      y: 80,
      inputs: [{ id: "in_prompt", label: "Prompt" }],
      outputs: [{ id: "out_script", label: "Script Text" }, { id: "out_tags", label: "Keywords" }],
      params: { model: "Gemini Pro Vision", temp: 0.7 },
      status: "ready",
      color: "#38bdf8",
    },
    {
      id: "node_3",
      title: "AI Voiceover Engine",
      category: "audio",
      type: "ElevenLabs Voice",
      x: 780,
      y: 60,
      inputs: [{ id: "in_script", label: "Script" }],
      outputs: [{ id: "out_audio", label: "Audio WAV" }],
      params: { voice: "Rachel (Cinematic Narration)", speed: 1.05 },
      status: "ready",
      color: "#a855f7",
    },
    {
      id: "node_4",
      title: "Visual Asset Generator",
      category: "ai",
      type: "Image Diffusion",
      x: 420,
      y: 300,
      inputs: [{ id: "in_prompt", label: "Style Prompt" }],
      outputs: [{ id: "out_frames", label: "4K Render" }],
      params: { resolution: "3840x2160", steps: 35 },
      status: "ready",
      color: "#22d3a8",
    },
    {
      id: "node_5",
      title: "Timeline Video Stitcher",
      category: "composite",
      type: "Video Assembler",
      x: 1140,
      y: 180,
      inputs: [
        { id: "in_audio", label: "Audio Track" },
        { id: "in_visuals", label: "Visual Layers" }
      ],
      outputs: [{ id: "out_video", label: "Master MP4" }],
      params: { fps: 60, codec: "H.264 High Profile", bitrate: "24 Mbps" },
      status: "ready",
      color: "#ff8da7",
    },
  ];

  const initialWires = [
    { fromNode: "node_1", fromPort: "out_prompt", toNode: "node_2", toPort: "in_prompt" },
    { fromNode: "node_1", fromPort: "out_prompt", toNode: "node_4", toPort: "in_prompt" },
    { fromNode: "node_2", fromPort: "out_script", toNode: "node_3", toPort: "in_script" },
    { fromNode: "node_3", fromPort: "out_audio", toNode: "node_5", toPort: "in_audio" },
    { fromNode: "node_4", fromPort: "out_frames", toNode: "node_5", toPort: "in_visuals" },
  ];

  const [nodes, setNodes] = useState(initialNodes);
  const [wires, setWires] = useState(initialWires);

  // Available Node Templates for "+ Add Node"
  const nodeCatalog = [
    { title: "Background Remover", category: "ai", type: "rembg", color: "#f59e0b", inputs: [{ id: "in_img", label: "Image" }], outputs: [{ id: "out_clean", label: "Clean PNG" }] },
    { title: "Audio Soundscape Generator", category: "audio", type: "SFX Synth", color: "#8b5cf6", inputs: [{ id: "in_theme", label: "Theme" }], outputs: [{ id: "out_bgm", label: "BGM Track" }] },
    { title: "Color Grading LUT Applicator", category: "composite", type: "LUT Filter", color: "#ec4899", inputs: [{ id: "in_vid", label: "Video" }], outputs: [{ id: "out_lut", label: "Graded Video" }] },
    { title: "Multi-Platform Social Exporter", category: "output", type: "Cloud Publisher", color: "#10b981", inputs: [{ id: "in_final", label: "Export File" }], outputs: [] },
  ];

  // Pipeline Execution Runner
  const runPipeline = () => {
    if (isRunning) return;
    setIsRunning(true);
    setExecutionStep(1);
    setExecutionLogs(["[INIT] Pipeline graph topology validated..."]);
    setOutputDrawerOpen(true);

    const steps = [
      { step: 1, node: "node_1", msg: "[NODE 1] Prompt Tokenizer: Ingested 12 semantic tokens." },
      { step: 2, node: "node_2", msg: "[NODE 2] Neural LLM: Generated 3-scene narrative screenplay." },
      { step: 3, node: "node_4", msg: "[NODE 4] Diffusion Engine: Synthesizing 4K keyframes at 60fps." },
      { step: 4, node: "node_3", msg: "[NODE 3] Voiceover Engine: Neural audio waveform generated (48kHz)." },
      { step: 5, node: "node_5", msg: "[NODE 5] Compositor: Rendering final MP4 master container." },
      { step: 6, node: "done", msg: "[COMPLETE] Pipeline completed in 1.84s with 0 errors!" },
    ];

    steps.forEach((s, idx) => {
      setTimeout(() => {
        setExecutionStep(s.step);
        setExecutionLogs(prev => [...prev, s.msg]);
        if (s.node !== "done") {
          setNodes(prev => prev.map(n => n.id === s.node ? { ...n, status: "running" } : n));
        }
        if (idx === steps.length - 1) {
          setIsRunning(false);
          setNodes(prev => prev.map(n => ({ ...n, status: "done" })));
        }
      }, (idx + 1) * 700);
    });
  };

  // Canvas Mouse Dragging Handlers
  const handleMouseDownCanvas = (e) => {
    if (e.target.closest(".blueprint-node")) return;
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
    }
  };

  const handleMouseUpCanvas = () => {
    setIsDraggingCanvas(false);
    setDraggingNodeId(null);
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

  const handleAddNode = (template) => {
    const newNode = {
      id: `node_${Date.now()}`,
      title: template.title,
      category: template.category,
      type: template.type,
      x: (-pan.x + 300) / zoom,
      y: (-pan.y + 200) / zoom,
      inputs: template.inputs,
      outputs: template.outputs,
      params: {},
      status: "ready",
      color: template.color,
    };
    setNodes(prev => [...prev, newNode]);
    setShowAddNodeModal(false);
  };

  const handleDeleteNode = (nodeId, e) => {
    if (e) e.stopPropagation();
    setNodes(prev => prev.filter(n => n.id !== nodeId));
    setWires(prev => prev.filter(w => w.fromNode !== nodeId && w.toNode !== nodeId));
  };

  return (
    <div style={{
      height: "100vh", width: "100vw", overflow: "hidden",
      background: "#08040a", color: "#f3f4f6",
      fontFamily: "'Instrument Sans', sans-serif",
      display: "flex", flexDirection: "column",
      userSelect: "none",
    }}
    onMouseMove={handleMouseMoveCanvas}
    onMouseUp={handleMouseUpCanvas}
    >
      {/* Top Bar Header */}
      <header style={{
        height: 56, padding: "0 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        borderBottom: "1px solid rgba(225, 73, 109, 0.2)",
        background: "rgba(14, 6, 11, 0.9)", backdropFilter: "blur(12px)",
        zIndex: 50,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button
            onClick={onBack}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "rgba(225, 73, 109, 0.12)", border: "1px solid rgba(225, 73, 109, 0.3)",
              color: "#ff8da7", borderRadius: 8, padding: "6px 12px",
              cursor: "pointer", fontSize: 12.5, fontWeight: 600,
            }}
          >
            <ArrowLeft size={14} /> Back
          </button>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontFamily: "Syne, sans-serif", fontSize: 16, fontWeight: 800, color: "#fff" }}>
                Visual Automation Pipeline Studio
              </span>
              <span style={{
                fontSize: 9.5, padding: "2px 8px", borderRadius: 99,
                background: "rgba(34, 211, 168, 0.15)", color: "#22d3a8",
                border: "1px solid rgba(34, 211, 168, 0.4)", fontWeight: 700,
              }}>
                UNREAL BLUEPRINTS ENGINE
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Zoom controls */}
          <div style={{ display: "flex", alignItems: "center", background: "rgba(255,255,255,0.06)", borderRadius: 8, padding: 2 }}>
            <button
              onClick={() => setZoom(z => Math.max(0.4, z - 0.1))}
              style={{ background: "none", border: "none", color: "#fff", padding: "4px 8px", cursor: "pointer" }}
            >
              <ZoomOut size={14} />
            </button>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", minWidth: 36, textAlign: "center" }}>
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom(z => Math.min(1.8, z + 0.1))}
              style={{ background: "none", border: "none", color: "#fff", padding: "4px 8px", cursor: "pointer" }}
            >
              <ZoomIn size={14} />
            </button>
          </div>

          <button
            onClick={() => setShowAddNodeModal(true)}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)",
              color: "#e5e7eb", borderRadius: 8, padding: "6px 14px",
              fontSize: 12, fontWeight: 600, cursor: "pointer",
            }}
          >
            <Plus size={14} /> Add Blueprint Node
          </button>

          <button
            onClick={runPipeline}
            disabled={isRunning}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: isRunning ? "rgba(225,73,109,0.3)" : "linear-gradient(135deg, #e1496d, #942945)",
              border: "none", color: "#fff", borderRadius: 8, padding: "6px 18px",
              fontSize: 12.5, fontWeight: 700, fontFamily: "Syne, sans-serif",
              cursor: isRunning ? "wait" : "pointer",
              boxShadow: isRunning ? "none" : "0 4px 16px rgba(225,73,109,0.4)",
            }}
          >
            <Play size={13} fill="#fff" />
            {isRunning ? "Running Pipeline..." : "Execute Pipeline"}
          </button>
        </div>
      </header>

      {/* Blueprint Node Canvas */}
      <div
        style={{
          flex: 1, position: "relative", overflow: "hidden",
          cursor: isDraggingCanvas ? "grabbing" : "grab",
          background: `
            radial-gradient(circle at 50% 50%, rgba(225, 73, 109, 0.05) 0%, transparent 80%),
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
          
          {/* SVG Wires Connecting Ports */}
          <svg style={{ position: "absolute", top: 0, left: 0, width: 4000, height: 4000, pointerEvents: "none", overflow: "visible" }}>
            <defs>
              <linearGradient id="wireGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#e1496d" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>
            </defs>

            {wires.map((wire, idx) => {
              const srcNode = nodes.find(n => n.id === wire.fromNode);
              const tgtNode = nodes.find(n => n.id === wire.toNode);
              if (!srcNode || !tgtNode) return null;

              const x1 = srcNode.x + 240; // width of node
              const y1 = srcNode.y + 64;
              const x2 = tgtNode.x;
              const y2 = tgtNode.y + 64;

              const dx = Math.max(80, Math.abs(x2 - x1) * 0.5);
              const path = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;

              return (
                <g key={idx}>
                  <path
                    d={path}
                    fill="none"
                    stroke="rgba(225, 73, 109, 0.3)"
                    strokeWidth="6"
                  />
                  <path
                    d={path}
                    fill="none"
                    stroke={isRunning ? "url(#wireGrad)" : "#e1496d"}
                    strokeWidth="2.5"
                    strokeDasharray={isRunning ? "6 6" : "none"}
                    style={{ animation: isRunning ? "dash 1s linear infinite" : "none" }}
                  />
                  {isRunning && (
                    <circle r="4" fill="#38bdf8">
                      <animateMotion path={path} dur="1.2s" repeatCount="indefinite" />
                    </circle>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Render Blueprint Nodes */}
          {nodes.map((node) => {
            const isSelected = selectedNodeId === node.id;
            return (
              <div
                key={node.id}
                className="blueprint-node"
                style={{
                  position: "absolute",
                  left: node.x,
                  top: node.y,
                  width: 240,
                  borderRadius: 14,
                  background: "rgba(18, 8, 16, 0.9)",
                  backdropFilter: "blur(10px)",
                  border: `1.5px solid ${node.status === "running" ? "#38bdf8" : isSelected ? "#e1496d" : "rgba(225, 73, 109, 0.3)"}`,
                  boxShadow: node.status === "running"
                    ? "0 0 20px rgba(56, 189, 248, 0.4)"
                    : isSelected
                      ? "0 8px 30px rgba(225, 73, 109, 0.3)"
                      : "0 6px 20px rgba(0,0,0,0.5)",
                  cursor: "move",
                  zIndex: isSelected ? 20 : 10,
                  transition: "border 0.2s, box-shadow 0.2s",
                }}
                onMouseDown={(e) => handleNodeMouseDown(e, node.id, node.x, node.y)}
              >
                {/* Node Header */}
                <div style={{
                  padding: "10px 14px",
                  background: `linear-gradient(90deg, ${node.color}35 0%, rgba(0,0,0,0.4) 100%)`,
                  borderTopLeftRadius: 12, borderTopRightRadius: 12,
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: node.color }} />
                    <span style={{ fontSize: 12, fontWeight: 700, fontFamily: "Syne, sans-serif", color: "#fff" }}>
                      {node.title}
                    </span>
                  </div>
                  <button
                    onClick={(e) => handleDeleteNode(node.id, e)}
                    style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 11 }}
                  >
                    ✕
                  </button>
                </div>

                {/* Node Body / Ports */}
                <div style={{ padding: "12px 14px" }}>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 700, marginBottom: 8 }}>
                    {node.type}
                  </div>

                  {/* Ports Container */}
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                    {/* Inputs */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {node.inputs.map(inp => (
                        <div key={inp.id} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "rgba(255,255,255,0.7)" }}>
                          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#38bdf8", border: "1px solid #fff" }} />
                          {inp.label}
                        </div>
                      ))}
                    </div>

                    {/* Outputs */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
                      {node.outputs.map(out => (
                        <div key={out.id} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "rgba(255,255,255,0.7)" }}>
                          {out.label}
                          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#e1496d", border: "1px solid #fff" }} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Status Footer */}
                <div style={{
                  padding: "6px 14px", background: "rgba(0,0,0,0.3)",
                  borderBottomLeftRadius: 12, borderBottomRightRadius: 12,
                  display: "flex", justifyContent: "space-between", fontSize: 10, color: "rgba(255,255,255,0.4)",
                }}>
                  <span>STATE:</span>
                  <span style={{ color: node.status === "done" ? "#22d3a8" : node.status === "running" ? "#38bdf8" : "rgba(255,255,255,0.5)", fontWeight: 700 }}>
                    {node.status.toUpperCase()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Execution Telemetry Terminal Drawer */}
      {outputDrawerOpen && (
        <div style={{
          height: 180, background: "rgba(10, 4, 8, 0.95)",
          borderTop: "1px solid rgba(225, 73, 109, 0.3)",
          backdropFilter: "blur(16px)", padding: "12px 24px",
          display: "flex", flexDirection: "column",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 700, color: "#e1496d" }}>
              <Terminal size={14} />
              PIPELINE EXECUTION LOGS
            </div>
            <button
              onClick={() => setOutputDrawerOpen(false)}
              style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 11 }}
            >
              ✕ Minimize
            </button>
          </div>

          <div style={{
            flex: 1, overflowY: "auto", fontFamily: "monospace", fontSize: 11.5,
            color: "rgba(255,255,255,0.8)", display: "flex", flexDirection: "column", gap: 4,
          }}>
            {executionLogs.map((log, i) => (
              <div key={i} style={{ color: log.includes("COMPLETE") ? "#22d3a8" : log.includes("INIT") ? "#ff8da7" : "#e5e7eb" }}>
                {log}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Blueprint Node Modal */}
      {showAddNodeModal && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 1000,
          background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
        onClick={() => setShowAddNodeModal(false)}
        >
          <div style={{
            width: 480, borderRadius: 20, background: "#160a12",
            border: "1px solid rgba(225, 73, 109, 0.3)", padding: 24,
          }}
          onClick={e => e.stopPropagation()}
          >
            <h3 style={{ margin: "0 0 16px", fontSize: 18, fontWeight: 800, fontFamily: "Syne, sans-serif", color: "#fff" }}>
              Add Blueprint Processing Node
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {nodeCatalog.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => handleAddNode(item)}
                  style={{
                    padding: "12px 16px", borderRadius: 12,
                    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "#e1496d"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: item.color }} />
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 700, color: "#fff" }}>{item.title}</div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{item.type}</div>
                    </div>
                  </div>
                  <Plus size={16} color="#ff8da7" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
