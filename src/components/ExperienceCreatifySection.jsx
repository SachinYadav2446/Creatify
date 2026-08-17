import React, { useState } from "react";
import { Sparkles, Zap, Trophy, ArrowRight, Star, Heart, ChevronLeft, ChevronRight } from "lucide-react";

export default function ExperienceCreatifySection({ onNavigate, user, isDark, THEME }) {
  // Active center card ID: 0: Instant WOW, 1: 10x Creation Velocity, 2: Studio-Grade Fidelity
  const [activeCardId, setActiveCardId] = useState(1);

  const strokeColor = isDark ? "#ff8da7" : "#831843";
  const textPrimary = isDark ? "#ffffff" : "#1a040d";
  const accentRose = "#e1496d";

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
          padding: "30px 24px 60px",
          background: isDark
            ? "linear-gradient(180deg, #280a1c 0%, #220818 35%, #1d0614 70%, #170511 100%)"
            : "linear-gradient(180deg, #60122e 0%, #7d193d 30%, #a2294e 65%, #fce7f3 100%)",
          boxSizing: "border-box",
        }}
      >
        <style>{`
          @keyframes floatingBalloon {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-12px) rotate(2deg); }
          }
          @keyframes childBrushMove {
            0%, 100% { transform: rotate(0deg); }
            50% { transform: rotate(-14deg); }
          }
          @keyframes slideOrbit {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-7px); }
          }
          @keyframes playheadScan {
            0% { transform: translateX(0px); }
            100% { transform: translateX(110px); }
          }
          @keyframes warmSteam {
            0% { transform: translateY(0) scale(1); opacity: 0.7; }
            100% { transform: translateY(-12px) scale(1.3); opacity: 0; }
          }
          @keyframes paperPlaneGlide {
            0% { transform: translate(0, 0) rotate(-2deg); }
            50% { transform: translate(35px, -15px) rotate(4deg); }
            100% { transform: translate(0, 0) rotate(-2deg); }
          }
          @keyframes logicDataPulse {
            0%, 100% { transform: scale(1); opacity: 0.7; }
            50% { transform: scale(1.4); opacity: 1; }
          }
          @keyframes ribbonFlow {
            0% { stroke-dashoffset: 40; }
            100% { stroke-dashoffset: 0; }
          }
          @keyframes cloudDriftSmooth {
            0% { transform: translateX(-5%); }
            100% { transform: translateX(105vw); }
          }
          @keyframes birdFly {
            0% { transform: translate(0, 0); }
            50% { transform: translate(20px, -8px); }
            100% { transform: translate(0, 0); }
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
