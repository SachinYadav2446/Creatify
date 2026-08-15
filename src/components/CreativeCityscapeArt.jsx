import React, { useState } from "react";
import { Sparkles, Video, Box, Palette, Infinity as InfinityIcon, ShieldCheck, ArrowRight, Wand2 } from "lucide-react";

export default function CreativeCityscapeArt({ onNavigate, isDark, THEME }) {
  const [hoveredStation, setHoveredStation] = useState(null);

  // Creatify luxury brand palette
  const strokeColor = isDark ? "#ff8da7" : "#831843";
  const lineThin = isDark ? "rgba(255, 141, 167, 0.4)" : "rgba(131, 24, 67, 0.35)";
  const fillPrimary = isDark ? "rgba(225, 73, 109, 0.12)" : "rgba(254, 226, 236, 0.75)";
  const fillSecondary = isDark ? "rgba(131, 24, 67, 0.2)" : "rgba(253, 242, 244, 0.9)";
  const accentRose = "#e1496d";
  const accentCyan = isDark ? "#38bdf8" : "#0284c7";
  const accentGold = "#f59e0b";
  const windowFill = isDark ? "#ffffff" : "#ffffff";

  const studioStations = [
    { id: "prompt", name: "AI Neural Prompt Engine", desc: "Transforms text into instant spatial graphs", icon: Wand2, route: "infinite_studio" },
    { id: "nodes", name: "Spatial Node Blueprints", desc: "Executable logic & multi-modal routing", icon: InfinityIcon, route: "infinite_studio" },
    { id: "timeline", name: "4K Multi-Track Timeline", desc: "Non-linear video editing & audio stems", icon: Video, route: "editor" },
    { id: "mockup", name: "3D PBR Raytracer", desc: "Real-time viewport & material projection", icon: Box, route: "mockup_studio" },
    { id: "brand", name: "Brand Vector Atelier", desc: "Harmonic palettes, typography & vector glyphs", icon: Palette, route: "brand_kit" },
    { id: "vault", name: "Encrypted Zero-Leak Vault", desc: "Encrypted asset security & version archive", icon: ShieldCheck, route: "vault" },
  ];

  return (
    <section
      id="creatify-studio-pipeline-art"
      style={{
        position: "relative",
        width: "100%",
        overflow: "hidden",
        padding: "50px 0 10px",
        background: isDark
          ? "linear-gradient(180deg, transparent 0%, #150610 40%, #0d0309 100%)"
          : "linear-gradient(180deg, transparent 0%, #fdf2f6 40%, #fae6ee 100%)",
        borderTop: `1px solid ${isDark ? "rgba(225, 73, 109, 0.16)" : "rgba(148, 41, 69, 0.12)"}`,
        borderBottom: `1px solid ${isDark ? "rgba(225, 73, 109, 0.16)" : "rgba(148, 41, 69, 0.12)"}`,
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
          50% { transform: translateY(-8px) rotate(2deg); }
        }
        @keyframes spinGear {
          100% { transform: rotate(360deg); }
        }
        .pipeline-station {
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .pipeline-station:hover {
          filter: drop-shadow(0 0 18px rgba(225, 73, 109, 0.6));
          transform: translateY(-4px);
        }
      `}</style>

      {/* ── HEADER BADGE & TITLE ── */}
      <div style={{ textAlign: "center", marginBottom: 20, padding: "0 20px" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "5px 14px",
            borderRadius: 99,
            background: isDark ? "rgba(225, 73, 109, 0.16)" : "rgba(255, 255, 255, 0.9)",
            border: `1px solid ${isDark ? "rgba(225, 73, 109, 0.35)" : "rgba(148, 41, 69, 0.2)"}`,
            backdropFilter: "blur(12px)",
            marginBottom: 10,
          }}
        >
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#e1496d", boxShadow: "0 0 8px #e1496d" }} />
          <span
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: isDark ? "#ff8da7" : "#831843",
            }}
          >
            CREATIFY CREATIVE ARCHITECTURE
          </span>
        </div>

        <h3
          style={{
            fontFamily: "Syne, sans-serif",
            fontSize: "clamp(24px, 3.2vw, 38px)",
            fontWeight: 800,
            letterSpacing: "-0.035em",
            color: isDark ? "#ffffff" : "#1a040d",
            margin: "0 0 8px",
          }}
        >
          How Your Ideas Flow Through Creatify<span style={{ color: "#e1496d" }}>.</span>
        </h3>

        <p
          style={{
            fontFamily: "'Instrument Sans', sans-serif",
            fontSize: "clamp(13px, 1.2vw, 15px)",
            color: isDark ? "rgba(255, 255, 255, 0.65)" : "rgba(35, 8, 18, 0.7)",
            maxWidth: 580,
            margin: "0 auto",
            lineHeight: 1.5,
          }}
        >
          From neural prompt parsing to node stitching, 4K timeline rendering, 3D viewport synthesis, and encrypted vault storage.
        </p>
      </div>

      {/* ── PANORAMIC VECTOR ILLUSTRATION: CREATIFY CREATIVE MACHINE (1440 × 260) ── */}
      <div style={{ width: "100%", lineHeight: 0, position: "relative", zIndex: 5 }}>
        <svg
          viewBox="0 0 1440 260"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMax meet"
          style={{ width: "100%", height: "auto", display: "block" }}
        >
          {/* Connecting Data Bus Cable connecting all stations */}
          <path
            d="M 40 210 Q 180 160 300 190 T 580 180 T 860 190 T 1140 180 T 1400 200"
            stroke={accentRose}
            strokeWidth="3"
            strokeDasharray="8 6"
            style={{ animation: "cableFlow 2s linear infinite" }}
          />

          {/* ════ STATION 1: AI PROMPT & NEURAL PARSER (x: 40 - 240) ════ */}
          <g
            className="pipeline-station"
            onClick={() => onNavigate("infinite_studio")}
            onMouseEnter={() => setHoveredStation("prompt")}
            onMouseLeave={() => setHoveredStation(null)}
          >
            {/* Base Server Rack Housing */}
            <rect x="50" y="110" width="130" height="150" rx="12" fill={fillPrimary} stroke={strokeColor} strokeWidth="2.2" />
            
            {/* Giant Glowing Prompt Input Capsule */}
            <rect x="35" y="70" width="160" height="34" rx="17" fill={fillSecondary} stroke={strokeColor} strokeWidth="2.2" />
            <circle cx="54" cy="87" r="7" fill={accentRose} />
            <line x1="68" y1="87" x2="165" y2="87" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
            
            {/* Neural Spark / Magic Wand */}
            <path d="M 180 50 L 195 65" stroke={accentRose} strokeWidth="3" strokeLinecap="round" />
            <circle cx="198" cy="46" r="4" fill={accentGold} />
            <circle cx="172" cy="42" r="2.5" fill={accentRose} style={{ animation: "pulseOrb 1.5s infinite" }} />
            
            {/* Server Blinking LEDs & Slots */}
            {[...Array(4)].map((_, i) => (
              <g key={i}>
                <rect x="65" y={125 + i * 28} width="100" height="18" rx="4" fill={windowFill} stroke={strokeColor} strokeWidth="1.5" />
                <circle cx="75" cy={134 + i * 28} r="3" fill={i % 2 === 0 ? accentCyan : accentRose} />
                <line x1="88" y1={134 + i * 28} x2="155" y2={134 + i * 28} stroke={lineThin} strokeWidth="2" strokeDasharray="3 3" />
              </g>
            ))}

            {/* Station Label */}
            <text x="115" y="245" fill={strokeColor} fontSize="10" fontFamily="'Poppins', sans-serif" fontWeight="800" textAnchor="middle" letterSpacing="0.06em">
              01. AI PROMPT PARSER
            </text>
          </g>

          {/* ════ STATION 2: SPATIAL NODE GRAPH ENGINE (x: 250 - 480) ════ */}
          <g
            className="pipeline-station"
            onClick={() => onNavigate("infinite_studio")}
            onMouseEnter={() => setHoveredStation("nodes")}
            onMouseLeave={() => setHoveredStation(null)}
          >
            {/* Center Hub Node */}
            <rect x="270" y="80" width="90" height="60" rx="8" fill={fillSecondary} stroke={strokeColor} strokeWidth="2.2" />
            <rect x="278" y="88" width="74" height="14" rx="4" fill={accentRose} />
            <text x="315" y="99" fill="#ffffff" fontSize="8" fontFamily="'Poppins', sans-serif" fontWeight="700" textAnchor="middle">
              INPUT NODE
            </text>
            <circle cx="270" cy="110" r="4" fill={accentRose} stroke={strokeColor} strokeWidth="1.5" />
            <circle cx="360" cy="110" r="4" fill={accentCyan} stroke={strokeColor} strokeWidth="1.5" />

            {/* Child Node 1 */}
            <rect x="380" y="45" width="85" height="50" rx="8" fill={fillPrimary} stroke={strokeColor} strokeWidth="2" />
            <text x="422" y="65" fill={strokeColor} fontSize="8" fontFamily="'Poppins', sans-serif" fontWeight="800" textAnchor="middle">
              TRANSFORM
            </text>
            <line x1="395" y1="78" x2="450" y2="78" stroke={strokeColor} strokeWidth="2" />

            {/* Child Node 2 */}
            <rect x="380" y="125" width="85" height="55" rx="8" fill={fillPrimary} stroke={strokeColor} strokeWidth="2" />
            <text x="422" y="145" fill={strokeColor} fontSize="8" fontFamily="'Poppins', sans-serif" fontWeight="800" textAnchor="middle">
              SYNTHESIZE
            </text>
            <line x1="395" y1="158" x2="450" y2="158" stroke={strokeColor} strokeWidth="2" />

            {/* Bezier Node Wiring Cables */}
            <path d="M 360 110 C 370 70, 370 70, 380 70" stroke={accentCyan} strokeWidth="2.5" fill="none" />
            <path d="M 360 110 C 370 150, 370 150, 380 150" stroke={accentRose} strokeWidth="2.5" fill="none" />

            {/* Data Pulse Orb */}
            <circle cx="370" cy="90" r="3.5" fill="#ffffff" stroke={accentRose} strokeWidth="1.5" style={{ animation: "pulseOrb 1.2s infinite" }} />

            {/* Station Support Legs */}
            <rect x="300" y="140" width="30" height="120" rx="4" fill={fillSecondary} stroke={strokeColor} strokeWidth="2" />
            <rect x="410" y="180" width="25" height="80" rx="4" fill={fillSecondary} stroke={strokeColor} strokeWidth="2" />

            <text x="365" y="245" fill={strokeColor} fontSize="10" fontFamily="'Poppins', sans-serif" fontWeight="800" textAnchor="middle" letterSpacing="0.06em">
              02. SPATIAL NODES
            </text>
          </g>

          {/* ════ STATION 3: 4K MULTI-TRACK TIMELINE & AUDIO ENGINE (x: 500 - 740) ════ */}
          <g
            className="pipeline-station"
            onClick={() => onNavigate("editor")}
            onMouseEnter={() => setHoveredStation("timeline")}
            onMouseLeave={() => setHoveredStation(null)}
          >
            {/* Monitor Screen Frame */}
            <rect x="520" y="65" width="190" height="120" rx="10" fill={fillSecondary} stroke={strokeColor} strokeWidth="2.2" />
            
            {/* Screen Inner Glass */}
            <rect x="530" y="75" width="170" height="50" rx="6" fill={isDark ? "#090307" : "#ffffff"} stroke={strokeColor} strokeWidth="1.5" />
            {/* Filmstrip Cut / Play Button */}
            <circle cx="615" cy="100" r="14" fill={accentRose} />
            <polygon points="611,93 623,100 611,107" fill="#ffffff" />

            {/* Multi-Track Timeline Layers Inside Monitor */}
            <g transform="translate(530, 132)">
              {/* Track 1: Video */}
              <rect x="0" y="0" width="170" height="12" rx="3" fill={fillPrimary} stroke={strokeColor} strokeWidth="1" />
              <rect x="20" y="2" width="60" height="8" rx="2" fill={accentRose} />
              <rect x="90" y="2" width="40" height="8" rx="2" fill={accentCyan} />

              {/* Track 2: Audio Waveform */}
              <rect x="0" y="16" width="170" height="12" rx="3" fill={fillPrimary} stroke={strokeColor} strokeWidth="1" />
              {[...Array(14)].map((_, w) => (
                <line key={w} x1={15 + w * 10} y1="18" x2={15 + w * 10} y2={22 + (w % 3) * 2} stroke={strokeColor} strokeWidth="1.8" />
              ))}

              {/* Red Playhead Laser Needle */}
              <line x1="85" y1="-5" x2="85" y2="34" stroke="#ef4444" strokeWidth="2" />
              <polygon points="81,-5 89,-5 85,0" fill="#ef4444" />
            </g>

            {/* Stand Post */}
            <rect x="605" y="185" width="20" height="75" fill={fillSecondary} stroke={strokeColor} strokeWidth="2" />
            <rect x="575" y="250" width="80" height="10" rx="4" fill={strokeColor} />

            <text x="615" y="245" fill={strokeColor} fontSize="10" fontFamily="'Poppins', sans-serif" fontWeight="800" textAnchor="middle" letterSpacing="0.06em">
              03. 4K TIMELINE & AUDIO
            </text>
          </g>

          {/* ════ STATION 4: 3D PBR MOCKUP RAYTRACER (x: 750 - 970) ════ */}
          <g
            className="pipeline-station"
            onClick={() => onNavigate("mockup_studio")}
            onMouseEnter={() => setHoveredStation("mockup")}
            onMouseLeave={() => setHoveredStation(null)}
          >
            {/* Holographic 3D Viewport Pedestal */}
            <path d="M 780 260 L 800 150 L 920 150 L 940 260 Z" fill={fillPrimary} stroke={strokeColor} strokeWidth="2.2" />
            
            {/* Holographic Projection Platform Ring */}
            <ellipse cx="860" cy="150" rx="65" ry="16" fill={fillSecondary} stroke={strokeColor} strokeWidth="2" />

            {/* Floating 3D Isometric Cube / Mockup Can */}
            <g transform="translate(860, 95)" style={{ animation: "astronautFloat 4s ease-in-out infinite" }}>
              {/* Isometric Cube Faces */}
              {/* Top Face */}
              <polygon points="0,-35 30,-20 0,-5 -30,-20" fill={isDark ? "rgba(56, 189, 248, 0.4)" : "rgba(225, 73, 109, 0.3)"} stroke={strokeColor} strokeWidth="2" />
              {/* Left Face */}
              <polygon points="-30,-20 0,-5 0,30 -30,15" fill={fillPrimary} stroke={strokeColor} strokeWidth="2" />
              {/* Right Face */}
              <polygon points="0,-5 30,-20 30,15 0,30" fill={fillSecondary} stroke={strokeColor} strokeWidth="2" />
              
              {/* XYZ Coordinate Gimbal Ring */}
              <ellipse cx="0" cy="0" rx="42" ry="12" fill="none" stroke={accentCyan} strokeWidth="1.5" strokeDasharray="4 3" />
            </g>

            {/* Raytracing Light Beams */}
            <line x1="820" y1="150" x2="840" y2="105" stroke={accentGold} strokeWidth="1.5" strokeDasharray="3 3" />
            <line x1="900" y1="150" x2="880" y2="105" stroke={accentRose} strokeWidth="1.5" strokeDasharray="3 3" />

            <text x="860" y="245" fill={strokeColor} fontSize="10" fontFamily="'Poppins', sans-serif" fontWeight="800" textAnchor="middle" letterSpacing="0.06em">
              04. 3D PBR RAYTRACER
            </text>
          </g>

          {/* ════ STATION 5: BRAND KIT & VECTOR ATELIER (x: 980 - 1190) ════ */}
          <g
            className="pipeline-station"
            onClick={() => onNavigate("brand_kit")}
            onMouseEnter={() => setHoveredStation("brand")}
            onMouseLeave={() => setHoveredStation(null)}
          >
            {/* Atelier Studio Building */}
            <rect x="1000" y="80" width="160" height="180" rx="10" fill={fillPrimary} stroke={strokeColor} strokeWidth="2.2" />
            
            {/* Giant Serif Typography Block "Aa" */}
            <rect x="1015" y="95" width="55" height="55" rx="6" fill={fillSecondary} stroke={strokeColor} strokeWidth="1.8" />
            <text x="1042" y="136" fill={strokeColor} fontSize="32" fontFamily="'Syne', serif" fontWeight="800" textAnchor="middle">
              Aa
            </text>

            {/* Harmonic Color Palette Swatch Tubes */}
            <g transform="translate(1085, 95)">
              <rect x="0" y="0" width="18" height="55" rx="4" fill="#e1496d" stroke={strokeColor} strokeWidth="1.5" />
              <rect x="24" y="0" width="18" height="55" rx="4" fill="#38bdf8" stroke={strokeColor} strokeWidth="1.5" />
              <rect x="48" y="0" width="18" height="55" rx="4" fill="#f59e0b" stroke={strokeColor} strokeWidth="1.5" />
            </g>

            {/* Vector Pen Tool Bezier Curve with Anchor Handles */}
            <g transform="translate(1015, 165)">
              <path d="M 10 30 C 35 0, 95 60, 120 25" fill="none" stroke={strokeColor} strokeWidth="2.5" />
              {/* Anchors */}
              <circle cx="10" cy="30" r="3.5" fill="#ffffff" stroke={accentRose} strokeWidth="2" />
              <circle cx="120" cy="25" r="3.5" fill="#ffffff" stroke={accentRose} strokeWidth="2" />
              {/* Handle */}
              <line x1="35" y1="0" x2="35" y2="25" stroke={accentCyan} strokeWidth="1.5" />
              <rect x="32" y="-3" width="6" height="6" fill={accentCyan} />
            </g>

            <text x="1080" y="245" fill={strokeColor} fontSize="10" fontFamily="'Poppins', sans-serif" fontWeight="800" textAnchor="middle" letterSpacing="0.06em">
              05. BRAND IDENTITY ATELIER
            </text>
          </g>

          {/* ════ STATION 6: ENCRYPTED ZERO-LEAK VAULT (x: 1200 - 1420) ════ */}
          <g
            className="pipeline-station"
            onClick={() => onNavigate("vault")}
            onMouseEnter={() => setHoveredStation("vault")}
            onMouseLeave={() => setHoveredStation(null)}
          >
            {/* Vault Outer Reinforced Dome Structure */}
            <path d="M 1220 260 L 1220 120 Q 1310 70 1400 120 L 1400 260 Z" fill={fillSecondary} stroke={strokeColor} strokeWidth="2.2" />
            
            {/* Massive Circular Vault Door */}
            <circle cx="1310" cy="165" r="45" fill={fillPrimary} stroke={strokeColor} strokeWidth="2.5" />
            <circle cx="1310" cy="165" r="32" fill="none" stroke={strokeColor} strokeWidth="1.5" strokeDasharray="6 4" />
            
            {/* Center Biometric Lock & Wheel Spokes */}
            <circle cx="1310" cy="165" r="14" fill={accentRose} stroke={strokeColor} strokeWidth="2" />
            {/* Safe Wheel Handles */}
            <line x1="1292" y1="165" x2="1328" y2="165" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="1310" y1="147" x2="1310" y2="183" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
            
            {/* Green Security Verified Shield Indicator */}
            <circle cx="1310" cy="100" r="5" fill="#22c55e" style={{ animation: "pulseOrb 2s infinite" }} />

            <text x="1310" y="245" fill={strokeColor} fontSize="10" fontFamily="'Poppins', sans-serif" fontWeight="800" textAnchor="middle" letterSpacing="0.06em">
              06. ENCRYPTED VAULT
            </text>
          </g>

          {/* ════ SIGNATURE ASTRONAUT CREATIVE ASSISTANT ════ */}
          <g transform="translate(450, 185)" style={{ animation: "astronautFloat 5s ease-in-out infinite" }}>
            {/* Astronaut Mascot */}
            <circle cx="20" cy="16" r="12" fill={isDark ? "#1c0613" : "#ffffff"} stroke={strokeColor} strokeWidth="2" />
            {/* Visor */}
            <ellipse cx="20" cy="16" rx="8" ry="6" fill={accentRose} opacity="0.8" />
            {/* Torso */}
            <rect x="8" y="28" width="24" height="26" rx="6" fill={fillPrimary} stroke={strokeColor} strokeWidth="2" />
            <circle cx="15" cy="36" r="2.5" fill={accentRose} />
            <circle cx="25" cy="36" r="2.5" fill={accentCyan} />
            {/* Waving Arm holding stylus */}
            <line x1="8" y1="32" x2="-4" y2="20" stroke={strokeColor} strokeWidth="2.2" strokeLinecap="round" />
            <circle cx="-5" cy="19" r="3" fill={accentGold} />
          </g>

          {/* ════ TIMELINE MASTER HORIZON RULER (Bottom Ground Line) ════ */}
          <g stroke={strokeColor} strokeWidth="2.5">
            <line x1="0" y1="258" x2="1440" y2="258" />
            {/* Timeline Tick Marks every 60px */}
            {[...Array(25)].map((_, t) => (
              <line key={t} x1={t * 60} y1="250" x2={t * 60} y2="258" strokeWidth={t % 4 === 0 ? "2.5" : "1.2"} />
            ))}
          </g>
        </svg>
      </div>

      {/* ── INTERACTIVE PIPELINE EXPLORER PILL BAR ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          padding: "16px 20px 24px",
          flexWrap: "wrap",
          position: "relative",
          zIndex: 10,
        }}
      >
        <span
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: isDark ? "#ff8da7" : "#831843",
            marginRight: 6,
          }}
        >
          INTERACTIVE BLUEPRINT PIPELINE:
        </span>

        {studioStations.map((st) => {
          const Icon = st.icon;
          return (
            <button
              key={st.id}
              onClick={() => onNavigate(st.route)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                padding: "7px 15px",
                borderRadius: 99,
                background: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.9)",
                border: `1px solid ${isDark ? "rgba(225, 73, 109, 0.3)" : "rgba(148, 41, 69, 0.2)"}`,
                color: isDark ? "#ffffff" : "#4a0e22",
                fontFamily: "'Poppins', sans-serif",
                fontSize: 11.5,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s ease",
                boxShadow: isDark ? "0 2px 10px rgba(0,0,0,0.3)" : "0 2px 8px rgba(148,41,69,0.08)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#e1496d";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = isDark ? "0 6px 20px rgba(225,73,109,0.35)" : "0 6px 16px rgba(225,73,109,0.18)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = isDark ? "rgba(225, 73, 109, 0.3)" : "rgba(148, 41, 69, 0.2)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = isDark ? "0 2px 10px rgba(0,0,0,0.3)" : "0 2px 8px rgba(148,41,69,0.08)";
              }}
            >
              <Icon size={13} color={accentRose} />
              <span>{st.name}</span>
              <ArrowRight size={12} opacity={0.6} />
            </button>
          );
        })}
      </div>
    </section>
  );
}
