import { useState, useRef, useEffect, useCallback, useMemo } from "react";

/* ────────────────────────────────────────────────────────────────────────────
   INFINITE STUDIO — Rose/Burgundy Theme — Premium Edition
   1. Code-to-Canvas  (live JSX component nodes + export)
   2. Spatial Infinite Node Graph  (pan/zoom + bezier connections)
   3. Live API Data-Driven Nodes  (REST polling + live updates)
   4. Dev Mode Spatial Annotations  (spacing rulers + Tailwind copy)
   5. Multiplayer Ghost Cursors  (BroadcastChannel + Ghost Replay)
   6. AI Prompt-to-DOM Layout Engine  (keyword → structured nodes)
   + Minimap, Snap-to-Grid, Node Resize, Duplicate, Multi-select
   ──────────────────────────────────────────────────────────────────────────── */

let _nid = 1;
const uid = () => `n${_nid++}_${Date.now().toString(36)}`;
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const SESSION_ID = Math.random().toString(36).slice(2, 8);
const GRID = 20;
const snap = v => Math.round(v / GRID) * GRID;

// ── Colors ─────────────────────────────────────────────────────────────────
const C = {
  bg: "#0e0d11", panel: "#141117", sidebar: "#161217", headerBg: "#181318",
  accent: "#e1496d", accentLight: "#ff8da7", accentDark: "#942945",
  border: "rgba(225,73,109,0.18)", borderHi: "rgba(225,73,109,0.4)",
  text: "#e5e5e5", muted: "#8c8780", dim: "#5c5650",
  nodeBg: "#181318", nodeFrame: "#1a1520", nodeApi: "#16201a", nodeComp: "#1a1420",
  success: "#22d3a8", warning: "#f59e0b", danger: "#ef4444",
};

// ── Workflow Pipeline AI Generators & Image Synthesis ────────────────────
const AI_TRANSFORMS = {
  enhance: (input) => `Masterpiece 8k 3D render of ${input || "futuristic concept"}, cinematic lighting, hyper-detailed, octane render, trending on artstation`,
  summary: (input) => `Summary: ${input ? input.slice(0, 60) + "..." : "No input data"}`,
  code: (input) => `<div className="p-6 bg-gradient-to-r from-rose-900 to-purple-900 text-white rounded-2xl shadow-2xl">
  <h2 className="text-xl font-bold">${input || "Dynamic Widget"}</h2>
  <button className="mt-4 px-4 py-2 bg-rose-500 rounded-lg">Action</button>
</div>`,
  translate: (input) => `[Spanish]: ${input || "Hola mundo design"}`
};

const IMAGE_PRESETS = [
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1533038590840-1cde6e668a91?auto=format&fit=crop&w=600&q=80",
];

// ── AI Templates ───────────────────────────────────────────────────────────
const AI_TEMPLATES = {
  "pricing": (x, y) => ({
    nodes: [
      { id:uid(), type:"frame", x, y, w:240, h:320, label:"Starter", bg:C.nodeFrame, accent:C.accent,
        code:`<div style="padding:24px;background:#1a1520;border-radius:16px;border:1px solid rgba(225,73,109,0.2);text-align:center">
  <h3 style="color:#e1496d;font-size:14px;letter-spacing:0.1em;margin-bottom:12px">STARTER</h3>
  <div style="font-size:36px;font-weight:800;color:#fff;margin-bottom:16px">$9<span style="font-size:14px;color:#8c8780">/mo</span></div>
  <ul style="list-style:none;text-align:left;color:#8c8780;font-size:13px;line-height:2.2">
    <li>✓ 5 Projects</li><li>✓ 10GB Storage</li><li>✓ Basic Support</li>
  </ul>
  <button style="margin-top:16px;padding:10px 24px;background:transparent;border:1.5px solid #e1496d;color:#e1496d;border-radius:10px;cursor:pointer;font-weight:600">Get Started</button>
</div>` },
      { id:uid(), type:"frame", x:x+260, y:y-30, w:260, h:390, label:"Pro", bg:"#2a1525", accent:"#ff8da7",
        code:`<div style="padding:24px;background:linear-gradient(145deg,#2a1525,#1a0f1a);border-radius:16px;border:1.5px solid #e1496d;text-align:center;position:relative">
  <div style="position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,#942945,#e1496d);padding:4px 16px;border-radius:20px;font-size:10px;color:#fff;font-weight:700;letter-spacing:0.1em">POPULAR</div>
  <h3 style="color:#ff8da7;font-size:14px;letter-spacing:0.1em;margin-bottom:12px;margin-top:8px">PRO</h3>
  <div style="font-size:40px;font-weight:800;color:#fff;margin-bottom:16px">$29<span style="font-size:14px;color:#8c8780">/mo</span></div>
  <ul style="list-style:none;text-align:left;color:#c5c5c5;font-size:13px;line-height:2.2">
    <li>✓ Unlimited Projects</li><li>✓ 100GB Storage</li><li>✓ Priority Support</li><li>✓ Team Collaboration</li><li>✓ AI Tools</li>
  </ul>
  <button style="margin-top:16px;padding:12px 28px;background:linear-gradient(135deg,#942945,#e1496d);border:none;color:#fff;border-radius:10px;cursor:pointer;font-weight:600;box-shadow:0 4px 20px rgba(225,73,109,0.4)">Get Started</button>
</div>` },
      { id:uid(), type:"frame", x:x+540, y, w:240, h:320, label:"Enterprise", bg:C.nodeFrame, accent:C.success,
        code:`<div style="padding:24px;background:#1a1520;border-radius:16px;border:1px solid rgba(34,211,168,0.2);text-align:center">
  <h3 style="color:#22d3a8;font-size:14px;letter-spacing:0.1em;margin-bottom:12px">ENTERPRISE</h3>
  <div style="font-size:36px;font-weight:800;color:#fff;margin-bottom:16px">Custom</div>
  <ul style="list-style:none;text-align:left;color:#8c8780;font-size:13px;line-height:2.2">
    <li>✓ Unlimited Everything</li><li>✓ 1TB Storage</li><li>✓ 24/7 Dedicated</li><li>✓ SLA Guarantee</li>
  </ul>
  <button style="margin-top:16px;padding:10px 24px;background:transparent;border:1.5px solid #22d3a8;color:#22d3a8;border-radius:10px;cursor:pointer;font-weight:600">Contact Sales</button>
</div>` },
    ]
  }),
  "dashboard": (x, y) => ({
    nodes: [
      { id:uid(), type:"api", x, y, w:200, h:120, label:"Total Users", bg:C.nodeApi, accent:C.accent, apiEndpoint:"https://jsonplaceholder.typicode.com/users", apiField:"length" },
      { id:uid(), type:"api", x:x+220, y, w:200, h:120, label:"Posts Today", bg:C.nodeApi, accent:C.success, apiEndpoint:"https://jsonplaceholder.typicode.com/posts", apiField:"length" },
      { id:uid(), type:"api", x:x+440, y, w:200, h:120, label:"Open Todos", bg:C.nodeApi, accent:C.warning, apiEndpoint:"https://jsonplaceholder.typicode.com/todos?completed=false", apiField:"length" },
      { id:uid(), type:"frame", x, y:y+140, w:640, h:240, label:"Activity Feed", bg:C.nodeFrame, accent:C.accent,
        code:`<div style="padding:20px;background:#1a1520;border-radius:12px;height:100%">
  <h3 style="font-size:13px;color:#e1496d;letter-spacing:0.1em;margin-bottom:16px">RECENT ACTIVITY</h3>
  <div style="display:flex;flex-direction:column;gap:10px">
    <div style="display:flex;align-items:center;gap:10px;padding:8px;background:rgba(225,73,109,0.06);border-radius:8px">
      <div style="width:8px;height:8px;border-radius:50%;background:#22d3a8"></div>
      <span style="font-size:12px;color:#c5c5c5">New user signed up: sarah@email.com</span>
      <span style="font-size:10px;color:#5c5650;margin-left:auto">2m ago</span>
    </div>
    <div style="display:flex;align-items:center;gap:10px;padding:8px;background:rgba(225,73,109,0.06);border-radius:8px">
      <div style="width:8px;height:8px;border-radius:50%;background:#e1496d"></div>
      <span style="font-size:12px;color:#c5c5c5">Project "Nebula" published</span>
      <span style="font-size:10px;color:#5c5650;margin-left:auto">5m ago</span>
    </div>
  </div>
</div>` },
    ]
  }),
  "hero": (x, y) => ({
    nodes: [
      { id:uid(), type:"component", x, y, w:680, h:400, label:"Hero Section", bg:"#120e18", accent:C.accent,
        code:`<section style="min-height:400px;display:flex;align-items:center;justify-content:center;background:linear-gradient(170deg,#0e0d11,#1a0f14,#0e0d11);text-align:center;padding:40px;border-radius:16px">
  <div>
    <div style="display:inline-flex;align-items:center;gap:6px;padding:4px 14px;border-radius:20px;background:rgba(225,73,109,0.12);border:1px solid rgba(225,73,109,0.3);color:#ff8da7;font-size:12px;margin-bottom:20px">✦ Now in Public Beta</div>
    <h1 style="font-size:42px;font-weight:800;color:#fff;margin-bottom:14px;line-height:1.2">Design at the<br/><span style="background:linear-gradient(135deg,#e1496d,#ff8da7);-webkit-background-clip:text;-webkit-text-fill-color:transparent">Speed of Thought</span></h1>
    <p style="font-size:16px;color:#8c8780;margin-bottom:28px">The next-generation canvas where design meets code.</p>
    <div style="display:flex;gap:12px;justify-content:center">
      <button style="padding:12px 28px;background:linear-gradient(135deg,#942945,#e1496d);border:none;color:#fff;border-radius:12px;font-weight:600;font-size:15px;cursor:pointer;box-shadow:0 4px 20px rgba(225,73,109,0.4)">Start for Free</button>
      <button style="padding:12px 28px;background:transparent;border:1.5px solid rgba(225,73,109,0.3);color:#e5e5e5;border-radius:12px;font-weight:500;font-size:15px;cursor:pointer">Watch Demo →</button>
    </div>
  </div>
</section>` },
    ]
  }),
  "navbar": (x, y) => ({
    nodes: [
      { id:uid(), type:"component", x, y, w:800, h:64, label:"NavBar", bg:C.headerBg, accent:C.accent,
        code:`<nav style="display:flex;align-items:center;justify-content:space-between;padding:0 32px;height:64px;background:#181318;border-bottom:1px solid rgba(225,73,109,0.15)">
  <div style="display:flex;align-items:center;gap:10px">
    <div style="width:32px;height:32px;border-radius:10px;background:linear-gradient(135deg,#942945,#e1496d);display:flex;align-items:center;justify-content:center;font-weight:800;color:#fff;font-size:14px">C</div>
    <span style="font-weight:800;color:#fff;font-size:16px;font-family:Syne,sans-serif">Creatify</span>
  </div>
  <div style="display:flex;gap:24px;font-size:13px;color:#8c8780"><a style="color:#8c8780;text-decoration:none">Features</a><a style="color:#8c8780;text-decoration:none">Pricing</a><a style="color:#8c8780;text-decoration:none">Docs</a></div>
  <button style="padding:8px 20px;background:linear-gradient(135deg,#942945,#e1496d);border:none;color:#fff;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer">Get Started</button>
</nav>` },
    ]
  }),
  "kanban": (x, y) => ({
    nodes: [
      { id:uid(), type:"frame", x, y, w:220, h:280, label:"To Do", bg:C.nodeFrame, accent:C.accent, code:`<div style="padding:16px"><h3 style="font-size:12px;color:#e1496d;letter-spacing:0.1em;margin-bottom:12px">TO DO</h3><div style="display:flex;flex-direction:column;gap:8px"><div style="padding:10px;background:rgba(225,73,109,0.06);border-radius:8px;font-size:12px;color:#c5c5c5;border-left:3px solid #e1496d">Design mockups</div><div style="padding:10px;background:rgba(225,73,109,0.06);border-radius:8px;font-size:12px;color:#c5c5c5;border-left:3px solid #e1496d">Write tests</div></div></div>` },
      { id:uid(), type:"frame", x:x+240, y, w:220, h:280, label:"In Progress", bg:C.nodeFrame, accent:C.warning, code:`<div style="padding:16px"><h3 style="font-size:12px;color:#f59e0b;letter-spacing:0.1em;margin-bottom:12px">IN PROGRESS</h3><div style="display:flex;flex-direction:column;gap:8px"><div style="padding:10px;background:rgba(245,158,11,0.06);border-radius:8px;font-size:12px;color:#c5c5c5;border-left:3px solid #f59e0b">Build API</div></div></div>` },
      { id:uid(), type:"frame", x:x+480, y, w:220, h:280, label:"Done", bg:C.nodeFrame, accent:C.success, code:`<div style="padding:16px"><h3 style="font-size:12px;color:#22d3a8;letter-spacing:0.1em;margin-bottom:12px">DONE</h3><div style="display:flex;flex-direction:column;gap:8px"><div style="padding:10px;background:rgba(34,211,168,0.06);border-radius:8px;font-size:12px;color:#c5c5c5;border-left:3px solid #22d3a8">Auth system</div></div></div>` },
    ]
  }),
  "form": (x, y) => ({
    nodes: [
      { id:uid(), type:"component", x, y, w:400, h:460, label:"Contact Form", bg:"#14111a", accent:C.accent,
        code:`<div style="padding:28px;background:#14111a;border-radius:20px;border:1px solid rgba(225,73,109,0.2)">
  <h2 style="font-size:20px;font-weight:700;color:#fff;margin-bottom:6px">Get in Touch</h2>
  <p style="font-size:12px;color:#8c8780;margin-bottom:20px">We'll respond within 24 hours.</p>
  <div style="display:flex;flex-direction:column;gap:14px">
    <div><label style="display:block;font-size:10px;color:#8c8780;margin-bottom:5px;text-transform:uppercase;letter-spacing:0.08em">Name</label><input style="width:100%;padding:10px 14px;background:rgba(225,73,109,0.05);border:1px solid rgba(225,73,109,0.18);border-radius:8px;color:#e5e5e5;font-size:13px;outline:none" placeholder="Your name" /></div>
    <div><label style="display:block;font-size:10px;color:#8c8780;margin-bottom:5px;text-transform:uppercase;letter-spacing:0.08em">Email</label><input style="width:100%;padding:10px 14px;background:rgba(225,73,109,0.05);border:1px solid rgba(225,73,109,0.18);border-radius:8px;color:#e5e5e5;font-size:13px;outline:none" placeholder="you@email.com" /></div>
    <div><label style="display:block;font-size:10px;color:#8c8780;margin-bottom:5px;text-transform:uppercase;letter-spacing:0.08em">Message</label><textarea style="width:100%;padding:10px 14px;background:rgba(225,73,109,0.05);border:1px solid rgba(225,73,109,0.18);border-radius:8px;color:#e5e5e5;font-size:13px;outline:none;resize:none" rows="3" placeholder="How can we help?" /></div>
    <button style="padding:12px;background:linear-gradient(135deg,#942945,#e1496d);border:none;color:#fff;border-radius:10px;font-weight:600;cursor:pointer;box-shadow:0 4px 16px rgba(225,73,109,0.35)">Send Message →</button>
  </div>
</div>` },
    ]
  }),
  "card": (x, y) => ({
    nodes: [
      { id:uid(), type:"component", x, y, w:340, h:280, label:"Profile Card", bg:"#14111a", accent:C.accent,
        code:`<div style="padding:24px;background:linear-gradient(145deg,#14111a,#1a0f14);border-radius:20px;border:1px solid rgba(225,73,109,0.15);text-align:center">
  <div style="width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,#942945,#e1496d);margin:0 auto 14px;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:800;color:#fff;box-shadow:0 4px 20px rgba(225,73,109,0.4)">S</div>
  <h3 style="color:#fff;font-size:18px;font-weight:700;margin-bottom:4px">Sachin Yadav</h3>
  <p style="color:#8c8780;font-size:12px;margin-bottom:16px">Full Stack Developer</p>
  <div style="display:flex;justify-content:center;gap:20px;margin-bottom:16px">
    <div style="text-align:center"><div style="font-size:18px;font-weight:700;color:#e1496d">12</div><div style="font-size:10px;color:#5c5650">Projects</div></div>
    <div style="text-align:center"><div style="font-size:18px;font-weight:700;color:#22d3a8">4.9</div><div style="font-size:10px;color:#5c5650">Rating</div></div>
    <div style="text-align:center"><div style="font-size:18px;font-weight:700;color:#f59e0b">89</div><div style="font-size:10px;color:#5c5650">Clients</div></div>
  </div>
  <button style="padding:8px 24px;background:linear-gradient(135deg,#942945,#e1496d);border:none;color:#fff;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer">View Profile</button>
</div>` },
    ]
  }),
};

