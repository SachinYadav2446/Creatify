import React, { useState, useRef } from "react";
import { ExternalLink, Heart, Sparkles } from "lucide-react";

export default function CommunityLandscapeBanner({ onNavigate, isDark }) {
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 18;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 12;
    setMouseOffset({ x, y });
  };

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
  };

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        position: "relative",
        width: "100%",
        margin: "0",
        padding: "0",
        overflow: "hidden",
        boxSizing: "border-box",
        background: isDark 
          ? "linear-gradient(180deg, #090207 0%, #150512 45%, #0c020a 100%)" 
          : "linear-gradient(180deg, #fbf2f6 0%, #fef8fa 40%, #edf7f4 100%)",
        color: isDark ? "#ffffff" : "#1a040d",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        userSelect: "none",
      }}
    >
      <style>{`
        @keyframes turbineSpinFast {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes turbineSpinMed {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes turbineSpinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes balloonFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-16px) rotate(2.5deg); }
        }
        @keyframes boatSway {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-5px) rotate(-2deg); }
        }
        @keyframes skiffSway {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-3px) rotate(1.5deg); }
        }
        @keyframes sparklePulse {
          0%, 100% { opacity: 0.25; transform: scale(0.75); }
          50% { opacity: 1; transform: scale(1.35); }
        }
        @keyframes cloudDrift1 {
          0% { transform: translateX(0px); }
          50% { transform: translateX(35px); }
          100% { transform: translateX(0px); }
        }
        @keyframes cloudDrift2 {
          0% { transform: translateX(0px); }
          50% { transform: translateX(-25px); }
          100% { transform: translateX(0px); }
        }
        @keyframes beaconBlink {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 1; }
        }
        @keyframes smokeRise {
          0% { transform: translateY(0px) scale(0.8); opacity: 0.7; }
          100% { transform: translateY(-24px) scale(1.6); opacity: 0; }
        }
        @keyframes birdFlap {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        @keyframes gliderSway {
          0%, 100% { transform: translateY(0px) rotate(-1deg); }
          50% { transform: translateY(-8px) rotate(2deg); }
        }
        @keyframes butterflyFlutter {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          25% { transform: translate(4px, -6px) scale(0.85); }
          50% { transform: translate(-3px, -10px) scale(1.1); }
          75% { transform: translate(5px, -4px) scale(0.9); }
        }
        @keyframes dragonflyHover {
          0%, 100% { transform: translate(0px, 0px); }
          50% { transform: translate(6px, -3px); }
        }
        @keyframes campfireFlicker {
          0%, 100% { transform: scale(1); opacity: 0.85; }
          50% { transform: scale(1.25); opacity: 1; }
        }
        @keyframes fishSplash {
          0%, 100% { transform: translateY(0px) scale(0.8); opacity: 0; }
          40% { transform: translateY(-12px) scale(1.1); opacity: 1; }
          70% { transform: translateY(0px) scale(0.9); opacity: 0.5; }
        }
        @keyframes rippleRing {
          0% { r: 2; opacity: 0.8; }
          100% { r: 16; opacity: 0; }
        }
        @keyframes duckFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
        }
      `}</style>
      
      {/* ── TOP SCENIC CURVED ARCH TRANSITION ── */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "55px",
        zIndex: 20,
        pointerEvents: "none",
      }}>
        <svg
          viewBox="0 0 1440 55"
          style={{ width: "100%", height: "100%", display: "block" }}
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 L1440,0 L1440,5 Q720,50 0,5 Z"
            fill={isDark ? "#070104" : "#fae6ee"}
          />
        </svg>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          TOP SECTION: SPONSOR & SUPPORTER SPOTLIGHT (BRIGHT CODE PLATFORM)
          ══════════════════════════════════════════════════════════════════════ */}
      <div style={{
        position: "relative",
        zIndex: 15,
        padding: "60px 24px 22px",
        maxWidth: "920px",
        margin: "0 auto",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}>

        {/* Floating Quote Marks Graphic Accent */}
        <div style={{
          fontSize: "44px",
          fontFamily: "Georgia, serif",
          fontWeight: 900,
          color: isDark ? "rgba(225, 73, 109, 0.45)" : "rgba(225, 73, 109, 0.28)",
          lineHeight: 0.6,
          marginBottom: 12,
        }}>
          “
        </div>

        {/* Supporter Badge */}
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "5px 18px",
          borderRadius: 99,
          background: isDark ? "rgba(225, 73, 109, 0.15)" : "rgba(255, 255, 255, 0.95)",
          border: `1.5px solid ${isDark ? "rgba(225, 73, 109, 0.35)" : "rgba(225, 73, 109, 0.22)"}`,
          boxShadow: isDark ? "0 4px 14px rgba(0,0,0,0.3)" : "0 4px 14px rgba(148, 41, 69, 0.06)",
          marginBottom: 14,
        }}>
          <Heart size={13} color="#e1496d" fill="#e1496d" />
          <span style={{
            fontSize: "11px",
            fontWeight: 800,
            fontFamily: "Syne, sans-serif",
            color: "#e1496d",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}>
            Official Ecosystem Sponsor & Supporter
          </span>
        </div>

        {/* Supporter Headline (Solid Clean Text, No Gradient) */}
        <h2 style={{
          margin: "0 0 12px",
          fontSize: "clamp(26px, 3.6vw, 40px)",
          fontWeight: 900,
          fontFamily: "Syne, sans-serif",
          letterSpacing: "-0.03em",
          color: isDark ? "#ffffff" : "#4a0e22",
          lineHeight: 1.15,
        }}>
          Powered & Supported by Bright Code
        </h2>

        {/* Description / Story + Future 2-Way UML & Team Integration */}
        <p style={{
          margin: "0 0 20px",
          fontSize: "14.5px",
          color: isDark ? "rgba(255,255,255,0.85)" : "#5a1827",
          maxWidth: "720px",
          lineHeight: 1.6,
        }}>
          <strong>Bright Code</strong> is a modern developer learning and coding platform. In upcoming releases, developers will be able to import their UML architecture diagrams, technical RFC specs, and visual DAG pipelines directly into Bright Code to collaborate in real-time with their engineering teams — and seamlessly sync interactive code sandboxes back into Creatify.
        </p>

        {/* Testimonial Quote Capsule */}
        <div style={{
          padding: "14px 26px",
          borderRadius: 16,
          background: isDark ? "rgba(18, 5, 14, 0.72)" : "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(16px)",
          border: `1px solid ${isDark ? "rgba(225, 73, 109, 0.25)" : "rgba(148, 41, 69, 0.15)"}`,
          boxShadow: isDark ? "0 8px 24px rgba(0,0,0,0.4)" : "0 6px 20px rgba(148, 41, 69, 0.06)",
          maxWidth: "680px",
          marginBottom: 18,
        }}>
          <p style={{
            margin: "0 0 6px",
            fontSize: "13.5px",
            fontStyle: "italic",
            lineHeight: 1.45,
            color: isDark ? "rgba(255,255,255,0.9)" : "#4a0e22",
          }}>
            “Enabling engineering teams to design 3D mockups, DAG pipelines, and architecture diagrams directly alongside their coding workspace is the future of collaborative software engineering.”
          </p>
          <div style={{
            fontSize: "11px",
            fontWeight: 800,
            fontFamily: "Syne, sans-serif",
            color: "#e1496d",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}>
            — Bright Code Engineering & Ecosystem Team
          </div>
        </div>

        {/* GitHub 100% Free & Open Source Direct Action Button */}
        <a
          href="https://github.com/SachinYadav2446/Creatify"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "9px 26px",
            borderRadius: 99,
            background: "linear-gradient(135deg, #e1496d, #942945)",
            border: "2px solid #ffffff",
            color: "#ffffff",
            fontSize: "12.5px",
            fontWeight: 800,
            fontFamily: "Syne, sans-serif",
            cursor: "pointer",
            textDecoration: "none",
            boxShadow: "0 8px 24px rgba(225, 73, 109, 0.4)",
            transition: "all 0.25s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05) translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 12px 32px rgba(225, 73, 109, 0.6)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1) translateY(0)";
            e.currentTarget.style.boxShadow = "0 8px 24px rgba(225, 73, 109, 0.4)";
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
          </svg>
          <span>100% FREE & OPEN SOURCE ON GITHUB</span>
          <ExternalLink size={13} style={{ opacity: 0.85 }} />
        </a>

      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          BOTTOM SECTION: CURVY MOUNTAINS, EXPANSIVE LAKE, DETAILED HOUSES & MICRO-DETAILS
          ══════════════════════════════════════════════════════════════════════ */}
      <div style={{
        position: "relative",
        width: "100%",
        height: "470px",
        overflow: "hidden",
        marginTop: "-15px",
      }}>

        {/* Scalable Multi-Layered SVG Panorama */}
        <svg
          viewBox="0 0 1440 470"
          style={{
            width: "100%",
            height: "100%",
            display: "block",
            transform: `scale(1.02) translate(${mouseOffset.x * 0.22}px, ${mouseOffset.y * 0.18}px)`,
            transition: "transform 0.15s ease-out",
          }}
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            {/* Sky Horizon Gradient */}
            <linearGradient id="artSkyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={isDark ? "#12040f" : "#fef8fa"} />
              <stop offset="35%" stopColor={isDark ? "#24081c" : "#fae0ec"} />
              <stop offset="70%" stopColor={isDark ? "#48092a" : "#f2bfd2"} />
              <stop offset="100%" stopColor={isDark ? "#681037" : "#e4a7be"} />
            </linearGradient>

            {/* Radiant Sun Glow */}
            <radialGradient id="artSunGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="25%" stopColor="#ff8da7" stopOpacity="0.75" />
              <stop offset="55%" stopColor="#e1496d" stopOpacity="0.3" />
              <stop offset="85%" stopColor="#942945" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#942945" stopOpacity="0" />
            </radialGradient>

            {/* Curvy Mountain Gradients */}
            <linearGradient id="curvyMtnFarGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={isDark ? "#480a2f" : "#e29cb0"} />
              <stop offset="60%" stopColor={isDark ? "#2e061e" : "#ba6881"} />
              <stop offset="100%" stopColor={isDark ? "#190310" : "#8e3d55"} />
            </linearGradient>
            <linearGradient id="curvyMtnMidGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={isDark ? "#63103c" : "#cf5e81"} />
              <stop offset="50%" stopColor={isDark ? "#430926" : "#a13c59"} />
              <stop offset="100%" stopColor={isDark ? "#220413" : "#691b32"} />
            </linearGradient>

            {/* Rolling Green Hills Gradients */}
            <linearGradient id="hillGreenGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={isDark ? "#1e5340" : "#57b88e"} />
              <stop offset="60%" stopColor={isDark ? "#13382b" : "#328564"} />
              <stop offset="100%" stopColor={isDark ? "#0a1e17" : "#1c563f"} />
            </linearGradient>
            <linearGradient id="hillGreenGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={isDark ? "#296e54" : "#6ecea6"} />
              <stop offset="70%" stopColor={isDark ? "#184535" : "#3fa27a"} />
              <stop offset="100%" stopColor={isDark ? "#0d261d" : "#24664c"} />
            </linearGradient>

            {/* Deep Expansive Crystal-Clear Bluish Lake Gradient */}
            <linearGradient id="lakeWaterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={isDark ? "#062238" : "#0284c7"} />
              <stop offset="30%" stopColor={isDark ? "#0c3b5e" : "#0ea5e9"} />
              <stop offset="65%" stopColor={isDark ? "#061f36" : "#0369a1"} />
              <stop offset="100%" stopColor={isDark ? "#030f1c" : "#075985"} />
            </linearGradient>

            {/* Paved Dedicated Asphalt Velo Track Gradient (Slate / Charcoal) */}
            <linearGradient id="cycleTrackGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={isDark ? "#0f172a" : "#334155"} />
              <stop offset="45%" stopColor={isDark ? "#1e293b" : "#475569"} />
              <stop offset="100%" stopColor={isDark ? "#0f172a" : "#1e293b"} />
            </linearGradient>
          </defs>

          {/* ════════ 1. ATMOSPHERIC SKY & GOD RAYS ════════ */}
          <rect width="1440" height="470" fill="url(#artSkyGrad)" />

          {/* Glowing Radial Sun Orb */}
          <circle cx="720" cy="150" r="160" fill="url(#artSunGrad)" />

          {/* Sun Rays Beam Streaks */}
          <g opacity={isDark ? "0.08" : "0.18"}>
            <polygon points="720,150 520,0 580,0" fill="#ffffff" />
            <polygon points="720,150 660,0 720,0" fill="#ffffff" />
            <polygon points="720,150 840,0 900,0" fill="#ffffff" />
            <polygon points="720,150 1020,0 1100,0" fill="#ffffff" />
            <polygon points="720,150 380,0 430,0" fill="#ffffff" />
          </g>

          {/* Flock of Birds in V-Formation */}
          <g style={{ animation: "birdFlap 3s ease-in-out infinite", opacity: 0.65 }}>
            <path d="M460,75 Q465,68 470,75 Q475,68 480,75" stroke={isDark ? "#ffffff" : "#4a0e22"} strokeWidth="1.8" fill="none" strokeLinecap="round" />
            <path d="M490,68 Q494,62 498,68 Q502,62 506,68" stroke={isDark ? "#ffffff" : "#4a0e22"} strokeWidth="1.6" fill="none" strokeLinecap="round" />
            <path d="M516,62 Q519,57 523,62 Q527,57 530,62" stroke={isDark ? "#ffffff" : "#4a0e22"} strokeWidth="1.4" fill="none" strokeLinecap="round" />
            <path d="M475,87 Q478,82 482,87 Q486,82 490,87" stroke={isDark ? "#ffffff" : "#4a0e22"} strokeWidth="1.4" fill="none" strokeLinecap="round" />
          </g>

          {/* Alpine Paraglider / Hang Glider in the High Thermals */}
          <g transform="translate(380, 80) scale(0.85)" style={{ animation: "gliderSway 5s ease-in-out infinite" }}>
            {/* Arched Paraglider Wing Canopy */}
            <path d="M0,0 Q24,-14 48,0 Q24,-6 0,0" fill="#e1496d" />
            <path d="M12,-4 Q24,-12 36,-4 Q24,-7 12,-4" fill="#facc15" />
            {/* Suspension Lines */}
            <line x1="4" y1="0" x2="24" y2="18" stroke="rgba(255,255,255,0.7)" strokeWidth="0.8" />
            <line x1="16" y1="-2" x2="24" y2="18" stroke="rgba(255,255,255,0.7)" strokeWidth="0.8" />
            <line x1="32" y1="-2" x2="24" y2="18" stroke="rgba(255,255,255,0.7)" strokeWidth="0.8" />
            <line x1="44" y1="0" x2="24" y2="18" stroke="rgba(255,255,255,0.7)" strokeWidth="0.8" />
            {/* Pilot Harness */}
            <ellipse cx="24" cy="19" rx="2.5" ry="3.5" fill="#0284c7" />
            <circle cx="24" cy="16" r="1.5" fill="#f59e0b" />
          </g>

          {/* Layered Floating Clouds */}
          <g style={{ animation: "cloudDrift1 22s ease-in-out infinite" }}>
            <path
              d="M120,75 Q150,45 190,58 Q235,35 280,58 Q315,75 295,98 L130,98 Z"
              fill={isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.75)"}
            />
            <path
              d="M1120,65 Q1155,40 1195,52 Q1230,32 1270,52 Q1300,68 1285,90 L1130,90 Z"
              fill={isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.75)"}
            />
          </g>
          <g style={{ animation: "cloudDrift2 26s ease-in-out infinite" }}>
            <path
              d="M620,50 Q645,30 675,40 Q705,22 740,40 Q765,55 750,72 L630,72 Z"
              fill={isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.55)"}
            />
          </g>

          {/* ════════ 2. HOT AIR BALLOON ════════ */}
          <g style={{ animation: "balloonFloat 6.5s ease-in-out infinite", transformOrigin: "910px 70px" }}>
            <path
              d="M910,25 C882,25 866,53 876,87 C885,109 900,125 905,135 L915,135 C920,125 935,109 944,87 C954,53 938,25 910,25 Z"
              fill="#e1496d"
            />
            <path
              d="M910,25 C898,25 888,53 894,87 C899,109 907,125 910,135 C913,125 921,109 926,87 C932,53 922,25 910,25 Z"
              fill="#38bdf8"
            />
            <path
              d="M910,25 C904,25 898,53 902,87 C905,109 909,125 910,135 C911,125 915,109 918,87 C922,53 916,25 910,25 Z"
              fill="#ffffff"
            />
            <path d="M878,77 Q910,87 942,77" stroke="#facc15" strokeWidth="2.5" fill="none" />
            <line x1="905" y1="135" x2="907" y2="147" stroke={isDark ? "#ffffff" : "#4a0e22"} strokeWidth="1.2" />
            <line x1="915" y1="135" x2="913" y2="147" stroke={isDark ? "#ffffff" : "#4a0e22"} strokeWidth="1.2" />
            <circle cx="910" cy="139" r="2.5" fill="#f59e0b" style={{ animation: "sparklePulse 1s infinite" }} />
            <rect x="904" y="147" width="12" height="9" rx="2" fill="#b45309" stroke="#78350f" strokeWidth="1" />
          </g>

          {/* ════════ 3. CURVY ALPINE MOUNTAINS ════════ */}
          <path
            d="M0,220 C80,180 180,130 280,165 C380,200 440,95 540,85 C640,95 700,175 800,140 C900,105 980,180 1080,160 C1180,140 1260,80 1340,90 C1400,100 1440,150 1440,170 L1440,470 L0,470 Z"
            fill="url(#curvyMtnFarGrad)"
            opacity={isDark ? "0.65" : "0.78"}
          />
          <path d="M540,85 C515,108 528,122 540,126 C552,122 565,108 540,85 Z" fill="#ffffff" opacity="0.9" />
          <path d="M1340,90 C1318,110 1330,124 1340,128 C1350,124 1362,110 1340,90 Z" fill="#ffffff" opacity="0.9" />

          {/* Mountain High-Altitude Telemetry Relay Antenna on Peak */}
          <g transform="translate(540, 85)">
            <line x1="0" y1="0" x2="0" y2="-18" stroke="#ffffff" strokeWidth="1.2" />
            <line x1="-3" y1="-10" x2="3" y2="-10" stroke="#ffffff" strokeWidth="1" />
            <line x1="-2" y1="-14" x2="2" y2="-14" stroke="#ffffff" strokeWidth="1" />
            <circle cx="0" cy="-19" r="1.5" fill="#38bdf8" style={{ animation: "beaconBlink 1.2s infinite" }} />
          </g>

          <path
            d="M0,240 C140,190 260,225 400,160 C520,95 620,190 760,180 C900,170 1020,115 1160,120 C1280,125 1380,210 1440,190 L1440,470 L0,470 Z"
            fill="url(#curvyMtnMidGrad)"
          />

          {/* ════════ 4. ADVANCED WIND TURBINES ARRAY ════════ */}
          <g transform="translate(190, 140)">
            <polygon points="-3,75 3,75 1.5,0 -1.5,0" fill="#ffffff" stroke={isDark ? "rgba(0,0,0,0.4)" : "rgba(148,41,69,0.3)"} strokeWidth="0.8" />
            <rect x="-4" y="-3" width="9" height="5" rx="1.5" fill="#f1f5f9" />
            <circle cx="0" cy="-4" r="1.5" fill="#ef4444" style={{ animation: "beaconBlink 1.2s infinite" }} />
            <g style={{ animation: "turbineSpinFast 3.5s linear infinite", transformOrigin: "0px 0px" }}>
              <path d="M0,0 L-2,-42 Q0,-46 2,-42 L0,0 Z" fill="#ffffff" stroke="rgba(0,0,0,0.15)" strokeWidth="0.5" />
              <line x1="0" y1="0" x2="0" y2="-42" stroke="#e1496d" strokeWidth="1" />
              <g transform="rotate(120)"><path d="M0,0 L-2,-42 Q0,-46 2,-42 L0,0 Z" fill="#ffffff" /><line x1="0" y1="0" x2="0" y2="-42" stroke="#e1496d" strokeWidth="1" /></g>
              <g transform="rotate(240)"><path d="M0,0 L-2,-42 Q0,-46 2,-42 L0,0 Z" fill="#ffffff" /><line x1="0" y1="0" x2="0" y2="-42" stroke="#e1496d" strokeWidth="1" /></g>
              <circle cx="0" cy="0" r="3.5" fill="#e1496d" />
            </g>
          </g>

          <g transform="translate(95, 165) scale(0.75)">
            <polygon points="-3,75 3,75 1.5,0 -1.5,0" fill="#ffffff" />
            <rect x="-4" y="-3" width="9" height="5" rx="1.5" fill="#f1f5f9" />
            <circle cx="0" cy="-4" r="1.5" fill="#ef4444" style={{ animation: "beaconBlink 1.4s infinite 0.3s" }} />
            <g style={{ animation: "turbineSpinMed 4.2s linear infinite", transformOrigin: "0px 0px" }}>
              <path d="M0,0 L-2,-42 Q0,-46 2,-42 L0,0 Z" fill="#ffffff" />
              <g transform="rotate(120)"><path d="M0,0 L-2,-42 Q0,-46 2,-42 L0,0 Z" fill="#ffffff" /></g>
              <g transform="rotate(240)"><path d="M0,0 L-2,-42 Q0,-46 2,-42 L0,0 Z" fill="#ffffff" /></g>
              <circle cx="0" cy="0" r="3.5" fill="#e1496d" />
            </g>
          </g>

          <g transform="translate(1310, 135) scale(0.88)">
            <polygon points="-3,75 3,75 1.5,0 -1.5,0" fill="#ffffff" />
            <rect x="-4" y="-3" width="9" height="5" rx="1.5" fill="#f1f5f9" />
            <circle cx="0" cy="-4" r="1.5" fill="#ef4444" style={{ animation: "beaconBlink 1.6s infinite 0.7s" }} />
            <g style={{ animation: "turbineSpinSlow 3.8s linear infinite", transformOrigin: "0px 0px" }}>
              <path d="M0,0 L-2,-42 Q0,-46 2,-42 L0,0 Z" fill="#ffffff" />
              <line x1="0" y1="0" x2="0" y2="-42" stroke="#38bdf8" strokeWidth="1" />
              <g transform="rotate(120)"><path d="M0,0 L-2,-42 Q0,-46 2,-42 L0,0 Z" fill="#ffffff" /></g>
              <g transform="rotate(240)"><path d="M0,0 L-2,-42 Q0,-46 2,-42 L0,0 Z" fill="#ffffff" /></g>
              <circle cx="0" cy="0" r="3.5" fill="#38bdf8" />
            </g>
          </g>

          {/* ════════ 5. CURVED GREEN TERRACES & LAKESIDE MEADOWS ════════ */}
          <path
            d="M0,260 C240,210 480,260 720,225 C960,190 1200,240 1440,220 L1440,470 L0,470 Z"
            fill="url(#hillGreenGrad1)"
          />
          <path
            d="M0,280 C260,235 500,280 760,245 C1020,210 1240,260 1440,240 L1440,470 L0,470 Z"
            fill="url(#hillGreenGrad2)"
          />

          {/* Midground Miniature Charming Cottages */}
          <g transform="translate(680, 220) scale(0.65)">
            <polygon points="0,18 20,0 40,18" fill="#942945" />
            <rect x="5" y="18" width="30" height="18" fill={isDark ? "#1a040d" : "#ffffff"} stroke="#942945" strokeWidth="1.5" />
            <rect x="10" y="22" width="8" height="8" fill="#facc15" />
            <rect x="23" y="22" width="8" height="14" fill="#e1496d" />
            <rect x="28" y="-6" width="5" height="10" fill="#78350f" />
            <circle cx="30" cy="-10" r="2.5" fill="rgba(255,255,255,0.6)" style={{ animation: "smokeRise 3s infinite" }} />
          </g>
          <g transform="translate(860, 210) scale(0.58)">
            <polygon points="0,18 20,0 40,18" fill="#16a34a" />
            <rect x="5" y="18" width="30" height="18" fill={isDark ? "#061a12" : "#ffffff"} stroke="#16a34a" strokeWidth="1.5" />
            <rect x="10" y="22" width="8" height="8" fill="#facc15" />
            <rect x="28" y="-6" width="5" height="10" fill="#78350f" />
          </g>

          {/* ════════ 6. DETAILED ARCHITECTURAL HOUSES & VILLAS ════════ */}
          
          {/* ── HOUSE LEFT: SCANDINAVIAN SOLAR A-FRAME VILLA ── */}
          <g transform="translate(170, 205)">
            <rect x="-4" y="38" width="96" height="8" rx="2" fill="#64748b" stroke="#334155" strokeWidth="1.2" />
            <rect x="0" y="34" width="88" height="5" fill="#b45309" />
            <line x1="6" y1="26" x2="6" y2="34" stroke="#78350f" strokeWidth="2" />
            <line x1="82" y1="26" x2="82" y2="34" stroke="#78350f" strokeWidth="2" />
            <line x1="4" y1="26" x2="84" y2="26" stroke="#78350f" strokeWidth="2" />

            <rect x="8" y="8" width="72" height="28" fill={isDark ? "#220818" : "#ffffff"} stroke="#942945" strokeWidth="2" />
            <line x1="8" y1="16" x2="80" y2="16" stroke="rgba(148,41,69,0.15)" strokeWidth="1" />
            <line x1="8" y1="24" x2="80" y2="24" stroke="rgba(148,41,69,0.15)" strokeWidth="1" />

            <polygon points="2,8 44,-16 86,8" fill="#942945" stroke="#701a30" strokeWidth="1.5" />
            <polygon points="12,6 44,-12 76,6" fill="#0284c7" />
            <line x1="28" y1="-2" x2="60" y2="-2" stroke="#38bdf8" strokeWidth="1" />
            <line x1="44" y1="-12" x2="44" y2="6" stroke="#38bdf8" strokeWidth="1" />

            <rect x="16" y="14" width="22" height="16" rx="2" fill="#0f172a" stroke="#e1496d" strokeWidth="1.5" />
            <rect x="18" y="16" width="18" height="12" fill="#fef08a" opacity="0.9" />
            <line x1="27" y1="16" x2="27" y2="28" stroke="#942945" strokeWidth="1.2" />
            <line x1="18" y1="22" x2="36" y2="22" stroke="#942945" strokeWidth="1.2" />
            
            <rect x="15" y="30" width="24" height="4" rx="1" fill="#78350f" />
            <circle cx="18" cy="30" r="2" fill="#ef4444" />
            <circle cx="23" cy="29" r="2" fill="#facc15" />
            <circle cx="28" cy="30" r="2" fill="#ef4444" />
            <circle cx="33" cy="29" r="2" fill="#facc15" />

            <rect x="52" y="14" width="14" height="22" fill="#e1496d" rx="1" stroke="#942945" strokeWidth="1.2" />
            <circle cx="62" cy="26" r="1.2" fill="#facc15" />
            <rect x="54" y="17" width="10" height="6" fill="#ffffff" opacity="0.8" rx="0.5" />
            <circle cx="48" cy="18" r="2.5" fill="#facc15" style={{ animation: "sparklePulse 1.6s infinite" }} />

            <rect x="62" y="-18" width="10" height="18" fill="#b91c1c" stroke="#7f1d1d" strokeWidth="1" />
            <rect x="60" y="-20" width="14" height="3" fill="#78350f" />
            <circle cx="67" cy="-24" r="3.5" fill="rgba(255,255,255,0.7)" style={{ animation: "smokeRise 2.4s infinite" }} />
            <circle cx="69" cy="-32" r="5" fill="rgba(255,255,255,0.4)" style={{ animation: "smokeRise 2.4s infinite 0.7s" }} />

            <g transform="translate(86, 24)">
              <line x1="0" y1="12" x2="24" y2="12" stroke="#ffffff" strokeWidth="1.5" />
              <line x1="4" y1="4" x2="4" y2="16" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
              <line x1="12" y1="4" x2="12" y2="16" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
              <line x1="20" y1="4" x2="20" y2="16" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
            </g>
          </g>

          {/* ── HOUSE RIGHT: MODERN TECH GLASSHOUSE VILLA ── */}
          <g transform="translate(1140, 205)">
            <rect x="0" y="38" width="90" height="8" rx="2" fill="#14532d" stroke="#052e16" strokeWidth="1.2" />
            <rect x="6" y="10" width="76" height="30" fill={isDark ? "#061a12" : "#ffffff"} stroke="#16a34a" strokeWidth="2" />
            
            <rect x="14" y="16" width="34" height="22" fill="#042f2e" stroke="#2dd4bf" strokeWidth="1.5" rx="1" />
            <line x1="18" y1="20" x2="24" y2="20" stroke="#38bdf8" strokeWidth="1.5" />
            <line x1="18" y1="24" x2="22" y2="24" stroke="#22c55e" strokeWidth="1.5" />
            <line x1="18" y1="28" x2="25" y2="28" stroke="#facc15" strokeWidth="1.5" />
            <line x1="31" y1="16" x2="31" y2="38" stroke="#2dd4bf" strokeWidth="1.2" />

            <rect x="52" y="10" width="32" height="16" fill="#065f46" rx="1" />
            <rect x="54" y="12" width="28" height="12" fill="#38bdf8" opacity="0.6" rx="1" />
            <line x1="52" y1="26" x2="84" y2="26" stroke="#ffffff" strokeWidth="1.5" />

            <polygon points="2,10 44,-10 86,6" fill="#16a34a" />
            <polygon points="8,8 44,-6 80,6" fill="#38bdf8" />

            <g transform="translate(-25, 20)">
              <line x1="12" y1="0" x2="12" y2="20" stroke="#78350f" strokeWidth="2" />
              <path d="M0,0 Q12,-12 24,0 Z" fill="#e1496d" />
              <rect x="2" y="18" width="20" height="4" fill="#b45309" rx="1" />
            </g>
          </g>

          {/* ════════ 7. HIGH-DETAIL BOTANICAL TREES, SHRUBS & FLOWERING BUSHES ════════ */}
          
          {/* ── LEFT MEADOW EVERGREEN PINE GROVE ── */}
          <g transform="translate(45, 225) scale(1.15)">
            <ellipse cx="0" cy="18" rx="12" ry="3" fill="rgba(0,0,0,0.25)" />
            <polygon points="0,0 12,-14 -12,-14" fill="#0f3d24" />
            <polygon points="0,-8 10,-22 -10,-22" fill="#14532d" />
            <polygon points="0,-16 8,-28 -8,-28" fill="#16a34a" />
            <polygon points="0,-24 5,-34 -5,-34" fill="#22c55e" />
            <rect x="-2" y="0" width="4" height="16" fill="#78350f" stroke="#451a03" strokeWidth="0.6" />
            <line x1="0" y1="2" x2="0" y2="14" stroke="#451a03" strokeWidth="0.8" />
          </g>

          <g transform="translate(115, 238) scale(0.95)">
            <ellipse cx="0" cy="16" rx="10" ry="2.5" fill="rgba(0,0,0,0.2)" />
            <polygon points="0,0 11,-12 -11,-12" fill="#0f3d24" />
            <polygon points="0,-7 9,-19 -9,-19" fill="#14532d" />
            <polygon points="0,-14 7,-25 -7,-25" fill="#16a34a" />
            <polygon points="0,-20 4,-30 -4,-30" fill="#4ade80" />
            <rect x="-1.8" y="0" width="3.6" height="14" fill="#78350f" />
          </g>

          <g transform="translate(150, 248) scale(0.8)">
            <polygon points="0,0 10,-12 -10,-12" fill="#14532d" />
            <polygon points="0,-7 8,-18 -8,-18" fill="#16a34a" />
            <polygon points="0,-13 5,-24 -5,-24" fill="#22c55e" />
            <rect x="-1.5" y="0" width="3" height="10" fill="#78350f" />
          </g>

          {/* ── RIGHT HILLSIDE ORCHARD & FLOWERING CANOPY TREES ── */}
          <g transform="translate(1060, 220) scale(1.05)">
            <ellipse cx="0" cy="16" rx="18" ry="4" fill="rgba(0,0,0,0.22)" />
            <path d="M-3,16 L-2,0 L-8,-8 M2,0 L7,-6 M0,0 L0,-12" stroke="#5c2b09" strokeWidth="3.2" strokeLinecap="round" fill="none" />
            <circle cx="-10" cy="-14" r="14" fill="#14532d" />
            <circle cx="10" cy="-12" r="13" fill="#15803d" />
            <circle cx="0" cy="-22" r="15" fill="#16a34a" />
            <circle cx="-4" cy="-24" r="10" fill="#22c55e" opacity="0.9" />
            <circle cx="6" cy="-18" r="8" fill="#4ade80" opacity="0.8" />
            <circle cx="-8" cy="-12" r="1.8" fill="#ef4444" />
            <circle cx="4" cy="-22" r="1.8" fill="#ef4444" />
            <circle cx="8" cy="-10" r="1.8" fill="#ef4444" />
            <circle cx="-2" cy="-18" r="1.8" fill="#ef4444" />
          </g>

          <g transform="translate(1260, 215) scale(1.2)">
            <ellipse cx="0" cy="16" rx="20" ry="4" fill="rgba(0,0,0,0.22)" />
            <path d="M-3,16 L-1,0 L-7,-7 M1,0 L6,-5 M0,0 L0,-10" stroke="#5c2b09" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <circle cx="-12" cy="-15" r="15" fill="#0f3d24" />
            <circle cx="11" cy="-13" r="14" fill="#14532d" />
            <circle cx="0" cy="-24" r="16" fill="#16a34a" />
            <circle cx="-4" cy="-26" r="11" fill="#22c55e" opacity="0.9" />
            <circle cx="7" cy="-20" r="9" fill="#86efac" opacity="0.8" />
          </g>

          {/* Picnic Blanket under Canopy Tree */}
          <g transform="translate(1015, 236) scale(0.8)">
            <polygon points="0,6 24,0 30,12 6,18" fill="#ef4444" stroke="#ffffff" strokeWidth="1" />
            <line x1="8" y1="2" x2="14" y2="14" stroke="#ffffff" strokeWidth="1.2" />
            <line x1="16" y1="0" x2="22" y2="12" stroke="#ffffff" strokeWidth="1.2" />
            <ellipse cx="14" cy="8" rx="2.5" ry="2" fill="#cbd5e1" /> {/* Silver Teapot */}
            <circle cx="19" cy="9" r="1.2" fill="#ffffff" /> {/* Cup */}
          </g>

          {/* Midground Tree (Center Meadow) */}
          <g transform="translate(780, 228) scale(0.7)">
            <ellipse cx="0" cy="14" rx="14" ry="3" fill="rgba(0,0,0,0.2)" />
            <rect x="-2" y="0" width="4" height="14" fill="#78350f" />
            <circle cx="-8" cy="-10" r="11" fill="#14532d" />
            <circle cx="8" cy="-8" r="10" fill="#16a34a" />
            <circle cx="0" cy="-16" r="12" fill="#22c55e" />
          </g>

          {/* ── LAKESIDE FLOWERING BUSHES & BOTANICAL SHRUBS ── */}
          <g transform="translate(260, 260)">
            <ellipse cx="0" cy="0" rx="22" ry="10" fill="#14532d" />
            <ellipse cx="12" cy="-3" rx="18" ry="9" fill="#16a34a" />
            <ellipse cx="-10" cy="-2" rx="16" ry="8" fill="#22c55e" />
            <circle cx="-12" cy="-4" r="2.2" fill="#ff8da7" />
            <circle cx="-6" cy="-6" r="2.5" fill="#facc15" />
            <circle cx="2" cy="-4" r="2.2" fill="#ffffff" />
            <circle cx="10" cy="-5" r="2.5" fill="#ff8da7" />
            <circle cx="18" cy="-3" r="2.2" fill="#facc15" />
            <circle cx="6" cy="0" r="2.2" fill="#e1496d" />
          </g>

          {/* Fluttering Rose Butterfly */}
          <g transform="translate(290, 252)" style={{ animation: "butterflyFlutter 3.2s ease-in-out infinite" }}>
            <circle cx="0" cy="0" r="1" fill="#0f172a" />
            <ellipse cx="-2.5" cy="-2" rx="2.5" ry="2" fill="#ff8da7" />
            <ellipse cx="2.5" cy="-2" rx="2.5" ry="2" fill="#ff8da7" />
          </g>

          <g transform="translate(320, 280)">
            <ellipse cx="0" cy="0" rx="24" ry="11" fill="#15803d" />
            <ellipse cx="-12" cy="-4" rx="18" ry="8" fill="#16a34a" />
            <ellipse cx="12" cy="-3" rx="18" ry="9" fill="#4ade80" />
            <circle cx="-14" cy="-5" r="2" fill="#c084fc" />
            <circle cx="-7" cy="-7" r="2.2" fill="#facc15" />
            <circle cx="0" cy="-5" r="2.5" fill="#ff8da7" />
            <circle cx="8" cy="-6" r="2.2" fill="#c084fc" />
            <circle cx="16" cy="-4" r="2.5" fill="#facc15" />
          </g>

          {/* Fluttering Cyan Butterfly */}
          <g transform="translate(345, 270)" style={{ animation: "butterflyFlutter 4s ease-in-out infinite 1s" }}>
            <circle cx="0" cy="0" r="1" fill="#0f172a" />
            <ellipse cx="-2.5" cy="-2" rx="2.5" ry="2" fill="#38bdf8" />
            <ellipse cx="2.5" cy="-2" rx="2.5" ry="2" fill="#38bdf8" />
          </g>

          <g transform="translate(390, 295)">
            <ellipse cx="0" cy="0" rx="18" ry="8" fill="#14532d" />
            <ellipse cx="8" cy="-2" rx="14" ry="7" fill="#22c55e" />
            <circle cx="-6" cy="-3" r="2" fill="#ff8da7" />
            <circle cx="4" cy="-4" r="2.2" fill="#facc15" />
            <circle cx="10" cy="-2" r="1.8" fill="#ffffff" />
          </g>

          {/* Right Shoreline Blooming Shrubbery */}
          <g transform="translate(1190, 265)">
            <ellipse cx="0" cy="0" rx="26" ry="11" fill="#14532d" />
            <ellipse cx="-10" cy="-4" rx="18" ry="9" fill="#16a34a" />
            <ellipse cx="12" cy="-3" rx="18" ry="9" fill="#22c55e" />
            <circle cx="-14" cy="-5" r="2.2" fill="#ff8da7" />
            <circle cx="-4" cy="-7" r="2.5" fill="#facc15" />
            <circle cx="6" cy="-5" r="2.2" fill="#ff8da7" />
            <circle cx="16" cy="-4" r="2.5" fill="#38bdf8" />
          </g>

          {/* Fluttering Gold Butterfly */}
          <g transform="translate(1215, 255)" style={{ animation: "butterflyFlutter 3.6s ease-in-out infinite 0.5s" }}>
            <circle cx="0" cy="0" r="1" fill="#0f172a" />
            <ellipse cx="-2.5" cy="-2" rx="2.5" ry="2" fill="#facc15" />
            <ellipse cx="2.5" cy="-2" rx="2.5" ry="2" fill="#facc15" />
          </g>

          {/* Cozy Lakeside Campfire with Stone Ring & Embers */}
          <g transform="translate(710, 298)">
            <ellipse cx="0" cy="4" rx="14" ry="5" fill="#475569" stroke="#1e293b" strokeWidth="1" />
            {/* Logs in X */}
            <line x1="-8" y1="2" x2="8" y2="6" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="-8" y1="6" x2="8" y2="2" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />
            {/* Flickering Fire Flame */}
            <polygon points="-4,3 0,-7 4,3" fill="#f59e0b" style={{ animation: "campfireFlicker 1.4s infinite" }} />
            <polygon points="-2,3 0,-4 2,3" fill="#ef4444" style={{ animation: "campfireFlicker 1s infinite 0.3s" }} />
            <circle cx="0" cy="-2" r="1.5" fill="#facc15" />
          </g>

          {/* ════════ 8. PROMINENT EXPANSIVE CRYSTAL-BLUE LAKE ════════ */}
          <path
            d="M340,290 C560,240 920,250 1260,270 C1380,280 1440,310 1440,470 L320,470 C250,400 320,325 340,290 Z"
            fill={isDark ? "#082035" : "#e0f2fe"}
          />
          <path
            d="M360,300 C580,255 920,265 1240,285 C1360,295 1440,325 1440,470 L340,470 C280,410 340,335 360,300 Z"
            fill="url(#lakeWaterGrad)"
          />

          {/* Lake Shore Reeds, Cattails & Wild Grass Tussocks */}
          <g transform="translate(370, 310)">
            <path d="M0,0 Q-4,-14 -2,-22 M4,2 Q6,-12 4,-20 M8,0 Q12,-10 10,-18 M-4,0 Q-8,-8 -6,-14" stroke="#16a34a" strokeWidth="1.8" fill="none" />
            <rect x="-3" y="-24" width="2.2" height="6" rx="1" fill="#78350f" />
            <rect x="3" y="-22" width="2.2" height="6" rx="1" fill="#78350f" />
          </g>
          <g transform="translate(1260, 305)">
            <path d="M0,0 Q-4,-14 -2,-22 M4,2 Q6,-12 4,-20 M8,0 Q12,-10 10,-18 M-4,0 Q-8,-8 -6,-14" stroke="#16a34a" strokeWidth="1.8" fill="none" />
            <rect x="-3" y="-24" width="2.2" height="6" rx="1" fill="#78350f" />
          </g>

          {/* Wooden Dock Pier with Mooring Posts */}
          <g transform="translate(490, 335)">
            <polygon points="0,0 45,-12 55,-4 10,8" fill="#b45309" stroke="#78350f" strokeWidth="1.2" />
            <line x1="45" y1="-12" x2="45" y2="6" stroke="#451a03" strokeWidth="2.5" />
            <line x1="55" y1="-4" x2="55" y2="12" stroke="#451a03" strokeWidth="2.5" />
            <line x1="22" y1="-6" x2="22" y2="10" stroke="#451a03" strokeWidth="2.5" />
            <circle cx="53" cy="-8" r="2.5" fill="#facc15" style={{ animation: "sparklePulse 1.5s infinite" }} />
          </g>

          {/* Small Wooden Rowboat / Skiff Tied to the Dock */}
          <g transform="translate(545, 340)" style={{ animation: "skiffSway 3.8s ease-in-out infinite", transformOrigin: "0px 0px" }}>
            {/* Shadow */}
            <ellipse cx="14" cy="12" rx="16" ry="3" fill="rgba(2,132,199,0.4)" />
            {/* Hull */}
            <path d="M0,4 L28,0 L26,10 L4,12 Z" fill="#b45309" stroke="#78350f" strokeWidth="1" />
            <line x1="12" y1="2" x2="12" y2="10" stroke="#78350f" strokeWidth="1" /> {/* Seat Thwart */}
            <line x1="10" y1="0" x2="20" y2="14" stroke="#e2e8f0" strokeWidth="1" /> {/* Oar */}
            {/* Mooring Line to Pier */}
            <path d="M0,4 Q-6,6 -8,1" stroke="#fef08a" strokeWidth="0.8" fill="none" />
          </g>

          {/* Caustic Lake Ripples */}
          <path d="M520,335 Q680,320 840,335 M960,345 Q1120,332 1280,350 M620,380 Q780,368 940,382" stroke="rgba(255,255,255,0.28)" strokeWidth="1.6" fill="none" />
          <path d="M480,360 Q560,350 640,362 M760,398 Q880,390 1000,402" stroke="rgba(56,189,248,0.4)" strokeWidth="2" fill="none" />

          {/* Water Lilies & Lotus Blossoms */}
          <g transform="translate(580, 365)">
            <ellipse cx="0" cy="0" rx="16" ry="5" fill="#14532d" />
            <ellipse cx="-2" cy="0" rx="11" ry="3" fill="#16a34a" />
            <polygon points="0,-5 4,-1 3,3 -3,3 -4,-1" fill="#ff8da7" />
            <circle cx="0" cy="-1" r="1.5" fill="#ffffff" />
          </g>

          {/* Delicate Cyan Dragonfly Hovering near Lotus */}
          <g transform="translate(605, 355)" style={{ animation: "dragonflyHover 2.2s ease-in-out infinite" }}>
            <line x1="-3" y1="0" x2="3" y2="0" stroke="#0284c7" strokeWidth="1" />
            <ellipse cx="0" cy="-2" rx="4" ry="0.8" fill="#38bdf8" opacity="0.8" />
            <ellipse cx="0" cy="2" rx="3.5" ry="0.8" fill="#38bdf8" opacity="0.8" />
          </g>

          <g transform="translate(1080, 360)">
            <ellipse cx="0" cy="0" rx="18" ry="6" fill="#14532d" />
            <ellipse cx="-3" cy="0" rx="12" ry="4" fill="#16a34a" />
            <polygon points="0,-6 5,-2 4,4 -4,4 -5,-2" fill="#ff8da7" />
            <circle cx="0" cy="-1" r="2" fill="#ffffff" />
          </g>
          <g transform="translate(740, 395)">
            <ellipse cx="0" cy="0" rx="13" ry="4" fill="#14532d" />
            <polygon points="0,-4 3,-1 2,2 -2,2 -3,-1" fill="#38bdf8" />
          </g>

          {/* Swimming Mother Duck */}
          <g transform="translate(640, 375)" style={{ animation: "duckFloat 3s ease-in-out infinite" }}>
            <ellipse cx="0" cy="0" rx="8" ry="4" fill="#d97706" />
            <circle cx="6" cy="-4" r="3.5" fill="#15803d" />
            <polygon points="9,-4 13,-3 9,-2" fill="#f59e0b" />
            <circle cx="7" cy="-5" r="0.8" fill="#ffffff" />
            <path d="M-6,2 Q-10,0 -14,3" stroke="rgba(255,255,255,0.4)" strokeWidth="1" fill="none" />
          </g>

          {/* Cute Little Baby Duckling Following */}
          <g transform="translate(618, 380)" style={{ animation: "duckFloat 3s ease-in-out infinite 0.4s" }}>
            <ellipse cx="0" cy="0" rx="4.5" ry="2.5" fill="#facc15" />
            <circle cx="3.5" cy="-2.5" r="2" fill="#f59e0b" />
            <polygon points="5,-2.5 7,-2 5,-1.5" fill="#ea580c" />
            <circle cx="4" cy="-3" r="0.5" fill="#000000" />
            <path d="M-4,1 Q-6,0 -8,2" stroke="rgba(255,255,255,0.35)" strokeWidth="0.8" fill="none" />
          </g>

          {/* ════════ 9. PROMINENT SLOOP YACHT SAILBOAT ON THE LAKE ════════ */}
          <g style={{ animation: "boatSway 4.8s ease-in-out infinite", transformOrigin: "930px 330px" }}>
            <ellipse cx="930" cy="350" rx="42" ry="4" fill="rgba(2, 132, 199, 0.4)" />
            <path d="M880,332 L975,332 L960,348 L895,348 Z" fill="#0284c7" stroke="#0369a1" strokeWidth="1.5" />
            <line x1="884" y1="334" x2="971" y2="334" stroke="#ffffff" strokeWidth="2.5" />
            <rect x="914" y="326" width="30" height="7" rx="1.5" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="0.8" />
            <rect x="920" y="328" width="5" height="3" rx="0.5" fill="#0284c7" />
            <rect x="928" y="328" width="5" height="3" rx="0.5" fill="#0284c7" />
            <rect x="936" y="328" width="5" height="3" rx="0.5" fill="#0284c7" />

            <line x1="930" y1="332" x2="930" y2="265" stroke="#ffffff" strokeWidth="3" />
            <polygon points="930,265 944,269 930,273" fill="#facc15" />

            <path d="M930,270 L972,324 L930,324 Z" fill="#e1496d" />
            <path d="M930,270 Q951,297 972,324" stroke="#ffffff" strokeWidth="1.5" fill="none" />
            <line x1="944" y1="288" x2="956" y2="324" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />

            <path d="M927,278 L900,324 L927,324 Z" fill="#38bdf8" />
            <path d="M927,278 Q913,301 900,324" stroke="#ffffff" strokeWidth="1.2" fill="none" />

            <line x1="930" y1="268" x2="884" y2="332" stroke="rgba(255,255,255,0.8)" strokeWidth="1" />
            <line x1="930" y1="268" x2="974" y2="332" stroke="rgba(255,255,255,0.8)" strokeWidth="1" />

            <path d="M876,334 Q866,330 856,336" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" fill="none" />
            <path d="M976,334 Q986,330 996,336" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" fill="none" />
          </g>

          {/* Jumping Fish near Sailboat */}
          <g transform="translate(840, 355)">
            <path d="M0,0 Q6,-10 12,0 Q6,-4 0,0" fill="#38bdf8" style={{ animation: "fishSplash 4s infinite 1s" }} />
            <circle cx="6" cy="0" r="8" fill="none" stroke="rgba(56,189,248,0.6)" strokeWidth="1" style={{ animation: "rippleRing 2s infinite" }} />
          </g>

          {/* ════════ 10. SLEEK SLATE/CHARCOAL ASPHALT CYCLE TRACK & TRAILHEAD ════════ */}
          {/* Cycle Track Basebed Asphalt Path */}
          <path
            d="M0,380 C180,335 420,380 720,410 C1040,435 1280,420 1440,440 L1440,470 L0,470 Z"
            fill="url(#cycleTrackGrad)"
          />

          {/* White Outer Edge Curbs */}
          <path
            d="M0,380 C180,335 420,380 720,410 C1040,435 1280,420 1440,440"
            stroke="#ffffff"
            strokeWidth="3.5"
            fill="none"
          />
          <path
            d="M0,450 C180,405 420,445 720,470 L1440,470"
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="2.5"
            fill="none"
          />

          {/* Dashed Center Yellow/White Dividing Line for Bike Lane */}
          <path
            d="M0,415 C180,370 420,412 720,442 C1040,465 1280,452 1440,465"
            stroke="#facc15"
            strokeWidth="2"
            strokeDasharray="14 10"
            fill="none"
            opacity="0.95"
          />

          {/* Painted White Bicycle Icons on the Asphalt Track */}
          <g transform="translate(110, 390) scale(0.65)" opacity="0.9">
            <circle cx="10" cy="10" r="6" fill="none" stroke="#ffffff" strokeWidth="2" />
            <circle cx="34" cy="10" r="6" fill="none" stroke="#ffffff" strokeWidth="2" />
            <line x1="10" y1="10" x2="22" y2="10" stroke="#ffffff" strokeWidth="2" />
            <line x1="22" y1="10" x2="30" y2="2" stroke="#ffffff" strokeWidth="2" />
            <line x1="10" y1="10" x2="18" y2="2" stroke="#ffffff" strokeWidth="2" />
            <line x1="18" y1="2" x2="30" y2="2" stroke="#ffffff" strokeWidth="2" />
            <line x1="30" y1="2" x2="34" y2="10" stroke="#ffffff" strokeWidth="2" />
          </g>

          {/* Roadside Velo Air Pump & Tool Station */}
          <g transform="translate(230, 350) scale(0.85)">
            <line x1="0" y1="0" x2="0" y2="16" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
            <line x1="-3" y1="0" x2="3" y2="0" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" /> {/* T-Handle */}
            <circle cx="0" cy="5" r="2.5" fill="#facc15" /> {/* Gauge */}
            <path d="M0,12 Q4,10 5,16" stroke="#0f172a" strokeWidth="1.2" fill="none" /> {/* Hose */}
          </g>

          {/* Rustic Wooden Trail Direction Signpost */}
          <g transform="translate(345, 340) scale(0.9)">
            <line x1="0" y1="0" x2="0" y2="24" stroke="#78350f" strokeWidth="2.5" />
            <polygon points="-4,2 18,2 22,6 18,10 -4,10" fill="#b45309" stroke="#78350f" strokeWidth="0.8" />
            <line x1="-2" y1="6" x2="14" y2="6" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" />
            <polygon points="12,11 -10,11 -14,15 -10,19 12,19" fill="#92400e" stroke="#78350f" strokeWidth="0.8" />
            <line x1="-8" y1="15" x2="8" y2="15" stroke="#fde047" strokeWidth="1.2" strokeLinecap="round" />
          </g>

          {/* Track Solar Lantern Posts */}
          <g transform="translate(190, 348)">
            <line x1="0" y1="0" x2="0" y2="18" stroke="#451a03" strokeWidth="2" />
            <polygon points="-4,0 4,0 2,-6 -2,-6" fill="#78350f" />
            <circle cx="0" cy="-3" r="2.5" fill="#facc15" style={{ animation: "sparklePulse 1.8s infinite" }} />
          </g>
          <g transform="translate(480, 372)">
            <line x1="0" y1="0" x2="0" y2="18" stroke="#451a03" strokeWidth="2" />
            <polygon points="-4,0 4,0 2,-6 -2,-6" fill="#78350f" />
            <circle cx="0" cy="-3" r="2.5" fill="#facc15" style={{ animation: "sparklePulse 1.8s infinite 0.5s" }} />
          </g>

          {/* ════════ 11. HYPER-DETAILED BICYCLES & DEVELOPER MASCOTS ════════ */}
          
          {/* ── MASCOT 1: LEAD DEVELOPER AERO ROAD BIKE (Detailed Spokes, Drivetrain, Pedals, Cables, MacBook & Coffee) ── */}
          <g transform="translate(410, 360)">
            <ellipse cx="10" cy="68" rx="16" ry="3" fill="rgba(0,0,0,0.35)" />
            <ellipse cx="70" cy="68" rx="16" ry="3" fill="rgba(0,0,0,0.35)" />

            <circle cx="10" cy="52" r="16" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
            <circle cx="10" cy="52" r="12" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
            <line x1="10" y1="40" x2="10" y2="64" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="-2" y1="52" x2="22" y2="52" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="2" y1="44" x2="18" y2="60" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="2" y1="60" x2="18" y2="44" stroke="#cbd5e1" strokeWidth="1" />
            <circle cx="10" cy="52" r="3" fill="#facc15" />

            <circle cx="70" cy="52" r="16" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
            <circle cx="70" cy="52" r="12" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
            <line x1="70" y1="40" x2="70" y2="64" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="58" y1="52" x2="82" y2="52" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="62" y1="44" x2="78" y2="60" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="62" y1="60" x2="78" y2="44" stroke="#cbd5e1" strokeWidth="1" />
            <circle cx="70" cy="52" r="2.5" fill="#64748b" />

            <line x1="10" y1="52" x2="38" y2="52" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="2 1" />
            <circle cx="38" cy="52" r="5" fill="#475569" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="38" y1="52" x2="42" y2="60" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="42" cy="60" r="2" fill="#0f172a" />

            <line x1="10" y1="52" x2="38" y2="52" stroke="#e1496d" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="38" y1="52" x2="58" y2="30" stroke="#e1496d" strokeWidth="4" strokeLinecap="round" />
            <line x1="10" y1="52" x2="32" y2="28" stroke="#e1496d" strokeWidth="3.2" strokeLinecap="round" />
            <line x1="32" y1="28" x2="58" y2="30" stroke="#e1496d" strokeWidth="3.8" strokeLinecap="round" />
            <line x1="32" y1="28" x2="38" y2="52" stroke="#e1496d" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="58" y1="30" x2="70" y2="52" stroke="#e1496d" strokeWidth="3.5" strokeLinecap="round" />

            <rect x="46" y="38" width="5" height="9" rx="1.5" fill="#38bdf8" stroke="#0284c7" strokeWidth="0.8" transform="rotate(-40, 46, 38)" />

            <line x1="32" y1="28" x2="30" y2="22" stroke="#0f172a" strokeWidth="2.5" />
            <path d="M22,22 L36,22 L34,19 L25,19 Z" fill="#0f172a" />
            <circle cx="28" cy="24" r="1.8" fill="#ef4444" style={{ animation: "beaconBlink 1s infinite" }} />

            <line x1="58" y1="30" x2="57" y2="18" stroke="#0f172a" strokeWidth="2.5" />
            <path d="M55,18 L64,18 Q67,22 64,26" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M58,20 Q62,28 48,36" stroke="#ffffff" strokeWidth="0.8" fill="none" opacity="0.6" />

            <rect x="56" y="16" width="22" height="15" rx="2" fill="none" stroke="#0f172a" strokeWidth="1.8" />
            <line x1="63" y1="16" x2="63" y2="31" stroke="#0f172a" strokeWidth="1" />
            <line x1="70" y1="16" x2="70" y2="31" stroke="#0f172a" strokeWidth="1" />
            
            <polygon points="60,25 76,25 78,11 62,11" fill="#0284c7" />
            <line x1="59" y1="25" x2="77" y2="25" stroke="#ffffff" strokeWidth="2.2" />
            <line x1="64" y1="14" x2="74" y2="14" stroke="#38bdf8" strokeWidth="1.2" />
            <line x1="63" y1="17" x2="71" y2="17" stroke="#ff8da7" strokeWidth="1.2" />
            <line x1="63" y1="20" x2="76" y2="20" stroke="#22c55e" strokeWidth="1.2" />

            <polygon points="73,20 77,20 76,28 74,28" fill="#f8fafc" stroke="#942945" strokeWidth="0.8" />
            <rect x="72.5" y="19" width="5" height="1.5" fill="#e1496d" rx="0.5" />

            <ellipse cx="34" cy="18" rx="16" ry="14" fill="#e1496d" />
            <ellipse cx="36" cy="20" rx="10" ry="11" fill="#38bdf8" />
            <circle cx="42" cy="8" r="10" fill="#e1496d" />
            <path d="M35,2 Q46,-4 54,4 L35,6 Z" fill="#0284c7" />
            <circle cx="45" cy="7" r="4.5" fill="rgba(255,255,255,0.2)" stroke="#ffffff" strokeWidth="1.6" />
            <line x1="49.5" y1="7" x2="52" y2="7" stroke="#ffffff" strokeWidth="1.6" />
            <circle cx="45" cy="7" r="1.5" fill="#ffffff" />
            <polygon points="51,8 58,10 51,12" fill="#f59e0b" />
            <path d="M36,6 Q42,0 48,6" stroke="#facc15" strokeWidth="2.5" fill="none" />
            <rect x="34" y="4" width="4" height="7" rx="1.5" fill="#facc15" />
            <path d="M28,18 Q44,25 58,22" stroke="#e1496d" strokeWidth="4.5" strokeLinecap="round" fill="none" />
          </g>

          {/* ── MASCOT 2: JUNIOR COMPANION MINI BIKE ── */}
          <g transform="translate(275, 375) scale(0.78)">
            <ellipse cx="10" cy="68" rx="14" ry="3" fill="rgba(0,0,0,0.3)" />
            <ellipse cx="56" cy="68" rx="14" ry="3" fill="rgba(0,0,0,0.3)" />

            <circle cx="10" cy="52" r="14" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
            <circle cx="10" cy="52" r="10" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
            <line x1="10" y1="42" x2="10" y2="62" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="0" y1="52" x2="20" y2="52" stroke="#cbd5e1" strokeWidth="1" />

            <circle cx="56" cy="52" r="14" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
            <circle cx="56" cy="52" r="10" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
            <line x1="56" y1="42" x2="56" y2="62" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="46" y1="52" x2="66" y2="52" stroke="#cbd5e1" strokeWidth="1" />

            <line x1="10" y1="52" x2="32" y2="52" stroke="#0284c7" strokeWidth="3" />
            <line x1="32" y1="52" x2="48" y2="34" stroke="#0284c7" strokeWidth="3" />
            <line x1="10" y1="52" x2="26" y2="32" stroke="#0284c7" strokeWidth="3" />
            <line x1="26" y1="32" x2="48" y2="34" stroke="#0284c7" strokeWidth="3" />
            <line x1="48" y1="34" x2="56" y2="52" stroke="#0284c7" strokeWidth="3" />

            <path d="M48,30 Q54,26 50,22" stroke="#facc15" strokeWidth="1.5" fill="none" />
            <path d="M48,30 Q56,30 52,24" stroke="#e1496d" strokeWidth="1.5" fill="none" />

            <line x1="10" y1="52" x2="6" y2="8" stroke="#f59e0b" strokeWidth="1.8" />
            <polygon points="6,8 18,13 6,18" fill="#e1496d" />

            <ellipse cx="28" cy="24" rx="13" ry="11" fill="#38bdf8" />
            <circle cx="35" cy="14" r="8.5" fill="#38bdf8" />
            <polygon points="41,14 47,16 41,18" fill="#f59e0b" />
            <circle cx="37" cy="13" r="1.6" fill="#ffffff" />
            <path d="M30,8 Q38,4 44,10 L30,11 Z" fill="#e1496d" />
          </g>

          {/* ── MASCOT 3: DEVELOPER TEAMMATE GRAVEL BIKE ── */}
          <g transform="translate(580, 375)">
            <ellipse cx="10" cy="68" rx="16" ry="3" fill="rgba(0,0,0,0.35)" />
            <ellipse cx="70" cy="68" rx="16" ry="3" fill="rgba(0,0,0,0.35)" />

            <circle cx="10" cy="52" r="16" fill="#1e293b" stroke="#0f172a" strokeWidth="2.5" />
            <circle cx="10" cy="52" r="12" fill="none" stroke="#22c55e" strokeWidth="1.5" />
            <line x1="10" y1="40" x2="10" y2="64" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="-2" y1="52" x2="22" y2="52" stroke="#cbd5e1" strokeWidth="1" />

            <circle cx="70" cy="52" r="16" fill="#1e293b" stroke="#0f172a" strokeWidth="2.5" />
            <circle cx="70" cy="52" r="12" fill="none" stroke="#22c55e" strokeWidth="1.5" />
            <line x1="70" y1="40" x2="70" y2="64" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="58" y1="52" x2="82" y2="52" stroke="#cbd5e1" strokeWidth="1" />

            <line x1="10" y1="52" x2="38" y2="52" stroke="#16a34a" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="38" y1="52" x2="58" y2="30" stroke="#16a34a" strokeWidth="3.8" strokeLinecap="round" />
            <line x1="10" y1="52" x2="32" y2="28" stroke="#16a34a" strokeWidth="3.2" strokeLinecap="round" />
            <line x1="32" y1="28" x2="58" y2="30" stroke="#16a34a" strokeWidth="3.8" strokeLinecap="round" />
            <line x1="58" y1="30" x2="70" y2="52" stroke="#16a34a" strokeWidth="3.5" strokeLinecap="round" />

            <polygon points="34,31 54,32 38,48" fill="#1e293b" stroke="#0f172a" strokeWidth="0.8" />
            
            <rect x="56" y="16" width="20" height="14" rx="2" fill="none" stroke="#0f172a" strokeWidth="1.8" />
            <polygon points="60,24 74,24 76,12 62,12" fill="#14532d" />
            <line x1="59" y1="24" x2="75" y2="24" stroke="#ffffff" strokeWidth="2.2" />
            <line x1="64" y1="15" x2="72" y2="15" stroke="#22c55e" strokeWidth="1.2" />
            <line x1="63" y1="18" x2="69" y2="18" stroke="#22c55e" strokeWidth="1.2" />

            <ellipse cx="34" cy="18" rx="16" ry="14" fill="#38bdf8" />
            <ellipse cx="36" cy="20" rx="10" ry="11" fill="#e1496d" />
            <circle cx="42" cy="8" r="10" fill="#38bdf8" />
            <path d="M35,2 Q46,-4 54,4 L35,6 Z" fill="#e1496d" />
            <polygon points="51,8 58,10 51,12" fill="#f59e0b" />
            <circle cx="45" cy="7" r="1.5" fill="#ffffff" />
          </g>

          {/* ════════ 12. SHIMMERING PARTICLES OVER THE HORIZON ════════ */}
          <circle cx="480" cy="210" r="3.5" fill="#38bdf8" style={{ animation: "sparklePulse 2.5s infinite" }} />
          <circle cx="680" cy="190" r="4" fill="#ff8da7" style={{ animation: "sparklePulse 3.2s infinite 1s" }} />
          <circle cx="980" cy="200" r="3.5" fill="#facc15" style={{ animation: "sparklePulse 2.8s infinite 0.5s" }} />
          <circle cx="1120" cy="230" r="3" fill="#22c55e" style={{ animation: "sparklePulse 3.5s infinite 1.5s" }} />
          <circle cx="320" cy="240" r="2.5" fill="#e1496d" style={{ animation: "sparklePulse 2.2s infinite 0.8s" }} />
        </svg>

      </div>

    </section>
  );
}
