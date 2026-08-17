import React, { useState } from "react";
import { Sparkles, Code2, Globe, Droplet, Layers, Cpu, Heart } from "lucide-react";

export default function EcosystemStrip({ isDark }) {
  const [isPaused, setIsPaused] = useState(false);

  const projects = [
    {
      name: "Bright Code",
      category: "Developer Engine & Education",
      desc: "Open-source developer intelligence & learning ecosystem",
      icon: Code2,
      accent: "#38bdf8",
      tag: "FLAGSHIP ECOSYSTEM",
      liveBadge: "Active Hub",
    },
    {
      name: "Demand Sight",
      category: "Market & Demand Analytics",
      desc: "Predictive analytics and high-precision insight engine",
      icon: Globe,
      accent: "#e1496d",
      tag: "FOUNDATION SPONSOR",
      liveBadge: "Core Sponsor",
    },
    {
      name: "AquaDristi",
      category: "Hydrology & AI Vision",
      desc: "AI water body telemetry & multispectral aquatic monitoring",
      icon: Droplet,
      accent: "#06b6d4",
      tag: "IMPACT TECH",
      liveBadge: "Telemetry",
    },
    {
      name: "Numa",
      category: "Next-Gen Spatial Computing",
      desc: "Autonomous workflow intelligence & spatial frameworks",
      icon: Layers,
      accent: "#a855f7",
      tag: "STUDIO ALLIANCE",
      liveBadge: "Spatial OS",
    },
    {
      name: "Jal Dristi",
      category: "Conservation & Smart Grid",
      desc: "Community water resource tracking & conservation networks",
      icon: Cpu,
      accent: "#10b981",
      tag: "SUSTAINABILITY INITIATIVE",
      liveBadge: "IoT Sensor Grid",
    },
  ];

  // Quadruple the array for seamless infinite marquee loop
  const seamlessCards = [...projects, ...projects, ...projects, ...projects];

  const strokeColor = isDark ? "rgba(225, 73, 109, 0.28)" : "rgba(148, 41, 69, 0.2)";
  const bgStrip = isDark
    ? "linear-gradient(180deg, #170511 0%, #15040f 50%, #12030d 100%)"
    : "linear-gradient(180deg, #fce7f3 0%, #fbe4ee 50%, #fae0ea 100%)";
  const cardBg = isDark
    ? "linear-gradient(135deg, rgba(42, 12, 31, 0.78) 0%, rgba(24, 6, 18, 0.92) 100%)"
    : "linear-gradient(135deg, rgba(255, 255, 255, 0.97) 0%, rgba(254, 226, 236, 0.9) 100%)";
  const textPrimary = isDark ? "#ffffff" : "#1a040d";
  const textMuted = isDark ? "rgba(255, 200, 215, 0.65)" : "rgba(96, 18, 46, 0.7)";

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        background: bgStrip,
        borderTop: isDark ? "1px solid rgba(225, 73, 109, 0.22)" : "1px solid rgba(225, 73, 109, 0.18)",
        borderBottom: isDark ? "1px solid rgba(225, 73, 109, 0.2)" : "1px solid rgba(225, 73, 109, 0.15)",
        padding: "38px 0 44px",
        boxSizing: "border-box",
        overflow: "hidden",
        zIndex: 10,
      }}
    >
      <style>{`
        @keyframes marqueeInfinite {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        .marquee-track {
          display: flex;
          gap: 20px;
          width: max-content;
          animation: marqueeInfinite 35s linear infinite;
          will-change: transform;
        }
        .marquee-track.paused {
          animation-play-state: paused;
        }
        .eco-card-hover {
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          flex-shrink: 0;
          width: 300px;
        }
        .eco-card-hover:hover {
          transform: translateY(-4px);
          border-color: rgba(225, 73, 109, 0.6) !important;
          box-shadow: 0 16px 36px rgba(225, 73, 109, 0.28) !important;
        }
      `}</style>

      {/* Top Header Ribbon */}
      <div style={{ maxWidth: 1240, margin: "0 auto 24px", padding: "0 24px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 14,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "4px 12px",
                borderRadius: 99,
                background: isDark ? "rgba(225, 73, 109, 0.18)" : "rgba(225, 73, 109, 0.12)",
                border: `1px solid ${isDark ? "rgba(225, 73, 109, 0.35)" : "rgba(225, 73, 109, 0.25)"}`,
                color: isDark ? "#ff8da7" : "#831843",
                fontSize: 10.5,
                fontWeight: 800,
                fontFamily: "'Poppins', sans-serif",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#22c55e",
                  boxShadow: "0 0 8px #22c55e",
                }}
              />
              <span>LIVE ECOSYSTEM & SPONSORS</span>
            </div>

            <span
              style={{
                fontSize: 12.5,
                fontFamily: "'Instrument Sans', sans-serif",
                color: textMuted,
                fontWeight: 500,
              }}
            >
              Dedicated partners & brother initiatives powering Creatify • Hover to pause
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 11.5,
              fontWeight: 700,
              fontFamily: "'Poppins', sans-serif",
              color: isDark ? "#ff8da7" : "#831843",
            }}
          >
            <Heart size={13} fill={isDark ? "#ff8da7" : "#e1496d"} color="none" />
            <span>Built by Sachin Yadav • Community Powered</span>
          </div>
        </div>
      </div>

      {/* Endless Horizontal Marquee Stream with Edge Mask Gradients */}
      <div
        style={{
          position: "relative",
          width: "100%",
          overflow: "hidden",
        }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Left fade gradient edge */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "80px",
            height: "100%",
            background: isDark
              ? "linear-gradient(90deg, #170511 0%, transparent 100%)"
              : "linear-gradient(90deg, #fce7f3 0%, transparent 100%)",
            pointerEvents: "none",
            zIndex: 3,
          }}
        />

        {/* Right fade gradient edge */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "80px",
            height: "100%",
            background: isDark
              ? "linear-gradient(270deg, #170511 0%, transparent 100%)"
              : "linear-gradient(270deg, #fce7f3 0%, transparent 100%)",
            pointerEvents: "none",
            zIndex: 3,
          }}
        />

        {/* Continuous Looping Track */}
        <div className={`marquee-track ${isPaused ? "paused" : ""}`}>
          {seamlessCards.map((proj, idx) => {
            const Icon = proj.icon;
            return (
              <div
                key={idx}
                className="eco-card-hover"
                style={{
                  background: cardBg,
                  border: `1px solid ${strokeColor}`,
                  borderRadius: 18,
                  padding: "20px 18px",
                  boxShadow: isDark
                    ? "0 10px 30px rgba(0, 0, 0, 0.4)"
                    : "0 8px 24px rgba(96, 18, 46, 0.06)",
                  backdropFilter: "blur(16px)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Glow accent top bar */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "3px",
                    background: `linear-gradient(90deg, ${proj.accent}, transparent)`,
                  }}
                />

                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 14,
                    }}
                  >
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 10,
                        background: isDark
                          ? "rgba(255, 255, 255, 0.05)"
                          : "rgba(255, 255, 255, 0.9)",
                        border: `1px solid ${proj.accent}40`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: proj.accent,
                        boxShadow: `0 4px 14px ${proj.accent}25`,
                      }}
                    >
                      <Icon size={19} />
                    </div>

                    <span
                      style={{
                        fontSize: 9.5,
                        fontWeight: 800,
                        fontFamily: "'Poppins', sans-serif",
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        padding: "3px 8px",
                        borderRadius: 99,
                        background: `${proj.accent}18`,
                        color: proj.accent,
                        border: `1px solid ${proj.accent}35`,
                      }}
                    >
                      {proj.liveBadge}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontFamily: "Syne, sans-serif",
                      fontSize: 16.5,
                      fontWeight: 800,
                      color: textPrimary,
                      margin: "0 0 4px",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {proj.name}
                  </h3>

                  <div
                    style={{
                      fontSize: 10.5,
                      fontWeight: 700,
                      color: proj.accent,
                      fontFamily: "'Poppins', sans-serif",
                      letterSpacing: "0.03em",
                      marginBottom: 8,
                    }}
                  >
                    {proj.category}
                  </div>

                  <p
                    style={{
                      fontSize: 12,
                      color: textMuted,
                      lineHeight: 1.45,
                      fontFamily: "'Instrument Sans', sans-serif",
                      margin: 0,
                    }}
                  >
                    {proj.desc}
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: 18,
                    paddingTop: 12,
                    borderTop: isDark
                      ? "1px solid rgba(255, 255, 255, 0.08)"
                      : "1px solid rgba(225, 73, 109, 0.12)",
                  }}
                >
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 800,
                      fontFamily: "'Poppins', sans-serif",
                      color: textMuted,
                      letterSpacing: "0.07em",
                    }}
                  >
                    {proj.tag}
                  </span>
                  <div style={{ color: proj.accent, opacity: 0.85 }}>
                    <Sparkles size={12} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
