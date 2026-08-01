import { useState, useRef, useEffect, useCallback, useMemo } from "react";

/* ────────────────────────────────────────────────────────────────────────────
   INFINITE STUDIO — 6 Killer Features
   1. Code-to-Canvas  (React/JSX component nodes + export)
   2. Spatial Infinite Node Graph  (pan/zoom + connection arrows)
   3. Live API Data-Driven Nodes  (REST polling + live updates)
   4. Dev Mode Spatial Annotations  (spacing rulers + Tailwind copy)
   5. Multiplayer Ghost Cursors  (BroadcastChannel + Ghost Replay)
   6. AI Prompt-to-DOM Layout Engine  (keyword → structured nodes)
   ──────────────────────────────────────────────────────────────────────────── */

// ── Helpers ────────────────────────────────────────────────────────────────
let _nid = 1;
const uid = () => `n${_nid++}_${Date.now().toString(36)}`;
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const SESSION_ID = Math.random().toString(36).slice(2, 8);

// ── AI Template Library ────────────────────────────────────────────────────
const AI_TEMPLATES = {
  "pricing": (x, y) => ({
    title: "Pricing Table",
    nodes: [
      { id: uid(), type:"frame", x:x, y:y, w:240, h:340, label:"Starter", bg:"#1a1a2e", accent:"#6c63ff",
        code:`<div className="pricing-card">
  <h2>Starter</h2>
  <div className="price">$9<span>/mo</span></div>
  <ul>
    <li>✓ 5 Projects</li>
    <li>✓ 10GB Storage</li>
    <li>✓ Basic Support</li>
  </ul>
  <button className="btn-outline">Get Started</button>
</div>` },
      { id: uid(), type:"frame", x:x+260, y:y-30, w:260, h:400, label:"Pro", bg:"#6c63ff", accent:"#fff",
        code:`<div className="pricing-card featured">
  <div className="badge">Most Popular</div>
  <h2>Pro</h2>
  <div className="price">$29<span>/mo</span></div>
  <ul>
    <li>✓ Unlimited Projects</li>
    <li>✓ 100GB Storage</li>
    <li>✓ Priority Support</li>
    <li>✓ Team Collaboration</li>
  </ul>
  <button className="btn-primary">Get Started</button>
</div>` },
      { id: uid(), type:"frame", x:x+540, y:y, w:240, h:340, label:"Enterprise", bg:"#1a1a2e", accent:"#22d3a8",
        code:`<div className="pricing-card">
  <h2>Enterprise</h2>
  <div className="price">Custom</div>
  <ul>
    <li>✓ Unlimited Everything</li>
    <li>✓ 1TB Storage</li>
    <li>✓ 24/7 Dedicated Support</li>
    <li>✓ SLA Guarantee</li>
  </ul>
  <button className="btn-outline">Contact Sales</button>
</div>` },
    ],
    connections: []
  }),
  "dashboard": (x, y) => ({
    title: "Dashboard",
    nodes: [
      { id: uid(), type:"api", x:x, y:y, w:200, h:110, label:"Total Users", bg:"#161229", accent:"#6c63ff", apiEndpoint:"https://jsonplaceholder.typicode.com/users", apiField:"length", code:`<div class="metric-card"><span class="label">Total Users</span><span class="value">{{data}}</span></div>` },
      { id: uid(), type:"api", x:x+220, y:y, w:200, h:110, label:"Posts Today", bg:"#16291c", accent:"#22d3a8", apiEndpoint:"https://jsonplaceholder.typicode.com/posts", apiField:"length", code:`<div class="metric-card"><span class="label">Posts Today</span><span class="value">{{data}}</span></div>` },
      { id: uid(), type:"api", x:x+440, y:y, w:200, h:110, label:"Open Todos", bg:"#291616", accent:"#e1496d", apiEndpoint:"https://jsonplaceholder.typicode.com/todos?completed=false", apiField:"length", code:`<div class="metric-card"><span class="label">Open Todos</span><span class="value">{{data}}</span></div>` },
      { id: uid(), type:"frame", x:x, y:y+130, w:440, h:260, label:"Chart Area", bg:"#0e0d1a", accent:"#6c63ff", code:`<div class="chart-container"><canvas id="mainChart"></canvas></div>` },
      { id: uid(), type:"frame", x:x+460, y:y+130, w:180, h:260, label:"Recent Activity", bg:"#0e0d1a", accent:"#8c8780", code:`<div class="activity-feed"><h3>Recent Activity</h3><ul>{{items}}</ul></div>` },
    ],
    connections: []
  }),
  "navbar": (x, y) => ({
    title: "Navigation Bar",
    nodes: [
      { id: uid(), type:"component", x:x, y:y, w:800, h:64, label:"NavBar", bg:"#0f0f23", accent:"#6c63ff",
        code:`<nav className="flex items-center justify-between px-8 py-4 bg-gray-900 border-b border-purple-900">
  <div className="flex items-center gap-2">
    <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center font-bold text-white">S</div>
    <span className="font-bold text-white text-lg">Studio</span>
  </div>
  <div className="flex items-center gap-6 text-sm text-gray-400">
    <a href="#" className="hover:text-white transition">Features</a>
    <a href="#" className="hover:text-white transition">Pricing</a>
    <a href="#" className="hover:text-white transition">Docs</a>
  </div>
  <button className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-medium transition">
    Get Started
  </button>
</nav>` },
    ],
    connections: []
  }),
  "hero": (x, y) => ({
    title: "Hero Section",
    nodes: [
      { id: uid(), type:"component", x:x, y:y, w:680, h:380, label:"Hero", bg:"#050511", accent:"#6c63ff",
        code:`<section className="min-h-screen flex items-center justify-center bg-gray-950 text-center px-8">
  <div className="max-w-3xl">
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/40 border border-purple-700 text-purple-300 text-sm mb-6">
      ✦ Now in Public Beta
    </div>
    <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
      Design at the<br/>
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
        Speed of Thought
      </span>
    </h1>
    <p className="text-xl text-gray-400 mb-8">
      The next-generation canvas where design meets code.
    </p>
    <div className="flex items-center justify-center gap-4">
      <button className="px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-medium text-lg transition">
        Start for Free
      </button>
      <button className="px-8 py-4 border border-gray-700 hover:border-gray-500 text-gray-300 rounded-xl font-medium text-lg transition">
        Watch Demo →
      </button>
    </div>
  </div>
</section>` },
    ],
    connections: []
  }),
  "kanban": (x, y) => ({
    title: "Kanban Board",
    nodes: [
      { id: uid(), type:"frame", x:x, y:y, w:220, h:300, label:"To Do", bg:"#161229", accent:"#6c63ff", code:`<div class="kanban-col"><h3>To Do</h3><div class="card">Design mockups</div><div class="card">Write tests</div><div class="card">Update docs</div></div>` },
      { id: uid(), type:"frame", x:x+240, y:y, w:220, h:300, label:"In Progress", bg:"#162924", accent:"#22d3a8", code:`<div class="kanban-col"><h3>In Progress</h3><div class="card active">Build API</div><div class="card active">UI polish</div></div>` },
      { id: uid(), type:"frame", x:x+480, y:y, w:220, h:300, label:"Done", bg:"#162416", accent:"#4ade80", code:`<div class="kanban-col"><h3>Done</h3><div class="card done">Auth system</div><div class="card done">DB schema</div></div>` },
    ],
    connections: [
      { id: uid(), type:"flow", label:"→" },
      { id: uid(), type:"flow", label:"→" },
    ]
  }),
  "form": (x, y) => ({
    title: "Contact Form",
    nodes: [
      { id: uid(), type:"component", x:x, y:y, w:420, h:480, label:"Contact Form", bg:"#0f0f1a", accent:"#6c63ff",
        code:`<div className="max-w-md mx-auto p-8 bg-gray-900 rounded-2xl border border-gray-800">
  <h2 className="text-2xl font-bold text-white mb-2">Get in Touch</h2>
  <p className="text-gray-400 mb-6">We'll respond within 24 hours.</p>
  <div className="space-y-4">
    <div>
      <label className="block text-sm text-gray-400 mb-1">Name</label>
      <input className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 outline-none" placeholder="Your name" />
    </div>
    <div>
      <label className="block text-sm text-gray-400 mb-1">Email</label>
      <input className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 outline-none" placeholder="you@email.com" />
    </div>
    <div>
      <label className="block text-sm text-gray-400 mb-1">Message</label>
      <textarea className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 outline-none" rows="4" placeholder="How can we help?" />
    </div>
    <button className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium transition">
      Send Message →
    </button>
  </div>
</div>` },
    ],
    connections: []
  }),
};

