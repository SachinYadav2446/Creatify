import React, { useState } from "react";

export default function CreativeCityscapeArt({ onNavigate, isDark, THEME }) {
  const [hoveredStation, setHoveredStation] = useState(null);

  // Creatify luxury brand palette
  const strokeColor = isDark ? "#ff8da7" : "#831843";
  const lineThin = isDark ? "rgba(255, 141, 167, 0.4)" : "rgba(131, 24, 67, 0.35)";
  const fillPrimary = isDark ? "rgba(225, 73, 109, 0.12)" : "rgba(254, 226, 236, 0.75)";
  const fillSecondary = isDark ? "rgba(131, 24, 67, 0.22)" : "rgba(253, 242, 244, 0.95)";
  const accentRose = "#e1496d";
  const accentCyan = isDark ? "#38bdf8" : "#0284c7";
  const accentGold = "#f59e0b";
  const accentGreen = "#22c55e";
  const windowFill = isDark ? "#ffffff" : "#ffffff";

  return (
    <div
      id="creatify-studio-pipeline-art"
      style={{
        position: "relative",
        width: "100%",
        overflow: "hidden",
        padding: "85px 0 75px",
        background: isDark
          ? "linear-gradient(180deg, transparent 0%, rgba(26, 7, 20, 0.5) 50%, transparent 100%)"
          : "linear-gradient(180deg, transparent 0%, rgba(253, 242, 246, 0.7) 50%, transparent 100%)",
        boxSizing: "border-box",
      }}
    >
      <style>{`
        @keyframes pulseOrb {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.35); opacity: 1; }
        }
        @keyframes cableFlow {
          0% { stroke-dashoffset: 40; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes astronautFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
        }
        @keyframes spinFan {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes typingCursor {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
        .pipeline-station {
          cursor: pointer;
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .pipeline-station:hover {
          filter: drop-shadow(0 0 18px rgba(225, 73, 109, 0.65));
          transform: translateY(-5px);
        }
      `}</style>

      {/* ── HIGH-DETAIL FREE-FLOW PANORAMIC CREATIVE PIPELINE (1440 × 300) ── */}
      <div style={{ width: "100%", lineHeight: 0, position: "relative", zIndex: 5 }}>
        <svg
          viewBox="0 0 1440 300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMax meet"
          style={{ width: "100%", height: "auto", display: "block" }}
        >
          {/* Main Animated Data Super-Highway connecting all stations */}
          <path
            d="M 40 240 Q 180 180 300 220 T 580 205 T 860 220 T 1140 205 T 1400 230"
            stroke={accentRose}
            strokeWidth="3.5"
            strokeDasharray="10 8"
            style={{ animation: "cableFlow 2.5s linear infinite" }}
          />

          {/* Secondary Cyan Telemetry Fiber */}
          <path
            d="M 40 245 Q 180 185 300 225 T 580 210 T 860 225 T 1140 210 T 1400 235"
            stroke={accentCyan}
            strokeWidth="1.8"
            strokeDasharray="6 12"
            opacity="0.7"
            style={{ animation: "cableFlow 3s linear infinite" }}
          />

          {/* ════════════════════════════════════════════════════════════════════
              STATION 01: AI PROMPT & NEURAL CORE (x: 40 - 240)
          ════════════════════════════════════════════════════════════════════ */}
          <g
            className="pipeline-station"
            onClick={() => onNavigate("infinite_studio")}
            onMouseEnter={() => setHoveredStation("prompt")}
            onMouseLeave={() => setHoveredStation(null)}
          >
            {/* Server Rack Outer Housing */}
            <rect x="45" y="110" width="145" height="185" rx="14" fill={fillPrimary} stroke={strokeColor} strokeWidth="2.4" />
            
            {/* Holographic Prompt Input Capsule */}
            <rect x="28" y="60" width="180" height="38" rx="19" fill={fillSecondary} stroke={strokeColor} strokeWidth="2.4" />
            <circle cx="48" cy="79" r="8" fill={accentRose} />
            <text x="64" y="83" fill={strokeColor} fontSize="10" fontFamily="monospace" fontWeight="700">
              generate 4k cinematic...
            </text>
            {/* Blinking Typing Cursor */}
            <line x1="184" y1="71" x2="184" y2="87" stroke={accentRose} strokeWidth="2.5" style={{ animation: "typingCursor 1s infinite" }} />
            
            {/* Neural Spark Magic Burst */}
            <path d="M 195 40 L 212 56" stroke={accentRose} strokeWidth="3" strokeLinecap="round" />
            <circle cx="215" cy="36" r="4.5" fill={accentGold} />
            <circle cx="186" cy="32" r="3" fill={accentRose} style={{ animation: "pulseOrb 1.5s infinite" }} />
            <line x1="175" y1="48" x2="165" y2="40" stroke={accentCyan} strokeWidth="2" strokeLinecap="round" />

            {/* Neural Matrix Synapse Grid inside Server */}
            <g transform="translate(60, 122)">
              {/* Layer 1 Nodes */}
              <circle cx="10" cy="15" r="3.5" fill={accentRose} />
              <circle cx="10" cy="35" r="3.5" fill={accentRose} />
              {/* Layer 2 Nodes */}
              <circle cx="40" cy="10" r="3.5" fill={accentCyan} />
              <circle cx="40" cy="25" r="3.5" fill={accentCyan} />
              <circle cx="40" cy="40" r="3.5" fill={accentCyan} />
              {/* Layer 3 Output Node */}
              <circle cx="70" cy="25" r="4.5" fill={accentGold} />
              {/* Synapse Connecting Lines */}
              <line x1="10" y1="15" x2="40" y2="10" stroke={lineThin} strokeWidth="1.2" />
              <line x1="10" y1="15" x2="40" y2="25" stroke={lineThin} strokeWidth="1.2" />
              <line x1="10" y1="35" x2="40" y2="25" stroke={lineThin} strokeWidth="1.2" />
              <line x1="10" y1="35" x2="40" y2="40" stroke={lineThin} strokeWidth="1.2" />
              <line x1="40" y1="10" x2="70" y2="25" stroke={lineThin} strokeWidth="1.2" />
              <line x1="40" y1="25" x2="70" y2="25" stroke={lineThin} strokeWidth="1.2" />
              <line x1="40" y1="40" x2="70" y2="25" stroke={lineThin} strokeWidth="1.2" />
            </g>

            {/* Cooling Fan 1 */}
            <g transform="translate(150, 132)">
              <circle cx="16" cy="16" r="14" fill="none" stroke={strokeColor} strokeWidth="1.8" />
              <g style={{ animation: "spinFan 4s linear infinite", transformOrigin: "16px 16px" }}>
                <line x1="16" y1="6" x2="16" y2="26" stroke={accentRose} strokeWidth="2.5" />
                <line x1="6" y1="16" x2="26" y2="16" stroke={accentRose} strokeWidth="2.5" />
              </g>
            </g>

            {/* Server Chassis Telemetry Slots */}
            {[...Array(3)].map((_, i) => (
              <g key={i} transform={`translate(60, ${180 + i * 28})`}>
                <rect x="0" y="0" width="115" height="20" rx="4" fill={windowFill} stroke={strokeColor} strokeWidth="1.5" />
                <circle cx="10" cy="10" r="3.5" fill={i === 0 ? accentGreen : (i === 1 ? accentCyan : accentRose)} />
                {/* Micro Bar Graph */}
                <rect x="22" y="5" width="25" height="10" rx="2" fill={accentRose} opacity="0.3" />
                <rect x="22" y="5" width={15 + i * 4} height="10" rx="2" fill={accentRose} />
                <line x1="56" y1="10" x2="105" y2="10" stroke={lineThin} strokeWidth="2" strokeDasharray="3 3" />
              </g>
            ))}

            {/* Station Label Badge */}
            <rect x="55" y="268" width="125" height="18" rx="4" fill={strokeColor} />
            <text x="117" y="280" fill="#ffffff" fontSize="9" fontFamily="'Poppins', sans-serif" fontWeight="800" textAnchor="middle" letterSpacing="0.06em">
              01. AI PROMPT PARSER
            </text>
          </g>

          {/* ════════════════════════════════════════════════════════════════════
              STATION 02: SPATIAL NODE BLUEPRINT ENGINE (x: 250 - 480)
          ════════════════════════════════════════════════════════════════════ */}
          <g
            className="pipeline-station"
            onClick={() => onNavigate("infinite_studio")}
            onMouseEnter={() => setHoveredStation("nodes")}
            onMouseLeave={() => setHoveredStation(null)}
          >
            {/* Center Node: Prompt Matrix */}
            <rect x="265" y="70" width="95" height="68" rx="10" fill={fillSecondary} stroke={strokeColor} strokeWidth="2.4" />
            <rect x="273" y="78" width="79" height="16" rx="4" fill={accentRose} />
            <text x="312" y="90" fill="#ffffff" fontSize="8.5" fontFamily="'Poppins', sans-serif" fontWeight="800" textAnchor="middle">
              PROMPT NODE
            </text>
            <circle cx="265" cy="104" r="4.5" fill={accentRose} stroke={strokeColor} strokeWidth="1.5" />
            <circle cx="360" cy="104" r="4.5" fill={accentCyan} stroke={strokeColor} strokeWidth="1.5" />
            {/* Inner Slider */}
            <line x1="278" y1="120" x2="345" y2="120" stroke={lineThin} strokeWidth="2" strokeLinecap="round" />
            <circle cx="320" cy="120" r="3.5" fill={accentRose} />

            {/* Child Node 1: Shader Synthesizer (Top) */}
            <rect x="385" y="35" width="95" height="58" rx="10" fill={fillPrimary} stroke={strokeColor} strokeWidth="2.2" />
            <rect x="393" y="42" width="79" height="14" rx="4" fill={accentCyan} />
            <text x="432" y="52" fill="#ffffff" fontSize="8" fontFamily="'Poppins', sans-serif" fontWeight="800" textAnchor="middle">
              SHADER SYNTH
            </text>
            <circle cx="385" cy="64" r="4" fill={accentCyan} stroke={strokeColor} strokeWidth="1.5" />
            <circle cx="480" cy="64" r="4" fill={accentGold} stroke={strokeColor} strokeWidth="1.5" />
            <line x1="398" y1="76" x2="465" y2="76" stroke={strokeColor} strokeWidth="2" strokeDasharray="4 3" />

            {/* Child Node 2: Physics Router (Bottom) */}
            <rect x="385" y="125" width="95" height="62" rx="10" fill={fillPrimary} stroke={strokeColor} strokeWidth="2.2" />
            <rect x="393" y="132" width="79" height="14" rx="4" fill={accentGold} />
            <text x="432" y="142" fill="#ffffff" fontSize="8" fontFamily="'Poppins', sans-serif" fontWeight="800" textAnchor="middle">
              LOGIC ROUTER
            </text>
            <circle cx="385" cy="156" r="4" fill={accentGold} stroke={strokeColor} strokeWidth="1.5" />
            <circle cx="480" cy="156" r="4" fill={accentRose} stroke={strokeColor} strokeWidth="1.5" />
            <rect x="398" y="168" width="30" height="8" rx="2" fill={windowFill} stroke={strokeColor} strokeWidth="1" />
            <rect x="435" y="168" width="30" height="8" rx="2" fill={windowFill} stroke={strokeColor} strokeWidth="1" />

            {/* Bezier Node Wiring Cables */}
            <path d="M 360 104 C 375 64, 370 64, 385 64" stroke={accentCyan} strokeWidth="2.8" fill="none" />
            <path d="M 360 104 C 375 156, 370 156, 385 156" stroke={accentRose} strokeWidth="2.8" fill="none" />

            {/* Flowing Data Pulse Packets */}
            <circle cx="372" cy="80" r="4" fill="#ffffff" stroke={accentCyan} strokeWidth="1.5" style={{ animation: "pulseOrb 1.2s infinite" }} />
            <circle cx="372" cy="130" r="4" fill="#ffffff" stroke={accentRose} strokeWidth="1.5" style={{ animation: "pulseOrb 1.5s infinite 0.3s" }} />

            {/* Node Pedestal Support Pillars */}
            <rect x="295" y="138" width="35" height="130" rx="6" fill={fillSecondary} stroke={strokeColor} strokeWidth="2" />
            <rect x="420" y="187" width="30" height="81" rx="6" fill={fillSecondary} stroke={strokeColor} strokeWidth="2" />

            {/* Station Label Badge */}
            <rect x="310" y="268" width="125" height="18" rx="4" fill={strokeColor} />
            <text x="372" y="280" fill="#ffffff" fontSize="9" fontFamily="'Poppins', sans-serif" fontWeight="800" textAnchor="middle" letterSpacing="0.06em">
              02. SPATIAL NODES
            </text>
          </g>

          {/* ════════════════════════════════════════════════════════════════════
              STATION 03: 4K MULTI-TRACK MASTER TIMELINE (x: 500 - 740)
          ════════════════════════════════════════════════════════════════════ */}
          <g
            className="pipeline-station"
            onClick={() => onNavigate("editor")}
            onMouseEnter={() => setHoveredStation("timeline")}
            onMouseLeave={() => setHoveredStation(null)}
          >
            {/* Monitor Chassis Frame */}
            <rect x="520" y="55" width="205" height="145" rx="12" fill={fillSecondary} stroke={strokeColor} strokeWidth="2.4" />
            
            {/* Webcam Lens & Micro Bezel */}
            <circle cx="622" cy="62" r="3" fill="#1e293b" />
            <circle cx="622" cy="62" r="1" fill="#38bdf8" />

            {/* Monitor Screen Glass Viewport */}
            <rect x="532" y="68" width="181" height="60" rx="6" fill={isDark ? "#090307" : "#ffffff"} stroke={strokeColor} strokeWidth="1.8" />
            
            {/* Screen Header HUD Timecode */}
            <text x="542" y="80" fill={strokeColor} fontSize="8" fontFamily="monospace" fontWeight="700">
              00:01:24:18 • 120 FPS
            </text>
            <circle cx="700" cy="77" r="3" fill={accentGreen} style={{ animation: "pulseOrb 1.5s infinite" }} />

            {/* Central Play/Preview Diamond */}
            <circle cx="622" cy="98" r="15" fill={accentRose} />
            <polygon points="618,91 631,98 618,105" fill="#ffffff" />

            {/* Multi-Track Timeline Layers Inside Monitor */}
            <g transform="translate(532, 134)">
              {/* Track V1: 4K Master Video Strip */}
              <rect x="0" y="0" width="181" height="13" rx="3" fill={fillPrimary} stroke={strokeColor} strokeWidth="1" />
              <rect x="15" y="2" width="65" height="9" rx="2" fill={accentRose} />
              <rect x="90" y="2" width="45" height="9" rx="2" fill={accentCyan} />
              {/* Cut Razor Marker */}
              <line x1="80" y1="0" x2="80" y2="13" stroke="#ffffff" strokeWidth="1.5" />

              {/* Track V2: VFX Overlay */}
              <rect x="0" y="16" width="181" height="13" rx="3" fill={fillPrimary} stroke={strokeColor} strokeWidth="1" />
              <rect x="40" y="18" width="50" height="9" rx="2" fill={accentGold} />
              <rect x="100" y="18" width="60" height="9" rx="2" fill={accentRose} opacity="0.8" />

              {/* Track A1: Audio Waveform Equalizer */}
              <rect x="0" y="32" width="181" height="13" rx="3" fill={fillPrimary} stroke={strokeColor} strokeWidth="1" />
              {[...Array(16)].map((_, w) => (
                <line key={w} x1={12 + w * 10} y1="35" x2={12 + w * 10} y2={39 + (w % 3) * 2} stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
              ))}

              {/* Red Scrubber Playhead Laser */}
              <line x1="90" y1="-7" x2="90" y2="47" stroke="#ef4444" strokeWidth="2.5" />
              <polygon points="85,-7 95,-7 90,0" fill="#ef4444" />
            </g>

            {/* Heavy Cast-Aluminum Stand Post */}
            <rect x="612" y="200" width="22" height="68" fill={fillSecondary} stroke={strokeColor} strokeWidth="2" />
            <path d="M 575 268 L 670 268 L 655 255 L 590 255 Z" fill={strokeColor} />

            {/* Station Label Badge */}
            <rect x="560" y="268" width="130" height="18" rx="4" fill={strokeColor} />
            <text x="625" y="280" fill="#ffffff" fontSize="9" fontFamily="'Poppins', sans-serif" fontWeight="800" textAnchor="middle" letterSpacing="0.06em">
              03. 4K TIMELINE & AUDIO
            </text>
          </g>

          {/* ════════════════════════════════════════════════════════════════════
              STATION 04: 3D PBR RAYTRACER VIEWPORT (x: 750 - 970)
          ════════════════════════════════════════════════════════════════════ */}
          <g
            className="pipeline-station"
            onClick={() => onNavigate("mockup_studio")}
            onMouseEnter={() => setHoveredStation("mockup")}
            onMouseLeave={() => setHoveredStation(null)}
          >
            {/* Holographic Projection Pedestal Tower */}
            <path d="M 775 268 L 795 150 L 925 150 L 945 268 Z" fill={fillPrimary} stroke={strokeColor} strokeWidth="2.4" />
            
            {/* Emitter Ring Platform */}
            <ellipse cx="860" cy="150" rx="68" ry="18" fill={fillSecondary} stroke={strokeColor} strokeWidth="2.2" />
            <ellipse cx="860" cy="150" rx="50" ry="12" fill="none" stroke={accentCyan} strokeWidth="1.5" strokeDasharray="4 4" />

            {/* Floating 3D Isometric Mesh Topology Cube */}
            <g transform="translate(860, 85)" style={{ animation: "astronautFloat 4.5s ease-in-out infinite" }}>
              {/* Top Isometric Face */}
              <polygon points="0,-40 35,-22 0,-4 -35,-22" fill={isDark ? "rgba(56, 189, 248, 0.45)" : "rgba(225, 73, 109, 0.35)"} stroke={strokeColor} strokeWidth="2.2" />
              {/* Left Isometric Face */}
              <polygon points="-35,-22 0,-4 0,34 -35,16" fill={fillPrimary} stroke={strokeColor} strokeWidth="2.2" />
              {/* Right Isometric Face */}
              <polygon points="0,-4 35,-22 35,16 0,34" fill={fillSecondary} stroke={strokeColor} strokeWidth="2.2" />
              
              {/* Internal Polygon Wireframe Subdivisions */}
              <line x1="-17" y1="-31" x2="17" y2="-13" stroke={strokeColor} strokeWidth="1.2" strokeDasharray="3 3" />
              <line x1="-17" y1="-13" x2="17" y2="-31" stroke={strokeColor} strokeWidth="1.2" strokeDasharray="3 3" />
              <line x1="-17" y1="-3" x2="-17" y2="25" stroke={strokeColor} strokeWidth="1.2" strokeDasharray="3 3" />
              <line x1="17" y1="-3" x2="17" y2="25" stroke={strokeColor} strokeWidth="1.2" strokeDasharray="3 3" />

              {/* XYZ Coordinate Rotation Gimbal Rings */}
              <ellipse cx="0" cy="0" rx="48" ry="14" fill="none" stroke={accentCyan} strokeWidth="1.8" strokeDasharray="5 4" />
              <circle cx="48" cy="0" r="3" fill={accentCyan} />
            </g>

            {/* Raytracing Photon Bounce Rays */}
            <line x1="815" y1="150" x2="840" y2="95" stroke={accentGold} strokeWidth="2" strokeDasharray="4 3" />
            <line x1="905" y1="150" x2="880" y2="95" stroke={accentRose} strokeWidth="2" strokeDasharray="4 3" />

            {/* Pedestal HUD Status Meter */}
            <rect x="830" y="180" width="60" height="20" rx="4" fill={windowFill} stroke={strokeColor} strokeWidth="1.5" />
            <text x="860" y="193" fill={strokeColor} fontSize="8" fontFamily="monospace" fontWeight="800" textAnchor="middle">
              360° PBR
            </text>

            {/* Station Label Badge */}
            <rect x="795" y="268" width="130" height="18" rx="4" fill={strokeColor} />
            <text x="860" y="280" fill="#ffffff" fontSize="9" fontFamily="'Poppins', sans-serif" fontWeight="800" textAnchor="middle" letterSpacing="0.06em">
              04. 3D PBR RAYTRACER
            </text>
          </g>

          {/* ════════════════════════════════════════════════════════════════════
              STATION 05: BRAND KIT & VECTOR ATELIER (x: 980 - 1190)
          ════════════════════════════════════════════════════════════════════ */}
          <g
            className="pipeline-station"
            onClick={() => onNavigate("brand_kit")}
            onMouseEnter={() => setHoveredStation("brand")}
            onMouseLeave={() => setHoveredStation(null)}
          >
            {/* Atelier Studio Building Architecture */}
            <rect x="1000" y="70" width="170" height="198" rx="12" fill={fillPrimary} stroke={strokeColor} strokeWidth="2.4" />
            
            {/* Giant Serif Specimen Block "Aa" */}
            <rect x="1015" y="85" width="60" height="60" rx="8" fill={fillSecondary} stroke={strokeColor} strokeWidth="2" />
            <text x="1045" y="128" fill={strokeColor} fontSize="36" fontFamily="'Syne', serif" fontWeight="800" textAnchor="middle">
              Aa
            </text>

            {/* CMYK Color Syringe Tubes */}
            <g transform="translate(1088, 85)">
              <rect x="0" y="0" width="16" height="60" rx="4" fill="#e1496d" stroke={strokeColor} strokeWidth="1.8" />
              <rect x="22" y="0" width="16" height="60" rx="4" fill="#38bdf8" stroke={strokeColor} strokeWidth="1.8" />
              <rect x="44" y="0" width="16" height="60" rx="4" fill="#f59e0b" stroke={strokeColor} strokeWidth="1.8" />
              <rect x="66" y="0" width="16" height="60" rx="4" fill="#10b981" stroke={strokeColor} strokeWidth="1.8" />
              {/* Drip Droplets */}
              <circle cx="8" cy="68" r="2.5" fill="#e1496d" />
              <circle cx="30" cy="68" r="2.5" fill="#38bdf8" />
              <circle cx="52" cy="68" r="2.5" fill="#f59e0b" />
            </g>

            {/* Vector Pen Tool Bezier Curve with Tangent Handles */}
            <g transform="translate(1015, 160)">
              {/* Winding Bezier Path */}
              <path d="M 10 40 C 40 5, 100 75, 130 30" fill="none" stroke={strokeColor} strokeWidth="3" />
              {/* Anchors */}
              <circle cx="10" cy="40" r="4.5" fill="#ffffff" stroke={accentRose} strokeWidth="2.5" />
              <circle cx="130" cy="30" r="4.5" fill="#ffffff" stroke={accentRose} strokeWidth="2.5" />
              {/* Tangent Handle Line & Control Handle */}
              <line x1="40" y1="5" x2="40" y2="35" stroke={accentCyan} strokeWidth="2" />
              <rect x="36" y="2" width="8" height="8" fill={accentCyan} />
              
              {/* Pen Tool Nib */}
              <g transform="translate(125, 15) rotate(45)">
                <polygon points="0,0 8,16 0,22 -8,16" fill={strokeColor} />
                <circle cx="0" cy="12" r="1.5" fill="#ffffff" />
              </g>
            </g>

            {/* Color Swatch Palette Tags */}
            <g transform="translate(1015, 222)">
              <rect x="0" y="0" width="40" height="16" rx="3" fill="#e1496d" />
              <rect x="46" y="0" width="40" height="16" rx="3" fill="#38bdf8" />
              <rect x="92" y="0" width="40" height="16" rx="3" fill="#f59e0b" />
            </g>

            {/* Station Label Badge */}
            <rect x="1015" y="268" width="140" height="18" rx="4" fill={strokeColor} />
            <text x="1085" y="280" fill="#ffffff" fontSize="9" fontFamily="'Poppins', sans-serif" fontWeight="800" textAnchor="middle" letterSpacing="0.06em">
              05. BRAND ATELIER
            </text>
          </g>

          {/* ════════════════════════════════════════════════════════════════════
              STATION 06: ENCRYPTED ZERO-LEAK VAULT (x: 1200 - 1420)
          ════════════════════════════════════════════════════════════════════ */}
          <g
            className="pipeline-station"
            onClick={() => onNavigate("vault")}
            onMouseEnter={() => setHoveredStation("vault")}
            onMouseLeave={() => setHoveredStation(null)}
          >
            {/* Vault Outer Reinforced Dome Architecture */}
            <path d="M 1215 268 L 1215 110 Q 1315 55 1415 110 L 1415 268 Z" fill={fillSecondary} stroke={strokeColor} strokeWidth="2.4" />
            
            {/* Massive Outer Vault Door Bezel */}
            <circle cx="1315" cy="165" r="50" fill={fillPrimary} stroke={strokeColor} strokeWidth="2.8" />
            {/* Gear Locking Teeth around the rim */}
            {[...Array(12)].map((_, g) => {
              const angle = (Math.PI * 2 / 12) * g;
              const gx = 1315 + Math.cos(angle) * 44;
              const gy = 165 + Math.sin(angle) * 44;
              return <circle key={g} cx={gx} cy={gy} r="3.5" fill={strokeColor} />;
            })}
            
            {/* Center Biometric Lock & Wheel Spokes */}
            <circle cx="1315" cy="165" r="34" fill={fillSecondary} stroke={strokeColor} strokeWidth="2" />
            <circle cx="1315" cy="165" r="16" fill={accentRose} stroke={strokeColor} strokeWidth="2.2" />
            
            {/* Spoke Handles */}
            <line x1="1295" y1="165" x2="1335" y2="165" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
            <line x1="1315" y1="145" x2="1315" y2="185" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
            
            {/* Biometric Thumbprint / Security Verified Beacon */}
            <circle cx="1315" cy="92" r="6" fill={accentGreen} style={{ animation: "pulseOrb 2s infinite" }} />
            <text x="1315" y="80" fill={accentGreen} fontSize="7" fontFamily="monospace" fontWeight="800" textAnchor="middle">
              ZERO-LEAK
            </text>

            {/* Station Label Badge */}
            <rect x="1250" y="268" width="130" height="18" rx="4" fill={strokeColor} />
            <text x="1315" y="280" fill="#ffffff" fontSize="9" fontFamily="'Poppins', sans-serif" fontWeight="800" textAnchor="middle" letterSpacing="0.06em">
              06. ENCRYPTED VAULT
            </text>
          </g>

          {/* ════════════════════════════════════════════════════════════════════
              ASTRONAUT ASSISTANT 01: FLOATING ON JETPACK (TOP MID-AIR)
          ════════════════════════════════════════════════════════════════════ */}
          <g transform="translate(480, 70)" style={{ animation: "astronautFloat 5s ease-in-out infinite" }}>
            {/* Jetpack Thruster Flame */}
            <polygon points="-8,40 -2,40 -5,48" fill={accentGold} />
            {/* Helmet & Head */}
            <circle cx="16" cy="14" r="11" fill={isDark ? "#1c0613" : "#ffffff"} stroke={strokeColor} strokeWidth="2.2" />
            <ellipse cx="16" cy="14" rx="7.5" ry="5" fill={accentRose} opacity="0.85" />
            {/* Jetpack Body */}
            <rect x="-8" y="22" width="12" height="18" rx="3" fill={strokeColor} />
            {/* Torso Suit */}
            <rect x="4" y="24" width="22" height="24" rx="5" fill={fillPrimary} stroke={strokeColor} strokeWidth="2.2" />
            {/* Arm with Cable Tweaker Tool */}
            <line x1="4" y1="28" x2="-12" y2="18" stroke={strokeColor} strokeWidth="2.2" strokeLinecap="round" />
            <circle cx="-13" cy="17" r="3" fill={accentGold} />
          </g>

          {/* ════════════════════════════════════════════════════════════════════
              ASTRONAUT ASSISTANT 02: GROUND CONTROLLER TABLET
          ════════════════════════════════════════════════════════════════════ */}
          <g transform="translate(945, 200)">
            {/* Astronaut Helmet */}
            <circle cx="16" cy="14" r="10" fill={isDark ? "#1c0613" : "#ffffff"} stroke={strokeColor} strokeWidth="2" />
            <ellipse cx="16" cy="14" rx="7" ry="5" fill={accentRose} opacity="0.85" />
            {/* Torso */}
            <rect x="6" y="24" width="20" height="22" rx="4" fill={fillPrimary} stroke={strokeColor} strokeWidth="2" />
            {/* Legs */}
            <line x1="11" y1="46" x2="11" y2="60" stroke={strokeColor} strokeWidth="2.5" />
            <line x1="21" y1="46" x2="21" y2="60" stroke={strokeColor} strokeWidth="2.5" />
            {/* Holographic Tablet */}
            <rect x="-6" y="26" width="16" height="22" rx="2" fill="#ffffff" stroke={strokeColor} strokeWidth="1.8" />
            <line x1="-3" y1="32" x2="6" y2="32" stroke={accentCyan} strokeWidth="1.5" />
            <line x1="-3" y1="38" x2="6" y2="38" stroke={accentRose} strokeWidth="1.5" />
          </g>

          {/* ════════════════════════════════════════════════════════════════════
              MASTER TIMELINE HORIZON RULER (CALIBRATED SECOND TICKS)
          ════════════════════════════════════════════════════════════════════ */}
          <g stroke={strokeColor} strokeWidth="2.8">
            <line x1="0" y1="295" x2="1440" y2="295" />
            {/* Master Ticks every 30px */}
            {[...Array(48)].map((_, t) => (
              <line
                key={t}
                x1={t * 30}
                y1={t % 4 === 0 ? "284" : "289"}
                x2={t * 30}
                y2="295"
                strokeWidth={t % 4 === 0 ? "2.5" : "1.2"}
              />
            ))}
          </g>

          {/* Timeline Second Markers */}
          <text x="120" y="291" fill={strokeColor} fontSize="8" fontFamily="monospace" fontWeight="700">00:00:00</text>
          <text x="360" y="291" fill={strokeColor} fontSize="8" fontFamily="monospace" fontWeight="700">00:00:15</text>
          <text x="600" y="291" fill={strokeColor} fontSize="8" fontFamily="monospace" fontWeight="700">00:00:30</text>
          <text x="840" y="291" fill={strokeColor} fontSize="8" fontFamily="monospace" fontWeight="700">00:00:45</text>
          <text x="1080" y="291" fill={strokeColor} fontSize="8" fontFamily="monospace" fontWeight="700">00:01:00</text>
          <text x="1320" y="291" fill={strokeColor} fontSize="8" fontFamily="monospace" fontWeight="700">00:01:15</text>
        </svg>
      </div>
    </div>
  );
}