// ── Code Export Generator ──────────────────────────────────────────────────
function generateExportCode(nodes, connections, fmt) {
  if (fmt === "react") {
    return `import React from 'react';\n\n` + nodes.map(n => {
      const name = (n.label||"Node").replace(/[^a-zA-Z0-9]/g,"");
      return `const ${name} = () => (\n${(n.code||`<div>${n.label}</div>`).split("\n").map(l=>"  "+l).join("\n")}\n);\n`;
    }).join("\n") + `\nexport default function Page() {\n  return (\n    <div>\n${nodes.map(n=>`      <${(n.label||"Node").replace(/[^a-zA-Z0-9]/g,"")} />`).join("\n")}\n    </div>\n  );\n}\n`;
  }
  if (fmt === "html") {
    return `<!DOCTYPE html>\n<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Export</title>\n<style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Poppins',system-ui,sans-serif;background:#0e0d11;color:#e5e5e5}</style>\n</head><body>\n${nodes.map(n=>`<!-- ${n.label} -->\n${(n.code||"").replace(/className=/g,"class=")}\n`).join("\n")}\n</body></html>`;
  }
  return nodes.map(n=>`<!-- ${n.label} -->\n${n.code||""}\n`).join("\n");
}

function cssToTw(n) {
  const c = ["rounded-xl","border","border-rose-900/20","p-4","bg-gray-900"];
  if (n.w) c.push(`w-[${n.w}px]`);
  if (n.h) c.push(`h-[${n.h}px]`);
  if (n.type==="component") c.push("flex","flex-col","gap-2");
  return c.join(" ");
}

