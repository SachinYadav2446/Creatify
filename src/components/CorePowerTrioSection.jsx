import React, { useState } from "react";
import { 
  Box, Sparkles, Cpu, Check, ArrowRight, Layers, Eye, Zap, 
  Globe, Download, Star, Share2, Play, ExternalLink, ChevronRight
} from "lucide-react";

export default function CorePowerTrioSection({ onNavigate, isDark = true, THEME }) {
  const [hoveredCard, setHoveredCard] = useState(null);

  const colors = {
    bg: isDark
      ? "linear-gradient(180deg, #0a0308 0%, #150512 50%, #0d0309 100%)"
      : "linear-gradient(180deg, #f8f6fb 0%, #fdf2f7 50%, #f8f6fb 100%)",
    cardBg: isDark ? "rgba(24, 8, 20, 0.92)" : "rgba(255, 255, 255, 0.96)",
    cardBorder: isDark ? "rgba(225, 73, 109, 0.22)" : "rgba(225, 73, 109, 0.16)",
    textPrimary: isDark ? "#ffffff" : "#19040e",
    textMuted: isDark ? "rgba(255, 255, 255, 0.68)" : "rgba(25, 4, 14, 0.7)",
  };

  const featureCards = [
    {
      id: "mockups",
      tag: "WEBGL 3D RAYTRACER",
      tagColor: "#38bdf8",
      title: "3D Product Mockups",
      tagline: "Studio PBR Stages",
      desc: "Project your 2D artwork, packaging graphics, and brand assets onto photorealistic 3D devices with customizable studio lighting and dielectric glass shaders.",
      metric: "360° PBR",
      metricLabel: "Real-Time WebGL Viewport",
      route: "mockup_studio",
      actionLabel: "Launch 3D Studio",
      accentColor: "#38bdf8",
      gradient: "linear-gradient(135deg, rgba(56,189,248,0.22), rgba(14,165,233,0.06))",
      // Staggered layout config
      marginTop: 48,
      mascotTop: -86,
      mascotHeight: 120,
      checklist: [
        "12+ Photorealistic 3D device & packaging models",
        "Physical dielectric PBR glass & metallic shaders",
        "Drag-and-drop live texture mapping with real-time sync",
        "4K lossless multi-angle rendering & transparent PNGs"
      ],
      // Mascot 1: Highly-detailed Cyan Aviator Bird with Propeller Cap, Shoulder Harness, Scalloped Feathers, perched on an angled bar
      renderMascot: () => (
        <svg viewBox="0 0 170 150" style={{ width: "100%", height: "100%", overflow: "visible" }}>
          <defs>
            <linearGradient id="m1TealBody" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#5eead4" />
              <stop offset="50%" stopColor="#14b8a6" />
              <stop offset="100%" stopColor="#0f766e" />
            </linearGradient>
            <linearGradient id="m1WingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2dd4bf" />
              <stop offset="70%" stopColor="#0d9488" />
              <stop offset="100%" stopColor="#115e59" />
            </linearGradient>
            <linearGradient id="m1BeakGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fde047" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
          </defs>

          {/* Angled Perch Rod & Stand */}
          <g>
            {/* Stand Post */}
            <line x1="72" y1="126" x2="64" y2="148" stroke="#64748b" strokeWidth="3.5" strokeLinecap="round" />
            {/* Angled Perch Bar */}
            <line x1="40" y1="134" x2="104" y2="116" stroke="#94a3b8" strokeWidth="4.5" strokeLinecap="round" />
            <line x1="42" y1="134" x2="102" y2="117" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" />
            {/* Fastener Ring */}
            <circle cx="70" cy="127" r="4" fill="#475569" />
          </g>

          <g className="mascot-anim-bob1">
            {/* Detailed Tail Feathers */}
            <path d="M46,94 C30,98 18,108 14,118 C28,112 42,106 50,100 Z" fill="#0f766e" stroke="#042f2e" strokeWidth="1.2" />
            <path d="M48,90 C34,92 22,98 18,106 C32,102 44,98 52,94 Z" fill="#14b8a6" stroke="#042f2e" strokeWidth="1.2" />
            <path d="M52,86 C40,86 28,90 24,96 C36,94 48,92 56,88 Z" fill="#2dd4bf" stroke="#042f2e" strokeWidth="1.2" />

            {/* Bird Body */}
            <path
              d="M52,80 C50,98 62,112 80,112 C98,112 110,98 108,78 C106,62 94,52 78,54 C60,56 54,66 52,80 Z"
              fill="url(#m1TealBody)"
              stroke="#042f2e"
              strokeWidth="1.5"
            />
            {/* Belly Highlights */}
            <path d="M72,74 C70,92 78,104 90,106 C84,102 78,92 78,78 Z" fill="#99f6e4" opacity="0.4" />

            {/* Shoulder Harness / Strap with Buckle */}
            <path d="M60,68 Q78,82 96,96" stroke="#334155" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M60,68 Q78,82 96,96" stroke="#64748b" strokeWidth="2" strokeLinecap="round" fill="none" />
            <rect x="74" y="78" width="7" height="7" rx="1.5" fill="#f59e0b" stroke="#78350f" strokeWidth="1" transform="rotate(35 77 81)" />

            {/* Wing with Scalloped Layered Feathers */}
            <g>
              <path
                d="M58,74 C50,82 48,98 60,104 C74,110 88,98 86,84 C84,72 70,68 58,74 Z"
                fill="url(#m1WingGrad)"
                stroke="#042f2e"
                strokeWidth="1.5"
              />
              {/* Feather Texture Ridges */}
              <path d="M56,86 Q68,94 80,88" stroke="#0f766e" strokeWidth="1.8" fill="none" strokeLinecap="round" />
              <path d="M58,94 Q70,100 78,94" stroke="#0f766e" strokeWidth="1.8" fill="none" strokeLinecap="round" />
              <path d="M64,100 Q72,103 76,98" stroke="#0f766e" strokeWidth="1.8" fill="none" strokeLinecap="round" />
              <path d="M60,82 Q72,88 82,82" stroke="#5eead4" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.7" />
            </g>

            {/* Feet / Talons Clasping Bar */}
            <g>
              {/* Left Foot */}
              <line x1="68" y1="108" x2="64" y2="124" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M60,126 Q64,121 68,124 Q72,121 76,125" fill="none" stroke="#b45309" strokeWidth="2.5" strokeLinecap="round" />
              {/* Right Foot */}
              <line x1="82" y1="106" x2="80" y2="120" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M76,122 Q80,117 84,120 Q88,117 92,121" fill="none" stroke="#b45309" strokeWidth="2.5" strokeLinecap="round" />
            </g>

            {/* Head */}
            <circle cx="94" cy="56" r="18" fill="url(#m1TealBody)" stroke="#042f2e" strokeWidth="1.5" />
            {/* Cheek Blush */}
            <ellipse cx="90" cy="62" rx="4" ry="2.5" fill="#f43f5e" opacity="0.4" />

            {/* Large Expressive Eye with Gloss Glints */}
            <ellipse cx="99" cy="52" rx="6" ry="6.5" fill="#0f172a" />
            <circle cx="101" cy="50" r="2.5" fill="#ffffff" />
            <circle cx="97.5" cy="54.5" r="1.2" fill="#ffffff" />
            <path d="M93,45 Q100,43 106,47" stroke="#042f2e" strokeWidth="2" fill="none" strokeLinecap="round" />

            {/* Cute Pointed Beak */}
            <polygon points="106,53 126,58 106,66" fill="url(#m1BeakGrad)" stroke="#78350f" strokeWidth="1.2" />
            <line x1="106" y1="59" x2="122" y2="59" stroke="#78350f" strokeWidth="1" />

            {/* Aviator Propeller Cap with Checkerboard pattern */}
            <g>
              <ellipse cx="94" cy="40" rx="14" ry="6" fill="#334155" stroke="#0f172a" strokeWidth="1.5" />
              <path d="M84,39 C84,30 104,30 104,39 Z" fill="#64748b" stroke="#0f172a" strokeWidth="1.5" />
              {/* Cap visor */}
              <path d="M96,44 Q108,44 112,41 Q104,38 96,40 Z" fill="#1e293b" />
              {/* Propeller Shaft */}
              <line x1="94" y1="31" x2="94" y2="24" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" />
              {/* Spinning Propeller Blades */}
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
      id: "templates",
      tag: "SOVEREIGN ECOSYSTEM",
      tagColor: "#e1496d",
      title: "Templates Marketplace",
      tagline: "Community Creator Hub",
      desc: "Discover, rate, and remix sovereign community templates. Publish your own video edits, slide decks, and logos directly from your Vault for creators to build upon.",
      metric: "1-Click Remix",
      metricLabel: "Real-Time Downloads & Ratings",
      route: "templates",
      actionLabel: "Explore Marketplace",
      accentColor: "#e1496d",
      gradient: "linear-gradient(135deg, rgba(225,73,109,0.28), rgba(148,41,69,0.1))",
      isFeatured: true,
      // Staggered layout config (Elevated high)
      marginTop: 0,
      mascotTop: -108,
      mascotHeight: 140,
      checklist: [
        "100% Real published community creations & assets",
        "1-Click 'Remix in Studio' instant project forking",
        "Real-time author download counters & 5-star ratings",
        "Publish your own creations directly from your Vault"
      ],
      // Mascot 2: Soaring Flapping Bird in Flight carrying golden linked chain with template medal and speed streaks
      renderMascot: () => (
        <svg viewBox="0 0 200 160" style={{ width: "100%", height: "100%", overflow: "visible" }}>
          <defs>
            <linearGradient id="m2RoseBody" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#5eead4" />
              <stop offset="50%" stopColor="#14b8a6" />
              <stop offset="100%" stopColor="#0f766e" />
            </linearGradient>
            <linearGradient id="m2WingTeal" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#99f6e4" />
              <stop offset="40%" stopColor="#2dd4bf" />
              <stop offset="100%" stopColor="#0f766e" />
            </linearGradient>
            <linearGradient id="m2GoldChain" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
            <linearGradient id="m2Sunburst" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Radiant Energy Halo behind Head */}
          <circle cx="130" cy="55" r="28" fill="url(#m2Sunburst)" className="mascot-halo-pulse" />

          {/* Speed / Wind Streaks in Mid-Air */}
          <g>
            <line x1="16" y1="44" x2="52" y2="44" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
            <line x1="8" y1="62" x2="38" y2="62" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
            <line x1="22" y1="80" x2="48" y2="80" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
          </g>

          <g className="mascot-anim-soar">
            {/* Back Wing Flapping High with Multi-Tier Feather Tips */}
            <g>
              <path
                d="M78,60 C64,20 86,10 106,16 C102,32 94,50 82,64 Z"
                fill="#0d9488"
                stroke="#042f2e"
                strokeWidth="1.5"
              />
              <path d="M88,24 C94,14 104,12 112,18 C106,30 98,44 88,54 Z" fill="#2dd4bf" stroke="#042f2e" strokeWidth="1.2" />
              {/* Back wing feather serrations */}
              <line x1="86" y1="28" x2="100" y2="24" stroke="#042f2e" strokeWidth="1.2" />
              <line x1="90" y1="36" x2="102" y2="32" stroke="#042f2e" strokeWidth="1.2" />
            </g>

            {/* Aerodynamic Body Leaning Forward */}
            <path
              d="M60,78 C52,94 68,108 92,106 C116,104 134,88 130,68 C126,52 108,46 88,52 C72,56 64,66 60,78 Z"
              fill="url(#m2RoseBody)"
              stroke="#042f2e"
              strokeWidth="1.5"
            />
            {/* White/Mint Feather Chest Patch */}
            <path d="M96,62 C90,78 98,96 114,94 C124,90 128,78 126,66 Z" fill="#ccfbf1" opacity="0.6" />

            {/* Individual Spreading Tail Feathers in Flight */}
            <path d="M58,84 C40,90 28,102 22,114 C36,106 50,98 60,92 Z" fill="#0f766e" stroke="#042f2e" strokeWidth="1.2" />
            <path d="M56,80 C36,82 24,90 18,100 C34,96 48,90 58,86 Z" fill="#14b8a6" stroke="#042f2e" strokeWidth="1.2" />
            <path d="M56,76 C38,72 26,76 20,84 C36,82 50,78 58,78 Z" fill="#2dd4bf" stroke="#042f2e" strokeWidth="1.2" />

            {/* Front Giant Flapping Wing with 5 Distinct Feather Tips */}
            <g>
              <path
                d="M92,72 C80,34 112,18 136,28 C128,48 116,74 98,84 Z"
                fill="url(#m2WingTeal)"
                stroke="#042f2e"
                strokeWidth="1.5"
              />
              {/* Individual Feather Separation Lines */}
              <path d="M102,40 C114,32 126,30 134,36" stroke="#0f766e" strokeWidth="1.8" fill="none" strokeLinecap="round" />
              <path d="M100,52 C112,44 122,42 130,48" stroke="#0f766e" strokeWidth="1.8" fill="none" strokeLinecap="round" />
              <path d="M98,64 C108,58 116,56 122,62" stroke="#0f766e" strokeWidth="1.8" fill="none" strokeLinecap="round" />
              {/* Feather Highlight Ribs */}
              <path d="M106,36 Q120,30 128,34" stroke="#ffffff" strokeWidth="1.2" fill="none" opacity="0.6" />
              <path d="M104,48 Q116,42 124,46" stroke="#ffffff" strokeWidth="1.2" fill="none" opacity="0.6" />
            </g>

            {/* Head Leaning Into the Wind */}
            <circle cx="132" cy="54" r="18" fill="url(#m2RoseBody)" stroke="#042f2e" strokeWidth="1.5" />
            {/* Cheek Glint */}
            <ellipse cx="128" cy="60" rx="4" ry="2.5" fill="#f43f5e" opacity="0.4" />

            {/* Focused Flight Eye */}
            <ellipse cx="137" cy="50" rx="6" ry="6.5" fill="#0f172a" />
            <circle cx="139" cy="48" r="2.5" fill="#ffffff" />
            <circle cx="135.5" cy="52.5" r="1.2" fill="#ffffff" />
            <path d="M131,43 Q138,41 144,45" stroke="#042f2e" strokeWidth="2" fill="none" strokeLinecap="round" />

            {/* Beak Gripping Chain */}
            <polygon points="144,51 164,57 144,65" fill="url(#m2GoldChain)" stroke="#78350f" strokeWidth="1.2" />

            {/* Jaunty Conductor / Captain Cap */}
            <g>
              <path d="M122,40 C122,30 144,30 144,40 Z" fill="#1e293b" stroke="#0f172a" strokeWidth="1.5" />
              <path d="M132,44 Q148,44 154,40 Q142,36 130,40 Z" fill="#0f172a" />
              <circle cx="133" cy="35" r="2.5" fill="#f59e0b" />
            </g>

            {/* Trailing Little Claws in Flight */}
            <g>
              <line x1="84" y1="102" x2="76" y2="120" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="94" y1="100" x2="88" y2="118" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" />
            </g>

            {/* Linked Golden Chain & Medal hanging from Beak & Talons */}
            <g>
              {/* Chain Links */}
              <path
                d="M148,58 C136,80 120,102 108,124 C100,138 90,148 84,152"
                fill="none"
                stroke="url(#m2GoldChain)"
                strokeWidth="3"
                strokeDasharray="4 4"
                strokeLinecap="round"
              />
              <path
                d="M148,58 C154,82 142,108 126,132 C116,144 102,150 94,152"
                fill="none"
                stroke="url(#m2GoldChain)"
                strokeWidth="3"
                strokeDasharray="4 4"
                strokeLinecap="round"
              />
              {/* Hanging Golden Template Star Medallion */}
              <g transform="translate(89, 142)">
                <polygon points="0,-14 4,-4 14,0 4,4 0,14 -4,4 -14,0 -4,-4" fill="url(#m2GoldChain)" stroke="#78350f" strokeWidth="1" />
                <circle cx="0" cy="0" r="4.5" fill="#ffffff" />
                <circle cx="0" cy="0" r="2" fill="#f59e0b" />
              </g>
            </g>
          </g>
        </svg>
      )
    },
    {
      id: "pipelines",
      tag: "SPATIAL LOGIC ENGINE",
      tagColor: "#10b981",
      title: "Workflow Pipelines",
      tagline: "Autonomous Logic Nodes",
      desc: "Connect your design tools into autonomous pipelines. Draw dynamic bezier links between neural upscale engines, background removers, brand kit palettes, and video encoders.",
      metric: "Multi-Node",
      metricLabel: "Automated Data Streams",
      route: "pipelines",
      actionLabel: "Build Pipelines",
      accentColor: "#10b981",
      gradient: "linear-gradient(135deg, rgba(16,185,129,0.22), rgba(5,150,105,0.06))",
      // Staggered layout config (Medium-High elevation)
      marginTop: 24,
      mascotTop: -125,
      mascotHeight: 160,
      checklist: [
        "Drag-and-drop multi-node visual logic canvas",
        "Autonomous batch asset generation & styling",
        "Dynamic bezier cable routing & conditional branches",
        "Real-time pipeline execution & performance telemetry"
      ],
      // Mascot 3: Magnificent Phoenix with Multi-Tiered Colorful Flame Wings, Royal Crest, Fancy Necktie, perched on an Ornate Silver Hoop
      renderMascot: () => (
        <svg viewBox="0 0 200 180" style={{ width: "100%", height: "100%", overflow: "visible" }}>
          <defs>
            <linearGradient id="m3CrownGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
            <linearGradient id="m3FlameWing1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="40%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
            <linearGradient id="m3FlameWing2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <linearGradient id="m3HoopGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#cbd5e1" />
              <stop offset="50%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#64748b" />
            </linearGradient>
            <linearGradient id="m3AuraGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#f43f5e" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Majestic Radiant Sunburst Aura behind Phoenix Wings */}
          <ellipse cx="100" cy="80" rx="75" ry="60" fill="url(#m3AuraGlow)" className="mascot-aura-radiate" />

          {/* Ornate Silver/Chrome Hoop Perch */}
          <g>
            <circle cx="100" cy="148" r="28" fill="none" stroke="url(#m3HoopGrad)" strokeWidth="5" />
            <circle cx="100" cy="148" r="28" fill="none" stroke="#0f172a" strokeWidth="1" />
            {/* Stand Post below hoop */}
            <line x1="100" y1="176" x2="100" y2="195" stroke="#64748b" strokeWidth="4" strokeLinecap="round" />
          </g>

          <g className="mascot-anim-phoenix">
            {/* Cascading Ornate Peacock/Phoenix Tail Feathers */}
            <g>
              <path d="M90,118 C70,140 55,160 40,178 C65,165 85,145 96,124 Z" fill="#059669" stroke="#042f2e" strokeWidth="1.2" />
              <path d="M110,118 C130,140 145,160 160,178 C135,165 115,145 104,124 Z" fill="#059669" stroke="#042f2e" strokeWidth="1.2" />
              <path d="M100,118 C100,146 95,168 88,185 C105,168 105,146 100,118 Z" fill="#34d399" stroke="#042f2e" strokeWidth="1.2" />
              {/* Tail Gold Eyelets */}
              <circle cx="52" cy="168" r="4" fill="#fbbf24" stroke="#78350f" strokeWidth="1" />
              <circle cx="148" cy="168" r="4" fill="#fbbf24" stroke="#78350f" strokeWidth="1" />
              <circle cx="94" cy="174" r="4" fill="#fbbf24" stroke="#78350f" strokeWidth="1" />
            </g>

            {/* Left Giant Multi-Tier Flame Wing */}
            <g>
              {/* Outer Layer (Gold/Pink/Purple) */}
              <path
                d="M74,90 C40,45 15,35 24,18 C46,14 66,38 78,74 Z"
                fill="url(#m3FlameWing1)"
                stroke="#042f2e"
                strokeWidth="1.5"
              />
              {/* Mid Layer (Teal/Emerald) */}
              <path
                d="M76,92 C54,58 35,46 42,34 C58,30 72,50 80,80 Z"
                fill="url(#m3FlameWing2)"
                stroke="#042f2e"
                strokeWidth="1.2"
              />
              {/* Wing Feather Rib Highlights */}
              <path d="M30,22 Q52,38 72,68" stroke="#ffffff" strokeWidth="1.5" fill="none" opacity="0.6" strokeLinecap="round" />
              <path d="M44,38 Q62,54 76,78" stroke="#ffffff" strokeWidth="1.2" fill="none" opacity="0.6" strokeLinecap="round" />
            </g>

            {/* Right Giant Multi-Tier Flame Wing */}
            <g>
              {/* Outer Layer */}
              <path
                d="M126,90 C160,45 185,35 176,18 C154,14 134,38 122,74 Z"
                fill="url(#m3FlameWing1)"
                stroke="#042f2e"
                strokeWidth="1.5"
              />
              {/* Mid Layer */}
              <path
                d="M124,92 C146,58 165,46 158,34 C142,30 128,50 120,80 Z"
                fill="url(#m3FlameWing2)"
                stroke="#042f2e"
                strokeWidth="1.2"
              />
              {/* Wing Feather Rib Highlights */}
              <path d="M170,22 Q148,38 128,68" stroke="#ffffff" strokeWidth="1.5" fill="none" opacity="0.6" strokeLinecap="round" />
              <path d="M156,38 Q138,54 124,78" stroke="#ffffff" strokeWidth="1.2" fill="none" opacity="0.6" strokeLinecap="round" />
            </g>

            {/* Royal Phoenix Body */}
            <ellipse cx="100" cy="96" rx="26" ry="28" fill="#14b8a6" stroke="#042f2e" strokeWidth="1.5" />
            {/* Mint Breast Plumage */}
            <path d="M88,82 C88,110 112,110 112,82 C104,78 96,78 88,82 Z" fill="#ccfbf1" opacity="0.7" />

            {/* Dapper Geometric Necktie with Collar */}
            <g>
              {/* White Collar */}
              <polygon points="90,78 100,86 86,88" fill="#ffffff" stroke="#334155" strokeWidth="1" />
              <polygon points="110,78 100,86 114,88" fill="#ffffff" stroke="#334155" strokeWidth="1" />
              {/* Tie Knot */}
              <rect x="96" y="86" width="8" height="6" rx="1.5" fill="#0284c7" stroke="#0369a1" strokeWidth="1" />
              {/* Tie Body with Striped Pattern */}
              <polygon points="97,92 103,92 107,118 100,126 93,118" fill="#0284c7" stroke="#0369a1" strokeWidth="1" />
              <line x1="96" y1="100" x2="104" y2="98" stroke="#fbbf24" strokeWidth="1.8" />
              <line x1="95" y1="108" x2="105" y2="106" stroke="#fbbf24" strokeWidth="1.8" />
              <line x1="96" y1="116" x2="104" y2="114" stroke="#fbbf24" strokeWidth="1.8" />
            </g>

            {/* Little Talons Perched on Chrome Hoop */}
            <g>
              <line x1="92" y1="122" x2="90" y2="128" stroke="#d97706" strokeWidth="3" strokeLinecap="round" />
              <path d="M86,128 Q90,123 94,127" fill="none" stroke="#b45309" strokeWidth="3" strokeLinecap="round" />
              <line x1="108" y1="122" x2="110" y2="128" stroke="#d97706" strokeWidth="3" strokeLinecap="round" />
              <path d="M106,127 Q110,123 114,128" fill="none" stroke="#b45309" strokeWidth="3" strokeLinecap="round" />
            </g>

            {/* Head */}
            <circle cx="100" cy="62" r="19" fill="#14b8a6" stroke="#042f2e" strokeWidth="1.5" />
            {/* Cheek Glow */}
            <ellipse cx="88" cy="68" rx="4" ry="2.5" fill="#f43f5e" opacity="0.4" />
            <ellipse cx="112" cy="68" rx="4" ry="2.5" fill="#f43f5e" opacity="0.4" />

            {/* Dual Expressive Eyes */}
            <ellipse cx="91" cy="58" rx="5.5" ry="6" fill="#0f172a" />
            <circle cx="92.5" cy="56" r="2.2" fill="#ffffff" />
            <circle cx="89.5" cy="60" r="1" fill="#ffffff" />

            <ellipse cx="109" cy="58" rx="5.5" ry="6" fill="#0f172a" />
            <circle cx="110.5" cy="56" r="2.2" fill="#ffffff" />
            <circle cx="107.5" cy="60" r="1" fill="#ffffff" />

            {/* Royal Crown Beak */}
            <polygon points="100,64 92,72 108,72" fill="url(#m3CrownGold)" stroke="#78350f" strokeWidth="1.2" />

            {/* Officer Top Cap with Golden Feather Crest */}
            <g>
              <ellipse cx="100" cy="46" rx="16" ry="6" fill="#1e1b4b" stroke="#0f172a" strokeWidth="1.5" />
              <rect x="88" y="32" width="24" height="15" rx="3" fill="#1e1b4b" stroke="#0f172a" strokeWidth="1.5" />
              {/* Gold Cap Band & Badge */}
              <line x1="88" y1="44" x2="112" y2="44" stroke="#fbbf24" strokeWidth="2.5" />
              <circle cx="100" cy="38" r="3.5" fill="#fbbf24" />
              {/* Magnificent Royal Phoenix Feather Plume rising high from cap */}
              <path
                d="M100,32 C108,12 128,4 122,-10 C108,4 98,18 100,32 Z"
                fill="url(#m3FlameWing1)"
                stroke="#78350f"
                strokeWidth="1.2"
              />
              <path d="M100,30 C104,18 116,12 114,2 C106,10 100,20 100,30 Z" fill="#fef08a" opacity="0.8" />
            </g>

            {/* Glowing Pipeline Nodes floating around */}
            <g>
              <circle cx="28" cy="60" r="5" fill="#38bdf8" className="mascot-node-pulse" />
              <circle cx="172" cy="60" r="5" fill="#10b981" className="mascot-node-pulse" />
              <circle cx="100" cy="-14" r="4" fill="#fbbf24" className="mascot-node-pulse" />
            </g>
          </g>
        </svg>
      )
    }
  ];

  return (
    <section
      id="core-power-trio-section"
      style={{
        position: "relative",
        width: "100%",
        padding: "90px 24px 80px",
        background: colors.bg,
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <style>{`
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
        @keyframes nodePulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.45); opacity: 1; }
        }
        .mascot-anim-bob1 { animation: floatBob1 3.6s ease-in-out infinite; }
        .mascot-anim-soar { animation: floatSoar2 3.2s ease-in-out infinite; }
        .mascot-anim-phoenix { animation: floatPhoenix3 4.2s ease-in-out infinite; }
        .mascot-anim-spin { transform-origin: 94px 23px; animation: mascotSpin 3.5s linear infinite; }
        .mascot-halo-pulse { transform-origin: 130px 55px; animation: haloPulse 2.4s ease-in-out infinite; }
        .mascot-aura-radiate { transform-origin: 100px 80px; animation: auraRadiate 3s ease-in-out infinite; }
        .mascot-node-pulse { animation: nodePulse 2s ease-in-out infinite; }
      `}</style>

      {/* Ambient Central Glow */}
      <div style={{
        position: "absolute", top: "35%", left: "50%",
        transform: "translate(-50%, -50%)", width: "800px", height: "450px",
        background: "radial-gradient(circle, rgba(225, 73, 109, 0.18) 0%, rgba(56, 189, 248, 0.08) 50%, transparent 75%)",
        filter: "blur(90px)", pointerEvents: "none", zIndex: 1,
      }} />

      <div style={{ maxWidth: 1240, margin: "0 auto", position: "relative", zIndex: 10 }}>
        
        {/* Section Header */}
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "5px 14px", borderRadius: 99,
            background: isDark ? "rgba(225, 73, 109, 0.14)" : "rgba(148, 41, 69, 0.08)",
            border: `1px solid ${isDark ? "rgba(225, 73, 109, 0.3)" : "rgba(148, 41, 69, 0.2)"}`,
            color: isDark ? "#ff8da7" : "#942945",
            fontSize: 11, fontWeight: 700, fontFamily: "'Poppins', sans-serif",
            letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12,
          }}>
            <Sparkles size={13} color="#e1496d" />
            <span>POWER ENGINES • NEXT-GEN CREATIVE RIGS</span>
          </div>

          <h2 style={{
            fontFamily: "Syne, sans-serif",
            fontSize: "clamp(30px, 4.2vw, 50px)",
            fontWeight: 800,
            letterSpacing: "-0.035em",
            lineHeight: 1.1,
            color: colors.textPrimary,
            margin: "0 0 12px",
          }}>
            Build with <span style={{
              background: "linear-gradient(135deg, #e1496d 0%, #ff8da7 50%, #38bdf8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>3D, Templates & Pipelines</span><span style={{ color: "#e1496d" }}>.</span>
          </h2>

          <p style={{
            fontFamily: "'Instrument Sans', sans-serif",
            fontSize: "clamp(14px, 1.3vw, 16px)",
            color: colors.textMuted,
            maxWidth: 640, margin: "0 auto", lineHeight: 1.55,
          }}>
            From photorealistic 3D raytraced mockups to our community creator marketplace and autonomous spatial node pipelines.
          </p>
        </div>

        {/* ── 3 STAGGERED POWER CARDS WITH DETAILED MASCOTS AT VARIED HEIGHTS ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 30,
          alignItems: "stretch",
          paddingTop: 60, // Ample space for tallest mascot
        }}>
          {featureCards.map((card) => {
            const isHovered = hoveredCard === card.id;

            return (
              <div
                key={card.id}
                onMouseEnter={() => setHoveredCard(card.id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  position: "relative",
                  marginTop: card.marginTop, // Dynamic staggered altitude!
                  borderRadius: 26,
                  background: card.isFeatured
                    ? (isDark ? "linear-gradient(180deg, rgba(38, 11, 28, 0.98) 0%, rgba(20, 6, 16, 0.94) 100%)" : "linear-gradient(180deg, #ffffff 0%, #fff0f5 100%)")
                    : colors.cardBg,
                  border: card.isFeatured
                    ? `2.5px solid ${isDark ? "#e1496d" : "#e1496d"}`
                    : `1.5px solid ${isHovered ? card.accentColor : colors.cardBorder}`,
                  padding: card.isFeatured ? "48px 28px 34px" : "42px 28px 30px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  backdropFilter: "blur(28px)",
                  boxShadow: card.isFeatured
                    ? (isDark
                        ? "0 30px 80px rgba(0, 0, 0, 0.8), 0 0 50px rgba(225, 73, 109, 0.4)"
                        : "0 26px 65px rgba(148, 41, 69, 0.22), 0 0 35px rgba(225, 73, 109, 0.18)")
                    : (isHovered
                        ? (isDark ? "0 22px 55px rgba(0,0,0,0.65), 0 0 30px rgba(225, 73, 109, 0.2)" : "0 18px 45px rgba(148,41,69,0.14)")
                        : (isDark ? "0 12px 35px rgba(0,0,0,0.4)" : "0 8px 26px rgba(148,41,69,0.06)")),
                  transform: isHovered
                    ? "translateY(-10px) scale(1.025)"
                    : "none",
                  transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                  zIndex: card.isFeatured ? 14 : 10,
                }}
              >
                {/* Perched High-Detail Vector Mascot with Staggered Top Positioning */}
                <div style={{
                  position: "absolute",
                  top: card.mascotTop,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 170,
                  height: card.mascotHeight,
                  pointerEvents: "none",
                  zIndex: 25,
                }}>
                  {card.renderMascot()}
                </div>

                {/* Card Header & Content */}
                <div>
                  {/* Top Pill & Tag */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <span style={{
                      fontSize: 10, fontWeight: 800,
                      fontFamily: "'Poppins', sans-serif",
                      padding: "3px 10px", borderRadius: 99,
                      background: `${card.tagColor}18`,
                      color: card.tagColor,
                      border: `1px solid ${card.tagColor}35`,
                      letterSpacing: "0.08em", textTransform: "uppercase",
                    }}>
                      {card.tag}
                    </span>

                    <span style={{
                      fontSize: 11, fontWeight: 700,
                      color: isDark ? "#ff8da7" : "#831843",
                      fontFamily: "'Poppins', sans-serif",
                    }}>
                      {card.tagline}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 style={{
                    fontFamily: "Syne, sans-serif",
                    fontSize: 24,
                    fontWeight: 800,
                    color: colors.textPrimary,
                    margin: "0 0 10px",
                    lineHeight: 1.15,
                  }}>
                    {card.title}
                  </h3>

                  {/* Metric Box */}
                  <div style={{
                    padding: "10px 14px", borderRadius: 14,
                    background: card.gradient,
                    border: `1px solid ${card.accentColor}35`,
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    marginBottom: 16,
                  }}>
                    <span style={{ fontSize: 16, fontWeight: 800, fontFamily: "Syne, sans-serif", color: card.accentColor }}>
                      {card.metric}
                    </span>
                    <span style={{ fontSize: 10.5, fontWeight: 700, fontFamily: "'Poppins', sans-serif", color: colors.textMuted }}>
                      {card.metricLabel}
                    </span>
                  </div>

                  {/* Description */}
                  <p style={{
                    fontFamily: "'Instrument Sans', sans-serif",
                    fontSize: 13.5,
                    color: colors.textMuted,
                    lineHeight: 1.55,
                    margin: "0 0 20px",
                  }}>
                    {card.desc}
                  </p>

                  {/* Feature Checklist */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 26 }}>
                    {card.checklist.map((item, idx) => (
                      <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: 9 }}>
                        <div style={{
                          width: 17, height: 17, borderRadius: "50%",
                          background: `${card.accentColor}20`,
                          border: `1px solid ${card.accentColor}`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: card.accentColor, flexShrink: 0, marginTop: 2,
                        }}>
                          <Check size={10} strokeWidth={3} />
                        </div>
                        <span style={{
                          fontSize: 12,
                          color: isDark ? "rgba(255,255,255,0.85)" : "#374151",
                          fontFamily: "'Instrument Sans', sans-serif",
                          lineHeight: 1.45,
                        }}>
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Launch Button */}
                <button
                  onClick={() => onNavigate(card.route)}
                  style={{
                    width: "100%",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "13px 24px",
                    borderRadius: 14,
                    background: card.isFeatured
                      ? "linear-gradient(135deg, #e1496d, #942945)"
                      : (isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(148, 41, 69, 0.08)"),
                    border: card.isFeatured
                      ? "none"
                      : `1px solid ${isDark ? "rgba(225, 73, 109, 0.3)" : "rgba(148, 41, 69, 0.2)"}`,
                    color: card.isFeatured ? "#ffffff" : (isDark ? "#ffffff" : "#19040e"),
                    fontFamily: "Syne, sans-serif",
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all 0.25s ease",
                    boxShadow: card.isFeatured ? "0 6px 20px rgba(225,73,109,0.4)" : "none",
                  }}
                  onMouseEnter={(e) => {
                    if (!card.isFeatured) {
                      e.currentTarget.style.background = card.accentColor;
                      e.currentTarget.style.color = "#ffffff";
                      e.currentTarget.style.borderColor = "transparent";
                      e.currentTarget.style.boxShadow = `0 6px 20px ${card.accentColor}40`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!card.isFeatured) {
                      e.currentTarget.style.background = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(148, 41, 69, 0.08)";
                      e.currentTarget.style.color = isDark ? "#ffffff" : "#19040e";
                      e.currentTarget.style.borderColor = isDark ? "rgba(225, 73, 109, 0.3)" : "rgba(148, 41, 69, 0.2)";
                      e.currentTarget.style.boxShadow = "none";
                    }
                  }}
                >
                  <span>{card.actionLabel}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