// ── Code Export Generator ──────────────────────────────────────────────────
function generateExportCode(nodes, connections, format) {
  if (format === "react") {
    const imports = `import React from 'react';\n\n`;
    const components = nodes.map(n => {
      const compName = (n.label || "Component").replace(/\s+/g, "");
      return `// Node: ${n.label || n.type}\nconst ${compName} = () => (\n${(n.code || `<div>${n.label}</div>`).split("\n").map(l => "  " + l).join("\n")}\n);\n`;
    }).join("\n");
    const app = `\nexport default function App() {\n  return (\n    <div className="canvas">\n${nodes.map(n => `      <${(n.label||"Component").replace(/\s+/g,"")} />`).join("\n")}\n    </div>\n  );\n}\n`;
    return imports + components + app;
  }
  if (format === "html") {
    const styles = `<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: system-ui, sans-serif; background: #050511; color: #e5e5e5; }
.canvas { position: relative; }
</style>\n`;
    const body = nodes.map(n => {
      const code = n.code || `<div>${n.label}</div>`;
      const isJSX = code.includes("className=");
      const htmlCode = isJSX ? code.replace(/className=/g, "class=").replace(/\{`([^`]*)`\}/g, '"$1"') : code;
      return `<!-- ${n.label || n.type} -->\n<div style="position:absolute;left:${n.x}px;top:${n.y}px;width:${n.w}px;height:${n.h}px">\n${htmlCode}\n</div>\n`;
    }).join("\n");
    return `<!DOCTYPE html>\n<html>\n<head><meta charset="UTF-8">\n${styles}</head>\n<body>\n<div class="canvas">\n${body}</div>\n</body>\n</html>`;
  }
  if (format === "tailwind") {
    return nodes.map(n => {
      const code = n.code || `<div>${n.label}</div>`;
      return `<!-- ${n.label} -->\n${code}\n`;
    }).join("\n");
  }
  return "";
}

// ── Tailwind Estimator ─────────────────────────────────────────────────────
function cssToTailwind(node) {
  const classes = [];
  if (node.bg) classes.push("bg-gray-900");
  if (node.w) classes.push(`w-[${node.w}px]`);
  if (node.h) classes.push(`h-[${node.h}px]`);
  classes.push("rounded-xl", "border", "border-gray-800", "p-4");
  if (node.type === "component") classes.push("flex", "flex-col", "gap-2");
  return classes.join(" ");
}

export default function InfiniteStudio({ onBack, user }) {
  // ── Viewport (pan + zoom) ────────────────────────────────────────────────
  const [vp, setVp] = useState({ x: 0, y: 0, scale: 1 });
  const isPanningRef = useRef(false);
  const panStartRef = useRef({ mx: 0, my: 0, vx: 0, vy: 0 });

  // ── Nodes + Connections ──────────────────────────────────────────────────
  const [nodes, setNodes] = useState(() => [
    { id:"intro1", type:"frame", x:100, y:100, w:320, h:160, label:"Welcome Frame", bg:"#161229", accent:"#6c63ff",
      code:`<div className="p-6 rounded-2xl bg-gray-900 border border-purple-900">
  <h2 className="text-2xl font-bold text-white mb-2">Infinite Studio</h2>
  <p className="text-gray-400">Pan (Space+Drag), Zoom (Scroll), Connect (port dots)</p>
</div>` },
    { id:"intro2", type:"api", x:460, y:100, w:260, h:100, label:"Live GitHub Stars", bg:"#162924", accent:"#22d3a8",
      apiEndpoint:"https://api.github.com/repos/facebook/react", apiField:"stargazers_count",
      apiData:null, apiLoading:false, apiError:null,
      code:`<div class="metric"><span>GitHub Stars</span><strong>{{data}}</strong></div>` },
    { id:"intro3", type:"component", x:100, y:300, w:320, h:200, label:"Button Component", bg:"#0f0f23", accent:"#e1496d",
      code:`<button className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-semibold text-lg transition-all hover:shadow-lg hover:shadow-purple-500/30">
  🚀 Launch Studio
</button>` },
  ]);
  const [connections, setConnections] = useState([
    { id:"c1", fromId:"intro1", toId:"intro2" },
    { id:"c2", fromId:"intro1", toId:"intro3" },
  ]);

  // ── Interaction State ────────────────────────────────────────────────────
  const [selectedId, setSelectedId] = useState(null);
  const [draggingId, setDraggingId] = useState(null);
  const dragNodeOffRef = useRef({ x:0, y:0 });
  const [connectingFrom, setConnectingFrom] = useState(null); // { nodeId, portX, portY }
  const [connectingMouse, setConnectingMouse] = useState({ x:0, y:0 });

  // ── Panels ───────────────────────────────────────────────────────────────
  const [rightPanel, setRightPanel] = useState("properties"); // properties | code | api | dev | export
  const [devMode, setDevMode] = useState(false);

  // ── AI Panel ─────────────────────────────────────────────────────────────
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [showAiPanel, setShowAiPanel] = useState(false);

  // ── Ghost Replay ─────────────────────────────────────────────────────────
  const [isRecording, setIsRecording] = useState(false);
  const [replayPlaying, setReplayPlaying] = useState(false);
  const recordedEventsRef = useRef([]);
  const replayStartRef = useRef(0);
  const [ghostPos, setGhostPos] = useState(null);
  const [ghostName, setGhostName] = useState("Teammate");

  // ── Multiplayer (BroadcastChannel) ───────────────────────────────────────
  const [peerCursors, setPeerCursors] = useState({});
  const channelRef = useRef(null);

  // ── Export Panel ─────────────────────────────────────────────────────────
  const [exportFormat, setExportFormat] = useState("react");
  const [exportCode, setExportCode] = useState("");
  const [copied, setCopied] = useState(false);

  // ── Refs ─────────────────────────────────────────────────────────────────
  const studioRef = useRef(null);
  const canvasRef = useRef(null);

  // ── COORD helpers ─────────────────────────────────────────────────────────
  const toCanvas = useCallback((sx, sy) => ({
    x: (sx - vp.x) / vp.scale,
    y: (sy - vp.y) / vp.scale,
  }), [vp]);

  const toScreen = useCallback((cx, cy) => ({
    x: cx * vp.scale + vp.x,
    y: cy * vp.scale + vp.y,
  }), [vp]);

  // ── Live API polling ─────────────────────────────────────────────────────
  useEffect(() => {
    const poll = async () => {
      const apiNodes = nodes.filter(n => n.type === "api" && n.apiEndpoint);
      for (const n of apiNodes) {
        try {
          const res = await fetch(n.apiEndpoint, { signal: AbortSignal.timeout(4000) });
          const data = await res.json();
          let val = data;
          if (n.apiField) {
            if (n.apiField === "length" && Array.isArray(data)) val = data.length;
            else val = data[n.apiField] ?? JSON.stringify(data).slice(0, 80);
          } else { val = typeof data === "object" ? JSON.stringify(data).slice(0,120) : data; }
          setNodes(prev => prev.map(nd => nd.id === n.id ? { ...nd, apiData: val, apiError: null } : nd));
        } catch (e) {
          setNodes(prev => prev.map(nd => nd.id === n.id ? { ...nd, apiError: e.message } : nd));
        }
      }
    };
    poll();
    const id = setInterval(poll, 8000);
    return () => clearInterval(id);
  }, [nodes.map(n=>n.id+n.apiEndpoint).join(",")]);

  // ── BroadcastChannel Multiplayer ─────────────────────────────────────────
  useEffect(() => {
    try {
      const ch = new BroadcastChannel("creatify_infinite_studio");
      channelRef.current = ch;
      ch.onmessage = (e) => {
        const { type, id, pos, name } = e.data;
        if (type === "CURSOR" && id !== SESSION_ID) {
          setPeerCursors(prev => ({ ...prev, [id]: { pos, name: name || "Peer", ts: Date.now() } }));
        }
        if (type === "NODE_UPDATE" && id !== SESSION_ID) {
          setNodes(prev => prev.map(n => n.id === e.data.nodeId ? { ...n, ...e.data.patch } : n));
        }
      };
      return () => ch.close();
    } catch {}
  }, []);

  // Clean stale peer cursors
  useEffect(() => {
    const id = setInterval(() => {
      const now = Date.now();
      setPeerCursors(prev => {
        const cleaned = {};
        Object.entries(prev).forEach(([k,v]) => { if (now - v.ts < 5000) cleaned[k] = v; });
        return cleaned;
      });
    }, 2000);
    return () => clearInterval(id);
  }, []);

  // ── Canvas Mouse Handlers ─────────────────────────────────────────────────
  const handleCanvasMouseDown = (e) => {
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      e.preventDefault();
      isPanningRef.current = true;
      panStartRef.current = { mx: e.clientX, my: e.clientY, vx: vp.x, vy: vp.y };
      return;
    }
    if (e.target === canvasRef.current) {
      setSelectedId(null);
      setConnectingFrom(null);
      // Add blank node on double-click
    }
  };

  const handleCanvasMouseMove = (e) => {
    const rect = studioRef.current?.getBoundingClientRect();
    const sx = e.clientX - (rect?.left || 0);
    const sy = e.clientY - (rect?.top || 0);

    // Broadcast cursor to peers
    try {
      channelRef.current?.postMessage({ type:"CURSOR", id:SESSION_ID, pos:{x:sx,y:sy}, name: user?.name || "You" });
    } catch {}

    // Ghost recording
    if (isRecording) {
      recordedEventsRef.current.push({ t: Date.now() - replayStartRef.current, x: sx, y: sy });
    }

    if (isPanningRef.current) {
      const dx = e.clientX - panStartRef.current.mx;
      const dy = e.clientY - panStartRef.current.my;
      setVp(v => ({ ...v, x: panStartRef.current.vx + dx, y: panStartRef.current.vy + dy }));
    }
    if (draggingId) {
      const cp = toCanvas(e.clientX, e.clientY);
      const nx = cp.x - dragNodeOffRef.current.x;
      const ny = cp.y - dragNodeOffRef.current.y;
      setNodes(prev => prev.map(n => n.id === draggingId ? { ...n, x: nx, y: ny } : n));
    }
    if (connectingFrom) {
      setConnectingMouse({ x: e.clientX, y: e.clientY });
    }
  };

  const handleCanvasMouseUp = (e) => {
    isPanningRef.current = false;
    setDraggingId(null);
  };

  const handleCanvasWheel = (e) => {
    e.preventDefault();
    const rect = studioRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setVp(v => {
      const ns = clamp(v.scale * delta, 0.1, 8);
      const ratio = ns / v.scale;
      return { scale: ns, x: mx - (mx - v.x) * ratio, y: my - (my - v.y) * ratio };
    });
  };

  // ── Node Drag ────────────────────────────────────────────────────────────
  const handleNodeMouseDown = (e, nodeId) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    setSelectedId(nodeId);
    const cp = toCanvas(e.clientX, e.clientY);
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;
    dragNodeOffRef.current = { x: cp.x - node.x, y: cp.y - node.y };
    setDraggingId(nodeId);
  };

  // ── Port Connection ──────────────────────────────────────────────────────
  const handlePortMouseDown = (e, nodeId) => {
    e.stopPropagation();
    e.preventDefault();
    setConnectingFrom({ nodeId });
    setConnectingMouse({ x: e.clientX, y: e.clientY });
  };

  const handlePortMouseUp = (e, toNodeId) => {
    e.stopPropagation();
    if (connectingFrom && connectingFrom.nodeId !== toNodeId) {
      const id = uid();
      setConnections(prev => [...prev, { id, fromId: connectingFrom.nodeId, toId: toNodeId }]);
    }
    setConnectingFrom(null);
  };

  // ── Add Node ──────────────────────────────────────────────────────────────
  const addNode = (type) => {
    const cx = (-vp.x / vp.scale) + 200 + Math.random()*100;
    const cy = (-vp.y / vp.scale) + 200 + Math.random()*100;
    const defaults = {
      frame:     { w:320, h:200, label:"Frame",     bg:"#161229", accent:"#6c63ff", code:`<div class="frame">Frame Content</div>` },
      text:      { w:280, h:80,  label:"Text Node",  bg:"#0f0f23", accent:"#8c8780", code:`<p class="text-lg text-white">Double-click to edit</p>` },
      component: { w:320, h:180, label:"Component",  bg:"#0f0f23", accent:"#e1496d", code:`<button className="px-4 py-2 bg-purple-600 text-white rounded-lg">Click Me</button>` },
      api:       { w:240, h:100, label:"API Node",   bg:"#162924", accent:"#22d3a8", apiEndpoint:"https://jsonplaceholder.typicode.com/todos/1", apiField:"title" },
      image:     { w:300, h:220, label:"Image",      bg:"#1a1a1a", accent:"#6c63ff" },
    };
    const d = defaults[type] || defaults.frame;
    const id = uid();
    setNodes(prev => [...prev, { id, type, x:cx, y:cy, ...d }]);
    setSelectedId(id);
  };

  const deleteNode = (id) => {
    setNodes(prev => prev.filter(n => n.id !== id));
    setConnections(prev => prev.filter(c => c.fromId !== id && c.toId !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const updateNode = (id, patch) => setNodes(prev => prev.map(n => n.id === id ? { ...n, ...patch } : n));

  // ── AI Generation ────────────────────────────────────────────────────────
  const handleAiGenerate = () => {
    setAiGenerating(true);
    const prompt = aiPrompt.toLowerCase();
    const keywords = Object.keys(AI_TEMPLATES);
    const matched = keywords.filter(k => prompt.includes(k));
    const key = matched[0] || (prompt.includes("dash") ? "dashboard" : prompt.includes("nav") ? "navbar" : prompt.includes("hero") ? "hero" : "pricing");

    setTimeout(() => {
      const centerX = (-vp.x / vp.scale) + 50;
      const centerY = (-vp.y / vp.scale) + 50;
      const template = AI_TEMPLATES[key] ? AI_TEMPLATES[key](centerX, centerY) : AI_TEMPLATES.pricing(centerX, centerY);
      setNodes(prev => [...prev, ...template.nodes]);
      setConnections(prev => [...prev, ...template.nodes.slice(0,-1).map((n,i)=>({ id:uid(), fromId:n.id, toId:template.nodes[i+1].id }))]);
      setAiGenerating(false);
      setAiPrompt("");
      setShowAiPanel(false);
    }, 1200);
  };

  // ── Ghost Replay ─────────────────────────────────────────────────────────
  const startRecording = () => {
    recordedEventsRef.current = [];
    replayStartRef.current = Date.now();
    setIsRecording(true);
  };

  const stopRecording = () => setIsRecording(false);

  const playReplay = () => {
    const events = [...recordedEventsRef.current];
    if (!events.length) return;
    setReplayPlaying(true);
    setGhostPos(events[0]);
    events.forEach((ev, i) => {
      setTimeout(() => {
        setGhostPos({ x: ev.x, y: ev.y });
        if (i === events.length - 1) { setReplayPlaying(false); setGhostPos(null); }
      }, ev.t);
    });
  };

  // ── Dev Mode Distance ────────────────────────────────────────────────────
  const devDistances = useMemo(() => {
    if (!devMode || !selectedId) return [];
    const sel = nodes.find(n => n.id === selectedId);
    if (!sel) return [];
    return nodes.filter(n => n.id !== selectedId).map(n => {
      const dx = Math.abs((sel.x + sel.w/2) - (n.x + n.w/2));
      const dy = Math.abs((sel.y + sel.h/2) - (n.y + n.h/2));
      return { id:n.id, label:n.label, dx:Math.round(dx), dy:Math.round(dy) };
    }).slice(0,3);
  }, [devMode, selectedId, nodes]);

  // ── Export ────────────────────────────────────────────────────────────────
  const handleExport = () => {
    const code = generateExportCode(nodes, connections, exportFormat);
    setExportCode(code);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(exportCode).then(() => { setCopied(true); setTimeout(()=>setCopied(false),2000); });
  };

  const downloadCode = () => {
    const ext = exportFormat === "html" ? "html" : exportFormat === "react" ? "tsx" : "html";
    const blob = new Blob([exportCode], { type:"text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href=url; a.download=`studio-export.${ext}`; a.click();
    URL.revokeObjectURL(url);
  };

  // ── Connection SVG Paths ─────────────────────────────────────────────────
  const getNodeCenter = (nodeId) => {
    const n = nodes.find(nd => nd.id === nodeId);
    if (!n) return { x:0,y:0 };
    const sc = toScreen(n.x + n.w, n.y + n.h/2);
    return sc;
  };

  const selectedNode = nodes.find(n => n.id === selectedId);

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div ref={studioRef} style={{ width:"100vw", height:"100vh", background:"#050511", color:"#e5e5e5", fontFamily:"'Instrument Sans','Poppins',sans-serif", display:"flex", flexDirection:"column", overflow:"hidden", userSelect:"none", position:"relative" }}>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&family=Instrument+Sans:wght@400;500;600&family=Syne:wght@700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet"/>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0a0a1a; }
        ::-webkit-scrollbar-thumb { background: rgba(108,99,255,0.4); border-radius: 3px; }
        .s-btn { background: rgba(108,99,255,0.1); border: 1px solid rgba(108,99,255,0.25); color: #e5e5e5; padding: 5px 12px; border-radius: 7px; cursor: pointer; font-size: 11.5px; font-family: 'Poppins',sans-serif; font-weight: 500; display: inline-flex; align-items: center; gap: 6px; transition: all 0.15s; white-space: nowrap; }
        .s-btn:hover { background: rgba(108,99,255,0.25); color: #c4bfff; border-color: rgba(108,99,255,0.5); }
        .s-btn.active { background: rgba(108,99,255,0.3); color: #c4bfff; border-color: #6c63ff; }
        .s-btn.primary { background: linear-gradient(135deg,#4f46e5,#6c63ff); border: none; color: #fff; font-weight: 600; box-shadow: 0 3px 12px rgba(108,99,255,0.4); }
        .s-btn.primary:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(108,99,255,0.55); }
        .s-btn.danger { color: #ef4444; border-color: rgba(239,68,68,0.25); background: rgba(239,68,68,0.07); }
        .s-btn.danger:hover { background: rgba(239,68,68,0.18); border-color: #ef4444; }
        .s-btn.green { background: rgba(34,211,168,0.1); border-color: rgba(34,211,168,0.3); color: #22d3a8; }
        .s-btn.green:hover { background: rgba(34,211,168,0.2); }
        .s-inp { background: rgba(255,255,255,0.05); border: 1px solid rgba(108,99,255,0.22); border-radius: 7px; color: #e5e5e5; padding: 7px 10px; font-size: 12px; outline: none; width: 100%; font-family: inherit; transition: border-color 0.15s; }
        .s-inp:focus { border-color: rgba(108,99,255,0.55); background: rgba(108,99,255,0.07); }
        .code-area { background: #0d0d1f; border: 1px solid rgba(108,99,255,0.2); border-radius: 8px; color: #a5b4fc; padding: 12px; font-family: 'JetBrains Mono',monospace; font-size: 11px; line-height: 1.7; resize: none; outline: none; width: 100%; }
        .node-card { position: absolute; border-radius: 12px; border: 2px solid transparent; cursor: grab; transition: box-shadow 0.15s; }
        .node-card:hover { box-shadow: 0 0 0 1px rgba(108,99,255,0.4); }
        .node-card.selected { border-color: #6c63ff !important; box-shadow: 0 0 0 3px rgba(108,99,255,0.2), 0 8px 32px rgba(108,99,255,0.3) !important; }
        .node-card.dev-mode { filter: brightness(0.7); }
        .node-card.dev-mode.selected { filter: brightness(1); border-color: #22d3a8 !important; box-shadow: 0 0 0 3px rgba(34,211,168,0.25) !important; }
        .port { width: 12px; height: 12px; border-radius: 50%; background: #6c63ff; border: 2px solid #1a1a3e; position: absolute; cursor: crosshair; transition: transform 0.12s, background 0.12s; z-index: 5; }
        .port:hover { transform: scale(1.5); background: #a5b4fc; }
        .port.right { right: -6px; top: 50%; transform: translateY(-50%); }
        .port.left { left: -6px; top: 50%; transform: translateY(-50%); }
        .port.right:hover { transform: translateY(-50%) scale(1.5); }
        .port.left:hover { transform: translateY(-50%) scale(1.5); }
        @keyframes pulse-ring { 0%{transform:scale(1);opacity:1} 100%{transform:scale(2.5);opacity:0} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        .panel-slide { animation: fadeIn 0.18s ease; }
        .grid-bg {
          background-image: radial-gradient(circle, rgba(108,99,255,0.15) 1px, transparent 1px);
          background-size: 32px 32px;
        }
      `}</style>

      {/* ── Top Header ─────────────────────────────────────────────────── */}
      <div style={{ height:"48px", background:"rgba(5,5,17,0.95)", borderBottom:"1px solid rgba(108,99,255,0.2)", display:"flex", alignItems:"center", padding:"0 14px", gap:"10px", flexShrink:0, zIndex:100, backdropFilter:"blur(10px)" }}>
        {/* Left */}
        <button className="s-btn danger" onClick={onBack} style={{ padding:"4px 10px",fontSize:"11px",gap:"5px" }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M5 12l7 7M5 12l7-7"/></svg>Back
        </button>
        <div style={{ width:"1px",height:"16px",background:"rgba(108,99,255,0.2)" }}/>
        <div style={{ display:"flex",alignItems:"center",gap:"8px" }}>
          <div style={{ width:"28px",height:"28px",borderRadius:"8px",background:"linear-gradient(135deg,#4f46e5,#6c63ff)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:"13px",color:"#fff" }}>∞</div>
          <span style={{ fontFamily:"Syne,sans-serif",fontWeight:800,fontSize:"15px",color:"#fff" }}>Infinite Studio</span>
          <span style={{ fontSize:"10px",background:"rgba(108,99,255,0.2)",border:"1px solid rgba(108,99,255,0.4)",color:"#a5b4fc",padding:"2px 8px",borderRadius:"20px",fontWeight:600 }}>BETA</span>
        </div>
        <div style={{ width:"1px",height:"16px",background:"rgba(108,99,255,0.2)" }}/>

        {/* Add Nodes */}
        <div style={{ display:"flex",gap:"4px" }}>
          {[["frame","▭ Frame"],["component","⬡ Component"],["text","T Text"],["api","⚡ API Node"],["image","⊡ Image"]].map(([t,l])=>(
            <button key={t} className="s-btn" onClick={()=>addNode(t)} style={{ padding:"4px 9px",fontSize:"10.5px" }}>{l}</button>
          ))}
        </div>

        <div style={{ flex:1 }}/>

        {/* AI Prompt */}
        <button className="s-btn primary" onClick={()=>setShowAiPanel(p=>!p)} style={{ gap:"6px" }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          AI Generate
        </button>

        {/* Dev Mode */}
        <button className={`s-btn${devMode?" active":""}`} onClick={()=>setDevMode(p=>!p)} style={{ padding:"4px 10px",gap:"5px",color:devMode?"#22d3a8":undefined,borderColor:devMode?"rgba(34,211,168,0.5)":undefined }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
          Dev Mode
        </button>

        {/* Ghost Replay */}
        <button className={`s-btn ${isRecording?"danger":replayPlaying?"green":""}`}
          onClick={()=>{ if(isRecording){stopRecording();} else if(recordedEventsRef.current.length>0&&!replayPlaying){playReplay();} else {startRecording();} }}
          style={{ padding:"4px 10px",fontSize:"10.5px" }}>
          {isRecording ? "⏹ Stop Rec" : replayPlaying ? "▶ Playing..." : recordedEventsRef.current.length>0 ? "▶ Replay" : "⏺ Record"}
        </button>

        {/* Zoom controls */}
        <div style={{ display:"flex",alignItems:"center",gap:"4px" }}>
          <button className="s-btn" onClick={()=>setVp(v=>({...v,scale:clamp(v.scale-0.1,0.1,8)}))} style={{ padding:"3px 8px" }}>−</button>
          <span style={{ fontSize:"11px",color:"#6c63ff",minWidth:"40px",textAlign:"center" }}>{Math.round(vp.scale*100)}%</span>
          <button className="s-btn" onClick={()=>setVp(v=>({...v,scale:clamp(v.scale+0.1,0.1,8)}))} style={{ padding:"3px 8px" }}>+</button>
          <button className="s-btn" onClick={()=>setVp({x:0,y:0,scale:1})} style={{ padding:"3px 7px",fontSize:"10px" }}>Reset</button>
        </div>
      </div>

      {/* ── Main Area ─────────────────────────────────────────────────── */}
      <div style={{ display:"flex",flex:1,overflow:"hidden",position:"relative" }}>

        {/* ── Infinite Canvas ─────────────────────────────────────────── */}
        <div
          ref={canvasRef}
          className="grid-bg"
          style={{ flex:1,position:"relative",overflow:"hidden",cursor:isPanningRef.current?"grabbing":connectingFrom?"crosshair":"default" }}
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onWheel={handleCanvasWheel}
          onContextMenu={e=>e.preventDefault()}
        >
          {/* ── Connection SVG ───────────────────────────────────────── */}
          <svg style={{ position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:5 }}>
            <defs>
              <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                <polygon points="0 0,8 3,0 6" fill={devMode?"#22d3a8":"#6c63ff"}/>
              </marker>
            </defs>
            {connections.map(c => {
              const from = getNodeCenter(c.fromId);
              const to_n = nodes.find(n => n.id === c.toId);
              if (!from || !to_n) return null;
              const toSc = toScreen(to_n.x, to_n.y + to_n.h/2);
              const mx = (from.x + toSc.x) / 2;
              return (
                <g key={c.id}>
                  <path d={`M${from.x},${from.y} C${mx},${from.y} ${mx},${toSc.y} ${toSc.x},${toSc.y}`}
                    fill="none" stroke={devMode?"rgba(34,211,168,0.5)":"rgba(108,99,255,0.45)"} strokeWidth="1.5" strokeDasharray={devMode?"6,4":undefined} markerEnd="url(#arrowhead)"/>
                  {devMode && (
                    <text x={(from.x+toSc.x)/2} y={(from.y+toSc.y)/2-6} fill="#22d3a8" fontSize="9" textAnchor="middle">
                      {Math.round(Math.sqrt(Math.pow(toSc.x-from.x,2)+Math.pow(toSc.y-from.y,2)))}px
                    </text>
                  )}
                </g>
              );
            })}
            {/* Live connection preview */}
            {connectingFrom && (() => {
              const fn = nodes.find(n=>n.id===connectingFrom.nodeId);
              if (!fn) return null;
              const from = getNodeCenter(connectingFrom.nodeId);
              const rect = studioRef.current?.getBoundingClientRect();
              const tx = connectingMouse.x - (rect?.left||0);
              const ty = connectingMouse.y - (rect?.top||0);
              return <path d={`M${from.x},${from.y} C${(from.x+tx)/2},${from.y} ${(from.x+tx)/2},${ty} ${tx},${ty}`} fill="none" stroke="#6c63ff" strokeWidth="1.5" strokeDasharray="5,3" opacity="0.8"/>;
            })()}
            {/* Dev Mode spacing lines */}
            {devMode && selectedNode && devDistances.map(d => {
              const sc1 = toScreen(selectedNode.x + selectedNode.w/2, selectedNode.y + selectedNode.h/2);
              const n2 = nodes.find(n=>n.id===d.id);
              if (!n2) return null;
              const sc2 = toScreen(n2.x + n2.w/2, n2.y + n2.h/2);
              return (
                <g key={d.id}>
                  <line x1={sc1.x} y1={sc1.y} x2={sc2.x} y2={sc2.y} stroke="#22d3a8" strokeWidth="1" strokeDasharray="4,3" opacity="0.6"/>
                  <text x={(sc1.x+sc2.x)/2} y={(sc1.y+sc2.y)/2} fill="#22d3a8" fontSize="10" textAnchor="middle" dy="-4">{d.dx}px</text>
                </g>
              );
            })}
          </svg>

          {/* ── Node Cards ───────────────────────────────────────────── */}
          <div style={{ position:"absolute", transform:`translate(${vp.x}px,${vp.y}px) scale(${vp.scale})`, transformOrigin:"0 0", zIndex:10 }}>
            {nodes.map(node => {
              const isSelected = selectedId === node.id;
              return (
                <div
                  key={node.id}
                  className={`node-card${isSelected?" selected":""}${devMode?" dev-mode":""}${devMode&&isSelected?" selected":""}`}
                  style={{ left:node.x, top:node.y, width:node.w, height:node.h, background:node.bg||"#161229", borderColor:isSelected?(devMode?"#22d3a8":"#6c63ff"):"transparent", position:"absolute" }}
                  onMouseDown={e=>handleNodeMouseDown(e,node.id)}
                >
                  {/* Node Header */}
                  <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"7px 10px 6px", borderBottom:`1px solid ${node.accent||"#6c63ff"}22`, flexShrink:0 }}>
                    <div style={{ display:"flex",alignItems:"center",gap:"6px" }}>
                      <div style={{ width:"7px",height:"7px",borderRadius:"50%",background:node.accent||"#6c63ff" }}/>
                      <span style={{ fontSize:"10px",fontWeight:600,color:node.accent||"#a5b4fc",letterSpacing:"0.06em" }}>
                        {node.type==="api"?"API":node.type==="component"?"COMPONENT":node.type==="frame"?"FRAME":"LAYER"}
                      </span>
                    </div>
                    <div style={{ display:"flex",alignItems:"center",gap:"4px" }}>
                      <span style={{ fontSize:"10px",color:"#555" }}>{node.label}</span>
                      <button onClick={e=>{e.stopPropagation();deleteNode(node.id);}} style={{ background:"none",border:"none",color:"#444",cursor:"pointer",fontSize:"10px",padding:"0 2px",lineHeight:1 }}>✕</button>
                    </div>
                  </div>

                  {/* Node Body */}
                  <div style={{ padding:"10px",overflow:"hidden",flex:1,height:"calc(100% - 34px)",display:"flex",flexDirection:"column",gap:"6px" }}>
                    {node.type==="api" && (
                      <div style={{ textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",gap:"4px" }}>
                        {node.apiError ? (
                          <span style={{ color:"#ef4444",fontSize:"10px" }}>⚠ {node.apiError.slice(0,40)}</span>
                        ) : node.apiData != null ? (
                          <>
                            <div style={{ fontSize:"28px",fontWeight:800,color:node.accent||"#22d3a8",fontFamily:"Syne,sans-serif",letterSpacing:"-0.03em" }}>{String(node.apiData).slice(0,12)}</div>
                            <div style={{ fontSize:"9px",color:"#555",fontFamily:"JetBrains Mono,monospace",background:"rgba(255,255,255,0.04)",padding:"2px 8px",borderRadius:"4px" }}>{node.apiEndpoint?.split("/").slice(-2).join("/")}</div>
                            <div style={{ fontSize:"8px",color:"#22d3a8",display:"flex",alignItems:"center",gap:"4px" }}>
                              <div style={{ width:"5px",height:"5px",borderRadius:"50%",background:"#22d3a8",animation:"pulse-ring 1.5s ease infinite" }}/>LIVE
                            </div>
                          </>
                        ) : (
                          <div style={{ width:"18px",height:"18px",border:"2px solid rgba(34,211,168,0.3)",borderTopColor:"#22d3a8",borderRadius:"50%",animation:"spin 0.8s linear infinite" }}/>
                        )}
                      </div>
                    )}
                    {node.type==="frame" && (
                      <div style={{ fontSize:"11px",color:"#888",lineHeight:1.5,overflow:"hidden",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",textAlign:"center" }}>
                        <div style={{ opacity:0.5,fontSize:"10px" }}>{node.label}</div>
                      </div>
                    )}
                    {node.type==="component" && (
                      <div style={{ height:"100%",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden" }}>
                        <div style={{ fontSize:"9px",color:"#a5b4fc",fontFamily:"JetBrains Mono,monospace",opacity:0.6,textAlign:"center",lineHeight:1.6 }}>
                          {(node.code||"").split("\n").slice(0,4).map((l,i)=><div key={i} style={{ overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:node.w-28 }}>{l}</div>)}
                        </div>
                      </div>
                    )}
                    {node.type==="text" && (
                      <div style={{ height:"100%",display:"flex",alignItems:"center",justifyContent:"center" }}>
                        <p style={{ color:"#e5e5e5",fontSize:"13px",lineHeight:1.5,textAlign:"center",fontFamily:"Poppins,sans-serif" }}>{node.label}</p>
                      </div>
                    )}
                    {node.type==="image" && (
                      <div style={{ height:"100%",display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(255,255,255,0.03)",borderRadius:"6px" }}>
                        <div style={{ textAlign:"center",color:"#555",fontSize:"11px" }}>
                          <div style={{ fontSize:"28px",marginBottom:"4px",opacity:0.5 }}>🖼</div>
                          Image Node
                        </div>
                      </div>
                    )}
                    {/* Dev Mode overlay */}
                    {devMode && isSelected && (
                      <div style={{ position:"absolute",inset:0,background:"rgba(34,211,168,0.04)",borderRadius:"10px",display:"flex",alignItems:"flex-end",padding:"8px",pointerEvents:"none" }}>
                        <div style={{ fontSize:"9px",color:"#22d3a8",fontFamily:"JetBrains Mono,monospace",lineHeight:1.8 }}>
                          <div>w: {node.w}px · h: {node.h}px</div>
                          <div>x: {Math.round(node.x)}px · y: {Math.round(node.y)}px</div>
                          <div style={{ color:"#6c63ff" }}>{cssToTailwind(node).split(" ").slice(0,4).join(" ")}</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Connection ports */}
                  <div className="port right" onMouseDown={e=>handlePortMouseDown(e,node.id)} onMouseUp={e=>handlePortMouseUp(e,node.id)}/>
                  <div className="port left" onMouseUp={e=>handlePortMouseUp(e,node.id)}/>
                </div>
              );
            })}
          </div>

          {/* ── Peer Cursors ─────────────────────────────────────────── */}
          {Object.entries(peerCursors).map(([id,{pos,name}])=>(
            <div key={id} style={{ position:"absolute",left:pos.x,top:pos.y,pointerEvents:"none",zIndex:90,transform:"translate(-2px,-2px)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#6c63ff"><path d="M5 3l14 7-7 1.5 2 6.5L5 3z"/></svg>
              <div style={{ background:"#6c63ff",color:"#fff",fontSize:"9px",padding:"2px 7px",borderRadius:"10px",whiteSpace:"nowrap",marginTop:"2px",fontWeight:600 }}>{name}</div>
            </div>
          ))}

          {/* ── Ghost Replay Cursor ───────────────────────────────────── */}
          {ghostPos && (
            <div style={{ position:"absolute",left:ghostPos.x,top:ghostPos.y,pointerEvents:"none",zIndex:95,transform:"translate(-2px,-2px)",transition:"left 0.05s,top 0.05s" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="rgba(225,73,109,0.8)"><path d="M5 3l14 7-7 1.5 2 6.5L5 3z"/></svg>
              <div style={{ background:"rgba(225,73,109,0.9)",color:"#fff",fontSize:"9px",padding:"2px 7px",borderRadius:"10px",whiteSpace:"nowrap",marginTop:"2px",fontWeight:600 }}>👻 {ghostName}</div>
            </div>
          )}

          {/* ── Recording indicator ──────────────────────────────────── */}
          {isRecording && (
            <div style={{ position:"absolute",top:12,left:"50%",transform:"translateX(-50%)",background:"rgba(239,68,68,0.9)",color:"#fff",fontSize:"11px",padding:"4px 14px",borderRadius:"20px",fontWeight:600,display:"flex",alignItems:"center",gap:"7px",zIndex:90 }}>
              <div style={{ width:"7px",height:"7px",borderRadius:"50%",background:"#fff",animation:"pulse-ring 1s ease infinite" }}/>RECORDING
            </div>
          )}

          {/* ── Zoom hint ────────────────────────────────────────────── */}
          {nodes.length === 0 && (
            <div style={{ position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",pointerEvents:"none" }}>
              <div style={{ textAlign:"center",color:"rgba(108,99,255,0.4)",animation:"float 4s ease-in-out infinite" }}>
                <div style={{ fontSize:"60px",marginBottom:"12px",opacity:0.4 }}>∞</div>
                <div style={{ fontSize:"14px",fontWeight:600 }}>Empty canvas</div>
                <div style={{ fontSize:"12px",marginTop:"4px" }}>Add nodes · Pan · Zoom · Connect</div>
              </div>
            </div>
          )}
        </div>

        {/* ── Right Panel ──────────────────────────────────────────────── */}
        <div style={{ width:"300px",minWidth:"300px",background:"rgba(5,5,17,0.96)",borderLeft:"1px solid rgba(108,99,255,0.2)",display:"flex",flexDirection:"column",zIndex:20 }}>
          {/* Panel Tabs */}
          <div style={{ display:"flex",borderBottom:"1px solid rgba(108,99,255,0.15)",background:"rgba(0,0,0,0.3)",flexShrink:0 }}>
            {[["properties","Props"],["code","Code"],["api","API"],["dev","Dev"],["export","Export"]].map(([k,l])=>(
              <button key={k} onClick={()=>setRightPanel(k)} style={{ flex:1,padding:"8px 4px",background:"none",border:"none",borderBottom:`2px solid ${rightPanel===k?"#6c63ff":"transparent"}`,color:rightPanel===k?"#a5b4fc":"#555",fontSize:"10px",fontWeight:600,cursor:"pointer",transition:"all 0.15s",letterSpacing:"0.04em" }}>{l}</button>
            ))}
          </div>

          <div style={{ flex:1,overflowY:"auto",padding:"14px",display:"flex",flexDirection:"column",gap:"14px" }} className="panel-slide">

            {/* PROPERTIES */}
            {rightPanel==="properties" && selectedNode && (
              <>
                <div>
                  <div style={{ fontSize:"10px",color:"#6c63ff",fontWeight:700,letterSpacing:"0.1em",marginBottom:"10px" }}>NODE PROPERTIES</div>
                  <div style={{ display:"flex",flexDirection:"column",gap:"9px" }}>
                    <div><label style={{ fontSize:"10px",color:"#888",display:"block",marginBottom:"4px" }}>Label</label>
                      <input className="s-inp" value={selectedNode.label||""} onChange={e=>updateNode(selectedId,{label:e.target.value})}/>
                    </div>
                    <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"7px" }}>
                      <div><label style={{ fontSize:"10px",color:"#888",display:"block",marginBottom:"4px" }}>Width</label>
                        <input className="s-inp" type="number" value={selectedNode.w} onChange={e=>updateNode(selectedId,{w:parseInt(e.target.value)||100})}/>
                      </div>
                      <div><label style={{ fontSize:"10px",color:"#888",display:"block",marginBottom:"4px" }}>Height</label>
                        <input className="s-inp" type="number" value={selectedNode.h} onChange={e=>updateNode(selectedId,{h:parseInt(e.target.value)||100})}/>
                      </div>
                    </div>
                    <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"7px" }}>
                      <div><label style={{ fontSize:"10px",color:"#888",display:"block",marginBottom:"4px" }}>X</label>
                        <input className="s-inp" type="number" value={Math.round(selectedNode.x)} onChange={e=>updateNode(selectedId,{x:parseInt(e.target.value)||0})}/>
                      </div>
                      <div><label style={{ fontSize:"10px",color:"#888",display:"block",marginBottom:"4px" }}>Y</label>
                        <input className="s-inp" type="number" value={Math.round(selectedNode.y)} onChange={e=>updateNode(selectedId,{y:parseInt(e.target.value)||0})}/>
                      </div>
                    </div>
                    <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"7px" }}>
                      <div><label style={{ fontSize:"10px",color:"#888",display:"block",marginBottom:"4px" }}>Background</label>
                        <input type="color" value={selectedNode.bg||"#161229"} onChange={e=>updateNode(selectedId,{bg:e.target.value})} style={{ width:"100%",height:"32px",background:"none",border:"1px solid rgba(108,99,255,0.25)",borderRadius:"7px",cursor:"pointer" }}/>
                      </div>
                      <div><label style={{ fontSize:"10px",color:"#888",display:"block",marginBottom:"4px" }}>Accent</label>
                        <input type="color" value={selectedNode.accent||"#6c63ff"} onChange={e=>updateNode(selectedId,{accent:e.target.value})} style={{ width:"100%",height:"32px",background:"none",border:"1px solid rgba(108,99,255,0.25)",borderRadius:"7px",cursor:"pointer" }}/>
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ height:"1px",background:"rgba(108,99,255,0.12)" }}/>
                <div>
                  <div style={{ fontSize:"10px",color:"#555",fontWeight:600,marginBottom:"8px" }}>CONNECTIONS ({connections.filter(c=>c.fromId===selectedId||c.toId===selectedId).length})</div>
                  {connections.filter(c=>c.fromId===selectedId||c.toId===selectedId).map(c=>(
                    <div key={c.id} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 9px",background:"rgba(108,99,255,0.07)",borderRadius:"6px",marginBottom:"5px",fontSize:"11px" }}>
                      <span style={{ color:"#a5b4fc" }}>→ {nodes.find(n=>n.id===(c.fromId===selectedId?c.toId:c.fromId))?.label||"?"}</span>
                      <button onClick={()=>setConnections(prev=>prev.filter(cn=>cn.id!==c.id))} style={{ background:"none",border:"none",color:"#444",cursor:"pointer",fontSize:"10px" }}>✕</button>
                    </div>
                  ))}
                  {connections.filter(c=>c.fromId===selectedId||c.toId===selectedId).length===0&&(
                    <div style={{ fontSize:"10px",color:"#444",textAlign:"center",padding:"8px 0" }}>Drag from port • to connect nodes</div>
                  )}
                </div>
                <button className="s-btn danger" onClick={()=>deleteNode(selectedId)} style={{ width:"100%",justifyContent:"center" }}>Delete Node</button>
              </>
            )}
            {rightPanel==="properties" && !selectedNode && (
              <div style={{ textAlign:"center",color:"#444",fontSize:"12px",padding:"20px 0" }}>
                <div style={{ fontSize:"28px",marginBottom:"8px",opacity:0.4 }}>⊡</div>
                Click a node to select it<br/>
                <span style={{ fontSize:"10px" }}>or add a new node from the header</span>
              </div>
            )}

            {/* CODE INSPECTOR */}
            {rightPanel==="code" && (
              <>
                <div style={{ fontSize:"10px",color:"#6c63ff",fontWeight:700,letterSpacing:"0.1em" }}>CODE INSPECTOR</div>
                {selectedNode ? (
                  <>
                    <div style={{ fontSize:"10px",color:"#555" }}>Editing: <span style={{ color:"#a5b4fc" }}>{selectedNode.label}</span></div>
                    <textarea
                      className="code-area"
                      style={{ flex:1,minHeight:"300px" }}
                      value={selectedNode.code||""}
                      onChange={e=>updateNode(selectedId,{code:e.target.value})}
                      spellCheck={false}
                    />
                    <div style={{ display:"flex",gap:"6px" }}>
                      <button className="s-btn" onClick={()=>{ const c=selectedNode.code||""; navigator.clipboard.writeText(c); }} style={{ flex:1,justifyContent:"center",fontSize:"10px" }}>Copy JSX</button>
                      <button className="s-btn" style={{ flex:1,justifyContent:"center",fontSize:"10px" }} onClick={()=>{
                        const tw = cssToTailwind(selectedNode);
                        navigator.clipboard.writeText(tw);
                      }}>Copy Tailwind</button>
                    </div>
                    <div style={{ background:"rgba(108,99,255,0.07)",border:"1px solid rgba(108,99,255,0.18)",borderRadius:"8px",padding:"10px" }}>
                      <div style={{ fontSize:"9px",color:"#555",fontWeight:600,letterSpacing:"0.08em",marginBottom:"6px" }}>TAILWIND CLASSES</div>
                      <code style={{ fontSize:"10px",color:"#6c63ff",fontFamily:"JetBrains Mono,monospace",lineHeight:1.7,wordBreak:"break-all" }}>
                        {cssToTailwind(selectedNode)}
                      </code>
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign:"center",color:"#444",fontSize:"11px",padding:"20px 0" }}>Select a node to inspect its code</div>
                )}
              </>
            )}

            {/* API PANEL */}
            {rightPanel==="api" && (
              <>
                <div style={{ fontSize:"10px",color:"#6c63ff",fontWeight:700,letterSpacing:"0.1em" }}>LIVE API BINDING</div>
                {selectedNode ? (
                  <>
                    <div style={{ fontSize:"10px",color:"#888",marginBottom:"4px" }}>
                      Bind <span style={{ color:"#a5b4fc" }}>{selectedNode.label}</span> to a REST API
                    </div>
                    <div>
                      <label style={{ fontSize:"10px",color:"#888",display:"block",marginBottom:"4px" }}>API Endpoint URL</label>
                      <input className="s-inp" value={selectedNode.apiEndpoint||""} onChange={e=>updateNode(selectedId,{apiEndpoint:e.target.value,apiData:null,apiError:null})} placeholder="https://api.example.com/data"/>
                    </div>
                    <div>
                      <label style={{ fontSize:"10px",color:"#888",display:"block",marginBottom:"4px" }}>Field to display (optional)</label>
                      <input className="s-inp" value={selectedNode.apiField||""} onChange={e=>updateNode(selectedId,{apiField:e.target.value})} placeholder="title, name, length, count..."/>
                    </div>
                    <div style={{ display:"flex",gap:"6px" }}>
                      <div style={{ flex:1 }}>
                        <label style={{ fontSize:"10px",color:"#888",display:"block",marginBottom:"4px" }}>Method</label>
                        <select className="s-inp" value={selectedNode.apiMethod||"GET"} onChange={e=>updateNode(selectedId,{apiMethod:e.target.value})}>
                          <option>GET</option><option>POST</option>
                        </select>
                      </div>
                      <div style={{ flex:1 }}>
                        <label style={{ fontSize:"10px",color:"#888",display:"block",marginBottom:"4px" }}>Poll interval</label>
                        <select className="s-inp" value={selectedNode.apiPoll||"8000"} onChange={e=>updateNode(selectedId,{apiPoll:e.target.value})}>
                          <option value="3000">3s</option><option value="5000">5s</option><option value="8000">8s</option><option value="30000">30s</option>
                        </select>
                      </div>
                    </div>
                    {selectedNode.apiData != null && (
                      <div style={{ background:"rgba(34,211,168,0.07)",border:"1px solid rgba(34,211,168,0.25)",borderRadius:"8px",padding:"10px" }}>
                        <div style={{ fontSize:"9px",color:"#22d3a8",fontWeight:600,marginBottom:"5px" }}>LIVE DATA</div>
                        <code style={{ fontSize:"11px",color:"#e5e5e5",fontFamily:"JetBrains Mono,monospace",wordBreak:"break-all" }}>
                          {String(selectedNode.apiData).slice(0,200)}
                        </code>
                        <div style={{ fontSize:"9px",color:"#22d3a8",marginTop:"6px",display:"flex",alignItems:"center",gap:"5px" }}>
                          <div style={{ width:"5px",height:"5px",borderRadius:"50%",background:"#22d3a8" }}/>Auto-refreshing every 8s
                        </div>
                      </div>
                    )}
                    {selectedNode.apiError && (
                      <div style={{ background:"rgba(239,68,68,0.07)",border:"1px solid rgba(239,68,68,0.25)",borderRadius:"8px",padding:"10px",fontSize:"11px",color:"#ef4444" }}>
                        ⚠ {selectedNode.apiError}
                      </div>
                    )}
                    <div style={{ fontSize:"10px",color:"#555" }}>
                      <div style={{ marginBottom:"4px",fontWeight:600,color:"#444" }}>EXAMPLE APIS TO TRY:</div>
                      {[["JSONPlaceholder Users","https://jsonplaceholder.typicode.com/users","length"],["GitHub React Stars","https://api.github.com/repos/facebook/react","stargazers_count"],["Random Quote","https://api.quotable.io/random","content"]].map(([n,url,f])=>(
                        <div key={url} onClick={()=>updateNode(selectedId,{apiEndpoint:url,apiField:f,apiData:null})} style={{ padding:"5px 8px",background:"rgba(108,99,255,0.06)",borderRadius:"5px",cursor:"pointer",marginBottom:"4px",transition:"background 0.1s" }}
                          onMouseEnter={e=>e.currentTarget.style.background="rgba(108,99,255,0.15)"}
                          onMouseLeave={e=>e.currentTarget.style.background="rgba(108,99,255,0.06)"}>
                          <div style={{ color:"#a5b4fc",marginBottom:"2px" }}>{n}</div>
                          <div style={{ color:"#444",fontSize:"9px",fontFamily:"JetBrains Mono,monospace" }}>{url.slice(0,45)}…</div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign:"center",color:"#444",fontSize:"11px",padding:"20px 0" }}>Select an API node to bind live data</div>
                )}
              </>
            )}

            {/* DEV MODE */}
            {rightPanel==="dev" && (
              <>
                <div style={{ fontSize:"10px",color:"#6c63ff",fontWeight:700,letterSpacing:"0.1em" }}>DEV MODE HANDOFF</div>
                <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",background:"rgba(34,211,168,0.07)",border:"1px solid rgba(34,211,168,0.25)",borderRadius:"8px",padding:"10px" }}>
                  <div>
                    <div style={{ fontSize:"12px",fontWeight:600,color:devMode?"#22d3a8":"#888" }}>{devMode?"Dev Mode Active":"Dev Mode Off"}</div>
                    <div style={{ fontSize:"10px",color:"#555",marginTop:"2px" }}>Shows spacing, CSS, Tailwind</div>
                  </div>
                  <button className={`s-btn${devMode?" green":""}`} onClick={()=>setDevMode(p=>!p)}>{devMode?"Disable":"Enable"}</button>
                </div>
                {selectedNode && (
                  <div style={{ display:"flex",flexDirection:"column",gap:"8px" }}>
                    <div style={{ fontSize:"10px",color:"#555",fontWeight:600,letterSpacing:"0.08em" }}>CSS PROPERTIES</div>
                    <div style={{ background:"rgba(0,0,0,0.4)",border:"1px solid rgba(108,99,255,0.15)",borderRadius:"8px",padding:"10px",fontFamily:"JetBrains Mono,monospace",fontSize:"10px",lineHeight:2 }}>
                      <div><span style={{ color:"#e1496d" }}>position</span>: <span style={{ color:"#22d3a8" }}>absolute</span>;</div>
                      <div><span style={{ color:"#e1496d" }}>left</span>: <span style={{ color:"#22d3a8" }}>{Math.round(selectedNode.x)}px</span>;</div>
                      <div><span style={{ color:"#e1496d" }}>top</span>: <span style={{ color:"#22d3a8" }}>{Math.round(selectedNode.y)}px</span>;</div>
                      <div><span style={{ color:"#e1496d" }}>width</span>: <span style={{ color:"#22d3a8" }}>{selectedNode.w}px</span>;</div>
                      <div><span style={{ color:"#e1496d" }}>height</span>: <span style={{ color:"#22d3a8" }}>{selectedNode.h}px</span>;</div>
                      <div><span style={{ color:"#e1496d" }}>background</span>: <span style={{ color:"#22d3a8" }}>{selectedNode.bg||"#161229"}</span>;</div>
                      <div><span style={{ color:"#e1496d" }}>border-radius</span>: <span style={{ color:"#22d3a8" }}>12px</span>;</div>
                      <div><span style={{ color:"#e1496d" }}>display</span>: <span style={{ color:"#22d3a8" }}>flex</span>;</div>
                      <div><span style={{ color:"#e1496d" }}>flex-direction</span>: <span style={{ color:"#22d3a8" }}>column</span>;</div>
                    </div>
                    <div style={{ fontSize:"10px",color:"#555",fontWeight:600,letterSpacing:"0.08em" }}>TAILWIND</div>
                    <div style={{ background:"rgba(108,99,255,0.07)",border:"1px solid rgba(108,99,255,0.2)",borderRadius:"8px",padding:"10px" }}>
                      <code style={{ fontSize:"10px",color:"#6c63ff",fontFamily:"JetBrains Mono,monospace",lineHeight:1.8,wordBreak:"break-all" }}>
                        {cssToTailwind(selectedNode)}
                      </code>
                    </div>
                    <button className="s-btn" style={{ width:"100%",justifyContent:"center",fontSize:"10px" }} onClick={()=>navigator.clipboard.writeText(cssToTailwind(selectedNode))}>
                      Copy Tailwind Classes
                    </button>
                    {devDistances.length>0&&(
                      <>
                        <div style={{ fontSize:"10px",color:"#555",fontWeight:600,letterSpacing:"0.08em" }}>SPACING TO NEIGHBORS</div>
                        {devDistances.map(d=>(
                          <div key={d.id} style={{ display:"flex",justifyContent:"space-between",padding:"6px 8px",background:"rgba(34,211,168,0.05)",borderRadius:"5px",fontSize:"10px" }}>
                            <span style={{ color:"#888" }}>→ {d.label}</span>
                            <span style={{ color:"#22d3a8",fontFamily:"JetBrains Mono,monospace" }}>Δx:{d.dx}  Δy:{d.dy}</span>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                )}
                {!selectedNode && <div style={{ textAlign:"center",color:"#444",fontSize:"11px",padding:"16px 0" }}>Select a node to inspect CSS & spacing</div>}
              </>
            )}

            {/* EXPORT */}
            {rightPanel==="export" && (
              <>
                <div style={{ fontSize:"10px",color:"#6c63ff",fontWeight:700,letterSpacing:"0.1em" }}>EXPORT CODE</div>
                <div>
                  <label style={{ fontSize:"10px",color:"#888",display:"block",marginBottom:"6px" }}>Export Format</label>
                  <div style={{ display:"flex",gap:"5px" }}>
                    {[["react","React/JSX"],["html","HTML"],["tailwind","Tailwind"]].map(([f,l])=>(
                      <button key={f} className={`s-btn${exportFormat===f?" active":""}`} onClick={()=>setExportFormat(f)} style={{ flex:1,justifyContent:"center",fontSize:"10px",padding:"5px 4px" }}>{l}</button>
                    ))}
                  </div>
                </div>
                <div style={{ fontSize:"10px",color:"#555",background:"rgba(108,99,255,0.06)",borderRadius:"6px",padding:"8px" }}>
                  <div style={{ fontWeight:600,marginBottom:"2px",color:"#888" }}>Will export {nodes.length} node{nodes.length!==1?"s":""} + {connections.length} connection{connections.length!==1?"s":""}</div>
                  Format: <span style={{ color:"#6c63ff" }}>{exportFormat === "react" ? "Production React + JSX" : exportFormat === "html" ? "Pure HTML5 + CSS" : "Tailwind CSS Components"}</span>
                </div>
                <div style={{ display:"flex",gap:"6px" }}>
                  <button className="s-btn primary" onClick={handleExport} style={{ flex:1,justifyContent:"center" }}>Generate Code</button>
                </div>
                {exportCode && (
                  <>
                    <textarea className="code-area" style={{ minHeight:"280px" }} value={exportCode} readOnly/>
                    <div style={{ display:"flex",gap:"6px" }}>
                      <button className={`s-btn${copied?" green":""}`} onClick={copyCode} style={{ flex:1,justifyContent:"center",fontSize:"10px" }}>{copied?"✓ Copied!":"Copy Code"}</button>
                      <button className="s-btn" onClick={downloadCode} style={{ flex:1,justifyContent:"center",fontSize:"10px" }}>Download</button>
                    </div>
                  </>
                )}
              </>
            )}

          </div>
        </div>
      </div>

      {/* ── AI Panel Modal ────────────────────────────────────────────────── */}
      {showAiPanel && (
        <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,backdropFilter:"blur(8px)" }}>
          <div style={{ width:"540px",background:"#0a0a1f",border:"1px solid rgba(108,99,255,0.4)",borderRadius:"20px",padding:"28px",animation:"fadeIn 0.2s ease" }}>
            <div style={{ display:"flex",alignItems:"center",gap:"10px",marginBottom:"20px" }}>
              <div style={{ width:"36px",height:"36px",borderRadius:"10px",background:"linear-gradient(135deg,#4f46e5,#7c3aed)",display:"flex",alignItems:"center",justifyContent:"center" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              </div>
              <div>
                <h3 style={{ fontFamily:"Syne,sans-serif",fontWeight:800,fontSize:"18px",color:"#fff",letterSpacing:"-0.02em" }}>AI Prompt → DOM Nodes</h3>
                <p style={{ fontSize:"12px",color:"#555",marginTop:"2px" }}>Describe a layout and AI generates structured canvas nodes</p>
              </div>
            </div>
            <textarea
              style={{ width:"100%",background:"rgba(108,99,255,0.06)",border:"1px solid rgba(108,99,255,0.3)",borderRadius:"10px",color:"#e5e5e5",padding:"14px",fontSize:"14px",fontFamily:"inherit",resize:"none",outline:"none",lineHeight:1.6 }}
              rows={4}
              value={aiPrompt}
              onChange={e=>setAiPrompt(e.target.value)}
              placeholder='Try: "Create a dark pricing table with 3 tiers" or "Build a SaaS dashboard with metrics" or "Design a hero section" or "Make a kanban board" or "Contact form"'
              onKeyDown={e=>{ if(e.key==="Enter"&&e.metaKey){ handleAiGenerate(); }}}
            />
            <div style={{ marginTop:"10px",display:"flex",flexWrap:"wrap",gap:"6px" }}>
              <div style={{ fontSize:"10px",color:"#555",width:"100%",marginBottom:"2px" }}>Quick prompts:</div>
              {["pricing table with 3 tiers","SaaS dashboard","hero section","navbar","kanban board","contact form"].map(p=>(
                <button key={p} className="s-btn" onClick={()=>setAiPrompt(p)} style={{ fontSize:"10px",padding:"3px 8px" }}>{p}</button>
              ))}
            </div>
            <div style={{ display:"flex",gap:"8px",marginTop:"16px" }}>
              <button className="s-btn primary" onClick={handleAiGenerate} disabled={aiGenerating||!aiPrompt.trim()} style={{ flex:2,justifyContent:"center",padding:"10px",fontSize:"13px" }}>
                {aiGenerating ? <><div style={{ width:"14px",height:"14px",border:"2px solid rgba(255,255,255,0.3)",borderTopColor:"#fff",borderRadius:"50%",animation:"spin 0.8s linear infinite" }}/>Generating…</> : "✦ Generate Nodes"}
              </button>
              <button className="s-btn" onClick={()=>setShowAiPanel(false)} style={{ flex:1,justifyContent:"center",padding:"10px" }}>Cancel</button>
            </div>
            <div style={{ marginTop:"10px",fontSize:"10px",color:"#444",textAlign:"center" }}>Generates editable canvas nodes • Not static images</div>
          </div>
        </div>
      )}

      {/* ── Status Bar ────────────────────────────────────────────────────── */}
      <div style={{ height:"24px",background:"rgba(5,5,17,0.98)",borderTop:"1px solid rgba(108,99,255,0.12)",display:"flex",alignItems:"center",padding:"0 14px",gap:"16px",fontSize:"9.5px",color:"#444",flexShrink:0 }}>
        <span style={{ color:"#6c63ff" }}>∞ INFINITE STUDIO</span>
        <span>Nodes: {nodes.length}</span>
        <span>Connections: {connections.length}</span>
        <span>Zoom: {Math.round(vp.scale*100)}%</span>
        <span>Pan: {Math.round(vp.x)},{Math.round(vp.y)}</span>
        {Object.keys(peerCursors).length>0&&<span style={{ color:"#6c63ff" }}>👥 {Object.keys(peerCursors).length} peer{Object.keys(peerCursors).length>1?"s":""} active</span>}
        {isRecording&&<span style={{ color:"#ef4444",display:"flex",alignItems:"center",gap:"4px" }}><span style={{ width:"5px",height:"5px",borderRadius:"50%",background:"#ef4444",display:"inline-block" }}/>REC {recordedEventsRef.current.length} events</span>}
        {devMode&&<span style={{ color:"#22d3a8" }}>⌘ DEV MODE</span>}
        <span style={{ marginLeft:"auto",color:"#333" }}>Alt+Drag = Pan · Scroll = Zoom · Drag port • to connect</span>
      </div>
    </div>
  );
}