export default function InfiniteStudio({ onBack, user }) {
  const [vp, setVp] = useState({ x: 0, y: 0, scale: 0.85 });
  const isPanningRef = useRef(false);
  const panStartRef = useRef({ mx:0,my:0,vx:0,vy:0 });
  const [spaceHeld, setSpaceHeld] = useState(false);

  const [nodes, setNodes] = useState(() => [
    { id:"w1", type:"frame", x:80, y:80, w:340, h:170, label:"Welcome to Infinite Studio", bg:C.nodeFrame, accent:C.accent,
      code:`<div style="padding:20px;background:linear-gradient(145deg,#1a1520,#1a0f14);border-radius:16px;border:1px solid rgba(225,73,109,0.2)">
  <h2 style="font-size:18px;font-weight:800;color:#fff;margin-bottom:8px;font-family:Syne,sans-serif">∞ Infinite Studio</h2>
  <p style="font-size:12px;color:#8c8780;line-height:1.6">Pan: Space+Drag · Zoom: Scroll · Connect: Drag port dots · Double-click: Edit label</p>
</div>` },
    { id:"w2", type:"api", x:470, y:80, w:240, h:130, label:"Live GitHub Stars", bg:C.nodeApi, accent:C.success,
      apiEndpoint:"https://api.github.com/repos/facebook/react", apiField:"stargazers_count" },
    { id:"w3", type:"component", x:80, y:290, w:340, h:220, label:"Launch Button", bg:C.nodeComp, accent:C.accent,
      code:`<div style="padding:24px;text-align:center">
  <button style="padding:14px 32px;background:linear-gradient(135deg,#942945,#e1496d);border:none;color:#fff;border-radius:14px;font-weight:700;font-size:16px;cursor:pointer;box-shadow:0 6px 28px rgba(225,73,109,0.45);font-family:Syne,sans-serif;letter-spacing:0.02em;transition:all 0.3s">🚀 Launch Studio</button>
  <p style="margin-top:10px;font-size:11px;color:#5c5650">Click to begin your design journey</p>
</div>` },
  ]);

  const [connections, setConnections] = useState([
    { id:"c1", fromId:"w1", toId:"w2" },
    { id:"c1b", fromId:"w1", toId:"w3" },
  ]);

  const [selectedId, setSelectedId] = useState(null);
  const [draggingId, setDraggingId] = useState(null);
  const dragNodeOffRef = useRef({ x:0,y:0 });
  const [connectingFrom, setConnectingFrom] = useState(null);
  const [connectMouse, setConnectMouse] = useState({ x:0,y:0 });
  const [resizingId, setResizingId] = useState(null);
  const resizeStartRef = useRef({ w:0,h:0,mx:0,my:0 });

  const [rightTab, setRightTab] = useState("props");
  const [devMode, setDevMode] = useState(false);
  const [snapGrid, setSnapGrid] = useState(true);
  const [showMinimap, setShowMinimap] = useState(true);

  const [aiPrompt, setAiPrompt] = useState("");
  const [aiGenerating, setAiGenerating] = useState(false);
  const [showAi, setShowAi] = useState(false);

  const [isRecording, setIsRecording] = useState(false);
  const [replayPlaying, setReplayPlaying] = useState(false);
  const recordedRef = useRef([]);
  const recStartRef = useRef(0);
  const [ghostPos, setGhostPos] = useState(null);

  const [peerCursors, setPeerCursors] = useState({});
  const channelRef = useRef(null);

  const [exportFmt, setExportFmt] = useState("react");
  const [exportCode, setExportCode] = useState("");
  const [copied, setCopied] = useState(false);

  const studioRef = useRef(null);

  const [activeCablePulses, setActiveCablePulses] = useState([]);

  // ── Reactive Pipeline Execution Engine ────────────────────────────────
  const triggerPipeline = (sourceId, val) => {
    setNodes(prevNodes => {
      let updated = [...prevNodes];
      const source = updated.find(n => n.id === sourceId);
      if (source) {
        if (source.type === "input") source.inputValue = val;
      }

      // Find outgoing cables
      const outConns = connections.filter(c => c.fromId === sourceId);
      
      // Animate cable pulses
      if (outConns.length > 0) {
        setActiveCablePulses(prev => [...prev, ...outConns.map(c => c.id)]);
        setTimeout(() => {
          setActiveCablePulses(prev => prev.filter(id => !outConns.some(c => c.id === id)));
        }, 1200);
      }

      outConns.forEach(conn => {
        const targetIndex = updated.findIndex(n => n.id === conn.toId);
        if (targetIndex !== -1) {
          const target = { ...updated[targetIndex] };
          if (target.type === "ai_text") {
            const transformFn = AI_TRANSFORMS[target.mode || "enhance"] || AI_TRANSFORMS.enhance;
            target.outValue = transformFn(val);
            // Cascade further down
            setTimeout(() => triggerPipeline(target.id, target.outValue), 200);
          } else if (target.type === "ai_image") {
            const hash = Math.abs((val || "").split("").reduce((a, b) => { a = (a << 5) - a + b.charCodeAt(0); return a & a; }, 0));
            target.imageUrl = IMAGE_PRESETS[hash % IMAGE_PRESETS.length];
            target.promptLabel = val;
          } else if (target.type === "output") {
            target.outValue = `[Timestamp ${new Date().toLocaleTimeString()}] Pipeline Payload:\n${val}`;
          } else if (target.type === "component" || target.type === "frame") {
            target.code = `<div style="padding:20px;background:#1a1520;border-radius:12px;border:1px solid #e1496d;color:#fff">
  <h3 style="color:#e1496d;font-size:14px;margin-bottom:8px">⚡ Pipeline Output</h3>
  <p style="font-size:13px;color:#e5e5e5">${val || "No data"}</p>
</div>`;
          }
          updated[targetIndex] = target;
        }
      });

      return updated;
    });
  };

  // Add preset AI Pipeline workflow
  const addAiPipelineWorkflow = () => {
    const cx = (-vp.x / vp.scale) + 60;
    const cy = (-vp.y / vp.scale) + 80;
    const idInput = uid(), idAi = uid(), idImg = uid(), idOut = uid();

    const nInput = { id: idInput, type: "input", x: cx, y: cy, w: 280, h: 170, label: "1. Prompt Input Box", bg: "#1a1322", accent: "#a855f7", inputValue: "Cyberpunk neon city floating in space" };
    const nAi = { id: idAi, type: "ai_text", x: cx + 320, y: cy, w: 320, h: 190, label: "2. AI Prompt Enhancer", bg: "#221320", accent: C.accent, mode: "enhance", outValue: AI_TRANSFORMS.enhance("Cyberpunk neon city floating in space") };
    const nImg = { id: idImg, type: "ai_image", x: cx + 670, y: cy - 20, w: 320, h: 260, label: "3. AI Image Generator", bg: "#131a22", accent: C.success, imageUrl: IMAGE_PRESETS[1], promptLabel: "Cyberpunk neon city floating in space" };
    const nOut = { id: idOut, type: "output", x: cx + 320, y: cy + 220, w: 320, h: 160, label: "4. Pipeline Inspector", bg: "#161616", accent: C.warning, outValue: "[System Connected] Workflow Cable Active!" };

    setNodes(prev => [...prev, nInput, nAi, nImg, nOut]);
    setConnections(prev => [
      ...prev,
      { id: uid(), fromId: idInput, toId: idAi },
      { id: uid(), fromId: idAi, toId: idImg },
      { id: uid(), fromId: idAi, toId: idOut },
    ]);
  };

  const canvasRef = useRef(null);

  const toCanvas = useCallback((sx,sy)=>({ x:(sx-vp.x)/vp.scale, y:(sy-vp.y)/vp.scale }), [vp]);
  const toScreen = useCallback((cx,cy)=>({ x:cx*vp.scale+vp.x, y:cy*vp.scale+vp.y }), [vp]);

  // ── Live API polling ─────────────────────────────────────────────────────
  useEffect(()=>{
    const poll = async()=>{
      for (const n of nodes.filter(n=>n.type==="api"&&n.apiEndpoint)) {
        try {
          const res = await fetch(n.apiEndpoint,{signal:AbortSignal.timeout(5000)});
          const data = await res.json();
          let val = data;
          if (n.apiField==="length"&&Array.isArray(data)) val=data.length;
          else if (n.apiField) val=data[n.apiField]??JSON.stringify(data).slice(0,80);
          else val=typeof data==="object"?JSON.stringify(data).slice(0,100):data;
          setNodes(p=>p.map(nd=>nd.id===n.id?{...nd,apiData:val,apiError:null}:nd));
        } catch(e) { setNodes(p=>p.map(nd=>nd.id===n.id?{...nd,apiError:e.message}:nd)); }
      }
    };
    poll(); const id=setInterval(poll,8000); return()=>clearInterval(id);
  },[nodes.filter(n=>n.type==="api").map(n=>n.id+n.apiEndpoint).join(",")]);

  // ── BroadcastChannel ─────────────────────────────────────────────────────
  useEffect(()=>{
    try {
      const ch=new BroadcastChannel("creatify_studio");
      channelRef.current=ch;
      ch.onmessage=e=>{
        const d=e.data;
        if(d.type==="CURSOR"&&d.id!==SESSION_ID) setPeerCursors(p=>({...p,[d.id]:{pos:d.pos,name:d.name||"Peer",ts:Date.now()}}));
      };
      return()=>ch.close();
    }catch{}
  },[]);

  useEffect(()=>{
    const id=setInterval(()=>{const now=Date.now();setPeerCursors(p=>{const c={};Object.entries(p).forEach(([k,v])=>{if(now-v.ts<5000)c[k]=v});return c})},2000);
    return()=>clearInterval(id);
  },[]);

  // ── Keyboard ─────────────────────────────────────────────────────────────
  useEffect(()=>{
    const down=e=>{
      if(e.code==="Space"&&e.target.tagName!=="INPUT"&&e.target.tagName!=="TEXTAREA"){e.preventDefault();setSpaceHeld(true)}
      if((e.key==="Delete"||e.key==="Backspace")&&selectedId&&e.target.tagName!=="INPUT"&&e.target.tagName!=="TEXTAREA"){
        setNodes(p=>p.filter(n=>n.id!==selectedId));
        setConnections(p=>p.filter(c=>c.fromId!==selectedId&&c.toId!==selectedId));
        setSelectedId(null);
      }
      if(e.ctrlKey&&e.key==="d"&&selectedId){e.preventDefault();duplicateNode(selectedId)}
    };
    const up=e=>{if(e.code==="Space")setSpaceHeld(false)};
    window.addEventListener("keydown",down); window.addEventListener("keyup",up);
    return()=>{window.removeEventListener("keydown",down);window.removeEventListener("keyup",up)};
  },[selectedId]);

  // ── Mouse ────────────────────────────────────────────────────────────────
  const onCanvasDown=e=>{
    if(spaceHeld||e.button===1||e.altKey){e.preventDefault();isPanningRef.current=true;panStartRef.current={mx:e.clientX,my:e.clientY,vx:vp.x,vy:vp.y};return}
    if(e.target===canvasRef.current){setSelectedId(null);setConnectingFrom(null)}
  };

  const onCanvasMove=e=>{
    const rect=studioRef.current?.getBoundingClientRect();
    const sx=e.clientX-(rect?.left||0), sy=e.clientY-(rect?.top||0);
    try{channelRef.current?.postMessage({type:"CURSOR",id:SESSION_ID,pos:{x:sx,y:sy},name:user?.name||"You"})}catch{}
    if(isRecording) recordedRef.current.push({t:Date.now()-recStartRef.current,x:sx,y:sy});
    if(isPanningRef.current){setVp(v=>({...v,x:panStartRef.current.vx+e.clientX-panStartRef.current.mx,y:panStartRef.current.vy+e.clientY-panStartRef.current.my}))}
    if(draggingId){const cp=toCanvas(e.clientX,e.clientY);let nx=cp.x-dragNodeOffRef.current.x,ny=cp.y-dragNodeOffRef.current.y;if(snapGrid){nx=snap(nx);ny=snap(ny)}setNodes(p=>p.map(n=>n.id===draggingId?{...n,x:nx,y:ny}:n))}
    if(resizingId){const dx=(e.clientX-resizeStartRef.current.mx)/vp.scale, dy=(e.clientY-resizeStartRef.current.my)/vp.scale;setNodes(p=>p.map(n=>n.id===resizingId?{...n,w:Math.max(120,resizeStartRef.current.w+dx),h:Math.max(60,resizeStartRef.current.h+dy)}:n))}
    if(connectingFrom)setConnectMouse({x:e.clientX,y:e.clientY});
  };

  const onCanvasUp=()=>{isPanningRef.current=false;setDraggingId(null);setResizingId(null)};

  const onWheel=e=>{e.preventDefault();const rect=studioRef.current.getBoundingClientRect();const mx=e.clientX-rect.left,my=e.clientY-rect.top;const d=e.deltaY>0?0.92:1.08;setVp(v=>{const ns=clamp(v.scale*d,0.1,6);const r=ns/v.scale;return{scale:ns,x:mx-(mx-v.x)*r,y:my-(my-v.y)*r}})};

  const onNodeDown=(e,id)=>{if(e.button!==0)return;e.stopPropagation();setSelectedId(id);const cp=toCanvas(e.clientX,e.clientY);const n=nodes.find(nd=>nd.id===id);if(!n)return;dragNodeOffRef.current={x:cp.x-n.x,y:cp.y-n.y};setDraggingId(id)};
  const onPortDown=(e,id)=>{e.stopPropagation();e.preventDefault();setConnectingFrom({nodeId:id});setConnectMouse({x:e.clientX,y:e.clientY})};
  const onPortUp=(e,toId)=>{e.stopPropagation();if(connectingFrom&&connectingFrom.nodeId!==toId){setConnections(p=>[...p,{id:uid(),fromId:connectingFrom.nodeId,toId}])}setConnectingFrom(null)};
  const onResizeDown=(e,id)=>{e.stopPropagation();const n=nodes.find(nd=>nd.id===id);if(!n)return;resizeStartRef.current={w:n.w,h:n.h,mx:e.clientX,my:e.clientY};setResizingId(id)};

  const addNode=t=>{const cx=(-vp.x/vp.scale)+160+Math.random()*80,cy=(-vp.y/vp.scale)+120+Math.random()*80;const defs={
  frame:{w:320,h:200,label:"Frame",bg:C.nodeFrame,accent:C.accent,code:`<div style="padding:20px;background:#1a1520;border-radius:12px">Content</div>`},
  text:{w:280,h:80,label:"Text",bg:C.nodeFrame,accent:C.muted,code:`<p style="color:#e5e5e5;font-size:14px">Text node</p>`},
  component:{w:320,h:200,label:"Component",bg:C.nodeComp,accent:C.accent,code:`<button style="padding:10px 24px;background:linear-gradient(135deg,#942945,#e1496d);border:none;color:#fff;border-radius:10px;font-weight:600;cursor:pointer">Button</button>`},
  api:{w:220,h:120,label:"API Data",bg:C.nodeApi,accent:C.success,apiEndpoint:"https://jsonplaceholder.typicode.com/todos/1",apiField:"title"},
  image:{w:300,h:200,label:"Image",bg:"#1a1a1a",accent:C.accent},
  input:{w:300,h:170,label:"User Input Box",bg:"#1a1322",accent:"#a855f7",inputValue:"Cyberpunk neon city floating in space, 8k"},
  ai_text:{w:320,h:190,label:"AI Prompt Transformer",bg:"#221320",accent:C.accent,mode:"enhance",outValue:"Masterpiece 8k 3D render of Cyberpunk neon city, cinematic lighting"},
  ai_image:{w:320,h:260,label:"AI Image Generator",bg:"#131a22",accent:C.success,imageUrl:IMAGE_PRESETS[0]},
  output:{w:300,h:160,label:"Pipeline Inspector",bg:"#161616",accent:C.warning,outValue:"[System Active] Awaiting data cable trigger..."}
};const d=defs[t]||defs.frame;const id=uid();const newNode={id,type:t,x:snapGrid?snap(cx):cx,y:snapGrid?snap(cy):cy,...d};setNodes(p=>[...p,newNode]);setSelectedId(id);if(t==="input")triggerPipeline(id,newNode.inputValue);};
  const deleteNode=id=>{setNodes(p=>p.filter(n=>n.id!==id));setConnections(p=>p.filter(c=>c.fromId!==id&&c.toId!==id));if(selectedId===id)setSelectedId(null)};
  const updateNode=(id,patch)=>setNodes(p=>p.map(n=>n.id===id?{...n,...patch}:n));
  const duplicateNode=id=>{const s=nodes.find(n=>n.id===id);if(!s)return;const nid=uid();setNodes(p=>[...p,{...s,id:nid,x:s.x+30,y:s.y+30,label:(s.label||"")+" copy"}]);setSelectedId(nid)};

  // ── AI ────────────────────────────────────────────────────────────────────
  const handleAi=()=>{setAiGenerating(true);const p=aiPrompt.toLowerCase();const keys=Object.keys(AI_TEMPLATES);const match=keys.find(k=>p.includes(k))||(p.includes("dash")?"dashboard":p.includes("nav")?"navbar":p.includes("hero")?"hero":p.includes("card")?"card":p.includes("board")||p.includes("kanban")?"kanban":p.includes("form")||p.includes("contact")?"form":"pricing");
  setTimeout(()=>{const cx=(-vp.x/vp.scale)+40,cy=(-vp.y/vp.scale)+40;const t=AI_TEMPLATES[match](cx,cy);setNodes(prev=>[...prev,...t.nodes]);const nns=t.nodes;if(nns.length>1)setConnections(prev=>[...prev,...nns.slice(0,-1).map((n,i)=>({id:uid(),fromId:n.id,toId:nns[i+1].id}))]);setAiGenerating(false);setAiPrompt("");setShowAi(false)},1000)};

  // ── Ghost ────────────────────────────────────────────────────────────────
  const startRec=()=>{recordedRef.current=[];recStartRef.current=Date.now();setIsRecording(true)};
  const stopRec=()=>setIsRecording(false);
  const playReplay=()=>{const evs=[...recordedRef.current];if(!evs.length)return;setReplayPlaying(true);evs.forEach((ev,i)=>{setTimeout(()=>{setGhostPos({x:ev.x,y:ev.y});if(i===evs.length-1){setReplayPlaying(false);setGhostPos(null)}},ev.t)})};

  const devDists=useMemo(()=>{if(!devMode||!selectedId)return[];const s=nodes.find(n=>n.id===selectedId);if(!s)return[];return nodes.filter(n=>n.id!==selectedId).map(n=>({id:n.id,label:n.label,dx:Math.round(Math.abs((s.x+s.w/2)-(n.x+n.w/2))),dy:Math.round(Math.abs((s.y+s.h/2)-(n.y+n.h/2)))})).slice(0,4)},[devMode,selectedId,nodes]);

  const handleExport=()=>{setExportCode(generateExportCode(nodes,connections,exportFmt))};
  const copyCode=()=>{navigator.clipboard.writeText(exportCode).then(()=>{setCopied(true);setTimeout(()=>setCopied(false),2000)})};
  const downloadCode=()=>{const ext=exportFmt==="html"?"html":"tsx";const b=new Blob([exportCode],{type:"text/plain"});const u=URL.createObjectURL(b);const a=document.createElement("a");a.href=u;a.download=`studio-export.${ext}`;a.click();URL.revokeObjectURL(u)};

  const getPortOut=(id)=>{const n=nodes.find(nd=>nd.id===id);if(!n)return{x:0,y:0};return toScreen(n.x+n.w,n.y+n.h/2)};
  const getPortIn=(id)=>{const n=nodes.find(nd=>nd.id===id);if(!n)return{x:0,y:0};return toScreen(n.x,n.y+n.h/2)};

  const sel = nodes.find(n=>n.id===selectedId);

  // ── Minimap ──────────────────────────────────────────────────────────────
  const minimapW=180, minimapH=120;
  const mmBounds = useMemo(()=>{if(!nodes.length)return{minX:0,minY:0,maxX:1000,maxY:600};let minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity;nodes.forEach(n=>{minX=Math.min(minX,n.x);minY=Math.min(minY,n.y);maxX=Math.max(maxX,n.x+n.w);maxY=Math.max(maxY,n.y+n.h)});const pad=100;return{minX:minX-pad,minY:minY-pad,maxX:maxX+pad,maxY:maxY+pad}},[nodes]);
  const mmScale=Math.min(minimapW/(mmBounds.maxX-mmBounds.minX||1),minimapH/(mmBounds.maxY-mmBounds.minY||1));

  return (
    <div ref={studioRef} style={{ width:"100vw",height:"100vh",background:C.bg,color:C.text,fontFamily:"'Instrument Sans','Poppins',sans-serif",display:"flex",flexDirection:"column",overflow:"hidden",userSelect:"none",position:"relative" }}>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&family=Instrument+Sans:wght@400;500;600&family=Syne:wght@700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet"/>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:${C.bg}}::-webkit-scrollbar-thumb{background:${C.border};border-radius:3px}
        .sb{background:rgba(225,73,109,0.07);border:1px solid ${C.border};color:${C.text};padding:5px 11px;border-radius:7px;cursor:pointer;font-size:11px;font-family:'Poppins',sans-serif;font-weight:500;display:inline-flex;align-items:center;gap:6px;transition:all 0.15s;white-space:nowrap}
        .sb:hover{background:rgba(225,73,109,0.18);color:${C.accentLight};border-color:${C.borderHi}}
        .sb.active{background:rgba(225,73,109,0.25);color:${C.accentLight};border-color:${C.accent}}
        .sb.primary{background:linear-gradient(135deg,${C.accentDark},${C.accent});border:none;color:#fff;font-weight:600;box-shadow:0 3px 12px rgba(225,73,109,0.35)}
        .sb.primary:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(225,73,109,0.5)}
        .sb.danger{color:${C.danger};border-color:rgba(239,68,68,0.25);background:rgba(239,68,68,0.06)}
        .sb.danger:hover{background:rgba(239,68,68,0.18);border-color:${C.danger}}
        .sb.green{background:rgba(34,211,168,0.08);border-color:rgba(34,211,168,0.3);color:${C.success}}
        .si{background:rgba(255,255,255,0.04);border:1px solid ${C.border};border-radius:7px;color:${C.text};padding:7px 10px;font-size:12px;outline:none;width:100%;font-family:inherit;transition:border-color 0.15s}
        .si:focus{border-color:${C.borderHi};background:rgba(225,73,109,0.05)}
        .ca{background:#0d0b14;border:1px solid ${C.border};border-radius:8px;color:${C.accentLight};padding:12px;font-family:'JetBrains Mono',monospace;font-size:11px;line-height:1.7;resize:none;outline:none;width:100%}
        .nc{position:absolute;border-radius:14px;border:2px solid transparent;cursor:grab;transition:box-shadow 0.15s}
        .nc:hover{box-shadow:0 0 0 1px ${C.borderHi}}
        .nc.sel{border-color:${C.accent}!important;box-shadow:0 0 0 3px rgba(225,73,109,0.2),0 8px 32px rgba(225,73,109,0.25)!important}
        .nc.dm{filter:brightness(0.7)}.nc.dm.sel{filter:brightness(1);border-color:${C.success}!important;box-shadow:0 0 0 3px rgba(34,211,168,0.2)!important}
        .port{width:12px;height:12px;border-radius:50%;background:${C.accent};border:2px solid ${C.bg};position:absolute;cursor:crosshair;transition:transform 0.12s,background 0.12s;z-index:5}
        .port:hover{transform:scale(1.6);background:${C.accentLight}}
        .port.r{right:-6px;top:50%;transform:translateY(-50%)}.port.l{left:-6px;top:50%;transform:translateY(-50%)}
        .port.r:hover{transform:translateY(-50%) scale(1.6)}.port.l:hover{transform:translateY(-50%) scale(1.6)}
        .rh{width:14px;height:14px;position:absolute;right:-3px;bottom:-3px;cursor:nwse-resize;background:${C.accent};border-radius:3px;border:2px solid ${C.bg};z-index:6;transition:transform 0.12s}
        .rh:hover{transform:scale(1.3)}
        @keyframes pulse{0%{transform:scale(1);opacity:1}100%{transform:scale(2.5);opacity:0}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
        .grid-bg{background-image:radial-gradient(circle,rgba(225,73,109,0.08) 1px,transparent 1px);background-size:${GRID}px ${GRID}px}
      `}</style>

      {/* ── HEADER ─────────────────────────────────────────────────────── */}
      <div style={{ height:"48px",background:C.headerBg,borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",padding:"0 12px",gap:"8px",flexShrink:0,zIndex:100,backdropFilter:"blur(12px)" }}>
        <button className="sb danger" onClick={onBack} style={{ padding:"4px 10px",fontSize:"11px" }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M5 12l7 7M5 12l7-7"/></svg>Back
        </button>
        <div style={{ width:"1px",height:"16px",background:C.border }}/>
        <div style={{ display:"flex",alignItems:"center",gap:"7px" }}>
          <div style={{ width:"26px",height:"26px",borderRadius:"8px",background:`linear-gradient(135deg,${C.accentDark},${C.accent})`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:"14px",color:"#fff",fontFamily:"Syne,sans-serif" }}>∞</div>
          <span style={{ fontFamily:"Syne,sans-serif",fontWeight:800,fontSize:"14px",color:"#fff" }}>Infinite Studio</span>
          <span style={{ fontSize:"9px",background:"rgba(225,73,109,0.15)",border:`1px solid ${C.borderHi}`,color:C.accentLight,padding:"2px 7px",borderRadius:"20px",fontWeight:600 }}>BETA</span>
        </div>
        <div style={{ width:"1px",height:"16px",background:C.border }}/>
        <div style={{ display:"flex",gap:"3px",flexWrap:"nowrap" }}>
          {[["input","Input Box","✎"],["ai_text","AI Transform","⚡"],["ai_image","AI Image","🖼"],["component","Component","⬡"],["api","API","🌐"]].map(([t,l,i])=>(
            <button key={t} className="sb" onClick={()=>addNode(t)} style={{ padding:"4px 8px",fontSize:"10px" }}>{i} {l}</button>
          ))}
          <button className="sb primary" onClick={addAiPipelineWorkflow} style={{ padding:"4px 10px",fontSize:"10px",background:"linear-gradient(135deg,#a855f7,#e1496d)" }}>⚡ Pipeline</button>
        </div>
        <div style={{ flex:1 }}/>
        <button className="sb primary" onClick={()=>setShowAi(p=>!p)} style={{ gap:"5px",padding:"5px 14px" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>AI Generate
        </button>
        <button className={`sb${devMode?" active":""}`} onClick={()=>setDevMode(p=>!p)} style={{ padding:"4px 9px",color:devMode?C.success:undefined,borderColor:devMode?"rgba(34,211,168,0.5)":undefined }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>Dev
        </button>
        <button className={`sb${isRecording?" danger":replayPlaying?" green":""}`} onClick={()=>{if(isRecording)stopRec();else if(recordedRef.current.length>0&&!replayPlaying)playReplay();else startRec()}} style={{ padding:"4px 9px",fontSize:"10px" }}>
          {isRecording?"⏹ Stop":replayPlaying?"▶ Playing":recordedRef.current.length>0?"▶ Replay":"⏺ Rec"}
        </button>
        <div style={{ display:"flex",alignItems:"center",gap:"3px" }}>
          <label style={{ fontSize:"9px",color:C.dim,display:"flex",alignItems:"center",gap:"4px",cursor:"pointer" }}>
            <input type="checkbox" checked={snapGrid} onChange={e=>setSnapGrid(e.target.checked)} style={{ accentColor:C.accent,width:"12px",height:"12px" }}/> Snap
          </label>
        </div>
        <div style={{ width:"1px",height:"16px",background:C.border }}/>
        <div style={{ display:"flex",alignItems:"center",gap:"3px" }}>
          <button className="sb" onClick={()=>setVp(v=>({...v,scale:clamp(v.scale-0.1,0.1,6)}))} style={{ padding:"3px 7px" }}>−</button>
          <span style={{ fontSize:"10px",color:C.accent,minWidth:"38px",textAlign:"center" }}>{Math.round(vp.scale*100)}%</span>
          <button className="sb" onClick={()=>setVp(v=>({...v,scale:clamp(v.scale+0.1,0.1,6)}))} style={{ padding:"3px 7px" }}>+</button>
          <button className="sb" onClick={()=>setVp({x:0,y:0,scale:0.85})} style={{ padding:"3px 6px",fontSize:"10px" }}>Fit</button>
        </div>
      </div>

      {/* ── MAIN ──────────────────────────────────────────────────────── */}
      <div style={{ display:"flex",flex:1,overflow:"hidden",position:"relative" }}>

        {/* ── CANVAS ──────────────────────────────────────────────────── */}
        <div ref={canvasRef} className="grid-bg" style={{ flex:1,position:"relative",overflow:"hidden",cursor:spaceHeld||isPanningRef.current?"grabbing":connectingFrom?"crosshair":"default" }}
          onMouseDown={onCanvasDown} onMouseMove={onCanvasMove} onMouseUp={onCanvasUp} onWheel={onWheel} onContextMenu={e=>e.preventDefault()}>

          {/* Connections SVG */}
          <svg style={{ position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:5 }}>
            <defs>
              <marker id="ah" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                <polygon points="0 0,8 3,0 6" fill={devMode?C.success:C.accent}/>
              </marker>
            </defs>
            {connections.map(c=>{
              const f=getPortOut(c.fromId),t=getPortIn(c.toId);
              if(!f||!t)return null;
              const mx=(f.x+t.x)/2;
              const pathD = `M${f.x},${f.y} C${mx},${f.y} ${mx},${t.y} ${t.x},${t.y}`;
              const isPulsing = activeCablePulses.includes(c.id);
              return (
                <g key={c.id}>
                  <path d={pathD} fill="none" stroke={isPulsing ? C.accentLight : (devMode ? "rgba(34,211,168,0.45)" : "rgba(225,73,109,0.4)")} strokeWidth={isPulsing ? "2.5" : "1.5"} strokeDasharray={devMode ? "6,4" : undefined} markerEnd="url(#ah)"/>
                  {isPulsing && (
                    <circle r="4" fill={C.accentLight} style={{ filter: "drop-shadow(0 0 6px #e1496d)" }}>
                      <animateMotion path={pathD} dur="0.9s" repeatCount="1" />
                    </circle>
                  )}
                </g>
              );
            })}
            {connectingFrom&&(()=>{const f=getPortOut(connectingFrom.nodeId);const rect=studioRef.current?.getBoundingClientRect();const tx=connectMouse.x-(rect?.left||0),ty=connectMouse.y-(rect?.top||0);return<path d={`M${f.x},${f.y} C${(f.x+tx)/2},${f.y} ${(f.x+tx)/2},${ty} ${tx},${ty}`} fill="none" stroke={C.accent} strokeWidth="1.5" strokeDasharray="5,3" opacity="0.7"/>})()}
            {devMode&&sel&&devDists.map(d=>{const s1=toScreen(sel.x+sel.w/2,sel.y+sel.h/2);const n2=nodes.find(n=>n.id===d.id);if(!n2)return null;const s2=toScreen(n2.x+n2.w/2,n2.y+n2.h/2);return<g key={d.id}><line x1={s1.x} y1={s1.y} x2={s2.x} y2={s2.y} stroke={C.success} strokeWidth="1" strokeDasharray="4,3" opacity="0.5"/><text x={(s1.x+s2.x)/2} y={(s1.y+s2.y)/2-5} fill={C.success} fontSize="9" textAnchor="middle">{d.dx}px</text></g>})}
          </svg>

          {/* Nodes */}
          <div style={{ position:"absolute",transform:`translate(${vp.x}px,${vp.y}px) scale(${vp.scale})`,transformOrigin:"0 0",zIndex:10 }}>
            {nodes.map(node=>{
              const isSel=selectedId===node.id;
              return (
                <div key={node.id} className={`nc${isSel?" sel":""}${devMode?" dm":""}`}
                  style={{ left:node.x,top:node.y,width:node.w,height:node.h,background:node.bg||C.nodeFrame }}
                  onMouseDown={e=>onNodeDown(e,node.id)}>
                  {/* Header */}
                  <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"6px 10px 5px",borderBottom:`1px solid ${node.accent||C.accent}18`,flexShrink:0 }}>
                    <div style={{ display:"flex",alignItems:"center",gap:"5px" }}>
                      <div style={{ width:"6px",height:"6px",borderRadius:"50%",background:node.accent||C.accent,boxShadow:`0 0 6px ${node.accent||C.accent}` }}/>
                      <span style={{ fontSize:"9px",fontWeight:700,color:node.accent||C.accentLight,letterSpacing:"0.08em" }}>
                        {node.type==="api"?"⚡ API":node.type==="component"?"⬡ COMPONENT":node.type==="input"?"✎ INPUT":node.type==="ai_text"?"⚡ AI TRANSFORM":node.type==="ai_image"?"🖼 AI IMAGE":node.type==="output"?"⊕ INSPECTOR":"▭ FRAME"}
                      </span>
                    </div>
                    <div style={{ display:"flex",alignItems:"center",gap:"4px" }}>
                      <span style={{ fontSize:"10px",color:C.dim,maxWidth:node.w-120,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{node.label}</span>
                      <button onClick={e=>{e.stopPropagation();deleteNode(node.id)}} style={{ background:"none",border:"none",color:"#444",cursor:"pointer",fontSize:"9px",lineHeight:1 }}>✕</button>
                    </div>
                  </div>
                  {/* Body */}
                  <div style={{ padding:"8px",overflow:"hidden",flex:1,height:`calc(100% - 30px)`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center" }}>
                    {node.type==="api"&&(
                      <div style={{ textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:"4px" }}>
                        {node.apiError?<span style={{ color:C.danger,fontSize:"10px" }}>⚠ {node.apiError.slice(0,30)}</span>
                        :node.apiData!=null?(
                          <>
                            <div style={{ fontSize:node.h>100?30:22,fontWeight:800,color:node.accent||C.success,fontFamily:"Syne,sans-serif",letterSpacing:"-0.03em" }}>{String(node.apiData).length>10?String(node.apiData).slice(0,10):node.apiData}</div>
                            <div style={{ fontSize:"8px",color:C.dim,fontFamily:"JetBrains Mono,monospace",background:"rgba(255,255,255,0.03)",padding:"2px 6px",borderRadius:"4px",maxWidth:node.w-30,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{node.apiEndpoint?.split("/").slice(-2).join("/")}</div>
                            <div style={{ fontSize:"8px",color:C.success,display:"flex",alignItems:"center",gap:"4px" }}>
                              <span style={{ width:"5px",height:"5px",borderRadius:"50%",background:C.success,display:"inline-block",boxShadow:`0 0 6px ${C.success}` }}/>LIVE
                            </div>
                          </>
                        ):<div style={{ width:"16px",height:"16px",border:`2px solid rgba(34,211,168,0.3)`,borderTopColor:C.success,borderRadius:"50%",animation:"spin 0.8s linear infinite" }}/>}
                      </div>
                    )}
                    {(node.type==="frame"||node.type==="text")&&(
                      <div style={{ fontSize:"11px",color:"#555",textAlign:"center",opacity:0.6 }}>{node.label}</div>
                    )}
                    {node.type==="component"&&(
                      <div style={{ fontSize:"9px",color:C.accentLight,fontFamily:"JetBrains Mono,monospace",opacity:0.5,textAlign:"center",lineHeight:1.5,overflow:"hidden",maxWidth:node.w-24 }}>
                        {(node.code||"").split("\n").slice(0,5).map((l,i)=><div key={i} style={{ overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{l}</div>)}
                      </div>
                    )}
                    {node.type==="image"&&(
                      <div style={{ textAlign:"center",color:"#444",fontSize:"10px" }}><div style={{ fontSize:"24px",marginBottom:"4px",opacity:0.4 }}>🖼</div>Image Node</div>
                    )}
                    {node.type==="input"&&(
                      <div style={{ width:"100%",height:"100%",display:"flex",flexDirection:"column",gap:"6px" }} onMouseDown={e=>e.stopPropagation()}>
                        <div style={{ fontSize:"9px",color:C.muted,display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                          <span>TYPE CANVAS PROMPT</span>
                          <span style={{ color:"#a855f7",fontSize:"8px",fontWeight:600 }}>LIVE CABLE</span>
                        </div>
                        <textarea className="ca" style={{ flex:1,minHeight:"80px",background:"rgba(168,85,247,0.06)",borderColor:"rgba(168,85,247,0.2)",fontSize:"11px",color:"#fff" }}
                          value={node.inputValue||""}
                          onChange={e=>{
                            const val=e.target.value;
                            updateNode(node.id,{inputValue:val});
                            triggerPipeline(node.id,val);
                          }}
                          placeholder="Type input prompt to trigger connected nodes..."
                        />
                      </div>
                    )}
                    {node.type==="ai_text"&&(
                      <div style={{ width:"100%",height:"100%",display:"flex",flexDirection:"column",gap:"6px" }} onMouseDown={e=>e.stopPropagation()}>
                        <div style={{ display:"flex",gap:"4px",marginBottom:"2px" }}>
                          {["enhance","summary","code","translate"].map(m=>(
                            <button key={m} onClick={()=>{
                              updateNode(node.id,{mode:m});
                              const inputNode = nodes.find(n=>connections.some(c=>c.toId===node.id&&c.fromId===n.id));
                              const srcVal = inputNode?.inputValue || inputNode?.outValue || "Cyberpunk city";
                              const tr = AI_TRANSFORMS[m](srcVal);
                              updateNode(node.id,{outValue:tr});
                              triggerPipeline(node.id,tr);
                            }} style={{ flex:1,padding:"2px 4px",fontSize:"8px",borderRadius:"4px",border:`1px solid ${node.mode===m?C.accent:C.border}`,background:node.mode===m?"rgba(225,73,109,0.2)":"rgba(255,255,255,0.03)",color:node.mode===m?C.accentLight:C.dim,cursor:"pointer" }}>
                              {m.toUpperCase()}
                            </button>
                          ))}
                        </div>
                        <div style={{ flex:1,background:"rgba(225,73,109,0.04)",border:`1px solid ${C.border}`,borderRadius:"6px",padding:"8px",fontFamily:"JetBrains Mono,monospace",fontSize:"10px",color:"#fff",overflowY:"auto",lineHeight:1.5 }}>
                          {node.outValue || <span style={{ color:C.dim }}>Awaiting input cable trigger...</span>}
                        </div>
                      </div>
                    )}
                    {node.type==="ai_image"&&(
                      <div style={{ width:"100%",height:"100%",position:"relative",borderRadius:"8px",overflow:"hidden",background:"#0a080d",display:"flex",alignItems:"center",justifyContent:"center" }}>
                        <img src={node.imageUrl || IMAGE_PRESETS[0]} alt="AI Synthesized" style={{ width:"100%",height:"100%",objectFit:"cover",opacity:0.85 }} />
                        <div style={{ position:"absolute",inset:0,background:"linear-gradient(180deg,transparent 40%,rgba(0,0,0,0.85) 100%)",pointerEvents:"none" }}/>
                        <div style={{ position:"absolute",bottom:8,left:8,right:8,display:"flex",alignItems:"center",justifyContent:"space-between",zIndex:2 }}>
                          <span style={{ fontSize:"9px",color:"#fff",fontWeight:600,fontFamily:"Syne,sans-serif",background:"rgba(0,0,0,0.6)",padding:"2px 8px",borderRadius:"10px",backdropFilter:"blur(4px)",maxWidth:"80%",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>
                            {node.promptLabel || "AI Synthesized Canvas"}
                          </span>
                          <span style={{ fontSize:"8px",color:C.success,fontWeight:700,background:"rgba(34,211,168,0.15)",padding:"2px 6px",borderRadius:"10px" }}>LIVE</span>
                        </div>
                      </div>
                    )}
                    {node.type==="output"&&(
                      <div style={{ width:"100%",height:"100%",display:"flex",flexDirection:"column",gap:"4px" }}>
                        <div style={{ display:"flex",alignItems:"center",gap:"6px",fontSize:"9px",color:C.warning,fontWeight:700 }}>
                          <span style={{ width:"6px",height:"6px",borderRadius:"50%",background:C.warning,boxShadow:`0 0 6px ${C.warning}` }}/>PAYLOAD LOG
                        </div>
                        <div style={{ flex:1,background:"#0a0a0a",border:`1px solid rgba(245,158,11,0.2)`,borderRadius:"6px",padding:"6px 8px",fontFamily:"JetBrains Mono,monospace",fontSize:"9.5px",color:"#f59e0b",overflowY:"auto",lineHeight:1.6,whiteSpace:"pre-wrap" }}>
                          {node.outValue || "[Idle] Connect wires to inspect live pipeline data"}
                        </div>
                      </div>
                    )}
                    {devMode&&isSel&&(
                      <div style={{ position:"absolute",inset:0,background:"rgba(34,211,168,0.04)",borderRadius:"12px",display:"flex",alignItems:"flex-end",padding:"8px",pointerEvents:"none" }}>
                        <div style={{ fontSize:"8px",color:C.success,fontFamily:"JetBrains Mono,monospace",lineHeight:1.8 }}>
                          <div>{node.w}×{node.h}px at ({Math.round(node.x)},{Math.round(node.y)})</div>
                          <div style={{ color:C.accent }}>{cssToTw(node).split(" ").slice(0,4).join(" ")}</div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="port r" onMouseDown={e=>onPortDown(e,node.id)} onMouseUp={e=>onPortUp(e,node.id)}/>
                  <div className="port l" onMouseUp={e=>onPortUp(e,node.id)}/>
                  {isSel&&<div className="rh" onMouseDown={e=>onResizeDown(e,node.id)}/>}
                </div>
              );
            })}
          </div>

          {/* Peers */}
          {Object.entries(peerCursors).map(([id,{pos,name}])=>(
            <div key={id} style={{ position:"absolute",left:pos.x,top:pos.y,pointerEvents:"none",zIndex:90 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill={C.accent}><path d="M5 3l14 7-7 1.5 2 6.5L5 3z"/></svg>
              <div style={{ background:C.accent,color:"#fff",fontSize:"8px",padding:"1px 6px",borderRadius:"10px",whiteSpace:"nowrap",fontWeight:600 }}>{name}</div>
            </div>
          ))}
          {ghostPos&&(
            <div style={{ position:"absolute",left:ghostPos.x,top:ghostPos.y,pointerEvents:"none",zIndex:95,transition:"left 0.05s,top 0.05s" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="rgba(225,73,109,0.7)"><path d="M5 3l14 7-7 1.5 2 6.5L5 3z"/></svg>
              <div style={{ background:"rgba(225,73,109,0.85)",color:"#fff",fontSize:"8px",padding:"1px 6px",borderRadius:"10px",whiteSpace:"nowrap",fontWeight:600 }}>👻 Ghost</div>
            </div>
          )}

          {/* Recording indicator */}
          {isRecording&&<div style={{ position:"absolute",top:10,left:"50%",transform:"translateX(-50%)",background:"rgba(239,68,68,0.9)",color:"#fff",fontSize:"10px",padding:"3px 12px",borderRadius:"20px",fontWeight:600,display:"flex",alignItems:"center",gap:"6px",zIndex:90 }}><span style={{ width:"6px",height:"6px",borderRadius:"50%",background:"#fff",display:"inline-block",animation:"pulse 1s ease infinite" }}/>REC</div>}

          {/* Minimap */}
          {showMinimap&&nodes.length>0&&(
            <div style={{ position:"absolute",bottom:10,right:312,width:minimapW,height:minimapH,background:"rgba(14,13,17,0.9)",border:`1px solid ${C.border}`,borderRadius:"10px",zIndex:80,overflow:"hidden",backdropFilter:"blur(6px)" }}
              onClick={e=>{const rect=e.currentTarget.getBoundingClientRect();const mx=(e.clientX-rect.left)/mmScale+mmBounds.minX,my=(e.clientY-rect.top)/mmScale+mmBounds.minY;setVp(v=>({...v,x:-mx*v.scale+window.innerWidth/2,y:-my*v.scale+window.innerHeight/2}))}}>
              <svg width={minimapW} height={minimapH}>
                {nodes.map(n=><rect key={n.id} x={(n.x-mmBounds.minX)*mmScale} y={(n.y-mmBounds.minY)*mmScale} width={n.w*mmScale} height={n.h*mmScale} rx="2" fill={selectedId===n.id?C.accent:"rgba(225,73,109,0.3)"} stroke={selectedId===n.id?C.accent:"none"} strokeWidth="1"/>)}
                {connections.map(c=>{const f=nodes.find(n=>n.id===c.fromId),t=nodes.find(n=>n.id===c.toId);if(!f||!t)return null;return<line key={c.id} x1={(f.x+f.w-mmBounds.minX)*mmScale} y1={(f.y+f.h/2-mmBounds.minY)*mmScale} x2={(t.x-mmBounds.minX)*mmScale} y2={(t.y+t.h/2-mmBounds.minY)*mmScale} stroke="rgba(225,73,109,0.2)" strokeWidth="1"/>})}
                <rect x={(-vp.x/vp.scale-mmBounds.minX)*mmScale} y={(-vp.y/vp.scale-mmBounds.minY)*mmScale} width={(window.innerWidth/vp.scale)*mmScale} height={(window.innerHeight/vp.scale)*mmScale} fill="none" stroke={C.accent} strokeWidth="1" strokeDasharray="3,2" rx="2"/>
              </svg>
            </div>
          )}
        </div>

        {/* ── RIGHT PANEL ──────────────────────────────────────────────── */}
        <div style={{ width:"298px",minWidth:"298px",background:C.panel,borderLeft:`1px solid ${C.border}`,display:"flex",flexDirection:"column",zIndex:20 }}>
          <div style={{ display:"flex",borderBottom:`1px solid ${C.border}`,background:"rgba(0,0,0,0.3)",flexShrink:0 }}>
            {[["props","Props"],["code","Code"],["api","API"],["dev","Dev"],["export","Export"]].map(([k,l])=>(
              <button key={k} onClick={()=>setRightTab(k)} style={{ flex:1,padding:"8px 2px",background:"none",border:"none",borderBottom:`2px solid ${rightTab===k?C.accent:"transparent"}`,color:rightTab===k?C.accentLight:C.dim,fontSize:"10px",fontWeight:600,cursor:"pointer",transition:"all 0.15s",letterSpacing:"0.04em" }}>{l}</button>
            ))}
          </div>
          <div style={{ flex:1,overflowY:"auto",padding:"12px",display:"flex",flexDirection:"column",gap:"12px",animation:"fadeIn 0.15s ease" }}>

            {/* PROPS */}
            {rightTab==="props"&&sel&&(
              <>
                <div style={{ fontSize:"10px",color:C.accent,fontWeight:700,letterSpacing:"0.1em" }}>NODE PROPERTIES</div>
                <div style={{ display:"flex",flexDirection:"column",gap:"8px" }}>
                  <div><label style={{ fontSize:"10px",color:C.muted,display:"block",marginBottom:"4px" }}>Label</label><input className="si" value={sel.label||""} onChange={e=>updateNode(selectedId,{label:e.target.value})}/></div>
                  <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"6px" }}>
                    <div><label style={{ fontSize:"10px",color:C.muted,display:"block",marginBottom:"4px" }}>Width</label><input className="si" type="number" value={Math.round(sel.w)} onChange={e=>updateNode(selectedId,{w:parseInt(e.target.value)||100})}/></div>
                    <div><label style={{ fontSize:"10px",color:C.muted,display:"block",marginBottom:"4px" }}>Height</label><input className="si" type="number" value={Math.round(sel.h)} onChange={e=>updateNode(selectedId,{h:parseInt(e.target.value)||60})}/></div>
                  </div>
                  <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"6px" }}>
                    <div><label style={{ fontSize:"10px",color:C.muted,display:"block",marginBottom:"4px" }}>X</label><input className="si" type="number" value={Math.round(sel.x)} onChange={e=>updateNode(selectedId,{x:parseInt(e.target.value)||0})}/></div>
                    <div><label style={{ fontSize:"10px",color:C.muted,display:"block",marginBottom:"4px" }}>Y</label><input className="si" type="number" value={Math.round(sel.y)} onChange={e=>updateNode(selectedId,{y:parseInt(e.target.value)||0})}/></div>
                  </div>
                  <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"6px" }}>
                    <div><label style={{ fontSize:"10px",color:C.muted,display:"block",marginBottom:"4px" }}>Background</label><input type="color" value={sel.bg||C.nodeFrame} onChange={e=>updateNode(selectedId,{bg:e.target.value})} style={{ width:"100%",height:"30px",background:"none",border:`1px solid ${C.border}`,borderRadius:"6px",cursor:"pointer" }}/></div>
                    <div><label style={{ fontSize:"10px",color:C.muted,display:"block",marginBottom:"4px" }}>Accent</label><input type="color" value={sel.accent||C.accent} onChange={e=>updateNode(selectedId,{accent:e.target.value})} style={{ width:"100%",height:"30px",background:"none",border:`1px solid ${C.border}`,borderRadius:"6px",cursor:"pointer" }}/></div>
                  </div>
                </div>
                <div style={{ height:"1px",background:C.border }}/>
                <div style={{ display:"flex",gap:"5px" }}>
                  <button className="sb" onClick={()=>duplicateNode(selectedId)} style={{ flex:1,justifyContent:"center",fontSize:"10px" }}>⊕ Duplicate</button>
                  <button className="sb danger" onClick={()=>deleteNode(selectedId)} style={{ flex:1,justifyContent:"center",fontSize:"10px" }}>✕ Delete</button>
                </div>
                <div>
                  <div style={{ fontSize:"10px",color:C.dim,fontWeight:600,marginBottom:"6px" }}>CONNECTIONS ({connections.filter(c=>c.fromId===selectedId||c.toId===selectedId).length})</div>
                  {connections.filter(c=>c.fromId===selectedId||c.toId===selectedId).map(c=>(
                    <div key={c.id} style={{ display:"flex",justifyContent:"space-between",padding:"5px 8px",background:"rgba(225,73,109,0.06)",borderRadius:"6px",marginBottom:"4px",fontSize:"10px" }}>
                      <span style={{ color:C.accentLight }}>→ {nodes.find(n=>n.id===(c.fromId===selectedId?c.toId:c.fromId))?.label||"?"}</span>
                      <button onClick={()=>setConnections(p=>p.filter(cn=>cn.id!==c.id))} style={{ background:"none",border:"none",color:"#444",cursor:"pointer",fontSize:"9px" }}>✕</button>
                    </div>
                  ))}
                </div>
              </>
            )}
            {rightTab==="props"&&!sel&&<div style={{ textAlign:"center",color:"#444",fontSize:"11px",padding:"20px 0" }}><div style={{ fontSize:"24px",marginBottom:"6px",opacity:0.3 }}>⊡</div>Click a node to edit<br/><span style={{ fontSize:"10px" }}>or add from header</span></div>}

            {/* CODE */}
            {rightTab==="code"&&(
              <>
                <div style={{ fontSize:"10px",color:C.accent,fontWeight:700,letterSpacing:"0.1em" }}>CODE INSPECTOR</div>
                {sel?(<>
                  <div style={{ fontSize:"10px",color:C.dim }}>Editing: <span style={{ color:C.accentLight }}>{sel.label}</span></div>
                  <textarea className="ca" style={{ flex:1,minHeight:"280px" }} value={sel.code||""} onChange={e=>updateNode(selectedId,{code:e.target.value})} spellCheck={false}/>
                  <div style={{ display:"flex",gap:"5px" }}>
                    <button className="sb" onClick={()=>navigator.clipboard.writeText(sel.code||"")} style={{ flex:1,justifyContent:"center",fontSize:"10px" }}>Copy JSX</button>
                    <button className="sb" onClick={()=>navigator.clipboard.writeText(cssToTw(sel))} style={{ flex:1,justifyContent:"center",fontSize:"10px" }}>Copy TW</button>
                  </div>
                </>):(<div style={{ textAlign:"center",color:"#444",fontSize:"11px",padding:"20px 0" }}>Select a node to inspect</div>)}
              </>
            )}

            {/* API */}
            {rightTab==="api"&&(
              <>
                <div style={{ fontSize:"10px",color:C.accent,fontWeight:700,letterSpacing:"0.1em" }}>LIVE API BINDING</div>
                {sel?(<>
                  <div><label style={{ fontSize:"10px",color:C.muted,display:"block",marginBottom:"4px" }}>Endpoint URL</label><input className="si" value={sel.apiEndpoint||""} onChange={e=>updateNode(selectedId,{apiEndpoint:e.target.value,apiData:null,apiError:null})} placeholder="https://api.example.com/data"/></div>
                  <div><label style={{ fontSize:"10px",color:C.muted,display:"block",marginBottom:"4px" }}>Display Field</label><input className="si" value={sel.apiField||""} onChange={e=>updateNode(selectedId,{apiField:e.target.value})} placeholder="title, length, count..."/></div>
                  {sel.apiData!=null&&<div style={{ background:"rgba(34,211,168,0.06)",border:`1px solid rgba(34,211,168,0.2)`,borderRadius:"8px",padding:"10px" }}><div style={{ fontSize:"9px",color:C.success,fontWeight:600,marginBottom:"4px" }}>LIVE DATA</div><code style={{ fontSize:"11px",color:C.text,fontFamily:"JetBrains Mono,monospace",wordBreak:"break-all" }}>{String(sel.apiData).slice(0,150)}</code></div>}
                  <div style={{ fontSize:"10px",color:C.dim }}>
                    <div style={{ fontWeight:600,marginBottom:"4px" }}>QUICK APIS:</div>
                    {[["Users","https://jsonplaceholder.typicode.com/users","length"],["React Stars","https://api.github.com/repos/facebook/react","stargazers_count"],["Random Todo","https://jsonplaceholder.typicode.com/todos/1","title"]].map(([n,u,f])=>(
                      <div key={u} onClick={()=>updateNode(selectedId,{apiEndpoint:u,apiField:f,apiData:null})} style={{ padding:"5px 8px",background:"rgba(225,73,109,0.05)",borderRadius:"5px",cursor:"pointer",marginBottom:"4px" }} onMouseEnter={e=>e.currentTarget.style.background="rgba(225,73,109,0.12)"} onMouseLeave={e=>e.currentTarget.style.background="rgba(225,73,109,0.05)"}>
                        <div style={{ color:C.accentLight,marginBottom:"1px" }}>{n}</div>
                        <div style={{ color:"#444",fontSize:"9px",fontFamily:"JetBrains Mono,monospace" }}>{u.slice(0,42)}…</div>
                      </div>
                    ))}
                  </div>
                </>):(<div style={{ textAlign:"center",color:"#444",fontSize:"11px",padding:"20px 0" }}>Select a node to bind API</div>)}
              </>
            )}

            {/* DEV */}
            {rightTab==="dev"&&(
              <>
                <div style={{ fontSize:"10px",color:C.accent,fontWeight:700,letterSpacing:"0.1em" }}>DEV MODE HANDOFF</div>
                <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",background:"rgba(34,211,168,0.06)",border:`1px solid rgba(34,211,168,0.2)`,borderRadius:"8px",padding:"10px" }}>
                  <div><div style={{ fontSize:"12px",fontWeight:600,color:devMode?C.success:C.muted }}>{devMode?"Active":"Off"}</div><div style={{ fontSize:"10px",color:C.dim }}>Spacing, CSS, Tailwind</div></div>
                  <button className={`sb${devMode?" green":""}`} onClick={()=>setDevMode(p=>!p)}>{devMode?"Disable":"Enable"}</button>
                </div>
                {sel&&(
                  <div style={{ display:"flex",flexDirection:"column",gap:"8px" }}>
                    <div style={{ background:"rgba(0,0,0,0.3)",border:`1px solid ${C.border}`,borderRadius:"8px",padding:"10px",fontFamily:"JetBrains Mono,monospace",fontSize:"10px",lineHeight:2 }}>
                      {[["position","absolute"],["left",Math.round(sel.x)+"px"],["top",Math.round(sel.y)+"px"],["width",sel.w+"px"],["height",Math.round(sel.h)+"px"],["background",sel.bg||C.nodeFrame],["border-radius","14px"],["display","flex"]].map(([p,v])=>(
                        <div key={p}><span style={{ color:C.accent }}>{p}</span>: <span style={{ color:C.success }}>{v}</span>;</div>
                      ))}
                    </div>
                    <div style={{ background:"rgba(225,73,109,0.05)",border:`1px solid ${C.border}`,borderRadius:"8px",padding:"10px" }}>
                      <div style={{ fontSize:"9px",color:C.dim,fontWeight:600,marginBottom:"4px" }}>TAILWIND</div>
                      <code style={{ fontSize:"10px",color:C.accent,fontFamily:"JetBrains Mono,monospace",lineHeight:1.8,wordBreak:"break-all" }}>{cssToTw(sel)}</code>
                    </div>
                    <button className="sb" onClick={()=>navigator.clipboard.writeText(cssToTw(sel))} style={{ width:"100%",justifyContent:"center",fontSize:"10px" }}>Copy Tailwind</button>
                    {devDists.length>0&&devDists.map(d=>(
                      <div key={d.id} style={{ display:"flex",justifyContent:"space-between",padding:"5px 8px",background:"rgba(34,211,168,0.04)",borderRadius:"5px",fontSize:"10px" }}>
                        <span style={{ color:C.muted }}>→ {d.label}</span>
                        <span style={{ color:C.success,fontFamily:"JetBrains Mono,monospace" }}>Δx:{d.dx} Δy:{d.dy}</span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* EXPORT */}
            {rightTab==="export"&&(
              <>
                <div style={{ fontSize:"10px",color:C.accent,fontWeight:700,letterSpacing:"0.1em" }}>EXPORT CODE</div>
                <div style={{ display:"flex",gap:"4px" }}>
                  {[["react","React/JSX"],["html","HTML"],["tailwind","Tailwind"]].map(([f,l])=>(
                    <button key={f} className={`sb${exportFmt===f?" active":""}`} onClick={()=>setExportFmt(f)} style={{ flex:1,justifyContent:"center",fontSize:"10px",padding:"5px 3px" }}>{l}</button>
                  ))}
                </div>
                <div style={{ fontSize:"10px",color:C.dim,background:"rgba(225,73,109,0.04)",borderRadius:"6px",padding:"8px" }}>
                  {nodes.length} nodes · {connections.length} connections → <span style={{ color:C.accent }}>{exportFmt==="react"?"React + JSX":exportFmt==="html"?"HTML5 + CSS":"Tailwind"}</span>
                </div>
                <button className="sb primary" onClick={handleExport} style={{ width:"100%",justifyContent:"center" }}>Generate Code</button>
                {exportCode&&(<>
                  <textarea className="ca" style={{ minHeight:"250px" }} value={exportCode} readOnly/>
                  <div style={{ display:"flex",gap:"5px" }}>
                    <button className={`sb${copied?" green":""}`} onClick={copyCode} style={{ flex:1,justifyContent:"center",fontSize:"10px" }}>{copied?"✓ Copied":"Copy"}</button>
                    <button className="sb" onClick={downloadCode} style={{ flex:1,justifyContent:"center",fontSize:"10px" }}>Download</button>
                  </div>
                </>)}
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── AI MODAL ──────────────────────────────────────────────────── */}
      {showAi&&(
        <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,backdropFilter:"blur(10px)" }}>
          <div style={{ width:"520px",background:C.bg,border:`1px solid ${C.borderHi}`,borderRadius:"20px",padding:"28px",animation:"fadeIn 0.2s ease" }}>
            <div style={{ display:"flex",alignItems:"center",gap:"10px",marginBottom:"18px" }}>
              <div style={{ width:"34px",height:"34px",borderRadius:"10px",background:`linear-gradient(135deg,${C.accentDark},${C.accent})`,display:"flex",alignItems:"center",justifyContent:"center" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              </div>
              <div>
                <h3 style={{ fontFamily:"Syne,sans-serif",fontWeight:800,fontSize:"17px",color:"#fff" }}>AI Prompt → DOM Nodes</h3>
                <p style={{ fontSize:"11px",color:C.dim,marginTop:"2px" }}>Describe a layout — AI generates structured canvas nodes</p>
              </div>
            </div>
            <textarea style={{ width:"100%",background:"rgba(225,73,109,0.05)",border:`1px solid ${C.borderHi}`,borderRadius:"10px",color:C.text,padding:"14px",fontSize:"14px",fontFamily:"inherit",resize:"none",outline:"none",lineHeight:1.6 }} rows={3} value={aiPrompt} onChange={e=>setAiPrompt(e.target.value)}
              placeholder='Try: "pricing table with 3 tiers" or "SaaS dashboard" or "hero section"'
              onKeyDown={e=>{if(e.key==="Enter"&&(e.metaKey||e.ctrlKey))handleAi()}}/>
            <div style={{ marginTop:"8px",display:"flex",flexWrap:"wrap",gap:"5px" }}>
              {["pricing table","dashboard","hero section","navbar","kanban board","contact form","profile card"].map(p=>(
                <button key={p} className="sb" onClick={()=>setAiPrompt(p)} style={{ fontSize:"10px",padding:"3px 8px" }}>{p}</button>
              ))}
            </div>
            <div style={{ display:"flex",gap:"8px",marginTop:"16px" }}>
              <button className="sb primary" onClick={handleAi} disabled={aiGenerating||!aiPrompt.trim()} style={{ flex:2,justifyContent:"center",padding:"10px",fontSize:"13px" }}>
                {aiGenerating?<><div style={{ width:"13px",height:"13px",border:"2px solid rgba(255,255,255,0.3)",borderTopColor:"#fff",borderRadius:"50%",animation:"spin 0.8s linear infinite" }}/>Generating…</>:"✦ Generate Nodes"}
              </button>
              <button className="sb" onClick={()=>setShowAi(false)} style={{ flex:1,justifyContent:"center" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ── STATUS BAR ────────────────────────────────────────────────── */}
      <div style={{ height:"24px",background:"rgba(14,13,17,0.98)",borderTop:`1px solid ${C.border}`,display:"flex",alignItems:"center",padding:"0 14px",gap:"14px",fontSize:"9px",color:C.dim,flexShrink:0 }}>
        <span style={{ color:C.accent }}>∞ INFINITE STUDIO</span>
        <span>Nodes: {nodes.length}</span>
        <span>Connections: {connections.length}</span>
        <span>Zoom: {Math.round(vp.scale*100)}%</span>
        {Object.keys(peerCursors).length>0&&<span style={{ color:C.accent }}>👥 {Object.keys(peerCursors).length} peers</span>}
        {devMode&&<span style={{ color:C.success }}>⌘ DEV MODE</span>}
        <span style={{ marginLeft:"auto",color:"#333" }}>Space+Drag Pan · Scroll Zoom · Drag • Connect · Del Delete · Ctrl+D Duplicate</span>
      </div>
    </div>
  );
}
