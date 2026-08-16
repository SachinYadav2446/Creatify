import React, { useState } from "react";
import { Sparkles, Zap, Trophy, ArrowRight, Star, Heart, ChevronLeft, ChevronRight } from "lucide-react";

export default function ExperienceCreatifySection({ onNavigate, user, isDark, THEME }) {
  // Active center card ID: 0: Instant WOW, 1: 10x Creation Velocity, 2: Studio-Grade Fidelity
  const [activeCardId, setActiveCardId] = useState(1);

  const strokeColor = isDark ? "#ff8da7" : "#831843";
  const textPrimary = isDark ? "#ffffff" : "#1a040d";

  const cards = [
    {
      id: 0,
      title: "Instant WOW Effect",
      tagline: "Neural Speed",
      desc: "Turn rough thoughts into 4K trailers, vector logos, and 3D mockups in seconds with GPU-accelerated generation.",
      icon: Sparkles,
      color: "#e1496d",
      stat: "< 3.2s",
      statLabel: "Average Render Time",
    },
    {
      id: 1,
      title: "10x Creation Velocity",
      tagline: "Unified Architecture",
      desc: "Eliminate tool switching forever. Write prompts, edit multi-track timelines, and project 3D shaders in one unified workspace.",
      icon: Zap,
      color: "#ff8da7",
      stat: "100%",
      statLabel: "Browser-Native & Real-time",
    },
    {
      id: 2,
      title: "Studio-Grade Fidelity",
      tagline: "Zero Compromise",
      desc: "10-bit HDR color grading, lossless vector SVG export, physical dielectric PBR glass, and encrypted vault storage.",
      icon: Trophy,
      color: "#f59e0b",
      stat: "4K 60FPS",
      statLabel: "Master Export Standard",
    },
  ];

  // Rotate Anti-Clockwise (Right card sweeps forward into center, center sweeps left)
  const rotateAnticlockwise = () => {
    setActiveCardId(prev => (prev + 1) % 3);
  };

  // Rotate Clockwise (Left card sweeps forward into center, center sweeps right)
  const rotateClockwise = () => {
    setActiveCardId(prev => (prev - 1 + 3) % 3);
  };

  // Returns 3D orbit transformation based on relative position
  const getOrbitalTransform = (pos) => {
    if (pos === 0) {
      // Center Active Slot (Front & Elevated)
      return {
        transform: "translateX(0%) translateY(-10px) translateZ(40px) rotateY(0deg) scale(1.04)",
        zIndex: 30,
        opacity: 1,
        filter: "blur(0px)",
        border: isDark ? "2.5px solid #ff8da7" : "2.5px solid #e1496d",
        background: isDark ? "rgba(35, 10, 24, 0.94)" : "rgba(255, 255, 255, 0.98)",
        boxShadow: isDark
          ? "0 30px 80px rgba(0, 0, 0, 0.8), 0 0 50px rgba(225, 73, 109, 0.4)"
          : "0 25px 65px rgba(96, 18, 46, 0.25), 0 0 35px rgba(225, 73, 109, 0.2)",
        cursor: "default",
      };
    }
    if (pos === 1) {
      // Right Slot (Inward Angled in 3D depth)
      return {
        transform: "translateX(106%) translateY(12px) translateZ(-80px) rotateY(-18deg) scale(0.92)",
        zIndex: 15,
        opacity: 0.82,
        filter: "blur(0.5px)",
        border: isDark ? "1px solid rgba(225, 73, 109, 0.3)" : "1px solid rgba(255, 255, 255, 0.65)",
        background: isDark ? "rgba(20, 6, 15, 0.72)" : "rgba(255, 255, 255, 0.78)",
        boxShadow: isDark ? "0 15px 40px rgba(0, 0, 0, 0.5)" : "0 12px 30px rgba(96, 18, 46, 0.12)",
        cursor: "pointer",
      };
    }
    // pos === 2: Left Slot (Inward Angled in 3D depth)
    return {
      transform: "translateX(-106%) translateY(12px) translateZ(-80px) rotateY(18deg) scale(0.92)",
      zIndex: 15,
      opacity: 0.82,
      filter: "blur(0.5px)",
      border: isDark ? "1px solid rgba(225, 73, 109, 0.3)" : "1px solid rgba(255, 255, 255, 0.65)",
      background: isDark ? "rgba(20, 6, 15, 0.72)" : "rgba(255, 255, 255, 0.78)",
      boxShadow: isDark ? "0 15px 40px rgba(0, 0, 0, 0.5)" : "0 12px 30px rgba(96, 18, 46, 0.12)",
      cursor: "pointer",
    };
  };

  return (
    <section
      id="experience-creatify-section"
      style={{
        position: "relative",
        width: "100%",
        overflow: "hidden",
        boxSizing: "border-box",
        marginTop: "40px",
      }}
    >
      {/* ── TOP CONVEX DOME ARCH HORIZON ── */}
      <div style={{ width: "100%", lineHeight: 0, overflow: "hidden" }}>
        <svg
          viewBox="0 0 1440 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          style={{ width: "100%", height: "60px", display: "block" }}
        >
          <path
            d="M0,80 Q720,0 1440,80 L1440,80 L0,80 Z"
            fill={isDark ? "#280a1c" : "#60122e"}
          />
        </svg>
      </div>

      {/* ── MAIN RICH GRADIENT CONTAINER ── */}
      <div
        style={{
          position: "relative",
          width: "100%",
          padding: "30px 24px 70px",
          background: isDark
            ? "linear-gradient(180deg, #280a1c 0%, #170511 40%, #0d0309 85%, #080205 100%)"
            : "linear-gradient(180deg, #60122e 0%, #8b1d43 35%, #b13453 65%, #fce7f3 92%, #ffffff 100%)",
          boxSizing: "border-box",
        }}
      >
        <style>{`
          @keyframes floatingBalloon {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-15px) rotate(3deg); }
          }
          @keyframes windSail {
            0%, 100% { transform: translateX(0px) rotate(0deg); }
            50% { transform: translateX(14px) rotate(1.5deg); }
          }
          @keyframes spinTurbine {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes birdFly {
            0% { transform: translate(0, 0); }
            50% { transform: translate(20px, -8px); }
            100% { transform: translate(0, 0); }
          }
          @keyframes cloudDriftSmooth {
            0% { transform: translateX(-5%); }
            100% { transform: translateX(105vw); }
          }
        `}</style>

        {/* Ambient Top Glow */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "700px",
            height: "350px",
            background: "radial-gradient(circle, rgba(255, 141, 167, 0.25) 0%, transparent 70%)",
            filter: "blur(90px)",
            pointerEvents: "none",
          }}
        />

        <div style={{ maxWidth: 1080, margin: "0 auto", position: "relative", zIndex: 10, textAlign: "center" }}>
          
          {/* Header Title */}
          <h2
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: "clamp(28px, 4vw, 48px)",
              fontWeight: 800,
              letterSpacing: "-0.035em",
              lineHeight: 1.15,
              color: "#ffffff",
              margin: "0 0 10px",
              textShadow: "0 4px 20px rgba(0, 0, 0, 0.4)",
            }}
          >
            It's time to experience Creatify<span style={{ color: "#ff8da7" }}>.</span>
          </h2>

          <p
            style={{
              fontFamily: "'Instrument Sans', sans-serif",
              fontSize: "clamp(14px, 1.3vw, 16.5px)",
              color: "rgba(255, 255, 255, 0.85)",
              maxWidth: 580,
              margin: "0 auto 36px",
              lineHeight: 1.55,
            }}
          >
            Unleash your creative potential with ultra-fast neural generation, multi-modal spatial blueprints, and studio-grade master exports.
          </p>

          {/* ── 3D ORBITAL CLOCKWISE & ANTICLOCKWISE CAROUSEL ── */}
          <div style={{ position: "relative", marginBottom: 54 }}>
            
            {/* 3D Turntable Stage Container */}
            <div
              style={{
                position: "relative",
                width: "100%",
                maxWidth: "340px",
                height: "390px",
                margin: "0 auto 20px",
                perspective: "1200px",
                perspectiveOrigin: "50% 50%",
              }}
            >
              {cards.map((c) => {
                const Icon = c.icon;
                const pos = ((c.id - activeCardId) % 3 + 3) % 3;
                const isCenter = pos === 0;
                const isRight = pos === 1;
                const isLeft = pos === 2;
                const orbitStyles = getOrbitalTransform(pos);

                return (
                  <div
                    key={c.id}
                    onClick={() => {
                      if (isRight) rotateAnticlockwise();
                      else if (isLeft) rotateClockwise();
                    }}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      borderRadius: 24,
                      padding: isCenter ? "34px 26px 30px" : "26px 20px 24px",
                      backdropFilter: "blur(24px)",
                      transition: "all 0.65s cubic-bezier(0.16, 1, 0.3, 1)",
                      textAlign: "center",
                      boxSizing: "border-box",
                      userSelect: "none",
                      ...orbitStyles,
                    }}
                    onMouseEnter={(e) => {
                      if (!isCenter) {
                        e.currentTarget.style.opacity = "1";
                        e.currentTarget.style.transform = isRight
                          ? "translateX(106%) translateY(4px) translateZ(-60px) rotateY(-14deg) scale(0.95)"
                          : "translateX(-106%) translateY(4px) translateZ(-60px) rotateY(14deg) scale(0.95)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isCenter) {
                        e.currentTarget.style.opacity = "0.82";
                        e.currentTarget.style.transform = isRight
                          ? "translateX(106%) translateY(12px) translateZ(-80px) rotateY(-18deg) scale(0.92)"
                          : "translateX(-106%) translateY(12px) translateZ(-80px) rotateY(18deg) scale(0.92)";
                      }
                    }}
                  >
                    {/* Orbit Rotation Direction Badges */}
                    {!isCenter && (
                      <div
                        style={{
                          position: "absolute",
                          top: 12,
                          right: isRight ? 14 : "auto",
                          left: isLeft ? 14 : "auto",
                          fontSize: 9.5,
                          fontWeight: 700,
                          fontFamily: "'Poppins', sans-serif",
                          color: isDark ? "#ff8da7" : "#831843",
                          background: isDark ? "rgba(225, 73, 109, 0.18)" : "rgba(148, 41, 69, 0.12)",
                          border: `1px solid ${isDark ? "rgba(225, 73, 109, 0.35)" : "rgba(148, 41, 69, 0.22)"}`,
                          padding: "3px 9px",
                          borderRadius: 99,
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          pointerEvents: "none",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        }}
                      >
                        {isLeft && <ChevronLeft size={12} />}
                        <span>{isRight ? "Rotate ↺" : "Rotate ↻"}</span>
                        {isRight && <ChevronRight size={12} />}
                      </div>
                    )}

                    {/* Glowing Icon Badge */}
                    <div
                      style={{
                        width: isCenter ? 56 : 48,
                        height: isCenter ? 56 : 48,
                        borderRadius: 16,
                        background: `linear-gradient(135deg, ${c.color}30, ${c.color}15)`,
                        border: `1.5px solid ${c.color}`,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: isCenter ? 18 : 14,
                        boxShadow: `0 8px 24px ${c.color}35`,
                        transition: "all 0.3s ease",
                      }}
                    >
                      <Icon size={isCenter ? 26 : 22} color={c.color} />
                    </div>

                    <div style={{ fontSize: isCenter ? 11.5 : 10.5, fontWeight: 700, fontFamily: "'Poppins', sans-serif", color: isDark ? "#ff8da7" : "#e1496d", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>
                      {c.tagline}
                    </div>

                    <h3
                      style={{
                        fontFamily: "Syne, sans-serif",
                        fontSize: isCenter ? 21 : 17,
                        fontWeight: 800,
                        color: isDark ? "#ffffff" : "#1a040d",
                        margin: "0 0 10px",
                        lineHeight: 1.2,
                      }}
                    >
                      {c.title}
                    </h3>

                    <p
                      style={{
                        fontFamily: "'Instrument Sans', sans-serif",
                        fontSize: isCenter ? 13.5 : 12.5,
                        color: isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(35, 8, 18, 0.75)",
                        lineHeight: 1.5,
                        margin: "0 0 18px",
                      }}
                    >
                      {c.desc}
                    </p>

                    {/* Stat Chip */}
                    <div
                      style={{
                        display: "inline-flex",
                        flexDirection: "column",
                        padding: isCenter ? "8px 16px" : "6px 12px",
                        borderRadius: 12,
                        background: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.04)",
                        border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)"}`,
                      }}
                    >
                      <span style={{ fontSize: isCenter ? 15 : 13, fontWeight: 800, fontFamily: "'Syne', sans-serif", color: isDark ? "#ffffff" : "#1a040d" }}>
                        {c.stat}
                      </span>
                      <span style={{ fontSize: 9.5, color: isDark ? "rgba(255, 255, 255, 0.5)" : "rgba(35, 8, 18, 0.6)", fontFamily: "'Poppins', sans-serif" }}>
                        {c.statLabel}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick 3D Orbital Navigation Controls & Indicator Dots */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14 }}>
              <button
                onClick={rotateClockwise}
                title="Rotate Clockwise (Left to Center)"
                style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(255, 255, 255, 0.8)",
                  border: `1px solid ${isDark ? "rgba(225, 73, 109, 0.3)" : "rgba(148, 41, 69, 0.2)"}`,
                  color: isDark ? "#ffffff" : "#831843",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
              >
                <ChevronLeft size={16} />
              </button>

              {/* 3 Slot Indicator Dots */}
              <div style={{ display: "flex", gap: 8 }}>
                {cards.map((c) => {
                  const isActiveCenter = activeCardId === c.id;
                  return (
                    <div
                      key={c.id}
                      onClick={() => setActiveCardId(c.id)}
                      title={`Focus ${c.title}`}
                      style={{
                        width: isActiveCenter ? 24 : 8,
                        height: 8,
                        borderRadius: 99,
                        background: isActiveCenter ? "linear-gradient(135deg, #e1496d, #ff8da7)" : (isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.2)"),
                        cursor: "pointer",
                        transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
                      }}
                    />
                  );
                })}
              </div>

              <button
                onClick={rotateAnticlockwise}
                title="Rotate Anti-Clockwise (Right to Center)"
                style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(255, 255, 255, 0.8)",
                  border: `1px solid ${isDark ? "rgba(225, 73, 109, 0.3)" : "rgba(148, 41, 69, 0.2)"}`,
                  color: isDark ? "#ffffff" : "#831843",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* ── MANIFESTO & 100% FREE BADGE BOX ── */}
          <div
            style={{
              position: "relative",
              maxWidth: 740,
              margin: "0 auto",
              padding: "36px 40px",
              borderRadius: 24,
              background: isDark ? "rgba(22, 7, 16, 0.85)" : "rgba(255, 255, 255, 0.92)",
              border: `1.5px solid ${isDark ? "rgba(225, 73, 109, 0.4)" : "rgba(255, 255, 255, 0.9)"}`,
              backdropFilter: "blur(28px)",
              boxShadow: isDark
                ? "0 25px 60px rgba(0,0,0,0.7), 0 0 35px rgba(225,73,109,0.2)"
                : "0 25px 55px rgba(96,18,46,0.18)",
              textAlign: "center",
            }}
          >
            {/* 100% Free Badge */}
            <div
              style={{
                position: "absolute",
                top: -14,
                left: "50%",
                transform: "translateX(-50%)",
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                padding: "5px 18px",
                borderRadius: 99,
                background: "linear-gradient(135deg, #e1496d 0%, #942945 100%)",
                color: "#ffffff",
                fontSize: 11,
                fontWeight: 800,
                fontFamily: "'Poppins', sans-serif",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                boxShadow: "0 4px 18px rgba(225, 73, 109, 0.55)",
              }}
            >
              <Sparkles size={13} fill="#fff" />
              <span>100% FREE FOR ALL CREATORS • NO LIMITS</span>
            </div>

            <p
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontStyle: "italic",
                fontSize: "clamp(18px, 2.1vw, 24px)",
                color: textPrimary,
                lineHeight: 1.5,
                margin: "12px 0 16px",
              }}
            >
              “Creatify was built on a simple conviction: world-class creative tools belong to everyone. From your first 4K motion reel to multi-modal neural node graphs and photorealistic 3D raytracing — everything is fast, frictionless, and completely free in your browser.”
            </p>

            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, color: isDark ? "#ff8da7" : "#831843", fontSize: 12.5, fontWeight: 700, fontFamily: "'Poppins', sans-serif", letterSpacing: "0.04em" }}>
              <Heart size={14} fill={isDark ? "#ff8da7" : "#e1496d"} color="none" />
              <span>Crafted for designers, video editors, and visual visionaries worldwide</span>
            </div>
          </div>

          {/* ── ADVANCED HIGH-PRODUCTION VECTOR ARTWORK (1440 × 340) ── */}
          <div style={{ width: "100%", lineHeight: 0, position: "relative", marginTop: 85, overflow: "hidden" }}>
            <svg
              viewBox="0 0 1440 340"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMidYMax meet"
              style={{ width: "100%", height: "auto", display: "block" }}
            >
              <defs>
                {/* Sunburst Gradient */}
                <radialGradient id="expSunburst" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ffd700" stopOpacity={isDark ? "0.45" : "0.75"} />
                  <stop offset="60%" stopColor="#f43f5e" stopOpacity={isDark ? "0.2" : "0.35"} />
                  <stop offset="100%" stopColor="#e1496d" stopOpacity="0" />
                </radialGradient>

                {/* Mountain Ridge 1 (Far Background Deep Alpine) */}
                <linearGradient id="expMountFar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={isDark ? "#380d24" : "#be185d"} />
                  <stop offset="100%" stopColor={isDark ? "#170511" : "#fce7f3"} />
                </linearGradient>

                {/* Mountain Ridge 2 (Mid-ground Rosy Slate) */}
                <linearGradient id="expMountMid" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={isDark ? "#4a1233" : "#e11d48"} />
                  <stop offset="100%" stopColor={isDark ? "#1f0717" : "#ffe4e6"} />
                </linearGradient>

                {/* Mountain Ridge 3 (Foreground Mountain) */}
                <linearGradient id="expMountNear" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={isDark ? "#5e143f" : "#f43f5e"} />
                  <stop offset="100%" stopColor={isDark ? "#280a1c" : "#fdf2f8"} />
                </linearGradient>

                {/* Foothill Forest Jade Gradient */}
                <linearGradient id="expForestHill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={isDark ? "#064e3b" : "#059669"} />
                  <stop offset="100%" stopColor={isDark ? "#022c22" : "#a7f3d0"} />
                </linearGradient>

                {/* Lake Shimmer Gradient */}
                <linearGradient id="expLakeShimmer" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={isDark ? "#0369a1" : "#0284c7"} />
                  <stop offset="60%" stopColor={isDark ? "#0284c7" : "#38bdf8"} />
                  <stop offset="100%" stopColor={isDark ? "#0c4a6e" : "#bae6fd"} />
                </linearGradient>

                {/* Meadow Blossom Gradient */}
                <linearGradient id="expMeadowGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={isDark ? "#240a1b" : "#fdf2f8"} />
                  <stop offset="100%" stopColor={isDark ? "#12030d" : "#fce7f3"} />
                </linearGradient>
              </defs>

              {/* ── 1. SKY CELESTIAL SUN & RADIAL RAYS ── */}
              <circle cx="720" cy="200" r="220" fill="url(#expSunburst)" />
              <circle cx="720" cy="200" r="80" fill="#fef08a" opacity={isDark ? "0.35" : "0.75"} />

              {/* Soaring Swallows Flock */}
              <g style={{ animation: "birdFly 7s ease-in-out infinite" }}>
                <path d="M 460 60 Q 470 50 480 58 Q 490 50 500 60" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" fill="none" />
                <path d="M 520 45 Q 528 38 536 43 Q 544 38 552 45" stroke={strokeColor} strokeWidth="1.8" strokeLinecap="round" fill="none" />
                <path d="M 490 75 Q 496 70 502 74 Q 508 70 514 75" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" fill="none" />
              </g>

              {/* Drifting Clouds */}
              <g style={{ animation: "cloudDriftSmooth 60s linear infinite", opacity: 0.85 }}>
                <path
                  d="M 120 70 Q 110 70 110 60 Q 110 50 125 50 Q 130 38 145 40 Q 160 36 170 45 Q 182 42 190 52 Q 200 52 200 62 Q 200 70 190 70 Z"
                  fill={isDark ? "rgba(255,255,255,0.08)" : "#ffffff"}
                  stroke={strokeColor}
                  strokeWidth="1.5"
                />
              </g>

              {/* ── 2. HOT AIR BALLOONS (DETAILED STRIPED ENVELOPES) ── */}
              {/* Main Hot Air Balloon (Left) */}
              <g style={{ animation: "floatingBalloon 8s ease-in-out infinite" }} transform="translate(210, 30)">
                {/* Envelope Base */}
                <path d="M 15 50 Q 0 25 20 5 Q 40 -10 60 5 Q 80 25 65 50 Q 55 65 48 78 L 32 78 Q 25 65 15 50 Z" fill="#e1496d" stroke={strokeColor} strokeWidth="2.2" />
                {/* Gores */}
                <path d="M 30 78 Q 20 40 32 0" stroke="#ffd700" strokeWidth="3" fill="none" />
                <path d="M 50 78 Q 60 40 48 0" stroke="#38bdf8" strokeWidth="3" fill="none" />
                <ellipse cx="40" cy="38" rx="8" ry="34" fill="#ffffff" opacity="0.3" />
                {/* Burner Flame */}
                <polygon points="36,80 40,73 44,80" fill="#f59e0b" />
                {/* Ropes */}
                <line x1="32" y1="78" x2="35" y2="94" stroke={strokeColor} strokeWidth="1.5" />
                <line x1="48" y1="78" x2="45" y2="94" stroke={strokeColor} strokeWidth="1.5" />
                {/* Basket */}
                <rect x="33" y="94" width="14" height="12" rx="2" fill="#d97706" stroke={strokeColor} strokeWidth="1.8" />
                <line x1="33" y1="100" x2="47" y2="100" stroke="#ffffff" strokeWidth="1.2" />
              </g>

              {/* Distant Smaller Hot Air Balloon (Right) */}
              <g style={{ animation: "floatingBalloon 6s ease-in-out infinite 2s" }} transform="translate(1180, 50) scale(0.6)">
                <path d="M 15 50 Q 0 25 20 5 Q 40 -10 60 5 Q 80 25 65 50 Q 55 65 48 78 L 32 78 Q 25 65 15 50 Z" fill="#38bdf8" stroke={strokeColor} strokeWidth="2.2" />
                <path d="M 30 78 Q 20 40 32 0" stroke="#ff8da7" strokeWidth="3" fill="none" />
                <path d="M 50 78 Q 60 40 48 0" stroke="#ffd700" strokeWidth="3" fill="none" />
                <rect x="34" y="90" width="12" height="10" rx="2" fill="#d97706" stroke={strokeColor} strokeWidth="1.8" />
              </g>

              {/* ── 3. SOLID LAYER 1: FAR ALPINE PEAKS (NO CRISS-CROSS LINES) ── */}
              <path
                d="M -40 340 L 120 120 L 320 250 L 520 80 L 720 220 L 960 70 L 1180 230 L 1360 90 L 1480 340 Z"
                fill="url(#expMountFar)"
                stroke={strokeColor}
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              {/* Snow Caps */}
              <polygon points="120,120 95,160 120,150 145,165" fill="#ffffff" />
              <polygon points="520,80 490,130 520,118 550,135" fill="#ffffff" />
              <polygon points="960,70 930,125 960,112 990,130" fill="#ffffff" />
              <polygon points="1360,90 1335,135 1360,125 1385,140" fill="#ffffff" />

              {/* ── 4. SOLID LAYER 2: MID-GROUND MOUNTAIN RIDGES ── */}
              <path
                d="M -20 340 L 240 140 L 480 280 L 720 110 L 920 260 L 1140 120 L 1460 340 Z"
                fill="url(#expMountMid)"
                stroke={strokeColor}
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              {/* Mid Snow Caps */}
              <polygon points="240,140 215,180 240,170 265,185" fill="#ffffff" opacity="0.9" />
              <polygon points="720,110 685,165 720,150 755,170" fill="#ffffff" opacity="0.9" />
              <polygon points="1140,120 1110,165 1140,155 1170,170" fill="#ffffff" opacity="0.9" />

              {/* ── 5. SOLID LAYER 3: FOREGROUND MOUNTAIN FACETS ── */}
              <path
                d="M -20 340 L 80 180 L 360 340 L 600 170 L 840 340 L 1040 160 L 1320 340 Z"
                fill="url(#expMountNear)"
                stroke={strokeColor}
                strokeWidth="2.2"
                strokeLinejoin="round"
              />

              {/* ── 6. SOLID LAYER 4: ROLLING FOREST FOOTHILLS ── */}
              {/* Left Rolling Forest Hill */}
              <path
                d="M -20 340 Q 180 180 440 250 L 440 340 Z"
                fill="url(#expForestHill)"
                stroke={strokeColor}
                strokeWidth="2.5"
              />
              
              {/* Dense Evergreen Pine Clusters on Left Hill */}
              {[
                { x: 60, y: 220, s: 1 },
                { x: 100, y: 205, s: 1.2 },
                { x: 145, y: 195, s: 1.4 },
                { x: 190, y: 210, s: 1.1 },
                { x: 230, y: 225, s: 1.3 },
                { x: 280, y: 215, s: 1 },
                { x: 330, y: 235, s: 1.2 },
              ].map((p, i) => (
                <g key={i} transform={`translate(${p.x}, ${p.y}) scale(${p.s})`}>
                  {/* Trunk */}
                  <line x1="0" y1="10" x2="0" y2="24" stroke={strokeColor} strokeWidth="2.2" />
                  {/* 3 Tiers of Needles */}
                  <polygon points="0,-18 -12,0 12,0" fill={isDark ? "#064e3b" : "#10b981"} stroke={strokeColor} strokeWidth="1.5" />
                  <polygon points="0,-8 -15,10 15,10" fill={isDark ? "#065f46" : "#059669"} stroke={strokeColor} strokeWidth="1.5" />
                  <polygon points="0,2 -18,20 18,20" fill={isDark ? "#047857" : "#047857"} stroke={strokeColor} strokeWidth="1.5" />
                </g>
              ))}

              {/* Right Hill with Wind Turbines & Studio Villa */}
              <path
                d="M 1000 250 Q 1240 160 1460 340 L 1000 340 Z"
                fill="url(#expForestHill)"
                stroke={strokeColor}
                strokeWidth="2.5"
              />

              {/* Wind Turbine 1 */}
              <g transform="translate(1120, 140)">
                <line x1="20" y1="30" x2="20" y2="120" stroke={strokeColor} strokeWidth="3" />
                <circle cx="20" cy="30" r="5" fill="#ffffff" stroke={strokeColor} strokeWidth="2" />
                <g style={{ animation: "spinTurbine 8s linear infinite", transformOrigin: "20px 30px" }}>
                  <line x1="20" y1="30" x2="20" y2="-8" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="20" y1="30" x2="52" y2="48" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="20" y1="30" x2="-12" y2="48" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
                </g>
              </g>

              {/* Wind Turbine 2 */}
              <g transform="translate(1260, 155)">
                <line x1="16" y1="24" x2="16" y2="100" stroke={strokeColor} strokeWidth="2.5" />
                <circle cx="16" cy="24" r="4" fill="#ffffff" stroke={strokeColor} strokeWidth="1.8" />
                <g style={{ animation: "spinTurbine 6s linear infinite", transformOrigin: "16px 24px" }}>
                  <line x1="16" y1="24" x2="16" y2="-6" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
                  <line x1="16" y1="24" x2="42" y2="39" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
                  <line x1="16" y1="24" x2="-10" y2="39" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
                </g>
              </g>

              {/* Hillside Creative Studio Villa */}
              <g transform="translate(1180, 200)">
                {/* Main Building */}
                <rect x="0" y="16" width="46" height="34" rx="4" fill={isDark ? "#280a1c" : "#ffffff"} stroke={strokeColor} strokeWidth="2.2" />
                {/* Slanted Glass Skylight Roof */}
                <polygon points="-6,16 23,-2 52,16" fill="#e1496d" stroke={strokeColor} strokeWidth="2.2" />
                {/* Glowing Glass Studio Windows */}
                <rect x="8" y="24" width="14" height="16" rx="2" fill="#38bdf8" stroke={strokeColor} strokeWidth="1.5" />
                <rect x="28" y="26" width="10" height="24" rx="1" fill="#831843" />
                {/* Balcony Railing */}
                <line x1="-2" y1="36" x2="48" y2="36" stroke={strokeColor} strokeWidth="1.5" />
              </g>

              {/* ── 7. SOLID LAYER 5: CENTER GLOWING SHIMMER LAKE & RIVER ── */}
              {/* River Stream flowing from Mountains */}
              <path
                d="M 680 180 Q 700 210 660 230 Q 640 240 680 260 L 740 260 Q 720 230 730 210 Q 720 190 710 180 Z"
                fill="url(#expLakeShimmer)"
                stroke={strokeColor}
                strokeWidth="1.8"
              />

              {/* Main Crystal Lake Lagoon (Solid Occluding Oval) */}
              <ellipse cx="720" cy="275" rx="340" ry="38" fill="url(#expLakeShimmer)" stroke={isDark ? "#38bdf8" : "#0284c7"} strokeWidth="2.5" />
              
              {/* Lake Shimmer Reflection Ripple Lines */}
              <ellipse cx="640" cy="275" rx="90" ry="8" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.75" strokeDasharray="8 10" />
              <ellipse cx="800" cy="282" rx="75" ry="7" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.65" strokeDasharray="6 8" />
              <ellipse cx="720" cy="292" rx="120" ry="9" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.55" strokeDasharray="10 12" />

              {/* Sailboat 1: Cruising Dual-Sail Yacht */}
              <g style={{ animation: "windSail 6s ease-in-out infinite" }} transform="translate(730, 220)">
                {/* Reflection under water */}
                <ellipse cx="30" cy="48" rx="26" ry="4" fill="rgba(2,132,199,0.4)" />
                {/* Yacht Hull */}
                <path d="M 0 34 L 60 34 L 50 46 L 12 46 Z" fill="#ffffff" stroke={strokeColor} strokeWidth="2.2" />
                <line x1="32" y1="4" x2="32" y2="34" stroke={strokeColor} strokeWidth="2.8" />
                {/* Main Mainsail */}
                <polygon points="32,6 56,30 32,30" fill="#e1496d" stroke={strokeColor} strokeWidth="1.8" />
                {/* Jib Foresail */}
                <polygon points="30,10 8,30 30,30" fill="#ff8da7" stroke={strokeColor} strokeWidth="1.8" />
                {/* Mast Pennant Flag */}
                <polygon points="32,4 42,8 32,12" fill="#ffd700" />
              </g>

              {/* Sailboat 2: Leisure Catamaran */}
              <g style={{ animation: "windSail 5s ease-in-out infinite 1.5s" }} transform="translate(560, 245)">
                <path d="M 0 20 L 38 20 L 30 28 L 8 28 Z" fill="#ffffff" stroke={strokeColor} strokeWidth="1.8" />
                <line x1="22" y1="3" x2="22" y2="20" stroke={strokeColor} strokeWidth="2" />
                <polygon points="22,4 36,18 22,18" fill="#38bdf8" />
                <polygon points="20,7 6,18 20,18" fill="#fef08a" />
              </g>

              {/* Stone Arched River Bridge */}
              <g transform="translate(640, 245)">
                <path d="M 0 16 Q 30 4 60 16 L 60 22 Q 30 10 0 22 Z" fill="#e2e8f0" stroke={strokeColor} strokeWidth="2" />
                <line x1="12" y1="12" x2="12" y2="18" stroke={strokeColor} strokeWidth="1.5" />
                <line x1="28" y1="8" x2="28" y2="15" stroke={strokeColor} strokeWidth="1.5" />
                <line x1="44" y1="10" x2="44" y2="16" stroke={strokeColor} strokeWidth="1.5" />
              </g>

              {/* ── 8. SOLID LAYER 6: FOREGROUND BLOSSOM MEADOW & ASTRONAUT ── */}
              <path
                d="M -20 340 Q 360 280 720 305 Q 1080 280 1460 340 Z"
                fill="url(#expMeadowGrad)"
                stroke={strokeColor}
                strokeWidth="3"
              />

              {/* Flowering Sakura / Botanical Tree on Left Foreground */}
              <g transform="translate(320, 230)">
                {/* Trunk */}
                <path d="M 20 80 Q 22 45 15 25 Q 30 35 40 20 Q 34 50 35 80 Z" fill={isDark ? "#581232" : "#831843"} />
                {/* Cloud Foliage */}
                <path
                  d="M 5 25 Q -10 10 5 -10 Q 20 -25 45 -10 Q 70 -20 75 5 Q 85 25 65 35 Q 45 45 25 35 Z"
                  fill={isDark ? "rgba(225,73,109,0.35)" : "rgba(251,113,133,0.55)"}
                  stroke="#e1496d"
                  strokeWidth="2.2"
                />
                {/* Blossom Dots */}
                <circle cx="15" cy="-5" r="4" fill="#ffffff" />
                <circle cx="35" cy="-12" r="4.5" fill="#f43f5e" />
                <circle cx="55" cy="5" r="4" fill="#ffffff" />
                <circle cx="28" cy="18" r="4" fill="#f43f5e" />
                <circle cx="62" cy="22" r="3.5" fill="#ffffff" />
              </g>

              {/* Creatify Astronaut Artist at the Studio Easel */}
              <g transform="translate(430, 240)">
                {/* Wooden Easel Tripod */}
                <line x1="16" y1="20" x2="2" y2="78" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
                <line x1="16" y1="20" x2="30" y2="78" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
                <line x1="16" y1="20" x2="16" y2="72" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
                {/* Canvas Artwork */}
                <rect x="-6" y="24" width="38" height="28" rx="3" fill="#ffffff" stroke={strokeColor} strokeWidth="2.2" />
                <circle cx="13" cy="38" r="6" fill="#e1496d" />
                <line x1="-2" y1="44" x2="28" y2="44" stroke="#f59e0b" strokeWidth="1.5" />

                {/* Astronaut Explorer Character */}
                <g transform="translate(48, 14)">
                  {/* Helmet & Head */}
                  <circle cx="20" cy="18" r="13" fill={isDark ? "#240a1b" : "#ffffff"} stroke={strokeColor} strokeWidth="2.4" />
                  <ellipse cx="20" cy="18" rx="9" ry="6" fill="#e1496d" opacity="0.9" />
                  {/* Torso & Suit */}
                  <rect x="8" y="30" width="24" height="26" rx="6" fill={isDark ? "#4a1233" : "#fed7e2"} stroke={strokeColor} strokeWidth="2.4" />
                  <circle cx="15" cy="38" r="2.5" fill="#e1496d" />
                  <circle cx="25" cy="38" r="2.5" fill="#38bdf8" />
                  {/* Legs */}
                  <line x1="14" y1="56" x2="14" y2="70" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
                  <line x1="26" y1="56" x2="26" y2="70" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
                  {/* Arm holding Painter's Palette & Stylus */}
                  <line x1="8" y1="36" x2="-8" y2="30" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
                  <circle cx="-10" cy="29" r="3.5" fill="#ffd700" stroke={strokeColor} strokeWidth="1.5" />
                </g>

                {/* Curious Little Cosmic Bunny Companion */}
                <g transform="translate(92, 48)">
                  <ellipse cx="10" cy="16" rx="7" ry="5" fill="#ffffff" stroke={strokeColor} strokeWidth="1.8" />
                  <circle cx="14" cy="12" r="4" fill="#ffffff" stroke={strokeColor} strokeWidth="1.8" />
                  <line x1="14" y1="8" x2="14" y2="0" stroke={strokeColor} strokeWidth="1.8" strokeLinecap="round" />
                  <line x1="17" y1="9" x2="19" y2="1" stroke={strokeColor} strokeWidth="1.8" strokeLinecap="round" />
                  <circle cx="15" cy="12" r="1" fill="#e1496d" />
                </g>
              </g>

              {/* Wildflower Blooms along the Foreground Line */}
              {[...Array(18)].map((_, w) => {
                const wx = 80 + w * 75;
                const wy = 320 + (w % 3) * 4;
                return (
                  <g key={w}>
                    <line x1={wx} y1={wy} x2={wx} y2={wy + 8} stroke={isDark ? "#10b981" : "#059669"} strokeWidth="1.5" />
                    <circle cx={wx} cy={wy} r="3" fill={w % 3 === 0 ? "#e1496d" : (w % 3 === 1 ? "#ffd700" : "#38bdf8")} stroke="none" />
                  </g>
                );
              })}

              {/* Base Horizon Ground Line */}
              <line x1="0" y1="338" x2="1440" y2="338" stroke={strokeColor} strokeWidth="3" />
            </svg>
          </div>

          {/* Direct CTA (100% Free) */}
          <div style={{ textAlign: "center", marginTop: 56 }}>
            <button
              onClick={() => onNavigate("infinite_studio")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "14px 36px",
                borderRadius: 99,
                background: "linear-gradient(135deg, #e1496d 0%, #b13453 50%, #831843 100%)",
                border: "1px solid rgba(255, 255, 255, 0.45)",
                color: "#ffffff",
                fontFamily: "Syne, sans-serif",
                fontSize: 15,
                fontWeight: 800,
                letterSpacing: "0.02em",
                cursor: "pointer",
                boxShadow: "0 10px 32px rgba(225, 73, 109, 0.55)",
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px) scale(1.03)";
                e.currentTarget.style.boxShadow = "0 16px 45px rgba(225, 73, 109, 0.75)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = "0 10px 32px rgba(225, 73, 109, 0.55)";
              }}
            >
              <Sparkles size={17} />
              <span>Launch Studio Free — No Sign-up Required</span>
              <ArrowRight size={16} />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
